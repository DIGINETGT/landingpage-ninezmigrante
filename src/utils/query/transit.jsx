import { gql } from "@apollo/client";

export const GET_TRAFIC_REPORT = (countryId) => gql`
  query {
    transitReports(
      filters: {
        users_permissions_user: {
          organization: {
            department: { country: { name: { eq: "${countryId}" } } }
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
