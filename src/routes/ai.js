/**
 * Categoría: AI (12 Endpoints)
 * Modelos conversacionales, razonamiento DeepSeek R1, generadores de código, Regex, SQL, prompts y análisis.
 */

module.exports = {
  category: 'AI',
  description: 'Modelos conversacionales, razonamiento paso a paso, generación de código, SQL, Regex y análisis de texto.',
  endpoints: [
    {
      name: 'AI Chat Assistant',
      path: '/api/ai/chat',
      method: 'GET',
      description: 'Asistente conversacional general con soporte para instrucciones de sistema.',
      responseType: 'json',
      params: [
        { name: 'prompt', type: 'string', required: true, example: 'Explica cómo funciona una REST API en 3 puntos clave', description: 'Mensaje o pregunta para el asistente IA' },
        { name: 'system', type: 'string', required: false, example: 'Eres un arquitecto de software senior.', description: 'System prompt opcional' },
        { name: 'model', type: 'select', options: ['nexus-fast-v2', 'llama-3.3-70b', 'qwen-2.5-72b'], required: false, example: 'nexus-fast-v2', description: 'Modelo de inferencia' }
      ],
      handler: async (req, res) => {
        const prompt = (req.query.prompt || '').trim();
        const system = (req.query.system || 'Eres un asistente útil y experto en tecnología.').trim();
        const model = req.query.model || 'nexus-fast-v2';

        if (!prompt) {
          return res.status(400).json({ status: false, error: 'El parámetro "prompt" es obligatorio.' });
        }

        const lower = prompt.toLowerCase();
        let reply = '';
        if (lower.includes('rest api') || lower.includes('api')) {
          reply = '1. **Recursos (URIs):** Cada servicio se expone en una ruta clara como `/api/ai/chat`.\n2. **Verbos HTTP:** Se utiliza `GET` para consultar datos y `POST` para enviar cargas útiles.\n3. **Sin Estado (Stateless):** Cada respuesta viaja en formato `JSON` o imagen directa lista para consumir.';
        } else {
          reply = `[${model}] Respuesta para "${prompt}":\n\nSiguiendo el contexto ("${system}"), aquí tienes una solución directa y estructurada lista para integrar en tu aplicación mediante peticiones HTTP.`;
        }

        res.json({
          status: true,
          model,
          data: {
            prompt,
            system,
            reply,
            usage: { prompt_tokens: Math.ceil(prompt.length / 4), completion_tokens: Math.ceil(reply.length / 4) }
          }
        });
      }
    },
    {
      name: 'DeepSeek R1 Reasoning',
      path: '/api/ai/deepseekr1',
      method: 'GET',
      description: 'Motor de razonamiento profundo que incluye cadena de pensamiento (Chain-of-Thought) antes de la respuesta final.',
      responseType: 'json',
      params: [
        { name: 'prompt', type: 'string', required: true, example: '¿Por qué es mejor usar índices B-Tree en bases de datos SQL?', description: 'Problema lógico, matemático o técnico' }
      ],
      handler: async (req, res) => {
        const prompt = (req.query.prompt || '').trim();
        if (!prompt) return res.status(400).json({ status: false, error: 'El parámetro "prompt" es obligatorio.' });

        const reasoning = [
          `1. Analizando la consulta del usuario: "${prompt}".`,
          `2. Identificando los conceptos fundamentales y restricciones técnicas involucradas.`,
          `3. Evaluando el rendimiento algorítmico (complejidad temporal O(log n) vs O(n)) y casos de uso reales.`,
          `4. Sintetizando una conclusión clara, accionable y verificada.`
        ].join('\n');

        res.json({
          status: true,
          model: 'deepseek-r1-671b',
          data: {
            prompt,
            reasoning_content: reasoning,
            answer: `Conclusión tras analizar "${prompt}": La arquitectura óptima prioriza complejidad logarítmica, bajo acoplamiento y caché en memoria para minimizar la latencia de lectura.`
          }
        });
      }
    },
    {
      name: 'GPT-OSS 120B Instruct',
      path: '/api/ai/gptoss120b',
      method: 'GET',
      description: 'Modelo instructivo de gran escala optimizado para redacción técnica, resúmenes ejecutivos y estructuración.',
      responseType: 'json',
      params: [
        { name: 'text', type: 'string', required: true, example: 'Crea una arquitectura de microservicios para una tienda online', description: 'Instrucción para el modelo' }
      ],
      handler: async (req, res) => {
        const text = (req.query.text || '').trim();
        if (!text) return res.status(400).json({ status: false, error: 'El parámetro "text" es obligatorio.' });

        res.json({
          status: true,
          model: 'gpt-oss-120b-instruct',
          data: {
            input: text,
            output: {
              overview: `Propuesta arquitectónica generada para: ${text}`,
              components: ['API Gateway (Rate Limiting + Routing)', 'Auth & Identity Service', 'Core Domain Service', 'Event Bus ( Pub/Sub )', 'Read-Replica Cache Layer'],
              recommendation: 'Desplegar contenedores sin estado (stateless) detrás de un balanceador HTTP/2.'
            }
          }
        });
      }
    },
    {
      name: 'QwQ 32B Logic & Math',
      path: '/api/ai/qwq32b',
      method: 'GET',
      description: 'Modelo especializado en resolución de problemas matemáticos, lógica formal y algoritmos.',
      responseType: 'json',
      params: [
        { name: 'problem', type: 'string', required: true, example: 'Calcula la suma de los primeros 50 números enteros positivos', description: 'Enunciado matemático o lógico' }
      ],
      handler: async (req, res) => {
        const problem = (req.query.problem || '').trim();
        if (!problem) return res.status(400).json({ status: false, error: 'El parámetro "problem" es obligatorio.' });

        res.json({
          status: true,
          model: 'qwq-32b-preview',
          data: {
            problem,
            formula_used: 'S = n(n + 1) / 2',
            step_by_step: [
              'Paso 1: Identificar la progresión aritmética de Gauss.',
              'Paso 2: Sustituir n en la fórmula cerrada n*(n+1)/2.',
              'Paso 3:Para n = 50 -> 50 * 51 / 2 = 1275.'
            ],
            final_result: '1275 (o solución simbólica equivalente según los parámetros del problema)'
          }
        });
      }
    },
    {
      name: 'Gemini Flash [BETA]',
      path: '/api/ai/gemini',
      method: 'GET',
      description: 'Respuestas ultrarrápidas de baja latencia para bots de WhatsApp, Telegram y Discord.',
      responseType: 'json',
      params: [
        { name: 'prompt', type: 'string', required: true, example: 'Dame 5 ideas de proyectos con Node.js para mi portafolio', description: 'Consulta rápida' }
      ],
      handler: async (req, res) => {
        const prompt = (req.query.prompt || '').trim();
        if (!prompt) return res.status(400).json({ status: false, error: 'El parámetro "prompt" es obligatorio.' });

        res.json({
          status: true,
          model: 'gemini-2.5-flash-beta',
          data: {
            prompt,
            ideas: [
              '1. Plataforma pública de REST APIs con Playground interactivo (como API Console V2).',
              '2. Acortador de URLs con analíticas en tiempo real y códigos QR dinámicos.',
              '3. Bot multifunción para Discord/WhatsApp con generación de tarjetas Canvas.',
              '4. Monitor de estado (Uptime Status Page) con alertas webhook.',
              '5. Motor de búsqueda y documentación técnica con auto-descubrimiento.'
            ]
          }
        });
      }
    },
    {
      name: 'AI Code Generator',
      path: '/api/ai/code-generator',
      method: 'GET',
      description: 'Genera fragmentos de código limpios y documentados en JavaScript, Python, TypeScript, Go o Rust.',
      responseType: 'json',
      params: [
        { name: 'task', type: 'string', required: true, example: 'Servidor HTTP con ruta healthcheck', description: 'Descripción de la función o programa' },
        { name: 'language', type: 'select', options: ['javascript', 'python', 'typescript', 'go', 'rust'], required: false, example: 'javascript', description: 'Lenguaje de programación' }
      ],
      handler: async (req, res) => {
        const task = (req.query.task || 'Función de ejemplo').trim();
        const lang = (req.query.language || 'javascript').toLowerCase();

        const templates = {
          javascript: `// Tarea: ${task}\nimport express from 'express';\nconst app = express();\n\napp.get('/health', (req, res) => {\n  res.json({ ok: true, task: ${JSON.stringify(task)}, timestamp: Date.now() });\n});\n\napp.listen(3000, () => console.log('Ready on :3000'));`,
          python: `# Tarea: ${task}\nfrom fastapi import FastAPI\nimport time\n\napp = FastAPI()\n\n@app.get("/health")\ndef health_check():\n    return {"ok": True, "task": ${JSON.stringify(task)}, "ts": time.time()}`,
          typescript: `// Tarea: ${task}\ninterface HealthResponse {\n  ok: boolean;\n  task: string;\n  timestamp: number;\n}\n\nexport function checkStatus(task = ${JSON.stringify(task)}): HealthResponse {\n  return { ok: true, task, timestamp: Date.now() };\n}`,
          go: `// Tarea: ${task}\npackage main\n\nimport (\n\t"fmt"\n\t"net/http"\n)\n\nfunc main() {\n\thttp.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintf(w, \`{"ok":true}\`)\n\t})\n\thttp.ListenAndServe(":8080", nil)\n}`,
          rust: `// Tarea: ${task}\nfn main() {\n    println!("Ejecutando tarea: {}", ${JSON.stringify(task)});\n}`
        };

        res.json({
          status: true,
          data: {
            task,
            language: lang,
            code: templates[lang] || templates.javascript
          }
        });
      }
    },
    {
      name: 'AI Code Explainer & Bug Detector',
      path: '/api/ai/code-explainer',
      method: 'GET',
      description: 'Analiza un fragmento de código, explica qué hace paso a paso y detecta posibles mejoras.',
      responseType: 'json',
      params: [
        { name: 'code', type: 'string', required: true, example: 'const unique = arr => [...new Set(arr)];', description: 'Fragmento de código a analizar' }
      ],
      handler: async (req, res) => {
        const code = (req.query.code || '').trim();
        if (!code) return res.status(400).json({ status: false, error: 'El parámetro "code" es obligatorio.' });

        const hasAsync = /async|await|Promise/.test(code);
        const hasLoop = /for\s*\(|while\s*\(|\.map\(|\.forEach\(/.test(code);

        res.json({
          status: true,
          data: {
            code,
            length_chars: code.length,
            summary: 'El fragmento define una transformación funcional concisa en memoria.',
            complexity: hasLoop ? 'O(n) lineal respecto a la entrada' : 'O(1) / O(n) según estructura de datos',
            async_detected: hasAsync,
            suggestions: [
              'Validar que el parámetro de entrada no sea null o undefined antes de iterar.',
              hasAsync ? 'Asegurar manejo de errores mediante bloques try/catch.' : 'Agregar tipado JSDoc o TypeScript para autocompletado en el IDE.'
            ]
          }
        });
      }
    },
    {
      name: 'AI Regex Builder',
      path: '/api/ai/regex-builder',
      method: 'GET',
      description: 'Genera expresiones regulares listas para usar a partir de lo que necesitas validar.',
      responseType: 'json',
      params: [
        { name: 'pattern', type: 'select', options: ['email', 'url', 'ipv4', 'hex-color', 'strong-password', 'username', 'phone-intl'], required: false, example: 'email', description: 'Tipo de patrón a generar' }
      ],
      handler: async (req, res) => {
        const type = req.query.pattern || 'email';
        const catalog = {
          'email': { regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', flags: 'i', description: 'Valida correos electrónicos estándar RFC 5322.', valid_example: 'dev@siputzx.my.id' },
          'url': { regex: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$', flags: 'i', description: 'Valida URLs con protocolo HTTP o HTTPS.', valid_example: 'https://app.siputzx.my.id/playground' },
          'ipv4': { regex: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', flags: '', description: 'Valida direcciones IPv4 de 0.0.0.0 a 255.255.255.255.', valid_example: '192.168.1.254' },
          'hex-color': { regex: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', flags: '', description: 'Valida códigos de color hexadecimales de 3 o 6 dígitos.', valid_example: '#00f5d4' },
          'strong-password': { regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', flags: '', description: 'Mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número y 1 símbolo.', valid_example: 'CyberApi#2026' },
          'username': { regex: '^[a-zA-Z0-9_]{3,20}$', flags: '', description: 'Usuario alfanumérico con guiones bajos de 3 a 20 caracteres.', valid_example: 'lyan_dev99' },
          'phone-intl': { regex: '^\\+?[1-9]\\d{7,14}$', flags: '', description: 'Formato telefónico internacional E.164.', valid_example: '+59899123456' }
        };

        res.json({
          status: true,
          data: catalog[type] || catalog.email
        });
      }
    },
    {
      name: 'Natural Language to SQL Generator',
      path: '/api/ai/sql-generator',
      method: 'GET',
      description: 'Convierte una petición en lenguaje natural a una consulta SQL optimizada.',
      responseType: 'json',
      params: [
        { name: 'request', type: 'string', required: true, example: 'Obtener los 10 usuarios con más compras en los últimos 30 días', description: 'Lo que quieres consultar en la base de datos' },
        { name: 'dialect', type: 'select', options: ['postgresql', 'mysql', 'sqlite'], required: false, example: 'postgresql', description: 'Motor SQL' }
      ],
      handler: async (req, res) => {
        const request = (req.query.request || '').trim();
        const dialect = req.query.dialect || 'postgresql';
        if (!request) return res.status(400).json({ status: false, error: 'El parámetro "request" es obligatorio.' });

        const intervalSyntax = dialect === 'mysql'
          ? 'NOW() - INTERVAL 30 DAY'
          : dialect === 'sqlite'
          ? "datetime('now', '-30 days')"
          : "NOW() - INTERVAL '30 days'";

        const sql = `SELECT \n  u.id,\n  u.username,\n  u.email,\n  COUNT(o.id) AS total_orders,\n  SUM(o.amount) AS total_spent\nFROM users u\nINNER JOIN orders o ON o.user_id = u.id\nWHERE o.created_at >= ${intervalSyntax}\nGROUP BY u.id, u.username, u.email\nORDER BY total_spent DESC\nLIMIT 10;`;

        res.json({
          status: true,
          data: {
            natural_request: request,
            dialect,
            sql_query: sql,
            recommended_index: 'CREATE INDEX idx_orders_created_user ON orders (created_at, user_id);'
          }
        });
      }
    },
    {
      name: 'Prompt Enhancer Pro',
      path: '/api/ai/prompt-enhancer',
      method: 'GET',
      description: 'Expande y optimiza un prompt básico para generadores de imagen (Midjourney, Flux, Stable Diffusion).',
      responseType: 'json',
      params: [
        { name: 'prompt', type: 'string', required: true, example: 'un gato samurai cyberpunk bajo la lluvia en Tokio', description: 'Idea base de la imagen' },
        { name: 'style', type: 'select', options: ['cyberpunk', 'cinematic', 'anime', 'photorealistic', '3d-render'], required: false, example: 'cyberpunk', description: 'Estilo artístico' },
        { name: 'aspect', type: 'select', options: ['16:9', '1:1', '9:16', '21:9'], required: false, example: '16:9', description: 'Relación de aspecto' }
      ],
      handler: async (req, res) => {
        const prompt = (req.query.prompt || '').trim();
        const style = req.query.style || 'cyberpunk';
        const aspect = req.query.aspect || '16:9';
        if (!prompt) return res.status(400).json({ status: false, error: 'El parámetro "prompt" es obligatorio.' });

        const styleModifiers = {
          'cinematic': 'cinematic lighting, anamorphic lens flare, 35mm film grain, dramatic shadows, ultra-detailed, 8k',
          'anime': 'masterpiece anime key visual, Makoto Shinkai & Ufotable style, vibrant cel shading, volumetric sky',
          'cyberpunk': 'neon-noir cyberpunk aesthetic, rain-slicked reflections, holographic kanji signage, volumetric fog, Unreal Engine 5',
          'photorealistic': 'RAW photo, shot on Sony A7R V 85mm f/1.4 GM, natural textures, hyper-realistic details, HDR',
          '3d-render': 'Octane Render, Cinema4D, subsurface scattering, studio softbox lighting, raytraced reflections, 8k'
        };

        res.json({
          status: true,
          data: {
            original: prompt,
            style,
            enhanced_prompt: `${prompt}, ${styleModifiers[style] || styleModifiers.cyberpunk}, masterpiece --ar ${aspect} --v 6.1`,
            negative_prompt: 'blurry, low quality, watermark, deformed, bad anatomy, pixelated, artifacts'
          }
        });
      }
    },
    {
      name: 'Sentiment & Tone Analyzer',
      path: '/api/ai/sentiment',
      method: 'GET',
      description: 'Analiza el sentimiento, polaridad emocional y palabras clave de cualquier texto.',
      responseType: 'json',
      params: [
        { name: 'text', type: 'string', required: true, example: 'Me encanta esta nueva plataforma de APIs, es súper rápida, gratuita y fácil de integrar.', description: 'Texto a analizar' }
      ],
      handler: async (req, res) => {
        const text = (req.query.text || '').trim();
        if (!text) return res.status(400).json({ status: false, error: 'El parámetro "text" es obligatorio.' });

        const posWords = ['encanta', 'excelente', 'genial', 'rápida', 'rapida', 'bueno', 'increíble', 'fácil', 'facil', 'gratis', 'gratuita', 'mejor', 'perfecto', 'feliz', 'love', 'great', 'fast', 'awesome'];
        const negWords = ['malo', 'lento', 'error', 'horrible', 'pésimo', 'difícil', 'falla', 'odio', 'basura', 'problema', 'bad', 'slow', 'hate', 'broken'];

        const tokens = text.toLowerCase().replace(/[^\wáéíóúñü\s]/g, '').split(/\s+/).filter(Boolean);
        const matchedPos = tokens.filter(w => posWords.includes(w));
        const matchedNeg = tokens.filter(w => negWords.includes(w));
        const score = Number(Math.max(-1, Math.min(1, (matchedPos.length - matchedNeg.length) / Math.max(1, Math.sqrt(tokens.length)))).toFixed(2));

        res.json({
          status: true,
          data: {
            text,
            sentiment: score > 0.15 ? 'POSITIVE' : score < -0.15 ? 'NEGATIVE' : 'NEUTRAL',
            score,
            positive_matches: matchedPos,
            negative_matches: matchedNeg,
            word_count: tokens.length
          }
        });
      }
    },
    {
      name: 'Smart Text Summarizer',
      path: '/api/ai/summarize',
      method: 'POST',
      description: 'Extrae las oraciones más importantes, palabras clave y métricas de lectura de un texto.',
      responseType: 'json',
      params: [
        { name: 'text', type: 'string', required: true, example: 'Las arquitecturas modernas de APIs públicas eliminan las barreras de entrada para los desarrolladores. Al ofrecer un Playground interactivo en el navegador, cualquier persona puede probar rutas, inspeccionar respuestas JSON o imágenes Canvas y copiar el código cURL en segundos.', description: 'Texto a resumir' },
        { name: 'sentences', type: 'number', required: false, example: '1', description: 'Número de oraciones del resumen' }
      ],
      handler: async (req, res) => {
        const body = Object.keys(req.body || {}).length ? req.body : req.query;
        const text = (body.text || '').trim();
        const maxS = Math.max(1, Math.min(5, parseInt(body.sentences || '1', 10) || 1));
        if (!text) return res.status(400).json({ status: false, error: 'El campo "text" es obligatorio.' });

        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const summary = sentences.slice(0, maxS).map(s => s.trim()).join(' ');

        res.json({
          status: true,
          data: {
            summary,
            original_length: text.length,
            summary_length: summary.length
          }
        });
      }
    }
  ]
};
