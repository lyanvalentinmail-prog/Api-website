# API Console — REST API pública sin clave

Plataforma Node.js + Express con **34 endpoints que hacen lo que prometen**:
generadores de imágenes (Brat e iPhone Quoted Chat), tarjetas para bots y
utilidades reales de desarrollo, más un **Playground** (`/playground`) para
ejecutar cualquier endpoint desde el navegador con snippets de `cURL`,
`fetch` y `Python`.

Sin registro, sin API key y sin datos fingidos: si un endpoint no puede
garantizar su salida (por ejemplo, una consulta a un servicio externo que no
responde), devuelve `status:false` con el motivo en lugar de inventar datos.

---

## Categorías y endpoints

| Categoría | Endpoints | Qué hace |
|---|---|---|
| **MAKER** | `/api/maker/brat` · `/api/maker/iqc` · `/api/maker/neon` | Portadas estilo **bratgenerator.com** (fondo `#8ACE00`, Arial Narrow en minúsculas con stretch + blur, ratios 1:1 / 9:16 / 4:3), capturas **IQC** realistas de iMessage y letreros de neón. |
| **CANVAS** | `welcome` · `goodbye` · `profile` · `tweet` · `certificate` · `quote-card` · `code-snap` · `iq-card` · `captcha` | Tarjetas SVG limpias para bots y capturas; consumen los assets compartidos. |
| **TOOLS** | `qrcode` · `hash` · `password` · `uuid` · `base64` · `jwt-decoder` · `cron-parser` · `color-palette` · `unit-converter` · `slugify` · `ip-subnet` | Utilidades 100 % locales y verificables (criptografía, QR, JWT, CIDR…). |
| **LOOKUP** | `github` · `npm` · `dns` · `youtube-thumbnails` · `http-status` | Consultas **en vivo** contra GitHub, NPM y DNS; si el upstream cae, `status:false`. |
| **INFO** | `world-time` · `moon-phase` | Hora mundial y fase lunar calculadas localmente. |
| **FUN** | `zodiac` · `love-calculator` · `8ball` · `roast` | Entretenimiento claramente lúdico. |

Catálogo completo y auto-descubierto en `GET /api/endpoints` · métricas reales en `GET /api/stats`.

---

## Estructura

```text
Api-website/
├── server.js              # Express: rutas, assets, web y 404 JSON
├── scripts/smoke.js       # `npm test`: ejecuta TODOS los endpoints y verifica salidas
├── src/
│   ├── registry.js        # Auto-descubrimiento de src/routes/*.js + telemetría
│   ├── lib/
│   │   ├── util.js        # escapeXml, wrapText por ancho, seeds, etc.
│   │   └── assets.js      # dataUri() / inlineSvg() para incrustar /assets
│   └── routes/            # maker · canvas · tools · lookup · info · fun
├── assets/                # Imágenes del proyecto (ver assets/README.md)
│   ├── iqc/               #   avatares (JPG/SVG) y wallpapers del IQC
│   ├── cards/             #   patrones e insignias para tarjetas
│   └── ui/                #   logo, favicon y Open Graph de la web
└── public/                # Landing + Playground (CSS limpio, claro/oscuro)
```

Los assets se sirven en `GET /assets/*` **y** se incrustan en cada SVG generado,
de modo que las respuestas son autónomas. **Brat no usa assets**: su salida es
100 % tipográfica, como el original.

---

## Añadir un endpoint

Crea o edita un archivo en `src/routes/` y exporta `{ category, description, endpoints }`:

```js
module.exports = {
  category: 'MI_CATEGORIA',
  description: 'Descripción breve',
  endpoints: [
    {
      name: 'Saludo',
      path: '/api/custom/saludo',
      method: 'GET',
      description: 'Devuelve un saludo en JSON.',
      responseType: 'json', // 'json' o 'image'
      params: [
        { name: 'nombre', type: 'string', required: true, example: 'Lyan', description: 'Tu nombre' }
      ],
      handler: async (req, res) => {
        res.json({ status: true, data: { mensaje: `¡Hola, ${req.query.nombre || 'mundo'}!` } });
      }
    }
  ]
};
```

Al reiniciar, el registry lo monta en Express y aparece solo en el Playground.
Regla de la casa: **si no funciona de verdad, no se agrega**.

---

## Uso

```bash
npm install
npm start     # landing en / y consola en /playground
npm test      # smoke test: ejecuta todos los endpoints y verifica salidas
```

Ejemplos:

```html
<img src="/api/maker/brat?text=brat%20summer" />
<img src="/api/maker/iqc?text=Hola%20desde%20un%20bot&avatar=ana&tapback=heart" />
```

```bash
curl "TU-DOMINIO/api/tools/hash?text=secreto&algorithm=sha256"
```

---

## Despliegue

Incluye `render.yaml` (Render) y `vercel.json` (Vercel) listos: el entrypoint
es `server.js` y no requiere variables de entorno.
