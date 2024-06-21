import React, { useState, useRef } from "react";

// REACT ROUTER DOM
import { useParams } from "react-router-dom";

// TOOLS
import { year } from "../../../../../../utils/year";

// COMPONENTES
import DepartmentData from "./components/departmentData";

import GraphFooter from "../../../../../../components/graphFooter";

// UTILS
import {
  getListStyle,
  getItemStyle,
  getDataItemStyle,
  onDragEnd,
} from "./tools";
import { usePeriodReload } from "./hooks";
import countryDeps from "./utils";
import ModalContentGT from "../../../../../../components/departments/components/gt";
import ModalContentHN from "../../../../../../components/departments/components/hn";
import ModalContentSV from "../../../../../../components/departments/components/sv";

// CHACKRA
import { Select, Text, Stack, Box } from "@chakra-ui/react";

// DND
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DownloadImage from "../../../../../../components/downloadImage";
import YearSelect from "../../../../../../components/yearSelect";
import MonthPicker from "../../../../../../components/monthPicker";
import { monthNames } from "../../../../../../hooks/fetch";
import getCountryContent, {
  getDepartmentData,
} from "../../../../../../utils/country";
import useReturnedFilteredQuery from "../../../../../../hooks/query";
import { GET_RETURNEDS_BY_COUNTRY_FOR_DEPARTMENT } from "../../../../../../utils/query/returned";

const DnDDepartment = ({ country = "guatemala" }) => {
  // PROPS DE DEPARTAMENTOS
  const countryID = useParams().countryID || country;
  const [depList, setDepList] = useState(countryDeps[countryID]);
  const [period, setPeriod] = useState([1, 1]);
  const [currentYear, setYear] = useState(year);

  const databorders = useReturnedFilteredQuery({
    query: GET_RETURNEDS_BY_COUNTRY_FOR_DEPARTMENT,
    year,
    period,
    country: countryID,
  });

  const depData = getDepartmentData(databorders);

  const [isScreenShotTime, setIsScreenShotTime] = useState(false);

  // REF
  const containerRef = useRef(null);

  // LISTA DE DATOS
  const [depDataList, setDepDataList] = useState([
    { reload: true },
    { reload: true },
    { reload: true },
  ]);

  // PERIOD
  const handlePeriod = (ranges) => setPeriod(ranges);

  // AÑO
  const handleChangeYear = (ev) => setYear(ev.target.value);

  // REORDENAR
  const onDepsDragEnd = (result) =>
    onDragEnd({
      result,
      period,
      countryID,
      setDepList,
      setDepDataList,
      depData,
    });

  // HOOKS
  usePeriodReload({
    period,
    countryID,
    setDepList,
    depDataList,
    setDepDataList,
    currentYear,
  });

  const sources = (
    <Stack
      width="100%"
      margin="auto"
      direction="column"
      alignItems="center"
      marginBottom="40px"
      padding="20px"
      justifyContent="center"
      maxWidth={"800px"}
    >
      <Text
        textAlign="center"
        fontFamily="Oswald"
        fontSize={{ base: "xl", md: "md" }}
        maxWidth={"800px"}
      >
        {getCountryContent({
          countryID,
          content: {
            guatemala: "Instituto Guatemalteco de Migración -IGM-",
            honduras: "DINAF",
          },
        })}
      </Text>

      <Text
        textAlign="center"
        fontFamily="Montserrat Medium"
        fontSize={{ base: "xs", md: "sm" }}
      >
        Esta información ha sido procesada por: MOBINIM -Monitoreo Binacional de
        Niñez Migrante Guatemala-Honduras-.
      </Text>
    </Stack>
  );

  return (
    <Box
      paddingBottom="40px"
      style={{ margin: "0 auto" }}
      maxWidth={{ base: "100%", md: 800 }}
      paddingLeft={{ base: "40px", md: 0 }}
      paddingRight={{ base: "40px", md: 0 }}
    >
      <DragDropContext onDragEnd={onDepsDragEnd}>
        <Stack
          spacing={1}
          direction={{ base: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack spacing={1} direction="column">
            {/* YEAR */}
            <YearSelect
              currentYear={currentYear}
              handleYear={handleChangeYear}
            />

            {/* PERIOD */}
            <MonthPicker onAccept={handlePeriod} />
          </Stack>

          {/* LISTA DE DEPARTAMENTOS */}
          <Box
            maxWidth={{ base: "100%", md: "475px" }}
            style={{ overflowX: "auto" }}
          >
            <Droppable droppableId="droppableDeps" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {depList.map((item, index) => (
                    <Draggable
                      key={item.id}
                      index={index}
                      draggableId={item.id}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <svg
                            x="0px"
                            y="0px"
                            version="1.2"
                            width="100%"
                            height="100%"
                            className="depSVG"
                            xmlSpace="preserve"
                            viewBox="0 0 585.94 612"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
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

        <Box ref={containerRef} bgColor="#fff" borderRadius="20px" p={8} mt={4}>
          {/* TITULO DE CANVAS */}
          <Stack
            marginY={8}
            spacing="16px"
            direction="column"
            alignItems="center"
          >
            <Text
              fontSize="2xl"
              fontFamily="Oswald"
              lineHeight={{ base: "1.5", md: "1" }}
              textAlign={{ base: "center", md: "left" }}
            >{`TOTAL DE NIÑEZ Y ADOLESCENCIA RETORNADA - ${countryID.toUpperCase()}`}</Text>
            <Text
              fontSize="2xl"
              lineHeight="1"
              fontWeight="600"
              fontFamily="Times"
            >{`${monthNames[period?.[0]] ?? "Enero"} - ${
              monthNames[period?.[1]] ?? "Enero"
            } - ${currentYear} - Departamentos seleccionados`}</Text>
          </Stack>

          {/* SECCION 1 */}
          <Stack direction={{ base: "column", md: "row" }} spacing={0} mb={8}>
            <Droppable droppableId="droppableData1">
              {(provided, snapshot) => {
                const item = depDataList[0];
                return (
                  <Box
                    ref={provided.innerRef}
                    style={getDataItemStyle(snapshot.isDraggingOver)}
                    width={{ base: "100%", md: "33.33%" }}
                    {...provided.droppableProps}
                  >
                    <DepartmentData
                      index={0}
                      item={item}
                      setDepDataList={setDepDataList}
                      isDragOver={snapshot.isDraggingOver}
                    />
                    {provided.placeholder}
                  </Box>
                );
              }}
            </Droppable>

            {/* SECCION 2 */}
            <Droppable droppableId="droppableData2">
              {(provided, snapshot) => {
                const item = depDataList[1];
                return (
                  <Box
                    ref={provided.innerRef}
                    style={getDataItemStyle(snapshot.isDraggingOver)}
                    borderRight={{ base: "none", md: "1px solid #333" }}
                    borderLeft={{ base: "none", md: "1px solid #333" }}
                    borderTop={{ md: "none", base: "1px solid #333" }}
                    borderBottom={{ md: "none", base: "1px solid #333" }}
                    width={{ base: "100%", md: "33.33%" }}
                    {...provided.droppableProps}
                  >
                    <DepartmentData
                      index={1}
                      item={item}
                      setDepDataList={setDepDataList}
                      isDragOver={snapshot.isDraggingOver}
                    />
                    {provided.placeholder}
                  </Box>
                );
              }}
            </Droppable>

            {/* SECCION 3 */}
            <Droppable droppableId="droppableData3">
              {(provided, snapshot) => {
                const item = depDataList[2];
                return (
                  <Box
                    ref={provided.innerRef}
                    style={getDataItemStyle(snapshot.isDraggingOver)}
                    width={{ base: "100%", md: "33.33%" }}
                    {...provided.droppableProps}
                  >
                    <DepartmentData
                      index={2}
                      item={item}
                      setDepDataList={setDepDataList}
                      isDragOver={snapshot.isDraggingOver}
                    />
                    {provided.placeholder}
                  </Box>
                );
              }}
            </Droppable>
          </Stack>

          {/* SOURCES */}
          {!isScreenShotTime && sources}
          {isScreenShotTime && <GraphFooter sources={sources} responsive />}

          <DownloadImage
            containerRef={containerRef}
            label="Descargar imagen de comparación"
            onSS={setIsScreenShotTime}
          />
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default DnDDepartment;
