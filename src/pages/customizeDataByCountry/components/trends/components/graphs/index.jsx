import React, { useEffect, useMemo, useRef, useState } from "react";

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
  defaultItemColors,
  graphDataTypes,
  customPeriods,
  customDataTypes,
  customDataChart,
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
import { toISO } from "../../../../../../utils/iso";
import { trackEvent } from "../../../../../../services/analytics";

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

const formatChartValue = (value) => Number(value || 0).toLocaleString("en-US");

const getDatasetLabelColor = (datasetIndex) => {
  if (datasetIndex === 3) return "#1f2937";
  return "#ffffff";
};

const drawOutlinedText = (ctx, text, x, y, fillStyle) => {
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
  ctx.restore();
};

const drawContrastText = (
  ctx,
  text,
  x,
  y,
  fillStyle,
  strokeStyle = "rgba(31,41,55,0.55)"
) => {
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineWidth = 3;
  ctx.strokeStyle = strokeStyle;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
  ctx.restore();
};

const drawLabelTag = (ctx, text, x, y, accentColor) => {
  ctx.save();
  ctx.font = "600 12px Oswald";

  const metrics = ctx.measureText(text);
  const paddingX = 8;
  const paddingY = 5;
  const width = metrics.width + paddingX * 2;
  const height = 22;
  const left = x - width / 2;
  const top = y - height / 2;
  const radius = 6;

  ctx.beginPath();
  ctx.moveTo(left + radius, top);
  ctx.lineTo(left + width - radius, top);
  ctx.quadraticCurveTo(left + width, top, left + width, top + radius);
  ctx.lineTo(left + width, top + height - radius);
  ctx.quadraticCurveTo(
    left + width,
    top + height,
    left + width - radius,
    top + height
  );
  ctx.lineTo(left + radius, top + height);
  ctx.quadraticCurveTo(left, top + height, left, top + height - radius);
  ctx.lineTo(left, top + radius);
  ctx.quadraticCurveTo(left, top, left + radius, top);
  ctx.closePath();

  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.25;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y + 0.5);
  ctx.restore();
};

const TrendsGraphs = ({ country = "guatemala" }) => {
  // IDS
  const countryID = useParams().countryID || country;
  const countryISO = toISO(countryID);

  // STATES
  const [graphType, setGraphType] = useState("");
  const [chartType, setChartType] = useState("");
  const [period, setPeriod] = useState("");
  const [isScreenShotTime, setIsScreenShotTime] = useState(false);

  // REF
  const containerRef = useRef(null);
  const trackedStartRef = useRef("");
  const trackedResultRef = useRef("");
  const trackedVisualizationRef = useRef("");

  // PERIOD
  const handlePeriod = (ev) => setPeriod(ev.target.value);

  // DATA GRAPH
  const handleDnD = (result) =>
    handleGraphType(result, setGraphType, setChartType);

  // DATOS
  const graphData = useGraphData(period, graphType, chartType, countryID);
  const hasValidSelection =
    period !== "" && graphType.length > 0 && chartType.length > 0;
  const legendItems =
    graphData?.datasets?.length > 0
      ? graphData.datasets.map((dataset) => dataset.label)
      : [];
  const activeChartType = chartType || "bar";
  const trendPeriodLabel = customPeriods[period] || "";
  const positiveValueCount = useMemo(
    () =>
      (graphData?.datasets || []).reduce(
        (acc, dataset) =>
          acc +
          (Array.isArray(dataset?.data)
            ? dataset.data.filter((value) => Number(value || 0) > 0).length
            : 0),
        0
      ),
    [graphData]
  );
  const showValueLabels = true;
  const isStackedChart = activeChartType === "group";
  const isAreaChart = activeChartType === "area";

  useEffect(() => {
    if (!hasValidSelection) return;

    const eventKey = [countryISO, period, graphType, chartType].join("|");
    if (trackedStartRef.current === eventKey) return;
    trackedStartRef.current = eventKey;

    const baseProperties = {
      section: "customize_trends",
      visualizationType: chartType,
      chartDataType: graphType,
      trendPeriod: trendPeriodLabel,
      filters: {
        country: countryISO,
      },
    };

    trackEvent("filter_applied", baseProperties);
    trackEvent("search_started", baseProperties);
  }, [chartType, countryISO, graphType, hasValidSelection, period, trendPeriodLabel]);

  useEffect(() => {
    if (!hasValidSelection) return;

    const eventKey = [countryISO, graphType, chartType].join("|");
    if (trackedVisualizationRef.current === eventKey) return;
    trackedVisualizationRef.current = eventKey;

    trackEvent("visualization_changed", {
      section: "customize_trends",
      visualizationType: chartType,
      chartDataType: graphType,
      trendPeriod: trendPeriodLabel,
      filters: {
        country: countryISO,
      },
    });
  }, [chartType, countryISO, graphType, hasValidSelection, trendPeriodLabel]);

  useEffect(() => {
    if (!hasValidSelection) return;
    if (!Array.isArray(graphData?.labels) || graphData.labels.length === 0) return;
    if (positiveValueCount <= 0) return;

    const eventKey = [
      countryISO,
      period,
      graphType,
      chartType,
      graphData.labels.length,
      graphData?.datasets?.length || 0,
      positiveValueCount,
    ].join("|");
    if (trackedResultRef.current === eventKey) return;
    trackedResultRef.current = eventKey;

    const baseProperties = {
      section: "customize_trends",
      visualizationType: chartType,
      chartDataType: graphType,
      trendPeriod: trendPeriodLabel,
      resultCount: positiveValueCount,
      filters: {
        country: countryISO,
      },
    };

    trackEvent("search_completed", baseProperties);
    trackEvent("visualization_viewed", baseProperties);
  }, [
    chartType,
    countryISO,
    graphData,
    graphType,
    hasValidSelection,
    period,
    positiveValueCount,
    trendPeriodLabel,
  ]);

  const exportValueLabelsPlugin = useMemo(
    () => ({
      id: "exportValueLabels",
      afterDatasetsDraw(chart) {
        if (!showValueLabels) return;

        const { ctx, chartArea } = chart;
        if (!ctx || !chartArea) return;

        ctx.save();
        ctx.font = "600 12px Oswald";
        ctx.textAlign = "center";
        if (isAreaChart) {
          ctx.textBaseline = "middle";
          chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            if (!meta?.data?.length || meta.hidden) return;

            meta.data.forEach((element, dataIndex) => {
              const value = Number(dataset?.data?.[dataIndex] || 0);
              if (!value) return;

              const isBlueSeries = datasetIndex % 2 === 0;
              const preferredX = element.x + (isBlueSeries ? -34 : 34);
              const minX = chartArea.left + 38;
              const maxX = chartArea.right - 38;
              const x = Math.min(Math.max(preferredX, minX), maxX);

              let y = element.y - (isBlueSeries ? 14 : 28);
              if (y < chartArea.top + 14) {
                y = element.y + (isBlueSeries ? 18 : 26);
              }

              drawLabelTag(
                ctx,
                formatChartValue(value),
                x,
                y,
                defaultItemColors[datasetIndex % defaultItemColors.length]
              );
            });
          });
        } else if (isStackedChart) {
          chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            if (!meta?.data?.length || meta.hidden) return;

            meta.data.forEach((element, dataIndex) => {
              const value = Number(dataset?.data?.[dataIndex] || 0);
              if (!value) return;

              const segmentHeight = Math.abs((element.base ?? 0) - element.y);
              const label = formatChartValue(value);

              if (segmentHeight < 28) {
                const x = element.x;
                const y = Math.max(
                  element.y - 12 - datasetIndex * 24,
                  chartArea.top + 14
                );
                drawLabelTag(
                  ctx,
                  label,
                  x,
                  y,
                  defaultItemColors[datasetIndex % defaultItemColors.length]
                );
                return;
              }

              ctx.textBaseline = "middle";
              const x = element.x;
              const y = element.y + ((element.base ?? element.y) - element.y) / 2;
              drawContrastText(
                ctx,
                label,
                x,
                y,
                getDatasetLabelColor(datasetIndex)
              );
            });
          });
        } else {
          ctx.textBaseline = "bottom";
          chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            if (!meta?.data?.length || meta.hidden) return;

            meta.data.forEach((element, dataIndex) => {
              const value = Number(dataset?.data?.[dataIndex] || 0);
              if (!value) return;

              const x = element.x;
              const y = Math.max(element.y - 8, chartArea.top + 12);
              drawOutlinedText(ctx, formatChartValue(value), x, y, "#1f2937");
            });
          });
        }

        ctx.restore();
      },
    }),
    [isAreaChart, isStackedChart, showValueLabels]
  );

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
            honduras: "Secretaría de Niñez, Adolescencia y Familia (SENAF)",
            elsalvador: "Dirección General de Migración y Extranjería El Salvador",
          },
        })}
      </Text>

      <Text
        textAlign="center"
        fontFamily="Montserrat Medium"
        fontSize={{ base: "xs", md: "sm" }}
      >
        Esta información ha sido procesada por: Monitoreo de niñez y
        adolescencia migrante - Monitoreo Binacional de Niñez Migrante
        Guatemala-Honduras y El Salvador.
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

            {graphType.length > 0 && legendItems.length > 0 && (
              <Stack direction="column">
                {legendItems.map((label, index) => (
                  <Stack direction="row" alignItems="center" key={label}>
                    <Box
                      bgColor={itemColors[index % itemColors.length]}
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
                          key={`bar-${activeChartType}-${isScreenShotTime ? "export" : "screen"}`}
                          width={800}
                          height={300}
                          plugins={[exportValueLabelsPlugin]}
                          options={{
                            responsive: true,
                            animation: isScreenShotTime ? false : undefined,
                            layout: {
                              padding: {
                                top: 42,
                              },
                            },
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
                          key={`line-${isScreenShotTime ? "export" : "screen"}`}
                          width={800}
                          height={300}
                          plugins={[exportValueLabelsPlugin]}
                          options={{
                            responsive: true,
                            animation: isScreenShotTime ? false : undefined,
                            layout: {
                              padding: {
                                top: 42,
                              },
                            },
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

          {isScreenShotTime && <GraphFooter sources={sources} responsive compact />}

          <DownloadImage
            containerRef={containerRef}
            label="Descargar imagen de tendencias"
            onSS={setIsScreenShotTime}
            analyticsProperties={{
              section: "customize_trends",
              visualizationType: chartType || activeChartType,
              chartDataType: graphType || "",
              trendPeriod: trendPeriodLabel,
              filters: {
                country: countryISO,
              },
            }}
          />
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default TrendsGraphs;
