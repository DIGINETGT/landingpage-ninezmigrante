import React, { useState, useEffect } from 'react';

import { Stack, Select, Image, Text } from '@chakra-ui/react';

import LogoNinezMigrante from '../../../../../../assets/LogoNinezMigrante.png';
import MapaGuatemala from '../../../../../../assets/MapaGuatemala.svg';
import MapaHonduras from '../../../../../../assets/MapaHonduras.svg';
import MapaSalvador from '../../../../../../assets/MapaElSalvador.svg';
import YearSelect from '../../../../../../components/yearSelect';
import MonthPicker from '../../../../../../components/monthPicker';

const countryNames = {
  gt: 'Guatemala',
  hn: 'Honduras',
  sv: 'El Salvador',
};

const monthLabels = [
  '',
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

const countryImages = {
  default: {
    src: LogoNinezMigrante,
    height: '200px',
  },
  gt: {
    src: MapaGuatemala,
    height: '240px',
  },
  hn: {
    src: MapaHonduras,
    height: '100%',
  },
  sv: {
    src: MapaSalvador,
    height: '100%',
  },
};

const Options = ({ id, onChange, satisticsRef, countValue }) => {
  const [data, setData] = useState({ country: '', period: [1, 1], year: 0 });

  const selectionLabel =
    data.country && data.year
      ? `${countryNames[data.country] ?? ''} | ${
          monthLabels[data.period?.[0]] ?? 'Ene'
        } - ${monthLabels[data.period?.[1]] ?? 'Ene'} ${data.year}`
      : '';

  const handleChange = (ev) => {
    setData((prevData) => ({ ...prevData, [ev.target.name]: ev.target.value }));
  };

  const handlePeriodChange = (range) => {
    setData((prevData) => ({ ...prevData, period: range }));
    if (id === countValue) {
      scrollInto();
    }
  };

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

  useEffect(() => {
    onChange(id, data);
  }, [id, data]);

  return (
    <Stack
      spacing='16px'
      direction='column'
      alignItems='center'
      justifyContent='center'
    >
      <Text fontFamily='Montserrat Medium' fontSize='2xl'>
        Selección {id}
      </Text>
      {selectionLabel.length > 0 && (
        <Text
          fontSize='sm'
          lineHeight='1.3'
          textAlign='center'
          fontFamily='Montserrat Medium'
          color='gray.700'
          minH='36px'
        >
          {selectionLabel}
        </Text>
      )}
      {/* SELECT COUNTRY */}
      <Select
        name='country'
        fontSize='2xl'
        lineHeight='1.8'
        fontWeight='600'
        fontFamily='Times'
        letterSpacing='1.2px'
        onChange={handleChange}
        bgColor='rgba(255,255,255,0.5)'
      >
        <option value='default'>Elegir país</option>
        <option value='gt'>Guatemala</option>
        <option value='hn'>Honduras</option>
        <option value='sv'>El Salvador</option>
      </Select>

      {/* SELECT YEAR */}
      <YearSelect handleYear={handleChange} currentYear={data.year} />

      {/* SELECT PERIOD */}
      <MonthPicker onAccept={handlePeriodChange} />

      {/* MAP IMAGE */}
      <Stack
        width='300px'
        height='300px'
        alignItems='center'
        justifyContent='center'
      >
        <Image
          src={
            data.country.length > 0
              ? countryImages[data.country || 'default'].src
              : LogoNinezMigrante
          }
          width='100%'
          marginTop='24px'
          objectFit='contain'
          height={countryImages[data.country || 'default'].height}
        />
      </Stack>
    </Stack>
  );
};

export default Options;
