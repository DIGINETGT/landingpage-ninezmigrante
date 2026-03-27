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
const START_MONTH = Number(__ENV.START_MONTH || 1);
const END_MONTH = Number(__ENV.END_MONTH || 12);
const INCLUDE_MODAL =
  String(__ENV.INCLUDE_MODAL || 'false').toLowerCase() === 'true';
const ONLY_HEAD =
  String(__ENV.ONLY_HEAD || 'false').toLowerCase() === 'true';
const ONLY_DEMOGRAPHICS =
  String(__ENV.ONLY_DEMOGRAPHICS || 'false').toLowerCase() === 'true';
const ONLY_RETURNS =
  String(__ENV.ONLY_RETURNS || 'false').toLowerCase() === 'true';
const ONLY_SUMMARY =
  String(__ENV.ONLY_SUMMARY || 'false').toLowerCase() === 'true';
const ONLY_DEPARTMENTS =
  String(__ENV.ONLY_DEPARTMENTS || 'false').toLowerCase() === 'true';
const DEPARTMENT_LABEL = String(__ENV.DEPARTMENT_LABEL || 'Guatemala');
const DEBUG_ERRORS =
  String(__ENV.DEBUG_ERRORS || 'false').toLowerCase() === 'true';

const countryBatchDuration = new Trend('country_batch_duration');
const countryGraphqlErrors = new Rate('country_graphql_errors');

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

function buildCountryFilter(country, startMonth, endMonth, year, field = 'reportMonth') {
  const start = `${year}-${pad(startMonth)}-01`;
  const end = nextMonthStart(year, endMonth);

  return `
    pagination: { page: 1, pageSize: 12 },
    filters: {
      ${field}: {
        gte: "${start}",
        lt: "${end}"
      },
      users_permissions_user: {
        organization: {
          department: {
            country: { isoCode: { eq: "${country}" } }
          }
        }
      }
    }
  `;
}

function escapeGraphqlString(value = '') {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
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

function buildCountryHeadQuery() {
  return `
    query {
      monthlyReports(${buildCountryFilter(COUNTRY, START_MONTH, END_MONTH, YEAR)}) {
        data {
          id
          attributes {
            reportMonth
            updatedAt
            returned {
              data {
                id
                attributes {
                  total
                fuentes(pagination: { limit: -1 }) {
                  data { attributes { url } }
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

function buildCountryDemographicQuery() {
  return `
    query {
      monthlyReports(${buildCountryFilter(COUNTRY, START_MONTH, END_MONTH, YEAR)}) {
        data {
          id
          attributes {
            returned {
              data {
                id
                attributes {
                  gender_contributions(pagination: { limit: -1 }) {
                    data {
                      attributes {
                        cant
                        gender { data { attributes { name } } }
                      }
                    }
                  }
                  travel_condition_contributions(pagination: { limit: -1 }) {
                    data {
                      attributes {
                        cant
                        travel_condition { data { attributes { name } } }
                      }
                    }
                  }
                  age_group_contributions(pagination: { limit: -1 }) {
                    data {
                      attributes {
                        cant
                        age_group { data { attributes { name } } }
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

function buildCountryReturnQuery() {
  return `
    query {
      monthlyReports(${buildCountryFilter(COUNTRY, START_MONTH, END_MONTH, YEAR)}) {
        data {
          id
          attributes {
            returned {
              data {
                id
                attributes {
                  return_route_contributions(pagination: { limit: -1 }) {
                    data {
                      attributes {
                        cant
                        return_route { data { attributes { name } } }
                      }
                    }
                  }
                  country_contributions(pagination: { limit: -1 }) {
                    data {
                      attributes {
                        cant
                        country {
                          data {
                            attributes {
                              name
                              map { data { attributes { url } } }
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
}

function buildCountryDepartmentsQuery() {
  return `
    query {
      monthlyReports(${buildCountryFilter(COUNTRY, START_MONTH, END_MONTH, YEAR)}) {
        data {
          id
          attributes {
            updatedAt
            returned {
              data {
                attributes {
                  department_contributions(pagination: { limit: -1 }) {
                    data {
                      attributes {
                        cant
                        department { data { attributes { name } } }
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

function buildDepartmentModalQuery() {
  const department = escapeGraphqlString(DEPARTMENT_LABEL);

  return `
    query {
      monthlyReports(${buildCountryFilter(COUNTRY, START_MONTH, END_MONTH, YEAR)}) {
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
    country_batch_duration: ['p(95)<5000'],
    country_graphql_errors: ['rate<0.01'],
    'country_graphql_errors{operation:country_head}': ['rate<0.01'],
    'country_graphql_errors{operation:country_demographics}': ['rate<0.01'],
    'country_graphql_errors{operation:country_returns}': ['rate<0.01'],
    'country_graphql_errors{operation:country_departments}': ['rate<0.01'],
    'country_graphql_errors{operation:country_department_modal}': ['rate<0.01'],
  },
};

export default function () {
  const exclusiveFlags = [
    ONLY_HEAD,
    ONLY_DEMOGRAPHICS,
    ONLY_RETURNS,
    ONLY_SUMMARY,
    ONLY_DEPARTMENTS,
  ].filter(Boolean).length;

  if (exclusiveFlags > 1) {
    throw new Error(
      'Usa solo una bandera exclusiva a la vez: ONLY_HEAD, ONLY_DEMOGRAPHICS, ONLY_RETURNS, ONLY_SUMMARY u ONLY_DEPARTMENTS.'
    );
  }

  const headers = buildHeaders();
  const requests = {};

  if (ONLY_HEAD || ONLY_SUMMARY || exclusiveFlags === 0) {
    requests.country_head = {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({
        query: buildCountryHeadQuery(),
      }),
      params: {
        headers,
        tags: {
          name: 'country_head',
          country: COUNTRY,
        },
      },
    };
  }

  if (ONLY_DEMOGRAPHICS || ONLY_SUMMARY || exclusiveFlags === 0) {
    requests.country_demographics = {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({
        query: buildCountryDemographicQuery(),
      }),
      params: {
        headers,
        tags: {
          name: 'country_demographics',
          country: COUNTRY,
        },
      },
    };
  }

  if (ONLY_RETURNS || ONLY_SUMMARY || exclusiveFlags === 0) {
    requests.country_returns = {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({
        query: buildCountryReturnQuery(),
      }),
      params: {
        headers,
        tags: {
          name: 'country_returns',
          country: COUNTRY,
        },
      },
    };
  }

  if (ONLY_DEPARTMENTS || exclusiveFlags === 0) {
    requests.country_departments = {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({
        query: buildCountryDepartmentsQuery(),
      }),
      params: {
        headers,
        tags: {
          name: 'country_departments',
          country: COUNTRY,
        },
      },
    };
  }

  if (INCLUDE_MODAL && exclusiveFlags === 0) {
    requests.country_department_modal = {
      method: 'POST',
      url: GRAPHQL_URL,
      body: JSON.stringify({
        query: buildDepartmentModalQuery(),
      }),
      params: {
        headers,
        tags: {
          name: 'country_department_modal',
          country: COUNTRY,
          department: DEPARTMENT_LABEL,
        },
      },
    };
  }

  const startedAt = Date.now();
  const responses = http.batch(requests);
  countryBatchDuration.add(Date.now() - startedAt);

  for (const [name, response] of Object.entries(responses)) {
    let body = null;
    try {
      body = response.json();
    } catch (_) {
      body = null;
    }

    const hasErrors = Array.isArray(body?.errors) && body.errors.length > 0;
    countryGraphqlErrors.add(hasErrors ? 1 : 0, { operation: name });

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
        `[country-graphql-error] ${name}: ${messages || 'Error GraphQL sin mensaje'}`
      );
    }
  }

  sleep(THINK_TIME);
}
