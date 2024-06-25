import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  GET_RETURNEDS,
  GET_RETURNEDS_BY_COUNTRY,
} from "../utils/query/returned";
import { isMonthInRange } from "../utils/tools";

const useReturnedFilteredQuery = ({
  query = GET_RETURNEDS_BY_COUNTRY,
  year,
  period,
  useFilters = false,
  country = "",
}) => {
  const { countryID: id } = useParams();
  const countryID = id || country;

  const { data } = useQuery(query);

  const filteredData = data?.monthlyReports?.data?.filter((report) => {
    const [reportYear, reportMonth] = report.attributes?.reportMonth
      .split("-")
      .map(Number);

    if (
      !isMonthInRange(reportMonth, period) ||
      reportYear?.toString() !== year?.toString()
    ) {
      return false;
    }

    return (
      report.attributes?.users_permissions_user?.data?.attributes?.organization?.data?.attributes?.department?.data?.attributes?.country?.data?.attributes?.name
        ?.toLowerCase()
        .replace(/\s+/g, "") === countryID?.toLowerCase().replace(/\s+/g, "")
    );
  });

  return filteredData;
};

export const useTransitFilteredQuery = ({
  query = GET_RETURNEDS_BY_COUNTRY,
  year,
  period,
  country = "",
}) => {
  const { data } = useQuery(query);
  const filteredData = data?.transitReports?.data?.filter((report) => {
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
  });

  return filteredData;
};

export default useReturnedFilteredQuery;
