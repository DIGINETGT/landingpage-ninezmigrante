import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RETURNEDS_BY_TRAVEL_CONDITION_REGION } from '../utils/query/returned';

const pad = (n: number | string) => String(n).toString().padStart(2, '0');
const nextMonthStart = (y: number | string, m: number | string) => {
  const mm = Number(m),
    yy = Number(y);
  const nm = mm === 12 ? 1 : mm + 1;
  const ny = mm === 12 ? yy + 1 : yy;
  return `${ny}-${pad(nm)}-01`;
};

const norm = (s?: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // quita acentos

type Params = {
  isos: string[]; // ['GT','HN','SV']
  period?: [number, number]; // [1,12] por defecto
  year: number | string;
};

export default function useReturnedsByTravelConditionRegion({
  isos,
  period = [1, 12],
  year,
}: Params) {
  const [mStart, mEnd] = period;
  const start = `${year}-${pad(mStart)}-01`;
  const end = nextMonthStart(year, mEnd);

  const { data, loading, error } = useQuery(
    GET_RETURNEDS_BY_TRAVEL_CONDITION_REGION,
    {
      variables: { isos, start, end },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }
  );

  const reports = data?.monthlyReports?.data ?? [];

  // Agregado global + por mes (para chips)
  const { acompanado, noAcompanado, total, unknown, byMonth } = useMemo(() => {
    let A = 0,
      NA = 0,
      T = 0,
      U = 0;
    const map = new Map<
      string,
      {
        acompanado: number;
        noAcompanado: number;
        total: number;
        unknown: number;
      }
    >();

    for (const r of reports) {
      const month = r?.attributes?.reportMonth as string; // "YYYY-MM-01"
      const ret = r?.attributes?.returned?.data?.attributes;
      const reported = Number(ret?.total) || 0;

      let a = 0,
        na = 0,
        other = 0;
      for (const c of ret?.travel_condition_contributions?.data ?? []) {
        const name = norm(
          c?.attributes?.travel_condition?.data?.attributes?.name
        );
        const cant = Number(c?.attributes?.cant) || 0;
        if (name === 'acompanado') a += cant; // “Acompañado”
        else if (name === 'no acompanado') na += cant; // “No acompañado”
        else other += cant; // otra categoría
      }

      // Si te interesa que "otras" condiciones NO aporten a unknown, súmalas a contrib:
      const contributed = a + na + other;
      const diff = Math.max(0, reported - contributed); // faltante no clasificado

      // Acumulado por mes
      const prev = map.get(month) || {
        acompanado: 0,
        noAcompanado: 0,
        total: 0,
        unknown: 0,
      };
      map.set(month, {
        acompanado: prev.acompanado + a,
        noAcompanado: prev.noAcompanado + na,
        total: prev.total + reported,
        unknown: prev.unknown + diff,
      });

      // Global
      A += a;
      NA += na;
      T += reported;
      U += diff;
    }

    const byMonth = Array.from(map.entries())
      .map(([reportMonth, agg]) => ({ reportMonth, ...agg }))
      .sort((x, y) => x.reportMonth.localeCompare(y.reportMonth));

    return { acompanado: A, noAcompanado: NA, total: T, unknown: U, byMonth };
  }, [reports]);

  return {
    loading,
    error,
    acompanado,
    noAcompanado,
    total,
    unknown,
    byMonth,
    reports,
  };
}
