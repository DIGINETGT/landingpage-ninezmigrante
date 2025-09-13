// pages/.../mexico/index.jsx
import React, { useState, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Image,
  Grid,
  GridItem,
  Divider,
} from '@chakra-ui/react';

import MapaMexico from '../../../../../assets/MapaMexico.png';

import { year as defaultYear } from '../../../../../utils/year';
import LastDate from '../../../../../components/lastUpdate';
import YearSelect from '../../../../../components/yearSelect';
import MonthPicker from '../../../../../components/monthPicker';
import StatisticsContext from '../../../../../pages/country/components/statistics/context';
import { useDetainedMexico } from './hooks';
import { monthNames } from '../../../../../hooks/fetch';
import DownloadTable from '../../../../country/components/statistics/components/downloadTable';
import BigStat from '../../../../../components/common/BigStat';
import Gender from '../../../../../pages/country/components/statistics/components/gender';
import AgeRanges from '../../../../../pages/country/components/statistics/components/ageRanges';
import TravelCondition from '../../../../../pages/country/components/statistics/components/travelCondition';
import GraphFooter from '../../../../../components/graphFooter';
import Loader from '../../../../../components/loader';

const Mexico = () => {
  const { countryID } = useParams(); // "gt" | "hn" | "sv"

  const [period, setPeriod] = useState([]);
  const [currentYear, setCurrentYear] = useState('');
  const [isScreenShotTime] = useState(false);
  const containerRef = useRef(null);

  // normaliza a números
  const handleMonth = (range) =>
    setPeriod(Array.isArray(range) ? range.map((n) => Number(n)) : []);
  const handleYear = (ev) =>
    setCurrentYear(ev.target.value ? Number(ev.target.value) : '');

  const selectedYear = useMemo(
    () => Number(currentYear || defaultYear),
    [currentYear]
  );

  const { dataPerMonth, updateDate, files, loading } = useDetainedMexico({
    period,
    currentYear: selectedYear, // número
    registrar: countryID, // ← filtra por quién registró (GT/HN/SV)
  });

  // Totales/Desagregados
  const baseTotal = Number(dataPerMonth?.totalMes ?? 0);
  const acd = Number(dataPerMonth?.acd ?? 0);
  const noAcd = Number(dataPerMonth?.noAcd ?? 0);
  const f = Number(dataPerMonth?.female ?? 0);
  const m = Number(dataPerMonth?.male ?? 0);
  const f1 = Number(dataPerMonth?.f1 ?? 0);
  const f2 = Number(dataPerMonth?.f2 ?? 0);
  const f3 = Number(dataPerMonth?.f3 ?? 0);

  // Contexto para los gráficos
  const genderTotals = useMemo(
    () => ({ femenino: f, masculino: m, otros: 0 }),
    [f, m]
  );
  const travelConditionTotals = useMemo(
    () => ({ acompañado: acd, 'no acompañado': noAcd, otros: 0 }),
    [acd, noAcd]
  );
  const ageGroupTotals = useMemo(
    () => ({
      'primera infancia': f1,
      niñez: f2,
      adolescencia: f3,
      'no registrados': 0,
    }),
    [f1, f2, f3]
  );

  // Etiquetas y estados
  const [fromM, toM] = period || [];
  const hasSelection = Number.isFinite(selectedYear) && fromM && toM;
  const periodLabel = hasSelection
    ? fromM === toM
      ? `${monthNames[fromM]} - ${selectedYear}`
      : `${monthNames[fromM]} - ${monthNames[toM]} ${selectedYear}`
    : '';

  const hasData =
    baseTotal > 0 || acd > 0 || noAcd > 0 || f > 0 || m > 0 || f2 > 0 || f3 > 0;

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
          Fuente: Secretaría de Gobernación/Unidad de Política Migratoria,
          Registro e Identidad de Personas. Gobierno de México.
        </Text>
      </a>
    </Stack>
  );

  return (
    <Box width='100%' padding={{ base: '24px 40px', md: '80px 40px' }}>
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
              REPORTADOS POR MÉXICO
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

        {/* Estadísticas */}
        <StatisticsContext.Provider
          value={{
            loading,
            genderTotals,
            travelConditionTotals,
            ageGroupTotals,
          }}
        >
          <Box ref={containerRef} padding='0'>
            <Box
              bg='#fff'
              borderRadius='16px'
              p={{ base: 4, md: 8 }}
              boxShadow='sm'
              position='relative'
            >
              <Loader loading={loading} />

              {!hasSelection && !loading ? (
                // Estado vacío (evita los “ceros”)
                <Stack alignItems='center' justifyContent='center' minH='260px'>
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
                  {/* Columna izquierda: mapa + total + subtotales */}
                  <GridItem>
                    <Stack spacing={5}>
                      <Image
                        src={MapaMexico}
                        maxW='320px'
                        w='100%'
                        mx={{ base: 'auto', lg: '0' }}
                      />

                      <Stack spacing={1}>
                        <Text fontFamily='Oswald' fontSize='xl' opacity={0.8}>
                          {periodLabel ? `Total ${periodLabel}` : 'Total'}
                        </Text>
                        <BigStat
                          value={Number.isFinite(baseTotal) ? baseTotal : 0}
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
                              value={acd}
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
                              value={noAcd}
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

                  {/* Columna derecha: 3 tarjetas (Sexo / Condición / Rangos) */}
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
                        <Box
                          bg='gray.50'
                          border='1px solid'
                          borderColor='gray.200'
                          borderRadius='xl'
                          p={4}
                          w='100%'
                        >
                          <Gender />
                        </Box>

                        <Box
                          bg='gray.50'
                          border='1px solid'
                          borderColor='gray.200'
                          borderRadius='xl'
                          p={4}
                          w='100%'
                        >
                          <TravelCondition />
                        </Box>

                        <GridItem colSpan={{ base: 1, md: 2 }}>
                          <Box
                            bg='gray.50'
                            border='1px solid'
                            borderColor='gray.200'
                            borderRadius='xl'
                            p={4}
                            w='100%'
                          >
                            <AgeRanges disableFirstAge />
                          </Box>
                        </GridItem>
                      </Grid>
                    )}
                  </GridItem>
                </Grid>
              )}
            </Box>

            {/* Fuentes y descargas */}
            <LastDate
              sources={sources}
              updateDate={updateDate}
              isScreenShotTime={isScreenShotTime}
            />
            <DownloadTable files={files} satisticsRef={containerRef} />
            {isScreenShotTime && <GraphFooter responsive />}
          </Box>
        </StatisticsContext.Provider>
      </Stack>
    </Box>
  );
};

export default Mexico;
