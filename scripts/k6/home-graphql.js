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
const YEAR = Number(__ENV.YEAR || new Date().getFullYear());
const START_MONTH = Number(__ENV.START_MONTH || 1);
const END_MONTH = Number(__ENV.END_MONTH || 12);
const HOME_COUNTRY = String(__ENV.HOME_COUNTRY || 'GT').toUpperCase();
const DEBUG_ERRORS =
  String(__ENV.DEBUG_ERRORS || 'false').toLowerCase() === 'true';
const ISOS = String(__ENV.ISOS || 'GT,HN,SV')
  .split(',')
  .map((value) => value.trim().toUpperCase())
  .filter(Boolean);

const graphqlErrors = new Rate('graphql_errors');
const graphqlBatchDuration = new Trend('graphql_batch_duration');

const REPORTS_BY_TOTAL_REGION = `
  query ReportsByTotalRegion($isos: [String!]!, $start: Date!, $end: Date!) {
    monthlyReports(
      filters: {
        reportMonth: { gte: $start, lt: $end }
        users_permissions_user: {
          organization: { department: { country: { isoCode: { in: $isos } } } }
        }
      }
      sort: ["reportMonth:asc"]
      pagination: { page: 1, pageSize: 500 }
    ) {
      data {
        attributes {
          returned {
            data {
              attributes {
                total
              }
            }
          }
          users_permissions_user {
            data {
              attributes {
                organization {
                  data {
                    attributes {
                      department {
                        data {
                          attributes {
                            country {
                              data {
                                attributes {
                                  isoCode
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
            }
          }
        }
      }
    }
  }
`;

const REPORTS_BY_GENDER_REGION = `
  query ReportsByGenderRegion($isos: [String!]!, $start: Date!, $end: Date!) {
    monthlyReports(
      filters: {
        reportMonth: { gte: $start, lt: $end }
        users_permissions_user: {
          organization: { department: { country: { isoCode: { in: $isos } } } }
        }
      }
      sort: ["reportMonth:asc"]
      pagination: { page: 1, pageSize: 500 }
    ) {
      data {
        id
        attributes {
          reportMonth
          returned {
            data {
              id
              attributes {
                total
                gender_contributions(pagination: { page: 1, pageSize: 9999 }) {
                  data {
                    attributes {
                      cant
                      gender {
                        data {
                          attributes {
                            name
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
      }
    }
  }
`;

const REPORTS_BY_TRAVEL_COND_REGION = `
  query ReportsByTravelCondRegion($isos: [String!]!, $start: Date!, $end: Date!) {
    monthlyReports(
      filters: {
        reportMonth: { gte: $start, lt: $end }
        users_permissions_user: {
          organization: { department: { country: { isoCode: { in: $isos } } } }
        }
      }
      sort: ["reportMonth:asc"]
      pagination: { page: 1, pageSize: 500 }
    ) {
      data {
        attributes {
          reportMonth
          returned {
            data {
              attributes {
                total
                travel_condition_contributions(
                  pagination: { page: 1, pageSize: 9999 }
                ) {
                  data {
                    attributes {
                      cant
                      travel_condition {
                        data {
                          attributes {
                            name
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
      }
    }
  }
`;

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

function buildTransitQuery(year, startMonth, endMonth) {
  const { start, end } = buildDateRange(year, startMonth, endMonth);

  return `
    query {
      transitReports(
        pagination: { page: 1, pageSize: 12 },
        filters: {
          reportDate: {
            gte: "${start}",
            lt: "${end}"
          }
        }
      ) {
        data {
          id
          attributes {
            reportDate
            gender_contributions(pagination: { limit: -1 }) {
              data {
                attributes {
                  cant
                }
              }
            }
          }
        }
      }
    }
  `;
}

function buildDetainedBordersQuery(year, startMonth, endMonth) {
  const { start, end } = buildDateRange(year, startMonth, endMonth);

  return `
    query {
      detainedInBordersReports(
        pagination: { page: 1, pageSize: 12 },
        filters: {
          reportDate: {
            gte: "${start}",
            lt: "${end}"
          }
        }
      ) {
        data {
          id
          attributes {
            reportDate
            country {
              data {
                attributes {
                  name
                }
              }
            }
            detained_in_borders {
              data {
                attributes {
                  total
                }
              }
            }
            detained_us_borders {
              data {
                attributes {
                  total
                }
              }
            }
          }
        }
      }
    }
  `;
}

function parseStages(rawStages) {
  if (!rawStages) return DEFAULT_STAGES;

  return rawStages
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [duration, target] = entry.split(':').map((value) => value.trim());
      return {
        duration,
        target: Number(target),
      };
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

export const options = {
  stages: parseStages(__ENV.STAGES),
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<3000', 'p(99)<6000'],
    graphql_errors: ['rate<0.01'],
    'graphql_errors{operation:home_total_region}': ['rate<0.01'],
    'graphql_errors{operation:home_gender_region}': ['rate<0.01'],
    'graphql_errors{operation:home_travel_region}': ['rate<0.01'],
    'graphql_errors{operation:home_borders_gt}': ['rate<0.01'],
    'graphql_errors{operation:home_transit_gt}': ['rate<0.01'],
    graphql_batch_duration: ['p(95)<4000'],
  },
};

export default function () {
  const { start, end } = buildDateRange(YEAR, START_MONTH, END_MONTH);
  const headers = buildHeaders();

  const requests = {
    home_total_region: {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({
        operationName: 'ReportsByTotalRegion',
        query: REPORTS_BY_TOTAL_REGION,
        variables: { isos: ISOS, start, end },
      }),
      params: { headers, tags: { name: 'home_total_region' } },
    },
    home_gender_region: {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({
        operationName: 'ReportsByGenderRegion',
        query: REPORTS_BY_GENDER_REGION,
        variables: { isos: ISOS, start, end },
      }),
      params: { headers, tags: { name: 'home_gender_region' } },
    },
    home_travel_region: {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({
        operationName: 'ReportsByTravelCondRegion',
        query: REPORTS_BY_TRAVEL_COND_REGION,
        variables: { isos: ISOS, start, end },
      }),
      params: { headers, tags: { name: 'home_travel_region' } },
    },
    home_borders_gt: {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({
        query: buildDetainedBordersQuery(YEAR, START_MONTH, END_MONTH),
      }),
      params: { headers, tags: { name: 'home_borders_gt', country: HOME_COUNTRY } },
    },
    home_transit_gt: {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({
        query: buildTransitQuery(YEAR, START_MONTH, END_MONTH),
      }),
      params: { headers, tags: { name: 'home_transit_gt', country: HOME_COUNTRY } },
    },
  };

  const startedAt = Date.now();
  const responses = http.batch(requests);
  graphqlBatchDuration.add(Date.now() - startedAt);

  for (const [name, response] of Object.entries(responses)) {
    let body = null;
    try {
      body = response.json();
    } catch (_) {
      body = null;
    }

    const hasErrors = Array.isArray(body?.errors) && body.errors.length > 0;

    graphqlErrors.add(hasErrors ? 1 : 0, { operation: name });

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
        `[graphql-error] ${name}: ${messages || 'Error GraphQL sin mensaje'}`
      );
    }
  }

  sleep(THINK_TIME);
}
