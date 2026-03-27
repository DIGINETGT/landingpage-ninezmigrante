import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const DEFAULT_GRAPHQL_URL = 'https://api.ninezmigrante.org/graphql';
const DEFAULT_STAGES = [
  { duration: '30s', target: 5 },
  { duration: '1m', target: 20 },
  { duration: '30s', target: 0 },
];

const GRAPHQL_URL = String(__ENV.GRAPHQL_URL || DEFAULT_GRAPHQL_URL);
const GRAPHQL_TOKEN = String(__ENV.GRAPHQL_TOKEN || '');
const THINK_TIME = Number(__ENV.THINK_TIME || 1);
const COUNTRY = String(__ENV.COUNTRY || 'GT').toUpperCase();
const YEAR = Number(__ENV.YEAR || new Date().getFullYear());
const TRENDS_PERIOD = String(__ENV.TRENDS_PERIOD || '2');
const TRENDS_GRAPH = String(__ENV.TRENDS_GRAPH || 'gender');
const INCLUDE_TRENDS =
  String(__ENV.INCLUDE_TRENDS || 'true').toLowerCase() === 'true';
const INCLUDE_DEPARTMENT_COMPARE =
  String(__ENV.INCLUDE_DEPARTMENT_COMPARE || 'true').toLowerCase() === 'true';
const INCLUDE_TOP_DEPARTMENTS =
  String(__ENV.INCLUDE_TOP_DEPARTMENTS || 'true').toLowerCase() === 'true';
const DEPARTMENT_LABELS = String(
  __ENV.DEPARTMENT_LABELS || 'Guatemala,Quetzaltenango,Escuintla'
)
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)
  .slice(0, 3);
const START_MONTH = Number(__ENV.START_MONTH || 1);
const END_MONTH = Number(__ENV.END_MONTH || 12);
const DEBUG_ERRORS =
  String(__ENV.DEBUG_ERRORS || 'false').toLowerCase() === 'true';

const customizeBatchDuration = new Trend('customize_batch_duration');
const customizeGraphqlErrors = new Rate('customize_graphql_errors');

function pad(value) {
  return String(value).padStart(2, '0');
}

function nextMonthStart(year, month) {
  const numericMonth = Number(month);
  const numericYear = Number(year);
  const nextMonth = numericMonth === 12 ? 1 : numericMonth + 1;
  const nextYear = numericMonth === 12 ? numericYear + 1 : numericYear;
  return `${nextYear}-${pad(nextMonth)}-01`;
}

function buildDateRange(year, startMonth, endMonth) {
  return {
    start: `${year}-${pad(startMonth)}-01`,
    end: nextMonthStart(year, endMonth),
  };
}

function parseStages(rawStages) {
  if (!rawStages) return DEFAULT_STAGES;

  return rawStages
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [duration, target] = entry.split(':').map((value) => value.trim());
      return { duration, target: Number(target) };
    })
    .filter((stage) => stage.duration && Number.isFinite(stage.target));
}

function buildHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
  };

  if (GRAPHQL_TOKEN) {
    headers.Authorization = `Bearer ${GRAPHQL_TOKEN}`;
  }

  return headers;
}

function escapeGraphqlString(value = '') {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildDepartmentCardQuery(departmentLabel) {
  const escapedLabel = escapeGraphqlString(departmentLabel);
  const { start, end } = buildDateRange(YEAR, START_MONTH, END_MONTH);

  return `
    query {
      departmentCardStats(
        country: "${COUNTRY}"
        start: "${start}"
        end: "${end}"
        department: "${escapedLabel}"
      ) {
        total
        male
        female
      }
    }
  `;
}

function buildTopDepartmentsQuery() {
  const { start, end } = buildDateRange(YEAR, START_MONTH, END_MONTH);

  return `
    query {
      topDepartmentsStats(
        country: "${COUNTRY}"
        start: "${start}"
        end: "${end}"
      ) {
        depTotals
      }
    }
  `;
}

function getTrendBuckets(periodKey, currentYear) {
  const currentMonth = new Date().getMonth() + 1;
  const buckets = [];

  if (periodKey === '0') {
    for (let month = 1; month <= currentMonth; month += 1) {
      const { start, end } = buildDateRange(currentYear, month, month);
      buckets.push({
        start,
        end,
        label: `${month}-${currentYear}`,
      });
    }
  }

  if (periodKey === '1') {
    if (currentMonth >= 4) {
      for (let month = currentMonth - 3; month <= currentMonth; month += 1) {
        const { start, end } = buildDateRange(currentYear, month, month);
        buckets.push({
          start,
          end,
          label: `${month}-${currentYear}`,
        });
      }
    } else {
      const previousYearMonths = 4 - currentMonth;
      const previousYearStartMonth = 12 - previousYearMonths + 1;

      for (let month = previousYearStartMonth; month <= 12; month += 1) {
        const { start, end } = buildDateRange(currentYear - 1, month, month);
        buckets.push({
          start,
          end,
          label: `${month}-${currentYear - 1}`,
        });
      }

      for (let month = 1; month <= currentMonth; month += 1) {
        const { start, end } = buildDateRange(currentYear, month, month);
        buckets.push({
          start,
          end,
          label: `${month}-${currentYear}`,
        });
      }
    }
  }

  if (periodKey === '2') {
    for (let offset = 0; offset < 3; offset += 1) {
      const year = currentYear - offset;
      buckets.push({
        start: `${year}-01-01`,
        end: `${year + 1}-01-01`,
        label: `${year}`,
      });
    }
  }

  return buckets;
}

function buildBucketsLiteral(buckets = []) {
  return `[${buckets
    .map(
      (bucket) =>
        `{ start: "${escapeGraphqlString(bucket.start)}", end: "${escapeGraphqlString(
          bucket.end
        )}", label: "${escapeGraphqlString(bucket.label)}" }`
    )
    .join(', ')}]`;
}

function buildTrendsQuery() {
  const buckets = getTrendBuckets(TRENDS_PERIOD, YEAR);

  return `
    query {
      trendsStats(
        country: "${COUNTRY}"
        mode: "${escapeGraphqlString(TRENDS_GRAPH)}"
        buckets: ${buildBucketsLiteral(buckets)}
      ) {
        labels
        series {
          label
          data
        }
      }
    }
  `;
}

export const options = {
  stages: parseStages(__ENV.STAGES),
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<4000', 'p(99)<7000'],
    customize_batch_duration: ['p(95)<5000'],
    customize_graphql_errors: ['rate<0.01'],
    'customize_graphql_errors{operation:customize_trends}': ['rate<0.01'],
    'customize_graphql_errors{operation:customize_top_departments}': ['rate<0.01'],
    'customize_graphql_errors{operation:customize_department_card_1}': ['rate<0.01'],
    'customize_graphql_errors{operation:customize_department_card_2}': ['rate<0.01'],
    'customize_graphql_errors{operation:customize_department_card_3}': ['rate<0.01'],
  },
};

export default function () {
  const headers = buildHeaders();
  const requests = {};

  if (INCLUDE_TRENDS) {
    requests.customize_trends = {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({
        query: buildTrendsQuery(),
      }),
      params: {
        headers,
        tags: {
          name: 'customize_trends',
          country: COUNTRY,
          graph_type: TRENDS_GRAPH,
          period: TRENDS_PERIOD,
        },
      },
    };
  }

  if (INCLUDE_TOP_DEPARTMENTS) {
    requests.customize_top_departments = {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({
        query: buildTopDepartmentsQuery(),
      }),
      params: {
        headers,
        tags: {
          name: 'customize_top_departments',
          country: COUNTRY,
        },
      },
    };
  }

  if (INCLUDE_DEPARTMENT_COMPARE) {
    DEPARTMENT_LABELS.forEach((departmentLabel, index) => {
      requests[`customize_department_card_${index + 1}`] = {
        method: 'POST',
        url: GRAPHQL_URL,
        body: JSON.stringify({
          query: buildDepartmentCardQuery(departmentLabel),
        }),
        params: {
          headers,
          tags: {
            name: `customize_department_card_${index + 1}`,
            country: COUNTRY,
            department: departmentLabel,
          },
        },
      };
    });
  }

  const startedAt = Date.now();
  const responses = http.batch(requests);
  customizeBatchDuration.add(Date.now() - startedAt);

  for (const [name, response] of Object.entries(responses)) {
    let body = null;
    try {
      body = response.json();
    } catch (_) {
      body = null;
    }

    const hasErrors = Array.isArray(body?.errors) && body.errors.length > 0;
    const operationName = response.request?.tags?.name || name;
    customizeGraphqlErrors.add(hasErrors ? 1 : 0, { operation: operationName });

    check(response, {
      [`${name} responde 200`]: (r) => r.status === 200,
      [`${name} sin errores graphql`]: () => !hasErrors,
    });

    if (DEBUG_ERRORS && hasErrors) {
      const messages = body.errors
        .map((error) => error?.message)
        .filter(Boolean)
        .slice(0, 2)
        .join(' | ');

      console.error(
        `[customize-graphql-error] ${name}: ${messages || 'Error GraphQL sin mensaje'}`
      );
    }
  }

  sleep(THINK_TIME);
}
