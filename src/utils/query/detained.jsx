import { gql } from '@apollo/client';
import { getFilterByCountry } from './filters';

import { year as currentYear } from '../year';

export const GET_DETAINED_IN_BORDERS_BY_COUNTRY = gql`
  query DetainedInBordersByCountry(
    $country: String!
    $registrarCountry: String!
    $yearStart: Date!
    $yearEnd: Date!
  ) {
    detainedInBordersReports(
      filters: {
        country: { name: { eqi: $country } }
        users_permissions_user: {
          organization: {
            department: { country: { name: { eqi: $registrarCountry } } }
          }
        }
        reportDate: { gte: $yearStart, lte: $yearEnd }
      }
      pagination: { limit: -1 }
      sort: ["reportDate:asc"]
    ) {
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
          fuentes {
            data {
              attributes {
                url
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
        }
      }
    }
  }
`;

export const GET_DETAINED_US_BORDERS_BY_COUNTRY = gql`
  query USDetainedByParentYearAndRegistrar(
    $country: String! # País del informe (p.ej. "Estados Unidos")
    $registrarCountry: String! # País que registró (p.ej. "Guatemala"|"Honduras"|"El Salvador")
    $yearStart: Date!
    $yearEnd: Date!
  ) {
    detainedInBordersReports(
      filters: {
        country: { name: { eqi: $country } }
        users_permissions_user: {
          organization: {
            department: { country: { name: { eqi: $registrarCountry } } }
          }
        }
        reportDate: { gte: $yearStart, lte: $yearEnd }
      }
      pagination: { limit: -1 }
      sort: ["reportDate:asc"]
    ) {
      data {
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
          fuentes {
            data {
              attributes {
                url
              }
            }
          }
          detained_us_borders(pagination: { limit: -1 }) {
            data {
              attributes {
                month
                total
                totalAcompaniados
                totalNoAcompaniados
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
              }
            }
          }
        }
      }
    }
  }
`;
