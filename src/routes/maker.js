/**
 * Categoría: MAKER (6 Endpoints)
 * Generadores gráficos tipo Brat, letreros Neón, Glitch RGB, Badges Shields.io, Memes y Breaking News.
 */

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sendSvg(res, svg) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(svg);
}

module.exports = {
  category: 'MAKER',
  description: 'Generadores de texto artístico, estilo Brat, letreros neón, glitch RGB, insignias y plantillas de memes.',
  endpoints: [
    {
      name: 'Brat Generator',
      path: '/api/m/brat',
      method: 'GET',
      description: 'Genera una imagen cuadrada con la estética icónica verde lima de BRAT.',
      responseType: 'image',
      params: [
        { name: 'text', type: 'string', required: true, example: 'api console v2', description: 'Texto en minúsculas estilo brat' },
        { name: 'theme', type: 'select', options: ['green', 'white', 'black'], required: false, example: 'green', description: 'Variante de color' }
      ],
      handler: async (req, res) => {
        const text = escapeXml((req.query.text || 'api console v2').toLowerCase());
        const theme = req.query.theme || 'green';
        const bg = theme === 'white' ? '#ffffff' : theme === 'black' ? '#0a0a0a' : '#8ACE00';
        const fg = theme === 'black' ? '#8ACE00' : '#000000';

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    <filter id="bratBlur"><feGaussianBlur stdDeviation="1.15"/></filter>
  </defs>
  <rect width="500" height="500" fill="${bg}"/>
  <text x="250" y="265" font-family="Arial Narrow, Arial, sans-serif" font-size="62" font-weight="700" fill="${fg}" text-anchor="middle" filter="url(#bratBlur)" letter-spacing="-1">${text}</text>
</svg>`);
      }
    },
    {
      name: 'Cyber Neon Sign Maker',
      path: '/api/m/neon-text',
      method: 'GET',
      description: 'Genera un letrero luminoso de neón con resplandor sobre pared oscura.',
      responseType: 'image',
      params: [
        { name: 'text', type: 'string', required: true, example: 'CYBER API 2077', description: 'Texto principal del neón' },
        { name: 'color', type: 'select', options: ['#00f5d4', '#ff007f', '#38bdf8', '#facc15'], required: false, example: '#00f5d4', description: 'Color del tubo de neón' }
      ],
      handler: async (req, res) => {
        const text = escapeXml((req.query.text || 'CYBER API 2077').toUpperCase());
        const color = escapeXml(req.query.color || '#00f5d4');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="240" viewBox="0 0 720 240">
  <defs>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="720" height="240" rx="16" fill="#06080f"/>
  <rect x="28" y="28" width="664" height="184" rx="12" fill="none" stroke="${color}" stroke-width="3" filter="url(#glow)"/>
  <text x="360" y="138" font-family="monospace" font-size="54" font-weight="900" fill="#ffffff" stroke="${color}" stroke-width="2" text-anchor="middle" filter="url(#glow)" letter-spacing="4">${text}</text>
</svg>`);
      }
    },
    {
      name: 'RGB Glitch Text Effect',
      path: '/api/m/glitch-text',
      method: 'GET',
      description: 'Genera un banner con efecto de distorsión cromática RGB Glitch.',
      responseType: 'image',
      params: [
        { name: 'text', type: 'string', required: true, example: 'SYSTEM OVERRIDE', description: 'Texto para aplicar efecto glitch' }
      ],
      handler: async (req, res) => {
        const text = escapeXml((req.query.text || 'SYSTEM OVERRIDE').toUpperCase());

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="220" viewBox="0 0 720 220">
  <rect width="720" height="220" rx="14" fill="#07070c"/>
  <text x="354" y="128" font-family="monospace" font-size="54" font-weight="900" fill="#ff0055" opacity="0.85" text-anchor="middle">${text}</text>
  <text x="366" y="132" font-family="monospace" font-size="54" font-weight="900" fill="#00f5d4" opacity="0.85" text-anchor="middle">${text}</text>
  <text x="360" y="130" font-family="monospace" font-size="54" font-weight="900" fill="#ffffff" text-anchor="middle">${text}</text>
  <rect x="80" y="102" width="560" height="6" fill="#07070c"/>
</svg>`);
      }
    },
    {
      name: 'Shield Status Badge Maker',
      path: '/api/m/shield-badge',
      method: 'GET',
      description: 'Genera insignias SVG estilo Shields.io para archivos README de GitHub.',
      responseType: 'image',
      params: [
        { name: 'label', type: 'string', required: true, example: 'API STATUS', description: 'Etiqueta izquierda' },
        { name: 'message', type: 'string', required: true, example: 'ONLINE 99.9%', description: 'Mensaje derecho' }
      ],
      handler: async (req, res) => {
        const label = escapeXml(req.query.label || 'API STATUS');
        const message = escapeXml(req.query.message || 'ONLINE 99.9%');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="44" viewBox="0 0 280 44">
  <rect width="130" height="44" rx="6" fill="#1e293b"/>
  <rect x="124" width="156" height="44" rx="6" fill="#10b981"/>
  <text x="65" y="27" font-family="monospace" font-size="14" font-weight="700" fill="#f8fafc" text-anchor="middle">${label}</text>
  <text x="202" y="27" font-family="monospace" font-size="14" font-weight="900" fill="#052e16" text-anchor="middle">${message}</text>
</svg>`);
      }
    },
    {
      name: 'Two-Panel Comparison Meme',
      path: '/api/m/drake-meme',
      method: 'GET',
      description: 'Genera un meme comparativo de 2 paneles (Rechazar vs Preferir).',
      responseType: 'image',
      params: [
        { name: 'reject', type: 'string', required: true, example: 'Pedir registro, tarjeta y API Key', description: 'Texto del panel superior ( ❌ )' },
        { name: 'prefer', type: 'string', required: true, example: 'Usar API Console V2 directo y gratis', description: 'Texto del panel inferior ( ✅ )' }
      ],
      handler: async (req, res) => {
        const reject = escapeXml((req.query.reject || 'Pedir registro, tarjeta y API Key').slice(0, 48));
        const prefer = escapeXml((req.query.prefer || 'Usar API Console V2 directo y gratis').slice(0, 48));

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="360" viewBox="0 0 720 360">
  <rect width="720" height="360" rx="16" fill="#0f172a" stroke="#334155" stroke-width="3"/>
  <line x1="0" y1="180" x2="720" y2="180" stroke="#334155" stroke-width="3"/>
  <line x1="180" y1="0" x2="180" y2="360" stroke="#334155" stroke-width="3"/>
  <rect x="10" y="10" width="160" height="160" rx="10" fill="rgba(244,63,94,0.15)"/>
  <text x="90" y="108" font-size="64" text-anchor="middle">🙅‍♂️</text>
  <text x="210" y="98" font-family="sans-serif" font-size="22" font-weight="700" fill="#fda4af">${reject}</text>
  <rect x="10" y="190" width="160" height="160" rx="10" fill="rgba(16,185,129,0.15)"/>
  <text x="90" y="288" font-size="64" text-anchor="middle">😎👉</text>
  <text x="210" y="278" font-family="sans-serif" font-size="22" font-weight="800" fill="#6ee7b7">${prefer}</text>
</svg>`);
      }
    },
    {
      name: 'Breaking News TV Banner',
      path: '/api/m/breaking-news',
      method: 'GET',
      description: 'Genera una pantalla de Noticia de Última Hora estilo transmisión de TV en vivo.',
      responseType: 'image',
      params: [
        { name: 'headline', type: 'string', required: true, example: 'DESARROLLADOR LANZA API CON 100+ ENDPOINTS GRATIS', description: 'Titular principal' },
        { name: 'ticker', type: 'string', required: false, example: 'EN VIVO • 99.9% UPTIME • SIN API KEY REQUERIDA', description: 'Cintillo inferior' }
      ],
      handler: async (req, res) => {
        const headline = escapeXml((req.query.headline || 'DESARROLLADOR LANZA API CON 100+ ENDPOINTS GRATIS').toUpperCase().slice(0, 56));
        const ticker = escapeXml((req.query.ticker || 'EN VIVO • 99.9% UPTIME • SIN API KEY REQUERIDA').toUpperCase());

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="320" viewBox="0 0 760 320">
  <rect width="760" height="320" rx="16" fill="#090d18"/>
  <rect x="30" y="24" width="110" height="34" rx="6" fill="#dc2626"/>
  <text x="85" y="47" font-family="monospace" font-size="15" font-weight="900" fill="#ffffff" text-anchor="middle">● LIVE TV</text>
  <rect x="0" y="195" width="760" height="75" fill="#b91c1c"/>
  <rect x="30" y="172" width="230" height="34" rx="4" fill="#facc15"/>
  <text x="145" y="195" font-family="sans-serif" font-size="16" font-weight="900" fill="#000000" text-anchor="middle">BREAKING NEWS</text>
  <text x="35" y="242" font-family="sans-serif" font-size="22" font-weight="900" fill="#ffffff">${headline}</text>
  <rect x="0" y="270" width="760" height="50" fill="#f8fafc"/>
  <text x="35" y="301" font-family="monospace" font-size="16" font-weight="800" fill="#0f172a">${ticker}</text>
</svg>`);
      }
    }
  ]
};
