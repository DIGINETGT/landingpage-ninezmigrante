import React, { useContext, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
  Tooltip,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);

import { Bar } from 'react-chartjs-2';
import { Box, Grid, Stack, Text } from '@chakra-ui/react';
import { colors } from '../../../../../../utils/theme';

import StatisticsContext from '../../context';
import Loader from '../../../../../../components/loader';
import { formatInt } from '../../../../../../utils/numbers';

export const options = {
  responsive: true,
  plugins: { legend: { display: false } },
};

const AgeRanges = ({ disableFirstAge = false }) => {
  const {
    demographicsLoading,
    ageGroupTotals,
    isCompareView,
    centerDemographicsCards,
  } =
    useContext(StatisticsContext);

  // nombres esperados en tu data: "primera infancia" | "niñez" | "adolescencia" | "no registrados"
  const { f1, f2, f3, f4 } = useMemo(() => {
    const toNum = (v) => Number(v || 0);
    return {
      f1: toNum(ageGroupTotals?.['primera infancia']),
      f2: toNum(ageGroupTotals?.['niñez']),
      f3: toNum(ageGroupTotals?.['adolescencia']),
      f4: toNum(ageGroupTotals?.['no registrados']),
    };
  }, [ageGroupTotals]);

  const visibleEntries = useMemo(() => {
    const baseEntries = [
      {
        key: 'primera-infancia',
        shortLabel: 'P. INF',
        label: 'Primera infancia',
        color: colors.yellow[700],
        value: f1,
      },
      {
        key: 'ninez',
        shortLabel: 'NIÑEZ',
        label: 'Niñez',
        color: colors.blue[700],
        value: f2,
      },
      {
        key: 'adolescencia',
        shortLabel: 'ADOL',
        label: 'Adolescencia',
        color: colors.green[700],
        value: f3,
      },
      {
        key: 'no-registrado',
        shortLabel: 'NR',
        label: 'No registrado',
        color: colors.gray[500],
        value: f4,
      },
    ];

    const slicedEntries = disableFirstAge ? baseEntries.slice(1) : baseEntries;
    const filteredEntries = slicedEntries.filter((entry) => Number(entry.value) > 0);

    return filteredEntries.length > 0 ? filteredEntries : slicedEntries;
  }, [disableFirstAge, f1, f2, f3, f4]);

  const data = {
    labels: visibleEntries.map((entry) => entry.shortLabel),
    datasets: [
      {
        data: visibleEntries.map((entry) => entry.value),
        backgroundColor: visibleEntries.map((entry) => entry.color),
      },
    ],
  };

  const chartWidth = isCompareView ? '260px' : '360px';
  const labelFontSize = isCompareView ? 'sm' : 'md';
  const valueFontSize = isCompareView ? 'xl' : '2xl';
  const legendSpacing = isCompareView ? '2px' : '2px';
  const itemMinWidth = isCompareView ? 112 : 190;
  const legendColumns =
    isCompareView && visibleEntries.length > 2 ? 'repeat(2, minmax(0, 1fr))' : '1fr';
  const legendMaxWidth = isCompareView ? '240px' : '300px';
  const compareLegendGridMaxWidth = isCompareView ? '320px' : '520px';
  const valueMinWidth = isCompareView ? '52px' : '72px';

  return (
    <Box
      width='100%'
      position='relative'
      display='flex'
      justifyContent={
        isCompareView || centerDemographicsCards
          ? 'center'
          : { base: 'center', md: 'flex-end' }
      }
    >
      <Loader loading={demographicsLoading} />

      <Stack
        justifyContent='flex-start'
        alignItems={
          isCompareView || centerDemographicsCards
            ? 'center'
            : { base: 'center', md: 'flex-end' }
        }
        spacing='12px'
        width='100%'
      >
        <Text
          fontFamily='Oswald'
          fontSize='2xl'
          textAlign={
            isCompareView || centerDemographicsCards
              ? 'center'
              : { base: 'center', md: 'right' }
          }
          alignSelf={
            isCompareView || centerDemographicsCards
              ? 'center'
              : { base: 'center', md: 'stretch' }
          }
          width={
            isCompareView || centerDemographicsCards
              ? 'auto'
              : { base: 'auto', md: '100%' }
          }
        >
          Rangos etarios
        </Text>

        <Box width='100%' maxWidth={chartWidth}>
          <Bar options={options} data={data} />
        </Box>

        {legendColumns === '1fr' ? (
          <Stack
            direction='column'
            spacing={legendSpacing}
            width='100%'
            maxWidth={legendMaxWidth}
          >
            {visibleEntries.map((entry) => (
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                key={entry.key}
              >
                <Stack direction='row' alignItems='center' spacing='10px'>
                  <Box bgColor={entry.color} width='18px' height='18px' />
                  <Text fontFamily='Oswald' fontSize={labelFontSize} lineHeight='1'>
                    {entry.label}
                  </Text>
                </Stack>
                <Text
                  fontFamily='Oswald'
                  fontSize={valueFontSize}
                  minWidth={valueMinWidth}
                  textAlign='right'
                  flexShrink={0}
                >
                  {formatInt(entry.value)}
                </Text>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Grid
            width='100%'
            maxWidth={compareLegendGridMaxWidth}
            templateColumns={legendColumns}
            columnGap={4}
            rowGap={3}
          >
            {visibleEntries.map((entry) => (
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'
                key={entry.key}
                minWidth={itemMinWidth}
              >
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing='10px'
                  flex='1'
                  minWidth='0'
                >
                  <Box bgColor={entry.color} width='18px' height='18px' />
                  <Text fontFamily='Oswald' fontSize={labelFontSize} lineHeight='1'>
                    {entry.label}
                  </Text>
                </Stack>
                <Text
                  fontFamily='Oswald'
                  fontSize={valueFontSize}
                  minWidth={valueMinWidth}
                  textAlign='right'
                  flexShrink={0}
                >
                  {formatInt(entry.value)}
                </Text>
              </Stack>
            ))}
          </Grid>
        )}
      </Stack>
    </Box>
  );
};

export default AgeRanges;
