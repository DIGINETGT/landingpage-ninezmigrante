import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_DETAINED_US_BORDERDS_BY_COUNTRY } from "../../../../../../utils/query/detained";
import { isMonthInRange } from "../../../../../../utils/tools";

const excludeFields = [
  "id",
  "total",
  "anio",
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

  const { data: dataBorder } = useQuery(
    GET_DETAINED_US_BORDERDS_BY_COUNTRY(countryID)
  );

  const bordersData = dataBorder?.detainedInBordersReports?.data;

  const dataPerMonth = {
    totalMes: 0,
  };

  const dataPerDeps = { acm: {}, noacm: {} };
  let updateDate = "";

  const filteredData = bordersData?.filter((report) => {
    const [reportYear, reportMonth] = report.attributes?.reportDate
      .split("-")
      .map(Number);

    updateDate = new Date(report?.attributes?.updatedAt ?? "0")?.toLocaleString(
      "en-Gb"
    );

    if (
      !isMonthInRange(reportMonth, period) ||
      reportYear?.toString() !== currentYear?.toString()
    ) {
      return false;
    }

    // BY MEXICO
    const countryName = report?.attributes?.country?.data?.attributes?.name;

    if (countryName?.toLowerCase().replace(/\s+/g, "") !== "estadosunidos")
      return false;

    return true;
  });

  filteredData?.forEach((element) => {
    const total = element?.attributes?.detained_us_borders?.data?.reduce(
      (acc, curr) => {
        return acc + curr?.attributes?.total;
      },
      0
    );

    element?.attributes?.detained_us_borders?.data?.forEach((dep) => {
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

  return { dataPerMonth, dataPerDeps, updateDate };
};
