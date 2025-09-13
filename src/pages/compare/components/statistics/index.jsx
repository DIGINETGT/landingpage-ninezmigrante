import React, { useEffect, useMemo } from 'react';
import { Stack, Text } from '@chakra-ui/react';

import Gender from '../../../country/components/statistics/components/gender';
import AgeRanges from '../../../country/components/statistics/components/ageRanges';
import TravelCondition from '../../../country/components/statistics/components/travelCondition';
import ReturnPath from '../../../country/components/statistics/components/returnPath';
import ReturnCountry from '../../../country/components/statistics/components/returnCountry';
import HeatMap from '../../../country/components/statistics/components/heatMap';

import StatisticsContext from '../../../country/components/statistics/context';

// 🔹 Usa el MISMO hook que en la vista país
import useCountryStats from '../../../../hooks/useCountryStats';

import { monthNames } from '../../../../hooks/fetch';
import { dateToString } from '../../../../utils/tools';

// helper para country → countryID que consumen tus mapas ('gt'|'hn'|'sv')
const toCountryID = (c) => {
  const m = {
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
  return m[c] ?? 'gt';
};

// (opcional) si quieres un periodId estable cuando la API no lo provee
const buildFallbackPeriodId = (year, period) => {
  if (year && Array.isArray(period) && period[0] && period[1]) {
    return `${year}-${period[0]}-${period[1]}`;
  }
  return null;
};

const Statistics = ({ data, setUpdateDate, id, setFiles, setPeriodId }) => {
  // Validación básica
  const canQuery = !!(
    data?.country &&
    data?.year &&
    Array.isArray(data?.period) &&
    data.period[0] &&
    data.period[1]
  );

  // countryID que entiende el hook (gt|hn|sv)
  const countryID = toCountryID(data?.country);

  // 🔹 Trae los mismos agregados que en la vista país
  const {
    reports,
    loading,
    totalCant, // si quieres usar este total en vez del que calculabas a mano
    filesUrl, // array de archivos/fuentes
    updatedAtStr, // string ya formateado
    genderTotals,
    travelConditionTotals,
    ageGroupTotals,
    returnRouteTotals,
    returnCountryTotals,
    returnCountryMaps,
    depTotals,
    depSubDepTotals,
    depSubDepGenderTotals,
  } = useCountryStats({
    country: countryID,
    year: data?.year,
    period: data?.period,
  });

  // 🔹 Sube metadata al padre (igual que lo hacías antes)
  useEffect(() => {
    if (!canQuery) return;

    // fecha de actualización
    if (updatedAtStr) setUpdateDate(updatedAtStr);

    // archivos
    if (Array.isArray(filesUrl)) {
      setFiles((prev) => ({ ...prev, [id]: filesUrl }));
    }

    // periodId (si lo manejas a nivel padre)
    const fallback = buildFallbackPeriodId(data?.year, data?.period);
    if (typeof setPeriodId === 'function') {
      setPeriodId(fallback);
    }
  }, [
    canQuery,
    updatedAtStr,
    filesUrl,
    id,
    setFiles,
    setUpdateDate,
    setPeriodId,
    data?.year,
    data?.period,
  ]);

  // Puedes seguir mostrando tu total calculado, o usar totalCant del hook
  const totalAmount = useMemo(() => Number(totalCant || 0), [totalCant]);

  // periodId para el HeatMap: usa el que levantas al padre o un fallback local
  const periodId = buildFallbackPeriodId(data?.year, data?.period) || '1'; // ajusta si tienes uno real

  if (!canQuery) {
    return (
      <Stack spacing='16px' alignItems='center'>
        <Text fontSize='lg'>Selecciona país, año y periodo.</Text>
      </Stack>
    );
  }

  return (
    <Stack spacing='40px'>
      <Stack
        spacing='16px'
        alignItems='center'
        justifyContent='center'
        direction={{ base: 'column', md: 'column' }}
      >
        <Text
          lineHeight='1'
          fontFamily='Oswald'
          textAlign='center'
          fontSize={{ base: '4xl', md: '6xl' }}
        >
          {data.country === 'guatemala' && 'GUATEMALA'}
          {data.country === 'honduras' && 'HONDURAS'}
          {data.country === 'elsalvador' && 'EL SALVADOR'}
        </Text>

        <Text
          lineHeight='1'
          fontSize='2xl'
          textAlign='center'
          fontFamily='Oswald'
        >
          Total de niñez migrante retornada
        </Text>

        <Text
          fontSize='xl'
          lineHeight='1'
          fontWeight='600'
          fontFamily='Times'
          textAlign={{ base: 'center', md: 'left' }}
        >
          {`${monthNames[data.period?.[0]]} - ${
            monthNames[data.period?.[1]]
          } - ${data.year ?? ''}`}
        </Text>

        <Text
          fontFamily='Oswald'
          fontSize={{ base: '6xl', md: '7xl' }}
          lineHeight='1'
        >
          {totalAmount ?? 0}
        </Text>
      </Stack>

      {loading ? (
        <Stack
          gap='40px'
          width='100%'
          margin='auto'
          maxWidth='800px'
          justifyContent='space-between'
          direction={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'center', md: 'flex-start' }}
        >
          <Text
            width='100%'
            fontSize='3xl'
            fontWeight='bold'
            textAlign='center'
          >
            Generando gráficas ...
          </Text>
        </Stack>
      ) : (
        // 🔹 Provider con el MISMO shape que en la vista país
        <StatisticsContext.Provider
          value={{
            isScreenShotTime: false,
            setIsScreenShotTime: () => {},
            reports,
            loading,
            period: data.period,
            year: data.year,
            countryID, // <- IMPORTANTE para HeatMap
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
          }}
        >
          <Gender />
          <TravelCondition />
          <AgeRanges />
          <ReturnPath />
          <ReturnCountry />
          <HeatMap
            period={data.period}
            year={data.year}
            files={filesUrl} // usa los del hook (misma forma que en país)
            periodId={periodId} // valor (no el setter)
          />
        </StatisticsContext.Provider>
      )}
    </Stack>
  );
};

export default Statistics;
