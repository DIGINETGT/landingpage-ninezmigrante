import React, { useState, useRef, useContext, useMemo } from 'react';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';

import MapModal from './components/modal';
import StatisticsContext from '../../context'; // datos globales
import HeatMapContext from './context'; // contexto local de colores+onClick
import { colors } from '../../../../../../utils/theme';
import getCountryContent from '../../../../../../utils/country';

import HeatMapGT from './components/gt';
import HeatMapSV from './components/sv';
import HeatMapHN from './components/hn';

import depKey from './utils/depKey'; // 👈 helper de normalización
import depName from './components/modal/utils';
import { useHeatColors } from './hooks'; // (no hace fetch)
import { formatInt } from '../../../../../../utils/numbers';
import './style.css';

const HeatMap = ({ period, year, periodId, files }) => {
  const {
    countryID, // 'gt' | 'sv' | 'hn'
    isScreenShotTime,
    depTotals, // { [depNameNorm]: total }
    depSubDepTotals, // { [depNameNorm]: { [muniName]: total } }
    depSubDepGenderTotals, // { [depNameNorm]: { masculino: n, femenino: n, ... } }
  } = useContext(StatisticsContext);

  // Escala de color base por país (RGBA con alpha variable)
  const scale = useMemo(
    () => ({
      heat: getCountryContent({
        countryID,
        content: {
          guatemala: {
            color: 'rgba(146,189,87,1.0)',
            levelHeat: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
          },
          honduras: {
            color: 'rgba(221,184,65,1.0)',
            levelHeat: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
          },
          elsalvador: {
            color: 'rgba(96, 134, 167,1.0)',
            levelHeat: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
          },
        },
      }),
    }),
    [countryID]
  );

  // Estado de colores por depto (interacción)
  const [colorScales, setColorScales] = useState({});
  const prevColor = useRef('');

  // Click en depto → resalta y abre modal
  const [modalDep, setModalDep] = useState('');
  const onClick = (name) => () => {
    prevColor.current = { [name]: colorScales[name] };
    setColorScales((prev) => ({
      ...prev,
      [name]: colors?.heat?.[countryID]?.[900],
    }));
    setModalDep(name);
  };
  const onCloseModal = () => {
    setModalDep('');
    setColorScales((prev) => ({ ...prev, ...prevColor.current }));
  };

  // Calcula colorScales a partir de depTotals (NO hace fetch)
  useHeatColors(setColorScales, countryID, depTotals);

  // 👇 Normaliza la clave del depto seleccionado para buscar en los objetos agregados
  const norm = depKey(modalDep);
  const muniTotals =
    depSubDepTotals?.[norm] ?? depSubDepTotals?.[modalDep] ?? {};
  const muniGenderTotals =
    depSubDepGenderTotals?.[norm] ?? depSubDepGenderTotals?.[modalDep] ?? {};
  const deptTotal = depTotals?.[norm] ?? depTotals?.[modalDep] ?? 0;

  const topDepartments = useMemo(() => {
    const toReadableDepartment = (key = '') =>
      depName[key] ||
      key
        .split('_')
        .filter(Boolean)
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');

    return Object.entries(depTotals || {})
      .map(([key, total]) => [key, Number(total) || 0])
      .filter(([, total]) => total > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, total]) => ({
        key,
        label: toReadableDepartment(key),
        total,
      }));
  }, [depTotals]);

  return (
    <HeatMapContext.Provider value={{ colorScales, onClick }}>
      <Box
        gap='16px'
        width='100%'
        display='flex'
        alignItems='center'
        flexDirection='column'
        justifyContent='center'
        maxWidth={{ base: '100%', md: '450px' }}
      >
        <Text fontFamily='Oswald' fontSize='2xl'>
          Departamento de origen
        </Text>

        {/* Escala visual */}
        <Box>
          <HStack spacing={0}>
            <Box height='30px' width='30px' background={colors.heatMin[100]} />
            {(scale?.heat?.levelHeat ?? []).map((opacity) => (
              <Box
                key={opacity}
                height='30px'
                width='30px'
                background={scale.heat.color?.replace('1.0', opacity)}
              />
            ))}
          </HStack>
          <Flex justifyContent='space-between'>
            <Text fontFamily='Oswald' fontSize='lg'>
              Min.
            </Text>
            <Text fontFamily='Oswald' fontSize='lg'>
              Max.
            </Text>
          </Flex>
        </Box>

        {/* Mapa por país */}
        {getCountryContent({
          countryID,
          content: {
            guatemala: <HeatMapGT />,
            honduras: <HeatMapHN />,
            elsalvador: <HeatMapSV />,
          },
        })}

        {isScreenShotTime && topDepartments.length > 0 && (
          <Box
            width='100%'
            maxWidth='400px'
            marginTop='-8px'
            background='whiteAlpha.700'
            border='1px solid'
            borderColor='blackAlpha.100'
            borderRadius='lg'
            padding='10px 14px 12px'
          >
            <Text
              fontFamily='Oswald'
              fontSize='lg'
              textAlign='center'
              textTransform='uppercase'
              letterSpacing='0.02em'
              marginBottom='6px'
            >
              Top 3 departamentos
            </Text>

            <Box
              borderTop='1px solid'
              borderColor='blackAlpha.100'
              paddingTop='4px'
            >
              {topDepartments.map((department, index) => (
                <Flex
                  key={department.key}
                  justifyContent='space-between'
                  alignItems='baseline'
                  gap='12px'
                  paddingY={index === 0 ? '6px' : '7px'}
                  borderTop={index === 0 ? 'none' : '1px solid'}
                  borderColor='blackAlpha.100'
                >
                  <Text
                    fontFamily='Oswald'
                    fontSize='md'
                    lineHeight='1.1'
                  >
                    {index + 1}. {department.label}
                  </Text>
                  <Text
                    fontFamily='Oswald'
                    fontSize='lg'
                    lineHeight='1'
                    whiteSpace='nowrap'
                  >
                    {formatInt(department.total)}
                  </Text>
                </Flex>
              ))}
            </Box>
          </Box>
        )}

        {/* Modal con datos ya agregados */}
        <MapModal
          files={files}
          year={year}
          period={period}
          modalDep={modalDep}
          periodId={periodId}
          departmentTotal={deptTotal}
          genderDepTotals={muniGenderTotals}
          depTotals={muniTotals}
          onCloseModal={onCloseModal}
        />
      </Box>
    </HeatMapContext.Provider>
  );
};

export default HeatMap;
