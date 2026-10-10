/**
 * Categoría: INFO (2 endpoints)
 * Datos calculados localmente y verificables: hora mundial y fase lunar.
 */

module.exports = {
  category: 'INFO',
  description: 'Hora mundial con timestamps Unix y fase lunar calculada astronómicamente.',
  endpoints: [
    {
      name: 'World Time & Unix',
      path: '/api/info/world-time',
      method: 'GET',
      description: 'Hora UTC, timestamps Unix y hora local en varias zonas horarias.',
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
              montevideo: now.toLocaleString('es-UY', { timeZone: 'America/Montevideo' }),
              madrid: now.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }),
              mexico: now.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
              new_york: now.toLocaleString('en-US', { timeZone: 'America/New_York' }),
              tokyo: now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
            }
          }
        });
      }
    },
    {
      name: 'Moon Phase',
      path: '/api/info/moon-phase',
      method: 'GET',
      description: 'Fase lunar aproximada y edad lunar en días para una fecha dada (cálculo astronómico simple).',
      responseType: 'json',
      params: [
        { name: 'date', type: 'string', required: false, example: '2026-10-10', description: 'Fecha YYYY-MM-DD (opcional)' }
      ],
      handler: async (req, res) => {
        const target = req.query.date ? new Date(req.query.date) : new Date();
        if (isNaN(target.getTime())) return res.status(400).json({ status: false, error: 'Fecha inválida. Usa YYYY-MM-DD.' });
        const SYNODIC_MONTH_S = 2551443;
        const newMoonRef = new Date('2025-01-29T12:36:00Z');
        const phaseSec = ((target.getTime() - newMoonRef.getTime()) / 1000) % SYNODIC_MONTH_S;
        const ageDays = Math.abs(phaseSec / 86400);

        let phase = 'Luna Nueva';
        if (ageDays > 1.8 && ageDays <= 5.5) phase = 'Luna Creciente';
        else if (ageDays > 5.5 && ageDays <= 9.2) phase = 'Cuarto Creciente';
        else if (ageDays > 9.2 && ageDays <= 12.9) phase = 'Gibosa Creciente';
        else if (ageDays > 12.9 && ageDays <= 16.6) phase = 'Luna Llena';
        else if (ageDays > 16.6 && ageDays <= 20.3) phase = 'Gibosa Menguante';
        else if (ageDays > 20.3 && ageDays <= 24.0) phase = 'Cuarto Menguante';
        else if (ageDays > 24.0) phase = 'Luna Menguante';

        const illumination = Math.round((1 - Math.cos((2 * Math.PI * ageDays) / 29.53)) / 2 * 100);

        res.json({
          status: true,
          data: {
            date: target.toISOString().split('T')[0],
            lunar_age_days: Number(ageDays.toFixed(1)),
            phase,
            illumination_percent: illumination
          }
        });
      }
    }
  ]
};
