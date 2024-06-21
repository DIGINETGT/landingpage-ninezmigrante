import { gql } from "@apollo/client";

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
                country_contributions {
                  data {
                    attributes {
                      cant
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

export const GET_RETURNEDS_BY_COUNTRY = gql`
  query {
    monthlyReports {
      data {
        attributes {
          reportMonth
          updatedAt
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
                          }
                        }
                      }
                    }
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_GENDER = gql`
  query {
    monthlyReports {
      data {
        attributes {
          reportMonth
          updatedAt
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
                              }
                            }
                          }
                        }
                      }
                    }
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_TRAVEL_CONDITION = gql`
  query {
    monthlyReports {
      data {
        attributes {
          reportMonth
          updatedAt
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
                              }
                            }
                          }
                        }
                      }
                    }
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_AGE_GROUP = gql`
  query {
    monthlyReports {
      data {
        attributes {
          reportMonth
          updatedAt
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
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_ROUTE = gql`
  query {
    monthlyReports {
      data {
        attributes {
          reportMonth
          updatedAt
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
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
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

export const GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_COUNTRY = gql`
  query {
    monthlyReports {
      data {
        attributes {
          reportMonth
          updatedAt
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
                                              country_contributions {
                                                data {
                                                  attributes {
                                                    cant
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
                        }
                      }
                    }
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
          country_contributions {
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

export const GET_DETAINED_IN_BORDERDS_BY_COUNTRY = gql`
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
                femenino
                masculino
                acompaniados
                noAcompaniados
                ninos
                adolescentes
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

export const GET_DETAINED = gql`
  query {
    detainedInBorders {
      data {
        id
        attributes {
          total
          month
        }
      }
    }
  }
`;

export const GET_BY_GENDER = gql`
  query {
    genderContributions {
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
`;

export const GET_RETURNEDS_BY_COUNTRY_FOR_DEPARTMENT = gql`
  query {
    monthlyReports {
      data {
        attributes {
          updatedAt
          reportMonth
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
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
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
