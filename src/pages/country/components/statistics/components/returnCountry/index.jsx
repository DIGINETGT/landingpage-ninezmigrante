// REACT
import React, { useContext, useEffect, useMemo, useState } from 'react';

// CHAKRA UI
import { Box, Stack, Text } from '@chakra-ui/react';

// CONTEXTO GLOBAL (inyectado por <Statistics />)
import StatisticsContext from '../../context';
import { formatInt } from '../../../../../../utils/numbers';
import UsaMap from '../../../../../../assets/usa.png';
import MexicoMap from '../../../../../../assets/mexico.png';
import GuatemalaMap from '../../../../../../assets/guatemala.png';
import HondurasMap from '../../../../../../assets/honduras.png';
import ElSalvadorMap from '../../../../../../assets/salvador.png';
import BeliceMap from '../../../../../../assets/belice.svg';
import NicaraguaMap from '../../../../../../assets/nicaragua.svg';
import PanamaMap from '../../../../../../assets/panama.svg';
import CostaRicaMap from '../../../../../../assets/MapaCostaRica.svg';

const normalizeCountryName = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const COUNTRY_LABELS = {
  belize: 'Belice',
};

const formatCountryLabel = (value = '') => {
  const normalizedValue = normalizeCountryName(value);
  return COUNTRY_LABELS[normalizedValue] || value;
};

const LOCAL_RETURN_COUNTRY_MAPS = {
  'estados unidos': UsaMap,
  mexico: MexicoMap,
  guatemala: GuatemalaMap,
  honduras: HondurasMap,
  'el salvador': ElSalvadorMap,
  belice: BeliceMap,
  belize: BeliceMap,
  nicaragua: NicaraguaMap,
  panama: PanamaMap,
  'costa rica': CostaRicaMap,
};

// (opcional) si usas colores por país
const ReturnCountry = () => {
  const {
    returnsLoading,
    isCompareView,
    returnCountryTotals, // { 'Estados Unidos': 123, 'México': 45, ... }
    returnCountryMaps, // { 'Estados Unidos': 'https://...', ... }
  } = useContext(StatisticsContext);
  const [capturableMapUrls, setCapturableMapUrls] = useState({});

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

  useEffect(() => {
    let isCancelled = false;

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    const toBlackSvgDataUrl = async (blob) => {
      const svgText = await blob.text();
      const normalizedSvg = svgText
        .replace(/fill="(?!none)[^"]*"/gi, 'fill="#000000"')
        .replace(/stroke="(?!none)[^"]*"/gi, 'stroke="#000000"');

      const svgWithStyle = normalizedSvg.includes('<style')
        ? normalizedSvg
        : normalizedSvg.replace(
            /<svg([^>]*)>/i,
            '<svg$1><style>*{fill:#000000!important;stroke:#000000!important;}</style>'
          );

      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        svgWithStyle
      )}`;
    };

    const toBlackSilhouetteDataUrl = async (blob) => {
      const objectUrl = URL.createObjectURL(blob);

      try {
        const image = await loadImage(objectUrl);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;

        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data } = imageData;

        for (let idx = 0; idx < data.length; idx += 4) {
          if (data[idx + 3] > 0) {
            data[idx] = 0;
            data[idx + 1] = 0;
            data[idx + 2] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);

        return canvas.toDataURL('image/png');
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    const preloadMaps = async () => {
      const nextUrls = {};

      await Promise.all(
        positiveEntries.map(async ([country]) => {
          const normalizedCountry = normalizeCountryName(country);
          const localMapUrl = LOCAL_RETURN_COUNTRY_MAPS[normalizedCountry];
          const sourceUrl = localMapUrl || returnCountryMaps?.[country];
          if (!sourceUrl) return;

          try {
            const response = await fetch(sourceUrl, {
              mode: 'cors',
              credentials: 'omit',
            });

            if (!response.ok) return;

            const blob = await response.blob();
            const isSvg =
              blob.type.includes('svg') ||
              sourceUrl.toLowerCase().includes('.svg');
            const dataUrl = isSvg
              ? await toBlackSvgDataUrl(blob)
              : await toBlackSilhouetteDataUrl(blob);
            nextUrls[country] = dataUrl;
          } catch (error) {
            try {
              if (localMapUrl) {
                const fallbackResponse = await fetch(localMapUrl);
                if (fallbackResponse.ok) {
                  const fallbackBlob = await fallbackResponse.blob();
                  const isFallbackSvg =
                    fallbackBlob.type.includes('svg') ||
                    localMapUrl.toLowerCase().includes('.svg');
                  nextUrls[country] = isFallbackSvg
                    ? await toBlackSvgDataUrl(fallbackBlob)
                    : await toBlackSilhouetteDataUrl(fallbackBlob);
                  return;
                }
              }
            } catch (fallbackError) {
              // no-op
            }

            nextUrls[country] = sourceUrl;
          }
        })
      );

      if (!isCancelled) {
        setCapturableMapUrls(nextUrls);
      }
    };

    preloadMaps();

    return () => {
      isCancelled = true;
    };
  }, [positiveEntries, returnCountryMaps]);

  const mapMaxWidth = useMemo(() => {
    if (isCompareView) {
      if (positiveEntries.length === 1) return 132;
      if (positiveEntries.length === 2) return 108;
      if (positiveEntries.length === 3) return 92;
      if (positiveEntries.length === 4) return 76;
      return 60;
    }

    if (positiveEntries.length === 1) return 168;
    if (positiveEntries.length === 2) return 148;
    if (positiveEntries.length === 3) return 108;
    if (positiveEntries.length <= 5) return 88;
    return 68;
  }, [isCompareView, positiveEntries.length]);

  const mapStageHeight = useMemo(() => {
    if (isCompareView) {
      if (positiveEntries.length === 1) return '112px';
      if (positiveEntries.length === 2) return '92px';
      if (positiveEntries.length === 3) return '82px';
      if (positiveEntries.length === 4) return '70px';
      return '56px';
    }

    if (positiveEntries.length === 1) return '128px';
    if (positiveEntries.length === 2) return '116px';
    if (positiveEntries.length === 3) return '92px';
    if (positiveEntries.length <= 5) return '74px';
    return '62px';
  }, [isCompareView, positiveEntries.length]);

  const labelMinHeight = useMemo(() => {
    if (positiveEntries.length <= 3) return '48px';
    return '42px';
  }, [positiveEntries.length]);

  const shouldWrapDesktop = isCompareView
    ? positiveEntries.length > 4
    : positiveEntries.length > 7;

  const isHighlightedLayout = positiveEntries.length > 0 && positiveEntries.length <= 3;

  const contentMaxWidth = useMemo(() => {
    if (positiveEntries.length === 1) return '240px';
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
        maxWidth={isCompareView ? '100%' : isHighlightedLayout ? contentMaxWidth : 'none'}
        marginLeft={isCompareView ? '0' : 'auto'}
        height='100%'
        overflow='hidden'
      >
      <Stack
        justifyContent='flex-start'
        alignItems={isCompareView ? 'center' : { base: 'center', md: 'flex-end' }}
        marginBottom={isHighlightedLayout ? titleSpacing : '24px'}
      >
        <Text fontFamily='Oswald' fontSize='2xl'>
          País de retorno
        </Text>
        </Stack>

        <Box
          width='100%'
          display='flex'
          flexWrap={{
            base: 'wrap',
            md: shouldWrapDesktop ? 'wrap' : 'nowrap',
          }}
          justifyContent={
            isCompareView ? 'center' : { base: 'center', md: 'flex-end' }
          }
          alignItems='flex-start'
          gap={{
            base: isHighlightedLayout ? highlightedSpacing.base : '24px',
            md: isHighlightedLayout
              ? highlightedSpacing.md
              : isCompareView
              ? '14px'
              : '20px',
          }}
        >
          {positiveEntries.map(([country, total], idx) =>
            total > 0 ? (
              <Box
                key={`${country}-${idx}`}
                flex='0 0 auto'
                width='auto'
                maxWidth={
                  isCompareView
                    ? positiveEntries.length <= 2
                      ? '148px'
                      : positiveEntries.length === 3
                      ? '116px'
                      : positiveEntries.length === 4
                      ? '96px'
                      : '88px'
                    : undefined
                }
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
                  <Box
                    width='100%'
                    height={mapStageHeight}
                    display='flex'
                    alignItems='flex-end'
                    justifyContent='center'
                  >
                    <img
                      src={
                        capturableMapUrls?.[country] ||
                        LOCAL_RETURN_COUNTRY_MAPS[normalizeCountryName(country)] ||
                        returnCountryMaps?.[country] ||
                        ''
                      }
                      alt={formatCountryLabel(country)}
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
                  </Box>

                  <Stack
                    spacing={isHighlightedLayout ? '6px' : '4px'}
                    direction='column'
                    alignItems='center'
                    justifyContent='flex-start'
                    width='100%'
                  >
                    <Box
                      minHeight={labelMinHeight}
                      width='100%'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
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
                        lineHeight='1.05'
                        textAlign='center'
                        textTransform='uppercase'
                      >
                        {formatCountryLabel(country)}
                      </Text>
                    </Box>
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
              </Box>
            ) : null
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ReturnCountry;
