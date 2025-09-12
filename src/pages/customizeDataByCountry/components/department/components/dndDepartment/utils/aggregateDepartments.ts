type Report = any;

export const depKey = (s = '') =>
  s
    .toLowerCase()
    .trim()
    .replace(/department/gi, '')
    .replace(/\s+/g, '_')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // quita acentos

const normGen = (s = '') =>
  s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

type Totals = Record<string, number>;
type GenderByDep = Record<string, { masculino: number; femenino: number }>;
type Names = Record<string, string>;

export function aggregateDepartments(
  capReports: Report[] = [],
  muniReports: Report[] = []
) {
  const totalsCap: Totals = {};
  const totalsMuni: Totals = {};
  const genderMap: GenderByDep = {};
  const namesMap: Names = {};

  // 1) Totales por departamento (department_contributions)
  for (const r of capReports) {
    const arr =
      r?.attributes?.returned?.data?.attributes?.department_contributions
        ?.data ?? [];
    for (const dc of arr) {
      const a = dc?.attributes;
      const depName = a?.department?.data?.attributes?.name || 'N/D';
      const k = depKey(depName);
      const cant = Number(a?.cant || 0);

      totalsCap[k] = (totalsCap[k] || 0) + cant;
      if (!namesMap[k]) namesMap[k] = depName;
    }
  }

  // 2) Género y totales desde municipios (municipality_contributions)
  for (const r of muniReports) {
    const arr =
      r?.attributes?.returned?.data?.attributes?.municipality_contributions
        ?.data ?? [];
    for (const mc of arr) {
      const a = mc?.attributes;
      const muni = a?.municipality?.data?.attributes;
      const depName =
        muni?.department?.data?.attributes?.name ||
        muni?.department?.data?.attributes?.Name || // por si acaso
        'N/D';

      const k = depKey(depName);
      const cant = Number(a?.cant || 0);
      const g = normGen(a?.gender?.data?.attributes?.name || '');

      totalsMuni[k] = (totalsMuni[k] || 0) + cant;

      if (!genderMap[k]) genderMap[k] = { masculino: 0, femenino: 0 };
      if (g === 'masculino') genderMap[k].masculino += cant;
      else if (g === 'femenino') genderMap[k].femenino += cant;

      if (!namesMap[k]) namesMap[k] = depName;
    }
  }

  // 3) Totales finales: prioriza department_contributions; si no, usa municipios
  const totalsMap: Totals = {};
  const allKeys = new Set([
    ...Object.keys(totalsCap),
    ...Object.keys(totalsMuni),
  ]);
  for (const k of allKeys) {
    totalsMap[k] = totalsCap[k] ?? totalsMuni[k] ?? 0;
  }

  return { totalsMap, genderMap, namesMap };
}
