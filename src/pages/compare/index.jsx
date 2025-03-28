import React, { useState, useRef, useEffect } from 'react';

import { Box, Stack, Text } from '@chakra-ui/react';

import SelectOptions from './components/selectOptions';
import Statistics from './components/statistics';
import DownloadTable from '../country/components/statistics/components/downloadTable';
import GraphFooter from '../../components/graphFooter';
import StatisticsContext from '../country/components/statistics/context';
import LastDate from '../../components/lastUpdate';

const ComparePage = () => {
  const [countValue, setCountValue] = useState('0');
  const [options, setOptions] = useState({
    1: { country: '', year: 0, period: [1, 1], files: [] },
    2: { country: '', year: 0, period: [1, 1], files: [] },
    3: { country: '', year: 0, period: [1, 1], files: [] },
  });

  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const [updateDate, setUpdateDate] = useState('');
  const [files, setFiles] = useState({
    1: [],
    2: [],
    3: [],
  });
  const [periodId, setPeriodId] = useState('');

  const satisticsRef = useRef(null);

  const onChange = (id, data) => {
    setOptions((prevOptions) => ({ ...prevOptions, [id]: data }));
  };

  const sources = (
    <Stack
      width='100%'
      margin='auto'
      direction='column'
      alignItems='center'
      marginBottom='40px'
      justifyContent='center'
      maxWidth={{ base: '300px', md: '800px' }}
    >
      <Text
        textAlign='center'
        fontFamily='Oswald'
        fontSize={{ base: 'xl', md: 'md' }}
        maxWidth={{ base: '300px', md: '800px' }}
      >
        {options[1].country === 'guatemala' &&
          `Fuente Guatemala: Instituto Guatemalteco de Migración -IGM-`}
      </Text>
      <Text
        textAlign='center'
        fontFamily='Oswald'
        fontSize={{ base: 'xl', md: 'md' }}
        maxWidth={{ base: '300px', md: '800px' }}
      >
        {options[2].country === 'honduras' && 'Fuente Honduras: DINAF'}
      </Text>

      <Text
        textAlign='center'
        fontFamily='Montserrat Medium'
        fontSize={{ base: 'xs', md: 'sm' }}
      >
        Esta información ha sido procesada por: Monitoreo de niñez y
        adolescencia migrante -Monitoreo Binacional de Niñez Migrante
        Guatemala-Honduras
      </Text>

      <Text
        textAlign='center'
        fontFamily='Montserrat Medium'
        fontSize={{ base: 'xs', md: 'sm' }}
      >
        Esta información ha sido procesada por Niñez Migrante Guatemala-El
        Salvador
      </Text>
    </Stack>
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <StatisticsContext.Provider
      value={{ isScreenShotTime, setIsScreenShotTime }}
    >
      <SelectOptions
        countValue={countValue}
        setCountValue={setCountValue}
        onChange={onChange}
        satisticsRef={satisticsRef}
      />

      {countValue !== '0' && options['1']?.country !== '' && (
        <Box
          ref={satisticsRef}
          bgColor={isScreenShotTime ? '#fff' : '#eee'}
          padding={{ base: '40px 24px', md: '80px 40px' }}
        >
          <Stack
            gap='40px'
            alignContent='center'
            justifyContent='center'
            marginBottom='60px'
            direction={{ base: 'column', md: 'row' }}
          >
            <Statistics
              data={options['1']}
              id='1'
              setFiles={setFiles}
              setUpdateDate={setUpdateDate}
              setPeriodId={setPeriodId}
            />
            {(countValue === '2' || countValue === '3') && (
              <Statistics
                data={options['2']}
                setFiles={setFiles}
                id='2'
                setUpdateDate={setUpdateDate}
                setPeriodId={setPeriodId}
              />
            )}
            {countValue === '3' && (
              <Statistics
                data={options['3']}
                id='3'
                setFiles={setFiles}
                setUpdateDate={setUpdateDate}
                setPeriodId={setPeriodId}
              />
            )}
          </Stack>

          <LastDate
            sources={sources}
            updateDate={updateDate}
            isScreenShotTime={isScreenShotTime}
          />
          {isScreenShotTime && <GraphFooter responsive />}
          <DownloadTable
            files={[
              ...(Array.isArray(files['1']) ? [...files['1']] : []),
              ...(Array.isArray(files['2']) ? [...files['2']] : []),
              ...(Array.isArray(files['3']) ? [...files['3']] : []),
            ]}
            satisticsRef={satisticsRef}
            periodId={periodId}
          />
        </Box>
      )}
    </StatisticsContext.Provider>
  );
};

export default ComparePage;
