import React, { useMemo, useRef, useContext } from 'react';
import {
  Text,
  Modal,
  Stack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  Box,
  Skeleton,
  Image,
  Divider,
  Alert,
  AlertIcon,
  UnorderedList,
  ListItem,
  Grid,
  GridItem,
} from '@chakra-ui/react';

import depName from './utils';
import ModalMapContent from './components/modalMapContent';
import ModelContent from './components/modalContent';
import DownloadTable from '../../../../components/downloadTable';
import GraphFooter from '../../../../../../../../components/graphFooter';
import StatisticsContext from '../../../../context';

import Male from '../../../../../../../../assets/male.png';
import Femenine from '../../../../../../../../assets/femenine.png';

import { formatInt } from '../../../../../../../../utils/numbers';

// ⬇️ nuevo hook
import useDepartmentMunicipalities from '../../hooks/useDepartmentMunicipalities';

// Formatea "YYYY-MM" en español sin desfase horario
const fmtYM = (ym) => {
  try {
    const [y, m] = (ym || '').split('-').map(Number);
    const d = new Date(Date.UTC(y || 1970, (m || 1) - 1, 1));
    return new Intl.DateTimeFormat('es-GT', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(d);
  } catch {
    return ym;
  }
};

const MapModal = ({
  modalDep, // ej: 'alta_verapaz'
  onCloseModal,
  year,
  period, // [startMonth, endMonth]
  periodId,
  files,
  departmentTotal, // número
  genderDepTotals, // { masculino, femenino } del contexto (fallback)
}) => {
  const statsCtx = useContext(StatisticsContext) || {};
  const { countryID, isScreenShotTime = false } = statsCtx; // 'gt' | 'sv' | 'hn'

  const satisticsRef = useRef(null);

  // Normaliza año y periodo
  const normYear = useMemo(() => {
    const n = Number(year);
    return Number.isFinite(n) ? n : new Date().getFullYear();
  }, [year]);

  const normPeriod = useMemo(() => {
    const p0 = Number(period?.[0] ?? 1);
    const p1 = Number(period?.[1] ?? 12);
    return [
      Number.isFinite(p0) && p0 > 0 ? p0 : 1,
      Number.isFinite(p1) && p1 > 0 ? p1 : 12,
    ];
  }, [period]);

  const isSingleMonth = normPeriod[0] === normPeriod[1];

  // Etiqueta “bonita”
  const departmentLabel = useMemo(
    () => depName?.[modalDep] ?? modalDep ?? '',
    [modalDep]
  );

  // Datos agregados por municipios + faltantes por mes
  const { loading, muniTotals, genderTotals, genderByMuni, missingByMonth } =
    useDepartmentMunicipalities({
      country: countryID,
      year: normYear,
      period: normPeriod,
      departmentLabel,
      skip: !modalDep,
    });

  // Totales por género (usa los traídos por el hook; si no, los del contexto)
  const maleCount =
    (genderTotals?.masculino ?? genderDepTotals?.masculino ?? 0) || 0;
  const femaleCount =
    (genderTotals?.femenino ?? genderDepTotals?.femenino ?? 0) || 0;

  const nf = useMemo(() => new Intl.NumberFormat('es-GT'), []);
  const onCloseChange = () => onCloseModal();

  // Meses con faltantes (ordenados) – se muestra solo en GT y en rangos
  const missingEntries = useMemo(
    () =>
      Object.entries(missingByMonth || {}).sort(([a], [b]) =>
        a.localeCompare(b)
      ),
    [missingByMonth]
  );

  // Países sin desagregación municipal
  const noMunicipalBreakdown = countryID === 'sv' || countryID === 'hn';

  return (
    <Modal
      size='4xl'
      isCentered
      isOpen={Boolean(modalDep)}
      onClose={onCloseChange}
    >
      <ModalOverlay backdropFilter='blur(4px)' bgColor='rgba(0, 0, 0, 0.5)' />
      <ModalContent
        ref={satisticsRef}
        maxH='calc(100vh - 48px)'
        overflowY='auto' // scroll general del modal
        mx={{ base: 3, md: 6 }}
        pt={2}
        pb={4}
        px={{ base: 2, md: 4 }}
        bgColor='rgba(255, 255, 255, 0.95)'
      >
        <ModalHeader fontFamily='Oswald' fontWeight='500' fontSize='4xl'>
          {departmentLabel}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid
            templateColumns={{ base: '1fr', md: '300px 1fr' }}
            gap={{ base: 4, md: 6 }}
            alignItems='start'
          >
            {/* Columna izquierda: mapa en tarjeta */}
            <GridItem>
              <Box
                bg='blackAlpha.50'
                borderRadius='xl'
                p={{ base: 3, md: 4 }}
                boxShadow='sm'
              >
                <Box
                  bg='#eef6e7'
                  border='1px solid #e6eedc'
                  borderRadius='lg'
                  p={{ base: 3, md: 4 }}
                >
                  <Box
                    aspectRatio={1}
                    minH={{ base: 'auto', md: 'auto' }}
                    overflow='hidden'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                  >
                    <ModalMapContent modalDep={modalDep} country={countryID} />
                  </Box>
                </Box>
              </Box>
            </GridItem>

            {/* Columna derecha */}
            <GridItem minW={0}>
              <Stack spacing={{ base: 4, md: 5 }} minW={0}>
                {/* Total grande (tu componente actual) */}
                <ModelContent
                  year={normYear}
                  total={formatInt(departmentTotal) ?? 0}
                  period={normPeriod}
                  country={countryID}
                  dataRes={genderDepTotals}
                  dep={departmentLabel}
                />

                {/* Totales M/F bajo “Total” (solo si cada uno > 0) */}
                {(maleCount > 0 || femaleCount > 0) && (
                  <HStack spacing={6} flexWrap='wrap'>
                    {maleCount > 0 && (
                      <HStack spacing={3}>
                        <Image src={Male} alt='Masculino' boxSize='25px' />
                        <Text fontFamily='Montserrat Medium'>Masculino</Text>
                        <Text
                          fontFamily='Montserrat Medium'
                          fontWeight='semibold'
                        >
                          {formatInt(maleCount)}
                        </Text>
                      </HStack>
                    )}
                    {femaleCount > 0 && (
                      <HStack spacing={3}>
                        <Image src={Femenine} alt='Femenino' boxSize='25px' />
                        <Text fontFamily='Montserrat Medium'>Femenino</Text>
                        <Text
                          fontFamily='Montserrat Medium'
                          fontWeight='semibold'
                        >
                          {formatInt(femaleCount)}
                        </Text>
                      </HStack>
                    )}
                  </HStack>
                )}

                {/* Mensajes contextuales */}
                {noMunicipalBreakdown ? (
                  <Alert status='info' variant='subtle' borderRadius='md'>
                    <AlertIcon />
                    Este país actualmente no reporta datos desagregados a nivel
                    de municipios. El total mostrado corresponde al
                    departamento.
                  </Alert>
                ) : (
                  !isSingleMonth &&
                  missingEntries.length > 0 && (
                    <Alert status='warning' variant='subtle' borderRadius='md'>
                      <AlertIcon />
                      <Box>
                        <Text>
                          Algunos meses no reportaron datos a nivel de
                          municipios:
                        </Text>
                        <UnorderedList mt={1} ml={5}>
                          {missingEntries.map(([ym, miss]) => (
                            <ListItem key={ym}>
                              <strong>{fmtYM(ym)}</strong> — no reportados:{' '}
                              <strong>{nf.format(miss)}</strong>
                            </ListItem>
                          ))}
                        </UnorderedList>
                      </Box>
                    </Alert>
                  )
                )}

                <Divider />

                {/* Lista de municipios (sólo GT). Con scroll interno */}
                {!noMunicipalBreakdown && (
                  <Box
                    maxH={{ base: '45vh', md: '56vh' }} // ← scroll interno para muchos municipios
                    overflowY='auto'
                    pr={2}
                  >
                    {loading ? (
                      Array.from({ length: 12 }).map((_, i) => (
                        <Skeleton key={i} height='18px' w='100%' mb={2} />
                      ))
                    ) : !muniTotals || Object.keys(muniTotals).length === 0 ? (
                      isSingleMonth ? (
                        <Text
                          color='gray.500'
                          fontStyle='italic'
                          textAlign='center'
                        >
                          Sin registros por municipios.
                        </Text>
                      ) : null
                    ) : (
                      <Stack spacing={2}>
                        {Object.entries(muniTotals)
                          .sort((a, b) => b[1] - a[1])
                          .map(([muni, total]) => {
                            const g = genderByMuni?.[muni] || {};
                            return (
                              <HStack
                                key={muni}
                                w='100%'
                                justify='space-between'
                                align='center'
                                spacing={2}
                              >
                                <Text
                                  fontFamily='Montserrat Medium'
                                  noOfLines={1}
                                  pr={2}
                                >
                                  {muni}
                                </Text>
                                <HStack spacing={3} flexShrink={0}>
                                  <HStack spacing={1}>
                                    <Box
                                      w='6px'
                                      h='6px'
                                      borderRadius='full'
                                      bg='#eab617'
                                    />
                                    <Text fontSize='sm'>
                                      M {g.masculino || 0}
                                    </Text>
                                  </HStack>
                                  <HStack spacing={1}>
                                    <Box
                                      w='6px'
                                      h='6px'
                                      borderRadius='full'
                                      bg='#92bd57'
                                    />
                                    <Text fontSize='sm'>
                                      F {g.femenino || 0}
                                    </Text>
                                  </HStack>
                                  <Text
                                    w='64px'
                                    textAlign='right'
                                    fontFamily='Montserrat Medium'
                                  >
                                    {nf.format(total)}
                                  </Text>
                                </HStack>
                              </HStack>
                            );
                          })}
                      </Stack>
                    )}
                  </Box>
                )}

                {isScreenShotTime && <GraphFooter responsive />}

                <DownloadTable
                  satisticsRef={satisticsRef}
                  periodId={periodId}
                  files={files}
                />
              </Stack>
            </GridItem>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MapModal;
