/**
 * Categoría: SEARCH
 * Motores de consulta para países, códigos HTTP y datos científicos.
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
  { name: 'United States', code: 'US', capital: 'Washington, D.C.', currency: 'USD ($)', dial_code: '+1', region: 'North America', flag: '🇺🇸', population: '334.9M', timezone: 'UTC-5 to UTC-10' }
];

const HTTP_CODES = {
  200: { status: 200, name: 'OK', category: '2xx Success', description: 'La solicitud ha tenido éxito.' },
  201: { status: 201, name: 'Created', category: '2xx Success', description: 'La solicitud ha tenido éxito y se ha creado un nuevo recurso.' },
  301: { status: 301, name: 'Moved Permanently', category: '3xx Redirection', description: 'La URL del recurso solicitado ha cambiado de forma permanente.' },
  400: { status: 400, name: 'Bad Request', category: '4xx Client Error', description: 'El servidor no pudo interpretar la solicitud debido a una sintaxis inválida o parámetros faltantes.' },
  401: { status: 401, name: 'Unauthorized', category: '4xx Client Error', description: 'Es necesario autenticar para obtener la respuesta solicitada.' },
  403: { status: 403, name: 'Forbidden', category: '4xx Client Error', description: 'El cliente no posee los permisos necesarios para cierto contenido.' },
  404: { status: 404, name: 'Not Found', category: '4xx Client Error', description: 'El servidor no pudo encontrar el contenido solicitado.' },
  429: { status: 429, name: 'Too Many Requests', category: '4xx Client Error', description: 'El usuario ha enviado demasiadas solicitudes en un periodo de tiempo ("rate limiting").' },
  500: { status: 500, name: 'Internal Server Error', category: '5xx Server Error', description: 'El servidor ha encontrado una situación que no sabe cómo manejar.' },
  502: { status: 502, name: 'Bad Gateway', category: '5xx Server Error', description: 'El servidor obtuvo una respuesta inválida mientras trabajaba como puerta de enlace.' }
};

module.exports = {
  category: 'SEARCH',
  description: 'Consultas rápidas de información geográfica, países, códigos HTTP y referencias técnicas.',
  endpoints: [
    {
      name: 'Country Info Lookup',
      path: '/api/s/country',
      method: 'GET',
      description: 'Busca datos detallados de un país: capital, moneda, código telefónico, bandera y zona horaria.',
      responseType: 'json',
      params: [
        { name: 'query', type: 'string', required: false, example: 'Uruguay', description: 'Nombre del país o código ISO (ej: UY, AR, MX, ES)' }
      ],
      handler: async (req, res) => {
        const q = (req.query.query || '').trim().toLowerCase();
        const matches = !q
          ? COUNTRIES
          : COUNTRIES.filter(c =>
              c.name.toLowerCase().includes(q) ||
              c.code.toLowerCase() === q ||
              c.capital.toLowerCase().includes(q)
            );

        res.json({
          status: true,
          total: matches.length,
          data: matches
        });
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
        if (code && HTTP_CODES[code]) {
          return res.json({
            status: true,
            data: HTTP_CODES[code]
          });
        }

        res.json({
          status: true,
          data: Object.values(HTTP_CODES)
        });
      }
    }
  ]
};
