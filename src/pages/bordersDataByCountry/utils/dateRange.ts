// dateRange.ts
export function monthStart(year: number, m: number) {
  const mm = String(m).padStart(2, '0');
  return `${year}-${mm}-01`;
}
export function monthEnd(year: number, m: number) {
  const last = new Date(year, m, 0).getDate(); // día final del mes
  const mm = String(m).padStart(2, '0');
  const dd = String(last).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}
