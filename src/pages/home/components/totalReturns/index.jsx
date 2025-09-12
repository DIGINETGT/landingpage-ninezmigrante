import React from 'react';

import { Box, Stack, Image, Text, Tooltip } from '@chakra-ui/react';

import Group from '../../../../assets/group.png';
import Guatemala from '../../../../assets/guatemala.png';
import Honduras from '../../../../assets/honduras.png';
import Salvador from '../../../../assets/salvador.png';

import { year } from '../../../../utils/year';
import { GET_RETURNEDS_BY_COUNTRY_FOR_TOTAL } from '../../../../utils/query/returned';
import useReturnedFilteredQuery from '../../../../hooks/query';

import BigStat from '../../../../components/common/BigStat';

const TotalReturns = () => {
  const { data: dataGt } = useReturnedFilteredQuery({
    year,
    period: [1, 12],
    query: GET_RETURNEDS_BY_COUNTRY_FOR_TOTAL('gt', [1, 12], year),
  });
  let gt = 0;

  dataGt?.forEach((report) => {
    gt += report.attributes?.returned?.data?.attributes?.total || 0;
  });

  const { data: dataHn } = useReturnedFilteredQuery({
    year,
    period: [1, 12],
    query: GET_RETURNEDS_BY_COUNTRY_FOR_TOTAL('hn', [1, 12], year),
  });
  let hn = 0;

  dataHn?.forEach((report) => {
    hn += report.attributes?.returned?.data?.attributes?.total || 0;
  });

  const { data: dataSv } = useReturnedFilteredQuery({
    year,
    period: [1, 12],
    query: GET_RETURNEDS_BY_COUNTRY_FOR_TOTAL('sv', [1, 12], year),
  });
  let sv = 0;

  dataSv?.forEach((report) => {
    sv += report.attributes?.returned?.data?.attributes?.total || 0;
  });

  const total = { gt, hn, sv };

  return (
    <Box bg='blue.700' p={{ base: '40px 24px', md: '80px 40px' }}>
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
          w='160px'
          h='160px'
          src={Group}
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
            color='white'
            textAlign='center'
            fontFamily='Oswald'
            fontSize={{ base: '3xl', md: '4xl' }}
          >
            Total de niñez migrante retornada {year}
          </Text>

          {/* MOBILE IMAGE */}
          <Image
            w='150px'
            h='150px'
            src={Group}
            display={{ base: 'block', md: 'none' }}
          />

          {/* GLOBAL DATA */}

          <BigStat
            value={total.gt + total.hn + total.sv}
            compactFrom={10_000} // o Infinity si NO quieres compacto
            mode='long' // "short" => 16.3K
            withTooltip={false}
            numberProps={{
              color: 'white',
              fontFamily: 'Oswald',
              fontSize: { base: '5xl', md: '6xl' },
              lineHeight: '1',
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
            statProps={{ textAlign: 'left' }}
          />

          {/* DATA PER COUNTRY */}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing='0px'
            width='100%'
          >
            {/* GUATEMALA */}
            <Stack
              height='100px'
              direction='row'
              padding='16px 24px'
              alignItems='center'
              border='1px solid white'
              width={{ base: '100%', md: '200px' }}
              spacing={{ base: '40px', md: '16px' }}
              justifyContent={{ base: 'center', md: 'space-between' }}
            >
              <Tooltip
                color='black'
                fontSize='xl'
                lineHeight='1'
                fontWeight='500'
                padding='2px 8px'
                label='Guatemala'
                bgColor='blue.500'
                fontFamily='Oswald'
              >
                <Image
                  width='35%'
                  height='70px'
                  src={Guatemala}
                  objectFit='contain'
                />
              </Tooltip>

              <BigStat
                value={Number.isNaN(total.gt) ? 0 : total.gt}
                compactFrom={10_000} // o Infinity si NO quieres compacto
                mode='long' // "short" => 16.3K
                withTooltip={false}
                numberProps={{
                  color: 'white',
                  fontFamily: 'Oswald',
                  fontSize: { base: '3xl', md: '4xl' },
                  lineHeight: '1',
                }}
                statProps={{ textAlign: 'left' }}
              />
            </Stack>

            {/* HONDURAS */}
            <Stack
              height='100px'
              direction='row'
              padding='16px 24px'
              alignItems='center'
              border='1px solid white'
              width={{ base: '100%', md: '200px' }}
              spacing={{ base: '40px', md: '16px' }}
              justifyContent={{ base: 'center', md: 'space-between' }}
            >
              <Tooltip
                color='black'
                fontSize='xl'
                lineHeight='1'
                fontWeight='500'
                label='Honduras'
                padding='2px 8px'
                bgColor='blue.500'
                fontFamily='Oswald'
              >
                <Image
                  width='45%'
                  height='70px'
                  src={Honduras}
                  objectFit='contain'
                />
              </Tooltip>

              <BigStat
                value={Number.isNaN(total.hn) ? 0 : total.hn}
                compactFrom={10_000} // o Infinity si NO quieres compacto
                mode='long' // "short" => 16.3K
                withTooltip={false}
                numberProps={{
                  color: 'white',
                  fontFamily: 'Oswald',
                  fontSize: { base: '3xl', md: '4xl' },
                  lineHeight: '1',
                }}
                statProps={{ textAlign: 'left' }}
              />
            </Stack>

            {/* EL SALVADOR */}
            <Stack
              height='100px'
              direction='row'
              padding='16px 24px'
              alignItems='center'
              border='1px solid white'
              width={{ base: '100%', md: '200px' }}
              spacing={{ base: '40px', md: '16px' }}
              justifyContent={{ base: 'center', md: 'space-between' }}
            >
              <Tooltip
                color='black'
                fontSize='xl'
                lineHeight='1'
                fontWeight='500'
                label='El Salvador'
                padding='2px 8px'
                bgColor='blue.500'
                fontFamily='Oswald'
              >
                <Image
                  width='45%'
                  height='70px'
                  src={Salvador}
                  objectFit='contain'
                />
              </Tooltip>

              <BigStat
                value={Number.isNaN(total.sv) ? 0 : total.sv}
                compactFrom={10_000} // o Infinity si NO quieres compacto
                mode='long' // "short" => 16.3K
                withTooltip={false}
                numberProps={{
                  color: 'white',
                  fontFamily: 'Oswald',
                  fontSize: { base: '3xl', md: '4xl' },
                  lineHeight: '1',
                }}
                statProps={{ textAlign: 'left' }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TotalReturns;
