// DnDDepartment.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

// UI
import { Box, Stack, Text, SimpleGrid, GridItem } from '@chakra-ui/react';

// DnD
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Componentes propios
import DepartmentData from './components/departmentData';
import YearSelect from '../../../../../../components/yearSelect';
import MonthPicker from '../../../../../../components/monthPicker';

// Utilidades / assets existentes en tu proyecto
import { year as defaultYear } from '../../../../../../utils/year';
import { monthNames } from '../../../../../../hooks/fetch';
import countryDeps from './utils'; // lista de deptos por país (con { id, color })
import depName from '../../../../../country/components/statistics/components/heatMap/components/modal/utils';
import { toISO } from '../../../../../../utils/iso';
import DropZone from '../../../../../../components/dropZone';

import { getListStyle, getItemStyle, getDataItemStyle } from './tools';

import getCountryContent from '../../../../../../utils/country';
import ModalContentGT from '../../../../../../components/departments/components/gt';
import ModalContentHN from '../../../../../../components/departments/components/hn';
import ModalContentSV from '../../../../../../components/departments/components/sv';

// ----------------------------------------------------
// Componente
// ----------------------------------------------------
const DnDDepartment = ({ country = 'guatemala' }) => {
  // Router param (slug): 'guatemala' | 'honduras' | 'elsalvador'
  const countryID = useParams().countryID || country; // 'guatemala' | 'honduras' | 'elsalvador' | etc.
  const iso = toISO(countryID); // 'GT' | 'HN' | 'SV'

  // Filtros
  const [period, setPeriod] = useState([1, 1]);
  const [currentYear, setYear] = useState(defaultYear);

  // Lista de deptos para el carrusel
  const [depList, setDepList] = useState(countryDeps[countryID] ?? []);

  // 3 tarjetas dropeables
  const [depDataList, setDepDataList] = useState([
    { reload: true },
    { reload: true },
    { reload: true },
  ]);

  // UI helpers
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const containerRef = useRef(null);

  // Reset cuando cambia el país (slug)
  useEffect(() => {
    setDepList(countryDeps[countryID] ?? []);
    setDepDataList([{ reload: true }, { reload: true }, { reload: true }]);
  }, [countryID]);

  // Resize (solo UI)
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Handlers filtros
  const handlePeriod = (ranges) => setPeriod(ranges);
  const handleChangeYear = (ev) => setYear(Number(ev.target.value));

  // DnD: coloca el depto en la tarjeta destino
  const onDepsDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const slotIndex = [
      'droppableData1',
      'droppableData2',
      'droppableData3',
    ].indexOf(destination.droppableId);
    if (slotIndex === -1) return;

    const dep = (countryDeps[countryID] || []).find(
      (d) => d.id === draggableId
    );
    if (!dep) return;

    setDepDataList((prev) => {
      const next = [...prev];
      next[slotIndex] = {
        reload: false,
        id: dep.id,
        color: dep.color,
      };
      return next;
    });
  };

  const dropIds = ['droppableData1', 'droppableData2', 'droppableData3'];

  // const iso = isoFromCountrySlug(countryID);

  return (
    <Box
      paddingBottom='40px'
      style={{ margin: '0 auto' }}
      maxWidth={{ base: '100%', md: 800 }}
      paddingLeft={{ base: '40px', md: 0 }}
      paddingRight={{ base: '40px', md: 0 }}
    >
      <DragDropContext onDragEnd={onDepsDragEnd}>
        {/* Controles (Año + Periodo) y carrusel de departamentos */}
        <Stack
          spacing={1}
          direction={{ base: 'column', md: 'row' }}
          alignItems='center'
          justifyContent='space-between'
        >
          <Stack spacing={1} direction='column'>
            <YearSelect
              currentYear={currentYear}
              handleYear={handleChangeYear}
            />
            <MonthPicker onAccept={handlePeriod} />
          </Stack>

          {/* Carrusel / lista de deptos */}
          <Box
            maxWidth={{ base: '100%', md: '475px' }}
            style={{
              overflowX: 'auto',
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >
            <Droppable droppableId='droppableDeps' direction='horizontal'>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {(depList || []).map((item, index) => (
                    <Draggable
                      key={item.id}
                      index={index}
                      draggableId={item.id}
                    >
                      {(p, s) => (
                        <div
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                          style={getItemStyle(
                            s.isDragging,
                            p.draggableProps.style,
                            windowWidth < 500
                          )}
                        >
                          {windowWidth < 500 && (
                            <Text
                              textAlign='center'
                              fontFamily='Oswald'
                              mb={4}
                              width='100%'
                            >
                              {depName?.[item?.id]}
                            </Text>
                          )}

                          {/* Mini SVG del depto */}
                          <svg
                            x='0px'
                            y='0px'
                            version='1.2'
                            width='100%'
                            height='100%'
                            className='depSVG'
                            xmlSpace='preserve'
                            viewBox='0 0 585.94 612'
                            xmlns='http://www.w3.org/2000/svg'
                            xmlnsXlink='http://www.w3.org/1999/xlink'
                          >
                            {getCountryContent({
                              countryID,
                              content: {
                                guatemala: (
                                  <ModalContentGT
                                    customColor={item.color}
                                    id={item.id}
                                    disableHeat
                                  />
                                ),
                                honduras: (
                                  <ModalContentHN
                                    customColor={item.color}
                                    id={item.id}
                                    disableHeat
                                  />
                                ),
                                elsalvador: (
                                  <ModalContentSV
                                    customColor={item.color}
                                    id={item.id}
                                    disableHeat
                                  />
                                ),
                              },
                            })}
                          </svg>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Box>
        </Stack>

        {/* Encabezado del canvas */}
        <Box ref={containerRef} bgColor='#fff' borderRadius='20px' p={8} mt={4}>
          <Stack
            marginY={8}
            spacing='16px'
            direction='column'
            alignItems='center'
          >
            <Text
              fontSize='2xl'
              fontFamily='Oswald'
              lineHeight={{ base: '1.5', md: '1' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              {`TOTAL DE NIÑEZ Y ADOLESCENCIA RETORNADA - ${
                countryID.charAt(0).toUpperCase() + countryID.slice(1)
              }`}
            </Text>
            <Text
              fontSize='2xl'
              lineHeight='1'
              fontWeight='600'
              fontFamily='Times'
            >
              {`${monthNames[period?.[0]] ?? 'Enero'} - ${
                monthNames[period?.[1]] ?? 'Enero'
              } - ${currentYear} - Departamentos seleccionados`}
            </Text>
          </Stack>

          {/* Tres tarjetas (drop targets) */}
          <Stack
            direction={{ base: 'column', md: 'row' }}
            position='relative'
            spacing={0}
            mb={8}
            justifyContent={'center'}
          >
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 4, md: 6 }}
              alignItems='stretch'
              justifyContent={'center'}
            >
              {['droppableData1', 'droppableData2', 'droppableData3'].map(
                (dropId, idx) => (
                  <Droppable droppableId={dropId} key={dropId}>
                    {(provided, snapshot) => {
                      const item = depDataList[idx];
                      const empty = !!item?.reload;

                      return (
                        <DropZone
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          isDragOver={snapshot.isDraggingOver}
                          empty={empty}
                          slot={idx + 1}
                          placeholder={provided.placeholder}
                        >
                          {!empty && (
                            <DepartmentData
                              index={idx}
                              item={item} // { reload | id | color }
                              setDepDataList={setDepDataList}
                              // props que el hijo usa para consultar/pintar
                              iso={iso}
                              country={countryID}
                              period={period}
                              year={currentYear}
                            />
                          )}
                        </DropZone>
                      );
                    }}
                  </Droppable>
                )
              )}
            </SimpleGrid>
          </Stack>
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default DnDDepartment;
