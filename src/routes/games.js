/**
 * Categoría: GAMES (12 Endpoints)
 * Juegos listos para bots de Discord/WhatsApp/Telegram y apps web.
 */

const TRIVIA_LIST = [
  { category: 'tech', difficulty: 'easy', question: '¿Qué código de estado HTTP indica que una petición fue exitosa?', options: ['200 OK', '404 Not Found', '500 Internal Server Error', '301 Moved'], answer: '200 OK' },
  { category: 'tech', difficulty: 'medium', question: '¿Quién creó originalmente el kernel de Linux en 1991?', options: ['Linus Torvalds', 'Richard Stallman', 'Ken Thompson', 'Dennis Ritchie'], answer: 'Linus Torvalds' },
  { category: 'science', difficulty: 'easy', question: '¿Cuál es el planeta más grande del Sistema Solar?', options: ['Júpiter', 'Saturno', 'Neptuno', 'Urano'], answer: 'Júpiter' },
  { category: 'gaming', difficulty: 'easy', question: '¿En qué año se lanzó oficialmente Minecraft 1.0?', options: ['2011', '2008', '2014', '2016'], answer: '2011' }
];

const RIDDLES = [
  { riddle: 'Tengo ciudades, pero no casas. Tengo montañas, pero no árboles. Tengo agua, pero no peces. ¿Qué soy?', hint: 'Se usa para orientarse.', answer: 'Un mapa' },
  { riddle: 'Cuanto más me quitas, más grande me vuelvo. ¿Qué soy?', hint: 'Piensa en excavar.', answer: 'Un agujero' },
  { riddle: 'Hablo sin boca y oigo sin oídos. No tengo cuerpo, pero cobro vida con el viento. ¿Qué soy?', hint: 'Ocurre en montañas.', answer: 'El eco' }
];

const FLAGS = [
  { flag: '🇺🇾', country: 'Uruguay', capital: 'Montevideo', continent: 'América del Sur', hint: 'Tiene un Sol de Mayo y nueve franjas.' },
  { flag: '🇦🇷', country: 'Argentina', capital: 'Buenos Aires', continent: 'América del Sur', hint: 'Tierra del tango, el mate y los Andes.' },
  { flag: '🇯🇵', country: 'Japón', capital: 'Tokio', continent: 'Asia', hint: 'Conocido como la Tierra del Sol Naciente.' },
  { flag: '🇲🇽', country: 'México', capital: 'Ciudad de México', continent: 'América del Norte', hint: 'Tiene un águila real sobre un nopal.' },
  { flag: '🇪🇸', country: 'España', capital: 'Madrid', continent: 'Europa', hint: 'País de la península ibérica.' },
  { flag: '🇧🇷', country: 'Brasil', capital: 'Brasilia', continent: 'América del Sur', hint: 'Incluye el lema "Ordem e Progresso".' }
];

module.exports = {
  category: 'GAMES',
  description: 'Juegos interactivos, trivia, acertijos, verdad o reto, ahorcado, películas con emojis y química.',
  endpoints: [
    {
      name: 'Trivia Challenge',
      path: '/api/games/trivia',
      method: 'GET',
      description: 'Genera una pregunta de trivia con opciones múltiples y respuesta.',
      responseType: 'json',
      params: [
        { name: 'category', type: 'select', options: ['all', 'tech', 'science', 'gaming'], required: false, example: 'all', description: 'Categoría' }
      ],
      handler: async (req, res) => {
        const cat = (req.query.category || 'all').toLowerCase();
        const pool = cat === 'all' ? TRIVIA_LIST : TRIVIA_LIST.filter(t => t.category === cat);
        const list = pool.length ? pool : TRIVIA_LIST;
        res.json({ status: true, data: list[Math.floor(Math.random() * list.length)] });
      }
    },
    {
      name: 'Riddle / Acertijo',
      path: '/api/games/riddle',
      method: 'GET',
      description: 'Devuelve un acertijo lógico con pista y respuesta.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        res.json({ status: true, data: RIDDLES[Math.floor(Math.random() * RIDDLES.length)] });
      }
    },
    {
      name: 'Word Scramble (Palabra Desordenada)',
      path: '/api/games/word-scramble',
      method: 'GET',
      description: 'Devuelve una palabra con las letras mezcladas, su pista y la respuesta original.',
      responseType: 'json',
      params: [
        { name: 'topic', type: 'select', options: ['programming', 'space', 'animals'], required: false, example: 'programming', description: 'Temática' }
      ],
      handler: async (req, res) => {
        const topic = req.query.topic || 'programming';
        const wordsByTopic = {
          programming: [
            { word: 'ALGORITMO', hint: 'Conjunto ordenado de pasos para resolver un problema.' },
            { word: 'ENDPOINT', hint: 'URL específica donde una API recibe peticiones.' },
            { word: 'JAVASCRIPT', hint: 'Lenguaje de programación estándar de la web.' }
          ],
          space: [
            { word: 'SUPERNOVA', hint: 'Explosión estelar extremadamente luminosa.' },
            { word: 'NEBULOSA', hint: 'Nube gigante de polvo y gas en el espacio.' }
          ],
          animals: [
            { word: 'GUEPARDO', hint: 'El mamífero terrestre más veloz del planeta.' },
            { word: 'AJOLOTE', hint: 'Anfibio famoso por su regeneración.' }
          ]
        };
        const pool = wordsByTopic[topic] || wordsByTopic.programming;
        const chosen = pool[Math.floor(Math.random() * pool.length)];
        const scrambled = chosen.word.split('').sort(() => Math.random() - 0.5).join('');
        res.json({
          status: true,
          data: {
            topic,
            scrambled: scrambled === chosen.word ? chosen.word.split('').reverse().join('') : scrambled,
            original: chosen.word,
            hint: chosen.hint
          }
        });
      }
    },
    {
      name: 'Math Speed Challenge',
      path: '/api/games/math-challenge',
      method: 'GET',
      description: 'Genera una operación matemática aleatoria con límite de tiempo y resultado.',
      responseType: 'json',
      params: [
        { name: 'difficulty', type: 'select', options: ['easy', 'medium', 'hard'], required: false, example: 'medium', description: 'Dificultad' }
      ],
      handler: async (req, res) => {
        const diff = req.query.difficulty || 'medium';
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 12) + 3;
        const c = Math.floor(Math.random() * 25) + 8;
        const expression = diff === 'easy' ? `${a} + ${b}` : diff === 'hard' ? `(${a} × ${b}) + ${c}` : `${a} × ${b}`;
        const answer = diff === 'easy' ? a + b : diff === 'hard' ? a * b + c : a * b;
        res.json({ status: true, data: { difficulty: diff, expression, answer, time_limit_seconds: 15 } });
      }
    },
    {
      name: 'Guess The Flag (Adivina la Bandera)',
      path: '/api/games/flag-quiz',
      method: 'GET',
      description: 'Devuelve una bandera con pistas geográficas, capital y continente.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        res.json({ status: true, data: FLAGS[Math.floor(Math.random() * FLAGS.length)] });
      }
    },
    {
      name: 'Truth or Dare (Verdad o Reto)',
      path: '/api/games/truth-or-dare',
      method: 'GET',
      description: 'Genera preguntas de Verdad o desafíos de Reto para juegos grupales y bots.',
      responseType: 'json',
      params: [
        { name: 'type', type: 'select', options: ['random', 'truth', 'dare'], required: false, example: 'random', description: 'Verdad, Reto o Aleatorio' }
      ],
      handler: async (req, res) => {
        const truths = [
          '¿Cuál es el bug más vergonzoso que has subido a producción?',
          '¿Alguna vez copiaste código sin entender cómo funcionaba y rezaste para que compilara?',
          '¿Cuál es tu proyecto secreto que empezaste con entusiasmo y nunca terminaste?'
        ];
        const dares = [
          'Escribe tu próxima función completa sin usar el autocompletado ni buscar en Google.',
          'Envía un sticker aleatorio en el grupo general sin dar contexto.',
          'Habla como si fueras una documentación técnica durante los próximos 2 minutos.'
        ];
        let type = (req.query.type || 'random').toLowerCase();
        if (type === 'random') type = Math.random() > 0.5 ? 'truth' : 'dare';
        const pool = type === 'dare' ? dares : truths;
        res.json({
          status: true,
          data: {
            type: type.toUpperCase(),
            prompt: pool[Math.floor(Math.random() * pool.length)]
          }
        });
      }
    },
    {
      name: 'Would You Rather (¿Qué Preferirías?)',
      path: '/api/games/would-you-rather',
      method: 'GET',
      description: 'Devuelve un dilema con dos opciones difíciles y los porcentajes de votación.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const dilemmas = [
          { optionA: 'Programar solo en Assembly durante 1 año con sueldo doble', optionB: 'Tener que usar Internet Explorer 6 para navegar el resto de tu vida', votesA_percent: 68, votesB_percent: 32 },
          { optionA: 'Tener latencia de 0ms en todo pero batería de 2 horas', optionB: 'Batería infinita pero descarga máxima de 5 Mbps', votesA_percent: 54, votesB_percent: 46 },
          { optionA: 'Viajar 100 años al futuro', optionB: 'Viajar 100 años al pasado con todo tu conocimiento actual', votesA_percent: 61, votesB_percent: 39 }
        ];
        res.json({ status: true, data: dilemmas[Math.floor(Math.random() * dilemmas.length)] });
      }
    },
    {
      name: 'Hangman Game Generator (Ahorcado)',
      path: '/api/games/hangman',
      method: 'GET',
      description: 'Genera una palabra oculta con guiones bajos, vocales reveladas iniciales y pista.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const items = [
          { word: 'MICROSERVICIOS', category: 'Arquitectura de Software', hint: 'Dividir una aplicación monolítica en servicios pequeños e independientes.' },
          { word: 'CIBERSEGURIDAD', category: 'Tecnología', hint: 'Práctica de proteger sistemas, redes y programas de ataques digitales.' },
          { word: 'INTELIGENCIA', category: 'IA', hint: 'Capacidad de aprender, razonar y resolver problemas.' }
        ];
        const chosen = items[Math.floor(Math.random() * items.length)];
        const masked = chosen.word.split('').map((c, i) => (i === 0 || i === chosen.word.length - 1 ? c : '_')).join(' ');
        res.json({
          status: true,
          data: {
            masked_word: masked,
            answer: chosen.word,
            length: chosen.word.length,
            category: chosen.category,
            hint: chosen.hint,
            max_attempts: 6
          }
        });
      }
    },
    {
      name: 'Guess Movie by Emojis',
      path: '/api/games/emoji-movie',
      method: 'GET',
      description: 'Adivina la película o serie famosa representada únicamente con emojis.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const movies = [
          { emojis: '🦁👑🌅', title: 'El Rey León (The Lion King)', year: 1994, hint: 'Hakuna Matata' },
          { emojis: '🚢🧊💑🌊', title: 'Titanic', year: 1997, hint: 'Un transatlántico insumergible en el Atlántico Norte.' },
          { emojis: '🕷️🧑🏙️🕸️', title: 'Spider-Man', year: 2002, hint: 'Un gran poder conlleva una gran responsabilidad.' },
          { emojis: '💊🕶️💻🐇', title: 'The Matrix', year: 1999, hint: '¿Píldora roja o píldora azul?' },
          { emojis: '🦖🏝️🧬🚙', title: 'Jurassic Park', year: 1993, hint: 'Dinosaurios clonados en la Isla Nublar.' }
        ];
        res.json({ status: true, data: movies[Math.floor(Math.random() * movies.length)] });
      }
    },
    {
      name: 'World Capital Quiz',
      path: '/api/games/capital-quiz',
      method: 'GET',
      description: 'Pregunta de opción múltiple para adivinar la capital de un país.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const questions = [
          { country: 'Uruguay 🇺🇾', options: ['Montevideo', 'Punta del Este', 'Salto', 'Colonia'], answer: 'Montevideo' },
          { country: 'Canadá 🇨🇦', options: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal'], answer: 'Ottawa' },
          { country: 'Australia 🇦🇺', options: ['Canberra', 'Sídney', 'Melbourne', 'Perth'], answer: 'Canberra' },
          { country: 'Suiza 🇨🇭', options: ['Berna', 'Zúrich', 'Ginebra', 'Basilea'], answer: 'Berna' }
        ];
        res.json({ status: true, data: questions[Math.floor(Math.random() * questions.length)] });
      }
    },
    {
      name: 'Chemistry Element Quiz (Tebak Kimia)',
      path: '/api/games/chemistry-quiz',
      method: 'GET',
      description: 'Adivina a qué elemento químico pertenece el símbolo y número atómico.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const elements = [
          { symbol: 'Au', atomic_number: 79, answer: 'Oro (Gold)', group: 'Metales de transición' },
          { symbol: 'Ag', atomic_number: 47, answer: 'Plata (Silver)', group: 'Metales de transición' },
          { symbol: 'Fe', atomic_number: 26, answer: 'Hierro (Iron)', group: 'Metales de transición' },
          { symbol: 'Na', atomic_number: 11, answer: 'Sodio (Sodium)', group: 'Metales alcalinos' },
          { symbol: 'K', atomic_number: 19, answer: 'Potasio (Potassium)', group: 'Metales alcalinos' },
          { symbol: 'W', atomic_number: 74, answer: 'Wolframio / Tungsteno', group: 'Metales de transición' }
        ];
        res.json({ status: true, data: elements[Math.floor(Math.random() * elements.length)] });
      }
    },
    {
      name: 'Rock Paper Scissors vs CPU',
      path: '/api/games/rps',
      method: 'GET',
      description: 'Juega Piedra, Papel o Tijera contra el servidor y obtén el resultado al instante.',
      responseType: 'json',
      params: [
        { name: 'choice', type: 'select', options: ['rock', 'paper', 'scissors'], required: true, example: 'rock', description: 'Tu jugada' }
      ],
      handler: async (req, res) => {
        const choices = ['rock', 'paper', 'scissors'];
        const user = (req.query.choice || 'rock').toLowerCase();
        const cpu = choices[Math.floor(Math.random() * choices.length)];
        let outcome = 'DRAW';
        if (
          (user === 'rock' && cpu === 'scissors') ||
          (user === 'paper' && cpu === 'rock') ||
          (user === 'scissors' && cpu === 'paper')
        ) {
          outcome = 'WIN';
        } else if (user !== cpu) {
          outcome = 'LOSE';
        }
        res.json({ status: true, data: { player_choice: user, cpu_choice: cpu, result: outcome } });
      }
    }
  ]
};
