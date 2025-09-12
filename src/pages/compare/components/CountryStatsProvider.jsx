import React, { useMemo } from 'react';
import StatisticsContext from '../../country/components/statistics/context';
import useCountryStats from '../../../hooks/useCountryStats'; // <-- ajusta ruta

const slugToID = (slug = '') => {
  const s = slug.toLowerCase();
  if (s === 'guatemala') return 'gt';
  if (s === 'honduras') return 'hn';
  if (s === 'elsalvador') return 'sv';
  return 'gt';
};

export default function CountryStatsProvider({
  countrySlug,
  year,
  period,
  children,
}) {
  const countryID = slugToID(countrySlug);

  const {
    reports,
    loading,
    totalCant,
    filesUrl,
    updatedAtStr,
    genderTotals,
    travelConditionTotals,
    ageGroupTotals,
    returnRouteTotals,
    returnCountryTotals,
    returnCountryMaps,
    depTotals,
    depSubDepTotals,
    depSubDepGenderTotals,
  } = useCountryStats({ country: countryID, year, period });

  const value = useMemo(
    () => ({
      // Nota: en Compare no controlamos screenshot aún
      isScreenShotTime: false,
      setIsScreenShotTime: () => {},
      reports,
      loading,
      period,
      year,
      countryID,
      totalCant,
      filesUrl,
      updatedAtStr,
      genderTotals,
      travelConditionTotals,
      ageGroupTotals,
      returnRouteTotals,
      returnCountryTotals,
      returnCountryMaps,
      depTotals,
      depSubDepTotals,
      depSubDepGenderTotals,
    }),
    [
      reports,
      loading,
      period,
      year,
      countryID,
      totalCant,
      filesUrl,
      updatedAtStr,
      genderTotals,
      travelConditionTotals,
      ageGroupTotals,
      returnRouteTotals,
      returnCountryTotals,
      returnCountryMaps,
      depTotals,
      depSubDepTotals,
      depSubDepGenderTotals,
    ]
  );

  return (
    <StatisticsContext.Provider value={value}>
      {children}
    </StatisticsContext.Provider>
  );
}
