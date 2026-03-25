import React, { useState, useRef, useEffect } from 'react';

import { Box, SimpleGrid, Stack, Text } from '@chakra-ui/react';

import SelectOptions from './components/selectOptions';
import Statistics from './components/statistics';
import DownloadTable from '../country/components/statistics/components/downloadTable';
import GraphFooter from '../../components/graphFooter';
import StatisticsContext from '../country/components/statistics/context';
import LastDate from '../../components/lastUpdate';

const shortMonthNames = [
  '',
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

const countryDisplayName = {
  gt: 'Guatemala',
  hn: 'Honduras',
  sv: 'El Salvador',
  guatemala: 'Guatemala',
  honduras: 'Honduras',
  elsalvador: 'El Salvador',
};

const formatSelectionLabel = (option = {}) => {
  const countryName = countryDisplayName[option?.country] || '';
  const year = option?.year;
  const startMonth = shortMonthNames[Number(option?.period?.[0]) || 1];
  const endMonth = shortMonthNames[Number(option?.period?.[1]) || 1];

  if (!countryName) return '';
  if (!year) return countryName;

  return `${countryName} | ${startMonth} - ${endMonth} ${year}`;
};

const slugify = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formatInt = (value = 0) => new Intl.NumberFormat('es-GT').format(value);
const formatGapPercentage = (value) => {
  if (value === null || Number.isNaN(value)) return 'Porcentaje no disponible';

  const roundedValue = value >= 100 ? Math.round(value) : value.toFixed(1);
  return `${roundedValue}% por encima de la menor selección`;
};

const ComparePage = () => {
  const [countValue, setCountValue] = useState('0');
  const [options, setOptions] = useState({
    1: { country: '', year: 0, period: [1, 1], files: [] },
    2: { country: '', year: 0, period: [1, 1], files: [] },
    3: { country: '', year: 0, period: [1, 1], files: [] },
  });

  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const [updateDate, setUpdateDate] = useState('');
  const [compareSummary, setCompareSummary] = useState({
    1: { total: null, loading: false },
    2: { total: null, loading: false },
    3: { total: null, loading: false },
  });
  const [files, setFiles] = useState({
    1: [],
    2: [],
    3: [],
  });
  const [periodId, setPeriodId] = useState('');

  const satisticsRef = useRef(null);

  const onChange = (id, data) => {
    setOptions((prevOptions) => ({ ...prevOptions, [id]: data }));
  };

  const compareFiles = [1, 2, 3].flatMap((key) => {
    const currentFiles = Array.isArray(files[key]) ? files[key] : [];
    const currentCountry = countryDisplayName[options[key]?.country] || '';
    const selectionLabel = formatSelectionLabel(options[key]);

    return currentFiles.map((file) => ({
      ...file,
      countryName: currentCountry,
      selectionLabel,
      downloadLabel: `REPORTE DE ${file?.name}${
        selectionLabel ? ` - ${selectionLabel}` : ''
      }`,
    }));
  });

  const imageFileName = (() => {
    const labels = [1, 2, 3]
      .map((key) => formatSelectionLabel(options[key]))
      .filter(Boolean)
      .map((label) => slugify(label));

    if (!labels.length) return 'comparacion.pdf';

    return `comparacion-${labels.join('__')}.pdf`;
  })();

  const selectionSummaries = [1, 2, 3]
    .slice(0, Number(countValue))
    .map((key) => ({
      key,
      shortLabel: `Selección ${key}`,
      label: formatSelectionLabel(options[key]),
      total: compareSummary[key]?.total,
      loading: compareSummary[key]?.loading,
    }))
    .filter((item) => item.label.length > 0);

  const readySummaries = selectionSummaries.filter(
    (item) => !item.loading && typeof item.total === 'number'
  );

  const highestSummary = readySummaries.length
    ? readySummaries.reduce((highest, current) =>
        current.total > highest.total ? current : highest
      )
    : null;

  const lowestSummary = readySummaries.length
    ? readySummaries.reduce((lowest, current) =>
        current.total < lowest.total ? current : lowest
      )
    : null;

  const gapSummary =
    highestSummary && lowestSummary
      ? highestSummary.total - lowestSummary.total
      : null;

  const gapPercentage =
    highestSummary &&
    lowestSummary &&
    typeof lowestSummary.total === 'number' &&
    lowestSummary.total > 0
      ? (gapSummary / lowestSummary.total) * 100
      : null;

  const selectedCountries = [1, 2, 3]
    .slice(0, Number(countValue))
    .map((key) => options[key]?.country)
    .filter(Boolean);

  const compareSources = Array.from(
    new Set(
      selectedCountries
        .map((country) => {
          if (country === 'gt' || country === 'guatemala') {
            return 'Fuente Guatemala: Instituto Guatemalteco de Migración -IGM-';
          }

          if (country === 'hn' || country === 'honduras') {
            return 'Fuente Honduras: DINAF';
          }

          return null;
        })
        .filter(Boolean)
    )
  );

  const compareMethodology = [
    selectedCountries.some((country) => country === 'gt' || country === 'guatemala') &&
      selectedCountries.some((country) => country === 'hn' || country === 'honduras')
      ? 'Esta información ha sido procesada por: Monitoreo de niñez y adolescencia migrante -Monitoreo Binacional de Niñez Migrante Guatemala-Honduras'
      : null,
    selectedCountries.some((country) => country === 'sv' || country === 'elsalvador')
      ? 'Esta información ha sido procesada por Niñez Migrante Guatemala-El Salvador'
      : null,
  ].filter(Boolean);

  const sources = (
    <Stack
      width='100%'
      margin='auto'
      direction='column'
      alignItems='center'
      marginBottom='24px'
      spacing='8px'
      justifyContent='center'
      maxWidth={{ base: '320px', md: '760px' }}
    >
      {compareSources.map((source) => (
        <Text
          key={source}
          textAlign='center'
          fontFamily='Oswald'
          fontSize={{ base: 'sm', md: 'md' }}
          maxWidth={{ base: '320px', md: '760px' }}
          lineHeight='1.2'
        >
          {source}
        </Text>
      ))}

      {compareMethodology.map((note) => (
        <Text
          key={note}
          textAlign='center'
          fontFamily='Montserrat Medium'
          fontSize={{ base: 'xs', md: 'sm' }}
          lineHeight='1.35'
        >
          {note}
        </Text>
      ))}
    </Stack>
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <StatisticsContext.Provider
      value={{ isScreenShotTime, setIsScreenShotTime }}
    >
      <SelectOptions
        countValue={countValue}
        setCountValue={setCountValue}
        onChange={onChange}
        satisticsRef={satisticsRef}
      />

      {countValue !== '0' && options['1']?.country !== '' && (
        <Box
          ref={satisticsRef}
          bgColor={isScreenShotTime ? '#fff' : '#eee'}
          padding={{ base: '40px 24px', md: '80px 40px' }}
        >
          {selectionSummaries.length >= 2 && (
            <Box
              bgColor='white'
              borderRadius='20px'
              padding={{ base: '24px', md: '32px' }}
              margin='0 auto 40px auto'
              maxWidth='1200px'
            >
              <Stack spacing='20px'>
                <Text fontFamily='Oswald' fontSize={{ base: '2xl', md: '3xl' }}>
                  Comparación rápida
                </Text>

                <SimpleGrid
                  columns={{ base: 1, md: Math.min(selectionSummaries.length + 2, 5) }}
                  spacing='16px'
                >
                  {selectionSummaries.map((item) => (
                    <Box
                      key={item.key}
                      border='1px solid #ddd'
                      borderRadius='16px'
                      padding='16px'
                      bgColor='rgba(0,0,0,0.02)'
                    >
                      <Text
                        fontFamily='Montserrat Medium'
                        fontSize='sm'
                        color='gray.600'
                        marginBottom='8px'
                      >
                        {item.shortLabel}
                      </Text>
                      <Text
                        fontFamily='Oswald'
                        fontSize='lg'
                        lineHeight='1.2'
                        marginBottom='12px'
                      >
                        {item.label}
                      </Text>
                      <Text fontFamily='Oswald' fontSize='4xl' lineHeight='1'>
                        {item.loading || typeof item.total !== 'number'
                          ? '...'
                          : formatInt(item.total)}
                      </Text>
                    </Box>
                  ))}

                  <Box
                    border='1px solid #ddd'
                    borderRadius='16px'
                    padding='16px'
                    bgColor='rgba(117,184,65,0.08)'
                  >
                    <Text
                      fontFamily='Montserrat Medium'
                      fontSize='sm'
                      color='gray.600'
                      marginBottom='8px'
                    >
                      Mayor valor
                    </Text>
                    <Text
                      fontFamily='Oswald'
                      fontSize='lg'
                      lineHeight='1.2'
                      marginBottom='12px'
                    >
                      {highestSummary?.label || 'Calculando...'}
                    </Text>
                    <Text fontFamily='Oswald' fontSize='4xl' lineHeight='1'>
                      {highestSummary ? formatInt(highestSummary.total) : '...'}
                    </Text>
                  </Box>

                  <Box
                    border='1px solid #ddd'
                    borderRadius='16px'
                    padding='16px'
                    bgColor='rgba(51,132,169,0.08)'
                  >
                    <Text
                      fontFamily='Montserrat Medium'
                      fontSize='sm'
                      color='gray.600'
                      marginBottom='8px'
                    >
                      Brecha
                    </Text>
                    <Text
                      fontFamily='Oswald'
                      fontSize='lg'
                      lineHeight='1.2'
                      marginBottom='12px'
                    >
                      Diferencia entre la mayor y la menor selección
                    </Text>
                    <Text fontFamily='Oswald' fontSize='4xl' lineHeight='1'>
                      {gapSummary === null ? '...' : formatInt(gapSummary)}
                    </Text>
                    <Text
                      marginTop='8px'
                      fontFamily='Montserrat Medium'
                      fontSize='sm'
                      color='gray.700'
                    >
                      {formatGapPercentage(gapPercentage)}
                    </Text>
                  </Box>
                </SimpleGrid>
              </Stack>
            </Box>
          )}

          <Stack
            gap='40px'
            alignContent='center'
            justifyContent='center'
            marginBottom='60px'
            direction={{ base: 'column', md: 'row' }}
          >
            <Statistics
              data={options['1']}
              id='1'
              setFiles={setFiles}
              setUpdateDate={setUpdateDate}
              setPeriodId={setPeriodId}
              setCompareSummary={setCompareSummary}
            />
            {(countValue === '2' || countValue === '3') && (
              <Statistics
                data={options['2']}
                setFiles={setFiles}
                id='2'
                setUpdateDate={setUpdateDate}
                setPeriodId={setPeriodId}
                setCompareSummary={setCompareSummary}
              />
            )}
            {countValue === '3' && (
              <Statistics
                data={options['3']}
                id='3'
                setFiles={setFiles}
                setUpdateDate={setUpdateDate}
                setPeriodId={setPeriodId}
                setCompareSummary={setCompareSummary}
              />
            )}
          </Stack>

          <LastDate
            sources={sources}
            updateDate={updateDate}
            isScreenShotTime={isScreenShotTime}
          />
          {isScreenShotTime && <GraphFooter responsive />}
          <DownloadTable
            files={compareFiles}
            satisticsRef={satisticsRef}
            periodId={periodId}
            imageFileName={imageFileName}
          />
        </Box>
      )}
    </StatisticsContext.Provider>
  );
};

export default ComparePage;
