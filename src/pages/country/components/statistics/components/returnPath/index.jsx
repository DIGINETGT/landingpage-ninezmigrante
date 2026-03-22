// REACT
import React, { useContext, useMemo } from 'react';

// CHAKRA
import { Box, Stack, Text, Image, Icon } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';

// ASSETS
import Airplane from '../../../../../../assets/airplane.png';
import Bus from '../../../../../../assets/bus.png';
import Ship from '../../../../../../assets/ship.png';

// CONTEXTO + LOADER
import StatisticsContext from '../../context';
import Loader from '../../../../../../components/loader';
import { formatInt } from '../../../../../../utils/numbers';

function diacriticless(s = '') {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const ReturnPath = () => {
  const { loading, returnRouteTotals } = useContext(StatisticsContext);

  // Agrupa por familia textual sin exigir catálogo nuevo en backend.
  const { totalAerea, totalTerrestre, totalMaritimo, totalOtros } = useMemo(() => {
    let aerea = 0,
      terrestre = 0,
      maritimo = 0,
      otros = 0;

    for (const [rawName, cant] of Object.entries(returnRouteTotals || {})) {
      const name = diacriticless(rawName);
      const n = Number(cant || 0);

      if (name.includes('aere')) aerea += n;
      else if (name.includes('terrest')) terrestre += n;
      else if (name.includes('maritim')) maritimo += n;
      else otros += n;
    }

    return {
      totalAerea: aerea,
      totalTerrestre: terrestre,
      totalMaritimo: maritimo,
      totalOtros: otros,
    };
  }, [returnRouteTotals]);

  return (
    <Box width='100%' position='relative'>
      <Loader loading={loading} />

      <Stack justifyContent='center' alignItems='center' spacing='24px'>
        <Text fontFamily='Oswald' fontSize='2xl'>
          Vía de retorno
        </Text>

        <Stack
          gap='24px'
          direction='row'
          alignItems='center'
          justifyContent='center'
        >
          <Image src={Airplane} height='50px' />
          <Stack
            spacing='8px'
            direction='column'
            alignItems='center'
            justifyContent='center'
          >
            <Text fontFamily='Oswald' fontSize='md' lineHeight='1'>
              Aérea
            </Text>
            <Text fontFamily='Oswald' fontSize='3xl' lineHeight='1'>
              {formatInt(totalAerea)}
            </Text>
          </Stack>
        </Stack>

        <Stack
          gap='24px'
          direction='row'
          alignItems='center'
          justifyContent='center'
        >
          <Image src={Bus} height='50px' />
          <Stack
            spacing='8px'
            direction='column'
            alignItems='center'
            justifyContent='center'
          >
            <Text fontFamily='Oswald' fontSize='md' lineHeight='1'>
              Terrestre
            </Text>
            <Text fontFamily='Oswald' fontSize='3xl' lineHeight='1'>
              {formatInt(totalTerrestre)}
            </Text>
          </Stack>
        </Stack>

        <Stack
          gap='24px'
          direction='row'
          alignItems='center'
          justifyContent='center'
        >
          <Image src={Ship} height='50px' />
          <Stack
            spacing='8px'
            direction='column'
            alignItems='center'
            justifyContent='center'
          >
            <Text fontFamily='Oswald' fontSize='md' lineHeight='1'>
              Marítimo
            </Text>
            <Text fontFamily='Oswald' fontSize='3xl' lineHeight='1'>
              {formatInt(totalMaritimo)}
            </Text>
          </Stack>
        </Stack>

        {totalOtros > 0 && (
          <Stack
            gap='24px'
            direction='row'
            alignItems='center'
            justifyContent='center'
          >
            <Icon as={QuestionOutlineIcon} boxSize={12} color='gray.800' />
            <Stack
              spacing='8px'
              direction='column'
              alignItems='center'
              justifyContent='center'
            >
              <Text fontFamily='Oswald' fontSize='md' lineHeight='1'>
                Otros
              </Text>
              <Text fontFamily='Oswald' fontSize='3xl' lineHeight='1'>
                {formatInt(totalOtros)}
              </Text>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default ReturnPath;
