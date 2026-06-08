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
  const { demographicsLoading, ageGroupTotals, isCompareView } =
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

  const labels = ['P. INF', 'NIÑEZ', 'ADOL', 'NR'];
  let chartColors = [
    colors.yellow[700],
    colors.blue[700],
    colors.green[700],
    colors.gray[500],
  ];
  let agesLabels = [
    'Primera infancia',
    'Niñez',
    'Adolescencia',
    'No registrado',
  ];

  const totals = [f1, f2, f3, f4].slice(disableFirstAge ? 1 : 0);
  if (disableFirstAge) {
    chartColors = chartColors.slice(1);
    agesLabels = agesLabels.slice(1);
  }

  const data = {
    labels: disableFirstAge ? labels.slice(1) : labels,
    datasets: [
      {
        data: totals,
        backgroundColor: chartColors,
      },
    ],
  };

  const chartWidth = isCompareView ? '260px' : '360px';
  const labelFontSize = isCompareView ? 'sm' : 'md';
  const valueFontSize = isCompareView ? 'xl' : '2xl';
  const itemMinWidth = isCompareView ? 140 : 190;
  const legendColumns = isCompareView
    ? 'repeat(2, minmax(0, 1fr))'
    : '1fr';

  return (
    <Box width='100%' position='relative'>
      <Loader loading={demographicsLoading} />

      <Stack justifyContent='flex-start' alignItems='center' spacing='12px'>
        <Text fontFamily='Oswald' fontSize='2xl'>
          Rangos etarios
        </Text>

        <Box width='100%' maxWidth={chartWidth}>
          <Bar options={options} data={data} />
        </Box>

        <Grid
          width='100%'
          maxWidth='520px'
          templateColumns={legendColumns}
          columnGap={6}
          rowGap={3}
        >
          {chartColors.map((color, index) => (
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              key={`age_${index}`}
              minWidth={itemMinWidth}
            >
              <Stack
                direction='row'
                alignItems='center'
                spacing='10px'
                flex='1'
                minWidth='0'
              >
                <Box bgColor={color} width='18px' height='18px' />
                <Text fontFamily='Oswald' fontSize={labelFontSize}>
                  {agesLabels[index]}
                </Text>
              </Stack>
              <Text
                fontFamily='Oswald'
                fontSize={valueFontSize}
                minWidth='72px'
                textAlign='right'
                flexShrink={0}
              >
                {formatInt(totals[index]) || 0}
              </Text>
            </Stack>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default AgeRanges;
