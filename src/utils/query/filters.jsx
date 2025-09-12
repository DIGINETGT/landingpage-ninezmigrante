import { year as currentYear } from '../year';

const pad = (n) => String(n).padStart(2, '0');

// retorna "YYYY-MM-01" del mes siguiente a (year, month)
const nextMonthStart = (year, month) => {
  const m = Number(month);
  const y = Number(year);
  const nm = m === 12 ? 1 : m + 1;
  const ny = m === 12 ? y + 1 : y;
  return `${ny}-${pad(nm)}-01`;
};

// Para reportMonth (o cualquier campo fecha)
export const getFilterByCountry = (
  country,
  period = [1, 12],
  year = currentYear,
  field = 'reportMonth'
) => {
  const [mStart, mEnd] = period;
  const start = `${year}-${pad(mStart)}-01`;
  const endExclusive = nextMonthStart(year, mEnd);

  return `
    pagination: { page: 1, pageSize: 12 },
    filters: {
      ${field}: {
        gte: "${start}",
        lt: "${endExclusive}"
      },
      users_permissions_user: {
        organization: {
          department: {
            country: { isoCode: { eq: "${country?.toUpperCase() ?? ''}" } }
          }
        }
      }
    }
  `;
};

export const getFilterByPeriod = (
  period = [1, 12],
  year = currentYear,
  field = 'reportMonth'
) => {
  const [mStart, mEnd] = period;
  const start = `${year}-${pad(mStart)}-01`;
  const endExclusive = nextMonthStart(year, mEnd);

  return `
    pagination: { page: 1, pageSize: 12 },
    filters: {
      ${field}: {
        gte: "${start}",
        lt: "${endExclusive}"
      }
    }
  `;
};
