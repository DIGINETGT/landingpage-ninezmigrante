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
const INCLUDE_MODAL =
  String(__ENV.INCLUDE_MODAL || 'false').toLowerCase() === 'true';
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
  return {
    key: `selection_${index}`,
    country: String(
      __ENV[`COUNTRY_${index}`] || ['GT', 'HN', 'SV'][index - 1] || 'GT'
    ).toUpperCase(),
    year: Number(__ENV[`YEAR_${index}`] || 2024),
    startMonth: Number(__ENV[`START_MONTH_${index}`] || 1),
    endMonth: Number(__ENV[`END_MONTH_${index}`] || 12),
    departmentLabel: String(
      __ENV[`DEPARTMENT_LABEL_${index}`] || 'Guatemala'
    ),
  };
}

function buildDateRange(year, startMonth, endMonth) {
  return {
    start: `${year}-${pad(startMonth)}-01`,
    end: nextMonthStart(year, endMonth),
  };
}

function buildResolverArgs(selection) {
  const { start, end } = buildDateRange(
    selection.year,
    selection.startMonth,
    selection.endMonth
  );

  return `country: "${selection.country}", start: "${start}", end: "${end}"`;
}

function buildHeadQuery(selection) {
  return `
    query {
      countryHeadStats(${buildResolverArgs(selection)}) {
        totalCant
        filesUrl {
          name
          url
        }
        updatedAtStr
      }
    }
  `;
}

function buildDemographicsQuery(selection) {
  return `
    query {
      countryDemographicStats(${buildResolverArgs(selection)}) {
        genderTotals
        travelConditionTotals
        ageGroupTotals
      }
    }
  `;
}

function buildReturnsQuery(selection) {
  return `
    query {
      countryReturnStats(${buildResolverArgs(selection)}) {
        returnRouteTotals
        returnCountryTotals
        returnCountryMaps
      }
    }
  `;
}

function buildDepartmentsQuery(selection) {
  return `
    query {
      countryDepartmentStats(${buildResolverArgs(selection)}) {
        depTotals
      }
    }
  `;
}

function buildDepartmentModalQuery(selection) {
  const department = escapeGraphqlString(selection.departmentLabel);
  const { start, end } = buildDateRange(
    selection.year,
    selection.startMonth,
    selection.endMonth
  );

  return `
    query {
      monthlyReports(
        pagination: { page: 1, pageSize: 12 },
        filters: {
          reportMonth: {
            gte: "${start}",
            lt: "${end}"
          },
          users_permissions_user: {
            organization: {
              department: {
                country: { isoCode: { eq: "${selection.country}" } }
              }
            }
          }
        }
      ) {
        data {
          attributes {
            reportMonth
            returned {
              data {
                attributes {
                  department_contributions(
                    filters: { department: { name: { eq: "${department}" } } }
                    pagination: { limit: -1 }
                  ) {
                    data {
                      attributes {
                        cant
                        department { data { attributes { name } } }
                      }
                    }
                  }
                  municipality_contributions(
                    filters: {
                      municipality: {
                        department: { name: { eq: "${department}" } }
                      }
                    }
                    pagination: { limit: -1 }
                  ) {
                    data {
                      attributes {
                        cant
                        gender { data { attributes { name } } }
                        municipality { data { attributes { name } } }
                      }
                    }
                  }
                }
              }
            }
          }
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
    'compare_graphql_errors{operation:compare_head}': ['rate<0.01'],
    'compare_graphql_errors{operation:compare_demographics}': ['rate<0.01'],
    'compare_graphql_errors{operation:compare_returns}': ['rate<0.01'],
    'compare_graphql_errors{operation:compare_departments}': ['rate<0.01'],
    'compare_graphql_errors{operation:compare_department_modal}': ['rate<0.01'],
  },
};

export default function () {
  const headers = buildHeaders();
  const selections = Array.from({ length: SELECTION_COUNT }, (_, idx) =>
    getSelection(idx + 1)
  );
  const headRequests = {};
  const detailRequests = {};
  const departmentRequests = {};
  const modalRequests = {};

  selections.forEach((selection, index) => {
    const selectionId = index + 1;

    headRequests[`compare_head_${selectionId}`] = {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({ query: buildHeadQuery(selection) }),
      params: {
        headers,
        tags: {
          name: 'compare_head',
          selection: String(selectionId),
          country: selection.country,
        },
      },
    };

    detailRequests[`compare_demographics_${selectionId}`] = {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({ query: buildDemographicsQuery(selection) }),
      params: {
        headers,
        tags: {
          name: 'compare_demographics',
          selection: String(selectionId),
          country: selection.country,
        },
      },
    };

    detailRequests[`compare_returns_${selectionId}`] = {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({ query: buildReturnsQuery(selection) }),
      params: {
        headers,
        tags: {
          name: 'compare_returns',
          selection: String(selectionId),
          country: selection.country,
        },
      },
    };

    departmentRequests[`compare_departments_${selectionId}`] = {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({ query: buildDepartmentsQuery(selection) }),
      params: {
        headers,
        tags: {
          name: 'compare_departments',
          selection: String(selectionId),
          country: selection.country,
        },
      },
    };

    if (INCLUDE_MODAL) {
      modalRequests[`compare_department_modal_${selectionId}`] = {
        method: 'POST',
        url: GRAPHQL_URL,
        body: JSON.stringify({ query: buildDepartmentModalQuery(selection) }),
        params: {
          headers,
          tags: {
            name: 'compare_department_modal',
            selection: String(selectionId),
            country: selection.country,
            department: selection.departmentLabel,
          },
        },
      };
    }
  });

  const startedAt = Date.now();
  const responses = {
    ...http.batch(headRequests),
    ...http.batch(detailRequests),
    ...http.batch(departmentRequests),
    ...(INCLUDE_MODAL ? http.batch(modalRequests) : {}),
  };
  compareBatchDuration.add(Date.now() - startedAt);

  for (const [name, response] of Object.entries(responses)) {
    let body = null;
    try {
      body = response.json();
    } catch (_) {
      body = null;
    }

    const hasErrors = Array.isArray(body?.errors) && body.errors.length > 0;
    const operationName = response.request?.tags?.name || name;
    compareGraphqlErrors.add(hasErrors ? 1 : 0, { operation: operationName });

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
        `[compare-graphql-error] ${name}: ${messages || 'Error GraphQL sin mensaje'}`
      );
    }
  }

  sleep(THINK_TIME);
}
