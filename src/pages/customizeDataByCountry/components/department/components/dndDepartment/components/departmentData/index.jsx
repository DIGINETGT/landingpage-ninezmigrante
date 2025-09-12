import React from 'react';
import {
  Text,
  Stack,
  Image,
  CloseButton,
  Box,
  Spinner,
} from '@chakra-ui/react';
import ModalContentGT from '../../../../../../../../components/departments/components/gt';
import ModalContentHN from '../../../../../../../../components/departments/components/hn';
import ModalContentSV from '../../../../../../../../components/departments/components/sv';
import getCountryContent from '../../../../../../../../utils/country';

import MaleIcon from '../../../../../../../../assets/male.png';
import FemaleIcon from '../../../../../../../../assets/femenine.png';

import GenderGapChip from '../../../../../../../../components/common/GenderGapChip';

import useDepartmentCard from '../../hooks/useDepartmentCard';
import { depColors } from '../../utils';

export default function DepartmentData({
  country = 'guatemala', // 'guatemala' | 'honduras' | 'elsalvador'
  item, // { id, color }
  index,
  setDepDataList,
  isDragOver,
  year,
  period,
  iso, // 'GT' | 'HN' | 'SV'
}) {
  const removeData = () =>
    setDepDataList((prev) =>
      prev.map((x, i) => (i === index ? { ...x, reload: true } : x))
    );

  const { loading, label, total, male, female } = useDepartmentCard({
    iso,
    year,
    period,
    depId: item?.id, // ej: 'quetzaltenango'
  });

  return item?.reload ? (
    <Stack h='100%' align='center' justify='center'>
      <Text>{isDragOver ? 'Soltar departamento aquí' : 'Sin datos'}</Text>
    </Stack>
  ) : (
    <Box position='relative'>
      <CloseButton onClick={removeData} position='absolute' right={2} top={2} />
      <Stack p={4} align='center' pointerEvents='none'>
        {/* SVG del depto */}
        <svg
          x='0px'
          y='0px'
          version='1.2'
          width='100%'
          height='100'
          viewBox='0 0 585.94 612'
          style={{ marginBottom: 16 }}
          xmlns='http://www.w3.org/2000/svg'
        >
          {getCountryContent({
            countryID: country,
            content: {
              guatemala: (
                <ModalContentGT
                  id={item.id}
                  customColor={depColors[index]}
                  disableHeat
                />
              ),
              honduras: (
                <ModalContentHN
                  id={item.id}
                  customColor={depColors[index]}
                  disableHeat
                />
              ),
              elsalvador: (
                <ModalContentSV
                  id={item.id}
                  customColor={depColors[index]}
                  disableHeat
                />
              ),
            },
          })}
        </svg>

        {/* Nombre */}
        <Text fontFamily='Oswald' fontSize='1.2em' fontWeight='500'>
          {label}
        </Text>

        {/* Totales */}
        {loading ? (
          <Spinner thickness='3px' size='md' />
        ) : (
          <>
            <Text fontFamily='Oswald' fontSize='2em' fontWeight='500'>
              {Number.isFinite(total) ? total : 0}
            </Text>

            {(() => {
              const iso = (country || '').toUpperCase(); // 'GT' | 'HN' | 'SV'
              const t = Number(total) || 0;
              const m = Number(male) || 0;
              const f = Number(female) || 0;
              const sum = m + f;
              const gap = Math.max(0, t - sum);
              const canDisaggregate = ['GT'].includes(iso); // GT sí reporta M/F normalmente

              // Si NO hay desagregación (sum=0) o hay brecha (gap>0): mostrar chip
              if (sum === 0 || gap > 0) {
                return (
                  <GenderGapChip
                    total={t}
                    male={m}
                    female={f}
                    canDisaggregate={canDisaggregate}
                    size='sm'
                  />
                );
              }

              // Si cuadra (sum === total): mostrar M/F
              return (
                <>
                  <Stack direction='row' align='center'>
                    <Image src={FemaleIcon} h={5} alt='Femenino' />
                    <Text fontFamily='Oswald' fontWeight='500'>
                      {f} Femenino
                    </Text>
                  </Stack>

                  <Stack direction='row' align='center'>
                    <Image src={MaleIcon} h={5} alt='Masculino' />
                    <Text fontFamily='Oswald' fontWeight='500'>
                      {m} Masculino
                    </Text>
                  </Stack>
                </>
              );
            })()}
          </>
        )}
      </Stack>
    </Box>
  );
}
