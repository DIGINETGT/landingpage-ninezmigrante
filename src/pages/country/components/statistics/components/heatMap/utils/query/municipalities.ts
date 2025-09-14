import { gql } from '@apollo/client';
import { getFilterByCountry } from '../../../../../../../../utils/query/filters'; // ajusta la ruta
import { year as currentYear } from '../../../../../../../../utils/year'; // ajusta la ruta

// Escapa comillas por si el nombre del depto trae " "
const esc = (s = '') => s.replace(/"/g, '\\"');

export const GET_MUNICIPALITIES_FOR_COUNTRY = (
  country: string,
  period: [number, number] = [1, 12],
  year: number = currentYear,
  departmentLabel?: string
) => gql`
  query {
    monthlyReports(${getFilterByCountry(country, period, year)}) {
      data {
        attributes {
          reportMonth
          returned {
            data { attributes {

              # Totales del departamento por mes (solo el depto seleccionado)
              department_contributions(
                filters: { department: { name: { eq: "${
                  departmentLabel || ''
                }" } } }
                pagination: { limit: -1 }
              ) {
                data {
                  attributes {
                    cant
                    department { data { attributes { name } } }
                  }
                }
              }

              municipality_contributions(
                filters: { municipality: { department: { name: { eq: "${
                  departmentLabel || ''
                }" } } } }
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
            }}
          }
        }
      }
    }
  }
`;
