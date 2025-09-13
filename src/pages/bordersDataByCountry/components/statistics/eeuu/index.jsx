import React, { useState, useRef, useMemo } from 'react';
import {
  Box,
  Stack,
  Text,
  Image,
  Grid,
  GridItem,
  Divider,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import MapaEEUU from '../../../../../assets/MapaEEUU.png';
import { year as defaultYear } from '../../../../../utils/year';
import LastDate from '../../../../../components/lastUpdate';
import YearSelect from '../../../../../components/yearSelect';
import MonthPicker from '../../../../../components/monthPicker';
import GraphFooter from '../../../../../components/graphFooter';
import DownloadTable from '../../../../country/components/statistics/components/downloadTable';
import Loader from '../../../../../components/loader';
import { monthNames } from '../../../../../hooks/fetch';
import BigStat from '../../../../../components/common/BigStat';

// Hook que ya hiciste
import { useUSDetained } from './hooks';

// --- helpers de UI ---
const sectorLabels = {
  sanDiego: 'San Diego',
  elCentro: 'El Centro',
  yuma: 'Yuma',
  tucson: 'Tucson',
  elPaso: 'El Paso',
  bigBend: 'Big Bend',
  delRio: 'Del Río',
  laredo: 'Laredo',
  rioGrande: 'Río Grande',
};

function labelFor(key = '') {
  // intenta mapear; si no, capitaliza
  if (sectorLabels[key]) return sectorLabels[key];
  const s = String(key)
    .replace(/([A-Z])/g, ' $1')
    .trim(); // camelCase -> spaced
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function StatGroup({ title, data = {}, totalKey }) {
  const total = Number(data?.[totalKey] ?? 0);

  // Filas de sectores > 0 (ocultamos los 0 para no saturar)
  const rows = Object.entries(data || {})
    .filter(([k]) => k !== totalKey)
    .filter(([, v]) => Number(v) > 0);

  const hasRows = rows.length > 0;

  return (
    <Box
      bg='gray.50'
      border='1px solid'
      borderColor='gray.200'
      borderRadius='xl'
      p={4}
      w='100%'
    >
      <Stack spacing={3}>
        <Text fontFamily='Oswald' fontSize='2xl' lineHeight='1'>
          {title}
        </Text>

        <Stack spacing={0}>
          <Text fontFamily='Montserrat Medium' fontSize='sm' opacity={0.7}>
            Total
          </Text>
          <BigStat
            value={total}
            compactFrom={10000}
            mode='long'
            withTooltip={false}
            numberProps={{
              fontFamily: 'Oswald',
              fontSize: { base: '3xl', md: '4xl' },
              lineHeight: '1',
              fontWeight: 600,
            }}
          />
        </Stack>

        <Divider />

        {hasRows ? (
          <Stack spacing={2}>
            {rows.map(([k, v]) => (
              <Stack
                key={k}
                direction='row'
                alignItems='baseline'
                justifyContent='space-between'
              >
                <Text fontFamily='Montserrat Medium' fontSize='md'>
                  {labelFor(k)}
                </Text>
                <Text fontFamily='Montserrat Medium' fontSize='md'>
                  {v}
                </Text>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Text fontFamily='Montserrat Medium' fontSize='sm' opacity={0.6}>
            Sin datos para el rango seleccionado
          </Text>
        )}
      </Stack>
    </Box>
  );
}

const EEUU = () => {
  const [currentYear, setCurrentYear] = useState('');
  const [period, setPeriod] = useState([]); // [from, to] como números 1..12
  const [isScreenShotTime, setIsScreenShotTime] = useState(false);

  const { countryID } = useParams(); // "gt" | "hn" | "sv"
  const containerRef = useRef(null);

  // Normaliza a números
  const handleMonth = (range) =>
    setPeriod(Array.isArray(range) ? range.map((n) => Number(n)) : []);
  const handleYear = (ev) =>
    setCurrentYear(ev.target.value ? Number(ev.target.value) : '');

  const selectedYear = useMemo(
    () => Number(currentYear || defaultYear),
    [currentYear]
  );

  const { dataPerMonth, dataPerDeps, loading, updateDate, files } =
    useUSDetained({
      countryName: 'Estados Unidos',
      registrar: countryID,
      year: selectedYear,
      period,
    });

  const [fromM, toM] = period || [];
  const hasSelection = Number.isFinite(selectedYear) && fromM && toM;
  const periodLabel = hasSelection
    ? fromM === toM
      ? `${monthNames[fromM]} - ${selectedYear}`
      : `${monthNames[fromM]} - ${monthNames[toM]} ${selectedYear}`
    : '';

  const sources = (
    <Stack
      width='100%'
      margin='auto'
      direction='column'
      alignItems='center'
      justifyContent='center'
      maxWidth='800px'
    >
      <a
        href='https://www.cbp.gov/newsroom/stats/southwest-land-border-encounters-by-component'
        target='_blank'
        rel='noreferrer'
      >
        <Text
          textAlign='center'
          fontFamily='Oswald'
          fontSize={{ base: 'xl', md: '2xl' }}
          maxWidth='800px'
        >
          Fuente: U.S. CUSTOMS AND BORDER PATROL
        </Text>
      </a>
    </Stack>
  );

  // ¿hay datos?
  const hasData =
    Number(dataPerMonth?.totalMes ?? 0) > 0 ||
    Object.values(dataPerDeps?.acm || {}).some((v) => Number(v) > 0) ||
    Object.values(dataPerDeps?.noacm || {}).some((v) => Number(v) > 0);

  return (
    <Box width='100%' padding='40px'>
      <Stack
        gap='24px'
        width='100%'
        margin='auto'
        maxWidth='1100px'
        direction='column'
        alignItems='center'
        justifyContent='center'
      >
        {/* Encabezado */}
        <Stack
          width='100%'
          alignItems='center'
          direction={{ base: 'column', md: 'row' }}
          justifyContent={{ base: 'center', md: 'space-between' }}
          gap={4}
        >
          <Stack width={{ base: '100%', md: '50%' }}>
            <Text fontFamily='Oswald' fontSize='2xl' lineHeight='1'>
              {selectedYear}
            </Text>
            <Text
              fontSize='4xl'
              fontFamily='Oswald'
              lineHeight={{ base: '1.2', md: '1' }}
            >
              REPORTADOS POR EE.UU.
            </Text>
          </Stack>

          <Stack
            width={{ base: '100%', md: '50%' }}
            direction={{ base: 'column', md: 'row' }}
            gap={3}
          >
            <YearSelect handleYear={handleYear} currentYear={currentYear} />
            <MonthPicker onAccept={handleMonth} />
          </Stack>
        </Stack>

        {/* Contenedor principal */}
        <Box ref={containerRef} padding='0'>
          <Box
            bg='#fff'
            borderRadius='16px'
            p={{ base: 4, md: 8 }}
            boxShadow='sm'
            position='relative'
          >
            <Loader loading={loading} />

            {/* Estado vacío antes de elegir */}
            {!hasSelection && !loading ? (
              <Stack
                alignItems='center'
                justifyContent='center'
                minH='260px'
                spacing={2}
              >
                <Text fontFamily='Oswald' fontSize='2xl'>
                  Selecciona año y mes para ver los datos
                </Text>
                <Text fontFamily='Montserrat Medium' opacity={0.7}>
                  Arriba puedes elegir el año y el rango de meses.
                </Text>
              </Stack>
            ) : (
              <Grid
                templateColumns={{ base: '1fr', lg: '360px 1fr' }}
                gap={{ base: 6, md: 8 }}
                alignItems='start'
              >
                {/* Columna izquierda: mapa + total */}
                <GridItem>
                  <Stack spacing={5}>
                    <Image
                      src={MapaEEUU}
                      maxW='320px'
                      w='100%'
                      mx={{ base: 'auto', lg: '0' }}
                    />
                    <Stack spacing={1}>
                      <Text fontFamily='Oswald' fontSize='xl' opacity={0.8}>
                        {periodLabel ? `Total ${periodLabel}` : 'Total'}
                      </Text>
                      <BigStat
                        value={dataPerMonth?.totalMes ?? 0}
                        compactFrom={10000}
                        mode='long'
                        withTooltip={false}
                        numberProps={{
                          fontFamily: 'Oswald',
                          fontSize: { base: '5xl', md: '6xl' },
                          lineHeight: '1',
                          fontWeight: 700,
                        }}
                      />
                      <Stack direction='row' spacing={6} pt={1}>
                        <Stack spacing={0}>
                          <Text
                            fontFamily='Montserrat Medium'
                            fontSize='sm'
                            opacity={0.7}
                          >
                            Acompañados
                          </Text>
                          <BigStat
                            value={dataPerMonth?.totalAcompaniados ?? 0}
                            compactFrom={10000}
                            mode='long'
                            withTooltip={false}
                            numberProps={{
                              fontFamily: 'Oswald',
                              fontSize: '2xl',
                              lineHeight: '1',
                              fontWeight: 600,
                            }}
                          />
                        </Stack>
                        <Stack spacing={0}>
                          <Text
                            fontFamily='Montserrat Medium'
                            fontSize='sm'
                            opacity={0.7}
                          >
                            No acompañados
                          </Text>
                          <BigStat
                            value={dataPerMonth?.totalNoAcompaniados ?? 0}
                            compactFrom={10000}
                            mode='long'
                            withTooltip={false}
                            numberProps={{
                              fontFamily: 'Oswald',
                              fontSize: '2xl',
                              lineHeight: '1',
                              fontWeight: 600,
                            }}
                          />
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                </GridItem>

                {/* Columna derecha: dos tarjetas en grid */}
                <GridItem>
                  {!hasData && !loading ? (
                    <Stack
                      alignItems='center'
                      justifyContent='center'
                      minH='200px'
                    >
                      <Text fontFamily='Montserrat Medium' opacity={0.7}>
                        Sin datos para el rango seleccionado.
                      </Text>
                    </Stack>
                  ) : (
                    <Grid
                      templateColumns={{ base: '1fr', md: '1fr 1fr' }}
                      gap={4}
                    >
                      <StatGroup
                        title='Acompañados'
                        data={dataPerDeps?.acm}
                        totalKey='totalAcompañados'
                      />
                      <StatGroup
                        title='No acompañados'
                        data={dataPerDeps?.noacm}
                        totalKey='totalNoAcompañados'
                      />
                    </Grid>
                  )}
                </GridItem>
              </Grid>
            )}
          </Box>

          {/* Fuentes / descargas / footer */}
          <LastDate
            sources={sources}
            updateDate={updateDate}
            isScreenShotTime={isScreenShotTime}
          />
          {!isScreenShotTime && (
            <DownloadTable files={files} satisticsRef={containerRef} />
          )}
          {isScreenShotTime && <GraphFooter responsive />}
        </Box>
      </Stack>
    </Box>
  );
};

export default EEUU;
