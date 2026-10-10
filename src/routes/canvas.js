/**
 * Categoría: CANVAS (16 Endpoints)
 * Generadores dinámicos de tarjetas e imágenes SVG en tiempo real con parámetros
 * personalizables avanzados (temas, acentos, subtítulos, tiempos, formatos) + IQC Card.
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

/** Color hex válido o fallback */
function hexColor(value, fallback) {
  return /^#[0-9a-f]{3,8}$/i.test(value || '') ? value : fallback;
}

/** Wrap simple de texto a N líneas */
function wrapText(str, maxChars, maxLines) {
  const words = String(str || '').split(/\s+/);
  const out = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) {
      out.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) out.push(cur);
  return out.slice(0, maxLines || 3);
}

function initialsOf(name) {
  return String(name || 'U').replace(/[^A-Za-zÀ-ÿ0-9 ]/g, '').split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || 'U';
}

module.exports = {
  category: 'CANVAS',
  description: 'Generación dinámica de imágenes y tarjetas SVG: bienvenida, perfiles, Spotify, tweets, captchas, certificados, IQ Check y capturas, con temas y colores personalizables.',
  endpoints: [
    {
      name: 'Welcome Card V2',
      path: '/api/canvas/welcome',
      method: 'GET',
      description: 'Genera una tarjeta visual de bienvenida estilo Discord/Comunidad con avatar, servidor, contador y tema personalizable.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: 'LyanValentin', description: 'Nombre del usuario' },
        { name: 'guild', type: 'string', required: false, example: 'API CONSOLE COMMUNITY', description: 'Nombre del servidor' },
        { name: 'memberCount', type: 'number', required: false, example: '1428', description: 'Número de miembro' },
        { name: 'theme', type: 'select', options: ['cyber', 'emerald', 'sunset', 'midnight', 'zinc'], required: false, example: 'cyber', description: 'Tema de color' },
        { name: 'accent', type: 'string', required: false, example: '#00f5d4', description: 'Color de acento custom (hex)' },
        { name: 'subtitle', type: 'string', required: false, example: 'WELCOME TO THE SERVER', description: 'Texto superior de la tarjeta' },
        { name: 'avatarText', type: 'string', required: false, example: 'LV', description: 'Iniciales del avatar custom' }
      ],
      handler: async (req, res) => {
        const username = escapeXml(req.query.username || 'Developer');
        const guild = escapeXml(req.query.guild || 'API CONSOLE COMMUNITY');
        const memberCount = escapeXml(req.query.memberCount || '1024');
        const theme = req.query.theme || 'cyber';
        const subtitle = escapeXml((req.query.subtitle || 'WELCOME TO THE SERVER').toUpperCase().slice(0, 40));
        const palettes = {
          cyber: { bg1: '#090d16', bg2: '#111827', accent: '#00f5d4', accent2: '#6366f1' },
          emerald: { bg1: '#061512', bg2: '#0b2922', accent: '#10b981', accent2: '#34d399' },
          sunset: { bg1: '#1a0b12', bg2: '#2d121e', accent: '#f43f5e', accent2: '#fb923c' },
          midnight: { bg1: '#0a0a14', bg2: '#16162c', accent: '#38bdf8', accent2: '#818cf8' },
          zinc: { bg1: '#09090b', bg2: '#16161a', accent: '#a1a1aa', accent2: '#e4e4e7' }
        };
        const p = palettes[theme] || palettes.cyber;
        p.accent = hexColor(req.query.accent, p.accent);
        const initials = escapeXml(req.query.avatarText || initialsOf(username));

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="320" viewBox="0 0 800 320">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${p.bg1}"/><stop offset="100%" stop-color="${p.bg2}"/></linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${p.accent}"/><stop offset="100%" stop-color="${p.accent2}"/></linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="800" height="320" rx="20" fill="url(#bg)"/>
  <circle cx="720" cy="50" r="140" fill="${p.accent}" opacity="0.08" filter="url(#softGlow)"/>
  <rect x="16" y="16" width="768" height="288" rx="14" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
  <rect x="16" y="298" width="768" height="6" rx="3" fill="url(#accentGrad)"/>
  <g transform="translate(135, 160)">
    <circle cx="0" cy="0" r="76" fill="none" stroke="url(#accentGrad)" stroke-width="4" stroke-dasharray="12 6"/>
    <circle cx="0" cy="0" r="66" fill="#182032" stroke="${p.accent}" stroke-width="2"/>
    <text x="0" y="14" font-family="monospace" font-size="42" font-weight="800" fill="#ffffff" text-anchor="middle">${initials}</text>
  </g>
  <text x="245" y="98" font-family="monospace" font-size="14" font-weight="700" fill="${p.accent}" letter-spacing="3">${subtitle}</text>
  <text x="245" y="152" font-family="sans-serif" font-size="44" font-weight="900" fill="#ffffff">${username}</text>
  <text x="245" y="192" font-family="sans-serif" font-size="18" fill="#94a3b8">Joined <tspan fill="#e2e8f0" font-weight="700">${guild}</tspan></text>
  <rect x="245" y="216" width="220" height="38" rx="8" fill="rgba(255,255,255,0.06)"/>
  <text x="265" y="240" font-family="monospace" font-size="14" font-weight="700" fill="${p.accent}">MEMBER #${memberCount}</text>
</svg>`);
      }
    },
    {
      name: 'Goodbye Card V2',
      path: '/api/canvas/goodbye',
      method: 'GET',
      description: 'Genera una tarjeta visual de despedida cuando un usuario abandona un servidor o grupo.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: 'ShadowRunner', description: 'Nombre del usuario' },
        { name: 'guild', type: 'string', required: false, example: 'GAMERS LATAM', description: 'Nombre del servidor' },
        { name: 'remaining', type: 'number', required: false, example: '849', description: 'Miembros restantes' },
        { name: 'accent', type: 'string', required: false, example: '#f43f5e', description: 'Color de acento (hex)' },
        { name: 'message', type: 'string', required: false, example: 'USER LEFT THE SERVER', description: 'Mensaje superior de la tarjeta' }
      ],
      handler: async (req, res) => {
        const username = escapeXml(req.query.username || 'ShadowRunner');
        const guild = escapeXml(req.query.guild || 'GAMERS LATAM');
        const remaining = escapeXml(req.query.remaining || '849');
        const accent = hexColor(req.query.accent, '#f43f5e');
        const message = escapeXml((req.query.message || 'USER LEFT THE SERVER').toUpperCase().slice(0, 36));

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300" viewBox="0 0 800 300">
  <defs>
    <linearGradient id="gw" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#160a12"/><stop offset="100%" stop-color="#0e070c"/>
    </linearGradient>
  </defs>
  <rect width="800" height="300" rx="20" fill="url(#gw)" stroke="${accent}" stroke-opacity="0.4" stroke-width="1.5"/>
  <circle cx="135" cy="150" r="68" fill="#24101d" stroke="${accent}" stroke-width="2"/>
  <text x="135" y="164" font-family="monospace" font-size="40" font-weight="900" fill="${accent}" text-anchor="middle">${escapeXml(initialsOf(username))}</text>
  <text x="240" y="95" font-family="monospace" font-size="14" font-weight="700" fill="${accent}" letter-spacing="3">${message}</text>
  <text x="240" y="148" font-family="sans-serif" font-size="42" font-weight="900" fill="#ffffff">${username}</text>
  <text x="240" y="186" font-family="sans-serif" font-size="18" fill="#fda4af">Salió de ${guild}</text>
  <rect x="240" y="208" width="250" height="36" rx="8" fill="rgba(244,63,94,0.12)" stroke="rgba(244,63,94,0.3)" stroke-width="1"/>
  <text x="258" y="231" font-family="monospace" font-size="13" font-weight="700" fill="${accent}">QUEDAN ${remaining} MIEMBROS</text>
</svg>`);
      }
    },
    {
      name: 'Developer Profile Card',
      path: '/api/canvas/profile',
      method: 'GET',
      description: 'Genera una tarjeta de perfil con nivel, barra de experiencia (XP), rol, rango y tema de color personalizable.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: 'SiputzxDev', description: 'Nombre de usuario' },
        { name: 'role', type: 'string', required: false, example: 'Full-Stack API Architect', description: 'Título o especialidad' },
        { name: 'level', type: 'number', required: false, example: '42', description: 'Nivel actual' },
        { name: 'xp', type: 'number', required: false, example: '78', description: 'Porcentaje de XP (0 - 100)' },
        { name: 'accent', type: 'string', required: false, example: '#10b981', description: 'Color de acento (hex)' },
        { name: 'status', type: 'string', required: false, example: 'STATUS: VERIFIED DEVELOPER', description: 'Línea de estado inferior' }
      ],
      handler: async (req, res) => {
        const username = escapeXml(req.query.username || 'SiputzxDev');
        const role = escapeXml(req.query.role || 'Full-Stack API Architect');
        const level = Math.max(1, parseInt(req.query.level || '42', 10) || 42);
        const xp = Math.max(5, Math.min(100, parseInt(req.query.xp || '78', 10) || 78));
        const accent = hexColor(req.query.accent, '#10b981');
        const status = escapeXml((req.query.status || 'STATUS: VERIFIED DEVELOPER • NO API KEY REQUIRED').slice(0, 52));
        const barWidth = Math.round((xp / 100) * 460);

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="280" viewBox="0 0 760 280">
  <rect width="760" height="280" rx="18" fill="#0b0f19" stroke="#26324d" stroke-width="1.5"/>
  <circle cx="115" cy="140" r="64" fill="#1e293b" stroke="${accent}" stroke-width="2.5"/>
  <text x="115" y="154" font-family="monospace" font-size="38" font-weight="800" fill="${accent}" text-anchor="middle">${escapeXml(initialsOf(username))}</text>
  <text x="215" y="82" font-family="sans-serif" font-size="34" font-weight="800" fill="#f8fafc">${username}</text>
  <text x="215" y="114" font-family="monospace" font-size="16" fill="#38bdf8">${role}</text>
  <rect x="585" y="48" width="135" height="64" rx="10" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
  <text x="652" y="74" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="middle">LEVEL</text>
  <text x="652" y="100" font-family="monospace" font-size="26" font-weight="900" fill="${accent}" text-anchor="middle">${level}</text>
  <text x="215" y="168" font-family="monospace" font-size="14" fill="#cbd5e1">EXPERIENCE PROGRESS</text>
  <text x="675" y="168" font-family="monospace" font-size="14" font-weight="700" fill="${accent}" text-anchor="end">${xp}%</text>
  <rect x="215" y="182" width="460" height="18" rx="9" fill="#0f172a" stroke="#334155" stroke-width="1"/>
  <rect x="215" y="182" width="${barWidth}" height="18" rx="9" fill="${accent}"/>
  <text x="215" y="232" font-family="monospace" font-size="12" fill="#64748b">${status}</text>
</svg>`);
      }
    },
    {
      name: 'Spotify Now Playing Card',
      path: '/api/canvas/spotify',
      method: 'GET',
      description: 'Genera un reproductor visual estilo Spotify Now Playing con barra de tiempo, artista, álbum, tema y acento personalizables.',
      responseType: 'image',
      params: [
        { name: 'title', type: 'string', required: true, example: 'Midnight City Cyber', description: 'Título de la canción' },
        { name: 'artist', type: 'string', required: true, example: 'M83 & Synthwave Collective', description: 'Artista o banda' },
        { name: 'album', type: 'string', required: false, example: 'Hurry Up, We Are Dreaming', description: 'Nombre del álbum' },
        { name: 'progress', type: 'number', required: false, example: '65', description: 'Porcentaje reproducido (0 - 100)' },
        { name: 'accent', type: 'string', required: false, example: '#1db954', description: 'Color de acento (hex)' },
        { name: 'theme', type: 'select', options: ['dark', 'light'], required: false, example: 'dark', description: 'Tema del reproductor' },
        { name: 'currentTime', type: 'string', required: false, example: '02:18', description: 'Tiempo transcurrido' },
        { name: 'duration', type: 'string', required: false, example: '03:42', description: 'Duración total' }
      ],
      handler: async (req, res) => {
        const title = escapeXml((req.query.title || 'Midnight City Cyber').slice(0, 32));
        const artist = escapeXml((req.query.artist || 'Synthwave Collective').slice(0, 36));
        const album = escapeXml((req.query.album || 'API Console Sessions').slice(0, 34));
        const progress = Math.max(5, Math.min(100, parseInt(req.query.progress || '65', 10) || 65));
        const accent = hexColor(req.query.accent, '#1db954');
        const light = req.query.theme === 'light';
        const currentTime = escapeXml(req.query.currentTime || '02:18');
        const duration = escapeXml(req.query.duration || '03:42');
        const barW = Math.round((progress / 100) * 430);
        const bg = light ? '#f4f4f5' : '#09100d';
        const fgMain = light ? '#18181b' : '#ffffff';
        const fgDim = light ? '#52525b' : '#94a3b8';
        const trackBg = light ? '#d4d4d8' : '#1e293b';
        const albumBg = light ? '#e4e4e7' : '#121a24';

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="250" viewBox="0 0 720 250">
  <rect width="720" height="250" rx="20" fill="${bg}" stroke="${accent}" stroke-opacity="0.4" stroke-width="1.5"/>
  <g transform="translate(115, 125)">
    <rect x="-75" y="-75" width="150" height="150" rx="16" fill="${albumBg}" stroke="${accent}" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="54" fill="${bg}" stroke="${trackBg}" stroke-width="8"/>
    <circle cx="0" cy="0" r="18" fill="${accent}"/>
  </g>
  <circle cx="235" cy="54" r="8" fill="${accent}"/>
  <text x="252" y="59" font-family="monospace" font-size="13" font-weight="700" fill="${accent}" letter-spacing="2">NOW PLAYING ON SPOTIFY</text>
  <text x="225" y="102" font-family="sans-serif" font-size="28" font-weight="800" fill="${fgMain}">${title}</text>
  <text x="225" y="132" font-family="sans-serif" font-size="18" fill="${fgDim}">${artist}</text>
  <text x="225" y="156" font-family="monospace" font-size="13" fill="${fgDim}">Album: ${album}</text>
  <rect x="225" y="182" width="430" height="8" rx="4" fill="${trackBg}"/>
  <rect x="225" y="182" width="${barW}" height="8" rx="4" fill="${accent}"/>
  <circle cx="${225 + barW}" cy="186" r="7" fill="#ffffff" stroke="${accent}" stroke-width="1.5"/>
  <text x="225" y="212" font-family="monospace" font-size="12" fill="${fgDim}">${currentTime}</text>
  <text x="655" y="212" font-family="monospace" font-size="12" fill="${fgDim}" text-anchor="end">${duration}</text>
</svg>`);
      }
    },
    {
      name: 'Tweet Card Generator',
      path: '/api/canvas/tweet',
      method: 'GET',
      description: 'Genera una captura visual de publicación estilo X / Twitter con insignia de verificado, métricas, tema y hora personalizables.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: 'Siputzx API', description: 'Nombre visible' },
        { name: 'handle', type: 'string', required: false, example: 'siputzx_api', description: 'Usuario @handle' },
        { name: 'text', type: 'string', required: true, example: 'No login. No API key. Just pure REST API endpoints ready to execute from your browser!', description: 'Contenido del tweet' },
        { name: 'likes', type: 'string', required: false, example: '4.8K', description: 'Cantidad de likes' },
        { name: 'retweets', type: 'string', required: false, example: '942', description: 'Cantidad de reposts' },
        { name: 'theme', type: 'select', options: ['dark', 'light'], required: false, example: 'dark', description: 'Tema del tweet' },
        { name: 'verified', type: 'select', options: ['true', 'false'], required: false, example: 'true', description: 'Mostrar insignia de verificado' },
        { name: 'time', type: 'string', required: false, example: '2:30 PM · 10 Oct 2026', description: 'Sello de tiempo' },
        { name: 'avatarColor', type: 'string', required: false, example: '#1d9bf0', description: 'Color del avatar (hex)' }
      ],
      handler: async (req, res) => {
        const username = escapeXml((req.query.username || 'Siputzx API').slice(0, 24));
        const handle = escapeXml((req.query.handle || 'siputzx_api').replace(/^@/, '').slice(0, 20));
        const textLines = wrapText(req.query.text || 'No login. No API key. Just pure REST API!', 52, 3);
        const likes = escapeXml(req.query.likes || '4.8K');
        const retweets = escapeXml(req.query.retweets || '942');
        const light = req.query.theme === 'light';
        const verified = (req.query.verified || 'true') === 'true';
        const time = escapeXml(req.query.time || '2:30 PM · 10 Oct 2026');
        const avatarColor = hexColor(req.query.avatarColor, '#1d9bf0');
        const bg = light ? '#ffffff' : '#0b0e14';
        const fgMain = light ? '#0f1419' : '#ffffff';
        const fgDim = light ? '#536471' : '#64748b';
        const border = light ? '#eff3f4' : '#1e293b';

        const textEls = textLines.map((l, i) =>
          `<text x="40" y="${138 + i * 26}" font-family="sans-serif" font-size="19" fill="${light ? '#0f1419' : '#f1f5f9'}">${escapeXml(l)}</text>`
        ).join('\n  ');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="280" viewBox="0 0 720 280">
  <rect width="720" height="280" rx="18" fill="${bg}" stroke="${border}" stroke-width="1.5"/>
  <circle cx="66" cy="62" r="26" fill="${avatarColor}"/>
  <text x="66" y="70" font-family="sans-serif" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(initialsOf(username))}</text>
  <text x="106" y="58" font-family="sans-serif" font-size="19" font-weight="800" fill="${fgMain}">${username}${verified ? ` <tspan fill="#1d9bf0">✔</tspan>` : ''}</text>
  <text x="106" y="80" font-family="monospace" font-size="14" fill="${fgDim}">@${handle}</text>
  ${textEls}
  <text x="40" y="${138 + textLines.length * 26 + 6}" font-family="monospace" font-size="13" fill="${fgDim}">${time}</text>
  <line x1="40" y1="${138 + textLines.length * 26 + 28}" x2="680" y2="${138 + textLines.length * 26 + 28}" stroke="${border}" stroke-width="1"/>
  <text x="40" y="${138 + textLines.length * 26 + 60}" font-family="monospace" font-size="14" fill="${fgDim}">🔁 <tspan fill="${fgMain}" font-weight="700">${retweets}</tspan> Reposts</text>
  <text x="210" y="${138 + textLines.length * 26 + 60}" font-family="monospace" font-size="14" fill="${fgDim}">❤️ <tspan fill="#f43f5e" font-weight="700">${likes}</tspan> Likes</text>
</svg>`);
      }
    },
    {
      name: 'Visual Captcha Generator',
      path: '/api/canvas/captcha',
      method: 'GET',
      description: 'Genera una imagen Captcha con distorsión geométrica, líneas de ruido y paleta personalizable.',
      responseType: 'image',
      params: [
        { name: 'code', type: 'string', required: false, example: 'X9K4P2', description: 'Código a renderizar' },
        { name: 'theme', type: 'select', options: ['cyber', 'zinc', 'sunset'], required: false, example: 'cyber', description: 'Paleta de colores' },
        { name: 'noise', type: 'number', required: false, example: '2', description: 'Cantidad de líneas de ruido (0 - 4)' }
      ],
      handler: async (req, res) => {
        const rawCode = (req.query.code || Math.random().toString(36).substring(2, 8).toUpperCase()).slice(0, 8);
        const noise = Math.max(0, Math.min(4, parseInt(req.query.noise, 10) || 2));
        const palettes = {
          cyber: { bg: '#090d16', border: '#1e293b', colors: ['#00f5d4', '#38bdf8', '#a855f7', '#f43f5e', '#facc15', '#10b981'], wave: '#38bdf8' },
          zinc: { bg: '#09090b', border: '#27272a', colors: ['#a1a1aa', '#e4e4e7', '#fafafa', '#71717a', '#d4d4d8', '#a1a1aa'], wave: '#52525b' },
          sunset: { bg: '#1a0b12', border: '#3b1524', colors: ['#f43f5e', '#fb923c', '#facc15', '#f472b6', '#fdba74', '#ef4444'], wave: '#fb923c' }
        };
        const pal = palettes[req.query.theme] || palettes.cyber;
        const charLayers = rawCode.split('').map((ch, idx) => {
          const x = 65 + idx * 52;
          const y = 82 + (idx % 2 === 0 ? -8 : 10);
          const rot = idx % 2 === 0 ? -12 : 14;
          return `<text x="${x}" y="${y}" font-family="monospace" font-size="44" font-weight="900" fill="${pal.colors[idx % pal.colors.length]}" transform="rotate(${rot} ${x} ${y})">${escapeXml(ch)}</text>`;
        }).join('\n  ');
        const waves = [
          `<path d="M 15 35 Q 140 120 260 25 T 405 95" fill="none" stroke="${pal.wave}" stroke-width="2" opacity="0.45"/>`,
          `<path d="M 10 105 Q 180 15 310 110 T 410 40" fill="none" stroke="${pal.colors[3]}" stroke-width="2" opacity="0.4"/>`,
          `<path d="M 20 70 Q 120 10 220 80 T 410 60" fill="none" stroke="${pal.colors[1]}" stroke-width="1.5" opacity="0.3"/>`,
          `<path d="M 5 50 Q 150 130 280 40 T 415 110" fill="none" stroke="${pal.colors[4]}" stroke-width="1.5" opacity="0.3"/>`
        ].slice(0, noise).join('\n  ');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="140" viewBox="0 0 420 140">
  <rect width="420" height="140" rx="12" fill="${pal.bg}" stroke="${pal.border}" stroke-width="1.5"/>
  ${waves}
  ${charLayers}
</svg>`);
      }
    },
    {
      name: 'Level Up Banner',
      path: '/api/canvas/level-up',
      method: 'GET',
      description: 'Genera un banner celebrando que un jugador o miembro subió de nivel, con acento y subtítulo personalizables.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: 'LyanValentin', description: 'Nombre del jugador' },
        { name: 'oldLevel', type: 'number', required: false, example: '19', description: 'Nivel anterior' },
        { name: 'newLevel', type: 'number', required: false, example: '20', description: 'Nuevo nivel alcanzado' },
        { name: 'accent', type: 'string', required: false, example: '#f59e0b', description: 'Color de acento (hex)' },
        { name: 'subtitle', type: 'string', required: false, example: '⚡ LEVEL UP ACHIEVED ⚡', description: 'Texto superior del banner' }
      ],
      handler: async (req, res) => {
        const username = escapeXml((req.query.username || 'LyanValentin').slice(0, 24));
        const oldLvl = escapeXml(req.query.oldLevel || '19');
        const newLvl = escapeXml(req.query.newLevel || '20');
        const accent = hexColor(req.query.accent, '#f59e0b');
        const subtitle = escapeXml((req.query.subtitle || '⚡ LEVEL UP ACHIEVED ⚡').toUpperCase().slice(0, 34));

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="220" viewBox="0 0 680 220">
  <rect width="680" height="220" rx="18" fill="#0b1120" stroke="${accent}" stroke-width="1.5"/>
  <text x="340" y="55" font-family="monospace" font-size="16" font-weight="800" fill="${accent}" letter-spacing="4" text-anchor="middle">${subtitle}</text>
  <text x="340" y="102" font-family="sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle">${username}</text>
  <rect x="190" y="128" width="110" height="58" rx="12" fill="#1e293b"/>
  <text x="245" y="166" font-family="monospace" font-size="28" font-weight="800" fill="#94a3b8" text-anchor="middle">LV.${oldLvl}</text>
  <text x="340" y="166" font-family="monospace" font-size="28" font-weight="900" fill="${accent}" text-anchor="middle">➜</text>
  <rect x="380" y="128" width="110" height="58" rx="12" fill="rgba(245,158,11,0.2)" stroke="${accent}" stroke-width="1.5"/>
  <text x="435" y="166" font-family="monospace" font-size="28" font-weight="900" fill="${accent}" text-anchor="middle">LV.${newLvl}</text>
</svg>`);
      }
    },
    {
      name: 'Top Leaderboard Card',
      path: '/api/canvas/leaderboard',
      method: 'GET',
      description: 'Genera una tabla de clasificación visual Top 3 para servidores o torneos, con acento personalizable.',
      responseType: 'image',
      params: [
        { name: 'title', type: 'string', required: false, example: 'TOP DEVELOPERS RANKING', description: 'Título del ranking' },
        { name: 'first', type: 'string', required: false, example: 'LyanValentin (15,400 XP)', description: 'Puesto #1' },
        { name: 'second', type: 'string', required: false, example: 'Siputzx (12,950 XP)', description: 'Puesto #2' },
        { name: 'third', type: 'string', required: false, example: 'CyberCoder (10,200 XP)', description: 'Puesto #3' },
        { name: 'accent', type: 'string', required: false, example: '#00f5d4', description: 'Color del título (hex)' }
      ],
      handler: async (req, res) => {
        const title = escapeXml((req.query.title || 'TOP DEVELOPERS RANKING').slice(0, 32));
        const first = escapeXml((req.query.first || 'LyanValentin (15,400 XP)').slice(0, 36));
        const second = escapeXml((req.query.second || 'Siputzx (12,950 XP)').slice(0, 36));
        const third = escapeXml((req.query.third || 'CyberCoder (10,200 XP)').slice(0, 36));
        const accent = hexColor(req.query.accent, '#00f5d4');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="310" viewBox="0 0 680 310">
  <rect width="680" height="310" rx="18" fill="#090d16" stroke="#334155" stroke-width="1.5"/>
  <text x="340" y="48" font-family="monospace" font-size="20" font-weight="900" fill="${accent}" text-anchor="middle">🏆 ${title}</text>
  <rect x="40" y="75" width="600" height="60" rx="10" fill="rgba(250,204,21,0.12)" stroke="#facc15" stroke-width="1"/>
  <text x="65" y="112" font-family="monospace" font-size="22" font-weight="900" fill="#facc15">#1 🥇 ${first}</text>
  <rect x="40" y="150" width="600" height="56" rx="10" fill="rgba(148,163,184,0.12)" stroke="#94a3b8" stroke-width="1"/>
  <text x="65" y="185" font-family="monospace" font-size="20" font-weight="800" fill="#e2e8f0">#2 🥈 ${second}</text>
  <rect x="40" y="220" width="600" height="56" rx="10" fill="rgba(217,119,6,0.12)" stroke="#d97706" stroke-width="1"/>
  <text x="65" y="255" font-family="monospace" font-size="20" font-weight="800" fill="#fdba74">#3 🥉 ${third}</text>
</svg>`);
      }
    },
    {
      name: 'Ship / Love Meter Card',
      path: '/api/canvas/ship',
      method: 'GET',
      description: 'Genera una tarjeta de compatibilidad entre dos usuarios con barra de porcentaje y color personalizable.',
      responseType: 'image',
      params: [
        { name: 'user1', type: 'string', required: true, example: 'Frontend', description: 'Nombre 1' },
        { name: 'user2', type: 'string', required: true, example: 'Backend', description: 'Nombre 2' },
        { name: 'percent', type: 'number', required: false, example: '98', description: 'Porcentaje de compatibilidad (0-100)' },
        { name: 'accent', type: 'string', required: false, example: '#ec4899', description: 'Color del medidor (hex)' },
        { name: 'label', type: 'string', required: false, example: 'COMPATIBILITY REPORT', description: 'Etiqueta superior' }
      ],
      handler: async (req, res) => {
        const u1 = escapeXml((req.query.user1 || 'Frontend').slice(0, 16));
        const u2 = escapeXml((req.query.user2 || 'Backend').slice(0, 16));
        const pct = Math.max(0, Math.min(100, parseInt(req.query.percent || '98', 10) || 98));
        const accent = hexColor(req.query.accent, '#ec4899');
        const label = escapeXml((req.query.label || '❤️ LOVE METER').toUpperCase().slice(0, 28));
        const barW = Math.round((pct / 100) * 440);

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="270" viewBox="0 0 680 270">
  <rect width="680" height="270" rx="20" fill="#170a14" stroke="${accent}" stroke-width="1.5"/>
  <text x="340" y="40" font-family="monospace" font-size="14" font-weight="700" fill="${accent}" letter-spacing="3" text-anchor="middle">${label}</text>
  <circle cx="135" cy="120" r="50" fill="#2e1026" stroke="${accent}" stroke-width="1.5"/>
  <text x="135" y="129" font-family="monospace" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(initialsOf(u1))}</text>
  <text x="135" y="191" font-family="sans-serif" font-size="16" font-weight="700" fill="#fbcfe8" text-anchor="middle">${u1}</text>
  <text x="340" y="133" font-family="sans-serif" font-size="44" font-weight="900" fill="${accent}" text-anchor="middle">${pct}%</text>
  <circle cx="545" cy="120" r="50" fill="#2e1026" stroke="${accent}" stroke-width="1.5"/>
  <text x="545" y="129" font-family="monospace" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(initialsOf(u2))}</text>
  <text x="545" y="191" font-family="sans-serif" font-size="16" font-weight="700" fill="#fbcfe8" text-anchor="middle">${u2}</text>
  <rect x="120" y="222" width="440" height="16" rx="8" fill="#3b0724"/>
  <rect x="120" y="222" width="${barW}" height="16" rx="8" fill="${accent}"/>
</svg>`);
      }
    },
    {
      name: 'Wanted Bounty Poster',
      path: '/api/canvas/wanted',
      method: 'GET',
      description: 'Genera un cartel de recompensa estilo "WANTED DEAD OR ALIVE" con moneda, subtítulo y recompensa personalizables.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: 'MONKEY D. CODER', description: 'Nombre en el cartel' },
        { name: 'bounty', type: 'string', required: false, example: '3,000,000,000', description: 'Recompensa' },
        { name: 'currency', type: 'select', options: ['฿', '$', '€', 'BERRY'], required: false, example: '฿', description: 'Símbolo de moneda' },
        { name: 'subtitle', type: 'string', required: false, example: 'DEAD OR ALIVE', description: 'Subtítulo del cartel' }
      ],
      handler: async (req, res) => {
        const username = escapeXml((req.query.username || 'MONKEY D. CODER').toUpperCase().slice(0, 22));
        const bounty = escapeXml(req.query.bounty || '3,000,000,000');
        const currency = escapeXml(req.query.currency === '$' ? '$' : req.query.currency === '€' ? '€' : req.query.currency === 'BERRY' ? 'BERRY' : '฿');
        const subtitle = escapeXml((req.query.subtitle || 'DEAD OR ALIVE').toUpperCase().slice(0, 18));

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="600" viewBox="0 0 460 600">
  <rect width="460" height="600" rx="12" fill="#e6cfa3" stroke="#5c4028" stroke-width="8"/>
  <rect x="24" y="24" width="412" height="552" fill="none" stroke="#5c4028" stroke-width="2"/>
  <text x="230" y="88" font-family="serif" font-size="64" font-weight="900" fill="#3d2718" letter-spacing="6" text-anchor="middle">WANTED</text>
  <rect x="55" y="110" width="350" height="250" fill="#2c1d12" stroke="#5c4028" stroke-width="4"/>
  <circle cx="230" cy="235" r="76" fill="#5c4028"/>
  <text x="230" y="252" font-family="monospace" font-size="52" font-weight="900" fill="#e6cfa3" text-anchor="middle">${escapeXml(initialsOf(username))}</text>
  <text x="230" y="405" font-family="serif" font-size="34" font-weight="900" fill="#3d2718" letter-spacing="4" text-anchor="middle">${subtitle}</text>
  <text x="230" y="465" font-family="serif" font-size="32" font-weight="900" fill="#26170e" text-anchor="middle">${username}</text>
  <text x="230" y="525" font-family="monospace" font-size="28" font-weight="900" fill="#3d2718" text-anchor="middle">${currency} ${bounty} -</text>
</svg>`);
      }
    },
    {
      name: 'Official Certificate Generator',
      path: '/api/canvas/certificate',
      method: 'GET',
      description: 'Genera un diploma o certificado de reconocimiento personalizado con fecha, emisor y color de acento.',
      responseType: 'image',
      params: [
        { name: 'name', type: 'string', required: true, example: 'Lyan Valentin', description: 'Nombre de quien recibe el certificado' },
        { name: 'course', type: 'string', required: false, example: 'Master en Arquitectura de APIs & Node.js', description: 'Logro o curso completado' },
        { name: 'date', type: 'string', required: false, example: 'OCTUBRE 2026', description: 'Fecha de emisión' },
        { name: 'accent', type: 'string', required: false, example: '#00f5d4', description: 'Color de acento (hex)' },
        { name: 'issuer', type: 'string', required: false, example: 'API CONSOLE V2', description: 'Entidad emisora' }
      ],
      handler: async (req, res) => {
        const name = escapeXml((req.query.name || 'Lyan Valentin').slice(0, 28));
        const course = escapeXml((req.query.course || 'Master en Arquitectura de APIs & Node.js').slice(0, 52));
        const date = escapeXml((req.query.date || 'OCTUBRE 2026').toUpperCase().slice(0, 20));
        const issuer = escapeXml((req.query.issuer || 'API CONSOLE V2').toUpperCase().slice(0, 24));
        const accent = hexColor(req.query.accent, '#00f5d4');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="460" viewBox="0 0 800 460">
  <rect width="800" height="460" rx="14" fill="#090d16" stroke="${accent}" stroke-width="3"/>
  <rect x="20" y="20" width="760" height="420" rx="8" fill="none" stroke="${accent}" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="400" y="85" font-family="monospace" font-size="16" font-weight="700" fill="${accent}" letter-spacing="6" text-anchor="middle">CERTIFICATE OF EXCELLENCE</text>
  <text x="400" y="135" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">ESTE CERTIFICADO SE OTORGA OFICIALMENTE A:</text>
  <text x="400" y="210" font-family="serif" font-size="52" font-weight="900" fill="#ffffff" text-anchor="middle">${name}</text>
  <line x1="200" y1="230" x2="600" y2="230" stroke="${accent}" stroke-width="1.5"/>
  <text x="400" y="285" font-family="sans-serif" font-size="22" font-weight="700" fill="#38bdf8" text-anchor="middle">${course}</text>
  <circle cx="120" cy="380" r="34" fill="none" stroke="${accent}" stroke-width="1.5"/>
  <text x="120" y="388" font-family="serif" font-size="22" font-weight="900" fill="${accent}" text-anchor="middle">★</text>
  <text x="400" y="378" font-family="monospace" font-size="14" fill="#64748b" text-anchor="middle">VERIFIED BY ${issuer} • ISSUED ${date}</text>
  <line x1="560" y1="400" x2="700" y2="400" stroke="#475569" stroke-width="1"/>
  <text x="630" y="420" font-family="monospace" font-size="11" fill="#64748b" text-anchor="middle">FIRMA AUTORIZADA</text>
</svg>`);
      }
    },
    {
      name: 'Cyber Citizen ID Card (eKTP)',
      path: '/api/canvas/id-card',
      method: 'GET',
      description: 'Genera una tarjeta de identificación ciudadana estilo Cyberpunk / eKTP con rol, país y acento personalizables.',
      responseType: 'image',
      params: [
        { name: 'name', type: 'string', required: true, example: 'LYAN VALENTIN', description: 'Nombre completo' },
        { name: 'idNumber', type: 'string', required: false, example: 'UY-2026-994810', description: 'Número de identificación' },
        { name: 'role', type: 'string', required: false, example: 'SYSTEM ARCHITECT', description: 'Rango o profesión' },
        { name: 'country', type: 'string', required: false, example: 'CYBER REPUBLIC', description: 'País o entidad' },
        { name: 'accent', type: 'string', required: false, example: '#38bdf8', description: 'Color de acento (hex)' }
      ],
      handler: async (req, res) => {
        const name = escapeXml((req.query.name || 'LYAN VALENTIN').toUpperCase().slice(0, 24));
        const idNum = escapeXml(req.query.idNumber || 'UY-2026-994810');
        const role = escapeXml((req.query.role || 'SYSTEM ARCHITECT').toUpperCase().slice(0, 22));
        const country = escapeXml((req.query.country || 'CYBER REPUBLIC').toUpperCase().slice(0, 20));
        const accent = hexColor(req.query.accent, '#38bdf8');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="360" viewBox="0 0 680 360">
  <rect width="680" height="360" rx="18" fill="#08121e" stroke="${accent}" stroke-width="1.5"/>
  <rect x="0" y="0" width="680" height="64" rx="18" fill="#0c233b"/>
  <text x="32" y="40" font-family="monospace" font-size="20" font-weight="900" fill="${accent}" letter-spacing="3">CYBER CITIZEN IDENTITY CARD</text>
  <rect x="36" y="96" width="150" height="180" rx="12" fill="#112a45" stroke="${accent}" stroke-width="1.5"/>
  <text x="111" y="200" font-family="monospace" font-size="48" font-weight="900" fill="${accent}" text-anchor="middle">${escapeXml(initialsOf(name))}</text>
  <text x="220" y="125" font-family="monospace" font-size="13" fill="#64748b">ID NUMBER</text>
  <text x="220" y="150" font-family="monospace" font-size="22" font-weight="800" fill="#00f5d4">${idNum}</text>
  <text x="220" y="190" font-family="monospace" font-size="13" fill="#64748b">FULL NAME</text>
  <text x="220" y="216" font-family="sans-serif" font-size="26" font-weight="900" fill="#ffffff">${name}</text>
  <text x="220" y="255" font-family="monospace" font-size="13" fill="#64748b">CLEARANCE / ROLE</text>
  <text x="220" y="280" font-family="monospace" font-size="18" font-weight="700" fill="${accent}">${role}</text>
  <text x="36" y="322" font-family="monospace" font-size="13" fill="#64748b">ISSUING AUTHORITY</text>
  <text x="196" y="322" font-family="monospace" font-size="13" font-weight="700" fill="#94a3b8">${country}</text>
</svg>`);
      }
    },
    {
      name: 'Aesthetic Quote Card',
      path: '/api/canvas/quote-card',
      method: 'GET',
      description: 'Genera una tarjeta minimalista con una frase célebre, autor, acento y tema (dark/light) personalizables.',
      responseType: 'image',
      params: [
        { name: 'quote', type: 'string', required: true, example: 'Talk is cheap. Show me the code.', description: 'Frase o cita' },
        { name: 'author', type: 'string', required: false, example: 'Linus Torvalds', description: 'Autor de la frase' },
        { name: 'accent', type: 'string', required: false, example: '#00f5d4', description: 'Color de acento (hex)' },
        { name: 'theme', type: 'select', options: ['dark', 'light'], required: false, example: 'dark', description: 'Tema de la tarjeta' }
      ],
      handler: async (req, res) => {
        const quoteLines = wrapText(req.query.quote || 'Talk is cheap. Show me the code.', 46, 3);
        const author = escapeXml(req.query.author || 'Linus Torvalds');
        const accent = hexColor(req.query.accent, '#00f5d4');
        const light = req.query.theme === 'light';
        const bg = light ? '#fafafa' : '#0b0f17';
        const fg = light ? '#18181b' : '#f8fafc';
        const border = light ? '#e4e4e7' : '#334155';
        const quoteEls = quoteLines.map((l, i) =>
          `<text x="360" y="${160 + i * 32}" font-family="sans-serif" font-size="24" font-weight="700" fill="${fg}" text-anchor="middle">${escapeXml(l)}</text>`
        ).join('\n  ');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="320" viewBox="0 0 720 320">
  <rect width="720" height="320" rx="20" fill="${bg}" stroke="${border}" stroke-width="1.5"/>
  <text x="60" y="105" font-family="serif" font-size="72" fill="${accent}" opacity="0.35">“</text>
  ${quoteEls}
  <text x="360" y="${160 + quoteLines.length * 32 + 20}" font-family="monospace" font-size="16" font-weight="700" fill="${accent}" text-anchor="middle">— ${author}</text>
</svg>`);
      }
    },
    {
      name: 'YouTube Comment Screenshot',
      path: '/api/canvas/youtube-comment',
      method: 'GET',
      description: 'Genera una imagen simulando un comentario destacado de YouTube con tema dark/light, avatar, tiempo y likes personalizables.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: '@dev_master', description: 'Nombre de usuario' },
        { name: 'comment', type: 'string', required: true, example: 'Esta API funciona a la primera sin pedir API Key, 10/10!', description: 'Texto del comentario' },
        { name: 'likes', type: 'string', required: false, example: '1.2K', description: 'Likes del comentario' },
        { name: 'theme', type: 'select', options: ['dark', 'light'], required: false, example: 'dark', description: 'Tema del comentario' },
        { name: 'time', type: 'string', required: false, example: 'hace 2 horas', description: 'Sello de tiempo' },
        { name: 'avatarColor', type: 'string', required: false, example: '#ef4444', description: 'Color del avatar (hex)' }
      ],
      handler: async (req, res) => {
        const username = escapeXml((req.query.username || '@dev_master').slice(0, 22));
        const commentLines = wrapText(req.query.comment || 'Esta API funciona a la primera sin pedir API Key, 10/10!', 58, 2);
        const likes = escapeXml(req.query.likes || '1.2K');
        const light = req.query.theme === 'light';
        const time = escapeXml(req.query.time || 'hace 2 horas');
        const avatarColor = hexColor(req.query.avatarColor, '#ef4444');
        const bg = light ? '#ffffff' : '#0f0f0f';
        const fg = light ? '#0f0f0f' : '#ffffff';
        const dim = light ? '#606060' : '#aaaaaa';
        const border = light ? '#e5e5e5' : '#272727';
        const h = 120 + commentLines.length * 28;

        const commentEls = commentLines.map((l, i) =>
          `<text x="98" y="${100 + i * 28}" font-family="sans-serif" font-size="18" fill="${fg}">${escapeXml(l)}</text>`
        ).join('\n  ');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="${h}" viewBox="0 0 720 ${h}">
  <rect width="720" height="${h}" rx="16" fill="${bg}" stroke="${border}" stroke-width="1.5"/>
  <circle cx="58" cy="64" r="24" fill="${avatarColor}"/>
  <text x="58" y="72" font-family="sans-serif" font-size="18" font-weight="800" fill="#ffffff" text-anchor="middle">${escapeXml(initialsOf(username.replace('@', '')))}</text>
  <text x="98" y="56" font-family="sans-serif" font-size="15" font-weight="700" fill="${fg}">${username} <tspan fill="${dim}" font-weight="400" font-size="13">• ${time}</tspan></text>
  ${commentEls}
  <text x="98" y="${100 + commentLines.length * 28 + 32}" font-family="sans-serif" font-size="15" fill="${dim}">👍 ${likes}    👎    Responder</text>
</svg>`);
      }
    },
    {
      name: 'macOS Code Snippet Card',
      path: '/api/canvas/code-snap',
      method: 'GET',
      description: 'Genera una elegante captura de ventana estilo macOS con tu código, lenguaje, tema y acento personalizables.',
      responseType: 'image',
      params: [
        { name: 'title', type: 'string', required: false, example: 'api-client.js', description: 'Título del archivo' },
        { name: 'code', type: 'string', required: true, example: 'const res = await fetch("/api/endpoints");', description: 'Línea de código a destacar' },
        { name: 'lang', type: 'string', required: false, example: 'javascript', description: 'Lenguaje mostrado en la barra inferior' },
        { name: 'accent', type: 'string', required: false, example: '#00f5d4', description: 'Color del código (hex)' },
        { name: 'theme', type: 'select', options: ['carbon', 'zinc', 'light'], required: false, example: 'carbon', description: 'Tema de la ventana' }
      ],
      handler: async (req, res) => {
        const title = escapeXml(req.query.title || 'api-client.js');
        const codeLines = wrapText(req.query.code || 'const res = await fetch("/api/endpoints");', 58, 3);
        const lang = escapeXml(req.query.lang || 'javascript');
        const accent = hexColor(req.query.accent, '#00f5d4');
        const themes = {
          carbon: { outer: '#1e293b', inner: '#0b0f19', border: '#334155', fg: accent, bar: '#94a3b8' },
          zinc: { outer: '#16161a', inner: '#09090b', border: '#27272a', fg: accent, bar: '#a1a1aa' },
          light: { outer: '#e4e4e7', inner: '#fafafa', border: '#d4d4d8', fg: hexColor(req.query.accent, '#2563eb'), bar: '#52525b' }
        };
        const t = themes[req.query.theme] || themes.carbon;
        const h = 150 + codeLines.length * 30;
        const codeEls = codeLines.map((l, i) =>
          `<text x="48" y="${132 + i * 30}" font-family="monospace" font-size="19" fill="${t.fg}">${escapeXml(l)}</text>`
        ).join('\n  ');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="740" height="${h}" viewBox="0 0 740 ${h}">
  <rect width="740" height="${h}" rx="16" fill="${t.outer}"/>
  <rect x="20" y="20" width="700" height="${h - 40}" rx="12" fill="${t.inner}" stroke="${t.border}" stroke-width="1.5"/>
  <circle cx="46" cy="46" r="7" fill="#ef4444"/>
  <circle cx="68" cy="46" r="7" fill="#f59e0b"/>
  <circle cx="90" cy="46" r="7" fill="#10b981"/>
  <text x="370" y="51" font-family="monospace" font-size="13" fill="${t.bar}" text-anchor="middle">${title}</text>
  <line x1="20" y1="68" x2="720" y2="68" stroke="${t.outer}"/>
  ${codeEls}
  <text x="700" y="${h - 22}" font-family="monospace" font-size="11" fill="${t.bar}" text-anchor="end">${lang.toUpperCase()}</text>
</svg>`);
      }
    },
    /* ==================================================================
       IQ CHECK CARD — puntaje, percentil y barra
       ================================================================== */
    {
      name: 'IQ Check Card (IQC)',
      path: '/api/canvas/iqc-card',
      method: 'GET',
      description: 'Genera la tarjeta visual de IQ Check con puntaje, percentil, barra de progreso, clasificación y tema personalizable.',
      responseType: 'image',
      params: [
        { name: 'name', type: 'string', required: false, example: 'Lyan Valentin', description: 'Nombre evaluado' },
        { name: 'score', type: 'number', required: false, example: '128', description: 'Puntaje de IQ (60 - 160)' },
        { name: 'percentile', type: 'number', required: false, example: '97', description: 'Percentil (0 - 99.9)' },
        { name: 'theme', type: 'select', options: ['dark', 'light', 'neon'], required: false, example: 'dark', description: 'Tema de la tarjeta' },
        { name: 'accent', type: 'string', required: false, example: '#22d3ee', description: 'Color de acento (hex)' },
        { name: 'subtitle', type: 'string', required: false, example: 'CERTIFIED IQ CHECK', description: 'Subtítulo superior' }
      ],
      handler: async (req, res) => {
        const name = escapeXml((req.query.name || 'Lyan Valentin').slice(0, 26));
        const score = Math.max(60, Math.min(160, parseInt(req.query.score, 10) || 128));
        const percentile = Math.max(0, Math.min(99.9, parseFloat(req.query.percentile) || Math.min(99.9, ((score - 70) / 80) * 100)));
        const theme = ['dark', 'light', 'neon'].includes(req.query.theme) ? req.query.theme : 'dark';
        const subtitle = escapeXml((req.query.subtitle || 'CERTIFIED IQ CHECK').toUpperCase().slice(0, 28));

        const palettes = {
          dark: { bg: '#09090b', card: '#121216', border: '#27272a', fg: '#fafafa', dim: '#a1a1aa', accent: hexColor(req.query.accent, '#22d3ee'), track: '#27272a' },
          light: { bg: '#f4f4f5', card: '#ffffff', border: '#e4e4e7', fg: '#18181b', dim: '#71717a', accent: hexColor(req.query.accent, '#0ea5e9'), track: '#e4e4e7' },
          neon: { bg: '#050510', card: '#0a0a1e', border: '#1e1b4b', fg: '#eef2ff', dim: '#818cf8', accent: hexColor(req.query.accent, '#a78bfa'), track: '#1e1b4b' }
        };
        const p = palettes[theme];

        const classification = score >= 130 ? 'GENIUS TIER' : score >= 120 ? 'GIFTED TIER' : score >= 110 ? 'ABOVE AVERAGE' : score >= 100 ? 'AVERAGE' : 'BELOW AVERAGE';
        const barW = Math.round(((score - 60) / 100) * 520);
        const pctW = Math.round((percentile / 100) * 520);

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420">
  <defs>
    <linearGradient id="iqcBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${p.accent}"/><stop offset="100%" stop-color="${p.accent}" stop-opacity="0.55"/>
    </linearGradient>
    <filter id="iqcGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="720" height="420" fill="${p.bg}"/>
  <rect x="24" y="24" width="672" height="372" rx="22" fill="${p.card}" stroke="${p.border}" stroke-width="1.5"/>
  <text x="360" y="72" font-family="monospace" font-size="14" font-weight="700" fill="${p.accent}" letter-spacing="5" text-anchor="middle">${subtitle}</text>
  <text x="360" y="112" font-family="sans-serif" font-size="22" font-weight="700" fill="${p.dim}" text-anchor="middle">${name}</text>

  <!-- Puntaje principal -->
  <text x="360" y="220" font-family="sans-serif" font-size="110" font-weight="900" fill="${p.accent}" text-anchor="middle" filter="url(#iqcGlow)">${score}</text>
  <text x="360" y="256" font-family="monospace" font-size="15" font-weight="700" fill="${p.fg}" letter-spacing="4" text-anchor="middle">IQ SCORE • ${classification}</text>

  <!-- Barra de IQ -->
  <text x="90" y="300" font-family="monospace" font-size="12" fill="${p.dim}">IQ SCALE (60 - 160)</text>
  <rect x="90" y="310" width="520" height="16" rx="8" fill="${p.track}"/>
  <rect x="90" y="310" width="${barW}" height="16" rx="8" fill="url(#iqcBar)"/>
  <circle cx="${90 + barW}" cy="318" r="10" fill="${p.fg}" stroke="${p.accent}" stroke-width="3"/>

  <!-- Barra de percentil -->
  <text x="90" y="352" font-family="monospace" font-size="12" fill="${p.dim}">PERCENTILE</text>
  <text x="610" y="352" font-family="monospace" font-size="13" font-weight="800" fill="${p.accent}" text-anchor="end">TOP ${percentile.toFixed(1)}%</text>
  <rect x="90" y="362" width="520" height="10" rx="5" fill="${p.track}"/>
  <rect x="90" y="362" width="${pctW}" height="10" rx="5" fill="${p.accent}" opacity="0.75"/>

  <text x="360" y="392" font-family="monospace" font-size="11" fill="${p.dim}" text-anchor="middle">IQ CHECK CONSOLE V2 • FOR ENTERTAINMENT ONLY</text>
</svg>`);
      }
    }
  ]
};
