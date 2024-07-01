import moment from "moment-timezone";

/**
 * Toma una matriz, elimina el elemento en startIndex y lo inserta en endIndex.
 * @param list - la matriz de elementos que se van a reordenar
 * @param startIndex - El índice del elemento que se va a mover.
 * @param endIndex - El índice del elemento después del que está moviendo.
 * @returns El resultado del método de empalme.
 */
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Toma una cadena, escribe en mayúscula la primera letra y devuelve la nueva cadena.
 * @param text - El texto que desea escribir en mayúsculas.
 * @returns El primer carácter de la cadena se escribe en mayúscula y luego se devuelve el resto de la
 * cadena.
 */
export const capitalizeText = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const compareDateRange = ({ start, end, month }) => {
  // month 2024-06-18
  const comparedMonth = Number(month?.split("-")?.[1] ?? "0");
  return comparedMonth >= start && comparedMonth <= end;
};

export const isMonthInRange = (month, period) => {
  if (Array.isArray(period) && period.length > 1) {
    const [start, end] = period;
    return start <= end
      ? month >= start && month <= end
      : month >= start || month <= end;
  }
  return period?.includes(month);
};

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

export const dateToString = (date) => {
  // TIMEZONE GUATEMALA MOMENT
  return moment(isValidDate(date) ? new Date() : date)
    .tz("America/Guatemala")
    .format("DD-MM-YYYY");
};
