import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_DETAINED_IN_BORDERDS_BY_COUNTRY } from "../../../../../../utils/query/detained";
import { dateToString, isMonthInRange } from "../../../../../../utils/tools";

export const useDetainedMexico = ({ period, currentYear }) => {
  const { countryID } = useParams();

  const { data: dataBorder } = useQuery(
    GET_DETAINED_IN_BORDERDS_BY_COUNTRY(countryID)
  );

  // OBTENER DATOS
  const bordersData = dataBorder?.detainedInBordersReports?.data;

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
  bordersData
    ?.filter((report) => {
      const [reportYear, reportMonth] = report.attributes?.reportDate
        .split("-")
        .map(Number);

      updateDate = dateToString(report?.attributes?.updatedAt ?? "0");

      if (
        !isMonthInRange(reportMonth, period) ||
        reportYear?.toString() !== currentYear?.toString()
      ) {
        return false;
      }

      // BY MEXICO
      const countryName = report?.attributes?.country?.data?.attributes?.name;
      if (countryName?.toLowerCase().replace(/\s+/g, "") !== "méxico")
        return false;

      return true;
    })
    .forEach((element) => {
      const total =
        element?.attributes?.detained_in_borders?.data?.reduce((acc, curr) => {
          return acc + curr?.attributes?.total;
        }, 0) ?? 0;

      dataPerMonth.female +=
        element?.attributes?.detained_in_borders?.data?.reduce(
          (acc, curr) => acc + curr?.attributes?.femenino,
          0
        ) ?? 0;
      dataPerMonth.male +=
        element?.attributes?.detained_in_borders?.data?.reduce(
          (acc, curr) => acc + curr?.attributes?.masculino,
          0
        ) ?? 0;
      dataPerMonth.acd +=
        element?.attributes?.detained_in_borders?.data?.reduce(
          (acc, curr) => acc + curr?.attributes?.acompaniados,
          0
        ) ?? 0;
      dataPerMonth.noAcd +=
        element?.attributes?.detained_in_borders?.data?.reduce(
          (acc, curr) => acc + curr?.attributes?.noAcompaniados,
          0
        ) ?? 0;
      dataPerMonth.f2 +=
        element?.attributes?.detained_in_borders?.data?.reduce(
          (acc, curr) => acc + curr?.attributes?.ninos,
          0
        ) ?? 0;
      dataPerMonth.f3 +=
        element?.attributes?.detained_in_borders?.data?.reduce(
          (acc, curr) => acc + curr?.attributes?.adolescentes,
          0
        ) ?? 0;

      dataPerMonth.totalMes += dataPerMonth.female + dataPerMonth.male;
    });

  return { dataPerMonth, updateDate };
};
