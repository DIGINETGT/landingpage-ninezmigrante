import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DEPARTMENT_CARD } from '../utils/query/departmentCard';
import depName from '../../../../../../country/components/statistics/components/heatMap/components/modal/utils'; // mapa id->Nombre

export default function useDepartmentCard({ iso, year, period, depId }) {
  // Convierte 'quetzaltenango' -> 'Quetzaltenango'
  const label = depName?.[depId] || depId;

  const { data, loading, error } = useQuery(
    GET_DEPARTMENT_CARD(iso?.toUpperCase?.(), period, year, label),
    { fetchPolicy: 'cache-first', skip: !label }
  );

  const reports = data?.monthlyReports?.data ?? [];

  const { total, male, female } = useMemo(() => {
    let t = 0,
      m = 0,
      f = 0;

    for (const r of reports) {
      const ret = r?.attributes?.returned?.data?.attributes;

      for (const dc of ret?.department_contributions?.data ?? []) {
        t += Number(dc?.attributes?.cant || 0);
      }

      for (const mc of ret?.municipality_contributions?.data ?? []) {
        const cant = Number(mc?.attributes?.cant || 0);
        const g = mc?.attributes?.gender?.data?.attributes?.name?.toLowerCase();
        if (g === 'masculino') m += cant;
        else if (g === 'femenino') f += cant;
      }
    }
    return { total: t, male: m, female: f };
  }, [reports]);

  return { loading, error, label, total, male, female };
}
