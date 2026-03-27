import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_COUNTRY_DEMOGRAPHIC_STATS,
  GET_COUNTRY_DEPARTMENT_STATS,
  GET_COUNTRY_HEAD_STATS,
  GET_COUNTRY_RETURN_STATS,
} from '../utils/query/countryStats';

type Cnts = Record<string, number>;

const monthNames = [
  '',
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export default function useCountryStats({ country, year, period }) {
  const periodKey = Array.isArray(period) ? period.join('-') : '';
  const [loadDetails, setLoadDetails] = useState(false);
  const [loadDepartments, setLoadDepartments] = useState(false);

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
    }, 120);

    return () => window.clearTimeout(timer);
  }, [headLoading, country, year, periodKey]);

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
    }, 120);

    return () => window.clearTimeout(timer);
  }, [loadDetails, demographicsQueryLoading, returnsQueryLoading]);

  const {
    data: departmentData,
    loading: departmentQueryLoading,
    error: departmentError,
  } = useQuery(departmentQuery, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    skip: !loadDepartments,
  });

  const headReports = headData?.monthlyReports?.data ?? [];
  const demographicReports = demographicData?.monthlyReports?.data ?? [];
  const returnReports = returnData?.monthlyReports?.data ?? [];
  const departmentReports = departmentData?.monthlyReports?.data ?? [];

  const headStats = useMemo(() => {
    let total = 0;
    const files: { name: string; url: string }[] = [];

    for (const report of headReports) {
      const attr = report?.attributes;
      const ret = attr?.returned?.data?.attributes;

      total += Number(ret?.total) || 0;

      const [, month] = String(attr?.reportMonth || '')
        .split('-')
        .map(Number);

      for (const file of ret?.fuentes?.data ?? []) {
        files.push({
          name: monthNames[month] || 'Mes',
          url: file?.attributes?.url,
        });
      }
    }

    const updatedAtStr = headReports.reduce((latest, report) => {
      const updatedAt = report?.attributes?.updatedAt;
      if (!updatedAt) return latest;
      if (!latest) return updatedAt;

      return new Date(updatedAt) > new Date(latest) ? updatedAt : latest;
    }, '');

    return {
      totalCant: total,
      filesUrl: files,
      updatedAtStr,
    };
  }, [headReports]);

  const demographicStats = useMemo(() => {
    const genders: Cnts = {};
    const travel: Cnts = {};
    const ages: Cnts = {};

    for (const report of demographicReports) {
      const ret = report?.attributes?.returned?.data?.attributes;

      for (const gender of ret?.gender_contributions?.data ?? []) {
        const name =
          gender?.attributes?.gender?.data?.attributes?.name?.toLowerCase();
        const cant = Number(gender?.attributes?.cant) || 0;
        if (name) genders[name] = (genders[name] || 0) + cant;
      }

      for (const condition of ret?.travel_condition_contributions?.data ?? []) {
        const name =
          condition?.attributes?.travel_condition?.data?.attributes?.name?.toLowerCase();
        const cant = Number(condition?.attributes?.cant) || 0;
        if (name) travel[name] = (travel[name] || 0) + cant;
      }

      for (const age of ret?.age_group_contributions?.data ?? []) {
        const name =
          age?.attributes?.age_group?.data?.attributes?.name?.toLowerCase();
        const cant = Number(age?.attributes?.cant) || 0;
        if (name) ages[name] = (ages[name] || 0) + cant;
      }
    }

    return {
      genderTotals: genders,
      travelConditionTotals: travel,
      ageGroupTotals: ages,
    };
  }, [demographicReports]);

  const returnStats = useMemo(() => {
    const routes: Cnts = {};
    const rcTotals: Cnts = {};
    const rcMaps: Record<string, string> = {};

    for (const report of returnReports) {
      const ret = report?.attributes?.returned?.data?.attributes;

      for (const route of ret?.return_route_contributions?.data ?? []) {
        const name =
          route?.attributes?.return_route?.data?.attributes?.name?.toLowerCase();
        const cant = Number(route?.attributes?.cant) || 0;
        if (name) routes[name] = (routes[name] || 0) + cant;
      }

      for (const contribution of ret?.country_contributions?.data ?? []) {
        const name = contribution?.attributes?.country?.data?.attributes?.name;
        const cant = Number(contribution?.attributes?.cant) || 0;

        if (!name) continue;

        rcTotals[name] = (rcTotals[name] || 0) + cant;

        const mapUrl =
          contribution?.attributes?.country?.data?.attributes?.map?.data?.attributes?.url;
        if (mapUrl) rcMaps[name] = mapUrl;
      }
    }

    return {
      returnRouteTotals: routes,
      returnCountryTotals: rcTotals,
      returnCountryMaps: rcMaps,
    };
  }, [returnReports]);

  const departmentStats = useMemo(() => {
    const depTotals: Cnts = {};

    for (const report of departmentReports) {
      const contributions =
        report?.attributes?.returned?.data?.attributes?.department_contributions?.data ??
        [];

      for (const contribution of contributions) {
        const depName =
          contribution?.attributes?.department?.data?.attributes?.name || 'Otros';
        const key = depName
          .toLowerCase()
          .replaceAll(' ', '_')
          .replaceAll('department', '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        depTotals[key] =
          (depTotals[key] || 0) + (Number(contribution?.attributes?.cant) || 0);
      }
    }

    return {
      depTotals,
      depSubDepTotals: {},
      depSubDepGenderTotals: {},
    };
  }, [departmentReports]);

  return {
    loading: headLoading,
    demographicsLoading: !loadDetails || demographicsQueryLoading,
    returnsLoading: !loadDetails || returnsQueryLoading,
    mapLoading: !loadDepartments || departmentQueryLoading,
    error: headError || demographicError || returnError || departmentError,
    reports: headReports,
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
