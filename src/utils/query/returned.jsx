import { gql } from "@apollo/client";
import { getFilterByCountry, getFilterByPeriod } from "./filters";

import { year as currentYear } from "../year";

export const GET_RETURNEDS_BY_GENDER = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    monthlyReports(${getFilterByPeriod(period, year)}) {
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
                gender_contributions {
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

export const GET_RETURNEDS_BY_TRAVEL_CONDITION = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    monthlyReports(${getFilterByPeriod(period, year)}) {
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
                travel_condition_contributions {
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
              fuentes {
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

                fuentes {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                
                country_contributions {
                  data {
                    attributes {
                      returned {
                        data {
                          attributes {
                            total
                            fuentes {
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
                fuentes {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                gender_contributions {
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
                fuentes {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                travel_condition_contributions {
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
                fuentes {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                age_group_contributions {
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
                fuentes {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                return_route_contributions {
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
                country_contributions {
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
              fuentes {
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
              fuentes {
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
    transitReports(${getFilterByPeriod(period, year, "reportDate")}) {
      data {
        id
        attributes {
          reportDate
          gender_contributions {
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
    detainedInBordersReports(${getFilterByPeriod(period, year, "reportDate")}) {
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
