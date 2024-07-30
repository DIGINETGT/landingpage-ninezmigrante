import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_DETAINED_US_BORDERDS_BY_COUNTRY } from "../../../../../../utils/query/detained";
import { dateToString, isMonthInRange } from "../../../../../../utils/tools";
import { monthNames } from "../../../../../../hooks/fetch";

const excludeFields = [
  "id",
  "total",
  "anio",
  "month",
  "createdAt",
  "updatedAt",
  "__typename",
];

const countyMapping = {
  sanDiego: "San Diego",
  elCentro: "El Centro",
  yuma: "Yuma",
  tucson: "Tucson",
  elPaso: "El Paso",
  bigBend: "Big Bend",
  delRio: "Del Rio",
  laredo: "Laredo",
  rioGrande: "Rio Grande",
  totalAcompaniados: "Acompañados",
  totalNoAcompaniados: "No Acompañados",
  total: "Total",
  default: "Otros",
};

export const useDetainedEEUU = ({ period, currentYear }) => {
  const { countryID } = useParams();

  const { data: dataBorder, loading } = useQuery(
    GET_DETAINED_US_BORDERDS_BY_COUNTRY(countryID, period, currentYear)
  );

  const bordersData = dataBorder?.detainedInBordersReports?.data;

  const dataPerMonth = {
    totalMes: 0,
  };

  const dataPerDeps = { acm: {}, noacm: {} };
  let updateDate = "";

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

    const filteredData = element.attributes?.detained_us_borders?.data ?? [];

    updateDate = dateToString(
      new Date(element?.attributes?.updatedAt?.toString() ?? 0)
    );

    const total = filteredData?.reduce((acc, curr) => {
      return acc + +(curr?.attributes?.total ?? 0);
    }, 0);

    filteredData?.forEach((dep) => {
      Object.keys(dep.attributes)
        .filter((key) => !excludeFields.includes(key))
        .forEach((key) => {
          const isNoAcomp = key.toLowerCase().includes("noacompaniados")
            ? "noacm"
            : "acm";

          const countryName =
            countyMapping[
              key?.replace("NoAcompaniados", "").replace("Acompaniados", "") ||
                "default"
            ] || countyMapping.default;

          if (!dataPerDeps.acm[countryName])
            dataPerDeps.acm = {
              ...dataPerDeps.acm,
              [countryName]: 0,
            };

          if (!dataPerDeps.noacm[countryName])
            dataPerDeps.noacm = {
              ...dataPerDeps.noacm,
              [countryName]: 0,
            };

          dataPerDeps[isNoAcomp][countryName] += dep.attributes[key];
        });
    });

    dataPerMonth.totalMes += total;
  });

  return { dataPerMonth, dataPerDeps, loading, updateDate, files };
};
