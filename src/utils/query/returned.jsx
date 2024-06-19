import { gql } from "@apollo/client";

export const GET_RETURNEDS = gql`
  query {
    returneds {
      data {
        id
        attributes {
          total
          country_contributions {
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
`;

export const GET_RETURNEDS_BY_GENDER = gql`
  query {
    genderContributions {
      data {
        attributes {
          cant
          gender {
            data {
              attributes {
                name
                description
                code
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
    travel_condition_contributions {
      data {
        attributes {
          cant
          travel_condition {
            data {
              attributes {
                name
                description
                code
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
          country {
            data {
              id
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
