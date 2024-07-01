// DATA GRAPH

import { monthNames } from "../../../../../../../hooks/fetch";

/**
 * Si draggableId es de droppableGraphs, establezca graphType en draggableId; de lo contrario,
 * establezca chartType en draggableId.
 * @param result - el resultado de arrastrar y soltar
 * @param setGraphType - una función que establece el tipo de gráfico
 * @param setChartType - una función que establece el tipo de gráfico
 * @returns El resultado es un objeto con las siguientes propiedades:
 */
const handleGraphType = (result, setGraphType, setChartType) => {
  if (!result.destination) return;
  if (result.source.droppableId === "droppableGraphs")
    setGraphType(result.draggableId);
  else setChartType(result.draggableId);
};

export const generateGraphDataFromRange = (min, max, year) => {
  return new Array(max - (min - 1))
    .fill(0)
    .map((_, i) => i)
    .map((month) => {
      return {
        ranges: [min + month, min + month],
        year,
        name: `${monthNames[month + min]} - ${year}`,
      };
    });
};

export default handleGraphType;
