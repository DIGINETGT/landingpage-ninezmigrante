const SESSION_KEY = 'nm_analytics_session_id';

const FILTER_KEYS = new Set([
  'year',
  'country',
  'department',
  'municipality',
  'organization',
  'category',
  'subcategory',
  'gender',
  'ageGroup',
  'travelCondition',
  'returnRoute',
  'entryBorder',
  'protectionStatus',
]);

const isBrowser = typeof window !== 'undefined';

const isSafePrimitive = (value) =>
  ['string', 'number', 'boolean'].includes(typeof value);

const trimString = (value, maxLength = 120) =>
  typeof value === 'string' ? value.slice(0, maxLength) : value;

const getApiBaseUrl = () => {
  const rawBase =
    import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_API_URL || '';

  if (!rawBase) return '';

  return rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
};

const getAnalyticsEndpoint = () => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return '';

  return baseUrl.endsWith('/api')
    ? `${baseUrl}/analytics/events`
    : `${baseUrl}/api/analytics/events`;
};

const createFallbackSessionId = () =>
  `nm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const getSessionId = () => {
  if (!isBrowser) return 'server';

  const storedValue = window.sessionStorage.getItem(SESSION_KEY);
  if (storedValue) return storedValue;

  const nextValue =
    window.crypto?.randomUUID?.() || createFallbackSessionId();

  window.sessionStorage.setItem(SESSION_KEY, nextValue);
  return nextValue;
};

export const getDeviceType = () => {
  if (!isBrowser) return 'unknown';

  const width = window.innerWidth || 0;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const getSourceInfo = () => {
  if (!isBrowser) {
    return { sourceType: 'unknown' };
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');

  if (utmSource) {
    return {
      sourceType: 'utm',
      sourceDomain: trimString(utmSource, 80),
    };
  }

  if (document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer);
      if (referrerUrl.host && referrerUrl.host !== window.location.host) {
        return {
          sourceType: 'referral',
          sourceDomain: trimString(referrerUrl.host, 80),
        };
      }
    } catch (_error) {
      return { sourceType: 'referral' };
    }
  }

  return { sourceType: 'direct' };
};

const sanitizeFilters = (filters = {}) =>
  Object.entries(filters).reduce((acc, [key, value]) => {
    if (!FILTER_KEYS.has(key)) return acc;
    if (!isSafePrimitive(value)) return acc;

    acc[key] =
      typeof value === 'string'
        ? trimString(value, 80)
        : value;

    return acc;
  }, {});

const sanitizeProperties = (properties = {}) =>
  Object.entries(properties).reduce((acc, [key, value]) => {
    if (key === 'filters') {
      const safeFilters = sanitizeFilters(value);
      if (Object.keys(safeFilters).length > 0) {
        acc.filters = safeFilters;
      }
      return acc;
    }

    if (Array.isArray(value)) {
      const safeValues = value
        .filter(isSafePrimitive)
        .slice(0, 20)
        .map((item) => (typeof item === 'string' ? trimString(item) : item));

      if (safeValues.length > 0) {
        acc[key] = safeValues;
      }
      return acc;
    }

    if (isSafePrimitive(value)) {
      acc[key] = typeof value === 'string' ? trimString(value) : value;
    }

    return acc;
  }, {});

const getPagePath = () => {
  if (!isBrowser) return '/';
  return window.location.pathname || '/';
};

export const trackEvent = async (eventType, properties = {}) => {
  if (!isBrowser || !eventType) return false;

  const endpoint = getAnalyticsEndpoint();
  if (!endpoint) return false;

  const { sourceType, sourceDomain } = getSourceInfo();
  const payload = {
    eventType,
    sessionId: getSessionId(),
    pagePath: getPagePath(),
    deviceType: getDeviceType(),
    sourceType,
    ...(sourceDomain ? { sourceDomain } : {}),
    ...sanitizeProperties(properties),
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      keepalive: true,
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (_error) {
    return false;
  }
};
