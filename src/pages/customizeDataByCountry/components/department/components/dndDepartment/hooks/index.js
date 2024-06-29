import { useEffect } from "react";
import { updateSection } from "../tools";

/**
 * Cuando cambie el período o el año actual, actualice los datos de cada departamento de la lista.
 */
export const usePeriodReload = ({
  period,
  countryID,
  setDepList,
  depDataList,
  depData,
  depDataCapital,
  setDepDataList,
  currentYear,
}) => {
  const depIds = depDataList.map((dep) => dep?.id);

  useEffect(() => {
    depDataList.forEach((data, index) => {
      if (data.name?.length) {
        updateSection({
          id: index,
          dep: data.id,
          period,
          countryID,
          depData,
          depDataCapital,
          setDepDataList,
          setDepList,
          currentYear,
        });
      }
    });
  }, [depIds[0], depIds[1], depIds[2], period[0], period[1], currentYear]);
};
