// REACT
import { useEffect } from "react";

/**
 * Obtiene datos de una API, los filtra, los ordena y los establece en un estado
 * @param setData - la función que establece los datos en el componente
 * @param countryID - El ID del país del que desea obtener los datos.
 * @param period - el período del año (trimestre)
 * @param year - El año a consultar
 * @param list - "asc" o "desc" o "predeterminado"
 */
export const sortDepartments = (list, databorders) => {
  let total = 0;
  const depTotals = databorders.depTotals;
  const data = Object.entries(depTotals).sort((a, b) =>
    list === "asc" || list === "default" || list?.length === 0
      ? b[1] - a[1]
      : a[1] - b[1]
  );

  const dataParsed = data.map(([key, total]) => ({
    id: key,
    total,
  }));

  return dataParsed;
};
