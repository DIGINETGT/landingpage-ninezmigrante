import React, { useState, useRef } from "react";

// REACT ROUTER DOM
import { useParams } from "react-router-dom";

// CHACKRA
import {
  Select,
  Text,
  Stack,
  Box,
  Tooltip as ChackraTooltip,
} from "@chakra-ui/react";

// DND
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Bar, Line } from "react-chartjs-2";

//  COMPONENTES
import DownloadImage from "../../../../../../components/downloadImage";

import GraphFooter from "../../../../../../components/graphFooter";

//UTILS
import {
  getListStyle,
  getItemStyle,
  getDataItemStyle,
} from "../../../department/components/dndDepartment/tools";
import useGraphData from "./hooks";
import {
  itemColors,
  graphDataTypes,
  customPeriods,
  customDataTypes,
  customDataChart,
  datasetLabels,
} from "./utils";

import {
  Chart as ChartJS,
  PointElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Legend,
  Tooltip,
  Filler,
} from "chart.js";
import handleGraphType from "./utils/events";
import getCountryContent from "../../../../../../utils/country";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
  Tooltip,
  PointElement,
  LineElement,
  Filler
);

const TrendsGraphs = ({ country = "guatemala" }) => {
  // IDS
  const countryID = useParams().countryID || country;

  // STATES
  const [graphType, setGraphType] = useState("");
  const [chartType, setChartType] = useState("");
  const [period, setPeriod] = useState("");
  const [isScreenShotTime, setIsScreenShotTime] = useState(false);

  // REF
  const containerRef = useRef(null);

  // PERIOD
  const handlePeriod = (ev) => setPeriod(ev.target.value);

  // DATA GRAPH
  const handleDnD = (result) =>
    handleGraphType(result, setGraphType, setChartType);

  // DATOS
  const graphData = useGraphData(period, graphType, chartType, countryID);

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
      ref={containerRef}
      paddingBottom="40px"
      style={{ margin: "0 auto" }}
      maxWidth={{ base: "100%", md: 800 }}
      paddingLeft={{ base: "40px", md: 0 }}
      paddingRight={{ base: "40px", md: 0 }}
    >
      <DragDropContext onDragEnd={handleDnD}>
        <Stack
          data-html2canvas-ignore="true"
          spacing={1}
          alignItems={{ base: "center", md: "flex-end" }}
          justifyContent="space-between"
          direction={{ base: "column", md: "row" }}
        >
          {/* PERIODO */}
          <Select
            fontSize="2xl"
            maxW={"270px"}
            fontWeight="600"
            lineHeight="1.8"
            bgColor="#bcd6d6"
            fontFamily="Times"
            letterSpacing="1.2px"
            onChange={handlePeriod}
            value={period || "default"}
          >
            <option value="default">Elegir período</option>
            {customPeriods.map((period, index) => (
              <option key={index} value={index}>
                {period}
              </option>
            ))}
          </Select>

          <Stack
            spacing={1}
            direction={{ base: "column", md: "row" }}
            alignItems="center"
          >
            {/* LISTA DE VARIABLES */}
            <Box p={1}>
              <Text fontFamily="Oswald" fontSize="1em" mb={2}>
                Tipo de datos
              </Text>
              <Droppable droppableId="droppableGraphs" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={{
                      ...getListStyle(snapshot.isDraggingOver),
                      padding: 0,
                    }}
                    {...provided.droppableProps}
                  >
                    {customDataTypes.map((item, index) => (
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
                            style={{
                              ...getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              ),
                              filter:
                                graphType === item.id
                                  ? "invert(68%) sepia(41%) saturate(480%) hue-rotate(43deg) brightness(95%) contrast(90%)"
                                  : "none",
                              marginRight: index === 4 ? "0" : "8px",
                            }}
                          >
                            <ChackraTooltip label={item.name} placement="auto">
                              {item.Content}
                            </ChackraTooltip>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Box>

            {/* LISTA DE TIPOS */}
            <Box
              p={1}
              pl={{ base: 0, md: 2 }}
              borderLeft={{ base: "none", md: "1px solid #555" }}
            >
              <Text fontFamily="Oswald" fontSize="1em" mb={2}>
                Tipo de gráfica
              </Text>
              <Droppable droppableId="droppableCharts" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={{
                      ...getListStyle(snapshot.isDraggingOver),
                      padding: 0,
                    }}
                    {...provided.droppableProps}
                  >
                    {customDataChart.map((item, index) => (
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
                            style={{
                              ...getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              ),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: index === 2 ? "0" : "8px",
                              filter:
                                chartType === item.id
                                  ? "invert(46%) sepia(74%) saturate(353%) hue-rotate(154deg) brightness(86%) contrast(102%)"
                                  : "none",
                            }}
                          >
                            <ChackraTooltip label={item.name} placement="auto">
                              {item.Content}
                            </ChackraTooltip>
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
        </Stack>

        {/* TITULO DE CANVAS */}
        <Box bgColor="#fff" borderRadius="20px" p={8} mt={4}>
          <Stack
            marginY={8}
            spacing={8}
            alignItems="center"
            justifyContent="center"
            direction={{ base: "column", md: "row" }}
          >
            <Stack spacing="16px" direction="column" alignItems="center">
              <Text
                fontSize="2xl"
                fontFamily="Oswald"
                lineHeight={{ base: "1.5", md: "1" }}
                textAlign={{ base: "center", md: "left" }}
              >{`TOTAL DE NIÑEZ Y ADOLESCENCIA RETORNADA - ${getCountryContent({
                countryID,
                capitalize: true,
              })}`}</Text>
              <Text
                fontSize="2xl"
                lineHeight="1"
                fontWeight="600"
                fontFamily="Times"
              >{`${customPeriods[period] ?? "Tendencias"}${
                graphDataTypes[graphType]
                  ? ` - Por ${graphDataTypes[graphType]}`
                  : ""
              }`}</Text>
            </Stack>

            {graphType.length > 0 && (
              <Stack direction="column">
                {datasetLabels[graphType]?.map((label, index) => (
                  <Stack direction="row" alignItems="center" key={label}>
                    <Box
                      bgColor={itemColors[index]}
                      width="18px"
                      height="18px"
                    />
                    <Text fontFamily="Oswald" fontSize="md">
                      {label}
                    </Text>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>

          <Box>
            <Droppable droppableId="droppableData1">
              {(provided, snapshot) => {
                return (
                  <div
                    ref={provided.innerRef}
                    style={{
                      ...getDataItemStyle(snapshot.isDraggingOver),
                      width: "100%",
                      height: 300,
                    }}
                    {...provided.droppableProps}
                  >
                    <Box>
                      {(chartType === "bar" ||
                        chartType === "group" ||
                        chartType === "") && (
                        <Bar
                          width={800}
                          height={300}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                            scales: {
                              x: {
                                stacked: chartType === "group",
                              },
                              y: {
                                stacked: chartType === "group",
                              },
                            },
                          }}
                          data={graphData}
                        />
                      )}
                      {chartType === "area" && (
                        <Line
                          width={800}
                          height={300}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                          }}
                          data={graphData}
                        />
                      )}
                    </Box>
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>

            {sources}
          </Box>

          {isScreenShotTime && <GraphFooter sources={sources} responsive />}

          <DownloadImage
            containerRef={containerRef}
            label="Descargar imagen de tendencias"
            onSS={setIsScreenShotTime}
          />
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default TrendsGraphs;
