// REACT
import React from 'react';

// CHAKRA UI
import { Box, Stack, Text, Image, Divider } from '@chakra-ui/react';

// ASSETS
import Family from '../../../../assets/family.png';

// UTILS
import { year } from '../../../../utils/year';

import BigStat from '../../../../components/common/BigStat';
import useReturnedsByTravelConditionRegion from '../../../../hooks/useReturnedsByTravelConditionRegion';

const TotalByTravelCondition = () => {
  const { acompanado, noAcompanado } = useReturnedsByTravelConditionRegion({
    isos: ['GT', 'HN', 'SV'],
    period: [1, 12],
    year,
  });

  return (
    <Box bg='blue.500' p={{ base: '40px 24px', md: '80px 40px' }}>
      {/* CONTAINER */}
      <Stack spacing='40px' padding={{ base: '16px', md: '24px' }}>
        {/* TITLE */}
        <Stack justifyContent='center' alignItems='center' textAlign='center'>
          <Text fontFamily='Oswald' fontSize={{ base: '3xl', md: '4xl' }}>
            Total de niñez migrante retornada {year}
          </Text>
        </Stack>

        {/* DATA */}
        <Stack
          gap={{ base: '40px', md: '80px' }}
          direction={{ base: 'column', md: 'row' }}
          alignItems='center'
          justifyContent='center'
        >
          {/* IMAGE */}
          <Image
            w={{ base: '150px', md: '200px' }}
            h={{ base: '150px', md: '200px' }}
            src={Family}
            loading='lazy'
          />

          <Stack direction='column' w={{ base: '100%', md: 'auto' }}>
            {/* SUBTITLE  */}
            <Stack
              w='100%'
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              gap='40px'
            >
              <Text fontFamily='Oswald' fontSize={{ base: '2xl', md: '5xl' }}>
                ACOMPAÑADOS
              </Text>

              <BigStat
                value={acompanado}
                compactFrom={10_000} // o Infinity si NO quieres compacto
                mode='long' // "short" => 16.3K
                withTooltip={false}
                numberProps={{
                  color: 'black',
                  fontFamily: 'Oswald',
                  fontWeight: '400',
                  fontSize: { base: '3xl', md: '6xl' },
                  lineHeight: '1',
                }}
                statProps={{ textAlign: 'right' }}
              />
            </Stack>

            {/* DIVIDER */}
            <Divider
              orientation='horizontal'
              borderColor='#000'
              borderWidth='1px'
            />

            {/* SUBTITLE */}
            <Stack
              w='100%'
              justifyContent='space-between'
              alignItems='center'
              direction='row'
              gap='40px'
            >
              <Text fontFamily='Oswald' fontSize={{ base: '2xl', md: '5xl' }}>
                NO ACOMPAÑADOS
              </Text>

              <BigStat
                value={noAcompanado}
                compactFrom={10_000} // o Infinity si NO quieres compacto
                mode='long' // "short" => 16.3K
                withTooltip={false}
                numberProps={{
                  color: 'black',
                  fontFamily: 'Oswald',
                  fontWeight: '400',
                  fontSize: { base: '3xl', md: '6xl' },
                  lineHeight: '1',
                }}
                statProps={{ textAlign: 'right' }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TotalByTravelCondition;
