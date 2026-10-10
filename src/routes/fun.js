/**
 * Categoría: FUN (6 Endpoints)
 * Horóscopo y Zodiaco, Numerología de nombres, Calculadora de compatibilidad, Bola 8 Mágica, Galleta de la Fortuna y Roasts.
 */

module.exports = {
  category: 'FUN',
  description: 'Zodiaco, significado numerológico de nombres, compatibilidad, Bola 8 Mágica, fortuna y humor.',
  endpoints: [
    {
      name: 'Zodiac Daily Horoscope',
      path: '/api/fun/zodiac',
      method: 'GET',
      description: 'Devuelve la predicción diaria, elemento, planeta regente y número de la suerte de un signo zodiacal.',
      responseType: 'json',
      params: [
        {
          name: 'sign',
          type: 'select',
          options: ['aries', 'tauro', 'geminis', 'cancer', 'leo', 'virgo', 'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis'],
          required: false,
          example: 'libra',
          description: 'Signo del zodiaco'
        }
      ],
      handler: async (req, res) => {
        const sign = (req.query.sign || 'libra').toLowerCase();
        const signs = {
          aries: { element: 'Fuego 🔥', ruler: 'Marte', lucky_number: 9 },
          tauro: { element: 'Tierra 🌍', ruler: 'Venus', lucky_number: 6 },
          geminis: { element: 'Aire 💨', ruler: 'Mercurio', lucky_number: 5 },
          cancer: { element: 'Agua 💧', ruler: 'Luna', lucky_number: 2 },
          leo: { element: 'Fuego 🔥', ruler: 'Sol', lucky_number: 1 },
          virgo: { element: 'Tierra 🌍', ruler: 'Mercurio', lucky_number: 14 },
          libra: { element: 'Aire 💨', ruler: 'Venus', lucky_number: 7 },
          escorpio: { element: 'Agua 💧', ruler: 'Plutón / Marte', lucky_number: 8 },
          sagitario: { element: 'Fuego 🔥', ruler: 'Júpiter', lucky_number: 3 },
          capricornio: { element: 'Tierra 🌍', ruler: 'Saturno', lucky_number: 4 },
          acuario: { element: 'Aire 💨', ruler: 'Urano', lucky_number: 11 },
          piscis: { element: 'Agua 💧', ruler: 'Neptuno', lucky_number: 12 }
        };
        const info = signs[sign] || signs.libra;
        res.json({
          status: true,
          data: {
            sign: sign.toUpperCase(),
            ...info,
            daily_prediction: 'Hoy es un día excelente para lanzar nuevas ideas, resolver problemas pendientes y colaborar con personas creativas.'
          }
        });
      }
    },
    {
      name: 'Name Numerology & Meaning',
      path: '/api/fun/name-meaning',
      method: 'GET',
      description: 'Calcula el número de expresión numerológica y rasgos de personalidad asociados a un nombre.',
      responseType: 'json',
      params: [
        { name: 'name', type: 'string', required: true, example: 'Lyan', description: 'Nombre a analizar' }
      ],
      handler: async (req, res) => {
        const name = (req.query.name || 'Lyan').trim();
        const sum = name.toUpperCase().split('').reduce((acc, ch) => acc + (ch.charCodeAt(0) % 9) + 1, 0);
        const destinyNumber = (sum % 9) + 1;
        const traits = [
          'Liderazgo e iniciativa',
          'Diplomacia y armonía',
          'Creatividad y expresión',
          'Estructura y determinación',
          'Aventura y versatilidad',
          'Lealtad y protección',
          'Análisis profundo y sabiduría',
          'Visión estratégica y éxito',
          'Idealismo e inspiración'
        ];
        res.json({
          status: true,
          data: {
            name,
            destiny_number: destinyNumber,
            dominant_trait: traits[destinyNumber - 1],
            vibe_score: '98/100'
          }
        });
      }
    },
    {
      name: 'Love & Friendship Compatibility',
      path: '/api/fun/love-calculator',
      method: 'GET',
      description: 'Calcula la afinidad determinista entre dos nombres con mensaje de diagnóstico.',
      responseType: 'json',
      params: [
        { name: 'name1', type: 'string', required: true, example: 'Lyan', description: 'Primer nombre' },
        { name: 'name2', type: 'string', required: true, example: 'Valentin', description: 'Segundo nombre' }
      ],
      handler: async (req, res) => {
        const n1 = (req.query.name1 || 'Alpha').trim();
        const n2 = (req.query.name2 || 'Omega').trim();
        const combined = (n1 + n2).toLowerCase();
        let hash = 0;
        for (let i = 0; i < combined.length; i++) hash = (hash * 31 + combined.charCodeAt(i)) % 101;
        const score = Math.max(55, hash);

        res.json({
          status: true,
          data: {
            name1: n1,
            name2: n2,
            compatibility_percent: `${score}%`,
            verdict: score > 85 ? '¡Conexión legendaria! 🔥' : score > 70 ? 'Gran química y equipo sólido ✨' : 'Buena base con potencial 👍'
          }
        });
      }
    },
    {
      name: 'Magic 8-Ball Oracle',
      path: '/api/fun/8ball',
      method: 'GET',
      description: 'Hazle una pregunta de sí o no a la Bola 8 Mágica y recibe su veredicto.',
      responseType: 'json',
      params: [
        { name: 'question', type: 'string', required: true, example: '¿Mi proyecto en Render tendrá miles de usuarios?', description: 'Tu pregunta' }
      ],
      handler: async (req, res) => {
        const question = (req.query.question || '¿Tendré éxito hoy?').trim();
        const answers = [
          'Es decididamente así. 🎱',
          'Sin lugar a dudas. 🚀',
          'Sí, definitivamente. ✨',
          'Las señales apuntan a que sí. 🟢',
          'Todo parece indicar que será un éxito. 🔥',
          'Concéntrate y vuelve a preguntar. 🔮'
        ];
        res.json({
          status: true,
          data: {
            question,
            answer: answers[Math.floor(Math.random() * answers.length)]
          }
        });
      }
    },
    {
      name: 'Digital Fortune Cookie',
      path: '/api/fun/fortune-cookie',
      method: 'GET',
      description: 'Abre una galleta de la fortuna digital con mensaje sabio y números de la suerte.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const fortunes = [
          'El código que escribas hoy ahorrará cientos de horas mañana.',
          'Una nueva oportunidad tocará a tu puerta cuando menos lo esperes.',
          'La simplicidad es la máxima sofisticación en el diseño y en la vida.',
          'Tu próximo despliegue en producción saldrá sin un solo error.'
        ];
        const luckyNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 48) + 1);
        res.json({
          status: true,
          data: {
            fortune: fortunes[Math.floor(Math.random() * fortunes.length)],
            lucky_numbers: luckyNumbers
          }
        });
      }
    },
    {
      name: 'Friendly Developer Roast',
      path: '/api/fun/roast',
      method: 'GET',
      description: 'Genera una broma amistosa estilo roast para desarrolladores o gamers.',
      responseType: 'json',
      params: [
        { name: 'target', type: 'string', required: false, example: 'Bro', description: 'Nombre del amigo o compañero' }
      ],
      handler: async (req, res) => {
        const target = (req.query.target || 'Bro').trim();
        const roasts = [
          `${target} usa tantos console.log() para depurar que la terminal parece los créditos de Star Wars.`,
          `El código de ${target} tiene más parches temporales que un servidor legacy de 1999.`,
          `${target} abre 47 pestañas de StackOverflow para centrar un div y aun así queda chueco.`,
          `${target} hace git push --force un viernes a las 6 de la tarde y apaga el celular.`
        ];
        res.json({
          status: true,
          data: {
            target,
            roast: roasts[Math.floor(Math.random() * roasts.length)]
          }
        });
      }
    }
  ]
};
