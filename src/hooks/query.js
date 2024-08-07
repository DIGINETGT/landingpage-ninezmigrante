import { useLazyQuery, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { GET_RETURNEDS_BY_COUNTRY } from "../utils/query/returned";
import { isMonthInRange } from "../utils/tools";
import { monthNames } from "./fetch";
import { useEffect } from "react";

const useReturnedFilteredQuery = ({
  query,
  year,
  period,
  country,
  skip,
  filesRef,
}) => {
  if (skip) return [];

  const { countryID: id } = useParams();
  const countryID = country || id;
  const defQuery = query || GET_RETURNEDS_BY_COUNTRY(countryID, period, year);

  const [getData, { loading: loadingQuery, data }] = useLazyQuery(defQuery);

  const files = [];
  const filteredData =
    data?.monthlyReports?.data?.filter((report) => {
      report?.attributes?.returned?.data?.attributes?.fuentes?.data?.forEach(
        (fuente) => {
          const [, month] =
            report?.attributes?.reportMonth.split("-")?.map(Number) ?? 0;

          files.push({
            url: fuente?.attributes?.url ?? "",
            name: monthNames[month],
          });
        }
      );

      const [reportYear, reportMonth] = report.attributes?.reportMonth
        .split("-")
        .map(Number);

      if (
        !isMonthInRange(reportMonth, period) ||
        reportYear?.toString() !== year?.toString()
      ) {
        return false;
      }

      return true;
    }) ?? [];

  if (filesRef?.current) filesRef.current = files;

  useEffect(() => {
    if (data === undefined) {
      getData();
    }
  }, []);

  return {
    data: filteredData,
    loading: data ? loadingQuery : true,
  };
};

export const useTransitFilteredQuery = ({
  query,
  year,
  period,
  country,
  skip,
}) => {
  if (skip) return [];

  const { countryID: id } = useParams();
  const countryID = country || id;
  const defQuery = query ?? GET_RETURNEDS_BY_COUNTRY(countryID, period, year);
  const { data, loading } = useQuery(defQuery);

  const filteredData =
    data?.transitReports?.data?.filter((report) => {
      const [reportYear, reportMonth] = report.attributes?.reportDate
        .split("-")
        .map(Number);

      if (
        !isMonthInRange(reportMonth, period) ||
        reportYear?.toString() !== year?.toString()
      ) {
        return false;
      }

      return true;
    }) ?? [];

  return {
    data: filteredData,
    loading,
  };
};

export default useReturnedFilteredQuery;
