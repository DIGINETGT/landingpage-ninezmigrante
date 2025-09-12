import React, { useContext, useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as CTooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement, CTooltip, Legend);

import { Box, Stack, Text } from '@chakra-ui/react';
import { colors } from '../../../../../../utils/theme';

import StatisticsContext from '../../context';
import Loader from '../../../../../../components/loader';
import { formatInt } from '../../../../../../utils/numbers';

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

const TravelCondition = () => {
  const { loading, travelConditionTotals } = useContext(StatisticsContext);

  // nombres esperados en tu data: "acompañado" | "no acompañado" | "otros"
  const { ACD, NO_ACD, UN_REGISTRED } = useMemo(() => {
    const acd = travelConditionTotals?.['acompañado'] ?? 0;
    const no = travelConditionTotals?.['no acompañado'] ?? 0;
    const otr = travelConditionTotals?.['otros'] ?? 0;
    return { ACD: acd, NO_ACD: no, UN_REGISTRED: otr };
  }, [travelConditionTotals]);

  const data = {
    labels: ['ACOMPAÑADOS', 'NO ACOMPAÑADOS', 'OTROS'],
    datasets: [
      {
        data: [ACD, NO_ACD, UN_REGISTRED],
        backgroundColor: [
          colors.green[700],
          colors.blue[700],
          colors.yellow[700],
        ],
        borderColor: [colors.green[700], colors.blue[700], colors.yellow[700]],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box width='100%' position='relative'>
      <Loader loading={loading} />

      <Stack justifyContent='center' alignItems='center'>
        <Text fontFamily='Oswald' fontSize='2xl'>
          Condición de viaje
        </Text>

        <Box maxWidth='200px'>
          <Pie data={data} options={options} />
        </Box>

        <Stack direction='column' spacing='-8px'>
          <Stack direction='row' alignItems='center'>
            <Box bgColor='blue.700' width='18px' height='18px' />
            <Text fontFamily='Oswald' fontSize='md' lineHeight='1'>
              No Acompañados
            </Text>
            <Text fontFamily='Oswald' fontSize='2xl'>
              {formatInt(NO_ACD)}
            </Text>
          </Stack>

          <Stack direction='row' alignItems='center'>
            <Box bgColor='green.700' width='18px' height='18px' />
            <Text fontFamily='Oswald' fontSize='md' lineHeight='1'>
              Acompañados
            </Text>
            <Text fontFamily='Oswald' fontSize='2xl'>
              {formatInt(ACD)}
            </Text>
          </Stack>

          <Stack direction='row' alignItems='center'>
            <Box bgColor='yellow.700' width='18px' height='18px' />
            <Text fontFamily='Oswald' fontSize='md' lineHeight='1'>
              Otros
            </Text>
            <Text fontFamily='Oswald' fontSize='2xl'>
              {formatInt(UN_REGISTRED)}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TravelCondition;
