// pages/.../eeuu/hooks/index.ts (TypeScript, como ya lo tienes)
import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DETAINED_US_BORDERS_BY_COUNTRY } from '../../../../../../utils/query/detained';
import { dateToString } from '../../../../../../utils/tools';

type Args = {
  countryName?: string; // "Estados Unidos" por defecto
  year: number; // año consultado (padre)
  period: [number, number]; // [fromM, toM] 1..12
  registrar?: string; // "gt" | "hn" | "sv" | nombre completo
};

// Mes 1..12 desde "YYYY-MM-DD"
const monthNum = (iso?: string | null) => {
  if (!iso) return null;
  const mm = Number(String(iso).split('-')[1]);
  return Number.isFinite(mm) && mm >= 1 && mm <= 12 ? mm : null;
};

// Mapea id de ruta → nombre canónico
const registrarNameFrom = (id?: string | null) => {
  if (!id) return null;
  const map: Record<string, string> = {
    gt: 'Guatemala',
    hn: 'Honduras',
    sv: 'El Salvador',
  };
  // si ya viene un nombre completo, úsalo tal cual
  return map[id.toLowerCase()] || id;
};

export function useUSDetained({
  countryName = 'Estados Unidos',
  year,
  period,
  registrar, // ← NUEVO
}: Args) {
  const fromM = Number(Array.isArray(period) ? period[0] : NaN);
  const toM = Number(Array.isArray(period) ? period[1] : NaN);

  const registrarCountry = registrarNameFrom(registrar);

  const canQuery = !!countryName && !!registrarCountry && Number.isFinite(year);

  const variables = useMemo(
    () =>
      canQuery
        ? {
            country: countryName,
            registrarCountry, // ← filtro por quien registró
            yearStart: `${year}-01-01`, // padre por año
            yearEnd: `${year}-12-31`,
          }
        : undefined,
    [canQuery, countryName, registrarCountry, year]
  );

  const { data, loading } = useQuery(GET_DETAINED_US_BORDERS_BY_COUNTRY, {
    variables,
    skip: !canQuery,
    notifyOnNetworkStatusChange: true,
  });

  // Datos crudos
  const reports = data?.detainedInBordersReports?.data ?? [];
  const itemsAll =
    reports.flatMap((r) => r?.attributes?.detained_us_borders?.data ?? []) ??
    [];

  // Filtro local por MESES (ignora el AÑO del hijo)
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

  // Agregados de rango
  const totals = items.reduce(
    (acc, it) => {
      const a = it?.attributes || {};
      acc.total += Number(a.total ?? 0);
      acc.acd += Number(a.totalAcompaniados ?? 0);
      acc.noAcd += Number(a.totalNoAcompaniados ?? 0);
      return acc;
    },
    { total: 0, acd: 0, noAcd: 0 }
  );

  // Sectores
  const sectorNoAcd = items.reduce(
    (acc, it) => {
      const a = it?.attributes || {};
      acc.sanDiego += Number(a.sanDiegoNoAcompaniados ?? 0);
      acc.elCentro += Number(a.elCentroNoAcompaniados ?? 0);
      acc.yuma += Number(a.yumaNoAcompaniados ?? 0);
      acc.tucson += Number(a.tucsonNoAcompaniados ?? 0);
      acc.elPaso += Number(a.elPasoNoAcompaniados ?? 0);
      acc.bigBend += Number(a.bigBendNoAcompaniados ?? 0);
      acc.delRio += Number(a.delRioNoAcompaniados ?? 0);
      acc.laredo += Number(a.laredoNoAcompaniados ?? 0);
      acc.rioGrande += Number(a.rioGrandeNoAcompaniados ?? 0);
      return acc;
    },
    {
      sanDiego: 0,
      elCentro: 0,
      yuma: 0,
      tucson: 0,
      elPaso: 0,
      bigBend: 0,
      delRio: 0,
      laredo: 0,
      rioGrande: 0,
    }
  );

  const sectorAcd = items.reduce(
    (acc, it) => {
      const a = it?.attributes || {};
      acc.elCentro += Number(a.elCentroAcompaniados ?? 0);
      acc.yuma += Number(a.yumaAcompaniados ?? 0);
      acc.tucson += Number(a.tucsonAcompaniados ?? 0);
      acc.elPaso += Number(a.elPasoAcompaniados ?? 0);
      acc.bigBend += Number(a.bigBendAcompaniados ?? 0);
      acc.delRio += Number(a.delRioAcompaniados ?? 0);
      acc.laredo += Number(a.laredoAcompaniados ?? 0);
      acc.rioGrande += Number(a.rioGrandeAcompaniados ?? 0);
      return acc;
    },
    {
      elCentro: 0,
      yuma: 0,
      tucson: 0,
      elPaso: 0,
      bigBend: 0,
      delRio: 0,
      laredo: 0,
      rioGrande: 0,
    }
  );

  // Fuentes + actualizado
  const files = reports.flatMap((r) =>
    (r?.attributes?.fuentes?.data ?? []).map((f) => ({
      url: f?.attributes?.url ?? '',
      name: '',
    }))
  );

  const updateDate = reports.reduce((acc, r) => {
    const u = r?.attributes?.updatedAt
      ? dateToString(new Date(r.attributes.updatedAt))
      : '';
    return u && (!acc || new Date(u) > new Date(acc)) ? u : acc;
  }, '');

  // Shape para tu componente
  const dataPerMonth = {
    totalMes: totals.total,
    totalAcompaniados: totals.acd,
    totalNoAcompaniados: totals.noAcd,
  };

  const dataPerDeps = {
    acm: { ...sectorAcd, totalAcompañados: totals.acd },
    noacm: { ...sectorNoAcd, totalNoAcompañados: totals.noAcd },
  };

  return { loading, dataPerMonth, dataPerDeps, files, updateDate };
}
