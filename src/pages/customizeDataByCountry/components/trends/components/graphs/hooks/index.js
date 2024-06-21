import { useState, useEffect } from "react";

// REACT ROUTER DOM
import { useParams } from "react-router-dom";

//UTILS
import { month, year } from "../../../../../../../utils/year";
import { monthNames } from "../../../../../../../hooks/fetch";
import { defaultItemColors, itemColors } from "../utils";
import apolloClient from "../../../../../../../utils/apollo";
import useReturnedFilteredQuery from "../../../../../../../hooks/query";
import {
  GET_RETURNEDS,
  GET_RETURNEDS_BY_COUNTRY_FOR_AGE_GROUP,
  GET_RETURNEDS_BY_COUNTRY_FOR_GENDER,
  GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_COUNTRY,
  GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_ROUTE,
  GET_RETURNEDS_BY_COUNTRY_FOR_TRAVEL_CONDITION,
} from "../../../../../../../utils/query/returned";
import { isMonthInRange } from "../../../../../../../utils/tools";

const endpoints = {
  gender: "totalporgenero",
  age: "totalporrangoetario",
  via: "totalporviaderetorno",
  condition: "totalporcondiciondeviaje",
  return: "totalporpaisdeproveniencia",
};

const datasetLabels = {
  gender: ["Femenino", "Masculino"],
  age: ["Primera infancia", "Niñez", "Adolescencia"],
  via: ["Terrestre", "Aérea"],
  condition: ["Acompañado", "No acompañado"],
  return: ["Estados Unidos", "México", "Canada"],
};

/**
 * Toma tres parámetros, realiza una solicitud a una API y devuelve los datos en un formato que puede
 * ser utilizado por una biblioteca de gráficos.
 * @param period - "0" | "1" | "2"
 * @param graphType - "género", "vía", "condición", "retorno", "edad"
 * @param chartType - "bar"
 * @returns Un objeto con dos propiedades: etiquetas y conjuntos de datos.
 */
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
    localData.push({
      ranges: [1, 12],
      year,
      name: `Enero - Diciembre - ${year}`,
    });
  }

  // ULTIMOS 4 MESES
  if (period === "1") {
    barLengths = 4;

    if (month >= 5) {
      localData.push({
        ranges: [month - 4, month - 1],
        year: currentYear,
        name: `${monthNames[month - 4]} - ${
          monthNames[month - 1]
        } - ${currentYear}`,
      });
    } else {
      const startDiff = 5 - month;

      localData.push({
        ranges: [1, month],
        year: currentYear,
        name: `${monthNames[1]} - ${monthNames[month]} - ${currentYear}`,
      });

      if (startDiff > 1) {
        localData.push({
          ranges: [12 - startDiff, 12],
          year: currentYear - 1,
          name: `${monthNames[12 - startDiff]} - ${monthNames[12]} - ${
            currentYear - 1
          }`,
        });
      }
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
      const selectedQuery = {
        via: GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_ROUTE,
        condition: GET_RETURNEDS_BY_COUNTRY_FOR_TRAVEL_CONDITION,
        return: GET_RETURNEDS_BY_COUNTRY_FOR_RETURN_COUNTRY,
        gender: GET_RETURNEDS_BY_COUNTRY_FOR_GENDER,
        age: GET_RETURNEDS_BY_COUNTRY_FOR_AGE_GROUP,
      }[graphType];

      // PETICIONES
      const requests = localData.map(async (label) => {
        let totals = { total1: 0, total2: 0, total3: 0 };
        const { data: queryData } = await apolloClient.query({
          query: selectedQuery,
          variables: {},
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

            return (
              report.attributes?.users_permissions_user?.data?.attributes?.organization?.data?.attributes?.department?.data?.attributes?.country?.data?.attributes?.name
                ?.toLowerCase()
                .replace(/\s+/g, "") ===
              countryID?.toLowerCase().replace(/\s+/g, "")
            );
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
          report.attributes?.users_permissions_user?.data?.attributes?.organization?.data?.attributes?.department?.data?.attributes?.country?.data?.attributes?.country_contributions?.data?.forEach(
            (contribution) => {
              const contributionRawData =
                contribution.attributes?.returned?.data?.attributes?.[
                  selectedContribution
                ]?.data;

              contributionRawData?.forEach((contributionData) => {
                const rawData =
                  contributionData.attributes?.[
                    selectedContribution?.replace("_contributions", "")
                  ]?.data?.attributes?.name?.toLowerCase();

                const total = contributionData.attributes?.cant || 0;

                if (graphType === "gender") {
                  if (rawData === "femenino") totals.total1 += total;
                  if (rawData === "masculino") totals.total2 += total;
                }

                if (graphType === "via") {
                  if (rawData.includes("terrestre")) totals.total1 += total;

                  if (rawData.includes("aérea")) {
                    totals.total2 += total;
                  }
                }

                if (graphType === "condition") {
                  if (rawData === "acompañado") totals.total1 += total;
                  if (rawData === "no acompañado") totals.total2 += total;
                }

                if (graphType === "return") {
                  if (rawData === "estados unidos") totals.total1 += total;
                  if (rawData === "méxico") totals.total2 += total;
                  if (rawData === "canadá") totals.total3 += total;
                }

                if (graphType === "age") {
                  if (rawData === "primera infancia") totals.total1 += total;
                  if (rawData === "niñez") totals.total2 += total;
                  if (rawData === "adolescencia") totals.total3 += total;
                }
              });
            }
          );
        });

        return { ...label, ...totals };
      });

      // RESOLVER
      Promise.allSettled(requests)
        .then((res) => {
          let data = res?.map((r) => r.value) ?? [];

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
            ].flat(Boolean),
          };
          setGraphData(newGraphData);
        })
        .catch((err) => console.log(err));
    }
  }, [period, graphType, chartType]);

  return graphData;
};

export default useGraphData;
