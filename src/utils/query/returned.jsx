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
