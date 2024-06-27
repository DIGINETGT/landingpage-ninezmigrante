import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  GET_RETURNEDS,
  GET_RETURNEDS_BY_COUNTRY,
} from "../utils/query/returned";
import { isMonthInRange } from "../utils/tools";

const useReturnedFilteredQuery = ({ query, year, period, country, skip }) => {
  if (skip) return [];

  const { countryID: id } = useParams();
  const countryID = country || id;
  const defQuery = query || GET_RETURNEDS_BY_COUNTRY(countryID);

  const { data } = useQuery(defQuery);

  const filteredData =
    data?.monthlyReports?.data?.filter((report) => {
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

  return filteredData;
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
  const defQuery = query ?? GET_RETURNEDS_BY_COUNTRY(countryID);
  const { data } = useQuery(defQuery);

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

  return filteredData;
};

export default useReturnedFilteredQuery;
