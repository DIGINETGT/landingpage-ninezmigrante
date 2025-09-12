import { gql } from '@apollo/client';
import { getFilterByCountry } from '../../../../../../../../utils/query/filters'; // ajusta la ruta
import { year as currentYear } from '../../../../../../../../utils/year'; // ajusta la ruta

// Escapa comillas por si el nombre del depto trae " "
const esc = (s = '') => s.replace(/"/g, '\\"');

export const GET_MUNICIPALITIES_FOR_COUNTRY = (
  country: string,
  period: [number, number] = [1, 12],
  year: number = currentYear,
  departmentLabel = ''
) => gql`
  query {
    monthlyReports(${getFilterByCountry(country, period, year)}) {
      data {
        attributes {
          returned {
            data {
              attributes {
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
                      municipality { data { attributes { name } } }
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
