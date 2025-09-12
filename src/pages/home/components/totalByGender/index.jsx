// REACT
import React, { useEffect, useState } from 'react';

// CHAKRA UI COMPONENTS
import { Box, Stack, Image, Text } from '@chakra-ui/react';

// ASSETS
import Male from '../../../../assets/male.png';
import Femenine from '../../../../assets/femenine.png';

// UTILS
import { year } from '../../../../utils/year';

import BigStat from '../../../../components/common/BigStat';
import { useReturnedsByGenderRegion } from '../../../../hooks/useReturnedsByGenderRegion';
import UnknownChip from '../../../../components/common/UnknownChip';

const TotalByGender = () => {
  const { female, male, total, unknown, loading } = useReturnedsByGenderRegion({
    isos: ['GT', 'HN', 'SV'],
    period: [1, 12],
    year,
  });

  return (
    <Box width='100%'>
      {/* CONTAINER */}
      <Stack
        width='100%'
        spacing='0px'
        direction='row'
        alignItems='center'
        justifyContent='center'
      >
        {/* TITLE */}
        <Box
          bgColor='white'
          padding='4px 16px'
          position='absolute'
          marginTop={{ base: '-180px', md: '-320px' }}
        >
          <Text
            textAlign='center'
            fontFamily='Oswald'
            fontSize={{ base: '3xl', md: '4xl' }}
          >
            Total de niñez migrante retornada {year}
          </Text>
        </Box>

        {/* GIRLS SECTION */}
        <Stack
          gap='16px'
          width='50%'
          direction='row'
          alignItems='center'
          bgColor='yellow.700'
          justifyContent='flex-end'
          padding={{
            base: '160px 40px 80px 40px',
            md: '180px 40px 120px 40px',
          }}
        >
          <Image
            src={Femenine}
            height='120px'
            display={{ base: 'none', md: 'block' }}
          />
          <Stack direction='column' spacing='-16px'>
            <Text
              color='white'
              fontFamily='Oswald'
              fontSize={{ base: '4xl', md: '7xl' }}
            >
              NIÑAS
            </Text>

            <BigStat
              value={female}
              compactFrom={10_000} // o Infinity si NO quieres compacto
              mode='long' // "short" => 16.3K
              withTooltip={true}
              fontFamily='Oswald'
              numberProps={{
                color: 'white',
                fontFamily: 'Oswald',
                fontSize: { base: '5xl', md: '7xl' },
                lineHeight: '1',
              }}
              statProps={{ textAlign: 'right' }}
            />
          </Stack>
        </Stack>

        {/* BOYS SECTION */}
        <Stack
          gap='16px'
          width='50%'
          direction='row'
          bgColor='green.700'
          alignItems='center'
          justifyContent='flex-start'
          padding={{
            base: '160px 40px 80px 40px',
            md: '180px 40px 120px 40px',
          }}
        >
          <Stack direction='column' spacing='-16px'>
            <Text
              color='white'
              fontFamily='Oswald'
              fontSize={{ base: '4xl', md: '7xl' }}
            >
              NIÑOS
            </Text>

            <BigStat
              value={male}
              compactFrom={10_000} // o Infinity si NO quieres compacto
              mode='long' // "short" => 16.3K
              withTooltip={true}
              fontFamily='Oswald'
              numberProps={{
                color: 'white',
                fontFamily: 'Oswald',
                fontSize: { base: '5xl', md: '7xl' },
                lineHeight: '1',
              }}
              statProps={{ textAlign: 'right' }}
            />
          </Stack>
          <Image
            src={Male}
            height='120px'
            display={{ base: 'none', md: 'block' }}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default TotalByGender;
