import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Stack, Text, Divider } from '@chakra-ui/react';

import GraphFooter from '../../../../components/graphFooter';
import LastDate from '../../../../components/lastUpdate';
import TravelCondition from './components/travelCondition';
import ReturnCountry from './components/returnCountry';
import DownloadTable from './components/downloadTable';
import HeatMap from './components/heatMap/index';
import ReturnPath from './components/returnPath';
import AgeRanges from './components/ageRanges';
import Gender from './components/gender';

import useFetch, { monthNames } from '../../../../hooks/fetch';

import StatisticsContext from './context';
import { capitalizeText } from '../../../../utils/tools';
import getCountryContent from '../../../../utils/country';

const Statistics = ({ period, year, satisticsRef }) => {
  // STATES
  const { countryID } = useParams();
  const [isScreenShotTime, setIsScreenShotTime] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [updateDate, setUpdateDate] = useState('');
  const [periodId, setPeriodId] = useState('');

  const { data, loading, error } = useQuery(GET_DETAINED);
  const total = data?.detainedInBorders?.data?.reduce((acc, item) => {
    if (
      compareDateRange({
        start: currentPeriod[0],
        end: currentPeriod[1],
        month: item?.attributes?.month,
      })
    ) {
      acc += item?.attributes?.total;
    }
  });


 
  const sources = (
    <Box direction="column" margin="auto" maxWidth="800px">
      {getCountryContent({
        countryID,
        content: {
          guatemala: (
            <Text
              lineHeight={1}
              textAlign="center"
              fontFamily="Oswald"
              fontSize={{ base: 'xl', md: '2xl' }}
              maxWidth={'800px'}
            >
              Fuente: Instituto Guatemalteco de Migración
            </Text>
          ),
          honduras: (
            <Text
              lineHeight={1}
              textAlign="center"
              fontFamily="Oswald"
              fontSize={{ base: 'xl', md: '2xl' }}
              maxWidth={'800px'}
            >
              Fuente: Dirección de Niñez, Adolescencia y Familia (DINAF)
            </Text>
          ),
          elsalvador: (
            <Text
              lineHeight={1}
              textAlign="center"
              fontFamily="Oswald"
              fontSize={{ base: 'xl', md: '2xl' }}
              maxWidth={'800px'}
            >
              Dirección General de Migración y Extranjería El Salvador
            </Text>
          ),
        },
      })}
    </Box>
  );

  return (
    <StatisticsContext.Provider
      value={{ isScreenShotTime, setIsScreenShotTime }}
    >
      <Box
        ref={satisticsRef}
        padding={{ base: '40px 24px', md: '80px 40px' }}
        bgColor={isScreenShotTime ? '#fff' : '#eee'}
      >
        <Stack
          margin="auto"
          maxWidth="800px"
          alignItems="center"
          justifyContent="space-between"
          gap={{ base: '24px', md: '40px' }}
          direction={{ base: 'column', md: 'row' }}
          marginBottom={{ base: '40px', md: '80px' }}
        >
          <Stack direction="column" spacing="16px">
            <Text
              lineHeight="1"
              fontFamily="Oswald"
              fontSize={{ base: '4xl', md: '6xl' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              {getCountryContent({ countryID, capitalize: true }).toUpperCase()}
            </Text>
            <Text
              lineHeight="1"
              fontFamily="Oswald"
              fontSize={{ base: '2xl', md: '4xl' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              Total de niñez migrante retornanda
            </Text>
            <Text
              lineHeight="1"
              fontWeight="600"
              fontFamily="Times"
              fontSize={{ base: 'xl', md: '2xl' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              {`${monthNames[period[0]] ?? ''} - ${
                monthNames[period[1]] ?? ''
              } ${year ?? ''}`}
            </Text>
          </Stack>
          <Text
            fontFamily="Oswald"
            fontSize={{ base: '7xl', md: '8xl' }}
            lineHeight="1"
          >
            {total}
          </Text>
        </Stack>
        <Stack
          gap="40px"
          width="100%"
          margin="auto"
          maxWidth="800px"
          justifyContent="space-between"
          direction={{ base: 'column', md: 'row' }}
          marginBottom={{ base: '40px', md: '60px' }}
          alignItems={{ base: 'center', md: 'flex-start' }}
        >
          <Gender period={period} year={year} />
          <TravelCondition period={period} year={year} />
          <AgeRanges period={period} year={year} />
        </Stack>

        <Stack
          width="100%"
          margin="auto"
          maxWidth="800px"
          justifyContent="center"
          gap={{ base: '40px', md: '40px' }}
          direction={{ base: 'column', md: 'row' }}
          marginBottom={{ base: '40px', md: '60px' }}
          alignItems={{ base: 'center', md: 'flex-start' }}
        >
          <ReturnPath period={period} year={year} />
          <ReturnCountry period={period} year={year} />
        </Stack>

        <Divider
          maxWidth="800px"
          borderWidth="1px"
          margin="40px auto"
          borderColor="black"
          orientation="horizontal"
        />

        <Stack
          spacing={8}
          width="100%"
          margin="auto"
          maxWidth="800px"
          alignItems="center"
          marginBottom="40px"
          justifyContent="center"
          direction={{ base: 'column', md: 'row' }}
        >
          <HeatMap period={period} year={year} periodId={periodId} />
          <Stack direction="column" spacing={4}>
            {departments.map((department, depIndex) => (
              <Stack
                spacing={8}
                direction="row"
                key={`${department._id}_${depIndex}`}
                justifyContent="space-between"
              >
                <Text fontFamily="Montserrat Medium">
                  {capitalizeText(department.name?.toLowerCase())}
                </Text>
                <Text fontFamily="Montserrat Medium">{department.total}</Text>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack direction="column" margin="auto" maxWidth="800px">
          <Text fontSize="0.9em" textAlign="center" lineHeight={1}>
            <b>Primera infancia (P. INF)*</b> en Guatemala se registra entre los
            0 y 6 años y en Honduras entre 0 y 5 años.
          </Text>
          <Text fontSize="0.9em" textAlign="center" lineHeight={1}>
            <b>Niñez*</b> en Guatemala se registra entre 7 y 12 años y en
            Honduras entre los 6 y 12 años.
          </Text>
          <Text fontSize="0.9em" textAlign="center" lineHeight={1}>
            <b>Adolescencia (ADOL)*</b> en ambos países el registro es entre los
            13 y 17 años.
          </Text>
        </Stack>

        <LastDate
          sources={sources}
          updateDate={updateDate}
          isScreenShotTime={isScreenShotTime}
        />

        {isScreenShotTime && <GraphFooter responsive />}

        <DownloadTable periodId={periodId} satisticsRef={satisticsRef} />
      </Box>
    </StatisticsContext.Provider>
  );
};

export default Statistics;
