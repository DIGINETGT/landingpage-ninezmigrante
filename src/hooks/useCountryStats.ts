// hooks/useCountryStats.ts
import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COUNTRY_STATS } from '../utils/query/countryStats';

type Cnts = Record<string, number>;

export default function useCountryStats({ country, year, period }) {
  const { data, loading, error } = useQuery(
    GET_COUNTRY_STATS(country, period, year),
    { fetchPolicy: 'cache-first' }
  );

  const reports = data?.monthlyReports?.data ?? [];

  const {
    totalCant,
    filesUrl,
    genderTotals,
    travelConditionTotals,
    ageGroupTotals,
    returnRouteTotals,
    returnCountryTotals, // { 'Estados Unidos': 123, ... }
    returnCountryMaps, // { 'Estados Unidos': 'https://...' }
    depTotals, // { depNormalized: total }
    depSubDepTotals, // { depNormalized: { municipio: total } }
    depSubDepGenderTotals, // { depNormalized: { masculino: n, femenino: n } }
    updatedAtStr,
  } = useMemo(() => {
    let total = 0;
    const files: { name: string; url: string }[] = [];
    const genders: Cnts = {};
    const travel: Cnts = {};
    const ages: Cnts = {};
    const routes: Cnts = {};
    const rcTotals: Cnts = {};
    const rcMaps: Record<string, string> = {};
    const depT: Cnts = {};
    const depSub: Record<string, Cnts> = {};
    const depGen: Record<string, Cnts> = {};

    const monthNames = [
      '',
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    for (const r of reports) {
      const attr = r?.attributes;
      const ret = attr?.returned?.data?.attributes;

      // TOTAL
      total += ret?.total || 0;

      // FUENTES
      const [_, m] = (attr?.reportMonth || '').split('-').map(Number);
      for (const f of ret?.fuentes?.data ?? []) {
        files.push({ name: monthNames[m], url: f?.attributes?.url });
      }

      // GÉNERO
      for (const g of ret?.gender_contributions?.data ?? []) {
        const name =
          g.attributes?.gender?.data?.attributes?.name?.toLowerCase();
        const cant = g.attributes?.cant || 0;
        if (name) genders[name] = (genders[name] || 0) + cant;
      }

      // CONDICIÓN DE VIAJE
      for (const c of ret?.travel_condition_contributions?.data ?? []) {
        const name =
          c.attributes?.travel_condition?.data?.attributes?.name?.toLowerCase();
        const cant = c.attributes?.cant || 0;
        if (name) travel[name] = (travel[name] || 0) + cant;
      }

      // RANGO ETARIO
      for (const a of ret?.age_group_contributions?.data ?? []) {
        const name =
          a.attributes?.age_group?.data?.attributes?.name?.toLowerCase();
        const cant = a.attributes?.cant || 0;
        if (name) ages[name] = (ages[name] || 0) + cant;
      }

      // VÍA DE RETORNO
      for (const v of ret?.return_route_contributions?.data ?? []) {
        const name =
          v.attributes?.return_route?.data?.attributes?.name?.toLowerCase();
        const cant = v.attributes?.cant || 0;
        if (name) routes[name] = (routes[name] || 0) + cant;
      }

      // PAÍS DE RETORNO
      for (const c of ret?.country_contributions?.data ?? []) {
        const name = c.attributes?.country?.data?.attributes?.name;
        const cant = c.attributes?.cant || 0;
        if (!name) continue;
        rcTotals[name] = (rcTotals[name] || 0) + cant;
        const mapUrl =
          c.attributes?.country?.data?.attributes?.map?.data?.attributes?.url;
        if (mapUrl) rcMaps[name] = mapUrl;
      }

      // DEPARTAMENTO (capital)
      for (const d of ret?.department_contributions?.data ?? []) {
        const depName =
          d?.attributes?.department?.data?.attributes?.name || 'Otros';
        const key = depName
          .toLowerCase()
          .replaceAll(' ', '_')
          .replaceAll('department', '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        depT[key] = (depT[key] || 0) + (d?.attributes?.cant || 0);
      }

      // MUNICIPIO (para modal + géneros)
      for (const m of ret?.municipality_contributions?.data ?? []) {
        const muni = m.attributes?.municipality?.data?.attributes;
        const depName = muni?.department?.data?.attributes?.name || 'otros';
        const depKey = depName
          .toLowerCase()
          .replaceAll(' ', '_')
          .replaceAll('department', '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const muniName = muni?.name || 'N/D';
        const cant = m.attributes?.cant || 0;
        const gen = m.attributes?.gender?.data?.attributes?.name?.toLowerCase();

        depSub[depKey] = depSub[depKey] || {};
        depSub[depKey][muniName] = (depSub[depKey][muniName] || 0) + cant;

        if (gen) {
          depGen[depKey] = depGen[depKey] || {};
          depGen[depKey][gen] = (depGen[depKey][gen] || 0) + cant;
        }
      }
    }

    const updatedAtStr = (() => {
      const firstUpdated = reports?.[0]?.attributes?.updatedAt;
      return firstUpdated ? new Date(firstUpdated).toISOString() : '';
    })();

    return {
      totalCant: total,
      filesUrl: files,
      genderTotals: genders,
      travelConditionTotals: travel,
      ageGroupTotals: ages,
      returnRouteTotals: routes,
      returnCountryTotals: rcTotals,
      returnCountryMaps: rcMaps,
      depTotals: depT,
      depSubDepTotals: depSub,
      depSubDepGenderTotals: depGen,
      updatedAtStr,
    };
  }, [reports]);

  return {
    loading,
    error,
    reports,
    totalCant,
    filesUrl,
    genderTotals,
    travelConditionTotals,
    ageGroupTotals,
    returnRouteTotals,
    returnCountryTotals,
    returnCountryMaps,
    depTotals,
    depSubDepTotals,
    depSubDepGenderTotals,
    updatedAtStr,
  };
}
