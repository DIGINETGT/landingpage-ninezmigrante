// REACT
import React from 'react';
import { useParams } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

// CHAKRA UI COMPONENTS
import { Box, Stack, Text, Image } from '@chakra-ui/react';

// ASSETS
import EEUU from './components/polygons/eeuu';
import Mexico from './components/polygons/mexico';
import Guatemala from './components/polygons/guatemala';
import ElSalvador from './components/polygons/elsalvador';
import AmericaMap from './components/polygons/america';

import { colors } from '../../../../../../utils/theme';
import { GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_COUNTRY } from '../../../../../../utils/query/returned';

import useReturnedFilteredQuery from '../../../../../../hooks/query';
import { getFilterByCountry } from '../../../../../../utils/query/filters';
import Loader from '../../../../../../components/loader';

const countryImages = {
  ['Estados Unidos']: { Image: EEUU },
  ['México']: { Image: Mexico },
  ['Guatemala']: { Image: Guatemala },
  ['El Salvador']: { Image: ElSalvador },
  others: { Image: AmericaMap },
};

const ReturnCountry = ({ period, year, country }) => {
  const { countryID: id } = useParams();
  const countryId = country || id;

  const { data: rdata, loading } = useReturnedFilteredQuery({
    year,
    period,
    country,
    skip: false,
    query: GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_COUNTRY(countryId, period, year),
  });

  const dataPerCountry = {};
  const dataMaps = {};

  rdata?.forEach((report) => {
    report.attributes?.returned?.data?.attributes?.country_contributions?.data?.forEach(
      (countryContribution) => {
        const countryName =
          countryContribution.attributes?.country?.data?.attributes?.name;

        dataMaps[countryName] =
          countryContribution.attributes?.country?.data?.attributes?.map?.data?.attributes?.url;

        dataPerCountry[countryName] =
          (dataPerCountry[countryName] ?? 0) +
          +(countryContribution?.attributes?.cant ?? 0);
      }
    );
  });

  return (
    <Box width='100%' position='relative'>
      <Loader loading={loading} />

      <Stack justifyContent='center' alignItems='center' marginBottom='24px'>
        <Text fontFamily='Oswald' fontSize='2xl'>
          País de retorno
        </Text>
      </Stack>

      <Stack
        spacing='24px'
        justifyContent='center'
        direction={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'center', md: 'flex-end' }}
      >
        {Object.entries(dataPerCountry ?? {})
          .sort((a, b) => b[1].total - a[1].total)
          .map(([country, total], index) => {
            return total > 0 ? (
              <Stack
                gap='24px'
                direction='column'
                key={`${country[0]}-${index}`}
                alignItems='center'
                justifyContent='center'
              >
                {/* <ReactSVG
                  method='GET'
                  style={{ width: 60, height: 60 }}
                  beforeInjection={(svg) => {
                    svg.setAttribute(
                      'fill',
                      colors?.heat?.[id]?.[900 - index * 100]
                    );
                    svg.setAttribute('style', 'width: 100%; height: 100%');
                  }}
                  src={dataMaps?.[country] ?? ''}
                /> */}
                <img
                  src={dataMaps?.[country] ?? ''}
                  alt={country || ''}
                  height={'100%'}
                  width={'130px'}
                />

                <Stack
                  spacing='8px'
                  direction='column'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Text
                    fontFamily='Oswald'
                    fontSize='md'
                    lineHeight='1'
                    textAlign='center'
                  >
                    {country}
                  </Text>
                  <Text
                    fontFamily='Oswald'
                    fontSize='3xl'
                    lineHeight='1'
                    textAlign='center'
                  >
                    {total}
                  </Text>
                </Stack>
              </Stack>
            ) : null;
          })}
      </Stack>
    </Box>
  );
};

export default ReturnCountry;
