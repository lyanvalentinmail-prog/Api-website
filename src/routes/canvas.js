/**
 * Categoría: CANVAS (15 Endpoints)
 * Generadores dinámicos de tarjetas e imágenes en tiempo real (image/svg+xml).
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
  category: 'CANVAS',
  description: 'Generación dinámica de imágenes, tarjetas sociales, banners de servidor, pósters Wanted, certificados y capturas.',
  endpoints: [
    {
      name: 'Welcome Card V2',
      path: '/api/canvas/welcome',
      method: 'GET',
      description: 'Genera una tarjeta visual de bienvenida estilo Discord/Comunidad con avatar, servidor y contador.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: 'LyanValentin', description: 'Nombre del usuario' },
        { name: 'guild', type: 'string', required: false, example: 'API CONSOLE COMMUNITY', description: 'Nombre del servidor' },
        { name: 'memberCount', type: 'number', required: false, example: '1428', description: 'Número de miembro' },
        { name: 'theme', type: 'select', options: ['cyber', 'emerald', 'sunset', 'midnight'], required: false, example: 'cyber', description: 'Tema de color' }
      ],
      handler: async (req, res) => {
        const username = escapeXml(req.query.username || 'Developer');
        const guild = escapeXml(req.query.guild || 'API CONSOLE COMMUNITY');
        const memberCount = escapeXml(req.query.memberCount || '1024');
        const theme = req.query.theme || 'cyber';
        const palettes = {
          cyber: { bg1: '#090d16', bg2: '#111827', accent: '#00f5d4', accent2: '#6366f1' },
          emerald: { bg1: '#061512', bg2: '#0b2922', accent: '#10b981', accent2: '#34d399' },
          sunset: { bg1: '#1a0b12', bg2: '#2d121e', accent: '#f43f5e', accent2: '#fb923c' },
          midnight: { bg1: '#0a0a14', bg2: '#16162c', accent: '#38bdf8', accent2: '#818cf8' }
        };
        const p = palettes[theme] || palettes.cyber;
        const initials = username.slice(0, 2).toUpperCase();

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="320" viewBox="0 0 800 320">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${p.bg1}"/><stop offset="100%" stop-color="${p.bg2}"/></linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${p.accent}"/><stop offset="100%" stop-color="${p.accent2}"/></linearGradient>
  </defs>
  <rect width="800" height="320" rx="20" fill="url(#bg)"/>
  <circle cx="720" cy="50" r="140" fill="${p.accent}" opacity="0.08"/>
  <rect x="16" y="16" width="768" height="288" rx="14" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
  <rect x="16" y="298" width="768" height="6" rx="3" fill="url(#accentGrad)"/>
  <g transform="translate(135, 160)">
    <circle cx="0" cy="0" r="76" fill="none" stroke="url(#accentGrad)" stroke-width="4" stroke-dasharray="12 6"/>
    <circle cx="0" cy="0" r="66" fill="#182032" stroke="${p.accent}" stroke-width="2"/>
    <text x="0" y="14" font-family="monospace" font-size="42" font-weight="800" fill="#ffffff" text-anchor="middle">${initials}</text>
  </g>
  <text x="245" y="98" font-family="monospace" font-size="14" font-weight="700" fill="${p.accent}" letter-spacing="3">WELCOME TO THE SERVER</text>
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
        { name: 'remaining', type: 'number', required: false, example: '849', description: 'Miembros restantes' }
      ],
      handler: async (req, res) => {
        const username = escapeXml(req.query.username || 'ShadowRunner');
        const guild = escapeXml(req.query.guild || 'GAMERS LATAM');
        const remaining = escapeXml(req.query.remaining || '849');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300" viewBox="0 0 800 300">
  <rect width="800" height="300" rx="20" fill="#120910" stroke="#f43f5e" stroke-opacity="0.4" stroke-width="2"/>
  <circle cx="135" cy="150" r="68" fill="#24101d" stroke="#f43f5e" stroke-width="3"/>
  <text x="135" y="164" font-family="monospace" font-size="40" font-weight="900" fill="#fb7185" text-anchor="middle">${username.slice(0, 2).toUpperCase()}</text>
  <text x="240" y="95" font-family="monospace" font-size="14" font-weight="700" fill="#f43f5e" letter-spacing="3">USER LEFT THE SERVER</text>
  <text x="240" y="148" font-family="sans-serif" font-size="42" font-weight="900" fill="#ffffff">${username}</text>
  <text x="240" y="186" font-family="sans-serif" font-size="18" fill="#fda4af">Salió de ${guild}</text>
  <rect x="240" y="208" width="250" height="36" rx="8" fill="rgba(244,63,94,0.12)" stroke="rgba(244,63,94,0.3)"/>
  <text x="258" y="231" font-family="monospace" font-size="13" font-weight="700" fill="#fb7185">QUEDAN ${remaining} MIEMBROS</text>
</svg>`);
      }
    },
    {
      name: 'Developer Profile Card',
      path: '/api/canvas/profile',
      method: 'GET',
      description: 'Genera una tarjeta de perfil con nivel, barra de experiencia (XP), rol y rango.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: 'SiputzxDev', description: 'Nombre de usuario' },
        { name: 'role', type: 'string', required: false, example: 'Full-Stack API Architect', description: 'Título o especialidad' },
        { name: 'level', type: 'number', required: false, example: '42', description: 'Nivel actual' },
        { name: 'xp', type: 'number', required: false, example: '78', description: 'Porcentaje de XP (0 - 100)' }
      ],
      handler: async (req, res) => {
        const username = escapeXml(req.query.username || 'SiputzxDev');
        const role = escapeXml(req.query.role || 'Full-Stack API Architect');
        const level = Math.max(1, parseInt(req.query.level || '42', 10) || 42);
        const xp = Math.max(5, Math.min(100, parseInt(req.query.xp || '78', 10) || 78));
        const barWidth = Math.round((xp / 100) * 460);

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="280" viewBox="0 0 760 280">
  <rect width="760" height="280" rx="18" fill="#0b0f19" stroke="#26324d" stroke-width="2"/>
  <circle cx="115" cy="140" r="64" fill="#1e293b" stroke="#10b981" stroke-width="3"/>
  <text x="115" y="154" font-family="monospace" font-size="38" font-weight="800" fill="#10b981" text-anchor="middle">${username.slice(0, 2).toUpperCase()}</text>
  <text x="215" y="82" font-family="sans-serif" font-size="34" font-weight="800" fill="#f8fafc">${username}</text>
  <text x="215" y="114" font-family="monospace" font-size="16" fill="#38bdf8">${role}</text>
  <rect x="585" y="48" width="135" height="64" rx="10" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)"/>
  <text x="652" y="74" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="middle">LEVEL</text>
  <text x="652" y="100" font-family="monospace" font-size="26" font-weight="900" fill="#10b981" text-anchor="middle">${level}</text>
  <text x="215" y="168" font-family="monospace" font-size="14" fill="#cbd5e1">EXPERIENCE PROGRESS</text>
  <text x="675" y="168" font-family="monospace" font-size="14" font-weight="700" fill="#10b981" text-anchor="end">${xp}%</text>
  <rect x="215" y="182" width="460" height="18" rx="9" fill="#0f172a" stroke="#334155"/>
  <rect x="215" y="182" width="${barWidth}" height="18" rx="9" fill="#10b981"/>
  <text x="215" y="232" font-family="monospace" font-size="12" fill="#64748b">STATUS: VERIFIED DEVELOPER • NO API KEY REQUIRED</text>
</svg>`);
      }
    },
    {
      name: 'Spotify Now Playing Card',
      path: '/api/canvas/spotify',
      method: 'GET',
      description: 'Genera un reproductor visual estilo Spotify Now Playing con barra de tiempo.',
      responseType: 'image',
      params: [
        { name: 'title', type: 'string', required: true, example: 'Midnight City Cyber', description: 'Título de la canción' },
        { name: 'artist', type: 'string', required: true, example: 'M83 & Synthwave Collective', description: 'Artista o banda' },
        { name: 'album', type: 'string', required: false, example: 'Hurry Up, We Are Dreaming', description: 'Nombre del álbum' },
        { name: 'progress', type: 'number', required: false, example: '65', description: 'Porcentaje reproducido (0 - 100)' }
      ],
      handler: async (req, res) => {
        const title = escapeXml(req.query.title || 'Midnight City Cyber');
        const artist = escapeXml(req.query.artist || 'Synthwave Collective');
        const album = escapeXml(req.query.album || 'API Console Sessions');
        const progress = Math.max(5, Math.min(100, parseInt(req.query.progress || '65', 10) || 65));
        const barW = Math.round((progress / 100) * 430);

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="250" viewBox="0 0 720 250">
  <rect width="720" height="250" rx="20" fill="#09100d" stroke="#1db954" stroke-opacity="0.4" stroke-width="1.5"/>
  <g transform="translate(115, 125)">
    <rect x="-75" y="-75" width="150" height="150" rx="16" fill="#121a24" stroke="#1db954" stroke-width="2"/>
    <circle cx="0" cy="0" r="54" fill="#090d12" stroke="#283547" stroke-width="8"/>
    <circle cx="0" cy="0" r="18" fill="#1db954"/>
  </g>
  <circle cx="235" cy="54" r="8" fill="#1db954"/>
  <text x="252" y="59" font-family="monospace" font-size="13" font-weight="700" fill="#1db954" letter-spacing="2">NOW PLAYING ON SPOTIFY</text>
  <text x="225" y="102" font-family="sans-serif" font-size="28" font-weight="800" fill="#ffffff">${title}</text>
  <text x="225" y="132" font-family="sans-serif" font-size="18" fill="#94a3b8">${artist}</text>
  <text x="225" y="156" font-family="monospace" font-size="13" fill="#64748b">Album: ${album}</text>
  <rect x="225" y="182" width="430" height="8" rx="4" fill="#1e293b"/>
  <rect x="225" y="182" width="${barW}" height="8" rx="4" fill="#1db954"/>
  <circle cx="${225 + barW}" cy="186" r="7" fill="#ffffff"/>
  <text x="225" y="212" font-family="monospace" font-size="12" fill="#94a3b8">02:18</text>
  <text x="655" y="212" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="end">03:42</text>
</svg>`);
      }
    },
    {
      name: 'Tweet Card Generator',
      path: '/api/canvas/tweet',
      method: 'GET',
      description: 'Genera una captura visual de publicación estilo X / Twitter con insignia de verificado y métricas.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: 'Siputzx API', description: 'Nombre visible' },
        { name: 'handle', type: 'string', required: false, example: 'siputzx_api', description: 'Usuario @handle' },
        { name: 'text', type: 'string', required: true, example: 'No login. No API key. Just pure REST API endpoints ready to execute from your browser!', description: 'Contenido del tweet' },
        { name: 'likes', type: 'string', required: false, example: '4.8K', description: 'Cantidad de likes' },
        { name: 'retweets', type: 'string', required: false, example: '942', description: 'Cantidad de reposts' }
      ],
      handler: async (req, res) => {
        const username = escapeXml(req.query.username || 'Siputzx API');
        const handle = escapeXml((req.query.handle || 'siputzx_api').replace(/^@/, ''));
        const text = escapeXml((req.query.text || 'No login. No API key. Just pure REST API!').slice(0, 110));
        const likes = escapeXml(req.query.likes || '4.8K');
        const retweets = escapeXml(req.query.retweets || '942');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="260" viewBox="0 0 720 260">
  <rect width="720" height="260" rx="18" fill="#0b0e14" stroke="#1e293b" stroke-width="2"/>
  <circle cx="66" cy="62" r="26" fill="#1d9bf0"/>
  <text x="66" y="70" font-family="sans-serif" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">${username.slice(0, 2).toUpperCase()}</text>
  <text x="106" y="58" font-family="sans-serif" font-size="19" font-weight="800" fill="#ffffff">${username} <tspan fill="#1d9bf0">✔</tspan></text>
  <text x="106" y="80" font-family="monospace" font-size="14" fill="#64748b">@${handle}</text>
  <text x="40" y="140" font-family="sans-serif" font-size="19" fill="#f1f5f9">${text}</text>
  <line x1="40" y1="195" x2="680" y2="195" stroke="#1e293b" stroke-width="1"/>
  <text x="40" y="230" font-family="monospace" font-size="14" fill="#94a3b8">🔁 <tspan fill="#e2e8f0" font-weight="700">${retweets}</tspan> Reposts</text>
  <text x="210" y="230" font-family="monospace" font-size="14" fill="#94a3b8">❤️ <tspan fill="#f43f5e" font-weight="700">${likes}</tspan> Likes</text>
</svg>`);
      }
    },
    {
      name: 'Visual Captcha Generator',
      path: '/api/canvas/captcha',
      method: 'GET',
      description: 'Genera una imagen Captcha con distorsión geométrica y líneas de ruido.',
      responseType: 'image',
      params: [
        { name: 'code', type: 'string', required: false, example: 'X9K4P2', description: 'Código a renderizar' }
      ],
      handler: async (req, res) => {
        const rawCode = (req.query.code || Math.random().toString(36).substring(2, 8).toUpperCase()).slice(0, 8);
        const charLayers = rawCode.split('').map((ch, idx) => {
          const x = 65 + idx * 52;
          const y = 82 + ((idx % 2 === 0) ? -8 : 10);
          const rot = (idx % 2 === 0) ? -12 : 14;
          const colors = ['#00f5d4', '#38bdf8', '#a855f7', '#f43f5e', '#facc15', '#10b981'];
          return `<text x="${x}" y="${y}" font-family="monospace" font-size="44" font-weight="900" fill="${colors[idx % colors.length]}" transform="rotate(${rot} ${x} ${y})">${escapeXml(ch)}</text>`;
        }).join('\n  ');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="140" viewBox="0 0 420 140">
  <rect width="420" height="140" rx="12" fill="#090d16" stroke="#1e293b" stroke-width="2"/>
  <path d="M 15 35 Q 140 120 260 25 T 405 95" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.45"/>
  <path d="M 10 105 Q 180 15 310 110 T 410 40" fill="none" stroke="#f43f5e" stroke-width="2" opacity="0.45"/>
  ${charLayers}
</svg>`);
      }
    },
    {
      name: 'Level Up Banner',
      path: '/api/canvas/level-up',
      method: 'GET',
      description: 'Genera un banner celebrando que un jugador o miembro subió de nivel.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: 'LyanValentin', description: 'Nombre del jugador' },
        { name: 'oldLevel', type: 'number', required: false, example: '19', description: 'Nivel anterior' },
        { name: 'newLevel', type: 'number', required: false, example: '20', description: 'Nuevo nivel alcanzado' }
      ],
      handler: async (req, res) => {
        const username = escapeXml(req.query.username || 'LyanValentin');
        const oldLvl = escapeXml(req.query.oldLevel || '19');
        const newLvl = escapeXml(req.query.newLevel || '20');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="220" viewBox="0 0 680 220">
  <rect width="680" height="220" rx="18" fill="#0b1120" stroke="#f59e0b" stroke-width="2"/>
  <text x="340" y="55" font-family="monospace" font-size="16" font-weight="800" fill="#fbbf24" letter-spacing="4" text-anchor="middle">⚡ LEVEL UP ACHIEVED ⚡</text>
  <text x="340" y="102" font-family="sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle">${username}</text>
  <rect x="190" y="128" width="110" height="58" rx="12" fill="#1e293b"/>
  <text x="245" y="166" font-family="monospace" font-size="28" font-weight="800" fill="#94a3b8" text-anchor="middle">LV.${oldLvl}</text>
  <text x="340" y="166" font-family="monospace" font-size="28" font-weight="900" fill="#fbbf24" text-anchor="middle">➜</text>
  <rect x="380" y="128" width="110" height="58" rx="12" fill="rgba(245,158,11,0.2)" stroke="#fbbf24" stroke-width="2"/>
  <text x="435" y="166" font-family="monospace" font-size="28" font-weight="900" fill="#fbbf24" text-anchor="middle">LV.${newLvl}</text>
</svg>`);
      }
    },
    {
      name: 'Top Leaderboard Card',
      path: '/api/canvas/leaderboard',
      method: 'GET',
      description: 'Genera una tabla de clasificación visual Top 3 para servidores o torneos.',
      responseType: 'image',
      params: [
        { name: 'title', type: 'string', required: false, example: 'TOP DEVELOPERS RANKING', description: 'Título del ranking' },
        { name: 'first', type: 'string', required: false, example: 'LyanValentin (15,400 XP)', description: 'Puesto #1' },
        { name: 'second', type: 'string', required: false, example: 'Siputzx (12,950 XP)', description: 'Puesto #2' },
        { name: 'third', type: 'string', required: false, example: 'CyberCoder (10,200 XP)', description: 'Puesto #3' }
      ],
      handler: async (req, res) => {
        const title = escapeXml(req.query.title || 'TOP DEVELOPERS RANKING');
        const first = escapeXml(req.query.first || 'LyanValentin (15,400 XP)');
        const second = escapeXml(req.query.second || 'Siputzx (12,950 XP)');
        const third = escapeXml(req.query.third || 'CyberCoder (10,200 XP)');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="310" viewBox="0 0 680 310">
  <rect width="680" height="310" rx="18" fill="#090d16" stroke="#334155" stroke-width="2"/>
  <text x="340" y="48" font-family="monospace" font-size="20" font-weight="900" fill="#00f5d4" text-anchor="middle">🏆 ${title}</text>
  <rect x="40" y="75" width="600" height="60" rx="10" fill="rgba(250,204,21,0.12)" stroke="#facc15"/>
  <text x="65" y="112" font-family="monospace" font-size="22" font-weight="900" fill="#facc15">#1 🥇 ${first}</text>
  <rect x="40" y="150" width="600" height="56" rx="10" fill="rgba(148,163,184,0.12)" stroke="#94a3b8"/>
  <text x="65" y="185" font-family="monospace" font-size="20" font-weight="800" fill="#e2e8f0">#2 🥈 ${second}</text>
  <rect x="40" y="220" width="600" height="56" rx="10" fill="rgba(217,119,6,0.12)" stroke="#d97706"/>
  <text x="65" y="255" font-family="monospace" font-size="20" font-weight="800" fill="#fdba74">#3 🥉 ${third}</text>
</svg>`);
      }
    },
    {
      name: 'Ship / Love Meter Card',
      path: '/api/canvas/ship',
      method: 'GET',
      description: 'Genera una tarjeta de compatibilidad entre dos usuarios con barra de porcentaje.',
      responseType: 'image',
      params: [
        { name: 'user1', type: 'string', required: true, example: 'Frontend', description: 'Nombre 1' },
        { name: 'user2', type: 'string', required: true, example: 'Backend', description: 'Nombre 2' },
        { name: 'percent', type: 'number', required: false, example: '98', description: 'Porcentaje de compatibilidad (0-100)' }
      ],
      handler: async (req, res) => {
        const u1 = escapeXml(req.query.user1 || 'Frontend');
        const u2 = escapeXml(req.query.user2 || 'Backend');
        const pct = Math.max(0, Math.min(100, parseInt(req.query.percent || '98', 10) || 98));
        const barW = Math.round((pct / 100) * 440);

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="250" viewBox="0 0 680 250">
  <rect width="680" height="250" rx="20" fill="#170a14" stroke="#ec4899" stroke-width="2"/>
  <circle cx="135" cy="105" r="50" fill="#2e1026" stroke="#f472b6" stroke-width="2"/>
  <text x="135" y="114" font-family="monospace" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">${u1.slice(0, 2).toUpperCase()}</text>
  <text x="135" y="176" font-family="sans-serif" font-size="16" font-weight="700" fill="#fbcfe8" text-anchor="middle">${u1}</text>
  <text x="340" y="118" font-family="sans-serif" font-size="44" font-weight="900" fill="#f43f5e" text-anchor="middle">❤️ ${pct}%</text>
  <circle cx="545" cy="105" r="50" fill="#2e1026" stroke="#f472b6" stroke-width="2"/>
  <text x="545" y="114" font-family="monospace" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">${u2.slice(0, 2).toUpperCase()}</text>
  <text x="545" y="176" font-family="sans-serif" font-size="16" font-weight="700" fill="#fbcfe8" text-anchor="middle">${u2}</text>
  <rect x="120" y="205" width="440" height="16" rx="8" fill="#3b0724"/>
  <rect x="120" y="205" width="${barW}" height="16" rx="8" fill="#ec4899"/>
</svg>`);
      }
    },
    {
      name: 'Wanted Bounty Poster',
      path: '/api/canvas/wanted',
      method: 'GET',
      description: 'Genera un cartel de recompensa estilo "WANTED DEAD OR ALIVE" con cifra en Berries/Dólares.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: 'MONKEY D. CODER', description: 'Nombre en el cartel' },
        { name: 'bounty', type: 'string', required: false, example: '3,000,000,000', description: 'Recompensa' }
      ],
      handler: async (req, res) => {
        const username = escapeXml((req.query.username || 'MONKEY D. CODER').toUpperCase());
        const bounty = escapeXml(req.query.bounty || '3,000,000,000');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="600" viewBox="0 0 460 600">
  <rect width="460" height="600" rx="12" fill="#e6cfa3" stroke="#5c4028" stroke-width="8"/>
  <rect x="24" y="24" width="412" height="552" fill="none" stroke="#5c4028" stroke-width="2"/>
  <text x="230" y="88" font-family="serif" font-size="64" font-weight="900" fill="#3d2718" letter-spacing="6" text-anchor="middle">WANTED</text>
  <rect x="55" y="110" width="350" height="250" fill="#2c1d12" stroke="#5c4028" stroke-width="4"/>
  <circle cx="230" cy="235" r="76" fill="#5c4028"/>
  <text x="230" y="252" font-family="monospace" font-size="52" font-weight="900" fill="#e6cfa3" text-anchor="middle">${username.slice(0, 2)}</text>
  <text x="230" y="405" font-family="serif" font-size="34" font-weight="900" fill="#3d2718" letter-spacing="4" text-anchor="middle">DEAD OR ALIVE</text>
  <text x="230" y="465" font-family="serif" font-size="32" font-weight="900" fill="#26170e" text-anchor="middle">${username}</text>
  <text x="230" y="525" font-family="monospace" font-size="28" font-weight="900" fill="#3d2718" text-anchor="middle">฿ ${bounty} -</text>
</svg>`);
      }
    },
    {
      name: 'Official Certificate Generator',
      path: '/api/canvas/certificate',
      method: 'GET',
      description: 'Genera un diploma o certificado de reconocimiento personalizado en alta resolución.',
      responseType: 'image',
      params: [
        { name: 'name', type: 'string', required: true, example: 'Lyan Valentin', description: 'Nombre de quien recibe el certificado' },
        { name: 'course', type: 'string', required: false, example: 'Master en Arquitectura de APIs & Node.js', description: 'Logro o curso completado' }
      ],
      handler: async (req, res) => {
        const name = escapeXml(req.query.name || 'Lyan Valentin');
        const course = escapeXml(req.query.course || 'Master en Arquitectura de APIs & Node.js');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="460" viewBox="0 0 800 460">
  <rect width="800" height="460" rx="14" fill="#090d16" stroke="#00f5d4" stroke-width="4"/>
  <rect x="20" y="20" width="760" height="420" rx="8" fill="none" stroke="rgba(0,245,212,0.3)" stroke-width="1.5"/>
  <text x="400" y="85" font-family="monospace" font-size="16" font-weight="700" fill="#00f5d4" letter-spacing="6" text-anchor="middle">CERTIFICATE OF EXCELLENCE</text>
  <text x="400" y="135" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">ESTE CERTIFICADO SE OTORGA OFICIALMENTE A:</text>
  <text x="400" y="210" font-family="serif" font-size="52" font-weight="900" fill="#ffffff" text-anchor="middle">${name}</text>
  <line x1="200" y1="230" x2="600" y2="230" stroke="#00f5d4" stroke-width="2"/>
  <text x="400" y="285" font-family="sans-serif" font-size="22" font-weight="700" fill="#38bdf8" text-anchor="middle">${course}</text>
  <text x="400" y="385" font-family="monospace" font-size="14" fill="#64748b" text-anchor="middle">VERIFIED BY API CONSOLE V2 • ISSUED 2026</text>
</svg>`);
      }
    },
    {
      name: 'Cyber Citizen ID Card (eKTP)',
      path: '/api/canvas/id-card',
      method: 'GET',
      description: 'Genera una tarjeta de identificación ciudadana estilo Cyberpunk / eKTP.',
      responseType: 'image',
      params: [
        { name: 'name', type: 'string', required: true, example: 'LYAN VALENTIN', description: 'Nombre completo' },
        { name: 'idNumber', type: 'string', required: false, example: 'UY-2026-994810', description: 'Número de identificación' },
        { name: 'role', type: 'string', required: false, example: 'SYSTEM ARCHITECT', description: 'Rango o profesión' }
      ],
      handler: async (req, res) => {
        const name = escapeXml((req.query.name || 'LYAN VALENTIN').toUpperCase());
        const idNum = escapeXml(req.query.idNumber || 'UY-2026-994810');
        const role = escapeXml(req.query.role || 'SYSTEM ARCHITECT');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="360" viewBox="0 0 680 360">
  <rect width="680" height="360" rx="18" fill="#08121e" stroke="#38bdf8" stroke-width="2"/>
  <rect x="0" y="0" width="680" height="64" rx="18" fill="#0c233b"/>
  <text x="32" y="40" font-family="monospace" font-size="20" font-weight="900" fill="#38bdf8" letter-spacing="3">CYBER CITIZEN IDENTITY CARD</text>
  <rect x="36" y="96" width="150" height="180" rx="12" fill="#112a45" stroke="#38bdf8" stroke-width="2"/>
  <text x="111" y="200" font-family="monospace" font-size="48" font-weight="900" fill="#38bdf8" text-anchor="middle">${name.slice(0, 2)}</text>
  <text x="220" y="125" font-family="monospace" font-size="13" fill="#64748b">ID NUMBER</text>
  <text x="220" y="150" font-family="monospace" font-size="22" font-weight="800" fill="#00f5d4">${idNum}</text>
  <text x="220" y="190" font-family="monospace" font-size="13" fill="#64748b">FULL NAME</text>
  <text x="220" y="216" font-family="sans-serif" font-size="26" font-weight="900" fill="#ffffff">${name}</text>
  <text x="220" y="255" font-family="monospace" font-size="13" fill="#64748b">CLEARANCE / ROLE</text>
  <text x="220" y="280" font-family="monospace" font-size="18" font-weight="700" fill="#38bdf8">${role}</text>
</svg>`);
      }
    },
    {
      name: 'Aesthetic Quote Card',
      path: '/api/canvas/quote-card',
      method: 'GET',
      description: 'Genera una tarjeta minimalista con una frase célebre y autor.',
      responseType: 'image',
      params: [
        { name: 'quote', type: 'string', required: true, example: 'Talk is cheap. Show me the code.', description: 'Frase o cita' },
        { name: 'author', type: 'string', required: false, example: 'Linus Torvalds', description: 'Autor de la frase' }
      ],
      handler: async (req, res) => {
        const quote = escapeXml((req.query.quote || 'Talk is cheap. Show me the code.').slice(0, 90));
        const author = escapeXml(req.query.author || 'Linus Torvalds');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="320" viewBox="0 0 720 320">
  <rect width="720" height="320" rx="20" fill="#0b0f17" stroke="#334155" stroke-width="2"/>
  <text x="60" y="105" font-family="serif" font-size="72" fill="#00f5d4" opacity="0.35">“</text>
  <text x="360" y="165" font-family="sans-serif" font-size="24" font-weight="700" fill="#f8fafc" text-anchor="middle">${quote}</text>
  <text x="360" y="235" font-family="monospace" font-size="16" font-weight="700" fill="#00f5d4" text-anchor="middle">— ${author}</text>
</svg>`);
      }
    },
    {
      name: 'YouTube Comment Screenshot',
      path: '/api/canvas/youtube-comment',
      method: 'GET',
      description: 'Genera una imagen simulando un comentario destacado de YouTube en modo oscuro.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: '@dev_master', description: 'Nombre de usuario' },
        { name: 'comment', type: 'string', required: true, example: 'Esta API funciona a la primera sin pedir API Key, 10/10!', description: 'Texto del comentario' },
        { name: 'likes', type: 'string', required: false, example: '1.2K', description: 'Likes del comentario' }
      ],
      handler: async (req, res) => {
        const username = escapeXml(req.query.username || '@dev_master');
        const comment = escapeXml((req.query.comment || 'Esta API funciona a la primera sin pedir API Key, 10/10!').slice(0, 95));
        const likes = escapeXml(req.query.likes || '1.2K');

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="210" viewBox="0 0 720 210">
  <rect width="720" height="210" rx="16" fill="#0f0f0f" stroke="#272727" stroke-width="2"/>
  <circle cx="58" cy="64" r="24" fill="#ef4444"/>
  <text x="58" y="72" font-family="sans-serif" font-size="18" font-weight="800" fill="#ffffff" text-anchor="middle">${username.replace('@', '').slice(0, 2).toUpperCase()}</text>
  <text x="98" y="56" font-family="sans-serif" font-size="15" font-weight="700" fill="#f1f1f1">${username} <tspan fill="#aaaaaa" font-weight="400" font-size="13">• hace 2 horas</tspan></text>
  <text x="98" y="96" font-family="sans-serif" font-size="18" fill="#ffffff">${comment}</text>
  <text x="98" y="148" font-family="sans-serif" font-size="15" fill="#aaaaaa">👍 ${likes}    👎    Responder</text>
</svg>`);
      }
    },
    {
      name: 'macOS Code Snippet Card',
      path: '/api/canvas/code-snap',
      method: 'GET',
      description: 'Genera una elegante captura de ventana estilo macOS Carbon con tu código.',
      responseType: 'image',
      params: [
        { name: 'title', type: 'string', required: false, example: 'api-client.js', description: 'Título del archivo' },
        { name: 'code', type: 'string', required: true, example: 'const res = await fetch("/api/endpoints");', description: 'Línea de código a destacar' }
      ],
      handler: async (req, res) => {
        const title = escapeXml(req.query.title || 'api-client.js');
        const code = escapeXml((req.query.code || 'const res = await fetch("/api/endpoints");').slice(0, 75));

        sendSvg(res, `<svg xmlns="http://www.w3.org/2000/svg" width="740" height="240" viewBox="0 0 740 240">
  <rect width="740" height="240" rx="16" fill="#1e293b"/>
  <rect x="20" y="20" width="700" height="200" rx="12" fill="#0b0f19" stroke="#334155" stroke-width="1.5"/>
  <circle cx="46" cy="46" r="7" fill="#ef4444"/>
  <circle cx="68" cy="46" r="7" fill="#f59e0b"/>
  <circle cx="90" cy="46" r="7" fill="#10b981"/>
  <text x="370" y="51" font-family="monospace" font-size="13" fill="#94a3b8" text-anchor="middle">${title}</text>
  <line x1="20" y1="68" x2="720" y2="68" stroke="#1e293b"/>
  <text x="48" y="135" font-family="monospace" font-size="19" fill="#00f5d4">${code}</text>
</svg>`);
      }
    }
  ]
};
