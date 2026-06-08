// REACT
import React, { useContext, useMemo } from 'react';

// CHAKRA UI
import { Box, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react';

// CONTEXTO GLOBAL (inyectado por <Statistics />)
import StatisticsContext from '../../context';
import { formatInt } from '../../../../../../utils/numbers';

// (opcional) si usas colores por país
const ReturnCountry = () => {
  const {
    returnsLoading,
    isCompareView,
    returnCountryTotals, // { 'Estados Unidos': 123, 'México': 45, ... }
    returnCountryMaps, // { 'Estados Unidos': 'https://...', ... }
  } = useContext(StatisticsContext);

  // Lista ordenada desc por total
  const entries = useMemo(() => {
    const e = Object.entries(returnCountryTotals || {});
    // e = [ [countryName, total], ... ]
    return e.sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0));
  }, [returnCountryTotals]);

  const positiveEntries = useMemo(
    () => entries.filter(([, total]) => Number(total || 0) > 0),
    [entries]
  );

  const mapMaxWidth = useMemo(() => {
    if (positiveEntries.length <= 3) return 130;
    if (positiveEntries.length <= 5) return 88;
    return 68;
  }, [positiveEntries.length]);

  // Estados de carga / vacío
  if (returnsLoading) {
    return (
      <Box width='100%'>
        <Text
          fontFamily='Oswald'
          fontSize='2xl'
          textAlign={{ base: 'center', md: 'right' }}
        >
          Cargando país de retorno...
        </Text>
      </Box>
    );
  }

  if (!positiveEntries.length) {
    return (
      <Box width='100%'>
        <Text
          fontFamily='Oswald'
          fontSize='2xl'
          textAlign={{ base: 'center', md: 'right' }}
        >
          País de retorno
        </Text>
        <Text
          fontFamily='Oswald'
          fontSize='md'
          textAlign={{ base: 'center', md: 'right' }}
          opacity={0.7}
        >
          Sin datos para el rango seleccionado
        </Text>
      </Box>
    );
  }

  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      flexDirection='column'
      alignItems={{ base: 'center', md: 'stretch' }}
      justifyContent='flex-start'
    >
      <Box width='100%' maxWidth='none' height='100%'>
        <Stack
          justifyContent='flex-start'
          alignItems={{ base: 'center', md: 'flex-end' }}
          marginBottom='24px'
        >
          <Text fontFamily='Oswald' fontSize='2xl'>
            País de retorno
          </Text>
        </Stack>

        <Wrap
          spacing={{ base: '24px', md: isCompareView ? '18px' : '20px' }}
          justify={{ base: 'center', md: 'flex-end' }}
          width='100%'
          align='flex-start'
        >
          {positiveEntries.map(([country, total], idx) =>
            total > 0 ? (
              <WrapItem
                key={`${country}-${idx}`}
                flex='0 0 auto'
                justifyContent='center'
              >
                <Stack
                  gap={isCompareView ? '10px' : '12px'}
                  direction='column'
                  alignItems='center'
                  justifyContent='flex-start'
                  minWidth={0}
                >
                  <img
                    src={returnCountryMaps?.[country] || ''}
                    alt={country}
                    width={String(mapMaxWidth)}
                    height='auto'
                    style={{
                      objectFit: 'contain',
                      maxWidth: `${mapMaxWidth}px`,
                      height: 'auto',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                  <Stack
                    spacing='4px'
                    direction='column'
                    alignItems='center'
                    justifyContent='flex-start'
                  >
                    <Text
                      fontFamily='Oswald'
                      fontSize={isCompareView ? 'sm' : 'md'}
                      lineHeight='1'
                      textAlign='center'
                      textTransform='uppercase'
                    >
                      {country}
                    </Text>
                    <Text
                      fontFamily='Oswald'
                      fontSize={isCompareView ? '2xl' : '3xl'}
                      lineHeight='1'
                      textAlign='center'
                    >
                      {formatInt(total)}
                    </Text>
                  </Stack>
                </Stack>
              </WrapItem>
            ) : null
          )}
        </Wrap>
      </Box>
    </Box>
  );
};

export default ReturnCountry;
