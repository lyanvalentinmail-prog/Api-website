/**
 * Categoría: RANDOM (6 Endpoints)
 * Avatares Pixel-Art SVG, fondos Mesh Gradient SVG, usuarios mock, chistes geek, curiosidades y excusas.
 */

const crypto = require('crypto');

const FACTS = [
  'El primer "bug" informático real fue una polilla atrapada en un relé de la computadora Harvard Mark II en 1947.',
  'El código fuente del Apolo 11 tenía comentarios humorísticos escritos en ensamblador por el equipo de Margaret Hamilton.',
  'El primer dominio registrado en la historia de Internet fue symbolics.com el 15 de marzo de 1985.',
  'Un solo gramo de ADN humano puede almacenar teóricamente hasta 215 petabytes de datos.'
];

const DEV_EXCUSES = [
  'En mi máquina local funciona perfectamente.',
  'Eso no es un bug, es una funcionalidad no documentada.',
  'Debe ser un problema de caché de DNS o del navegador.',
  'Nadie tocó ese archivo desde hace 6 meses, se rompió solo.'
];

const JOKES = [
  { setup: '¿Por qué los programadores prefieren el modo oscuro?', punchline: 'Porque la luz atrae a los bugs.' },
  { setup: '¿Cuántos programadores se necesitan para cambiar una bombilla?', punchline: 'Ninguno, eso es un problema de hardware.' },
  { setup: 'Hay 10 tipos de personas en el mundo:', punchline: 'Las que entienden binario y las que no.' },
  { setup: 'Un SQL entra a un bar, se acerca a dos mesas y pregunta:', punchline: '¿Puedo hacer un JOIN con ustedes?' }
];

module.exports = {
  category: 'RANDOM',
  description: 'Generadores aleatorios de avatares pixel-art, wallpapers degradados SVG, datos mock, chistes y curiosidades.',
  endpoints: [
    {
      name: 'Pixel Avatar Generator (Identicon SVG)',
      path: '/api/r/avatar',
      method: 'GET',
      description: 'Genera un avatar simétrico 5x5 estilo GitHub Identicon en formato SVG único.',
      responseType: 'image',
      params: [
        { name: 'seed', type: 'string', required: false, example: 'lyanvalentin', description: 'Semilla o nombre de usuario' }
      ],
      handler: async (req, res) => {
        const seed = (req.query.seed || Math.random().toString(36).slice(2)).trim();
        const hash = crypto.createHash('sha256').update(seed).digest('hex');
        const hue = parseInt(hash.slice(0, 4), 16) % 360;
        const fgColor = `hsl(${hue}, 85%, 60%)`;
        let rects = '';
        const cellSize = 40;
        const pad = 30;

        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 3; col++) {
            const idx = (row * 3 + col) % hash.length;
            if (parseInt(hash[idx], 16) % 2 === 0) {
              const xLeft = pad + col * cellSize;
              const xRight = pad + (4 - col) * cellSize;
              const y = pad + row * cellSize;
              rects += `<rect x="${xLeft}" y="${y}" width="${cellSize}" height="${cellSize}" rx="4" fill="${fgColor}"/>\n  `;
              if (col !== 2) rects += `<rect x="${xRight}" y="${y}" width="${cellSize}" height="${cellSize}" rx="4" fill="${fgColor}"/>\n  `;
            }
          }
        }

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260">
  <rect width="260" height="260" rx="28" fill="#0b0f19" stroke="rgba(255,255,255,0.12)" stroke-width="3"/>
  ${rects}
</svg>`);
      }
    },
    {
      name: 'Mesh Gradient Wallpaper SVG',
      path: '/api/r/gradient-svg',
      method: 'GET',
      description: 'Genera un fondo degradado abstracto estilo Mesh Gradient en imagen SVG.',
      responseType: 'image',
      params: [
        { name: 'seed', type: 'string', required: false, example: 'cyber-aurora', description: 'Semilla para generar los colores' }
      ],
      handler: async (req, res) => {
        const seed = (req.query.seed || Math.random().toString(36).slice(2)).trim();
        const hash = crypto.createHash('md5').update(seed).digest('hex');
        const h1 = parseInt(hash.slice(0, 3), 16) % 360;
        const h2 = (h1 + 85) % 360;
        const h3 = (h1 + 195) % 360;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="360" viewBox="0 0 720 360">
  <defs>
    <radialGradient id="g1" cx="20%" cy="25%" r="65%"><stop offset="0%" stop-color="hsl(${h1},90%,55%)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
    <radialGradient id="g2" cx="80%" cy="30%" r="60%"><stop offset="0%" stop-color="hsl(${h2},90%,55%)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
    <radialGradient id="g3" cx="50%" cy="85%" r="70%"><stop offset="0%" stop-color="hsl(${h3},85%,50%)"/><stop offset="100%" stop-color="transparent"/></radialGradient>
  </defs>
  <rect width="720" height="360" rx="18" fill="#060812"/>
  <rect width="720" height="360" rx="18" fill="url(#g1)"/>
  <rect width="720" height="360" rx="18" fill="url(#g2)"/>
  <rect width="720" height="360" rx="18" fill="url(#g3)"/>
</svg>`);
      }
    },
    {
      name: 'Random Tech & Science Fact',
      path: '/api/r/fact',
      method: 'GET',
      description: 'Devuelve un dato curioso aleatorio sobre tecnología, computación o ciencia.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        res.json({ status: true, data: { fact: FACTS[Math.floor(Math.random() * FACTS.length)] } });
      }
    },
    {
      name: 'Random Developer Excuse',
      path: '/api/r/excuse',
      method: 'GET',
      description: 'Devuelve una excusa clásica de programador.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        res.json({ status: true, data: { excuse: DEV_EXCUSES[Math.floor(Math.random() * DEV_EXCUSES.length)] } });
      }
    },
    {
      name: 'Programming Joke Generator',
      path: '/api/r/joke',
      method: 'GET',
      description: 'Devuelve un chiste de programación con pregunta (setup) y remate (punchline).',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        res.json({ status: true, data: JOKES[Math.floor(Math.random() * JOKES.length)] });
      }
    },
    {
      name: 'Fake User Mock Profile Generator',
      path: '/api/r/fake-user',
      method: 'GET',
      description: 'Genera un perfil completo de usuario ficticio para poblar bases de datos o hacer pruebas de UI.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const firstNames = ['Valentina', 'Mateo', 'Lucía', 'Santiago', 'Camila', 'Nicolás', 'Sofía', 'Sebastián'];
        const lastNames = ['Rodríguez', 'Silva', 'Fernández', 'Pereira', 'Gómez', 'Méndez', 'Acosta', 'Duarte'];
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        const username = `${fn.toLowerCase()}_${ln.toLowerCase()}${Math.floor(10 + Math.random() * 89)}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        res.json({
          status: true,
          data: {
            id: crypto.randomUUID(),
            full_name: `${fn} ${ln}`,
            username,
            email: `${username}@example.dev`,
            avatar_svg: `/api/r/avatar?seed=${username}`,
            role: 'Developer',
            created_at: new Date().toISOString()
          }
        });
      }
    }
  ]
};
