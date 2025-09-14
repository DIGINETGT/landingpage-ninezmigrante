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
  departmentTotal, // total del depto (número)
  genderDepTotals, // fallback: { masculino, femenino } del contexto
}) => {
  const statsCtx = useContext(StatisticsContext) || {};
  const { countryID } = statsCtx; // 'gt' | 'sv' | 'hn'
  const isScreenShotTime = statsCtx.isScreenShotTime ?? false;

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
  const isHnOrSv = countryID === 'hn' || countryID === 'sv';

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

  // Meses con faltantes (solo GUA y solo para rangos)
  const missingEntries = useMemo(
    () =>
      Object.entries(missingByMonth || {}).sort(([a], [b]) =>
        a.localeCompare(b)
      ),
    [missingByMonth]
  );

  return (
    <Modal
      size='2xl'
      isCentered
      isOpen={Boolean(modalDep)}
      onClose={onCloseChange}
    >
      <ModalOverlay backdropFilter='blur(4px)' bgColor='rgba(0, 0, 0, 0.5)' />
      <ModalContent
        maxHeight='calc(100vh - 50px)'
        overflowY='auto'
        margin='24px'
        ref={satisticsRef}
        padding='24px 12px 32px 12px'
        bgColor='rgba(255, 255, 255, 0.9)'
      >
        <ModalHeader fontFamily='Oswald' fontWeight='500' fontSize='4xl'>
          {departmentLabel}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack
            width='100%'
            spacing='32px'
            alignItems='center'
            justifyContent='space-between'
            marginBottom='40px'
            direction={{ base: 'column', md: 'row' }}
          >
            {/* Mapa */}
            <Stack
              alignItems='center'
              justifyContent='center'
              width={{ base: '100%', md: '50%' }}
            >
              <ModalMapContent modalDep={modalDep} country={countryID} />
            </Stack>

            {/* Columna derecha */}
            <Stack
              spacing='24px'
              alignItems='center'
              justifyContent='center'
              width={{ base: '100%', md: '50%' }}
            >
              {/* Total grande */}
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
                <Stack w='100%' spacing={2}>
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
                </Stack>
              )}

              {/* 🔔 Avisos */}
              {/* HN / SV: aviso fijo de que no reportan por municipio */}
              {isHnOrSv && (
                <Alert status='info' variant='subtle' borderRadius='md'>
                  <AlertIcon />
                  Por el momento este país no reporta datos a nivel de
                  municipios.
                </Alert>
              )}

              {/* GT: aviso de meses con “no reportados” (solo si es rango y hay faltantes) */}
              {!isHnOrSv && !isSingleMonth && missingEntries.length > 0 && (
                <Alert status='warning' variant='subtle' borderRadius='md'>
                  <AlertIcon />
                  <Box>
                    <Text>
                      Algunos meses no reportaron datos a nivel de municipios:
                    </Text>
                    <UnorderedList mt={1} ml={5}>
                      {missingEntries.map(([ym, miss]) => (
                        <ListItem key={ym}>
                          {fmtYM(ym)} — no reportados: {nf.format(miss)}
                        </ListItem>
                      ))}
                    </UnorderedList>
                  </Box>
                </Alert>
              )}

              <Divider />

              {/* Lista de municipios (solo GT). 
                  En HN/SV no se renderiza la lista. */}
              {!isHnOrSv && (
                <Stack
                  width='100%'
                  direction='column'
                  alignItems='stretch'
                  justifyContent='flex-start'
                  padding={{ base: '0px 16px 0px 0px', md: '0px' }}
                  gap={2}
                >
                  {loading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} height='18px' w='100%' />
                    ))
                  ) : !muniTotals || Object.keys(muniTotals).length === 0 ? (
                    // Mensaje solo si es 1 mes; para rangos, el aviso ya explica
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
                    Object.entries(muniTotals)
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
                              fontSize={'small'}
                            >
                              {muni}
                            </Text>
                            <HStack spacing={3}>
                              <HStack flexDirection={'row'} minWidth={'30%'}>
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
                                  <Text fontSize='sm'>F {g.femenino || 0}</Text>
                                </HStack>
                              </HStack>
                              <Text
                                w='56px'
                                textAlign='right'
                                fontFamily='Montserrat Medium'
                              >
                                {nf.format(total)}
                              </Text>
                            </HStack>
                          </HStack>
                        );
                      })
                  )}
                </Stack>
              )}
            </Stack>
          </Stack>

          {isScreenShotTime && <GraphFooter responsive />}

          <DownloadTable
            satisticsRef={satisticsRef}
            periodId={periodId}
            files={files}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MapModal;
