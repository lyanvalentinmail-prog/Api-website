/**
 * Categoría: CANVAS
 * Generadores dinámicos de tarjetas e imágenes en tiempo real (Welcome, Profile, Spotify, Tweet, Captcha, LevelUp).
 * Devuelven image/svg+xml directamente para previsualización visual inmediata en el Playground o uso en <img>.
 */

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

module.exports = {
  category: 'CANVAS',
  description: 'Generación dinámica de imágenes, tarjetas sociales, banners de bienvenida y captchas visuales.',
  endpoints: [
    {
      name: 'Welcome Card V2',
      path: '/api/canvas/welcome',
      method: 'GET',
      description: 'Genera una tarjeta visual de bienvenida estilo Discord/Comunidad con avatar, servidor y contador.',
      responseType: 'image',
      params: [
        { name: 'username', type: 'string', required: true, example: 'LyanValentin', description: 'Nombre del usuario' },
        { name: 'guild', type: 'string', required: false, example: 'API CONSOLE COMMUNITY', description: 'Nombre del servidor o comunidad' },
        { name: 'memberCount', type: 'number', required: false, example: '1428', description: 'Número de miembro' },
        { name: 'theme', type: 'select', options: ['cyber', 'emerald', 'sunset', 'midnight'], required: false, example: 'cyber', description: 'Tema de color de la tarjeta' }
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

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="320" viewBox="0 0 800 320">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg1}"/>
      <stop offset="100%" stop-color="${p.bg2}"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${p.accent}"/>
      <stop offset="100%" stop-color="${p.accent2}"/>
    </linearGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="800" height="320" rx="20" fill="url(#bg)"/>
  <rect width="800" height="320" rx="20" fill="url(#grid)"/>
  <circle cx="720" cy="50" r="140" fill="${p.accent}" opacity="0.08"/>
  <circle cx="90" cy="280" r="120" fill="${p.accent2}" opacity="0.08"/>
  <rect x="16" y="16" width="768" height="288" rx="14" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
  <rect x="16" y="298" width="768" height="6" rx="3" fill="url(#accentGrad)"/>

  <!-- Avatar Ring -->
  <g transform="translate(135, 160)">
    <circle cx="0" cy="0" r="76" fill="none" stroke="url(#accentGrad)" stroke-width="4" stroke-dasharray="12 6"/>
    <circle cx="0" cy="0" r="66" fill="#182032" stroke="${p.accent}" stroke-width="2"/>
    <text x="0" y="14" font-family="monospace, sans-serif" font-size="42" font-weight="800" fill="#ffffff" text-anchor="middle">${initials}</text>
    <circle cx="48" cy="48" r="13" fill="#10b981" stroke="${p.bg1}" stroke-width="4"/>
  </g>

  <!-- Text Info -->
  <text x="245" y="98" font-family="monospace, sans-serif" font-size="14" font-weight="700" fill="${p.accent}" letter-spacing="3">WELCOME TO THE SERVER</text>
  <text x="245" y="152" font-family="sans-serif" font-size="44" font-weight="900" fill="#ffffff">${username}</text>
  <text x="245" y="192" font-family="sans-serif" font-size="18" fill="#94a3b8">Joined <tspan fill="#e2e8f0" font-weight="700">${guild}</tspan></text>

  <!-- Member Badge -->
  <rect x="245" y="216" width="220" height="38" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)"/>
  <text x="265" y="240" font-family="monospace, sans-serif" font-size="14" font-weight="700" fill="${p.accent}">MEMBER #${memberCount}</text>
</svg>`;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'no-cache');
        res.send(svg);
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

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="280" viewBox="0 0 760 280">
  <defs>
    <linearGradient id="pbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0f19"/>
      <stop offset="100%" stop-color="#171f32"/>
    </linearGradient>
    <linearGradient id="xpGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="760" height="280" rx="18" fill="url(#pbg)" stroke="#26324d" stroke-width="2"/>
  <circle cx="115" cy="140" r="64" fill="#1e293b" stroke="#10b981" stroke-width="3"/>
  <text x="115" y="154" font-family="monospace" font-size="38" font-weight="800" fill="#10b981" text-anchor="middle">${username.slice(0, 2).toUpperCase()}</text>

  <text x="215" y="82" font-family="sans-serif" font-size="34" font-weight="800" fill="#f8fafc">${username}</text>
  <text x="215" y="114" font-family="monospace" font-size="16" fill="#38bdf8">${role}</text>

  <!-- Stats -->
  <rect x="585" y="48" width="135" height="64" rx="10" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)"/>
  <text x="652" y="74" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="middle">LEVEL</text>
  <text x="652" y="100" font-family="monospace" font-size="26" font-weight="900" fill="#10b981" text-anchor="middle">${level}</text>

  <!-- XP Progress -->
  <text x="215" y="168" font-family="monospace" font-size="14" fill="#cbd5e1">EXPERIENCE PROGRESS</text>
  <text x="675" y="168" font-family="monospace" font-size="14" font-weight="700" fill="#10b981" text-anchor="end">${xp}%</text>
  <rect x="215" y="182" width="460" height="18" rx="9" fill="#0f172a" stroke="#334155"/>
  <rect x="215" y="182" width="${barWidth}" height="18" rx="9" fill="url(#xpGrad)"/>

  <text x="215" y="232" font-family="monospace" font-size="12" fill="#64748b">STATUS: VERIFIED DEVELOPER • NO API KEY REQUIRED</text>
</svg>`;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
      }
    },
    {
      name: 'Spotify Now Playing Card',
      path: '/api/canvas/spotify',
      method: 'GET',
      description: 'Genera un reproductor visual estilo Spotify Now Playing con barra de tiempo y ondas de audio.',
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

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="250" viewBox="0 0 720 250">
  <defs>
    <linearGradient id="spbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#07170e"/>
      <stop offset="50%" stop-color="#0d131a"/>
      <stop offset="100%" stop-color="#090b10"/>
    </linearGradient>
  </defs>
  <rect width="720" height="250" rx="20" fill="url(#spbg)" stroke="#1db954" stroke-opacity="0.35" stroke-width="1.5"/>

  <!-- Vinyl / Album Art -->
  <g transform="translate(115, 125)">
    <rect x="-75" y="-75" width="150" height="150" rx="16" fill="#121a24" stroke="#1db954" stroke-width="2"/>
    <circle cx="0" cy="0" r="54" fill="#090d12" stroke="#283547" stroke-width="8"/>
    <circle cx="0" cy="0" r="18" fill="#1db954"/>
    <circle cx="0" cy="0" r="6" fill="#090d12"/>
  </g>

  <!-- Spotify Header -->
  <circle cx="235" cy="54" r="8" fill="#1db954"/>
  <text x="252" y="59" font-family="monospace" font-size="13" font-weight="700" fill="#1db954" letter-spacing="2">NOW PLAYING ON SPOTIFY</text>

  <text x="225" y="102" font-family="sans-serif" font-size="28" font-weight="800" fill="#ffffff">${title}</text>
  <text x="225" y="132" font-family="sans-serif" font-size="18" fill="#94a3b8">${artist}</text>
  <text x="225" y="156" font-family="monospace" font-size="13" fill="#64748b">Album: ${album}</text>

  <!-- Progress Bar -->
  <rect x="225" y="182" width="430" height="8" rx="4" fill="#1e293b"/>
  <rect x="225" y="182" width="${barW}" height="8" rx="4" fill="#1db954"/>
  <circle cx="${225 + barW}" cy="186" r="7" fill="#ffffff"/>

  <text x="225" y="212" font-family="monospace" font-size="12" fill="#94a3b8">02:18</text>
  <text x="655" y="212" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="end">03:42</text>
</svg>`;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
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
        { name: 'handle', type: 'string', required: false, example: 'siputzx_api', description: 'Usuario @handle (sin @)' },
        { name: 'text', type: 'string', required: true, example: 'No login. No API key. Just pure REST API endpoints ready to execute from your browser!', description: 'Contenido del tweet' },
        { name: 'likes', type: 'string', required: false, example: '4.8K', description: 'Cantidad de likes' },
        { name: 'retweets', type: 'string', required: false, example: '942', description: 'Cantidad de reposts' }
      ],
      handler: async (req, res) => {
        const username = escapeXml(req.query.username || 'Siputzx API');
        const handle = escapeXml((req.query.handle || 'siputzx_api').replace(/^@/, ''));
        const rawText = String(req.query.text || 'No login. No API key. Just pure REST API endpoints ready to execute!');
        const likes = escapeXml(req.query.likes || '4.8K');
        const retweets = escapeXml(req.query.retweets || '942');

        // Wrap text into up to 3 lines of ~56 chars
        const words = rawText.split(/\s+/);
        const lines = [];
        let current = '';
        for (const w of words) {
          if ((current + ' ' + w).trim().length > 54 && lines.length < 2) {
            lines.push(escapeXml(current.trim()));
            current = w;
          } else {
            current += ' ' + w;
          }
        }
        if (current.trim()) lines.push(escapeXml(current.trim().slice(0, 62)));

        const textElements = lines
          .map((line, idx) => `<text x="40" y="${130 + idx * 32}" font-family="sans-serif" font-size="21" fill="#f1f5f9">${line}</text>`)
          .join('\n  ');

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="290" viewBox="0 0 720 290">
  <rect width="720" height="290" rx="18" fill="#0b0e14" stroke="#1e293b" stroke-width="2"/>
  <circle cx="66" cy="62" r="26" fill="#1d9bf0"/>
  <text x="66" y="70" font-family="sans-serif" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">${username.slice(0, 2).toUpperCase()}</text>

  <text x="106" y="58" font-family="sans-serif" font-size="19" font-weight="800" fill="#ffffff">${username} <tspan fill="#1d9bf0">✔</tspan></text>
  <text x="106" y="80" font-family="monospace" font-size="14" fill="#64748b">@${handle}</text>

  ${textElements}

  <line x1="40" y1="220" x2="680" y2="220" stroke="#1e293b" stroke-width="1"/>
  <text x="40" y="254" font-family="monospace" font-size="14" fill="#94a3b8">🔁 <tspan fill="#e2e8f0" font-weight="700">${retweets}</tspan> Reposts</text>
  <text x="210" y="254" font-family="monospace" font-size="14" fill="#94a3b8">❤️ <tspan fill="#f43f5e" font-weight="700">${likes}</tspan> Likes</text>
  <text x="680" y="254" font-family="monospace" font-size="13" fill="#475569" text-anchor="end">API CONSOLE V2</text>
</svg>`;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
      }
    },
    {
      name: 'Visual Captcha Generator',
      path: '/api/canvas/captcha',
      method: 'GET',
      description: 'Genera una imagen Captcha con distorsión geométrica y líneas de ruido para verificación.',
      responseType: 'image',
      params: [
        { name: 'code', type: 'string', required: false, example: 'X9K4P2', description: 'Código a renderizar (si se omite, se genera uno aleatorio)' }
      ],
      handler: async (req, res) => {
        const rawCode = (req.query.code || Math.random().toString(36).substring(2, 8).toUpperCase()).slice(0, 8);
        const chars = rawCode.split('');

        const charLayers = chars.map((ch, idx) => {
          const x = 65 + idx * 52;
          const y = 82 + ((idx % 2 === 0) ? -8 : 10);
          const rot = (idx % 2 === 0) ? -12 : 14;
          const colors = ['#00f5d4', '#38bdf8', '#a855f7', '#f43f5e', '#facc15', '#10b981'];
          const color = colors[idx % colors.length];
          return `<text x="${x}" y="${y}" font-family="monospace" font-size="44" font-weight="900" fill="${color}" transform="rotate(${rot} ${x} ${y})">${escapeXml(ch)}</text>`;
        }).join('\n  ');

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="140" viewBox="0 0 420 140">
  <rect width="420" height="140" rx="12" fill="#090d16" stroke="#1e293b" stroke-width="2"/>
  <path d="M 15 35 Q 140 120 260 25 T 405 95" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.45"/>
  <path d="M 10 105 Q 180 15 310 110 T 410 40" fill="none" stroke="#f43f5e" stroke-width="2" opacity="0.45"/>
  <line x1="20" y1="70" x2="400" y2="70" stroke="#10b981" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.4"/>
  ${charLayers}
</svg>`;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
      }
    }
  ]
};
