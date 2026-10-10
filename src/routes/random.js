/**
 * Categoría: RANDOM
 * Avatares generativos deterministas en SVG, curiosidades científicas y excusas para desarrolladores.
 */

const crypto = require('crypto');

const FACTS = [
  'El primer "bug" informático real fue una polilla atrapada en un relé de la computadora Harvard Mark II en 1947.',
  'El código fuente del Apolo 11 tenía comentarios humorísticos escritos en ensamblador por el equipo de Margaret Hamilton.',
  'Más del 90% de las monedas del mundo existen únicamente como datos digitales en servidores bancarios.',
  'El primer dominio registrado en la historia de Internet fue symbolics.com el 15 de marzo de 1985.',
  'Un solo gramo de ADN humano puede almacenar teóricamente hasta 215 petabytes (215 millones de gigabytes) de datos.'
];

const DEV_EXCUSES = [
  'En mi máquina local funciona perfectamente.',
  'Eso no es un bug, es una funcionalidad no documentada.',
  'Debe ser un problema de caché de DNS o del navegador.',
  'Nadie tocó ese archivo desde hace 6 meses, se rompió solo.',
  'Funcionaba ayer antes de actualizar las dependencias.'
];

module.exports = {
  category: 'RANDOM',
  description: 'Generadores aleatorios de avatares pixel-art, datos curiosos y contenido dinámico.',
  endpoints: [
    {
      name: 'Pixel Avatar Generator (Identicon SVG)',
      path: '/api/r/avatar',
      method: 'GET',
      description: 'Genera un avatar simétrico 5x5 estilo GitHub Identicon en formato SVG único para cualquier nombre o semilla.',
      responseType: 'image',
      params: [
        { name: 'seed', type: 'string', required: false, example: 'lyanvalentin', description: 'Semilla o nombre de usuario para generar el patrón' }
      ],
      handler: async (req, res) => {
        const seed = (req.query.seed || Math.random().toString(36).slice(2)).trim();
        const hash = crypto.createHash('sha256').update(seed).digest('hex');

        const hue = parseInt(hash.slice(0, 4), 16) % 360;
        const fgColor = `hsl(${hue}, 85%, 60%)`;
        const bgColor = '#0b0f19';

        let rects = '';
        const cellSize = 40;
        const pad = 30;

        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 3; col++) {
            const idx = (row * 3 + col) % hash.length;
            const on = parseInt(hash[idx], 16) % 2 === 0;
            if (on) {
              const xLeft = pad + col * cellSize;
              const xRight = pad + (4 - col) * cellSize;
              const y = pad + row * cellSize;
              rects += `<rect x="${xLeft}" y="${y}" width="${cellSize}" height="${cellSize}" rx="4" fill="${fgColor}"/>\n  `;
              if (col !== 2) {
                rects += `<rect x="${xRight}" y="${y}" width="${cellSize}" height="${cellSize}" rx="4" fill="${fgColor}"/>\n  `;
              }
            }
          }
        }

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260">
  <rect width="260" height="260" rx="28" fill="${bgColor}" stroke="rgba(255,255,255,0.12)" stroke-width="3"/>
  ${rects}
</svg>`;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
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
        const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
        res.json({
          status: true,
          data: {
            fact,
            category: 'Tech & Science'
          }
        });
      }
    },
    {
      name: 'Random Developer Excuse',
      path: '/api/r/excuse',
      method: 'GET',
      description: 'Devuelve una excusa clásica de programador lista para usar en tu próximo daily standup.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const excuse = DEV_EXCUSES[Math.floor(Math.random() * DEV_EXCUSES.length)];
        res.json({
          status: true,
          data: {
            excuse
          }
        });
      }
    }
  ]
};
