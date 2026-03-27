import { gql } from '@apollo/client';
import { year as currentYear } from '../year';

const pad = (value) => String(value).padStart(2, '0');

const escapeGraphqlString = (value = '') =>
  String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const nextMonthStart = (year, month) => {
  const numericMonth = Number(month);
  const numericYear = Number(year);
  const nextMonth = numericMonth === 12 ? 1 : numericMonth + 1;
  const nextYear = numericMonth === 12 ? numericYear + 1 : numericYear;
  return `${nextYear}-${pad(nextMonth)}-01`;
};

const buildStatsArgs = (
  country,
  period = [1, 12],
  year = currentYear,
  extraArgs = ''
) => {
  const [startMonth, endMonth] = period;
  const start = `${year}-${pad(startMonth)}-01`;
  const end = nextMonthStart(year, endMonth);

  return `country: "${country?.toUpperCase() ?? ''}", start: "${start}", end: "${end}"${
    extraArgs ? `, ${extraArgs}` : ''
  }`;
};

const buildBucketsLiteral = (buckets = []) =>
  `[${buckets
    .map(
      (bucket) =>
        `{ start: "${escapeGraphqlString(bucket.start)}", end: "${escapeGraphqlString(
          bucket.end
        )}", label: "${escapeGraphqlString(bucket.label)}" }`
    )
    .join(', ')}]`;

export const GET_DEPARTMENT_CARD_STATS = (
  country,
  period = [1, 12],
  year = currentYear,
  department = ''
) => gql`
  query {
    departmentCardStats(
      ${buildStatsArgs(
        country,
        period,
        year,
        `department: "${escapeGraphqlString(department)}"`
      )}
    ) {
      total
      male
      female
    }
  }
`;

export const GET_TOP_DEPARTMENTS_STATS = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    topDepartmentsStats(${buildStatsArgs(country, period, year)}) {
      depTotals
    }
  }
`;

export const GET_TRENDS_STATS = (country, mode, buckets = []) => gql`
  query {
    trendsStats(
      country: "${country?.toUpperCase() ?? ''}"
      mode: "${escapeGraphqlString(mode)}"
      buckets: ${buildBucketsLiteral(buckets)}
    ) {
      labels
      series {
        label
        data
      }
    }
  }
`;
