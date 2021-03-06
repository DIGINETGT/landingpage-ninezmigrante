import React, { useState, useRef } from "react";

// REACT ROUTER DOM
import { useParams } from "react-router-dom";

// TOOLS
import { year } from "../../../../../../utils/year";

// COMPONENTES
import DepartmentData from "./components/departmentData";

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

// CHACKRA
import { Select, Text, Stack, Box } from "@chakra-ui/react";

// DND
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DownloadImage from "../../../../../../components/downloadImage";

const DnDDepartment = ({ country = "guatemala" }) => {
  // PROPS DE DEPARTAMENTOS
  const countryID = useParams().countryID || country;
  const [depList, setDepList] = useState(countryDeps[countryID]);
  const [period, setPeriod] = useState("");
  const [currentYear, setYear] = useState(year);

  // REF
  const containerRef = useRef(null);

  // LISTA DE DATOS
  const [depDataList, setDepDataList] = useState([
    { reload: true },
    { reload: true },
    { reload: true },
  ]);

  // PERIOD
  const handlePeriod = (ev) => setPeriod(ev.target.value);

  // AÑO
  const handleChangeYear = (ev) => setYear(ev.target.value);

  // REORDENAR
  const onDepsDragEnd = (result) =>
    onDragEnd({ result, period, countryID, setDepList, setDepDataList });

  // HOOKS
  usePeriodReload({
    period,
    countryID,
    setDepList,
    depDataList,
    setDepDataList,
    currentYear,
  });

  return (
    <Box
      ref={containerRef}
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
            <Select
              name="year"
              fontSize="2xl"
              lineHeight="1.8"
              fontWeight="600"
              fontFamily="Times"
              letterSpacing="1.2px"
              onChange={handleChangeYear}
              bgColor="#bcd6d6"
            >
              <option value="default">Elegir año</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
            </Select>
            {/* PERIOD */}
            <Select
              value={period || "default"}
              fontSize="2xl"
              lineHeight="1.8"
              fontWeight="600"
              fontFamily="Times"
              letterSpacing="1.2px"
              onChange={handlePeriod}
              bgColor="#bcd6d6"
            >
              <option value="default">Elegir cuatrimestre</option>
              <option value="q1">Enero - Abril</option>
              <option value="q2">Mayo - Agosto</option>
              <option value="q3">Septiembre - Diciembre</option>
            </Select>
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
                            {countryID === "guatemala" ? (
                              <ModalContentGT
                                customColor={item.color}
                                id={item.id}
                                disableHeat
                              />
                            ) : (
                              <ModalContentHN
                                customColor={item.color}
                                id={item.id}
                                disableHeat
                              />
                            )}
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

        <Box bgColor="#fff" borderRadius="20px" p={8} mt={4}>
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
            >{`Cuatrimestre ${period.substring(
              1
            )} - ${currentYear} - Departamentos seleccionados`}</Text>
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

          <DownloadImage
            containerRef={containerRef}
            label="Descargar imagen de comparación"
          />
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default DnDDepartment;
