/**
 * Categoría: ANIME
 * Citas, buscador de series, horarios de emisión y fichas de personajes.
 */

const ANIME_CATALOG = [
  {
    id: 'frieren-01',
    title: 'Sousou no Frieren (Frieren: Beyond Journey\'s End)',
    japanese: '葬送のフリーレン',
    episodes: 28,
    status: 'Finished Airing',
    score: 9.38,
    studio: 'Madhouse',
    genres: ['Adventure', 'Drama', 'Fantasy'],
    year: 2023,
    synopsis: 'Tras derrotar al Rey Demonio junto al grupo de héroes, la maga elfa Frieren emprende un nuevo viaje para comprender mejor a los humanos y el paso del tiempo.'
  },
  {
    id: 'solo-leveling-02',
    title: 'Solo Leveling (Ore dake Level Up na Ken)',
    japanese: '俺だけレベルアップな件',
    episodes: 25,
    status: 'Airing / Season 2',
    score: 8.64,
    studio: 'A-1 Pictures',
    genres: ['Action', 'Adventure', 'Fantasy'],
    year: 2024,
    synopsis: 'En un mundo donde cazadores con habilidades mágicas deben luchar contra monstruos en mazmorras, Sung Jinwoo, el cazador más débil, obtiene un sistema único que le permite subir de nivel sin límite.'
  },
  {
    id: 'jjk-03',
    title: 'Jujutsu Kaisen',
    japanese: '呪術廻戦',
    episodes: 47,
    status: 'Finished Season 2',
    score: 8.78,
    studio: 'MAPPA',
    genres: ['Action', 'Supernatural', 'Dark Fantasy'],
    year: 2020,
    synopsis: 'Yuji Itadori traga un dedo maldito de Ryomen Sukuna para salvar a sus amigos y se une a la Escuela Técnica de Hechicería de Tokio.'
  },
  {
    id: 'steins-gate-04',
    title: 'Steins;Gate',
    japanese: 'シュタインズ・ゲート',
    episodes: 24,
    status: 'Finished Airing',
    score: 9.07,
    studio: 'White Fox',
    genres: ['Sci-Fi', 'Thriller', 'Psychological'],
    year: 2011,
    synopsis: 'Un autoproclamado científico loco y sus amigos descubren accidentalmente cómo enviar mensajes de texto al pasado utilizando un microondas modificado.'
  },
  {
    id: 'dandadan-05',
    title: 'Dandadan',
    japanese: 'ダンダダン',
    episodes: 12,
    status: 'Finished Season 1',
    score: 8.75,
    studio: 'Science SARU',
    genres: ['Action', 'Comedy', 'Supernatural', 'Sci-Fi'],
    year: 2024,
    synopsis: 'Momo Ayase cree en fantasmas pero no en alienígenas, mientras que su compañero Okarun cree en alienígenas pero no en fantasmas. Ambos descubren que los dos existen.'
  },
  {
    id: 'aot-06',
    title: 'Shingeki no Kyojin (Attack on Titan)',
    japanese: '進撃の巨人',
    episodes: 94,
    status: 'Finished Airing',
    score: 9.05,
    studio: 'Wit Studio / MAPPA',
    genres: ['Action', 'Drama', 'Suspense'],
    year: 2013,
    synopsis: 'La humanidad vive encerrada tras enormes murallas para protegerse de los Titanes hasta que un Titán Colosal destruye la paz de Eren Yeager.'
  }
];

const ANIME_QUOTES = [
  {
    quote: 'El mundo no es perfecto, pero está ahí para nosotros haciendo lo mejor que puede... eso es lo que lo hace tan malditamente hermoso.',
    character: 'Roy Mustang',
    anime: 'Fullmetal Alchemist: Brotherhood',
    episode: 'Episodio 10'
  },
  {
    quote: 'No importa cuán capacitado seas, tú solo no puedes cambiar el mundo. Pero eso es lo maravilloso del mundo.',
    character: 'L Lawliet',
    anime: 'Death Note',
    episode: 'Episodio 25'
  },
  {
    quote: 'El miedo no es malo. Te muestra cuál es tu debilidad. Y una vez que conoces tu debilidad, puedes volverte más fuerte y más amable.',
    character: 'Gildarts Clive',
    anime: 'Fairy Tail',
    episode: 'Episodio 99'
  },
  {
    quote: 'Lo que importa no es el tiempo que pasaste con alguien, sino cómo ese tiempo cambió tu corazón.',
    character: 'Himmel el Héroe',
    anime: 'Sousou no Frieren',
    episode: 'Episodio 1'
  },
  {
    quote: 'Nadie sabe lo que depara el futuro. Por eso su potencial es infinito.',
    character: 'Rintarou Okabe',
    anime: 'Steins;Gate',
    episode: 'Episodio 24'
  },
  {
    quote: 'A lo largo del cielo y la tierra, yo solo soy el honrado.',
    character: 'Satoru Gojo',
    anime: 'Jujutsu Kaisen',
    episode: 'Episodio 28'
  }
];

module.exports = {
  category: 'ANIME',
  description: 'Base de datos de anime, citas icónicas, calendario de emisión y búsqueda por género.',
  endpoints: [
    {
      name: 'Anime Quotes',
      path: '/api/anime/quotes',
      method: 'GET',
      description: 'Devuelve una cita célebre de anime aleatoria o filtrada por nombre de anime/personaje.',
      responseType: 'json',
      params: [
        { name: 'anime', type: 'string', required: false, example: '', description: 'Filtrar opcionalmente por nombre de anime (ej: Frieren, Steins)' }
      ],
      handler: async (req, res) => {
        const filter = (req.query.anime || '').trim().toLowerCase();
        const pool = filter
          ? ANIME_QUOTES.filter(q => q.anime.toLowerCase().includes(filter) || q.character.toLowerCase().includes(filter))
          : ANIME_QUOTES;

        const list = pool.length ? pool : ANIME_QUOTES;
        const selected = list[Math.floor(Math.random() * list.length)];

        res.json({
          status: true,
          data: selected
        });
      }
    },
    {
      name: 'Anime Search & Detail',
      path: '/api/anime/search',
      method: 'GET',
      description: 'Busca animes por título o género y devuelve sinopsis, episodios, estudio y puntuación.',
      responseType: 'json',
      params: [
        { name: 'query', type: 'string', required: false, example: 'Frieren', description: 'Nombre del anime a buscar' },
        { name: 'genre', type: 'select', options: ['all', 'Action', 'Adventure', 'Fantasy', 'Sci-Fi', 'Drama'], required: false, example: 'all', description: 'Filtrar por género' }
      ],
      handler: async (req, res) => {
        const q = (req.query.query || '').trim().toLowerCase();
        const genre = req.query.genre || 'all';

        const results = ANIME_CATALOG.filter(item => {
          const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.synopsis.toLowerCase().includes(q);
          const matchesGenre = genre === 'all' || item.genres.some(g => g.toLowerCase() === genre.toLowerCase());
          return matchesQuery && matchesGenre;
        });

        res.json({
          status: true,
          total: results.length,
          data: results
        });
      }
    },
    {
      name: 'Anime Release Schedule',
      path: '/api/anime/schedule',
      method: 'GET',
      description: 'Consulta el calendario semanal de estrenos y emisiones de anime por día.',
      responseType: 'json',
      params: [
        {
          name: 'day',
          type: 'select',
          options: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          required: false,
          example: 'friday',
          description: 'Día de la semana'
        }
      ],
      handler: async (req, res) => {
        const day = (req.query.day || 'friday').toLowerCase();
        const schedules = {
          monday: [{ title: 'Vinland Saga Rebroadcast', time: '22:00 JST', studio: 'MAPPA' }],
          tuesday: [{ title: 'Bleach: Thousand-Year Blood War', time: '23:30 JST', studio: 'Pierrot Films' }],
          wednesday: [{ title: 'Re:Zero Season 3', time: '22:30 JST', studio: 'White Fox' }],
          thursday: [{ title: 'Dandadan', time: '00:26 JST', studio: 'Science SARU' }],
          friday: [
            { title: 'Sousou no Frieren', time: '23:00 JST', studio: 'Madhouse' },
            { title: 'The Apothecary Diaries', time: '24:05 JST', studio: 'OLM / TOHO' }
          ],
          saturday: [
            { title: 'Solo Leveling: Arise from the Shadow', time: '24:00 JST', studio: 'A-1 Pictures' },
            { title: 'Kaiju No. 8', time: '23:00 JST', studio: 'Production I.G' }
          ],
          sunday: [{ title: 'One Piece', time: '23:15 JST', studio: 'Toei Animation' }]
        };

        res.json({
          status: true,
          day,
          data: schedules[day] || schedules.friday
        });
      }
    }
  ]
};
