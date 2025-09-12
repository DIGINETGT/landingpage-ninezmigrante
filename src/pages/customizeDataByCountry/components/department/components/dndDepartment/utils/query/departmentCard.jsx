import { gql } from '@apollo/client';
import { getFilterByCountry } from '../../../../../../../../utils/query/filters';
import { year as currentYear } from '../../../../../../../../utils/year';

// Escapa comillas por si el nombre trae "
const esc = (s = '') => String(s).replace(/"/g, '\\"');

export const GET_DEPARTMENT_CARD = (
  iso, // 'GT' | 'HN' | 'SV'
  period = [1, 12],
  year = currentYear,
  departmentLabel = '' // "Quetzaltenango"
) => gql`
  query {
    monthlyReports(${getFilterByCountry(iso, period, year)}) {
      data {
        attributes {
          returned {
            data {
              attributes {

                # Total del DEPARTAMENTO (sumaremos cant)
                department_contributions(
                  ${
                    departmentLabel
                      ? `filters: { department: { name: { eq: "${esc(
                          departmentLabel
                        )}" } } },`
                      : ''
                  }
                  pagination: { limit: -1 }
                ) {
                  data { attributes { cant } }
                }

                # Género por MUNICIPIOS del mismo departamento
                municipality_contributions(
                  ${
                    departmentLabel
                      ? `filters: { municipality: { department: { name: { eq: "${esc(
                          departmentLabel
                        )}" } } } },`
                      : ''
                  }
                  pagination: { limit: -1 }
                ) {
                  data {
                    attributes {
                      cant
                      gender { data { attributes { name } } }
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
