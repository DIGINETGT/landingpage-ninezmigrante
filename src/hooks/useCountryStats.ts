import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_COUNTRY_DEMOGRAPHIC_STATS,
  GET_COUNTRY_DEPARTMENT_STATS,
  GET_COUNTRY_HEAD_STATS,
  GET_COUNTRY_RETURN_STATS,
} from '../utils/query/countryStats';

type Cnts = Record<string, number>;

type UseCountryStatsOptions = {
  detailsDelayMs?: number;
  departmentsDelayMs?: number;
};

export default function useCountryStats({
  country,
  year,
  period,
  options = {},
}: {
  country: string;
  year: number | string;
  period: number[] | string[];
  options?: UseCountryStatsOptions;
}) {
  const periodKey = Array.isArray(period) ? period.join('-') : '';
  const [loadDetails, setLoadDetails] = useState(false);
  const [loadDepartments, setLoadDepartments] = useState(false);
  const detailsDelayMs = Number(options?.detailsDelayMs ?? 120);
  const departmentsDelayMs = Number(options?.departmentsDelayMs ?? 120);

  const headQuery = useMemo(
    () => GET_COUNTRY_HEAD_STATS(country, period, year),
    [country, year, periodKey]
  );
  const demographicQuery = useMemo(
    () => GET_COUNTRY_DEMOGRAPHIC_STATS(country, period, year),
    [country, year, periodKey]
  );
  const returnQuery = useMemo(
    () => GET_COUNTRY_RETURN_STATS(country, period, year),
    [country, year, periodKey]
  );
  const departmentQuery = useMemo(
    () => GET_COUNTRY_DEPARTMENT_STATS(country, period, year),
    [country, year, periodKey]
  );

  useEffect(() => {
    setLoadDetails(false);
    setLoadDepartments(false);
  }, [country, year, periodKey]);

  const {
    data: headData,
    loading: headLoading,
    error: headError,
  } = useQuery(headQuery, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (headLoading) return;

    const timer = window.setTimeout(() => {
      setLoadDetails(true);
    }, detailsDelayMs);

    return () => window.clearTimeout(timer);
  }, [headLoading, country, year, periodKey, detailsDelayMs]);

  const {
    data: demographicData,
    loading: demographicsQueryLoading,
    error: demographicError,
  } = useQuery(demographicQuery, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    skip: !loadDetails,
  });

  const {
    data: returnData,
    loading: returnsQueryLoading,
    error: returnError,
  } = useQuery(returnQuery, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    skip: !loadDetails,
  });

  useEffect(() => {
    if (!loadDetails || demographicsQueryLoading || returnsQueryLoading) return;

    const timer = window.setTimeout(() => {
      setLoadDepartments(true);
    }, departmentsDelayMs);

    return () => window.clearTimeout(timer);
  }, [
    loadDetails,
    demographicsQueryLoading,
    returnsQueryLoading,
    departmentsDelayMs,
  ]);

  const {
    data: departmentData,
    loading: departmentQueryLoading,
    error: departmentError,
  } = useQuery(departmentQuery, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    skip: !loadDepartments,
  });

  const headStats = useMemo(() => {
    const payload = headData?.countryHeadStats;

    return {
      totalCant: Number(payload?.totalCant) || 0,
      filesUrl: Array.isArray(payload?.filesUrl) ? payload.filesUrl : [],
      updatedAtStr: payload?.updatedAtStr || '',
    };
  }, [headData]);

  const demographicStats = useMemo(() => {
    const payload = demographicData?.countryDemographicStats;

    return {
      genderTotals: payload?.genderTotals || {},
      travelConditionTotals: payload?.travelConditionTotals || {},
      ageGroupTotals: payload?.ageGroupTotals || {},
    };
  }, [demographicData]);

  const returnStats = useMemo(() => {
    const payload = returnData?.countryReturnStats;

    return {
      returnRouteTotals: payload?.returnRouteTotals || {},
      returnCountryTotals: payload?.returnCountryTotals || {},
      returnCountryMaps: payload?.returnCountryMaps || {},
    };
  }, [returnData]);

  const departmentStats = useMemo(() => {
    const depTotals: Cnts = {};
    const rawDepTotals = departmentData?.countryDepartmentStats?.depTotals || {};

    for (const [rawKey, rawValue] of Object.entries(rawDepTotals)) {
      const key = rawKey
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll('department', '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      depTotals[key] = Number(rawValue) || 0;
    }

    return {
      depTotals,
      depSubDepTotals: {},
      depSubDepGenderTotals: {},
    };
  }, [departmentData]);

  return {
    loading: headLoading,
    demographicsLoading: !loadDetails || demographicsQueryLoading,
    returnsLoading: !loadDetails || returnsQueryLoading,
    mapLoading: !loadDepartments || departmentQueryLoading,
    error: headError || demographicError || returnError || departmentError,
    reports: [],
    totalCant: headStats.totalCant,
    filesUrl: headStats.filesUrl,
    genderTotals: demographicStats.genderTotals,
    travelConditionTotals: demographicStats.travelConditionTotals,
    ageGroupTotals: demographicStats.ageGroupTotals,
    returnRouteTotals: returnStats.returnRouteTotals,
    returnCountryTotals: returnStats.returnCountryTotals,
    returnCountryMaps: returnStats.returnCountryMaps,
    depTotals: departmentStats.depTotals,
    depSubDepTotals: departmentStats.depSubDepTotals,
    depSubDepGenderTotals: departmentStats.depSubDepGenderTotals,
    updatedAtStr: headStats.updatedAtStr,
  };
}
