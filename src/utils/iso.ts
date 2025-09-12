// Ajusta la ruta/base según tu estructura
export const ISO_BY_SLUG: Record<string, string> = {
  guatemala: 'GT',
  honduras: 'HN',
  elsalvador: 'SV',
  gt: 'GT',
  hn: 'HN',
  sv: 'SV',
};

export function toISO(codeOrSlug?: string): string {
  const k = (codeOrSlug ?? '').toLowerCase();
  return ISO_BY_SLUG[k] ?? (codeOrSlug ?? '').toUpperCase();
}
