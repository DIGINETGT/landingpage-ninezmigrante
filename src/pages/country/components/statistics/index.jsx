// Statistics.jsx
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Divider,
  Skeleton,
  VisuallyHidden,
  usePrefersReducedMotion,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

import GraphFooter from '../../../../components/graphFooter';
import LastDate from '../../../../components/lastUpdate';
import TravelCondition from './components/travelCondition';
import ReturnCountry from './components/returnCountry';
import DownloadTable from './components/downloadTable';
import HeatMap from './components/heatMap';
import ReturnPath from './components/returnPath';
import AgeRanges from './components/ageRanges';
import Gender from './components/gender';
import { year as currentYear } from '../../../../utils/year';
import { monthNames } from '../../../../hooks/fetch';
import StatisticsContext from './context';
import getCountryContent from '../../../../utils/country';
import useCountryStats from '../../../../hooks/useCountryStats';
import { dateToString } from '../../../../utils/tools';
import Loader from '../../../../components/loader';
import BigStat from '../../../../components/common/BigStat';

const Statistics = React.forwardRef(function Statistics(props, forwardedRef) {
  const {
    period,
    year,
    shouldScroll = false,
    onScrolled,
    onLoadingChange,
  } = props;
  const prefersReducedMotion = usePrefersReducedMotion();
  const { countryID } = useParams();
  const [isScreenShotTime, setIsScreenShotTime] = useState(false);

  // Ref interna para leer el DOM y exponerla al padre
  const resultsRef = useRef(null);
  useImperativeHandle(forwardedRef, () => resultsRef.current);

  // Carga de datos
  const {
    reports,
    loading,
    demographicsLoading,
    returnsLoading,
    mapLoading,
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
    error,
  } = useCountryStats({ country: countryID, year, period });

  // Notifica loading al padre
  useEffect(() => {
    onLoadingChange && onLoadingChange(loading);
  }, [loading, onLoadingChange]);

  // Scroll INMEDIATO cuando se solicita (muestra skeletons abajo)
  useEffect(() => {
    if (shouldScroll && resultsRef.current) {
      requestAnimationFrame(() => {
        resultsRef.current.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
          inline: 'nearest',
        });
        onScrolled && onScrolled();
      });
    }
  }, [shouldScroll, prefersReducedMotion, onScrolled]);

  // Respaldo: scroll cuando termina de cargar (por si el anterior no corrió)
  useEffect(() => {
    if (!loading && shouldScroll && resultsRef.current) {
      requestAnimationFrame(() => {
        resultsRef.current.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
          inline: 'nearest',
        });
        onScrolled && onScrolled();
      });
    }
  }, [loading, shouldScroll, prefersReducedMotion, onScrolled]);

  const updateDate = useMemo(() => {
    const firstUpdated = reports?.[0]?.attributes?.updatedAt;
    return dateToString(firstUpdated ? new Date(firstUpdated) : new Date(0));
  }, [reports]);

  const sources = (
    <Box direction='column' margin='auto' maxWidth='800px'>
      {getCountryContent({
        countryID,
        content: {
          guatemala: (
            <Text
              lineHeight={1}
              textAlign='center'
              fontFamily='Oswald'
              fontSize={{ base: 'xl', md: '2xl' }}
            >
              Fuente: Instituto Guatemalteco de Migración
            </Text>
          ),
          honduras: (
            <Text
              lineHeight={1}
              textAlign='center'
              fontFamily='Oswald'
              fontSize={{ base: 'xl', md: '2xl' }}
            >
              Fuente: Dirección de Niñez, Adolescencia y Familia (DINAF)
            </Text>
          ),
          elsalvador: (
            <Text
              lineHeight={1}
              textAlign='center'
              fontFamily='Oswald'
              fontSize={{ base: 'xl', md: '2xl' }}
            >
              Dirección General de Migración y Extranjería El Salvador
            </Text>
          ),
        },
      })}
    </Box>
  );

  return (
    <StatisticsContext.Provider
      value={{
        isScreenShotTime,
        isCompareView: false,
        demographicsLoading,
        returnsLoading,
        mapLoading,
        setIsScreenShotTime,
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
      }}
    >
      <Box
        id='resultados'
        ref={resultsRef} // 👈 ref DOM interna
        padding={{ base: '40px 24px', md: '80px 40px' }}
        bgColor={isScreenShotTime ? '#fff' : '#eee'}
        scrollMarginTop={{ base: '80px', md: '112px' }}
        role='region'
        aria-label='Resultados de la consulta'
      >
        <Stack
          margin='auto'
          maxWidth='800px'
          alignItems='center'
          justifyContent='space-between'
          gap={{ base: '24px', md: '40px' }}
          direction={{ base: 'column', md: 'row' }}
          marginBottom={{ base: '40px', md: '80px' }}
        >
          <Stack direction='column' spacing='16px'>
            <Text
              lineHeight='1'
              fontFamily='Oswald'
              fontSize={{ base: '4xl', md: '6xl' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              {getCountryContent({ countryID, capitalize: true }).toUpperCase()}
            </Text>

            {loading && (
              <VisuallyHidden>
                Cargando total de niñez migrante retornada…
              </VisuallyHidden>
            )}

            <Text
              lineHeight='1'
              fontWeight='600'
              fontFamily='Times'
              fontSize={{ base: 'xl', md: '2xl' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              {monthNames[period[0]] ?? ''} - {monthNames[period[1]] ?? ''}{' '}
              {year ?? ''}
            </Text>
          </Stack>

          <Stack
            position='relative'
            height='100px'
            minW={{ base: 'auto', md: '260px' }}
            role='status'
            aria-live='polite'
            aria-atomic='true'
            aria-busy={loading || undefined}
          >
            {loading ? (
              <Skeleton height='80px' width='220px' borderRadius='md' />
            ) : (
              <BigStat
                value={totalCant}
                compactFrom={
                  isScreenShotTime ? Number.POSITIVE_INFINITY : 10_000
                }
                mode='long'
                showExactHelper
              />
            )}
          </Stack>
        </Stack>

        {loading && (
          <Stack
            gap='40px'
            width='100%'
            margin='auto'
            maxWidth='800px'
            alignItems='center'
          >
            <Text
              fontSize='large'
              textAlign='center'
              fontFamily={'Oswald'}
              color={'#3384a9'}
            >
              Generando gráficas… Esto puede tardar varios segundos para rangos
              grandes.
            </Text>
          </Stack>
        )}

        {!loading && error && (
          <Alert
            status='error'
            maxWidth='800px'
            margin='0 auto 32px'
            borderRadius='md'
            fontFamily='Montserrat'
          >
            <AlertIcon />
            No fue posible cargar la información para este período. Intenta
            nuevamente o revisa tu conexión.
          </Alert>
        )}

        <Stack opacity={loading ? 1 : 1} maxWidth='800px' margin='auto'>
          {loading ? (
            <Stack gap='40px' mb={{ base: '40px', md: '60px' }}>
              <Skeleton height='220px' borderRadius='lg' />
              <Skeleton height='220px' borderRadius='lg' />
              <Skeleton height='220px' borderRadius='lg' />
              <Skeleton height='300px' borderRadius='lg' />
              <Skeleton height='300px' borderRadius='lg' />
            </Stack>
          ) : (
            <>
              <Stack
                gap='40px'
                width='100%'
                margin='auto'
                maxWidth='800px'
                justifyContent='space-between'
                direction={{ base: 'column', md: 'row' }}
                marginBottom={{ base: '40px', md: '60px' }}
                alignItems={{ base: 'center', md: 'flex-start' }}
              >
                <Gender period={period} year={year} />
                <TravelCondition period={period} year={year} />
                <AgeRanges period={period} year={year} />
              </Stack>

              <Stack
                width='100%'
                margin='auto'
                maxWidth='800px'
                justifyContent='center'
                gap={{ base: '40px', md: '40px' }}
                direction={{ base: 'column', md: 'row' }}
                marginBottom={{ base: '40px', md: '60px' }}
                alignItems={{ base: 'center', md: 'flex-start' }}
              >
                <ReturnPath period={period} year={year} />
                <ReturnCountry period={period} year={year} />
              </Stack>
            </>
          )}
        </Stack>

        <Divider
          maxWidth='800px'
          borderWidth='1px'
          margin='40px auto'
          borderColor='black'
        />
        <Stack
          spacing={8}
          width='100%'
          margin='auto'
          maxWidth='800px'
          alignItems='center'
          marginBottom='40px'
          justifyContent='center'
          direction={{ base: 'column', md: 'row' }}
        >
          {mapLoading ? (
            <Stack width='100%' maxWidth='450px' spacing={4} alignItems='center'>
              <Text
                fontFamily='Oswald'
                fontSize='2xl'
                textAlign='center'
                color='blackAlpha.700'
              >
                Cargando departamento de origen...
              </Text>
              <Skeleton width='100%' height='420px' borderRadius='lg' />
            </Stack>
          ) : (
            <HeatMap files={filesUrl} period={period} year={year} periodId='1' />
          )}
        </Stack>

        <LastDate
          sources={sources}
          updateDate={updatedAtStr || updateDate}
          isScreenShotTime={isScreenShotTime}
        />

        {!loading && (
          <DownloadTable files={filesUrl} satisticsRef={resultsRef} />
        )}

        {isScreenShotTime && <GraphFooter responsive compact />}
      </Box>
    </StatisticsContext.Provider>
  );
});

export default Statistics;
