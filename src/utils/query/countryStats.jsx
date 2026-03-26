import { gql } from '@apollo/client';
import { getFilterByCountry } from './filters';
import { year as currentYear } from '../year';

export const GET_COUNTRY_SUMMARY_STATS = (
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
        }
      }
    }
  }
`;

export const GET_COUNTRY_DEPARTMENT_STATS = (
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
          returned {
            data {
              attributes {
                department_contributions(pagination: { limit: -1 }) {
                  data {
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
        }
      }
    }
  }
`;
