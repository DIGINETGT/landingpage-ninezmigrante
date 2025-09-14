import React, { useState, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Image,
  Divider,
  Grid,
  GridItem,
  Skeleton,
} from '@chakra-ui/react';

import MonthPicker from '../../../../components/monthPicker';
import YearSelect from '../../../../components/yearSelect';
import GraphFooter from '../../../../components/graphFooter';
import LastDate from '../../../../components/lastUpdate';
import DownloadTable from '../../../country/components/statistics/components/downloadTable';
import Loader from '../../../../components/loader';
import BigStat from '../../../../components/common/BigStat';

import MapaHonduras from '../../../.../../../assets/MapaHonduras.svg';
import MapaElSalvador from '../../../../assets/MapaElSalvador.svg';
import MapaMexico from '../../../../assets/MapaMexico.png';
import MapaEEUU from '../../../../assets/MapaEEUU.png';
import MapaGuatemala from '../../../../assets/MapaGuatemala.png';

import { year as defaultYear } from '../../../../utils/year';
import getCountryContent from '../../../../utils/country';
import { monthNames } from '../../../../hooks/fetch';

import { useUSDetained } from '../statistics/eeuu/hooks';
import { useDetainedMexico } from '../statistics/mexico/hooks';

import useReturnedFilteredQuery from '../../../../hooks/query';
import { GET_RETURNEDS_BY_COUNTRY_FOR_TOTAL } from '../../../../utils/query/returned';

const Card = ({ children }) => (
  <Box
    bg='white'
    borderRadius='xl'
    boxShadow='sm'
    border='1px solid'
    borderColor='blackAlpha.200'
    p={{ base: 5, md: 6 }}
    minH='220px'
  >
    {children}
  </Box>
);

const StatNumber = ({ value, fontSize = { base: '4xl', md: '6xl' } }) => (
  <BigStat
    value={value}
    compactFrom={10000}
    mode='long'
    withTooltip={false}
    numberProps={{
      fontFamily: 'Oswald',
      fontSize,
      lineHeight: '1',
      fontWeight: 700,
    }}
  />
);

const Compare = () => {
  const { countryID } = useParams(); // gt | hn | sv
  const containerRef = useRef();

  const [currentYear, setCurrentYear] = useState('');
  const [currentPeriod, setCurrentPeriod] = useState([]); // [from, to]
  const [isScreenShotTime] = useState(false);

  const handleYear = (ev) =>
    setCurrentYear(ev.target.value ? Number(ev.target.value) : '');
  const handlePeriod = (range) =>
    setCurrentPeriod(Array.isArray(range) ? range.map(Number) : []);

  const selectedYear = useMemo(
    () => Number(currentYear || defaultYear),
    [currentYear]
  );

  const periodLabel = useMemo(() => {
    const [fromM, toM] = currentPeriod || [];
    if (!fromM || !toM) return 'Selecciona año y mes para ver los datos';
    return fromM === toM
      ? `${monthNames[fromM]} - ${selectedYear}`
      : `${monthNames[fromM]} - ${monthNames[toM]} ${selectedYear}`;
  }, [currentPeriod, selectedYear]);

  // EE.UU.
  const {
    dataPerMonth: dataUS,
    updateDate: updateDateUS,
    files: filesUs = [],
  } = useUSDetained({
    countryName: 'Estados Unidos',
    registrar: countryID,
    year: selectedYear,
    period: currentPeriod,
  });

  // México
  const {
    dataPerMonth: dataMx,
    updateDate: updateDateMX,
    files: filesMx = [],
  } = useDetainedMexico({
    period: currentPeriod,
    currentYear: selectedYear,
    registrar: countryID,
  });

  // Retornados (total por país destino)
  const filesRef = useRef([]);
  const { data: returnedData, loading } = useReturnedFilteredQuery({
    filesRef,
    year: selectedYear,
    period: currentPeriod,
    query: GET_RETURNEDS_BY_COUNTRY_FOR_TOTAL(
      countryID,
      currentPeriod,
      selectedYear
    ),
  });

  let totalCant = 0;
  returnedData?.forEach((r) => {
    totalCant += r.attributes?.returned?.data?.attributes?.total || 0;
  });

  const combinedFiles = [
    ...(filesMx || []),
    ...(filesUs || []),
    ...(filesRef.current || []),
  ];

  const updateDate = useMemo(() => {
    const toTime = (s) => (s ? new Date(s).getTime() : 0);
    return toTime(updateDateUS) >= toTime(updateDateMX)
      ? updateDateUS
      : updateDateMX;
  }, [updateDateUS, updateDateMX]);

  const countryMap = getCountryContent({
    countryID,
    content: {
      guatemala: MapaGuatemala,
      honduras: MapaHonduras,
      elsalvador: MapaElSalvador,
    },
  });

  const ready =
    Boolean(selectedYear) &&
    Array.isArray(currentPeriod) &&
    currentPeriod.length === 2;

  return (
    <Box width='100%' bgColor='#d9e8e8' padding={{ base: '24px', md: '40px' }}>
      <Stack
        width='100%'
        margin='auto'
        spacing='28px'
        maxWidth='1100px'
        alignItems='stretch'
      >
        {/* Header */}
        <Stack
          alignItems={{ base: 'stretch', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          justifyContent='space-between'
          gap={4}
        >
          <Text fontFamily='Oswald' fontSize={{ base: '3xl', md: '3xl' }}>
            COMPARAR DETENIDOS EN FRONTERA CON RETORNADOS
          </Text>

          <Stack
            direction={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'stretch', md: 'center' }}
            gap={3}
            minW={{ md: '460px' }}
          >
            <YearSelect currentYear={currentYear} handleYear={handleYear} />
            <MonthPicker onAccept={handlePeriod} />
          </Stack>
        </Stack>

        {/* Period label */}
        <Text
          fontFamily='Times'
          fontSize={{ base: 'lg', md: 'xl' }}
          textAlign='center'
          opacity={0.9}
        >
          {periodLabel}
        </Text>

        {/* Empty state */}
        {!ready && (
          <Card>
            <Stack
              alignItems='center'
              justifyContent='center'
              minH='220px'
              color='blackAlpha.700'
              textAlign='center'
            >
              <Text fontFamily='Oswald' fontSize={{ base: 'xl', md: '2xl' }}>
                Selecciona año y rango de meses
              </Text>
              <Text fontFamily='Montserrat' fontSize='md'>
                Arriba puedes elegir el año y el período para ver la
                comparación.
              </Text>
            </Stack>
          </Card>
        )}

        {/* Results */}
        {ready && (
          <Box ref={containerRef} position='relative'>
            <Loader loading={loading} />

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap={{ base: 4, md: 6 }}
            >
              {/* Retornados */}
              <GridItem>
                <Card>
                  <Stack direction='row' gap={4}>
                    <Image
                      src={countryMap}
                      alt='País de retorno'
                      boxSize={{ base: '80px', md: '100px' }}
                      objectFit='contain'
                    />
                    <Stack flex={1}>
                      <Text fontFamily='Oswald' fontSize='lg' opacity={0.85}>
                        Total de retornados a{' '}
                        {getCountryContent({
                          countryID,
                          capitalize: true,
                        }).toUpperCase()}
                      </Text>
                      <Text
                        fontFamily='Times'
                        fontSize='md'
                        opacity={0.9}
                        mb={2}
                      >
                        {selectedYear}
                      </Text>
                      <StatNumber value={totalCant} />
                    </Stack>
                  </Stack>
                </Card>
              </GridItem>

              {/* Estados Unidos */}
              <GridItem>
                <Card>
                  <Stack direction='row' gap={4}>
                    <Image
                      src={MapaEEUU}
                      alt='Estados Unidos'
                      boxSize={{ base: '80px', md: '100px' }}
                      objectFit='contain'
                    />
                    <Stack flex={1}>
                      <Text fontFamily='Oswald' fontSize='lg' opacity={0.85}>
                        Estados Unidos (detenidos en frontera)
                      </Text>
                      <Text
                        fontFamily='Times'
                        fontSize='md'
                        opacity={0.9}
                        mb={2}
                      >
                        {selectedYear}
                      </Text>
                      {loading ? (
                        <Skeleton height='48px' />
                      ) : (
                        <StatNumber value={dataUS?.totalMes ?? 'N/D'} />
                      )}
                    </Stack>
                  </Stack>
                </Card>
              </GridItem>

              {/* México */}
              <GridItem>
                <Card>
                  <Stack direction='row' gap={4}>
                    <Image
                      src={MapaMexico}
                      alt='México'
                      boxSize={{ base: '80px', md: '100px' }}
                      objectFit='contain'
                    />
                    <Stack flex={1}>
                      <Text fontFamily='Oswald' fontSize='lg' opacity={0.85}>
                        México (detenidos en frontera)
                      </Text>
                      <Text
                        fontFamily='Times'
                        fontSize='md'
                        opacity={0.9}
                        mb={2}
                      >
                        {selectedYear}
                      </Text>
                      {loading ? (
                        <Skeleton height='48px' />
                      ) : (
                        <StatNumber value={dataMx?.totalMes ?? 'N/D'} />
                      )}
                    </Stack>
                  </Stack>
                </Card>
              </GridItem>
            </Grid>

            {/* Separador visual */}
            <Divider my={{ base: 6, md: 8 }} borderColor='blackAlpha.400' />

            {/* Fuentes y descargas (NO tocar) */}
            <LastDate
              sources={
                <Stack
                  width='100%'
                  margin='auto'
                  direction='column'
                  alignItems='center'
                  justifyContent='center'
                  maxWidth='800px'
                >
                  <a
                    href='http://www.politicamigratoria.gob.mx/es/PoliticaMigratoria/Boletines_Estadisticos'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Text
                      textAlign='center'
                      fontFamily='Oswald'
                      fontSize={{ base: 'xl', md: '2xl' }}
                      maxWidth='800px'
                    >
                      Fuente: Secretaría de Gobernación/Unidad de Política
                      Migratoria, Registro e Identidad de Personas. Gobierno de
                      México.
                    </Text>
                  </a>
                </Stack>
              }
              updateDate={updateDate}
              isScreenShotTime={isScreenShotTime}
            />

            {!isScreenShotTime && (
              <DownloadTable
                satisticsRef={containerRef}
                files={combinedFiles}
              />
            )}
            {isScreenShotTime && <GraphFooter responsive />}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default Compare;
