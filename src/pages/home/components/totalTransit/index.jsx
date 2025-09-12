// REACT
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';

// CHAKRA UI COMPONENTS
import { Box, Stack, Image, Text, Tooltip } from '@chakra-ui/react';

// COMPONETS
import Mexico from '../../../../assets/mexico.svg';
import USA from '../../../../assets/usa.svg';
import Family from '../../../../assets/family.png';

// UTILS
import { year } from '../../../../utils/year';
import { GET_TRANSIT_REPORTS } from '../../../../utils/query/returned';

import BigStat from '../../../../components/common/BigStat';

const TotalTransit = () => {
  const { data } = useQuery(GET_TRANSIT_REPORTS('GT', [1, 12], year));

  let totalCant = 0;
  data?.transitReports?.data.forEach((report) => {
    report.attributes?.gender_contributions?.data.forEach((contribution) => {
      totalCant += contribution.attributes.cant;
    });
  });

  return (
    <Box bg='blue.500' p={{ base: '40px 24px', md: '80px 40px' }}>
      {/* CONTAINER */}
      <Stack
        alignItems='center'
        justifyContent='center'
        gap={{ base: '0px', md: '40px' }}
        padding={{ base: '16px', md: '24px' }}
        direction={{ base: 'column', md: 'row' }}
      >
        {/* DESKTOP IMAGE */}
        <Image
          w='180px'
          h='180px'
          src={Family}
          display={{ base: 'none', md: 'block' }}
        />
        {/* DATA */}
        <Stack
          direction='column'
          justifyContent='center'
          gap={{ base: '24px', md: '0px' }}
          alignItems={{ base: 'center', md: 'flex-start' }}
        >
          {/* TITLE */}
          <Text
            maxWidth='600px'
            fontFamily='Oswald'
            fontSize={{ base: '3xl', md: '4xl' }}
            textAlign={{ base: 'center', md: 'left' }}
          >
            Total de NIÑEZ en TRANSITO {year}
          </Text>

          {/* MOBILE IMAGE */}
          <Image
            w='150px'
            h='150px'
            src={Family}
            display={{ base: 'block', md: 'none' }}
          />

          {/* GLOBAL DATA */}

          <BigStat
            value={totalCant}
            compactFrom={10_000} // o Infinity si NO quieres compacto
            mode='long' // "short" => 16.3K
            withTooltip={false}
            numberProps={{
              color: 'black',
              fontFamily: 'Oswald',
              fontWeight: '400',
              fontSize: { base: '5xl', md: '6xl' },
              lineHeight: '1',
              paddingTop: '10px',
              paddingBottom: '15px',
            }}
            statProps={{ textAlign: 'right', paddingTop: '10px' }}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default TotalTransit;
