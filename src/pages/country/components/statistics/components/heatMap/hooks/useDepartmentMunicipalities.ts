import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MUNICIPALITIES_FOR_COUNTRY } from '../utils/query/municipalities';

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
  departmentLabel, // ej: "Alta Verapaz"
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

  const {
    muniTotals,
    genderTotals,
    genderByMuni,
    missingByMonth,
    missingMunicipalityMonths,
  } = useMemo(() => {
    const mt: Counts = {};
    const gt: Counts = {};
    const gbm: ByMuni = {};

    // Acumuladores por mes
    const muniSumByMonth: Counts = {}; // YYYY-MM -> suma municipal
    const deptTotByMonth: Counts = {}; // YYYY-MM -> total depto

    for (const r of reports) {
      const attr = r?.attributes;
      const iso = String(attr?.reportMonth || ''); // "YYYY-MM-DD"
      const ym = iso ? iso.slice(0, 7) : ''; // "YYYY-MM"

      const ret = attr?.returned?.data?.attributes;

      // --- Totales del depto por mes (ya filtrado por depto en la query) ---
      const dcs = ret?.department_contributions?.data ?? [];
      for (const dc of dcs) {
        const cant = Number(dc?.attributes?.cant || 0);
        if (ym) deptTotByMonth[ym] = (deptTotByMonth[ym] || 0) + cant;
      }

      // --- Municipios por mes ---
      const mcs = ret?.municipality_contributions?.data ?? [];

      for (const mc of mcs) {
        const a = mc?.attributes;
        const muniName = a?.municipality?.data?.attributes?.name || 'N/D';
        const cant = Number(a?.cant || 0);
        const gen = a?.gender?.data?.attributes?.name?.toLowerCase();

        // Totales agregados globales
        mt[muniName] = (mt[muniName] || 0) + cant;

        if (gen) {
          gt[gen] = (gt[gen] || 0) + cant;
          gbm[muniName] = gbm[muniName] || {};
          gbm[muniName][gen] = (gbm[muniName][gen] || 0) + cant;
        }

        // Suma municipal por mes
        if (ym) muniSumByMonth[ym] = (muniSumByMonth[ym] || 0) + cant;
      }
    }

    // Diferencia por mes (total depto - suma municipal)
    const missingByMonth: Counts = {};
    for (const ym of Object.keys(deptTotByMonth)) {
      const diff =
        Number(deptTotByMonth[ym] || 0) - Number(muniSumByMonth[ym] || 0);
      if (diff > 0) missingByMonth[ym] = diff;
    }

    const missingMunicipalityMonths = Object.keys(missingByMonth).sort();

    return {
      muniTotals: mt,
      genderTotals: gt,
      genderByMuni: gbm,
      missingByMonth,
      missingMunicipalityMonths,
    };
  }, [reports]);

  return {
    loading,
    error,
    muniTotals,
    genderTotals,
    genderByMuni,
    missingByMonth,
    missingMunicipalityMonths,
  };
}
