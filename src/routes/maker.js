/**
 * Categoría: MAKER (11 Endpoints)
 * Generador Brat mejorado (multi-línea, stretch, blur, align, 8 temas + colores custom),
 * 4 variantes Brat (Deluxe, Animated, Sticker, Story), iPhone Quoted Chat (IQC),
 * letreros Neón, Glitch RGB, Badges, Memes y Breaking News.
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

/* ---------- Motor Brat compartido ---------- */

const BRAT_THEMES = {
  green:  { bg: '#8ACE00', fg: '#000000' },
  white:  { bg: '#FFFFFF', fg: '#000000' },
  black:  { bg: '#0A0A0A', fg: '#8ACE00' },
  red:    { bg: '#DC2626', fg: '#FFFFFF' },
  blue:   { bg: '#2563EB', fg: '#FFFFFF' },
  purple: { bg: '#7C3AED', fg: '#FFFFFF' },
  orange: { bg: '#F97316', fg: '#000000' },
  pink:   { bg: '#EC4899', fg: '#FFFFFF' }
};

function resolveBratColors(query) {
  const theme = (query.theme || 'green').toLowerCase();
  const base = BRAT_THEMES[theme] || BRAT_THEMES.green;
  // Colores custom (bg / color) tienen prioridad sobre el tema
  const bg = /^#[0-9a-f]{3,8}$/i.test(query.bg || '') ? query.bg : base.bg;
  const fg = /^#[0-9a-f]{3,8}$/i.test(query.color || '') ? query.color : base.fg;
  return { bg, fg, theme: BRAT_THEMES[theme] ? theme : 'green' };
}

function splitBratLines(rawText, maxChars) {
  // Multi-línea automático: saltos de línea reales, "|" o wrap por longitud
  const explicit = String(rawText || 'brat')
    .replace(/\r/g, '')
    .split(/\n|\|/)
    .map(s => s.trim())
    .filter(Boolean);
  const lines = [];
  for (const chunk of explicit) {
    if (chunk.length <= maxChars) {
      lines.push(chunk);
    } else {
      const words = chunk.split(/\s+/);
      let current = '';
      for (const w of words) {
        if ((current + ' ' + w).trim().length > maxChars && current) {
          lines.push(current.trim());
          current = w;
        } else {
          current = (current + ' ' + w).trim();
        }
      }
      if (current) lines.push(current.trim());
    }
  }
  return lines.length ? lines.slice(0, 5) : ['brat'];
}

function bratTextLayer({ lines, fg, align, stretch, blur, fontSize, lineHeight, cx, topY, width, extraAttrs = '', strike = false, opacity = 1 }) {
  const anchor = align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle';
  const x = align === 'left' ? 40 : align === 'right' ? width - 40 : cx;
  const blurId = `bratBlur_${Math.round(blur * 100)}`;
  const filterAttr = blur > 0.02 ? ` filter="url(#${blurId})"` : '';
  const strikeLine = strike
    ? lines.map((_, i) => `<line x1="${x - (anchor === 'middle' ? 200 : anchor === 'end' ? 380 : 0)}" y1="${topY + i * lineHeight - fontSize * 0.28}" x2="${x + (anchor === 'middle' ? 200 : anchor === 'start' ? 380 : 0)}" y2="${topY + i * lineHeight - fontSize * 0.28}" stroke="${fg}" stroke-width="${Math.max(3, fontSize * 0.09)}"/>`).join('\n  ')
    : '';
  const textEls = lines.map((line, i) =>
    `<text x="${x}" y="${topY + i * lineHeight}" font-family="Arial Narrow, Helvetica Neue, Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="${fg}" text-anchor="${anchor}" letter-spacing="-1" opacity="${opacity}"${filterAttr}>${escapeXml(line.toLowerCase())}</text>`
  ).join('\n  ');

  return {
    defs: blur > 0.02
      ? `<filter id="${blurId}"><feGaussianBlur stdDeviation="${blur}"/></filter>`
      : '',
    group: `<g transform="translate(${cx} 0) scale(${stretch} 1) translate(${-cx} 0)" ${extraAttrs}>
  ${textEls}
  ${strikeLine}
</g>`
  };
}

function wrapHelperText() {}

module.exports = {
  category: 'MAKER',
  description: 'Generador Brat multi-línea con 8 temas y colores custom, variantes Deluxe/Animated/Sticker/Story, iPhone Quoted Chat (IQC), neón, glitch RGB, insignias y memes.',
  endpoints: [
    /* ==================================================================
       BRAT GENERATOR (MEJORADO)
       ================================================================== */
    {
      name: 'Brat Generator Pro',
      path: '/api/m/brat',
      method: 'GET',
      description: 'Genera una imagen estilo BRAT con soporte multi-línea automático, estiramiento tipográfico, blur regulable, alineación, 8 temas y colores personalizados.',
      responseType: 'image',
      params: [
        { name: 'text', type: 'string', required: true, example: 'api console v2', description: 'Texto (usa | o saltos de línea para multi-línea; el wrap automático trunca a 5 líneas)' },
        { name: 'theme', type: 'select', options: ['green', 'white', 'black', 'red', 'blue', 'purple', 'orange', 'pink'], required: false, example: 'green', description: '8 temas de color' },
        { name: 'bg', type: 'string', required: false, example: '#8ACE00', description: 'Color de fondo custom (hex) — sobreescribe el tema' },
        { name: 'color', type: 'string', required: false, example: '#000000', description: 'Color del texto custom (hex) — sobreescribe el tema' },
        { name: 'blur', type: 'number', required: false, example: '1.15', description: 'Desenfoque tipográfico regulable 0 - 5' },
        { name: 'align', type: 'select', options: ['left', 'center', 'right'], required: false, example: 'center', description: 'Alineación del texto' },
        { name: 'stretch', type: 'number', required: false, example: '1', description: 'Estiramiento tipográfico horizontal 0.5 - 2 (scaleX)' },
        { name: 'size', type: 'number', required: false, example: '62', description: 'Tamaño de fuente base 24 - 120' }
      ],
      handler: async (req, res) => {
        const raw = (req.query.text || 'api console v2').toLowerCase();
        const { bg, fg, theme } = resolveBratColors(req.query);
        const blur = Math.max(0, Math.min(5, parseFloat(req.query.blur != null ? req.query.blur : '1.15') || 0));
        const align = ['left', 'center', 'right'].includes(req.query.align) ? req.query.align : 'center';
        const stretch = Math.max(0.5, Math.min(2, parseFloat(req.query.stretch || '1') || 1));
        const fontSize = Math.max(24, Math.min(120, parseInt(req.query.size, 10) || 62));
        const lines = splitBratLines(raw, 12);
        const lineHeight = Math.round(fontSize * 1.18);
        const topY = 260 - ((lines.length - 1) * lineHeight) / 2 + fontSize * 0.32;

        const layer = bratTextLayer({ lines, fg, align, stretch, blur, fontSize, lineHeight, cx: 250, topY, width: 500 });

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    ${layer.defs}
  </defs>
  <rect width="500" height="500" fill="${bg}"/>
  ${layer.group}
  <metadata>theme=${theme} blur=${blur} align=${align} stretch=${stretch}</metadata>
</svg>`);
      }
    },

    /* ==================================================================
       BRAT DELUXE — texto tachado
       ================================================================== */
    {
      name: 'Brat Deluxe (Strikethrough Edition)',
      path: '/api/m/brat-deluxe',
      method: 'GET',
      description: 'Edición Deluxe del generador Brat con texto tachado (strikethrough), multi-línea, blur, stretch y temas completos.',
      responseType: 'image',
      params: [
        { name: 'text', type: 'string', required: true, example: 'deleted era', description: 'Texto a tachar (multi-línea con |)' },
        { name: 'theme', type: 'select', options: ['green', 'white', 'black', 'red', 'blue', 'purple', 'orange', 'pink'], required: false, example: 'black', description: 'Tema de color' },
        { name: 'bg', type: 'string', required: false, example: '#0A0A0A', description: 'Color de fondo custom (hex)' },
        { name: 'color', type: 'string', required: false, example: '#8ACE00', description: 'Color del texto custom (hex)' },
        { name: 'blur', type: 'number', required: false, example: '0.8', description: 'Desenfoque 0 - 5' },
        { name: 'align', type: 'select', options: ['left', 'center', 'right'], required: false, example: 'center', description: 'Alineación' },
        { name: 'stretch', type: 'number', required: false, example: '1.1', description: 'Estiramiento horizontal 0.5 - 2' }
      ],
      handler: async (req, res) => {
        const raw = (req.query.text || 'deleted era').toLowerCase();
        const { bg, fg, theme } = resolveBratColors(req.query);
        const blur = Math.max(0, Math.min(5, parseFloat(req.query.blur != null ? req.query.blur : '0.8') || 0));
        const align = ['left', 'center', 'right'].includes(req.query.align) ? req.query.align : 'center';
        const stretch = Math.max(0.5, Math.min(2, parseFloat(req.query.stretch || '1.1') || 1));
        const lines = splitBratLines(raw, 11);
        const fontSize = 64;
        const lineHeight = 78;
        const topY = 260 - ((lines.length - 1) * lineHeight) / 2 + 20;

        const layer = bratTextLayer({ lines, fg, align, stretch, blur, fontSize, lineHeight, cx: 250, topY, width: 500, strike: true });

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    ${layer.defs}
  </defs>
  <rect width="500" height="500" fill="${bg}"/>
  <rect x="0" y="0" width="500" height="500" fill="none" stroke="${fg}" stroke-width="10" stroke-dasharray="2 14" opacity="0.35"/>
  ${layer.group}
  <text x="492" y="488" font-family="monospace" font-size="12" fill="${fg}" opacity="0.55" text-anchor="end">BRAT DELUXE • ${escapeXml(theme).toUpperCase()}</text>
</svg>`);
      }
    },
    /* ==================================================================
       BRAT ANIMATED — SVG animado estroboscópico
       ================================================================== */
    {
      name: 'Brat Animated (Strobe SVG)',
      path: '/api/m/brat-animated',
      method: 'GET',
      description: 'Genera un SVG animado estilo BRAT con efecto estroboscópico (flash de colores y zoom pulsante) compatible con navegadores.',
      responseType: 'image',
      params: [
        { name: 'text', type: 'string', required: true, example: 'brat summer', description: 'Texto animado (multi-línea con |)' },
        { name: 'theme', type: 'select', options: ['green', 'white', 'black', 'red', 'blue', 'purple', 'orange', 'pink'], required: false, example: 'green', description: 'Tema base' },
        { name: 'bg', type: 'string', required: false, example: '#8ACE00', description: 'Color de fondo inicial (hex)' },
        { name: 'color', type: 'string', required: false, example: '#000000', description: 'Color del texto (hex)' },
        { name: 'speed', type: 'select', options: ['slow', 'normal', 'fast', 'insane'], required: false, example: 'normal', description: 'Velocidad del estroboscopio' },
        { name: 'align', type: 'select', options: ['left', 'center', 'right'], required: false, example: 'center', description: 'Alineación del texto' },
        { name: 'stretch', type: 'number', required: false, example: '1', description: 'Estiramiento tipográfico 0.5 - 2' }
      ],
      handler: async (req, res) => {
        const raw = (req.query.text || 'brat summer').toLowerCase();
        const { bg, fg } = resolveBratColors(req.query);
        const align = ['left', 'center', 'right'].includes(req.query.align) ? req.query.align : 'center';
        const stretch = Math.max(0.5, Math.min(2, parseFloat(req.query.stretch || '1') || 1));
        const speeds = { slow: '1.6s', normal: '0.9s', fast: '0.45s', insane: '0.18s' };
        const dur = speeds[req.query.speed] || speeds.normal;
        const lines = splitBratLines(raw, 11);
        const fontSize = 60;
        const lineHeight = 72;
        const topY = 260 - ((lines.length - 1) * lineHeight) / 2 + 18;

        const layer = bratTextLayer({ lines, fg, align, stretch, blur: 0, fontSize, lineHeight, cx: 250, topY, width: 500 });

        // Paleta estroboscópica: el fondo alterna entre el tema y colores flash
        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    <style>
      @keyframes bratStrobe { 0%,100% { opacity: 1; } 50% { opacity: 0.82; } }
      .strobe { animation: bratStrobe ${dur} steps(2, end) infinite; }
    </style>
  </defs>
  <rect width="500" height="500" fill="${bg}">
    <animate attributeName="fill" values="${bg};#ffffff;${bg};#000000;${bg}" dur="${dur}" repeatCount="indefinite"/>
  </rect>
  <g class="strobe">
    ${layer.group}
    <animateTransform attributeName="transform" type="scale" values="1;1.045;1" additive="sum" dur="${dur}" repeatCount="indefinite"/>
  </g>
  <rect width="500" height="500" fill="#ffffff" opacity="0">
    <animate attributeName="opacity" values="0;0.55;0;0.35;0" dur="${dur}" repeatCount="indefinite"/>
  </rect>
</svg>`);
      }
    },

    /* ==================================================================
       BRAT STICKER — borde troquelado blanco + sombra
       ================================================================== */
    {
      name: 'Brat Sticker (Die-Cut White Border)',
      path: '/api/m/brat-sticker',
      method: 'GET',
      description: 'Genera un sticker estilo BRAT con borde troquelado blanco, sombra difusa y texto recortable para WhatsApp/Telegram.',
      responseType: 'image',
      params: [
        { name: 'text', type: 'string', required: true, example: 'sticker brat', description: 'Texto del sticker (multi-línea con |)' },
        { name: 'theme', type: 'select', options: ['green', 'white', 'black', 'red', 'blue', 'purple', 'orange', 'pink'], required: false, example: 'green', description: 'Tema de color' },
        { name: 'bg', type: 'string', required: false, example: '#8ACE00', description: 'Color de fondo custom (hex)' },
        { name: 'color', type: 'string', required: false, example: '#000000', description: 'Color del texto custom (hex)' },
        { name: 'align', type: 'select', options: ['left', 'center', 'right'], required: false, example: 'center', description: 'Alineación' },
        { name: 'stretch', type: 'number', required: false, example: '1', description: 'Estiramiento horizontal 0.5 - 2' },
        { name: 'blur', type: 'number', required: false, example: '0.6', description: 'Desenfoque interior 0 - 5' }
      ],
      handler: async (req, res) => {
        const raw = (req.query.text || 'sticker brat').toLowerCase();
        const { bg, fg } = resolveBratColors(req.query);
        const align = ['left', 'center', 'right'].includes(req.query.align) ? req.query.align : 'center';
        const stretch = Math.max(0.5, Math.min(2, parseFloat(req.query.stretch || '1') || 1));
        const blur = Math.max(0, Math.min(5, parseFloat(req.query.blur != null ? req.query.blur : '0.6') || 0));
        const lines = splitBratLines(raw, 10);
        const fontSize = 58;
        const lineHeight = 70;
        const topY = 250 - ((lines.length - 1) * lineHeight) / 2 + 18;

        const layer = bratTextLayer({ lines, fg, align, stretch, blur, fontSize, lineHeight, cx: 250, topY, width: 500 });

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    ${layer.defs}
    <filter id="stickerShadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="500" height="500" fill="none"/>
  <g filter="url(#stickerShadow)">
    <rect x="34" y="34" width="432" height="432" rx="72" fill="${bg}" stroke="#ffffff" stroke-width="22"/>
    <rect x="48" y="48" width="404" height="404" rx="60" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.9"/>
    ${layer.group}
  </g>
  <circle cx="420" cy="86" r="16" fill="#ffffff" opacity="0.85"/>
  <circle cx="448" cy="118" r="9" fill="#ffffff" opacity="0.6"/>
</svg>`);
      }
    },

    /* ==================================================================
       BRAT STORY — póster vertical 9:16
       ================================================================== */
    {
      name: 'Brat Story (9:16 Vertical Poster)',
      path: '/api/m/brat-story',
      method: 'GET',
      description: 'Genera un póster vertical 9:16 (1080x1920) estilo BRAT optimizado para Stories de Instagram, TikTok y WhatsApp Status.',
      responseType: 'image',
      params: [
        { name: 'text', type: 'string', required: true, example: 'brat | summer | tour 2026', description: 'Texto del póster (multi-línea con |)' },
        { name: 'subtitle', type: 'string', required: false, example: 'WORLD TOUR • 2026', description: 'Subtítulo inferior' },
        { name: 'theme', type: 'select', options: ['green', 'white', 'black', 'red', 'blue', 'purple', 'orange', 'pink'], required: false, example: 'green', description: 'Tema de color' },
        { name: 'bg', type: 'string', required: false, example: '#8ACE00', description: 'Color de fondo custom (hex)' },
        { name: 'color', type: 'string', required: false, example: '#000000', description: 'Color del texto custom (hex)' },
        { name: 'align', type: 'select', options: ['left', 'center', 'right'], required: false, example: 'center', description: 'Alineación' },
        { name: 'stretch', type: 'number', required: false, example: '1', description: 'Estiramiento tipográfico 0.5 - 2' },
        { name: 'blur', type: 'number', required: false, example: '1.15', description: 'Desenfoque 0 - 5' }
      ],
      handler: async (req, res) => {
        const raw = (req.query.text || 'brat | summer | tour 2026').toLowerCase();
        const subtitle = escapeXml((req.query.subtitle || 'ONLY ON THE API CONSOLE V2').toUpperCase());
        const { bg, fg } = resolveBratColors(req.query);
        const align = ['left', 'center', 'right'].includes(req.query.align) ? req.query.align : 'center';
        const stretch = Math.max(0.5, Math.min(2, parseFloat(req.query.stretch || '1') || 1));
        const blur = Math.max(0, Math.min(5, parseFloat(req.query.blur != null ? req.query.blur : '1.15') || 0));
        const lines = splitBratLines(raw, 13);
        const fontSize = 128;
        const lineHeight = 150;
        const topY = 900 - ((lines.length - 1) * lineHeight) / 2 + 40;

        const layer = bratTextLayer({ lines, fg, align, stretch, blur, fontSize, lineHeight, cx: 540, topY, width: 1080 });

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    ${layer.defs}
  </defs>
  <rect width="1080" height="1920" fill="${bg}"/>
  <rect x="48" y="48" width="984" height="1824" fill="none" stroke="${fg}" stroke-width="3" opacity="0.4"/>
  ${layer.group}
  <text x="540" y="1745" font-family="Arial Narrow, Arial, sans-serif" font-size="44" font-weight="800" fill="${fg}" text-anchor="middle" letter-spacing="8">${subtitle}</text>
  <line x1="340" y1="1790" x2="740" y2="1790" stroke="${fg}" stroke-width="4"/>
  <text x="540" y="1852" font-family="monospace" font-size="26" fill="${fg}" opacity="0.7" text-anchor="middle" letter-spacing="4">1080 × 1920 • 9:16 STORY</text>
</svg>`);
      }
    },
    /* ==================================================================
       IQC — iPhone Quoted Chat (SVG realista)
       ================================================================== */
    {
      name: 'iPhone Quoted Chat Generator (IQC)',
      path: '/api/m/iqc',
      method: 'GET',
      description: 'Genera una imagen SVG realista de un chat de iOS (iPhone Quoted Chat) con hora, Dynamic Island, señal 5G, batería, nombre de contacto, mensaje citado de respuesta (replyTo/replyText), texto principal y temas ios-dark, ios-light e imessage-blue.',
      responseType: 'image',
      params: [
        { name: 'name', type: 'string', required: false, example: 'Lyan Valentin', description: 'Nombre del contacto en la cabecera del chat' },
        { name: 'text', type: 'string', required: true, example: 'Jajaja sí, la API ya está desplegada en Render 🚀', description: 'Texto principal del mensaje' },
        { name: 'replyTo', type: 'string', required: false, example: 'Mamá', description: 'Autor del mensaje citado (replyTo)' },
        { name: 'replyText', type: 'string', required: false, example: '¿Ya terminaste el proyecto, hijo?', description: 'Texto del mensaje citado (replyText)' },
        { name: 'theme', type: 'select', options: ['ios-dark', 'ios-light', 'imessage-blue'], required: false, example: 'ios-dark', description: 'Tema visual del chat' },
        { name: 'time', type: 'string', required: false, example: '9:41', description: 'Hora de la barra de estado' },
        { name: 'battery', type: 'number', required: false, example: '87', description: 'Nivel de batería (0 - 100)' },
        { name: 'status', type: 'select', options: ['Delivered', 'Read', 'Delivered · Read'], required: false, example: 'Delivered', description: 'Estado de entrega bajo el mensaje' }
      ],
      handler: async (req, res) => {
        const contact = escapeXml((req.query.name || 'Lyan Valentin').slice(0, 24));
        const textRaw = (req.query.text || 'Jajaja sí, la API ya está desplegada en Render 🚀').slice(0, 160);
        const replyTo = escapeXml((req.query.replyTo || 'Mamá').slice(0, 20));
        const replyRaw = (req.query.replyText || '¿Ya terminaste el proyecto, hijo?').slice(0, 90);
        const theme = ['ios-dark', 'ios-light', 'imessage-blue'].includes(req.query.theme) ? req.query.theme : 'ios-dark';
        const time = escapeXml(req.query.time || '9:41');
        const battery = Math.max(0, Math.min(100, parseInt(req.query.battery, 10) || 87));
        const status = escapeXml(['Delivered', 'Read', 'Delivered · Read'].includes(req.query.status) ? req.query.status : 'Delivered');

        const palettes = {
          'ios-dark': {
            frame: '#000000', header: '#0c0c0e', headerBorder: '#232326',
            chatBg: '#000000', textMain: '#ffffff', textDim: '#8e8e93',
            bubbleIn: '#26252b', bubbleInText: '#ffffff', bubbleOut: '#0a84ff', bubbleOutText: '#ffffff',
            quoteBar: '#5e5ce6', quoteName: '#7aa5ff', quoteText: '#b3b3b8',
            accent: '#0a84ff', island: '#000000', statusBar: '#ffffff'
          },
          'ios-light': {
            frame: '#e9e9ec', header: '#f7f7f8', headerBorder: '#d8d8dc',
            chatBg: '#ffffff', textMain: '#000000', textDim: '#8e8e93',
            bubbleIn: '#e5e5ea', bubbleInText: '#000000', bubbleOut: '#0a84ff', bubbleOutText: '#ffffff',
            quoteBar: '#0a84ff', quoteName: '#0a84ff', quoteText: '#6b6b70',
            accent: '#0a84ff', island: '#000000', statusBar: '#000000'
          },
          'imessage-blue': {
            frame: '#06121f', header: '#0a1a2c', headerBorder: '#14304c',
            chatBg: '#071523', textMain: '#eaf4ff', textDim: '#7d93aa',
            bubbleIn: '#12283f', bubbleInText: '#dcecff', bubbleOut: '#0a84ff', bubbleOutText: '#ffffff',
            quoteBar: '#34c7ff', quoteName: '#5ac8fa', quoteText: '#93b4cc',
            accent: '#34c7ff', island: '#000000', statusBar: '#eaf4ff'
          }
        };
        const p = palettes[theme];

        // Wrap simple del texto principal (máx. ~30 chars/línea)
        const wrapText = (str, max) => {
          const words = String(str).split(/\s+/);
          const out = [];
          let cur = '';
          for (const w of words) {
            if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur.trim()); cur = w; }
            else cur = (cur + ' ' + w).trim();
          }
          if (cur) out.push(cur);
          return out.slice(0, 5);
        };
        const textLines = wrapText(textRaw, 30);
        const replyLines = wrapText(replyRaw, 26).slice(0, 2);
        const bubbleH = 78 + textLines.length * 24 + (replyTo ? replyLines.length * 16 + 18 : 0);
        const bubbleY = 226;
        const initials = contact.replace(/[^A-Za-zÀ-ÿ ]/g, '').split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || 'IQ';

        const replyBlock = replyTo ? `
    <rect x="24" y="18" width="286" height="${replyLines.length * 16 + 26}" rx="8" fill="${p.quoteBar}" opacity="0.16"/>
    <rect x="24" y="18" width="3" height="${replyLines.length * 16 + 26}" rx="1.5" fill="${p.quoteBar}"/>
    <text x="38" y="36" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial" font-size="13" font-weight="700" fill="${p.quoteName}">${replyTo}</text>
    ${replyLines.map((l, i) => `<text x="38" y="${54 + i * 16}" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial" font-size="13" fill="${p.quoteText}">${escapeXml(l)}</text>`).join('\n    ')}` : '';

        const textBlock = textLines.map((l, i) =>
          `<text x="24" y="${(replyTo ? replyLines.length * 16 + 46 : 40) + i * 24}" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial" font-size="17" fill="${p.bubbleOutText}">${escapeXml(l)}</text>`
        ).join('\n    ');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="820" viewBox="0 0 420 820">
  <defs>
    <clipPath id="phoneClip"><rect x="0" y="0" width="420" height="820" rx="54"/></clipPath>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.chatBg}"/><stop offset="100%" stop-color="${p.frame}"/>
    </linearGradient>
  </defs>

  <!-- Marco del iPhone -->
  <g clip-path="url(#phoneClip)">
    <rect width="420" height="820" fill="url(#wall)"/>

    <!-- Barra de estado -->
    <text x="52" y="52" font-family="-apple-system, 'SF Pro Display', Helvetica, Arial" font-size="17" font-weight="700" fill="${p.statusBar}">${time}</text>
    <g transform="translate(298, 36)" fill="${p.statusBar}">
      <!-- Señal 5G: 4 barras -->
      <rect x="0" y="12" width="4" height="6" rx="1"/>
      <rect x="7" y="8" width="4" height="10" rx="1"/>
      <rect x="14" y="4" width="4" height="14" rx="1"/>
      <rect x="21" y="0" width="4" height="18" rx="1"/>
      <text x="30" y="17" font-family="-apple-system, Helvetica, Arial" font-size="13" font-weight="700" fill="${p.statusBar}">5G</text>
      <!-- WiFi -->
      <path d="M62 14 a10 10 0 0 1 14 0 l-7 8 z" opacity="0.95"/>
      <path d="M64.5 7.5 a16 16 0 0 1 19 0" fill="none" stroke="${p.statusBar}" stroke-width="2.6" stroke-linecap="round"/>
      <!-- Batería -->
      <rect x="92" y="2" width="26" height="13" rx="4" fill="none" stroke="${p.statusBar}" stroke-width="1.6" opacity="0.6"/>
      <rect x="94" y="4" width="${Math.round(22 * battery / 100)}" height="9" rx="2.5" fill="${p.statusBar}"/>
      <rect x="119.5" y="6" width="2.4" height="5" rx="1.2" fill="${p.statusBar}" opacity="0.6"/>
      <text x="128" y="15" font-family="-apple-system, Helvetica, Arial" font-size="11" font-weight="600" fill="${p.statusBar}">${battery}%</text>
    </g>

    <!-- Dynamic Island -->
    <rect x="146" y="22" width="128" height="36" rx="18" fill="${p.island}"/>
    <circle cx="252" cy="40" r="7" fill="#0d1b2a"/>
    <circle cx="252" cy="40" r="3.2" fill="#1d3557"/>

    <!-- Cabecera del chat -->
    <rect x="0" y="78" width="420" height="86" fill="${p.header}"/>
    <line x1="0" y1="164" x2="420" y2="164" stroke="${p.headerBorder}" stroke-width="1"/>
    <path d="M26 118 l-10 10 l10 10" fill="none" stroke="${p.accent}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="72" cy="121" r="22" fill="${p.accent}" opacity="0.18"/>
    <text x="72" y="128" font-family="-apple-system, Helvetica, Arial" font-size="16" font-weight="700" fill="${p.accent}" text-anchor="middle">${initials}</text>
    <text x="106" y="116" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial" font-size="18" font-weight="600" fill="${p.textMain}">${contact}</text>
    <text x="106" y="137" font-family="-apple-system, Helvetica, Arial" font-size="12" fill="${p.textDim}">iMessage · en línea</text>
    <circle cx="378" cy="121" r="3" fill="${p.accent}"/>
    <circle cx="392" cy="121" r="3" fill="${p.accent}"/>
    <circle cx="406" cy="121" r="3" fill="${p.accent}"/>

    <!-- Separador de día -->
    <text x="210" y="196" font-family="-apple-system, Helvetica, Arial" font-size="12" font-weight="600" fill="${p.textDim}" text-anchor="middle">Hoy ${time}</text>

    <!-- Burbuja de mensaje citado (respuesta) -->
    <g transform="translate(36, ${bubbleY})">
      <rect x="0" y="0" width="252" height="54" rx="18" fill="${p.bubbleIn}"/>
      <text x="18" y="23" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial" font-size="14" font-weight="600" fill="${p.textMain}">${replyTo}</text>
      <text x="18" y="42" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial" font-size="13" fill="${p.textDim}">Mensaje citado de ${replyTo}</text>
    </g>

    <!-- Burbuja principal con cita (reply) -->
    <g transform="translate(72, ${bubbleY + 68})">
      <rect x="0" y="0" width="312" height="${bubbleH}" rx="22" fill="${p.bubbleOut}"/>
      ${replyBlock}
      ${textBlock}
    </g>

    <!-- Estado de entrega -->
    <text x="384" y="${bubbleY + 68 + bubbleH + 24}" font-family="-apple-system, Helvetica, Arial" font-size="11" font-weight="500" fill="${p.textDim}" text-anchor="end">${status}</text>

    <!-- Barra inferior estilo teclado / input -->
    <rect x="0" y="756" width="420" height="64" fill="${p.header}"/>
    <line x1="0" y1="756" x2="420" y2="756" stroke="${p.headerBorder}" stroke-width="1"/>
    <rect x="24" y="772" width="320" height="34" rx="17" fill="${p.bubbleIn}"/>
    <text x="44" y="794" font-family="-apple-system, Helvetica, Arial" font-size="14" fill="${p.textDim}">iMessage</text>
    <circle cx="382" cy="789" r="17" fill="${p.accent}"/>
    <path d="M376 789 l6 -7 l6 7 l-6 7 z" fill="#ffffff"/>

    <!-- Home indicator -->
    <rect x="145" y="812" width="130" height="5" rx="2.5" fill="${p.statusBar}" opacity="0.55"/>
  </g>
  <rect x="1" y="1" width="418" height="818" rx="53" fill="none" stroke="${p.headerBorder}" stroke-width="2"/>
</svg>`);
      }
    },
    /* ==================================================================
       ENDPOINTS CLÁSICOS
       ================================================================== */
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
