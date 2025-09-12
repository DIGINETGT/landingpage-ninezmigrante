import { gql } from '@apollo/client';
import { getFilterByCountry, getFilterByPeriod } from './filters';

import { year as currentYear } from '../year';

// Para todos los países
export const GET_RETURNEDS_BY_GENDER_REGION = gql`
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

// Para un país
export const GET_RETURNEDS_BY_GENDER_COUNTRY = gql`
  query ReportsByGenderCountry($iso: String!, $start: Date!, $end: Date!) {
    monthlyReports(
      filters: {
        reportMonth: { gte: $start, lt: $end }
        users_permissions_user: {
          organization: { department: { country: { isoCode: { eq: $iso } } } }
        }
      }
      sort: ["reportMonth:asc"]
      pagination: { page: 1, pageSize: 200 }
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

export const GET_RETURNEDS_BY_GENDER = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    monthlyReports(${getFilterByCountry(country, period, year)}) {
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
                gender_contributions(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      cant
                      gender { data { attributes { name } } }
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

export const GET_RETURNEDS_BY_TRAVEL_CONDITION_REGION = gql`
  query ReportsByTravelCondRegion(
    $isos: [String!]!
    $start: Date!
    $end: Date!
  ) {
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

export const GET_RETURNEDS_BY_TRAVEL_CONDITION = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    monthlyReports(${getFilterByCountry(country, period, year)}) {
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
                travel_condition_contributions(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      cant
                      travel_condition { data { attributes { name } } }
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_TOTAL = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
query {
  monthlyReports(${getFilterByCountry(country, period, year)}) {
    data {
      attributes {
        reportMonth
        updatedAt
        returned {
          data {
            attributes {
              total
              fuentes(pagination: { limit: -1 }) {
                data {
                  attributes {
                    url
                  }
                }
              }
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
    }
  }
}
`;

export const GET_RETURNEDS_BY_COUNTRY = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    monthlyReports(${getFilterByCountry(country, period, year)}) {
      data {
        attributes {
          reportMonth
          updatedAt
          returned {
            data {
              attributes {
                total

                fuentes(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                
                country_contributions(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      returned {
                        data {
                          attributes {
                            total
                            fuentes(pagination: { limit: -1 }) {
                              data {
                                attributes {
                                  url
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
      }
    }
  }
`;

export const GET_RETURNEDS_BY_COUNTRY_FOR_GENDER = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    monthlyReports(${getFilterByCountry(country, period, year)}) {
      data {
        attributes {
          reportMonth
          updatedAt
          returned {
            data {
              attributes {
                fuentes(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                gender_contributions(pagination: { limit: -1 }) {
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
      }
    }
  }
`;

export const GET_RETURNEDS_BY_COUNTRY_FOR_TRAVEL_CONDITION = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    monthlyReports(${getFilterByCountry(country, period, year)}) {
      data {
        attributes {
          reportMonth
          updatedAt
          returned {
            data {
              attributes {
                fuentes(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                travel_condition_contributions(pagination: { limit: -1 }) {
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
      }
    }
  }
`;

export const GET_RETURNEDS_BY_COUNTRY_FOR_AGE_GROUP = (
  country,
  period = [1, 12],
  year = currentYear
) => {
  return gql`
  query {
    monthlyReports(${getFilterByCountry(country, period, year)}) {
      data {
        attributes {
          reportMonth
          updatedAt
          returned {
            data {
              attributes {
                total
                fuentes(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                age_group_contributions(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      cant
                      age_group {
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
      }
    }
  }
`;
};

export const GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_ROUTE = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    monthlyReports(${getFilterByCountry(country, period, year)}) {
      data {
        attributes {
          reportMonth
          updatedAt
          returned {
            data {
              attributes {
                fuentes(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                return_route_contributions(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      cant
                      return_route {
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
      }
    }
  }
`;

export const GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_COUNTRY = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    monthlyReports(${getFilterByCountry(country, period, year)})  {
      data {
        attributes {
          reportMonth
          updatedAt
          returned {
            data {
              attributes {
                country_contributions(pagination: { limit: -1 }) {
                  data {
                    attributes {
                      cant
                      country {
                        data {
                          attributes {
                            name
                            map {
                              data {
                                attributes {
                                  url
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
      }
    }
  }
`;

export const GET_RETURNEDS_BY_COUNTRY_FOR_DEPARTMENT = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    monthlyReports(${getFilterByCountry(country, period, year)}) {
    data {
      id
      attributes {
        updatedAt
        reportMonth
        returned {
          data {
            attributes {
              fuentes(pagination: { limit: -1 }) {
                data {
                  attributes {
                    url
                  }
                }
              }
              municipality_contributions(pagination: { limit: -1 }) {
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
                    municipality {
                      data {
                        attributes {
                          name
                          department {
                            data {
                              attributes {
                                name
                                country {
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
    }
  }
}
`;

export const GET_RETURNEDS_BY_COUNTRY_FOR_DEPARTMENT_CAPITAL = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
  monthlyReports(${getFilterByCountry(country, period, year)}) {
    data {
      id  
      attributes {
        updatedAt
        reportMonth
        returned {
          data {
            attributes {
              fuentes(pagination: { limit: -1 }) {
                data {
                  attributes {
                    url
                  }
                }
              }
              department_contributions(pagination: { limit: -1 }) {
                data {
                  id
                  attributes {
                    cant
                    department {
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
    }
  }
}
`;

export const GET_TRANSIT_REPORTS = (
  country,
  period = [1, 12],
  year = currentYear
) => {
  return gql`
  query {
    transitReports(${getFilterByPeriod(period, year, 'reportDate')}) {
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
};

export const GET_DETAINED_IN_BORDERDS = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    detainedInBordersReports(${getFilterByPeriod(period, year, 'reportDate')}) {
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
      }
    }
  }
`;
