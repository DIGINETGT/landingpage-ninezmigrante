import { gql } from "@apollo/client";

export const GET_COUNTRY = gql`
  query {
    countries {
      data {
        id
        attributes {
          name
          description
          flag {
            data {
              attributes {
                url
              }
            }
          }
          isoCode
          departments {
            data {
              id
              attributes {
                name
              }
            }
          }
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
`;
