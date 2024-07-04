import { gql } from "@apollo/client";
import { getFilterByCountry } from "./filters";

export const GET_TRANSIT_REPORT = (countryId) => gql`
  query {
    transitReports(${getFilterByCountry(countryId)}) {
      data {
        attributes {
          reportDate
          updatedAt
          
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

export const GET_TRANSIT_REPORT_ENTRY_BORDERS = (countryId) => gql`
  query {
    transitReports(${getFilterByCountry(countryId)}) {
      data {
        attributes {
          reportDate
          updatedAt

          fuentes {
            data {
              attributes {
                url
              }
            }
          }
          
          entry_border_contributions {
            data {
              attributes {
                cant
                entry_border {
                  data {
                    attributes {
                      name
                      description
                    }
                  }
                }
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

export const GET_RECURSOS = gql`
  query {
    recursos {
      data {
        attributes {
          updatedAt
          name
          link
          description
          esExterno
          privado
          countries {
            data {
              attributes {
                name
                isoCode
              }
            }
          }
          document {
            data {
              attributes {
                url
              }
            }
          }
          subcategories {
            data {
              attributes {
                name
                category {
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
`;
