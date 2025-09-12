import React from 'react';
import { useParams } from 'react-router-dom';

import { Box, Stack, Text, Select, Image } from '@chakra-ui/react';

import MapaGuatemala from '../../../../assets/MapaGuatemala.svg';
import MapaHonduras from '../../../../assets/MapaHonduras.svg';
import MapaElSalvador from '../../../../assets/MapaElSalvador.svg';
import YearSelect from '../../../../components/yearSelect';
import MonthPicker from '../../../../components/monthPicker';
import getCountryContent from '../../../../utils/country';

const Period = ({
  period,
  setPeriod,
  year,
  setYear,
  satisticsRef,
  loading,
}) => {
  const { countryID } = useParams();

  const scrollInto = () => {
    if (satisticsRef.current) {
      const navbar = document.getElementById('menu').clientHeight;
      const y =
        satisticsRef.current.getBoundingClientRect().top + window.scrollY;
      window.scroll({
        top: y - navbar,
        behavior: 'smooth',
      });
    }
  };

  // PERIOD
  const handlePeriod = (ranges) => {
    if (loading) return; // evita dobles disparos
    setPeriod(ranges);
    document.activeElement?.blur?.();
  };

  const handleYear = (ev) => {
    if (loading) return;
    setYear(ev.target.value);
  };

  return (
    <Box
      height='80vh'
      bgColor='blue.500'
      padding={{ base: '40px 24px', md: '80px 40px' }}
    >
      {/* CONTAINER */}
      <Stack
        height='100%'
        alignItems='center'
        justifyContent='center'
        gap={{ base: '24px', md: '40px' }}
        direction={{ base: 'column', md: 'row' }}
      >
        <Stack direction='column'>
          {/* TITLE */}
          <Text
            color='gray.700'
            fontFamily='Oswald'
            fontSize={{ base: '4xl', md: '6xl' }}
          >
            {getCountryContent({ countryID, capitalize: true })}
          </Text>

          {/* SELECT YEAR */}
          <YearSelect currentYear={year} handleYear={handleYear} />

          {/* SELECT PERIOD */}
          <MonthPicker onAccept={handlePeriod} />
        </Stack>

        {/* COUNTRY MAP */}
        <Image
          height='400px'
          maxWidth={{ base: '300px', md: '400px' }}
          src={getCountryContent({
            countryID,
            content: {
              guatemala: MapaGuatemala,
              honduras: MapaHonduras,
              elsalvador: MapaElSalvador,
            },
          })}
        />
      </Stack>
    </Box>
  );
};

export default Period;
