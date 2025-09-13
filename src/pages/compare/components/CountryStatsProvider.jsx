// CountryStatsProvider.jsx (o .tsx)
import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
// Si usas Next, puedes tener import { useRouter } from 'next/router';  // <- ya NO lo usaremos para variables

import StatisticsContext from '../../country/components/statistics/context';

// 🔁 Usa tus queries reales aquí:
import { GET_GENDER_TOTALS } from '../../../utils/query/gender';
import { GET_TRAVEL_CONDITION_TOTALS } from '../../../utils/query/travelCondition';
import { GET_AGE_GROUP_TOTALS } from '../../../utils/query/ageGroups';
import { GET_RETURN_ROUTE_TOTALS } from '../../../utils/query/returnRoute';
import { GET_RETURN_COUNTRY_TOTALS } from '../../../utils/query/returnCountry';
import { GET_HEATMAP_TOTALS } from '../../../utils/query/heatmap'; // dep/muni

// Mapa para el HeatMap
const COUNTRYID_BY_INPUT = {
  guatemala: 'gt',
  honduras: 'hn',
  elsalvador: 'sv',
  gt: 'gt',
  hn: 'hn',
  sv: 'sv',
  GT: 'gt',
  HN: 'hn',
  SV: 'sv',
};

export default function CountryStatsProvider({
  country,
  year,
  period,
  children,
}) {
  // 1) Resolver SIEMPRE desde props
  const resolved = useMemo(() => {
    const c = country ?? '';
    const y = typeof year === 'number' ? year : Number(year || 0);
    const p = Array.isArray(period) ? period : [];
    const [from, to] = p;
    return {
      country: c,
      year: y,
      from,
      to,
      countryID: COUNTRYID_BY_INPUT[c] ?? 'gt',
      canQuery: Boolean(c && y && from && to),
    };
  }, [country, year, period]);

  // Opcional: para verificar que entra lo correcto
  // console.debug('[CountryStatsProvider vars]', resolved);

  // 2) Usa resolved.* en TODAS tus queries internas
  const { data: genderData, loading: l1 } = useQuery(GET_GENDER_TOTALS, {
    variables: {
      country: resolved.country,
      year: resolved.year,
      from: resolved.from,
      to: resolved.to,
    },
    skip: !resolved.canQuery,
    notifyOnNetworkStatusChange: true,
  });

  const { data: travelData, loading: l2 } = useQuery(
    GET_TRAVEL_CONDITION_TOTALS,
    {
      variables: {
        country: resolved.country,
        year: resolved.year,
        from: resolved.from,
        to: resolved.to,
      },
      skip: !resolved.canQuery,
      notifyOnNetworkStatusChange: true,
    }
  );

  const { data: ageData, loading: l3 } = useQuery(GET_AGE_GROUP_TOTALS, {
    variables: {
      country: resolved.country,
      year: resolved.year,
      from: resolved.from,
      to: resolved.to,
    },
    skip: !resolved.canQuery,
    notifyOnNetworkStatusChange: true,
  });

  const { data: routeData, loading: l4 } = useQuery(GET_RETURN_ROUTE_TOTALS, {
    variables: {
      country: resolved.country,
      year: resolved.year,
      from: resolved.from,
      to: resolved.to,
    },
    skip: !resolved.canQuery,
    notifyOnNetworkStatusChange: true,
  });

  const { data: retCountryData, loading: l5 } = useQuery(
    GET_RETURN_COUNTRY_TOTALS,
    {
      variables: {
        country: resolved.country,
        year: resolved.year,
        from: resolved.from,
        to: resolved.to,
      },
      skip: !resolved.canQuery,
      notifyOnNetworkStatusChange: true,
    }
  );

  const { data: heatData, loading: l6 } = useQuery(GET_HEATMAP_TOTALS, {
    variables: {
      country: resolved.country,
      year: resolved.year,
      from: resolved.from,
      to: resolved.to,
    },
    skip: !resolved.canQuery,
    notifyOnNetworkStatusChange: true,
  });

  const loading = !resolved.canQuery || l1 || l2 || l3 || l4 || l5 || l6;

  // 3) Transforma *tus* respuestas a las claves del contexto que ya esperan los componentes
  //    (No inventes nada nuevo; usa tus utilidades/agregadores actuales)
  const genderTotals = useMemo(() => {
    // 👇 adapta a tu shape real:
    // Ej: genderData?.genderTotals = { masculino: n, femenino: n, otros: n }
    return genderData?.genderTotals ?? { masculino: 0, femenino: 0, otros: 0 };
  }, [genderData]);

  const travelConditionTotals = useMemo(() => {
    // Ej: travelData?.travelConditionTotals = { 'acompañado': n, 'no acompañado': n, 'otros': n }
    return (
      travelData?.travelConditionTotals ?? {
        acompañado: 0,
        'no acompañado': 0,
        otros: 0,
      }
    );
  }, [travelData]);

  const ageGroupTotals = useMemo(() => {
    // Ej: ageData?.ageGroupTotals = { 'primera infancia': n, 'niñez': n, 'adolescencia': n, 'no registrados': n }
    return (
      ageData?.ageGroupTotals ?? {
        'primera infancia': 0,
        niñez: 0,
        adolescencia: 0,
        'no registrados': 0,
      }
    );
  }, [ageData]);

  const returnRouteTotals = useMemo(() => {
    // Ej: routeData?.returnRouteTotals = { aéreo: n, terrestre: n, marítimo: n }
    return (
      routeData?.returnRouteTotals ?? { aéreo: 0, terrestre: 0, marítimo: 0 }
    );
  }, [routeData]);

  const returnCountryTotals = useMemo(() => {
    // Ej: retCountryData?.returnCountryTotals = { 'Estados Unidos': n, 'México': n, ... }
    return retCountryData?.returnCountryTotals ?? {};
  }, [retCountryData]);

  const returnCountryMaps = useMemo(() => {
    // Ej: retCountryData?.returnCountryMaps = { 'Estados Unidos': 'https://...', ... }
    return retCountryData?.returnCountryMaps ?? {};
  }, [retCountryData]);

  const depTotals = useMemo(() => {
    // Ej: heatData?.depTotals = { 'san_marcos': n, ... } (normalizado como espera HeatMap)
    return heatData?.depTotals ?? {};
  }, [heatData]);

  const depSubDepTotals = useMemo(() => {
    // Ej: heatData?.depSubDepTotals = { 'san_marcos': { 'San Pedro': n, ... }, ... }
    return heatData?.depSubDepTotals ?? {};
  }, [heatData]);

  const depSubDepGenderTotals = useMemo(() => {
    // Ej: heatData?.depSubDepGenderTotals = { 'san_marcos': { masculino: n, femenino: n, ... }, ... }
    return heatData?.depSubDepGenderTotals ?? {};
  }, [heatData]);

  return (
    <StatisticsContext.Provider
      value={{
        loading,
        countryID: resolved.countryID,
        genderTotals,
        travelConditionTotals,
        ageGroupTotals,
        returnRouteTotals,
        depTotals,
        depSubDepTotals,
        depSubDepGenderTotals,
        returnCountryTotals,
        returnCountryMaps,
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
}
