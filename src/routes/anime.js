/**
 * Categoría: ANIME (8 Endpoints)
 * Citas, buscador de series, horarios, personajes, top ranking, recomendador, Gacha Card y quiz de openings.
 */

const ANIME_CATALOG = [
  { id: 'frieren-01', title: 'Sousou no Frieren', japanese: '葬送のフリーレン', episodes: 28, status: 'Finished Airing', score: 9.38, studio: 'Madhouse', genres: ['Adventure', 'Drama', 'Fantasy'], year: 2023 },
  { id: 'solo-leveling-02', title: 'Solo Leveling', japanese: '俺だけレベルアップな件', episodes: 25, status: 'Airing', score: 8.64, studio: 'A-1 Pictures', genres: ['Action', 'Adventure', 'Fantasy'], year: 2024 },
  { id: 'jjk-03', title: 'Jujutsu Kaisen', japanese: '呪術廻戦', episodes: 47, status: 'Finished Season 2', score: 8.78, studio: 'MAPPA', genres: ['Action', 'Supernatural'], year: 2020 },
  { id: 'steins-gate-04', title: 'Steins;Gate', japanese: 'シュタインズ・ゲート', episodes: 24, status: 'Finished Airing', score: 9.07, studio: 'White Fox', genres: ['Sci-Fi', 'Thriller'], year: 2011 },
  { id: 'dandadan-05', title: 'Dandadan', japanese: 'ダンダダン', episodes: 12, status: 'Finished Season 1', score: 8.75, studio: 'Science SARU', genres: ['Action', 'Comedy', 'Sci-Fi'], year: 2024 },
  { id: 'aot-06', title: 'Shingeki no Kyojin (Attack on Titan)', japanese: '進撃の巨人', episodes: 94, status: 'Finished Airing', score: 9.05, studio: 'Wit Studio / MAPPA', genres: ['Action', 'Drama'], year: 2013 },
  { id: 'fmab-07', title: 'Fullmetal Alchemist: Brotherhood', japanese: '鋼の錬金術師', episodes: 64, status: 'Finished Airing', score: 9.10, studio: 'Bones', genres: ['Action', 'Adventure', 'Fantasy'], year: 2009 },
  { id: 'cyberpunk-08', title: 'Cyberpunk: Edgerunners', japanese: 'サイバーパンク エッジランナーズ', episodes: 10, status: 'Finished Airing', score: 8.61, studio: 'Trigger', genres: ['Action', 'Sci-Fi'], year: 2022 }
];

const ANIME_QUOTES = [
  { quote: 'El mundo no es perfecto, pero está ahí para nosotros haciendo lo mejor que puede.', character: 'Roy Mustang', anime: 'Fullmetal Alchemist: Brotherhood' },
  { quote: 'No importa cuán capacitado seas, tú solo no puedes cambiar el mundo.', character: 'L Lawliet', anime: 'Death Note' },
  { quote: 'Lo que importa no es el tiempo que pasaste con alguien, sino cómo ese tiempo cambió tu corazón.', character: 'Himmel', anime: 'Sousou no Frieren' },
  { quote: 'Nadie sabe lo que depara el futuro. Por eso su potencial es infinito.', character: 'Rintarou Okabe', anime: 'Steins;Gate' },
  { quote: 'A lo largo del cielo y la tierra, yo solo soy el honrado.', character: 'Satoru Gojo', anime: 'Jujutsu Kaisen' },
  { quote: 'Si no arriesgas tu vida, no puedes crear un futuro.', character: 'Monkey D. Luffy', anime: 'One Piece' }
];

const CHARACTERS = [
  { name: 'Frieren', anime: 'Sousou no Frieren', role: 'Mage / Party Member', affiliation: 'Hero Party', power_level: 'SSR+', signature_move: 'Zoltraak' },
  { name: 'Sung Jinwoo', anime: 'Solo Leveling', role: 'Shadow Monarch', affiliation: 'Ahjin Guild', power_level: 'UR', signature_move: 'Arise (Shadow Extraction)' },
  { name: 'Satoru Gojo', anime: 'Jujutsu Kaisen', role: 'Special Grade Sorcerer', affiliation: 'Tokyo Jujutsu High', power_level: 'UR', signature_move: 'Hollow Purple & Unlimited Void' },
  { name: 'Rintarou Okabe', anime: 'Steins;Gate', role: 'Founder Lab Member 001', affiliation: 'Future Gadget Lab', power_level: 'SSR', signature_move: 'Reading Steiner' },
  { name: 'Lucy Kushinada', anime: 'Cyberpunk: Edgerunners', role: 'Netrunner', affiliation: 'Edgerunners Crew', power_level: 'SSR', signature_move: 'Monowire & Deep Dive Hack' }
];

module.exports = {
  category: 'ANIME',
  description: 'Base de datos de anime, citas icónicas, calendario de emisión, fichas de personajes, recomendador y Gacha.',
  endpoints: [
    {
      name: 'Anime Quotes',
      path: '/api/anime/quotes',
      method: 'GET',
      description: 'Devuelve una cita célebre de anime aleatoria o filtrada.',
      responseType: 'json',
      params: [
        { name: 'anime', type: 'string', required: false, example: '', description: 'Filtrar opcionalmente por nombre de anime o personaje' }
      ],
      handler: async (req, res) => {
        const filter = (req.query.anime || '').trim().toLowerCase();
        const pool = filter ? ANIME_QUOTES.filter(q => q.anime.toLowerCase().includes(filter) || q.character.toLowerCase().includes(filter)) : ANIME_QUOTES;
        const list = pool.length ? pool : ANIME_QUOTES;
        res.json({ status: true, data: list[Math.floor(Math.random() * list.length)] });
      }
    },
    {
      name: 'Anime Search & Detail',
      path: '/api/anime/search',
      method: 'GET',
      description: 'Busca animes por título o género y devuelve episodios, estudio y puntuación.',
      responseType: 'json',
      params: [
        { name: 'query', type: 'string', required: false, example: 'Frieren', description: 'Nombre del anime' },
        { name: 'genre', type: 'select', options: ['all', 'Action', 'Adventure', 'Fantasy', 'Sci-Fi', 'Drama'], required: false, example: 'all', description: 'Filtrar por género' }
      ],
      handler: async (req, res) => {
        const q = (req.query.query || '').trim().toLowerCase();
        const genre = req.query.genre || 'all';
        const results = ANIME_CATALOG.filter(item => {
          const mQ = !q || item.title.toLowerCase().includes(q);
          const mG = genre === 'all' || item.genres.some(g => g.toLowerCase() === genre.toLowerCase());
          return mQ && mG;
        });
        res.json({ status: true, total: results.length, data: results });
      }
    },
    {
      name: 'Anime Release Schedule',
      path: '/api/anime/schedule',
      method: 'GET',
      description: 'Consulta el calendario semanal de emisiones de anime por día.',
      responseType: 'json',
      params: [
        { name: 'day', type: 'select', options: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required: false, example: 'saturday', description: 'Día de la semana' }
      ],
      handler: async (req, res) => {
        const day = (req.query.day || 'saturday').toLowerCase();
        const schedules = {
          monday: [{ title: 'Vinland Saga', time: '22:00 JST', studio: 'MAPPA' }],
          tuesday: [{ title: 'Bleach: TYBW', time: '23:30 JST', studio: 'Pierrot Films' }],
          wednesday: [{ title: 'Re:Zero Season 3', time: '22:30 JST', studio: 'White Fox' }],
          thursday: [{ title: 'Dandadan', time: '00:26 JST', studio: 'Science SARU' }],
          friday: [{ title: 'Sousou no Frieren', time: '23:00 JST', studio: 'Madhouse' }],
          saturday: [{ title: 'Solo Leveling', time: '24:00 JST', studio: 'A-1 Pictures' }, { title: 'Kaiju No. 8', time: '23:00 JST', studio: 'Production I.G' }],
          sunday: [{ title: 'One Piece', time: '23:15 JST', studio: 'Toei Animation' }]
        };
        res.json({ status: true, day, data: schedules[day] || schedules.saturday });
      }
    },
    {
      name: 'Anime Character Database',
      path: '/api/anime/character',
      method: 'GET',
      description: 'Consulta fichas técnicas, afiliación y habilidades de personajes de anime.',
      responseType: 'json',
      params: [
        { name: 'name', type: 'string', required: false, example: 'Gojo', description: 'Nombre del personaje' }
      ],
      handler: async (req, res) => {
        const q = (req.query.name || '').trim().toLowerCase();
        const matches = !q ? CHARACTERS : CHARACTERS.filter(c => c.name.toLowerCase().includes(q) || c.anime.toLowerCase().includes(q));
        res.json({ status: true, total: matches.length, data: matches.length ? matches : CHARACTERS });
      }
    },
    {
      name: 'Top Anime Leaderboard',
      path: '/api/anime/top',
      method: 'GET',
      description: 'Devuelve el ranking de animes mejor valorados ordenados por puntuación.',
      responseType: 'json',
      params: [
        { name: 'limit', type: 'number', required: false, example: '5', description: 'Cantidad de resultados' }
      ],
      handler: async (req, res) => {
        const limit = Math.max(1, Math.min(20, parseInt(req.query.limit || '5', 10) || 5));
        const sorted = [...ANIME_CATALOG].sort((a, b) => b.score - a.score).slice(0, limit);
        res.json({ status: true, data: sorted });
      }
    },
    {
      name: 'Anime Mood Recommender',
      path: '/api/anime/recommend',
      method: 'GET',
      description: 'Recomienda qué anime ver hoy según tu estado de ánimo.',
      responseType: 'json',
      params: [
        { name: 'mood', type: 'select', options: ['hype', 'emotional', 'mindblown', 'cyberpunk', 'funny'], required: false, example: 'hype', description: 'Estado de ánimo actual' }
      ],
      handler: async (req, res) => {
        const mood = req.query.mood || 'hype';
        const map = {
          hype: { pick: 'Solo Leveling', reason: 'Batallas vertiginosas, progresión constante y banda sonora de Hiroyuki Sawano.' },
          emotional: { pick: 'Sousou no Frieren', reason: 'Una obra maestra reflexiva sobre el paso del tiempo, la amistad y los recuerdos.' },
          mindblown: { pick: 'Steins;Gate', reason: 'Viajes en el tiempo, paradojas causales y uno de los mejores giros de guion del anime.' },
          cyberpunk: { pick: 'Cyberpunk: Edgerunners', reason: 'Acción explosiva de Studio Trigger en Night City en solo 10 episodios.' },
          funny: { pick: 'Dandadan', reason: 'Comedia frenética, animación deslumbrante y batallas sobrenaturales.' }
        };
        res.json({ status: true, mood, data: map[mood] || map.hype });
      }
    },
    {
      name: 'Anime Gacha Pull Simulator',
      path: '/api/anime/gacha-pull',
      method: 'GET',
      description: 'Simula una tirada Gacha con probabilidades de rareza (R, SR, SSR, UR) y estadísticas de combate.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const roll = Math.random() * 100;
        const rarity = roll > 92 ? 'UR ⭐⭐⭐⭐⭐' : roll > 70 ? 'SSR ⭐⭐⭐⭐' : roll > 35 ? 'SR ⭐⭐⭐' : 'R ⭐⭐';
        const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        res.json({
          status: true,
          data: {
            pulled_character: char.name,
            anime: char.anime,
            rarity,
            signature_move: char.signature_move,
            stats: {
              atk: Math.floor(1500 + Math.random() * 3500),
              def: Math.floor(900 + Math.random() * 2200),
              spd: Math.floor(120 + Math.random() * 180)
            }
          }
        });
      }
    },
    {
      name: 'Anime Opening Trivia Quiz',
      path: '/api/anime/opening-quiz',
      method: 'GET',
      description: 'Devuelve un reto para adivinar a qué anime pertenece una canción de opening famosa.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const openings = [
          { song: 'Idol — YOASOBI', anime: 'Oshi no Ko', year: 2023 },
          { song: 'Bling-Bang-Bang-Born — Creepy Nuts', anime: 'Mashle: Magic and Muscles', year: 2024 },
          { song: 'Otonoke — Creepy Nuts', anime: 'Dandadan', year: 2024 },
          { song: 'Specialz — King Gnu', anime: 'Jujutsu Kaisen (Shibuya Arc)', year: 2023 },
          { song: 'Unravel — TK from Ling Tosite Sigure', anime: 'Tokyo Ghoul', year: 2014 },
          { song: 'Hacking to the Gate — Kanako Itou', anime: 'Steins;Gate', year: 2011 }
        ];
        const chosen = openings[Math.floor(Math.random() * openings.length)];
        res.json({ status: true, data: chosen });
      }
    }
  ]
};
