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
import { useHeatColors } from './hooks'; // (no hace fetch)
import './style.css';

const HeatMap = ({ period, year, periodId, files }) => {
  const {
    countryID, // 'gt' | 'sv' | 'hn'
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
