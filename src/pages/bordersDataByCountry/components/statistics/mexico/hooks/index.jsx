import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_DETAINED_IN_BORDERDS_BY_COUNTRY } from "../../../../../../utils/query/detained";
import { dateToString, isMonthInRange } from "../../../../../../utils/tools";
import { monthNames } from "../../../../../../hooks/fetch";

export const useDetainedMexico = ({ period, currentYear }) => {
  const { countryID } = useParams();

  const { data: dataBorder } = useQuery(
    GET_DETAINED_IN_BORDERDS_BY_COUNTRY(countryID, period, currentYear)
  );

  // OBTENER DATOS
  const bordersData = [...(dataBorder?.detainedInBordersReports?.data ?? [])];

  let updateDate = "";
  const dataPerMonth = {
    totalMes: 0,
    female: 0,
    male: 0,
    acd: 0,
    noAcd: 0,
    f2: 0,
    f3: 0,
  };

  const files = [];
  bordersData?.forEach((element) => {
    element?.attributes?.fuentes?.data?.forEach((fuente) => {
      const [_, reportMonth] =
        element?.attributes?.reportDate?.split("-")?.map(Number) ?? 0;

      files.push({
        url: fuente?.attributes?.url ?? "",
        name: monthNames[Number(reportMonth)],
      });
    });

    const filteredData =
      element.attributes?.detained_in_borders?.data?.filter((report) => {
        const [reportYear, reportMonth] = report?.attributes?.month
          ?.split("-")
          .map(Number);

        if (
          !isMonthInRange(reportMonth, period) ||
          reportYear?.toString() !== currentYear?.toString()
        ) {
          return false;
        }

        return true;
      }) ?? [];

    updateDate = dateToString(
      new Date(element?.attributes?.updatedAt?.toString() ?? 0)
    );

    const total =
      filteredData?.reduce((acc, curr) => {
        return acc + curr?.attributes?.total;
      }, 0) ?? 0;

    dataPerMonth.female +=
      filteredData?.reduce(
        (acc, curr) => acc + curr?.attributes?.femenino,
        0
      ) ?? 0;
    dataPerMonth.male +=
      filteredData?.reduce(
        (acc, curr) => acc + curr?.attributes?.masculino,
        0
      ) ?? 0;
    dataPerMonth.acd +=
      filteredData?.reduce(
        (acc, curr) => acc + curr?.attributes?.acompaniados,
        0
      ) ?? 0;
    dataPerMonth.noAcd +=
      filteredData?.reduce(
        (acc, curr) => acc + curr?.attributes?.noAcompaniados,
        0
      ) ?? 0;
    dataPerMonth.f2 +=
      filteredData?.reduce((acc, curr) => acc + curr?.attributes?.ninos, 0) ??
      0;
    dataPerMonth.f3 +=
      filteredData?.reduce(
        (acc, curr) => acc + curr?.attributes?.adolescentes,
        0
      ) ?? 0;

    dataPerMonth.totalMes += total;
  });

  return { dataPerMonth, updateDate, files };
};
