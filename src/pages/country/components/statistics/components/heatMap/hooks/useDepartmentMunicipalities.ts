import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MUNICIPALITIES_FOR_COUNTRY } from '../utils/query/municipalities'; // ajusta ruta

type Counts = Record<string, number>;
type ByMuni = Record<string, Counts>;

const toNum = (v: number | string | undefined, fb: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};

const toPeriod = (
  p: [number, number] | [number | string, number | string] | undefined,
  fb: [number, number]
): [number, number] => {
  const p0 = Number(p?.[0] ?? fb[0]);
  const p1 = Number(p?.[1] ?? fb[1]);
  return [
    Number.isFinite(p0) && p0 > 0 ? p0 : fb[0],
    Number.isFinite(p1) && p1 > 0 ? p1 : fb[1],
  ];
};

export default function useDepartmentMunicipalities({
  country,
  year,
  period,
  departmentLabel, // ej: "Alta Verapaz" (tal cual en DB)
  skip,
}: {
  country: string;
  year: number | string;
  period: [number | string, number | string];
  departmentLabel: string;
  skip?: boolean;
}) {
  const y = toNum(year, new Date().getFullYear());
  const p = toPeriod(period, [1, 12]);
  const dept = departmentLabel?.trim();

  const { data, loading, error } = useQuery(
    GET_MUNICIPALITIES_FOR_COUNTRY(country, p, y, dept),
    { fetchPolicy: 'cache-first', skip: !dept || !!skip }
  );

  const reports = data?.monthlyReports?.data ?? [];

  const { muniTotals, genderTotals, genderByMuni } = useMemo(() => {
    const mt: Counts = {};
    const gt: Counts = {};
    const gbm: ByMuni = {};

    for (const r of reports) {
      const arr =
        r?.attributes?.returned?.data?.attributes?.municipality_contributions
          ?.data ?? [];
      for (const mc of arr) {
        const a = mc?.attributes;
        const muniName = a?.municipality?.data?.attributes?.name || 'N/D';
        const cant = Number(a?.cant || 0);
        const gen = a?.gender?.data?.attributes?.name?.toLowerCase();

        mt[muniName] = (mt[muniName] || 0) + cant;

        if (gen) {
          gt[gen] = (gt[gen] || 0) + cant;
          gbm[muniName] = gbm[muniName] || {};
          gbm[muniName][gen] = (gbm[muniName][gen] || 0) + cant;
        }
      }
    }

    return { muniTotals: mt, genderTotals: gt, genderByMuni: gbm };
  }, [reports]);

  return { loading, error, muniTotals, genderTotals, genderByMuni };
}
