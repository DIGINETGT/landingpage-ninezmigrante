import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RETURNEDS_BY_GENDER_REGION } from '../utils/query/returned';

type ParamsRegion = {
  isos: string[]; // e.g. ['GT','HN','SV'] (en MAYÚSCULAS)
  period?: [number, number]; // [1,12] por defecto
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

export function useReturnedsByGenderRegion({
  isos,
  period = [1, 12],
  year,
}: ParamsRegion) {
  const [mStart, mEnd] = period;
  const start = `${year}-${pad(mStart)}-01`;
  const end = nextMonthStart(year, mEnd);

  const { data, loading, error } = useQuery(GET_RETURNEDS_BY_GENDER_REGION, {
    variables: { isos, start, end },
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
      const subtotalF = contribs
        .filter(
          (x) =>
            x?.attributes?.gender?.data?.attributes?.name?.toLowerCase() ===
            'femenino'
        )
        .reduce((acc, x) => acc + (Number(x?.attributes?.cant) || 0), 0);
      const subtotalM = contribs
        .filter(
          (x) =>
            x?.attributes?.gender?.data?.attributes?.name?.toLowerCase() ===
            'masculino'
        )
        .reduce((acc, x) => acc + (Number(x?.attributes?.cant) || 0), 0);

      const reported = Number(ret?.total) || 0;
      const contributed = subtotalF + subtotalM;
      const diff = Math.max(0, reported - contributed); // casos sin clasificación de género

      f += subtotalF;
      m += subtotalM;
      t += reported;
      u += diff;
    }

    return { female: f, male: m, total: t, unknown: u };
  }, [reports]);

  return { loading, error, female, male, total, unknown, reports };
}
