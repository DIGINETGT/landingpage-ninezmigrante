import { gql } from "@apollo/client";
import { getFilterByCountry } from "./filters";

export const GET_DETAINED_IN_BORDERDS_BY_COUNTRY = (country) => gql`
  query {
  detainedInBordersReports(${getFilterByCountry(country)}) {
    data {
      id
      attributes {
        reportDate
        updatedAt
        country {
          data {
            attributes {
              name
            }
          }
        }
        detained_in_borders(pagination: { limit: -1 }) {
          data {
            id
            attributes {
              month  
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

export const GET_DETAINED_US_BORDERDS_BY_COUNTRY = (country) => gql`
  query {
    detainedInBordersReports(${getFilterByCountry(country)}) {
      data {
        id
        attributes {
          updatedAt
          reportDate
          country {
            data {
              attributes {
                name
              }
            }
          }

          detained_us_borders(pagination: { limit: -1 }) {
            data {
              id
              attributes {
                month
                elCentroAcompaniados
                yumaAcompaniados
                tucsonAcompaniados
                elPasoAcompaniados
                bigBendAcompaniados
                delRioAcompaniados
                laredoAcompaniados
                rioGrandeAcompaniados
                sanDiegoNoAcompaniados
                elCentroNoAcompaniados
                yumaNoAcompaniados
                tucsonNoAcompaniados
                elPasoNoAcompaniados
                bigBendNoAcompaniados
                delRioNoAcompaniados
                laredoNoAcompaniados
                rioGrandeNoAcompaniados
                totalAcompaniados
                totalNoAcompaniados
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
