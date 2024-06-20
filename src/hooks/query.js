import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  GET_RETURNEDS,
  GET_RETURNEDS_BY_COUNTRY,
} from "../utils/query/returned";

const useReturnedFilteredQuery = ({
  query = GET_RETURNEDS_BY_COUNTRY,
  year,
  period,
}) => {
  const { countryID } = useParams();
  const { data } = useQuery(query);

  const filteredData = data?.monthlyReports?.data?.filter((report) => {
    const [reportYear, reportMonth] = report.attributes?.reportMonth
      .split("-")
      .map(Number);

    const isMonthInRange = (month, period) => {
      if (Array.isArray(period) && period.length > 1) {
        const [start, end] = period;
        return start <= end
          ? month >= start && month <= end
          : month >= start || month <= end;
      }
      return period.includes(month);
    };

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

export default useReturnedFilteredQuery;
