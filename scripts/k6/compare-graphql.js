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
const SELECTION_COUNT = Math.min(
  3,
  Math.max(1, Number(__ENV.SELECTION_COUNT || 3))
);
const DEBUG_ERRORS =
  String(__ENV.DEBUG_ERRORS || 'false').toLowerCase() === 'true';

const compareBatchDuration = new Trend('compare_batch_duration');
const compareGraphqlErrors = new Rate('compare_graphql_errors');

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

function getSelection(index) {
  const country = String(
    __ENV[`COUNTRY_${index}`] || ['GT', 'HN', 'SV'][index - 1] || 'GT'
  ).toUpperCase();
  const year = Number(__ENV[`YEAR_${index}`] || 2024);
  const startMonth = Number(__ENV[`START_MONTH_${index}`] || 1);
  const endMonth = Number(__ENV[`END_MONTH_${index}`] || 12);

  return {
    country,
    start: `${year}-${pad(startMonth)}-01`,
    end: nextMonthStart(year, endMonth),
  };
}

function buildSelectionsLiteral(selections = []) {
  return `[${selections
    .map(
      (selection) =>
        `{ country: "${escapeGraphqlString(selection.country)}", start: "${escapeGraphqlString(
          selection.start
        )}", end: "${escapeGraphqlString(selection.end)}" }`
    )
    .join(', ')}]`;
}

function buildCompareQuery(selections) {
  return `
    query {
      compareCountryStats(selections: ${buildSelectionsLiteral(selections)}) {
        selections {
          country
          start
          end
          totalCant
          updatedAtStr
          filesUrl {
            name
            url
          }
          genderTotals
          travelConditionTotals
          ageGroupTotals
          returnRouteTotals
          returnCountryTotals
          returnCountryMaps
          depTotals
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
    compare_batch_duration: ['p(95)<5000'],
    compare_graphql_errors: ['rate<0.01'],
    'compare_graphql_errors{operation:compare_country_stats}': ['rate<0.01'],
  },
};

export default function () {
  const headers = buildHeaders();
  const selections = Array.from({ length: SELECTION_COUNT }, (_, idx) =>
    getSelection(idx + 1)
  );

  const request = {
    method: 'POST',
    url: GRAPHQL_URL,
    body: JSON.stringify({
      query: buildCompareQuery(selections),
    }),
    params: {
      headers,
      tags: {
        name: 'compare_country_stats',
        selections: String(SELECTION_COUNT),
      },
    },
  };

  const startedAt = Date.now();
  const response = http.post(request.url, request.body, request.params);
  compareBatchDuration.add(Date.now() - startedAt);

  let body = null;
  try {
    body = response.json();
  } catch (_) {
    body = null;
  }

  const hasErrors = Array.isArray(body?.errors) && body.errors.length > 0;
  compareGraphqlErrors.add(hasErrors ? 1 : 0, {
    operation: 'compare_country_stats',
  });

  check(response, {
    'compare_country_stats responde 200': (r) => r.status === 200,
    'compare_country_stats sin errores graphql': () => !hasErrors,
  });

  if (DEBUG_ERRORS && hasErrors) {
    const messages = body.errors
      .map((error) => error?.message)
      .filter(Boolean)
      .slice(0, 2)
      .join(' | ');

    console.error(
      `[compare-graphql-error] ${messages || 'Error GraphQL sin mensaje'}`
    );
  }

  sleep(THINK_TIME);
}
