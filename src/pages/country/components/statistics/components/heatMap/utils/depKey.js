// Normaliza nombres de departamentos igual que en useCountryStats:
// - minúsculas
// - espacios -> _
// - quita "department"
// - remueve acentos
const depKey = (s = '') =>
  String(s)
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/ /g, '_')
    .replace(/department/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default depKey;
