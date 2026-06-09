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
  const { returnsLoading, returnRouteTotals, isCompareView } =
    useContext(StatisticsContext);

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

  const iconHeight = isCompareView ? '42px' : { base: '38px', md: '46px' };
  const itemSpacing = isCompareView ? '16px' : '18px';
  const labelFontSize = isCompareView ? 'sm' : { base: 'sm', md: 'sm' };
  const valueFontSize = isCompareView ? '2xl' : { base: '2xl', md: '3xl' };

  return (
    <Box
      width='100%'
      height='100%'
      position='relative'
      display='flex'
      justifyContent={{ base: 'center', md: 'flex-start' }}
      alignItems='flex-start'
    >
      <Loader loading={returnsLoading} />

      <Stack
        justifyContent='flex-start'
        alignItems={{ base: 'center', md: 'flex-start' }}
        spacing={itemSpacing}
        width='100%'
        height='100%'
        maxWidth={{ base: '260px', md: '180px' }}
      >
        <Text
          fontFamily='Oswald'
          fontSize='2xl'
          textAlign={{ base: 'center', md: 'left' }}
          width='100%'
          lineHeight='1'
        >
          Vía de retorno
        </Text>

        <Stack
          width='100%'
          spacing={isCompareView ? '14px' : { base: '16px', md: '18px' }}
          alignItems='stretch'
        >
          <Box
            width={{ base: 'fit-content', md: '100%' }}
            margin={{ base: '0 auto', md: '0' }}
            display='grid'
            gridTemplateColumns={{ base: '40px auto', md: '52px 1fr' }}
            columnGap={{ base: '8px', md: '14px' }}
            alignItems='center'
          >
            <Image src={Airplane} height={iconHeight} />
            <Stack
              direction={{ base: 'row', md: 'column' }}
              spacing={{ base: '8px', md: '4px' }}
              alignItems={{ base: 'center', md: 'flex-start' }}
              justifyContent={{ base: 'flex-start', md: 'flex-start' }}
              width={{ base: 'auto', md: '100%' }}
            >
              <Text
                fontFamily='Oswald'
                fontSize={labelFontSize}
                lineHeight='1'
                textAlign='left'
              >
                Aérea
              </Text>
              <Text
                fontFamily='Oswald'
                fontSize={valueFontSize}
                lineHeight='1'
                textAlign='left'
              >
                {formatInt(totalAerea)}
              </Text>
            </Stack>
          </Box>

          <Box
            width={{ base: 'fit-content', md: '100%' }}
            margin={{ base: '0 auto', md: '0' }}
            display='grid'
            gridTemplateColumns={{ base: '40px auto', md: '52px 1fr' }}
            columnGap={{ base: '8px', md: '14px' }}
            alignItems='center'
          >
            <Image src={Bus} height={iconHeight} />
            <Stack
              direction={{ base: 'row', md: 'column' }}
              spacing={{ base: '8px', md: '4px' }}
              alignItems={{ base: 'center', md: 'flex-start' }}
              justifyContent={{ base: 'flex-start', md: 'flex-start' }}
              width={{ base: 'auto', md: '100%' }}
            >
              <Text
                fontFamily='Oswald'
                fontSize={labelFontSize}
                lineHeight='1'
                textAlign='left'
              >
                Terrestre
              </Text>
              <Text
                fontFamily='Oswald'
                fontSize={valueFontSize}
                lineHeight='1'
                textAlign='left'
              >
                {formatInt(totalTerrestre)}
              </Text>
            </Stack>
          </Box>

          <Box
            width={{ base: 'fit-content', md: '100%' }}
            margin={{ base: '0 auto', md: '0' }}
            display='grid'
            gridTemplateColumns={{ base: '40px auto', md: '52px 1fr' }}
            columnGap={{ base: '8px', md: '14px' }}
            alignItems='center'
          >
            <Image src={Ship} height={iconHeight} />
            <Stack
              direction={{ base: 'row', md: 'column' }}
              spacing={{ base: '8px', md: '4px' }}
              alignItems={{ base: 'center', md: 'flex-start' }}
              justifyContent={{ base: 'flex-start', md: 'flex-start' }}
              width={{ base: 'auto', md: '100%' }}
            >
              <Text
                fontFamily='Oswald'
                fontSize={labelFontSize}
                lineHeight='1'
                textAlign='left'
              >
                Marítimo
              </Text>
              <Text
                fontFamily='Oswald'
                fontSize={valueFontSize}
                lineHeight='1'
                textAlign='left'
              >
                {formatInt(totalMaritimo)}
              </Text>
            </Stack>
          </Box>

          {totalOtros > 0 && (
            <Box
              width={{ base: 'fit-content', md: '100%' }}
              margin={{ base: '0 auto', md: '0' }}
              display='grid'
              gridTemplateColumns={{ base: '40px auto', md: '52px 1fr' }}
              columnGap={{ base: '8px', md: '14px' }}
              alignItems='center'
            >
              <Icon
                as={QuestionOutlineIcon}
                boxSize={isCompareView ? 10 : { base: 10, md: 12 }}
                color='gray.800'
              />
              <Stack
                direction={{ base: 'row', md: 'column' }}
                spacing={{ base: '8px', md: '4px' }}
                alignItems={{ base: 'center', md: 'flex-start' }}
                justifyContent={{ base: 'flex-start', md: 'flex-start' }}
                width={{ base: 'auto', md: '100%' }}
              >
                <Text
                  fontFamily='Oswald'
                  fontSize={labelFontSize}
                  lineHeight='1'
                  textAlign='left'
                >
                  Otros
                </Text>
                <Text
                  fontFamily='Oswald'
                  fontSize={valueFontSize}
                  lineHeight='1'
                  textAlign='left'
                >
                  {formatInt(totalOtros)}
                </Text>
              </Stack>
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ReturnPath;
