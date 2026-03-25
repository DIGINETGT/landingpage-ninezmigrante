import { useState, useEffect } from "react";

//UTILS
import { month as currentMonth, year } from "../../../../../../../utils/year";
import { monthNames } from "../../../../../../../hooks/fetch";
import { defaultItemColors, itemColors } from "../utils";
import apolloClient from "../../../../../../../utils/apollo";
import {
  GET_RETURNEDS_BY_COUNTRY_FOR_AGE_GROUP,
  GET_RETURNEDS_BY_COUNTRY_FOR_GENDER,
  GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_COUNTRY,
  GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_ROUTE,
  GET_RETURNEDS_BY_COUNTRY_FOR_TRAVEL_CONDITION,
} from "../../../../../../../utils/query/returned";
import { isMonthInRange } from "../../../../../../../utils/tools";
import { generateGraphDataFromRange } from "../utils/events";

const datasetLabels = {
  gender: ["Femenino", "Masculino"],
  age: ["Primera infancia", "Niñez", "Adolescencia", "No registrado"],
  via: ["Terrestre", "Aérea", "Marítimo", "Otros"],
  condition: ["Acompañado", "No acompañado"],
  return: ["Estados Unidos", "México", "Canada"],
};

const normalizeText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getSeriesTotal = (totals = {}) =>
  (totals?.total1 || 0) +
  (totals?.total2 || 0) +
  (totals?.total3 || 0) +
  (totals?.total4 || 0);

/**
 * Toma tres parámetros, realiza una solicitud a una API y devuelve los datos en un formato que puede
 * ser utilizado por una biblioteca de gráficos.
 * @param period - "0" | "1" | "2"
 * @param graphType - "género", "vía", "condición", "retorno", "edad"
 * @param chartType - "bar"
 * @returns Un objeto con dos propiedades: etiquetas y conjuntos de datos.
 */

const month = currentMonth;
const useGraphData = (period, graphType, chartType, countryID) => {
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [],
  });

  // CALCULAR TOTAL DE PERIODOS
  let barLengths = 0;
  let currentYear = year;
  let localData = [];

  // UTIMO AÑO
  if (period === "0") {
    barLengths = 3;
    generateGraphDataFromRange(1, month, year).forEach((data) =>
      localData.push(data)
    );
  }

  // ULTIMOS 4 MESES
  if (period === "1") {
    barLengths = 4;
    if (month >= 4) {
      generateGraphDataFromRange(month - 3, month, currentYear).forEach(
        (data) => localData.push(data)
      );
    } else {
      const previousYearMonths = 4 - month;
      const previousYearStartMonth = 12 - previousYearMonths + 1;

      generateGraphDataFromRange(
        previousYearStartMonth,
        12,
        currentYear - 1
      ).forEach((data) => localData.push(data));

      generateGraphDataFromRange(1, month, currentYear).forEach((data) =>
        localData.push(data)
      );
    }
  }

  // ULTIMOS 3 AÑOS
  if (period === "2") {
    barLengths = 3;

    localData.push({
      ranges: [1, 12],
      year: currentYear,
      name: `${currentYear}`,
    });
    localData.push({
      ranges: [1, 12],
      year: currentYear - 1,
      name: `${currentYear - 1}`,
    });
    localData.push({
      ranges: [1, 12],
      year: currentYear - 2,
      name: `${currentYear - 2}`,
    });
  }

  useEffect(() => {
    if (period.length && graphType.length && chartType.length) {
   

      // PETICIONES
      const requests = localData.map(async (label) => {
        const selectedQuery = {
          via: GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_ROUTE(countryID, label.ranges, label?.year),
          condition: GET_RETURNEDS_BY_COUNTRY_FOR_TRAVEL_CONDITION(countryID, label.ranges, label?.year),
          return: GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_COUNTRY(countryID, label.ranges, label?.year),
          gender: GET_RETURNEDS_BY_COUNTRY_FOR_GENDER(countryID, label.ranges, label?.year),
          age: GET_RETURNEDS_BY_COUNTRY_FOR_AGE_GROUP(countryID, label.ranges, label?.year),
        }[graphType];
        
        let totals = { total1: 0, total2: 0, total3: 0, total4: 0 };
        const { data: queryData } = await apolloClient.query({
          query: selectedQuery,
          fetchPolicy: "network-only",
        });

        const filteredData = queryData?.monthlyReports?.data?.filter(
          (report) => {
            const [reportYear, reportMonth] =
              report?.attributes?.reportMonth?.split("-") ?? [];

            if (
              !isMonthInRange(reportMonth, label.ranges) ||
              reportYear?.toString() !== label?.year?.toString()
            ) {
              return false;
            }

            return true;
          }
        );

        const selectedContribution = {
          via: "return_route_contributions",
          condition: "travel_condition_contributions",
          return: "country_contributions",
          gender: "gender_contributions",
          age: "age_group_contributions",
        }[graphType];

        filteredData?.forEach((report) => {
          const contributionRawData =
            report.attributes?.returned?.data?.attributes?.[
              selectedContribution
            ]?.data;

          contributionRawData?.forEach((contributionData) => {
            const rawData = normalizeText(
              contributionData.attributes?.[
                selectedContribution?.replace("_contributions", "")
              ]?.data?.attributes?.name
            );

            const total = contributionData.attributes?.cant || 0;

            if (graphType === "gender") {
              if (rawData === "femenino") totals.total1 += total;
              if (rawData === "masculino") totals.total2 += total;
            }

            if (graphType === "via") {
              if (rawData.includes("terrest")) totals.total1 += total;
              else if (rawData.includes("aere")) totals.total2 += total;
              else if (rawData.includes("maritim")) totals.total3 += total;
              else totals.total4 += total;
            }

            if (graphType === "condition") {
              if (rawData === "acompanado") totals.total1 += total;
              if (rawData === "no acompanado") totals.total2 += total;
            }

            if (graphType === "return") {
              if (rawData === "estados unidos") totals.total1 += total;
              if (rawData === "mexico") totals.total2 += total;
              if (rawData === "canada") totals.total3 += total;
            }

            if (graphType === "age") {
              if (rawData === "primera infancia") totals.total1 += total;
              if (rawData === "ninez") totals.total2 += total;
              if (rawData === "adolescencia") totals.total3 += total;
              if (rawData === "no registrados" || rawData === "no registrado")
                totals.total4 += total;
            }
          });
        });

        return { ...label, ...totals };
      });

      // RESOLVER
      Promise.allSettled(requests)
        .then((res) => {
          let data =
            res
              ?.filter((r) => r.status === "fulfilled")
              ?.map((r) => r.value) ?? [];

          if (period === "2") {
            data = data.filter((totals) => getSeriesTotal(totals) > 0);
          }

          // REVERSE PARA PERIODO 1
          if (period === "1") data = data.reverse();

          const newGraphData = {
            labels: data.map((totals) => totals?.name),
            datasets: [
              {
                fill: true,
                label: datasetLabels[graphType][0],
                data: data.map((totals) => totals?.total1),
                backgroundColor:
                  chartType === "area" ? itemColors[0] : defaultItemColors[0],
              },
              {
                fill: true,
                label: datasetLabels[graphType][1],
                data: data.map((totals) => totals?.total2),
                backgroundColor:
                  chartType === "area" ? itemColors[1] : defaultItemColors[1],
              },
              {
                fill: true,
                label: datasetLabels[graphType][2],
                data: data.map((totals) => totals?.total3),
                backgroundColor:
                  chartType === "area" ? itemColors[2] : defaultItemColors[2],
              },
              datasetLabels?.[graphType]?.[3]
                ? {
                    fill: true,
                    label: datasetLabels[graphType][3],
                    data: data.map((totals) => totals?.total4),
                    backgroundColor:
                      chartType === "area"
                        ? itemColors[3]
                        : defaultItemColors[3],
                  }
                : undefined,
            ]
              .flat(Boolean)
              .filter(Boolean),
          };
          setGraphData(newGraphData);
        })
        .catch((err) => console.log(err));
    }
  }, [period, graphType, chartType, countryID]);

  return graphData;
};

export default useGraphData;
