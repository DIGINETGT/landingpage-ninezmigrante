// components/DepartmentListCarousel.jsx
import React, { useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import depName from '../../pages/country/components/statistics/components/heatMap/components/modal/utils';
import depKey from '../../pages/country/components/statistics/components/heatMap/utils/depKey';

import getCountryContent from '../../utils/country';
import ModalContentGT from '../../components/departments/components/gt';
import ModalContentHN from '../../components/departments/components/hn';
import ModalContentSV from '../../components/departments/components/sv';

const MiniSvg = ({ countryID, id, inUse }) => (
  <svg viewBox='0 0 585.94 612' width='60' height='42'>
    {getCountryContent({
      countryID,
      content: {
        guatemala: (
          <ModalContentGT
            id={id}
            customColor={inUse ? '#3BA55D' : '#CBD5E0'}
            disableHeat
          />
        ),
        honduras: (
          <ModalContentHN
            id={id}
            customColor={inUse ? '#3BA55D' : '#CBD5E0'}
            disableHeat
          />
        ),
        elsalvador: (
          <ModalContentSV
            id={id}
            customColor={inUse ? '#3BA55D' : '#CBD5E0'}
            disableHeat
          />
        ),
      },
    })}
  </svg>
);

function DepartmentListCarousel({ countryID, depList, depDataList }) {
  // Mapa rápido para saber qué deptos ya están usados en tarjetas
  const usedMap = useMemo(() => {
    const m = new Set();
    depDataList?.forEach((d) => {
      if (!d?.reload && d?.id) m.add(d.id);
    });
    return m;
  }, [depDataList]);

  return (
    <Box
      w='100%'
      maxW={{ base: '100%', md: '960px' }}
      mx='auto'
      mt={3}
      borderWidth='1px'
      rounded='lg'
      p={3}
      bg='white'
      overflowX='auto'
    >
      <Droppable droppableId='depSource' direction='horizontal' isDropDisabled>
        {(dropProvided) => (
          <Flex
            ref={dropProvided.innerRef}
            align='center'
            {...dropProvided.droppableProps}
          >
            {depList?.map((item, index) => {
              const inUse = usedMap.has(item.id);

              return (
                <Draggable key={item.id} index={index} draggableId={item.id}>
                  {(dragProvided, snapshot) => (
                    <Box
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      flex='0 0 auto'
                      minW='120px'
                      maxW='140px'
                      mx='6px'
                      px='3'
                      py='2'
                      textAlign='center'
                      rounded='xl'
                      borderWidth='1.5px'
                      borderColor={
                        snapshot.isDragging
                          ? 'blue.400'
                          : inUse
                          ? 'green.400'
                          : 'gray.200'
                      }
                      bg={inUse ? 'green.50' : 'white'}
                      shadow={snapshot.isDragging ? 'lg' : 'sm'}
                      transform={snapshot.isDragging ? 'scale(1.03)' : 'none'}
                      transition='all .12s ease-out'
                    >
                      <Box
                        h='42px'
                        w='100%'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        mb={1}
                      >
                        <MiniSvg
                          countryID={countryID}
                          id={item.id}
                          inUse={inUse}
                        />
                      </Box>
                      <Text
                        fontSize='xs'
                        noOfLines={1}
                        fontFamily='Montserrat Medium'
                      >
                        {depName?.[item?.id] ?? item?.id}
                      </Text>
                      <Text fontSize='10px' color='gray.500'>
                        Arrastra a una tarjeta
                      </Text>
                    </Box>
                  )}
                </Draggable>
              );
            })}
            {dropProvided.placeholder}
          </Flex>
        )}
      </Droppable>
    </Box>
  );
}

export default React.memo(DepartmentListCarousel);
