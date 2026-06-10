import React from 'react';
import { useQuery } from '@apollo/client';

import { Box, Stack, Image, Text, Tooltip } from '@chakra-ui/react';

import Group from '../../../../assets/group.png';
import Guatemala from '../../../../assets/guatemala.png';
import Honduras from '../../../../assets/honduras.png';
import Salvador from '../../../../assets/salvador.png';

import { year } from '../../../../utils/year';
import { GET_RETURNEDS_BY_TOTAL_REGION } from '../../../../utils/query/returned';

import BigStat from '../../../../components/common/BigStat';

const TotalReturns = () => {
  const { data } = useQuery(GET_RETURNEDS_BY_TOTAL_REGION, {
    variables: {
      isos: ['GT', 'HN', 'SV'],
      start: `${year}-01-01`,
      end: `${year + 1}-01-01`,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const total = (data?.monthlyReports?.data ?? []).reduce(
    (acc, report) => {
      const userRelation = report?.attributes?.users_permissions_user?.data;
      const userAttributes = Array.isArray(userRelation)
        ? userRelation?.[0]?.attributes
        : userRelation?.attributes;
      const iso =
        userAttributes?.organization?.data?.attributes?.department?.data
          ?.attributes?.country?.data?.attributes?.isoCode;
      const reportTotal =
        Number(report?.attributes?.returned?.data?.attributes?.total) || 0;

      if (iso === 'GT') acc.gt += reportTotal;
      if (iso === 'HN') acc.hn += reportTotal;
      if (iso === 'SV') acc.sv += reportTotal;

      return acc;
    },
    { gt: 0, hn: 0, sv: 0 }
  );

  const countries = [
    {
      key: 'gt',
      label: 'Guatemala',
      image: Guatemala,
      value: Number.isNaN(total.gt) ? 0 : total.gt,
      imageWidth: { base: '64px', md: '88px' },
    },
    {
      key: 'hn',
      label: 'Honduras',
      image: Honduras,
      value: Number.isNaN(total.hn) ? 0 : total.hn,
      imageWidth: { base: '84px', md: '108px' },
    },
    {
      key: 'sv',
      label: 'El Salvador',
      image: Salvador,
      value: Number.isNaN(total.sv) ? 0 : total.sv,
      imageWidth: { base: '84px', md: '108px' },
    },
  ];

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
          loading='lazy'
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
            loading='lazy'
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
            {countries.map((country) => (
              <Stack
                key={country.key}
                minHeight={{ base: '180px', md: '200px' }}
                direction='column'
                padding='16px 20px'
                alignItems='center'
                justifyContent='space-between'
                border='1px solid white'
                width={{ base: '100%', md: '200px' }}
                spacing='12px'
              >
                <Tooltip
                  color='black'
                  fontSize='xl'
                  lineHeight='1'
                  fontWeight='500'
                  padding='2px 8px'
                  label={country.label}
                  bgColor='blue.500'
                  fontFamily='Oswald'
                >
                  <Image
                    width={country.imageWidth}
                    height={{ base: '56px', md: '72px' }}
                    src={country.image}
                    loading='lazy'
                    objectFit='contain'
                  />
                </Tooltip>

                <BigStat
                  value={country.value}
                  compactFrom={10_000}
                  mode='long'
                  withTooltip={false}
                  numberProps={{
                    color: 'white',
                    fontFamily: 'Oswald',
                    fontSize: { base: '3xl', md: '4xl' },
                    lineHeight: '1',
                  }}
                  statProps={{ textAlign: 'center' }}
                />

                <Text
                  color='white'
                  fontFamily='Oswald'
                  fontSize={{ base: 'md', md: 'lg' }}
                  lineHeight='1.1'
                  textAlign='center'
                >
                  {country.label}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TotalReturns;
