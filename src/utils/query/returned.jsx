import { gql } from "@apollo/client";
import { getFilterByCountry } from "./filters";

export const GET_RETURNEDS = gql`
  query {
    monthlyReports {
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
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_RETURNEDS_BY_GENDER = gql`
  query {
    monthlyReports {
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

export const GET_RETURNEDS_BY_TRAVEL_CONDITION = gql`
  query {
    monthlyReports {
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_TOTAL = (country) => gql`
query {
  monthlyReports(${getFilterByCountry(country)}) {
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

export const GET_RETURNEDS_BY_COUNTRY = (country) => gql`
  query {
    monthlyReports(${getFilterByCountry(country)}) {
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_GENDER = (country) => gql`
  query {
    monthlyReports(${getFilterByCountry(country)}) {
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_TRAVEL_CONDITION = (country) => gql`
  query {
    monthlyReports(${getFilterByCountry(country)}) {
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_AGE_GROUP = (country) => gql`
  query {
    monthlyReports(${getFilterByCountry(country)}) {
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_ROUTE = (country) => gql`
  query {
    monthlyReports(${getFilterByCountry(country)}) {
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_COUNTRY = (country) => gql`
  query {
    monthlyReports(${getFilterByCountry(country)})  {
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_DEPARTMENT = (country) => gql`
  query {
    monthlyReports(${getFilterByCountry(country)}) {
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
              municipality_contributions {
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_DEPARTMENT_CAPITAL = (country) => gql`
  query {
  monthlyReports(${getFilterByCountry(country)}) {
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

export const GET_TRANSIT_REPORTS = gql`
  query {
    transitReports {
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

export const GET_DETAINED_IN_BORDERDS = gql`
  query {
    detainedInBordersReports {
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
