import { gql } from "@apollo/client";
import { capitalizeText } from "../tools";

export const GET_TRANSIT_REPORT = (countryId) => gql`
  query {
    transitReports(
      filters: {
        users_permissions_user: {
          organization: {
            department: { country: { name: { eq: "${capitalizeText(
              countryId
            )}" } } }
          }
        }
      }
    ) {
      data {
        attributes {
          reportDate
          updatedAt
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
    transitReports(
      filters: {
        users_permissions_user: {
          organization: {
            department: { country: { name: { eq: "${capitalizeText(
              countryId
            )}" } } }
          }
        }
      }
    ) {
      data {
        attributes {
          reportDate
          updatedAt
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

export const GET_RECURSOS = (countryId) => gql`
query {
  recursos(
    filters: {
      users_permissions_user: {
        organization: { department: { country: { name: { eq: "${capitalizeText(
          countryId
        )}" } } } }
      }
    }
  ) {
    data {
      attributes {
        updatedAt
        name
        link
        description
        esExterno
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
