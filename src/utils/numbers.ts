export type BigStatMode = 'long' | 'short';

export function formatStat(
  n: number,
  opts: { compactFrom?: number; mode?: BigStatMode } = {}
) {
  const { compactFrom = 10_000, mode = 'long' } = opts;
  const nfEs = new Intl.NumberFormat('es-GT', {
    useGrouping: true,
    maximumFractionDigits: 0,
  });
  const nfCompact = new Intl.NumberFormat('es-GT', {
    notation: 'compact',
    compactDisplay: mode, // <- usa el union
    maximumFractionDigits: 1,
  });
  const long = nfEs.format(n);
  const compact = nfCompact.format(n);
  const isCompact = n >= compactFrom;
  return { display: isCompact ? compact : long, long, compact, isCompact };
}

export const formatInt = (n: number, locale = 'es-GT') =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
