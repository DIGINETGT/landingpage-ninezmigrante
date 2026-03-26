import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const DEFAULT_BASE_URL = 'https://ninezmigrante.org';
const DEFAULT_PAGE_PATH = '/';
const DEFAULT_STAGES = [
  { duration: '30s', target: 5 },
  { duration: '1m', target: 20 },
  { duration: '30s', target: 0 },
];

const BASE_URL = String(__ENV.BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
const PAGE_PATH = String(__ENV.PAGE_PATH || DEFAULT_PAGE_PATH);
const THINK_TIME = Number(__ENV.THINK_TIME || 1);
const LOAD_ASSETS = String(__ENV.LOAD_ASSETS || 'false').toLowerCase() === 'true';
const MAX_ASSETS = Number(__ENV.MAX_ASSETS || 12);

const homeDuration = new Trend('home_duration');
const assetDuration = new Trend('home_asset_duration');
const homeContentOk = new Rate('home_content_ok');

function parseStages(rawStages) {
  if (!rawStages) return DEFAULT_STAGES;

  return rawStages
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [duration, target] = entry.split(':').map((value) => value.trim());
      return {
        duration,
        target: Number(target),
      };
    })
    .filter((stage) => stage.duration && Number.isFinite(stage.target));
}

function buildPageUrl() {
  if (/^https?:\/\//i.test(PAGE_PATH)) return PAGE_PATH;
  return `${BASE_URL}${PAGE_PATH.startsWith('/') ? PAGE_PATH : `/${PAGE_PATH}`}`;
}

function extractStaticAssets(html, pageUrl) {
  const found = new Set();
  const assetRegex =
    /(?:src|href)=["']([^"'#]+?\.(?:css|js|png|jpg|jpeg|svg|webp|ico)(?:\?[^"']*)?)["']/gi;

  let match;
  while ((match = assetRegex.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], pageUrl);
      const pageOrigin = new URL(pageUrl).origin;

      if (resolved.origin === pageOrigin) {
        found.add(resolved.toString());
      }
    } catch (_) {
      // Ignora URLs malformadas.
    }
  }

  return Array.from(found).slice(0, MAX_ASSETS);
}

export const options = {
  stages: parseStages(__ENV.STAGES),
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2500', 'p(99)<5000'],
    home_duration: ['p(95)<2000'],
    home_content_ok: ['rate>0.99'],
  },
};

export default function () {
  const pageUrl = buildPageUrl();
  const response = http.get(pageUrl, {
    tags: { name: 'home' },
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      'User-Agent': 'k6-ninezmigrante-home-test/1.0',
    },
  });

  homeDuration.add(response.timings.duration);

  const body = response.body || '';
  const contentType = String(response.headers['Content-Type'] || '');

  const ok = check(response, {
    'home responde 200': (r) => r.status === 200,
    'home entrega html': () => contentType.includes('text/html'),
    'home contiene marca': () => /NiñezMigrante|NinezMigrante/i.test(body),
  });

  homeContentOk.add(ok ? 1 : 0);

  if (LOAD_ASSETS) {
    const assets = extractStaticAssets(body, pageUrl);

    if (assets.length > 0) {
      const assetResponses = http.batch(
        assets.map((assetUrl) => [
          'GET',
          assetUrl,
          null,
          {
            tags: { name: 'home_asset' },
            headers: { Referer: pageUrl },
          },
        ])
      );

      for (const assetResponse of assetResponses) {
        assetDuration.add(assetResponse.timings.duration);
        check(assetResponse, {
          'asset responde bien': (r) => r.status >= 200 && r.status < 400,
        });
      }
    }
  }

  sleep(THINK_TIME);
}
