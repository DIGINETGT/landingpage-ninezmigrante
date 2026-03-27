import { gql } from '@apollo/client';
import { year as currentYear } from '../year';

const pad = (value) => String(value).padStart(2, '0');

const nextMonthStart = (year, month) => {
  const numericMonth = Number(month);
  const numericYear = Number(year);
  const nextMonth = numericMonth === 12 ? 1 : numericMonth + 1;
  const nextYear = numericMonth === 12 ? numericYear + 1 : numericYear;
  return `${nextYear}-${pad(nextMonth)}-01`;
};

const buildCountryStatsArgs = (
  country,
  period = [1, 12],
  year = currentYear
) => {
  const [startMonth, endMonth] = period;
  const start = `${year}-${pad(startMonth)}-01`;
  const end = nextMonthStart(year, endMonth);

  return `country: "${country?.toUpperCase() ?? ''}", start: "${start}", end: "${end}"`;
};

export const GET_COUNTRY_HEAD_STATS = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    countryHeadStats(${buildCountryStatsArgs(country, period, year)}) {
      totalCant
      filesUrl {
        name
        url
      }
      updatedAtStr
    }
  }
`;

export const GET_COUNTRY_DEMOGRAPHIC_STATS = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    countryDemographicStats(${buildCountryStatsArgs(country, period, year)}) {
      genderTotals
      travelConditionTotals
      ageGroupTotals
    }
  }
`;

export const GET_COUNTRY_RETURN_STATS = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    countryReturnStats(${buildCountryStatsArgs(country, period, year)}) {
      returnRouteTotals
      returnCountryTotals
      returnCountryMaps
    }
  }
`;

export const GET_COUNTRY_DEPARTMENT_STATS = (
  country,
  period = [1, 12],
  year = currentYear
) => gql`
  query {
    countryDepartmentStats(${buildCountryStatsArgs(country, period, year)}) {
      depTotals
    }
  }
`;
