// REACT
import React, { useContext } from 'react';

// CHAKRA
import { Box, Stack, Text, Image, Tooltip } from '@chakra-ui/react';

// ASSETS
import Male from '../../../../../../assets/male.png';
import Femenine from '../../../../../../assets/femenine.png';

// CONTEXTO + LOADER
import StatisticsContext from '../../context';
import Loader from '../../../../../../components/loader';

import { formatInt } from '../../../../../../utils/numbers';

const Gender = () => {
  const { loading, genderTotals, isCompareView } = useContext(StatisticsContext);

  const tfemale = genderTotals?.['femenino'] ?? 0;
  const tmale = genderTotals?.['masculino'] ?? 0;
  const iconHeight = isCompareView ? '42px' : '50px';
  const valueFontSize = isCompareView ? '3xl' : '4xl';
  const spacing = isCompareView ? '12px' : '16px';

  return (
    <Box width='100%' position='relative'>
      <Loader loading={loading} />

      <Stack justifyContent='center' alignItems='center' spacing={spacing}>
        <Text fontFamily='Oswald' fontSize='2xl'>
          Sexo
        </Text>

        <Stack
          gap={spacing}
          direction='row'
          alignItems='center'
          justifyContent='center'
        >
          <Tooltip
            color='white'
            fontSize='xl'
            lineHeight='1'
            fontWeight='500'
            p='2px 8px'
            label='Femenino'
            bgColor='blue.700'
            fontFamily='Oswald'
          >
            <Image src={Femenine} height={iconHeight} />
          </Tooltip>
          <Text fontFamily='Oswald' fontSize={valueFontSize} color='green.700'>
            {formatInt(tfemale)}
          </Text>
        </Stack>

        <Stack
          gap={spacing}
          direction='row'
          alignItems='center'
          justifyContent='center'
        >
          <Tooltip
            color='white'
            fontSize='xl'
            lineHeight='1'
            fontWeight='500'
            p='2px 8px'
            label='Masculino'
            bgColor='blue.700'
            fontFamily='Oswald'
          >
            <Image src={Male} height={iconHeight} />
          </Tooltip>
          <Text fontFamily='Oswald' fontSize={valueFontSize} color='yellow.700'>
            {formatInt(tmale)}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Gender;
