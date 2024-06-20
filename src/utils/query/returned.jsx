import { gql } from "@apollo/client";

export const GET_RETURNEDS = gql`
  query {
    monthlyReports {
      data {
        id
        attributes {
          reportMonth
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
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
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

export const GET_BY_MUNI = gql`
  query {
    municipalityContributions {
      data {
        attributes {
          cant
          municipality {
            data {
              attributes {
                name
                code
              }
            }
          }
        }
      }
    }
  }
`;
