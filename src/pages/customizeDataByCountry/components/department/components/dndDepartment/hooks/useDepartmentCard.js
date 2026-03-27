import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DEPARTMENT_CARD_STATS } from '../../../../../../../utils/query/customizeStats';
import depName from '../../../../../../country/components/statistics/components/heatMap/components/modal/utils'; // mapa id->Nombre

export default function useDepartmentCard({ iso, year, period, depId }) {
  // Convierte 'quetzaltenango' -> 'Quetzaltenango'
  const label = depName?.[depId] || depId;

  const { data, loading, error } = useQuery(
    GET_DEPARTMENT_CARD_STATS(iso?.toUpperCase?.(), period, year, label),
    { fetchPolicy: 'cache-and-network', skip: !label }
  );

  const { total, male, female } = useMemo(() => {
    const payload = data?.departmentCardStats;

    return {
      total: Number(payload?.total) || 0,
      male: Number(payload?.male) || 0,
      female: Number(payload?.female) || 0,
    };
  }, [data]);

  return { loading, error, label, total, male, female };
}
