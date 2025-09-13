// pages/bordersDataByCountry/components/statistics/mexico/hooks.ts
import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DETAINED_IN_BORDERS_BY_COUNTRY } from '../../../../../../utils/query/detained';
import { dateToString } from '../../../../../../utils/tools';
import { monthNames } from '../../../../../../hooks/fetch';

// extrae 1..12 desde "YYYY-MM-DD"
const monthNum = (iso?: string | null) => {
  if (!iso) return null;
  const mm = Number(String(iso).split('-')[1]);
  return Number.isFinite(mm) && mm >= 1 && mm <= 12 ? mm : null;
};

// mapea "gt|hn|sv" → nombre canónico
const registrarNameFrom = (id?: string | null) => {
  if (!id) return null;
  const map: Record<string, string> = {
    gt: 'Guatemala',
    hn: 'Honduras',
    sv: 'El Salvador',
  };
  const k = String(id).toLowerCase();
  return map[k] || id; // si ya viene "Guatemala", lo deja igual
};

export const useDetainedMexico = ({
  period,
  currentYear, // número (o string convertible a número)
  registrar, // "gt" | "hn" | "sv" | "Guatemala" | "Honduras" | "El Salvador"
}: {
  period: [number, number] | number[] | any;
  currentYear: number | string;
  registrar?: string;
}) => {
  const y = Number(currentYear);
  const fromM = Number(Array.isArray(period) ? period[0] : NaN);
  const toM = Number(Array.isArray(period) ? period[1] : NaN);

  const registrarCountry = registrarNameFrom(registrar);

  // pedimos por país+año del PADRE y país que registró
  const canQuery = !!registrarCountry && Number.isFinite(y);

  const variables = useMemo(
    () =>
      canQuery
        ? {
            country: 'México',
            registrarCountry,
            yearStart: `${y}-01-01`,
            yearEnd: `${y}-12-31`,
          }
        : undefined,
    [canQuery, registrarCountry, y]
  );

  const { data, loading } = useQuery(GET_DETAINED_IN_BORDERS_BY_COUNTRY, {
    variables,
    skip: !canQuery,
    notifyOnNetworkStatusChange: true,
  });

  const reports = data?.detainedInBordersReports?.data ?? [];
  const itemsAll =
    reports.flatMap((r) => r?.attributes?.detained_in_borders?.data ?? []) ??
    [];

  // filtro local por MESES (ignora AÑO del hijo)
  const hasValidMonths =
    Number.isFinite(fromM) &&
    Number.isFinite(toM) &&
    fromM >= 1 &&
    toM <= 12 &&
    fromM <= toM;

  const items = hasValidMonths
    ? itemsAll.filter((it) => {
        const m = monthNum(it?.attributes?.month as string);
        return m !== null && m >= fromM && m <= toM;
      })
    : [];

  // agregados
  const dataPerMonth = {
    totalMes: 0,
    female: 0,
    male: 0,
    acd: 0,
    noAcd: 0,
    f1: 0,
    f2: 0,
    f3: 0,
  };

  for (const it of items) {
    const a = it?.attributes || {};
    dataPerMonth.totalMes += Number(a.total ?? 0);
    dataPerMonth.female += Number(a.femenino ?? 0);
    dataPerMonth.male += Number(a.masculino ?? 0);
    dataPerMonth.acd += Number(a.acompaniados ?? 0);
    dataPerMonth.noAcd += Number(a.noAcompaniados ?? 0);
    dataPerMonth.f2 += Number(a.ninos ?? 0);
    dataPerMonth.f3 += Number(a.adolescentes ?? 0);
  }

  // fuentes etiquetadas por rango
  const files = (() => {
    const lbl = hasValidMonths
      ? fromM === toM
        ? `${monthNames[fromM]} - ${y}`
        : `${monthNames[fromM]}–${monthNames[toM]} - ${y}`
      : '';
    return reports.flatMap((r) =>
      (r?.attributes?.fuentes?.data ?? []).map((f) => ({
        url: f?.attributes?.url ?? '',
        name: lbl,
      }))
    );
  })();

  // última actualización
  const updateDate = reports.reduce((acc, r) => {
    const u = r?.attributes?.updatedAt
      ? dateToString(new Date(r.attributes.updatedAt))
      : '';
    return u && (!acc || new Date(u) > new Date(acc)) ? u : acc;
  }, '');

  return { dataPerMonth, updateDate, files, loading };
};
