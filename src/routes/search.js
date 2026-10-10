/**
 * Categoría: SEARCH (7 Endpoints)
 * Motores de consulta para países, códigos HTTP, tabla periódica, lenguajes de programación, Linux, Git y puertos TCP/UDP.
 */

const COUNTRIES = [
  { name: 'Uruguay', code: 'UY', capital: 'Montevideo', currency: 'UYU ($U)', dial_code: '+598', region: 'South America', flag: '🇺🇾', population: '3.42M', timezone: 'UTC-3' },
  { name: 'Argentina', code: 'AR', capital: 'Buenos Aires', currency: 'ARS ($)', dial_code: '+54', region: 'South America', flag: '🇦🇷', population: '46.2M', timezone: 'UTC-3' },
  { name: 'Mexico', code: 'MX', capital: 'Mexico City', currency: 'MXN ($)', dial_code: '+52', region: 'North America', flag: '🇲🇽', population: '128.5M', timezone: 'UTC-6' },
  { name: 'Spain', code: 'ES', capital: 'Madrid', currency: 'EUR (€)', dial_code: '+34', region: 'Europe', flag: '🇪🇸', population: '48.3M', timezone: 'UTC+1' },
  { name: 'Colombia', code: 'CO', capital: 'Bogotá', currency: 'COP ($)', dial_code: '+57', region: 'South America', flag: '🇨🇴', population: '52.1M', timezone: 'UTC-5' },
  { name: 'Chile', code: 'CL', capital: 'Santiago', currency: 'CLP ($)', dial_code: '+56', region: 'South America', flag: '🇨🇱', population: '19.6M', timezone: 'UTC-4' },
  { name: 'Japan', code: 'JP', capital: 'Tokyo', currency: 'JPY (¥)', dial_code: '+81', region: 'Asia', flag: '🇯🇵', population: '124.5M', timezone: 'UTC+9' },
  { name: 'Indonesia', code: 'ID', capital: 'Jakarta', currency: 'IDR (Rp)', dial_code: '+62', region: 'Asia', flag: '🇮🇩', population: '277.5M', timezone: 'UTC+7' },
  { name: 'United States', code: 'US', capital: 'Washington, D.C.', currency: 'USD ($)', dial_code: '+1', region: 'North America', flag: '🇺🇸', population: '334.9M', timezone: 'UTC-5' }
];

const HTTP_CODES = {
  200: { status: 200, name: 'OK', category: '2xx Success', description: 'La solicitud ha tenido éxito.' },
  201: { status: 201, name: 'Created', category: '2xx Success', description: 'Se ha creado un nuevo recurso.' },
  301: { status: 301, name: 'Moved Permanently', category: '3xx Redirection', description: 'La URL del recurso ha cambiado de forma permanente.' },
  400: { status: 400, name: 'Bad Request', category: '4xx Client Error', description: 'Sintaxis inválida o parámetros faltantes.' },
  401: { status: 401, name: 'Unauthorized', category: '4xx Client Error', description: 'Es necesario autenticar para obtener la respuesta.' },
  403: { status: 403, name: 'Forbidden', category: '4xx Client Error', description: 'El cliente no posee los permisos necesarios.' },
  404: { status: 404, name: 'Not Found', category: '4xx Client Error', description: 'El servidor no pudo encontrar el contenido solicitado.' },
  429: { status: 429, name: 'Too Many Requests', category: '4xx Client Error', description: 'Rate limiting activado por exceso de peticiones.' },
  500: { status: 500, name: 'Internal Server Error', category: '5xx Server Error', description: 'Error interno inesperado en el servidor.' }
};

const ELEMENTS = [
  { number: 1, symbol: 'H', name: 'Hidrógeno', mass: 1.008, category: 'No metal' },
  { number: 6, symbol: 'C', name: 'Carbono', mass: 12.011, category: 'No metal' },
  { number: 7, symbol: 'N', name: 'Nitrógeno', mass: 14.007, category: 'No metal' },
  { number: 8, symbol: 'O', name: 'Oxígeno', mass: 15.999, category: 'No metal' },
  { number: 14, symbol: 'Si', name: 'Silicio', mass: 28.085, category: 'Metaloide' },
  { number: 26, symbol: 'Fe', name: 'Hierro', mass: 55.845, category: 'Metal de transición' },
  { number: 79, symbol: 'Au', name: 'Oro', mass: 196.966, category: 'Metal de transición' }
];

module.exports = {
  category: 'SEARCH',
  description: 'Consultas de países, códigos HTTP, tabla periódica, lenguajes de programación, comandos Linux/Git y puertos.',
  endpoints: [
    {
      name: 'Country Info Lookup',
      path: '/api/s/country',
      method: 'GET',
      description: 'Busca datos detallados de un país: capital, moneda, código telefónico, bandera y zona horaria.',
      responseType: 'json',
      params: [
        { name: 'query', type: 'string', required: false, example: 'Uruguay', description: 'Nombre del país o código ISO' }
      ],
      handler: async (req, res) => {
        const q = (req.query.query || '').trim().toLowerCase();
        const matches = !q ? COUNTRIES : COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q || c.capital.toLowerCase().includes(q));
        res.json({ status: true, total: matches.length, data: matches });
      }
    },
    {
      name: 'HTTP Status Code Reference',
      path: '/api/s/http-status',
      method: 'GET',
      description: 'Consulta la definición, categoría y significado de cualquier código de estado HTTP.',
      responseType: 'json',
      params: [
        { name: 'code', type: 'number', required: false, example: '429', description: 'Código HTTP (200, 400, 404, 429, 500...)' }
      ],
      handler: async (req, res) => {
        const code = parseInt(req.query.code || '0', 10);
        if (code && HTTP_CODES[code]) return res.json({ status: true, data: HTTP_CODES[code] });
        res.json({ status: true, data: Object.values(HTTP_CODES) });
      }
    },
    {
      name: 'Periodic Table Element Search',
      path: '/api/s/periodic-table',
      method: 'GET',
      description: 'Busca elementos químicos por símbolo, nombre o número atómico.',
      responseType: 'json',
      params: [
        { name: 'query', type: 'string', required: false, example: 'Au', description: 'Símbolo o nombre del elemento' }
      ],
      handler: async (req, res) => {
        const q = (req.query.query || '').trim().toLowerCase();
        const matches = !q ? ELEMENTS : ELEMENTS.filter(e => e.symbol.toLowerCase() === q || e.name.toLowerCase().includes(q) || String(e.number) === q);
        res.json({ status: true, data: matches.length ? matches : ELEMENTS });
      }
    },
    {
      name: 'Programming Languages Encyclopedia',
      path: '/api/s/programming-lang',
      method: 'GET',
      description: 'Información histórica y técnica sobre lenguajes de programación populares.',
      responseType: 'json',
      params: [
        { name: 'lang', type: 'string', required: false, example: 'javascript', description: 'Lenguaje a consultar' }
      ],
      handler: async (req, res) => {
        const langs = [
          { name: 'JavaScript', year: 1995, creator: 'Brendan Eich', typing: 'Dynamic / Weak', extension: '.js' },
          { name: 'TypeScript', year: 2012, creator: 'Anders Hejlsberg (Microsoft)', typing: 'Static / Structural', extension: '.ts' },
          { name: 'Python', year: 1991, creator: 'Guido van Rossum', typing: 'Dynamic / Strong', extension: '.py' },
          { name: 'Rust', year: 2010, creator: 'Graydon Hoare / Mozilla', typing: 'Static / Strong / Ownership', extension: '.rs' },
          { name: 'Go', year: 2009, creator: 'Robert Griesemer, Rob Pike, Ken Thompson', typing: 'Static / Strong', extension: '.go' }
        ];
        const q = (req.query.lang || '').toLowerCase();
        const filtered = !q ? langs : langs.filter(l => l.name.toLowerCase().includes(q));
        res.json({ status: true, data: filtered.length ? filtered : langs });
      }
    },
    {
      name: 'Linux Commands Cheatsheet',
      path: '/api/s/linux-commands',
      method: 'GET',
      description: 'Busca comandos esenciales de terminal Linux con banderas y ejemplos reales.',
      responseType: 'json',
      params: [
        { name: 'command', type: 'string', required: false, example: 'grep', description: 'Comando Linux (grep, find, chmod, tar, curl, ps)' }
      ],
      handler: async (req, res) => {
        const cmds = [
          { command: 'grep', description: 'Busca patrones de texto dentro de archivos.', example: 'grep -rn "router" src/' },
          { command: 'find', description: 'Busca archivos y directorios por nombre, tamaño o fecha.', example: 'find . -name "*.js" -type f' },
          { command: 'chmod', description: 'Cambia los permisos de lectura, escritura y ejecución.', example: 'chmod +x deploy.sh' },
          { command: 'tar', description: 'Empaqueta y comprime archivos en .tar.gz.', example: 'tar -czvf backup.tar.gz ./public' },
          { command: 'lsof', description: 'Muestra qué proceso está escuchando en un puerto determinado.', example: 'lsof -i :3000' }
        ];
        const q = (req.query.command || '').toLowerCase();
        const found = !q ? cmds : cmds.filter(c => c.command.includes(q) || c.description.toLowerCase().includes(q));
        res.json({ status: true, data: found.length ? found : cmds });
      }
    },
    {
      name: 'Git Cheatsheet Search',
      path: '/api/s/git-cheatsheet',
      method: 'GET',
      description: 'Encuentra el comando exacto de Git para deshacer commits, cambiar ramas o gestionar stashes.',
      responseType: 'json',
      params: [
        { name: 'query', type: 'string', required: false, example: 'reset', description: 'Palabra clave (reset, stash, branch, rebase)' }
      ],
      handler: async (req, res) => {
        const gitCmds = [
          { action: 'Deshacer el último commit conservando los cambios', command: 'git reset --soft HEAD~1' },
          { action: 'Guardar cambios temporalmente sin hacer commit', command: 'git stash push -m "wip"' },
          { action: 'Crear una nueva rama y cambiar a ella', command: 'git checkout -b feature/nueva-api' },
          { action: 'Ver el historial compacto en gráfico', command: 'git log --oneline --graph --decorate --all' }
        ];
        const q = (req.query.query || '').toLowerCase();
        const found = !q ? gitCmds : gitCmds.filter(g => g.action.toLowerCase().includes(q) || g.command.toLowerCase().includes(q));
        res.json({ status: true, data: found.length ? found : gitCmds });
      }
    },
    {
      name: 'Network Ports Dictionary (TCP/UDP)',
      path: '/api/s/ports',
      method: 'GET',
      description: 'Consulta qué servicio o protocolo estándar utiliza un puerto de red determinado.',
      responseType: 'json',
      params: [
        { name: 'port', type: 'number', required: false, example: '443', description: 'Número de puerto (22, 53, 80, 443, 3306, 5432, 6379, 27017)' }
      ],
      handler: async (req, res) => {
        const ports = {
          21: { port: 21, protocol: 'TCP', service: 'FTP', description: 'File Transfer Protocol' },
          22: { port: 22, protocol: 'TCP', service: 'SSH', description: 'Secure Shell Remote Login' },
          53: { port: 53, protocol: 'TCP/UDP', service: 'DNS', description: 'Domain Name System' },
          80: { port: 80, protocol: 'TCP', service: 'HTTP', description: 'Hypertext Transfer Protocol' },
          443: { port: 443, protocol: 'TCP', service: 'HTTPS', description: 'HTTP over TLS/SSL' },
          3000: { port: 3000, protocol: 'TCP', service: 'Node.js / Dev Server', description: 'Puerto por defecto de aplicaciones Node/Express y React' },
          3306: { port: 3306, protocol: 'TCP', service: 'MySQL / MariaDB', description: 'Base de datos relacional MySQL' },
          5432: { port: 5432, protocol: 'TCP', service: 'PostgreSQL', description: 'Base de datos relacional PostgreSQL' },
          6379: { port: 6379, protocol: 'TCP', service: 'Redis', description: 'Almacén de datos en memoria Redis' },
          27017: { port: 27017, protocol: 'TCP', service: 'MongoDB', description: 'Base de datos NoSQL MongoDB' }
        };
        const p = parseInt(req.query.port || '0', 10);
        res.json({ status: true, data: p && ports[p] ? ports[p] : Object.values(ports) });
      }
    }
  ]
};
