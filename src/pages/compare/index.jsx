import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { Box, SimpleGrid, Stack, Text } from '@chakra-ui/react';

import SelectOptions from './components/selectOptions';
import Statistics from './components/statistics';
import DownloadTable from '../country/components/statistics/components/downloadTable';
import GraphFooter from '../../components/graphFooter';
import StatisticsContext from '../country/components/statistics/context';
import LastDate from '../../components/lastUpdate';
import { GET_COMPARE_COUNTRY_STATS } from '../../utils/query/compareStats';
import { trackEvent } from '../../services/analytics';

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
const formatUpdateValue = (value) => {
  const time = Date.parse(value || '');
  return Number.isNaN(time) ? null : time;
};

const ComparePage = () => {
  const [countValue, setCountValue] = useState('0');
  const [options, setOptions] = useState({
    1: { country: '', year: 0, period: [1, 1], files: [] },
    2: { country: '', year: 0, period: [1, 1], files: [] },
    3: { country: '', year: 0, period: [1, 1], files: [] },
  });

  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const satisticsRef = useRef(null);
  const trackedCompareStartRef = useRef('');
  const trackedCompareResultRef = useRef('');

  const onChange = (id, data) => {
    setOptions((prevOptions) => ({ ...prevOptions, [id]: data }));
  };

  const activeKeys = [1, 2, 3].slice(0, Number(countValue));
  const validSelections = useMemo(
    () =>
      activeKeys
        .map((key) => ({ key, ...options[key] }))
        .filter(
          (item) =>
            item?.country &&
            item?.year &&
            Array.isArray(item?.period) &&
            item.period[0] &&
            item.period[1]
        ),
    [activeKeys, options]
  );

  const compareQuery = useMemo(() => {
    if (!validSelections.length) return null;
    return GET_COMPARE_COUNTRY_STATS(validSelections);
  }, [validSelections]);

  const { data: compareData, loading: compareLoading } = useQuery(
    compareQuery || GET_COMPARE_COUNTRY_STATS([]),
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      skip: !compareQuery,
    }
  );

  const compareSelectionsData = compareData?.compareCountryStats?.selections ?? [];
  const compareDataByKey = validSelections.reduce((acc, selection, index) => {
    acc[selection.key] = compareSelectionsData[index] || null;
    return acc;
  }, {});

  const compareSummary = activeKeys.reduce((acc, key) => {
    const isReady = Boolean(compareDataByKey[key]);
    acc[key] = {
      loading: Boolean(
        options[key]?.country &&
          options[key]?.year &&
          Array.isArray(options[key]?.period) &&
          !isReady &&
          compareLoading
      ),
      total:
        typeof compareDataByKey[key]?.totalCant === 'number'
          ? Number(compareDataByKey[key].totalCant)
          : null,
    };
    return acc;
  }, {});

  const files = activeKeys.reduce((acc, key) => {
    acc[key] = Array.isArray(compareDataByKey[key]?.filesUrl)
      ? compareDataByKey[key].filesUrl
      : [];
    return acc;
  }, {});

  const updateDate = activeKeys
    .map((key) => compareDataByKey[key]?.updatedAtStr)
    .filter(Boolean)
    .sort((a, b) => (formatUpdateValue(b) || 0) - (formatUpdateValue(a) || 0))[0];

  const periodId =
    activeKeys
      .map((key) =>
        options[key]?.year && Array.isArray(options[key]?.period)
          ? `${options[key].year}-${options[key].period[0]}-${options[key].period[1]}`
          : null
      )
      .find(Boolean) || '';

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

  const selectionSummaries = activeKeys
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

  const comparisonChartData = [...readySummaries]
    .sort((a, b) => b.total - a.total)
    .map((item, index, array) => {
      const maxValue = array[0]?.total || 0;
      const widthPercent = maxValue > 0 ? (item.total / maxValue) * 100 : 0;
      return {
        ...item,
        widthPercent,
        isHighest: index === 0,
        isLowest: index === array.length - 1,
      };
    });

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
            return 'Fuente Honduras: Secretaría de Niñez, Adolescencia y Familia (SENAF)';
          }

          if (country === 'sv' || country === 'elsalvador') {
            return 'Fuente El Salvador: Dirección General de Migración y Extranjería El Salvador';
          }

          return null;
        })
        .filter(Boolean)
    )
  );

  const methodologyCountries = Array.from(
    new Set(
      selectedCountries
        .map((country) => countryDisplayName[country])
        .filter(Boolean)
    )
  );

  const compareMethodology = methodologyCountries.length
    ? `Esta información ha sido procesada por: Monitoreo de niñez y adolescencia migrante - Monitoreo Binacional de Niñez Migrante ${methodologyCountries.join(
        ' y '
      )}.`
    : null;

  useEffect(() => {
    if (!validSelections.length || validSelections.length !== Number(countValue)) {
      return;
    }

    const compareKey = validSelections
      .map((item) => `${item.key}:${item.country}-${item.year}-${item.period?.join('-')}`)
      .join('|');

    if (trackedCompareStartRef.current === compareKey) return;

    trackedCompareStartRef.current = compareKey;

    const filters = {
      country: validSelections.map((item) => item.country.toUpperCase()).join(','),
      year: Number(validSelections[0]?.year) || undefined,
    };

    trackEvent('filter_applied', {
      section: 'compare',
      selectionCount: validSelections.length,
      periodStartMonth: Number(validSelections[0]?.period?.[0]) || undefined,
      periodEndMonth: Number(validSelections[0]?.period?.[1]) || undefined,
      filters,
    });

    trackEvent('search_started', {
      section: 'compare',
      selectionCount: validSelections.length,
      filters,
    });
  }, [countValue, validSelections]);

  useEffect(() => {
    if (
      !validSelections.length ||
      validSelections.length !== Number(countValue) ||
      compareLoading
    ) {
      return;
    }

    if (!readySummaries.length || readySummaries.length !== Number(countValue)) {
      return;
    }

    const resultKey = readySummaries
      .map((item) => `${item.key}:${item.total}`)
      .join('|');

    if (trackedCompareResultRef.current === resultKey) return;

    trackedCompareResultRef.current = resultKey;

    const filters = {
      country: validSelections.map((item) => item.country.toUpperCase()).join(','),
      year: Number(validSelections[0]?.year) || undefined,
    };

    const totalResults = readySummaries.reduce(
      (acc, item) => acc + (Number(item.total) || 0),
      0
    );

    const baseProperties = {
      section: 'compare',
      selectionCount: readySummaries.length,
      resultCount: totalResults,
      visualizationType: 'compare_statistics',
      filters,
    };

    if (totalResults > 0) {
      trackEvent('search_completed', baseProperties);
      trackEvent('visualization_viewed', baseProperties);
      return;
    }

    trackEvent('search_without_results', baseProperties);
  }, [compareLoading, countValue, readySummaries, validSelections]);

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

      {compareMethodology && (
        <Text
          key={compareMethodology}
          textAlign='center'
          fontFamily='Montserrat Medium'
          fontSize={{ base: 'xs', md: 'sm' }}
          lineHeight='1.35'
        >
          {compareMethodology}
        </Text>
      )}
    </Stack>
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <StatisticsContext.Provider
      value={{ isScreenShotTime, isCompareView: true, setIsScreenShotTime }}
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
              padding={{ base: '24px', md: '36px' }}
              margin='0 auto 40px auto'
              maxWidth='1280px'
            >
              <Stack spacing='20px'>
                <Text fontFamily='Oswald' fontSize={{ base: '2xl', md: '3xl' }}>
                  Comparación rápida
                </Text>

                <SimpleGrid
                  columns={{ base: 1, md: Math.min(selectionSummaries.length, 3) }}
                  spacing='16px'
                >
                  {selectionSummaries.map((item) => (
                    <Box
                      key={item.key}
                      border='1px solid #ddd'
                      borderRadius='16px'
                      padding='16px'
                      bgColor='rgba(0,0,0,0.02)'
                      minHeight='180px'
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
                </SimpleGrid>

                {comparisonChartData.length >= 2 && (
                  <Box
                    border='1px solid #ddd'
                    borderRadius='16px'
                    padding={{ base: '18px', md: '22px' }}
                    bgColor='rgba(0,0,0,0.02)'
                  >
                    <Stack spacing='14px'>
                      <Stack
                        direction={{ base: 'column', md: 'row' }}
                        justifyContent='space-between'
                        alignItems={{ base: 'flex-start', md: 'center' }}
                        spacing='6px'
                      >
                        <Text fontFamily='Oswald' fontSize={{ base: 'xl', md: '2xl' }}>
                          Comparación visual
                        </Text>
                        <Text
                          fontFamily='Montserrat Medium'
                          fontSize='sm'
                          color='gray.700'
                        >
                          {gapSummary === null
                            ? 'Calculando brecha...'
                            : `Brecha mayor-menor: ${formatInt(gapSummary)}${
                                gapPercentage !== null
                                  ? ` (${Math.round(gapPercentage)}%)`
                                  : ''
                              }`}
                        </Text>
                      </Stack>

                      <Stack spacing='12px'>
                        {comparisonChartData.map((item) => (
                          <Stack key={item.key} spacing='6px'>
                            <Stack
                              direction={{ base: 'column', md: 'row' }}
                              justifyContent='space-between'
                              alignItems={{ base: 'flex-start', md: 'center' }}
                              spacing='4px'
                            >
                              <Text fontFamily='Oswald' fontSize='lg' lineHeight='1.2'>
                                {item.label}
                              </Text>
                              <Text fontFamily='Oswald' fontSize='2xl' lineHeight='1'>
                                {formatInt(item.total)}
                              </Text>
                            </Stack>

                            <Box
                              width='100%'
                              height='16px'
                              bgColor='gray.100'
                              borderRadius='999px'
                              overflow='hidden'
                            >
                              <Box
                                height='100%'
                                width={`${Math.max(item.widthPercent, 6)}%`}
                                bgColor={
                                  item.isHighest
                                    ? '#75b841'
                                    : item.isLowest
                                    ? '#a0aec0'
                                    : '#3384a9'
                                }
                                borderRadius='999px'
                              />
                            </Box>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Box>
          )}

          <SimpleGrid
            columns={{
              base: 1,
              xl: countValue === '3' ? 2 : Number(countValue),
              '2xl': Number(countValue),
            }}
            spacing={{ base: '28px', md: '32px', xl: '36px' }}
            alignItems='stretch'
            justifyItems='center'
            margin='0 auto 60px auto'
            maxWidth={{
              base: '100%',
              xl:
                countValue === '2'
                  ? '1120px'
                  : countValue === '3'
                  ? '1120px'
                  : '540px',
              '2xl':
                countValue === '3'
                  ? '1680px'
                  : countValue === '2'
                  ? '1120px'
                  : '540px',
            }}
          >
            <Statistics
              data={options['1']}
              id='1'
              selectionStats={compareDataByKey['1']}
              compareLoading={compareLoading}
            />
            {(countValue === '2' || countValue === '3') && (
              <Statistics
                data={options['2']}
                id='2'
                selectionStats={compareDataByKey['2']}
                compareLoading={compareLoading}
              />
            )}
            {countValue === '3' && (
              <Statistics
                data={options['3']}
                id='3'
                selectionStats={compareDataByKey['3']}
                compareLoading={compareLoading}
              />
            )}
          </SimpleGrid>

          <LastDate
            sources={sources}
            updateDate={updateDate}
            isScreenShotTime={isScreenShotTime}
          />
          {isScreenShotTime && <GraphFooter responsive compact />}
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
