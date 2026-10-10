/**
 * Categoría: GAMES
 * Endpoints listos para bots de Discord/WhatsApp/Telegram o juegos web (Trivia, Acertijos, Anagramas, Banderas, Matemáticas).
 */

const TRIVIA_LIST = [
  {
    category: 'tech',
    difficulty: 'easy',
    question: '¿Qué código de estado HTTP indica que una petición fue exitosa?',
    options: ['200 OK', '404 Not Found', '500 Internal Server Error', '301 Moved Permanently'],
    answer: '200 OK',
    explanation: 'El código 200 OK es la respuesta estándar de HTTP para solicitudes exitosas.'
  },
  {
    category: 'tech',
    difficulty: 'medium',
    question: '¿Quién creó originalmente el kernel de Linux en 1991?',
    options: ['Linus Torvalds', 'Richard Stallman', 'Ken Thompson', 'Dennis Ritchie'],
    answer: 'Linus Torvalds',
    explanation: 'Linus Torvalds anunció la primera versión de Linux el 25 de agosto de 1991.'
  },
  {
    category: 'science',
    difficulty: 'easy',
    question: '¿Cuál es el planeta más grande del Sistema Solar?',
    options: ['Júpiter', 'Saturno', 'Neptuno', 'Urano'],
    answer: 'Júpiter',
    explanation: 'Júpiter tiene más del doble de la masa de todos los demás planetas combinados.'
  },
  {
    category: 'science',
    difficulty: 'medium',
    question: '¿Qué elemento químico tiene el símbolo "Au" en la tabla periódica?',
    options: ['Oro', 'Plata', 'Argón', 'Aluminio'],
    answer: 'Oro',
    explanation: 'Proviene del latín "Aurum", que significa aurora resplandeciente.'
  },
  {
    category: 'gaming',
    difficulty: 'easy',
    question: '¿En qué año se lanzó oficialmente Minecraft (versión 1.0)?',
    options: ['2011', '2008', '2014', '2016'],
    answer: '2011',
    explanation: 'Tras su fase Alpha/Beta desde 2009, la versión completa 1.0 se lanzó en noviembre de 2011.'
  }
];

const RIDDLES = [
  {
    riddle: 'Tengo ciudades, pero no casas. Tengo montañas, pero no árboles. Tengo agua, pero no peces. ¿Qué soy?',
    hint: 'Se usa para orientarse y viajar.',
    answer: 'Un mapa'
  },
  {
    riddle: 'Cuanto más me quitas, más grande me vuelvo. ¿Qué soy?',
    hint: 'Piensa en excavar en la tierra.',
    answer: 'Un agujero'
  },
  {
    riddle: 'Hablo sin boca y oigo sin oídos. No tengo cuerpo, pero cobro vida con el viento. ¿Qué soy?',
    hint: 'Sucede en montañas o habitaciones vacías.',
    answer: 'El eco'
  },
  {
    riddle: 'Siempre corro pero nunca camino, a menudo murmuro pero nunca hablo, tengo un lecho pero nunca duermo. ¿Qué soy?',
    hint: 'Desemboca en el mar.',
    answer: 'Un río'
  }
];

const FLAGS = [
  { flag: '🇺🇾', country: 'Uruguay', capital: 'Montevideo', continent: 'América del Sur', hint: 'Tiene un Sol de Mayo y nueve franjas.' },
  { flag: '🇦🇷', country: 'Argentina', capital: 'Buenos Aires', continent: 'América del Sur', hint: 'Tierra del tango, el mate y los Andes.' },
  { flag: '🇯🇵', country: 'Japón', capital: 'Tokio', continent: 'Asia', hint: 'Conocido como la Tierra del Sol Naciente.' },
  { flag: '🇲🇽', country: 'México', capital: 'Ciudad de México', continent: 'América del Norte', hint: 'Tiene un águila real sobre un nopal en su escudo.' },
  { flag: '🇪🇸', country: 'España', capital: 'Madrid', continent: 'Europa', hint: 'País de la península ibérica.' },
  { flag: '🇧🇷', country: 'Brasil', capital: 'Brasilia', continent: 'América del Sur', hint: 'Incluye el lema "Ordem e Progresso".' }
];

module.exports = {
  category: 'GAMES',
  description: 'Juegos interactivos, trivia, acertijos, anagramas y desafíos matemáticos para bots o apps.',
  endpoints: [
    {
      name: 'Trivia Challenge',
      path: '/api/games/trivia',
      method: 'GET',
      description: 'Genera una pregunta de trivia con opciones múltiples, respuesta correcta y explicación.',
      responseType: 'json',
      params: [
        { name: 'category', type: 'select', options: ['all', 'tech', 'science', 'gaming'], required: false, example: 'all', description: 'Categoría de la pregunta' }
      ],
      handler: async (req, res) => {
        const cat = (req.query.category || 'all').toLowerCase();
        const pool = cat === 'all' ? TRIVIA_LIST : TRIVIA_LIST.filter(t => t.category === cat);
        const list = pool.length ? pool : TRIVIA_LIST;
        const item = list[Math.floor(Math.random() * list.length)];

        res.json({
          status: true,
          data: item
        });
      }
    },
    {
      name: 'Riddle / Acertijo',
      path: '/api/games/riddle',
      method: 'GET',
      description: 'Devuelve un acertijo lógico con pista y respuesta para juegos de adivinanzas.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const item = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
        res.json({
          status: true,
          data: item
        });
      }
    },
    {
      name: 'Word Scramble (Palabra Desordenada)',
      path: '/api/games/word-scramble',
      method: 'GET',
      description: 'Devuelve una palabra con las letras mezcladas, su pista y la respuesta original.',
      responseType: 'json',
      params: [
        { name: 'topic', type: 'select', options: ['programming', 'space', 'animals'], required: false, example: 'programming', description: 'Temática de la palabra' }
      ],
      handler: async (req, res) => {
        const topic = req.query.topic || 'programming';
        const wordsByTopic = {
          programming: [
            { word: 'ALGORITMO', hint: 'Conjunto ordenado de pasos para resolver un problema.' },
            { word: 'ENDPOINT', hint: 'URL específica donde una API recibe peticiones.' },
            { word: 'SERVIDOR', hint: 'Sistema que provee recursos o datos a otros dispositivos.' },
            { word: 'JAVASCRIPT', hint: 'Lenguaje de programación estándar de la web.' }
          ],
          space: [
            { word: 'SUPERNOVA', hint: 'Explosión estelar extremadamente luminosa.' },
            { word: 'NEBULOSA', hint: 'Nube gigante de polvo y gas en el espacio.' },
            { word: 'GALAXIA', hint: 'Conjunto masivo de estrellas, planetas y materia oscura.' }
          ],
          animals: [
            { word: 'GUEPARDO', hint: 'El mamífero terrestre más veloz del planeta.' },
            { word: 'AJOLOTE', hint: 'Anfibio mexicano famoso por su capacidad de regeneración.' },
            { word: ' CAMALEON', hint: 'Reptil capaz de cambiar de color y mover sus ojos independientemente.' }
          ]
        };

        const pool = wordsByTopic[topic] || wordsByTopic.programming;
        const chosen = pool[Math.floor(Math.random() * pool.length)];
        const cleanWord = chosen.word.trim();
        const scrambled = cleanWord
          .split('')
          .sort(() => Math.random() - 0.5)
          .join('');

        res.json({
          status: true,
          data: {
            topic,
            scrambled: scrambled === cleanWord ? cleanWord.split('').reverse().join('') : scrambled,
            original: cleanWord,
            length: cleanWord.length,
            hint: chosen.hint
          }
        });
      }
    },
    {
      name: 'Math Speed Challenge',
      path: '/api/games/math-challenge',
      method: 'GET',
      description: 'Genera una operación matemática aleatoria con límite de tiempo sugerido y resultado exacto.',
      responseType: 'json',
      params: [
        { name: 'difficulty', type: 'select', options: ['easy', 'medium', 'hard'], required: false, example: 'medium', description: 'Dificultad del cálculo' }
      ],
      handler: async (req, res) => {
        const diff = req.query.difficulty || 'medium';
        let expression = '';
        let answer = 0;
        let timeLimitSec = 15;

        if (diff === 'easy') {
          const a = Math.floor(Math.random() * 25) + 5;
          const b = Math.floor(Math.random() * 25) + 5;
          expression = `${a} + ${b}`;
          answer = a + b;
          timeLimitSec = 10;
        } else if (diff === 'hard') {
          const a = Math.floor(Math.random() * 18) + 6;
          const b = Math.floor(Math.random() * 14) + 4;
          const c = Math.floor(Math.random() * 40) + 10;
          expression = `(${a} × ${b}) + ${c}`;
          answer = a * b + c;
          timeLimitSec = 20;
        } else {
          const a = Math.floor(Math.random() * 15) + 4;
          const b = Math.floor(Math.random() * 12) + 3;
          expression = `${a} × ${b}`;
          answer = a * b;
          timeLimitSec = 15;
        }

        res.json({
          status: true,
          data: {
            difficulty: diff,
            expression,
            answer,
            time_limit_seconds: timeLimitSec
          }
        });
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
        const item = FLAGS[Math.floor(Math.random() * FLAGS.length)];
        res.json({
          status: true,
          data: item
        });
      }
    }
  ]
};
