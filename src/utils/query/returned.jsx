import { gql } from "@apollo/client";

export const GET_RETURNEDS = gql`
  query {
    returneds {
      data {
        id
        attributes {
          total
          fuentes {
            url
            name
          }
          monthly_report {
            data {
              id
              attributes {
                report_name
                report_date
              }
            }
          }
          country_contributions {
            data {
              id
              attributes {
                country_name
                contribution_amount
              }
            }
          }
          travel_condition_contributions {
            data {
              id
              attributes {
                condition_name
                contribution_amount
              }
            }
          }
          age_group_contributions {
            data {
              id
              attributes {
                age_group
                contribution_amount
              }
            }
          }
          return_route_contributions {
            data {
              id
              attributes {
                route_name
                contribution_amount
              }
            }
          }
          department_contributions {
            data {
              id
              attributes {
                department_name
                contribution_amount
              }
            }
          }
          municipality_contributions {
            data {
              id
              attributes {
                municipality_name
                contribution_amount
              }
            }
          }
          gender_contributions {
            data {
              id
              attributes {
                gender
                contribution_amount
              }
            }
          }
        }
      }
    }
  }
`;
