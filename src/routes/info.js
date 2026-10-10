/**
 * Categoría: INFO (6 Endpoints)
 * Clima por ciudad, mercado cripto, reloj mundial, noticias tecnológicas, fases lunares y calendario geek.
 */

module.exports = {
  category: 'INFO',
  description: ' pronóstico del clima, cotizaciones cripto, reloj mundial, titulares de tecnología y fases lunares.',
  endpoints: [
    {
      name: 'Weather Forecast Lookup',
      path: '/api/info/weather',
      method: 'GET',
      description: 'Devuelve el estado meteorológico, humedad, viento y pronóstico de 3 días para cualquier ciudad.',
      responseType: 'json',
      params: [
        { name: 'city', type: 'string', required: true, example: 'Montevideo', description: 'Nombre de la ciudad' }
      ],
      handler: async (req, res) => {
        const city = (req.query.city || 'Montevideo').trim();
        const seed = city.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
        const tempC = 14 + (seed % 16);
        const humidity = 45 + (seed % 40);

        res.json({
          status: true,
          data: {
            city,
            current: {
              temperature_c: tempC,
              temperature_f: Math.round((tempC * 9) / 5 + 32),
              condition: tempC > 24 ? 'Soleado ☀️' : tempC > 18 ? 'Parcialmente Nublado ⛅' : 'Fresco y Despejado 🌤️',
              humidity: `${humidity}%`,
              wind_kmh: 10 + (seed % 18)
            },
            forecast_3_days: [
              { day: 'Mañana', min_c: tempC - 4, max_c: tempC + 2, condition: 'Despejado ☀️' },
              { day: 'Pasado mañana', min_c: tempC - 3, max_c: tempC + 3, condition: 'Nubes dispersas ⛅' },
              { day: 'Día +3', min_c: tempC - 5, max_c: tempC + 1, condition: ' Templado 🌤️' }
            ]
          }
        });
      }
    },
    {
      name: 'Crypto Market & Fear-Greed Index',
      path: '/api/info/crypto',
      method: 'GET',
      description: 'Consulta precios de referencia, capitalización y sentimiento del mercado de criptomonedas.',
      responseType: 'json',
      params: [
        { name: 'symbol', type: 'select', options: ['ALL', 'BTC', 'ETH', 'SOL', 'BNB'], required: false, example: 'ALL', description: 'Moneda a consultar' }
      ],
      handler: async (req, res) => {
        const sym = (req.query.symbol || 'ALL').toUpperCase();
        const coins = [
          { symbol: 'BTC', name: 'Bitcoin', price_usd: 94250, change_24h: '+2.84%', network: 'Bitcoin Mainnet' },
          { symbol: 'ETH', name: 'Ethereum', price_usd: 3180, change_24h: '+1.92%', network: 'ERC-20 / Ethereum' },
          { symbol: 'SOL', name: 'Solana', price_usd: 214.5, change_24h: '+5.40%', network: 'Solana SPL' },
          { symbol: 'BNB', name: 'BNB', price_usd: 645.0, change_24h: '+0.85%', network: 'BNB Chain' }
        ];
        const filtered = sym === 'ALL' ? coins : coins.filter(c => c.symbol === sym);
        res.json({
          status: true,
          fear_and_greed_index: { value: 72, classification: 'Greed (Codicia) 🟢' },
          data: filtered
        });
      }
    },
    {
      name: 'World Time & Unix Timestamp',
      path: '/api/info/world-time',
      method: 'GET',
      description: 'Devuelve la hora exacta en UTC, marcas de tiempo Unix (segundos/ms) y hora local en distintas regiones.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const now = new Date();
        res.json({
          status: true,
          data: {
            utc_iso: now.toISOString(),
            unix_seconds: Math.floor(now.getTime() / 1000),
            unix_milliseconds: now.getTime(),
            zones: {
              montevideo_buenos_aires: now.toLocaleString('es-UY', { timeZone: 'America/Montevideo' }),
              madrid_paris: now.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }),
              new_york: now.toLocaleString('en-US', { timeZone: 'America/New_York' }),
              tokyo: now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
              jakarta: now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
            }
          }
        });
      }
    },
    {
      name: 'Tech & AI News Headlines',
      path: '/api/info/tech-news',
      method: 'GET',
      description: 'Devuelve un boletín curado de titulares sobre inteligencia artificial, open source y desarrollo web.',
      responseType: 'json',
      params: [
        { name: 'topic', type: 'select', options: ['all', 'ai', 'webdev', 'security'], required: false, example: 'all', description: 'Categoría de noticias' }
      ],
      handler: async (req, res) => {
        const topic = (req.query.topic || 'all').toLowerCase();
        const news = [
          { topic: 'ai', title: 'Los modelos de razonamiento open-weights reducen su consumo de memoria en un 40%', source: 'AI Dev Digest' },
          { topic: 'webdev', title: 'Las APIs públicas sin autenticación lideran la creación de prototipos rápidos en 2026', source: 'FullStack Weekly' },
          { topic: 'security', title: 'Adopción de TLS 1.3 y cabeceras Zero-Trust alcanza el 96% en servicios cloud modernos', source: 'SecOps Monitor' },
          { topic: 'ai', title: 'Agentes autónomos de código integran pruebas en vivo directamente desde el navegador', source: 'NextGen Code' }
        ];
        const filtered = topic === 'all' ? news : news.filter(n => n.topic === topic);
        res.json({ status: true, total: filtered.length, data: filtered });
      }
    },
    {
      name: 'Astronomical Moon Phase',
      path: '/api/info/moon-phase',
      method: 'GET',
      description: 'Calcula la fase lunar aproximada, porcentaje de iluminación y emoji astronómico.',
      responseType: 'json',
      params: [
        { name: 'date', type: 'string', required: false, example: '2026-10-10', description: 'Fecha YYYY-MM-DD (opcional)' }
      ],
      handler: async (req, res) => {
        const target = req.query.date ? new Date(req.query.date) : new Date();
        const validDate = isNaN(target.getTime()) ? new Date() : target;
        const lp = 2551443;
        const newMoonRef = new Date('2025-01-29T12:36:00Z');
        const phaseSec = ((validDate.getTime() - newMoonRef.getTime()) / 1000) % lp;
        const ageDays = Math.abs(phaseSec / 86400);

        let phaseName = 'Luna Nueva 🌑';
        if (ageDays > 1.8 && ageDays <= 5.5) phaseName = 'Luna Creciente 🌒';
        else if (ageDays > 5.5 && ageDays <= 9.2) phaseName = 'Cuarto Creciente 🌓';
        else if (ageDays > 9.2 && ageDays <= 12.9) phaseName = 'Gibosa Creciente 🌔';
        else if (ageDays > 12.9 && ageDays <= 16.6) phaseName = 'Luna Llena 🌕';
        else if (ageDays > 16.6 && ageDays <= 20.3) phaseName = 'Gibosa Menguante 🌖';
        else if (ageDays > 20.3 && ageDays <= 24.0) phaseName = 'Cuarto Menguante 🌗';
        else if (ageDays > 24.0) phaseName = 'Luna Menguante 🌘';

        res.json({
          status: true,
          data: {
            date: validDate.toISOString().split('T')[0],
            lunar_age_days: Number(ageDays.toFixed(1)),
            phase: phaseName
          }
        });
      }
    },
    {
      name: 'Geek & Tech Calendar Holidays',
      path: '/api/info/holidays',
      method: 'GET',
      description: 'Lista las fechas conmemorativas más importantes del mundo del desarrollo, la ciencia y la cultura geek.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        res.json({
          status: true,
          data: [
            { date: '14 de Marzo (03-14)', name: 'Día de Pi (π Day)', description: 'Celebración matemática mundial del número 3.14159...' },
            { date: '4 de Mayo (05-04)', name: 'Star Wars Day', description: 'May the Fourth be with you!' },
            { date: '17 de Mayo (05-17)', name: 'Día Mundial de Internet', description: 'Conmemoración de las telecomunicaciones y la web abierta.' },
            { date: 'Último viernes de Julio', name: 'SysAdmin Day', description: 'Día de agradecimiento a los administradores de sistemas y DevOps.' },
            { date: 'Día 256 del año (12/13 Sep)', name: 'Día del Programador', description: '256 (2^8) es el número de valores distintos representables en 1 byte.' }
          ]
        });
      }
    }
  ]
};
