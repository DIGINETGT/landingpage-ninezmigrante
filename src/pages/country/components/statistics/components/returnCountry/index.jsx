// REACT
import React, { useContext, useMemo } from 'react';

// CHAKRA UI
import { Box, Stack, Text } from '@chakra-ui/react';

// CONTEXTO GLOBAL (inyectado por <Statistics />)
import StatisticsContext from '../../context';
import { formatInt } from '../../../../../../utils/numbers';

// (opcional) si usas colores por país
import { colors } from '../../../../../../utils/theme';

const ReturnCountry = () => {
  const {
    loading,
    returnCountryTotals, // { 'Estados Unidos': 123, 'México': 45, ... }
    returnCountryMaps, // { 'Estados Unidos': 'https://...', ... }
  } = useContext(StatisticsContext);

  // Lista ordenada desc por total
  const entries = useMemo(() => {
    const e = Object.entries(returnCountryTotals || {});
    // e = [ [countryName, total], ... ]
    return e.sort((a, b) => Number(b[1] || 0) - Number(a[1] || 0));
  }, [returnCountryTotals]);

  // Estados de carga / vacío
  if (loading) {
    return (
      <Box width='100%'>
        <Text fontFamily='Oswald' fontSize='2xl' textAlign='center'>
          Cargando país de retorno...
        </Text>
      </Box>
    );
  }

  if (!entries.length) {
    return (
      <Box width='100%'>
        <Text fontFamily='Oswald' fontSize='2xl' textAlign='center'>
          País de retorno
        </Text>
        <Text
          fontFamily='Oswald'
          fontSize='md'
          textAlign='center'
          opacity={0.7}
        >
          Sin datos para el rango seleccionado
        </Text>
      </Box>
    );
  }

  return (
    <Box width='100%'>
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
        {entries.map(([country, total], idx) =>
          total > 0 ? (
            <Stack
              key={`${country}-${idx}`}
              gap='24px'
              direction='column'
              alignItems='center'
              justifyContent='center'
            >
              {/* Mapa/imagen del país (si existe) */}
              <img
                src={returnCountryMaps?.[country] || ''}
                alt={country}
                width='130'
                height='100%'
                style={{ objectFit: 'contain' }}
                onError={(e) => {
                  // fallback si la imagen falla
                  e.currentTarget.style.display = 'none';
                }}
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
                  {formatInt(total)}
                </Text>
              </Stack>
            </Stack>
          ) : null
        )}
      </Stack>
    </Box>
  );
};

export default ReturnCountry;
