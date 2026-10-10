# 🚀 API CONSOLE V2 — Plataforma REST API + Playground Interactivo (Estilo Siputzx)

Una plataforma **REST API pública sin API Key** con su propio entorno de ejecución interactivo en el navegador (`/playground`), inspirada en **[app.siputzx.my.id/playground](https://app.siputzx.my.id/playground)**.

---

## 🧠 ¿Cómo funciona por dentro una web como Siputzx Playground?

El secreto para construir un portal de APIs como el de Siputzx sin tener que escribir el HTML de cada endpoint a mano se basa en **3 componentes conectados**:

1. **Rutas Autodescritas (`src/routes/*.js`)**:
   Cada archivo representa una categoría (`AI`, `CANVAS`, `ANIME`, `GAMES`, `TOOLS`, `SEARCH`, `DOWNLOADER`, `RANDOM`) y exporta un arreglo `endpoints`. Cada endpoint incluye tanto su **lógica (`handler`)** como sus **metadatos (`name`, `path`, `method`, `params`, `responseType`)**.
2. **Motor de Auto-Descubrimiento (`src/registry.js`)**:
   Al iniciar el servidor Express, el registro lee automáticamente todos los archivos de `src/routes/`, monta cada ruta en Express (`app.get` / `app.post`), mide el tiempo de respuesta en milisegundos (`X-Response-Time`) y publica el catálogo completo en `GET /api/endpoints`.
3. **Consola de Ejecución Directa (`public/playground.html` + `public/js/playground.js`)**:
   El frontend consulta `GET /api/endpoints`, agrupa los endpoints por categoría, genera buscador + filtros y construye dinámicamente los formularios de prueba, fragmentos de código (`URL`, `cURL`, `fetch`, `Python`) y el visor inteligente capaz de renderizar **JSON formateado** o **imágenes SVG/Canvas en vivo**.

---

## 📁 Estructura del Proyecto

```text
Api-website/
├── server.js                  # Servidor Express principal (Landing, Playground y API)
├── package.json               # Dependencias (express, cors, qrcode)
├── src/
│   ├── registry.js            # Auto-descubrimiento de rutas y telemetría en tiempo real
│   └── routes/                # Categorías de endpoints (¡Agrega los tuyos aquí!)
│       ├── ai.js              # /api/ai/* (Chat, Prompt Enhancer, Sentiment, Summarizer)
│       ├── anime.js           # /api/anime/* (Quotes, Search, Schedule)
│       ├── canvas.js          # /api/canvas/* (Welcome, Profile, Spotify, Tweet, Captcha)
│       ├── downloader.js      # /api/d/* (GitHub Downloader, Media URL Inspector)
│       ├── games.js           # /api/games/* (Trivia, Riddle, Scramble, Math, Flag Quiz)
│       ├── random.js          # /api/r/* (Pixel Avatar SVG, Tech Facts, Dev Excuses)
│       ├── search.js          # /api/s/* (Country Info, HTTP Status Reference)
│       └── tools.js           # /api/tools/* (QR Code, Hash, Password, UUID, Base64, VCC)
└── public/
    ├── index.html             # Landing Page ("NO LOGIN. NO KEY. JUST PURE REST API.")
    ├── playground.html        # API CONSOLE V2 (/playground)
    ├── css/styles.css         # Diseño Cyber-Developer oscuro
    └── js/
        ├── landing.js         # Métricas en tiempo real y FAQ
        └── playground.js      # Motor interactivo del Playground y Builder de Endpoints
```

---

## ➕ ¿Cómo agregar un nuevo Endpoint?

Tienes **dos formas** de hacerlo:

### Opción A: Agregándolo en código (`src/routes/`)
Abre cualquier archivo en `src/routes/` (por ejemplo `src/routes/tools.js`) o crea un archivo nuevo como `src/routes/mi-categoria.js`:

```js
module.exports = {
  category: 'MI_CATEGORIA',
  description: 'Descripción breve de tu categoría',
  endpoints: [
    {
      name: 'Saludo Personalizado',
      path: '/api/custom/saludo',
      method: 'GET',
      description: 'Devuelve un saludo en JSON.',
      responseType: 'json', // 'json' o 'image'
      params: [
        {
          name: 'nombre',
          type: 'string', // 'string', 'number' o 'select'
          required: true,
          example: 'Lyan',
          description: 'Tu nombre'
        }
      ],
      handler: async (req, res) => {
        const { nombre = 'Mundo' } = req.query;
        res.json({
          status: true,
          data: {
            mensaje: `¡Hola, ${nombre}! Bienvenido a mi API.`
          }
        });
      }
    }
  ]
};
```

¡Listo! Al reiniciar el servidor, el endpoint aparecerá automáticamente en `/playground` con su formulario de parámetros, botón de ejecución y generador `cURL`.

### Opción B: Desde el botón `+ Crear Endpoint` en `/playground`
Dentro de la interfaz web en `/playground`, haz clic en **`+ Crear Endpoint`** arriba a la derecha para registrar un endpoint en caliente sin reiniciar el servidor y obtener el código Node.js generado automáticamente.

---

## 🛠️ Instalación y Uso Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor
npm start
```

- **Landing Page:** `http://localhost:3000/`
- **API Playground:** `http://localhost:3000/playground`
- **Catálogo JSON:** `http://localhost:3000/api/endpoints`
- **Estadísticas en vivo:** `http://localhost:3000/api/stats`
