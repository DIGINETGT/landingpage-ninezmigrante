import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";

// UTILS
import { month as currentMonth, year as currentYear } from "../../../../../../../utils/year";
import { monthNames } from "../../../../../../../hooks/fetch";
import { defaultItemColors, itemColors } from "../utils";
import { GET_TRENDS_STATS } from "../../../../../../../utils/query/customizeStats";

const pad = (value) => String(value).padStart(2, "0");

const nextMonthStart = (year, month) => {
  const numericMonth = Number(month);
  const numericYear = Number(year);
  const nextMonth = numericMonth === 12 ? 1 : numericMonth + 1;
  const nextYear = numericMonth === 12 ? numericYear + 1 : numericYear;
  return `${nextYear}-${pad(nextMonth)}-01`;
};

const buildMonthlyBucket = (year, month, label) => ({
  start: `${year}-${pad(month)}-01`,
  end: nextMonthStart(year, month),
  label,
});

const buildYearlyBucket = (year, label) => ({
  start: `${year}-01-01`,
  end: `${year + 1}-01-01`,
  label,
});

const buildTrendBuckets = (period) => {
  const buckets = [];

  if (period === "0") {
    for (let month = 1; month <= currentMonth; month += 1) {
      buckets.push(buildMonthlyBucket(currentYear, month, `${month}-${currentYear}`));
    }
  }

  if (period === "1") {
    if (currentMonth >= 4) {
      for (let month = currentMonth - 3; month <= currentMonth; month += 1) {
        buckets.push(buildMonthlyBucket(currentYear, month, `${month}-${currentYear}`));
      }
    } else {
      const previousYearMonths = 4 - currentMonth;
      const previousYearStartMonth = 12 - previousYearMonths + 1;

      for (let month = previousYearStartMonth; month <= 12; month += 1) {
        buckets.push(
          buildMonthlyBucket(currentYear - 1, month, `${month}-${currentYear - 1}`)
        );
      }

      for (let month = 1; month <= currentMonth; month += 1) {
        buckets.push(buildMonthlyBucket(currentYear, month, `${month}-${currentYear}`));
      }
    }
  }

  if (period === "2") {
    buckets.push(buildYearlyBucket(currentYear, `${currentYear}`));
    buckets.push(buildYearlyBucket(currentYear - 1, `${currentYear - 1}`));
    buckets.push(buildYearlyBucket(currentYear - 2, `${currentYear - 2}`));
  }

  return buckets;
};

const formatLabels = (labels = [], period) => {
  if (period === "0" || period === "1") {
    return labels.map((label) => {
      const [month, year] = String(label).split("-");
      const monthIndex = Number(month);

      if (!Number.isFinite(monthIndex) || !year) return label;

      return `${monthNames?.[monthIndex] ?? label} - ${year}`.toUpperCase();
    });
  }

  return labels;
};

const filterEmptyYearBuckets = (labels = [], series = []) => {
  const keepIndexes = labels
    .map((_, index) =>
      series.some((item) => Number(item?.data?.[index] || 0) > 0) ? index : -1
    )
    .filter((index) => index >= 0);

  return {
    labels: keepIndexes.map((index) => labels[index]),
    series: series.map((item) => ({
      ...item,
      data: keepIndexes.map((index) => Number(item?.data?.[index] || 0)),
    })),
  };
};

const normalizeSeries = (rawSeries = []) =>
  (Array.isArray(rawSeries) ? rawSeries : []).map((item) => ({
    label: item?.label || "",
    data: Array.isArray(item?.data)
      ? item.data.map((value) => Number(value) || 0)
      : [],
  }));

const useGraphData = (period, graphType, chartType, countryID) => {
  const noopQuery = useMemo(
    () => gql`
      query {
        __typename
      }
    `,
    []
  );
  const emptyData = useMemo(
    () => ({
      labels: [],
      datasets: [],
    }),
    []
  );

  const buckets = useMemo(
    () => (period?.length && graphType?.length ? buildTrendBuckets(period) : []),
    [period, graphType]
  );

  const trendsQuery = useMemo(() => {
    if (!countryID || !graphType || buckets.length === 0) return null;
    return GET_TRENDS_STATS(countryID, graphType, buckets);
  }, [countryID, graphType, buckets]);

  const { data } = useQuery(trendsQuery || noopQuery, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    skip: !trendsQuery || !chartType?.length,
  });

  return useMemo(() => {
    if (!data?.trendsStats) return emptyData;

    let labels = Array.isArray(data.trendsStats?.labels)
      ? [...data.trendsStats.labels]
      : [];
    let series = normalizeSeries(data.trendsStats?.series);

    if (period === "2") {
      const filtered = filterEmptyYearBuckets(labels, series);
      labels = filtered.labels;
      series = filtered.series;
    }

    return {
      labels: formatLabels(labels, period),
      datasets: series.map((item, index) => ({
        fill: true,
        label: item.label,
        data: item.data,
        backgroundColor:
          chartType === "area"
            ? itemColors[index % itemColors.length]
            : defaultItemColors[index % defaultItemColors.length],
      })),
    };
  }, [chartType, data, emptyData, period]);
};

export default useGraphData;
