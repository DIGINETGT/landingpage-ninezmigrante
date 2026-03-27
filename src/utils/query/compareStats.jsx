import { gql } from '@apollo/client';

const pad = (value) => String(value).padStart(2, '0');

const nextMonthStart = (year, month) => {
  const numericMonth = Number(month);
  const numericYear = Number(year);
  const nextMonth = numericMonth === 12 ? 1 : numericMonth + 1;
  const nextYear = numericMonth === 12 ? numericYear + 1 : numericYear;
  return `${nextYear}-${pad(nextMonth)}-01`;
};

const escapeGraphqlString = (value = '') =>
  String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const selectionToLiteral = (selection = {}) => {
  const year = Number(selection?.year || 0);
  const startMonth = Number(selection?.period?.[0] || 1);
  const endMonth = Number(selection?.period?.[1] || 1);
  const country = String(selection?.country || '').toUpperCase();
  const start = `${year}-${pad(startMonth)}-01`;
  const end = nextMonthStart(year, endMonth);

  return `{ country: "${escapeGraphqlString(country)}", start: "${start}", end: "${end}" }`;
};

export const GET_COMPARE_COUNTRY_STATS = (selections = []) => gql`
  query {
    compareCountryStats(selections: [${selections
      .map((selection) => selectionToLiteral(selection))
      .join(', ')}]) {
      selections {
        country
        start
        end
        totalCant
        updatedAtStr
        filesUrl {
          name
          url
        }
        genderTotals
        travelConditionTotals
        ageGroupTotals
        returnRouteTotals
        returnCountryTotals
        returnCountryMaps
        depTotals
      }
    }
  }
`;
