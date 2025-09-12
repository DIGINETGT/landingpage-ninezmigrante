import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { GET_RETURNEDS_BY_GENDER_COUNTRY } from '../utils/query/returned';

type ParamsCountry = {
  iso: string; // 'GT' | 'HN' | 'SV' …
  period?: [number, number];
  year: number | string;
};

// hooks/useReturnedsByGender.ts
const pad = (n: number | string) => String(n).padStart(2, '0');
const nextMonthStart = (y: number | string, m: number | string) => {
  const mm = Number(m),
    yy = Number(y);
  const nm = mm === 12 ? 1 : mm + 1;
  const ny = mm === 12 ? yy + 1 : yy;
  return `${ny}-${pad(nm)}-01`;
};

export function useReturnedsByGenderCountry({
  iso,
  period = [1, 12],
  year,
}: ParamsCountry) {
  const [mStart, mEnd] = period;
  const start = `${year}-${pad(mStart)}-01`;
  const end = nextMonthStart(year, mEnd);

  const { data, loading, error } = useQuery(GET_RETURNEDS_BY_GENDER_COUNTRY, {
    variables: { iso, start, end },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const reports = data?.monthlyReports?.data ?? [];

  const { female, male, total, unknown } = useMemo(() => {
    let f = 0,
      m = 0,
      t = 0,
      u = 0;
    for (const r of reports) {
      const ret = r?.attributes?.returned?.data?.attributes;
      const contribs = ret?.gender_contributions?.data ?? [];
      let sf = 0,
        sm = 0;
      for (const g of contribs) {
        const name =
          g?.attributes?.gender?.data?.attributes?.name?.toLowerCase();
        const cant = Number(g?.attributes?.cant) || 0;
        if (name === 'femenino') sf += cant;
        else if (name === 'masculino') sm += cant;
      }
      const reported = Number(ret?.total) || 0;
      const contributed = sf + sm;
      f += sf;
      m += sm;
      t += reported;
      u += Math.max(0, reported - contributed);
    }
    return { female: f, male: m, total: t, unknown: u };
  }, [reports]);

  return { loading, error, female, male, total, unknown, reports };
}
