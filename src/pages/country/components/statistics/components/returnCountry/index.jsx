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
    if (positiveEntries.length === 1) return 168;
    if (positiveEntries.length === 2) return 148;
    if (positiveEntries.length === 3) return 108;
    if (positiveEntries.length <= 5) return 88;
    return 68;
  }, [positiveEntries.length]);

  const isHighlightedLayout = positiveEntries.length > 0 && positiveEntries.length <= 3;

  const contentMaxWidth = useMemo(() => {
    if (positiveEntries.length === 1) return '240px';
    if (positiveEntries.length === 2) return '340px';
    if (positiveEntries.length === 3) return '440px';
    return '100%';
  }, [positiveEntries.length]);

  const highlightedSpacing = useMemo(() => {
    if (positiveEntries.length === 1) return { base: '20px', md: '20px' };
    if (positiveEntries.length === 2) return { base: '18px', md: '18px' };
    return { base: '24px', md: '24px' };
  }, [positiveEntries.length]);

  const titleSpacing = useMemo(() => {
    if (positiveEntries.length === 1) return '22px';
    if (positiveEntries.length === 2) return '16px';
    if (positiveEntries.length === 3) return '22px';
    return '24px';
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
      <Box
        width='100%'
        maxWidth={isHighlightedLayout ? contentMaxWidth : 'none'}
        marginLeft='auto'
        height='100%'
      >
        <Stack
          justifyContent='flex-start'
          alignItems={{ base: 'center', md: 'flex-end' }}
          marginBottom={isHighlightedLayout ? titleSpacing : '24px'}
        >
          <Text fontFamily='Oswald' fontSize='2xl'>
            País de retorno
          </Text>
        </Stack>

        <Wrap
          spacing={{
            base: isHighlightedLayout ? highlightedSpacing.base : '24px',
            md: isHighlightedLayout
              ? highlightedSpacing.md
              : isCompareView
              ? '18px'
              : '20px',
          }}
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
                  gap={
                    isHighlightedLayout
                      ? isCompareView
                        ? '12px'
                        : positiveEntries.length === 2
                        ? '10px'
                        : '14px'
                      : isCompareView
                      ? '10px'
                      : '12px'
                  }
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
                    spacing={isHighlightedLayout ? '6px' : '4px'}
                    direction='column'
                    alignItems='center'
                    justifyContent='flex-start'
                  >
                    <Text
                      fontFamily='Oswald'
                      fontSize={
                        isHighlightedLayout
                          ? isCompareView
                            ? 'md'
                            : 'lg'
                          : isCompareView
                          ? 'sm'
                          : 'md'
                      }
                      lineHeight='1'
                      textAlign='center'
                      textTransform='uppercase'
                    >
                      {country}
                    </Text>
                    <Text
                      fontFamily='Oswald'
                      fontSize={
                        isHighlightedLayout
                          ? isCompareView
                            ? '3xl'
                            : '4xl'
                          : isCompareView
                          ? '2xl'
                          : '3xl'
                      }
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
