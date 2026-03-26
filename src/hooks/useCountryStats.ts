import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  GET_COUNTRY_DEPARTMENT_STATS,
  GET_COUNTRY_SUMMARY_STATS,
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
  const [loadDepartments, setLoadDepartments] = useState(false);

  const summaryQuery = useMemo(
    () => GET_COUNTRY_SUMMARY_STATS(country, period, year),
    [country, year, periodKey]
  );
  const departmentQuery = useMemo(
    () => GET_COUNTRY_DEPARTMENT_STATS(country, period, year),
    [country, year, periodKey]
  );

  useEffect(() => {
    setLoadDepartments(false);
  }, [country, year, periodKey]);

  const {
    data: summaryData,
    loading: summaryLoading,
    error: summaryError,
  } = useQuery(summaryQuery, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (summaryLoading) return;

    const timer = window.setTimeout(() => {
      setLoadDepartments(true);
    }, 150);

    return () => window.clearTimeout(timer);
  }, [summaryLoading, country, year, periodKey]);

  const {
    data: departmentData,
    loading: mapLoading,
    error: departmentError,
  } = useQuery(departmentQuery, {
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    skip: !loadDepartments,
  });

  const summaryReports = summaryData?.monthlyReports?.data ?? [];
  const departmentReports = departmentData?.monthlyReports?.data ?? [];

  const summaryStats = useMemo(() => {
    let total = 0;
    const files: { name: string; url: string }[] = [];
    const genders: Cnts = {};
    const travel: Cnts = {};
    const ages: Cnts = {};
    const routes: Cnts = {};
    const rcTotals: Cnts = {};
    const rcMaps: Record<string, string> = {};

    for (const report of summaryReports) {
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

    const updatedAtStr = summaryReports.reduce((latest, report) => {
      const updatedAt = report?.attributes?.updatedAt;
      if (!updatedAt) return latest;
      if (!latest) return updatedAt;

      return new Date(updatedAt) > new Date(latest) ? updatedAt : latest;
    }, '');

    return {
      totalCant: total,
      filesUrl: files,
      genderTotals: genders,
      travelConditionTotals: travel,
      ageGroupTotals: ages,
      returnRouteTotals: routes,
      returnCountryTotals: rcTotals,
      returnCountryMaps: rcMaps,
      updatedAtStr,
    };
  }, [summaryReports]);

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
    loading: summaryLoading,
    mapLoading: loadDepartments ? mapLoading : true,
    error: summaryError || departmentError,
    reports: summaryReports,
    totalCant: summaryStats.totalCant,
    filesUrl: summaryStats.filesUrl,
    genderTotals: summaryStats.genderTotals,
    travelConditionTotals: summaryStats.travelConditionTotals,
    ageGroupTotals: summaryStats.ageGroupTotals,
    returnRouteTotals: summaryStats.returnRouteTotals,
    returnCountryTotals: summaryStats.returnCountryTotals,
    returnCountryMaps: summaryStats.returnCountryMaps,
    depTotals: departmentStats.depTotals,
    depSubDepTotals: departmentStats.depSubDepTotals,
    depSubDepGenderTotals: departmentStats.depSubDepGenderTotals,
    updatedAtStr: summaryStats.updatedAtStr,
  };
}
