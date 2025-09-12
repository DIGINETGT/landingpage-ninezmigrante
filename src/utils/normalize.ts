// utils/normalize.ts
export const toNum = (v: string | number | undefined, fallback: number) => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export const toPeriod = (
  p: [number | string, number | string] | number[] | undefined,
  fallback: [number, number] = [1, 12]
): [number, number] => {
  if (!Array.isArray(p) || p.length < 2) return fallback;
  return [toNum(p[0], fallback[0]), toNum(p[1], fallback[1])];
};
