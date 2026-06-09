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
  Grid,
  SimpleGrid,
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
    <Box direction='column' margin='auto' maxWidth='920px'>
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
              Fuente: Secretaría de Niñez, Adolescencia y Familia (SENAF)
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
          maxWidth='920px'
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
                compactFrom={Number.POSITIVE_INFINITY}
                mode='long'
                showExactHelper={false}
              />
            )}
          </Stack>
        </Stack>

        {loading && (
          <Stack
            gap='40px'
            width='100%'
            margin='auto'
            maxWidth='920px'
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
            maxWidth='920px'
            margin='0 auto 32px'
            borderRadius='md'
            fontFamily='Montserrat'
          >
            <AlertIcon />
            No fue posible cargar la información para este período. Intenta
            nuevamente o revisa tu conexión.
          </Alert>
        )}

        <Stack opacity={loading ? 1 : 1} maxWidth='920px' margin='auto'>
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
              <Grid
                width='100%'
                margin='auto'
                maxWidth='920px'
                templateColumns={{
                  base: '1fr',
                  md: 'minmax(0, 0.82fr) minmax(0, 1.09fr) minmax(0, 1.09fr)',
                }}
                alignItems='start'
                columnGap={{ base: '32px', md: '36px' }}
                rowGap={{ base: '32px', md: '0' }}
                marginBottom={{ base: '40px', md: '60px' }}
              >
                <Gender period={period} year={year} />
                <TravelCondition period={period} year={year} />
                <AgeRanges period={period} year={year} />
              </Grid>

              <Grid
                width='100%'
                margin='auto'
                maxWidth='920px'
                templateColumns={{
                  base: '1fr',
                  md: 'minmax(0, 20%) minmax(0, 80%)',
                  lg: 'minmax(0, 20%) minmax(0, 80%)',
                }}
                alignItems='stretch'
                columnGap={{ base: '32px', md: '36px', lg: '40px' }}
                rowGap={{ base: '32px', md: '0' }}
                marginBottom={{ base: '40px', md: '60px' }}
              >
                <ReturnPath period={period} year={year} />
                <ReturnCountry period={period} year={year} />
              </Grid>
            </>
          )}
        </Stack>

        <Text
          as='h2'
          maxWidth='920px'
          margin='24px auto 0'
          textAlign='center'
          fontFamily='Oswald'
          fontSize={{ base: '2xl', md: '4xl' }}
          lineHeight={{ base: '1.05', md: '1' }}
          paddingX={{ base: '8px', md: '0' }}
        >
          NIÑEZ Y ADOLESCENCIA MIGRANTE RETORNADA
        </Text>

        <Divider
          maxWidth='920px'
          borderWidth='1px'
          margin='40px auto'
          borderColor='black'
        />
        <Stack
          spacing={8}
          width='100%'
          margin='auto'
          maxWidth='920px'
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
