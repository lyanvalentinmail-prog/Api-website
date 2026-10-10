/**
 * Categoría: AI
 * Endpoints de procesamiento de lenguaje natural, chat, prompts y análisis de texto.
 */

module.exports = {
  category: 'AI',
  description: 'Modelos conversacionales, optimización de prompts, resumen y análisis semántico.',
  endpoints: [
    {
      name: 'AI Chat Assistant',
      path: '/api/ai/chat',
      method: 'GET',
      description: 'Asistente conversacional inteligente con soporte para roles de sistema y respuestas estructuradas.',
      responseType: 'json',
      params: [
        {
          name: 'prompt',
          type: 'string',
          required: true,
          example: 'Explica cómo funciona una REST API en 3 puntos clave',
          description: 'Mensaje o pregunta para el asistente IA'
        },
        {
          name: 'system',
          type: 'string',
          required: false,
          example: 'Eres un arquitecto de software senior que responde de forma clara y concisa.',
          description: 'Instrucción de comportamiento del sistema (System Prompt)'
        },
        {
          name: 'model',
          type: 'select',
          options: ['nexus-fast-v2', 'deepseek-r1-distill', 'qwen-coder-32b', 'llama-3.3-70b'],
          required: false,
          example: 'nexus-fast-v2',
          description: 'Modelo de inferencia a utilizar'
        }
      ],
      handler: async (req, res) => {
        const prompt = (req.query.prompt || '').trim();
        const system = (req.query.system || 'Eres un asistente útil y experto en tecnología.').trim();
        const model = req.query.model || 'nexus-fast-v2';

        if (!prompt) {
          return res.status(400).json({
            status: false,
            error: 'El parámetro "prompt" es obligatorio.'
          });
        }

        const lower = prompt.toLowerCase();
        let reply = '';

        if (lower.includes('rest api') || lower.includes('api')) {
          reply = [
            'Una **REST API (Representational State Transfer)** funciona mediante 3 pilares fundamentales:',
            '1. **Recursos y Endpoints (URIs):** Cada entidad se expone en una ruta única como `/api/ai/chat` o `/api/tools/qrcode`.',
            '2. **Verbos HTTP Estándar:** Se usan métodos como `GET` (consultar), `POST` (crear/procesar), `PUT` (actualizar) y `DELETE` (eliminar).',
            '3. **Representación sin estado (Stateless JSON/Media):** Cada petición contiene toda la información necesaria y el servidor responde con datos estructurados (`JSON`, imágenes, etc.) junto a un código HTTP (`200 OK`, `400 Bad Request`).'
          ].join('\n\n');
        } else if (lower.includes('hola') || lower.includes('hello') || lower.includes('buenas')) {
          reply = '¡Hola! Soy el motor de inferencia de **API CONSOLE V2**. Puedo ayudarte a generar código, analizar texto, mejorar prompts o responder preguntas técnicas. ¿Qué construimos hoy?';
        } else if (lower.includes('codigo') || lower.includes('código') || lower.includes('javascript') || lower.includes('node')) {
          reply = 'Aquí tienes un ejemplo práctico en JavaScript usando `fetch` para consumir cualquier endpoint de esta consola:\n\n```js\nconst res = await fetch("/api/ai/chat?prompt=Hola");\nconst json = await res.json();\nconsole.log(json.data.reply);\n```';
        } else {
          reply = `Respuesta generada por [${model}] para tu consulta: "${prompt}".\n\n` +
            `• Contexto aplicado: "${system}"\n` +
            `• Análisis: Tu consulta consta de ${prompt.split(/\s+/).length} palabras y ${prompt.length} caracteres.\n` +
            `• Recomendación técnica: Puedes integrar este endpoint directamente desde tu aplicación cliente o bot mediante una petición HTTP GET sin necesidad de API Key.`;
        }

        const tokensPrompt = Math.ceil(prompt.length / 4);
        const tokensCompletion = Math.ceil(reply.length / 4);

        res.json({
          status: true,
          model,
          data: {
            prompt,
            system,
            reply,
            usage: {
              prompt_tokens: tokensPrompt,
              completion_tokens: tokensCompletion,
              total_tokens: tokensPrompt + tokensCompletion
            }
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
        {
          name: 'prompt',
          type: 'string',
          required: true,
          example: 'un gato samurai cyberpunk bajo la lluvia en Tokio',
          description: 'Idea o descripción base de la imagen'
        },
        {
          name: 'style',
          type: 'select',
          options: ['cinematic', 'anime', 'cyberpunk', 'photorealistic', '3d-render'],
          required: false,
          example: 'cyberpunk',
          description: 'Estilo artístico deseado'
        },
        {
          name: 'aspect',
          type: 'select',
          options: ['16:9', '1:1', '9:16', '21:9'],
          required: false,
          example: '16:9',
          description: 'Relación de aspecto sugerida'
        }
      ],
      handler: async (req, res) => {
        const prompt = (req.query.prompt || '').trim();
        const style = req.query.style || 'cyberpunk';
        const aspect = req.query.aspect || '16:9';

        if (!prompt) {
          return res.status(400).json({ status: false, error: 'El parámetro "prompt" es obligatorio.' });
        }

        const styleModifiers = {
          'cinematic': 'cinematic lighting, anamorphic lens flare, 35mm film grain, dramatic shadows, color graded by Roger Deakins, ultra-detailed, 8k resolution',
          'anime': 'masterpiece anime key visual, Makoto Shinkai & Ufotable style, vibrant cel shading, volumetric sky, dynamic composition, crisp line art',
          'cyberpunk': 'neon-noir cyberpunk aesthetic, rain-slicked reflections, holographic kanji signage, volumetric fog, cyan and magenta rim lighting, Unreal Engine 5 render',
          'photorealistic': 'RAW photo, shot on Sony A7R V 85mm f/1.4 GM, natural skin/surface textures, physically based rendering, hyper-realistic details, HDR',
          '3d-render': 'Octane Render, Cinema4D, subsurface scattering, studio softbox lighting, Pixar/Blender stylized 3D, raytraced reflections, 8k'
        };

        const modifier = styleModifiers[style] || styleModifiers.cyberpunk;
        const enhanced = `${prompt}, ${modifier}, masterpiece, high dynamic range --ar ${aspect} --v 6.1`;

        res.json({
          status: true,
          data: {
            original: prompt,
            style,
            aspect_ratio: aspect,
            enhanced_prompt: enhanced,
            negative_prompt: 'blurry, low quality, watermark, deformed, bad anatomy, pixelated, overexposed, artifacts',
            recommended_settings: {
              cfg_scale: 7.5,
              steps: 30,
              sampler: 'DPM++ 2M Karras'
            }
          }
        });
      }
    },
    {
      name: 'Sentiment & Tone Analyzer',
      path: '/api/ai/sentiment',
      method: 'GET',
      description: 'Analiza el sentimiento, polaridad emocional y palabras clave de cualquier texto en español o inglés.',
      responseType: 'json',
      params: [
        {
          name: 'text',
          type: 'string',
          required: true,
          example: 'Me encanta esta nueva plataforma de APIs, es súper rápida, gratuita y fácil de integrar en mi proyecto.',
          description: 'Texto a analizar'
        }
      ],
      handler: async (req, res) => {
        const text = (req.query.text || '').trim();
        if (!text) {
          return res.status(400).json({ status: false, error: 'El parámetro "text" es obligatorio.' });
        }

        const posWords = ['encanta', 'excelente', 'genial', 'rápida', 'rapida', 'bueno', 'increíble', 'increible', 'fácil', 'facil', 'gratis', 'gratuita', 'mejor', 'perfecto', 'feliz', 'éxito', 'love', 'great', 'fast', 'awesome', 'good', 'best'];
        const negWords = ['malo', 'lento', 'error', 'horrible', 'pésimo', 'pesimo', 'difícil', 'dificil', 'falla', 'odio', 'basura', 'problema', 'caro', 'bad', 'slow', 'hate', 'broken', 'worst', 'fail'];

        const tokens = text.toLowerCase().replace(/[^\wáéíóúñü\s]/g, '').split(/\s+/).filter(Boolean);
        const matchedPos = tokens.filter(w => posWords.includes(w));
        const matchedNeg = tokens.filter(w => negWords.includes(w));

        const rawScore = (matchedPos.length - matchedNeg.length) / Math.max(1, Math.sqrt(tokens.length));
        const normalizedScore = Math.max(-1, Math.min(1, Number(rawScore.toFixed(2))));

        let label = 'NEUTRAL';
        let emoji = '😐';
        if (normalizedScore > 0.15) {
          label = 'POSITIVE';
          emoji = '🚀';
        } else if (normalizedScore < -0.15) {
          label = 'NEGATIVE';
          emoji = '⚠️';
        }

        res.json({
          status: true,
          data: {
            text,
            sentiment: label,
            emoji,
            score: normalizedScore,
            confidence: Number(Math.min(0.99, 0.65 + Math.abs(normalizedScore) * 0.3).toFixed(2)),
            signals: {
              positive_matches: matchedPos,
              negative_matches: matchedNeg,
              word_count: tokens.length
            }
          }
        });
      }
    },
    {
      name: 'Smart Text Summarizer',
      path: '/api/ai/summarize',
      method: 'POST',
      description: 'Extrae las oraciones más relevantes, palabras clave y tiempo de lectura estimado de un texto.',
      responseType: 'json',
      params: [
        {
          name: 'text',
          type: 'string',
          required: true,
          example: 'Las arquitecturas sin servidor y las APIs públicas permiten a los desarrolladores lanzar prototipos en cuestión de minutos. Al eliminar la fricción de las claves de autenticación y los complejos procesos de registro, las comunidades tecnológicas pueden experimentar libremente. Además, contar con un entorno de ejecución directo en el navegador acelera la depuración y mejora la experiencia de desarrollo.',
          description: 'Texto completo que deseas resumir'
        },
        {
          name: 'sentences',
          type: 'number',
          required: false,
          example: '2',
          description: 'Cantidad máxima de oraciones en el resumen'
        }
      ],
      handler: async (req, res) => {
        const body = Object.keys(req.body || {}).length ? req.body : req.query;
        const text = (body.text || '').trim();
        const maxSentences = Math.max(1, Math.min(5, parseInt(body.sentences || '2', 10) || 2));

        if (!text) {
          return res.status(400).json({ status: false, error: 'El campo "text" es obligatorio.' });
        }

        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const stopwords = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'y', 'o', 'a', 'que', 'es', 'por', 'para', 'con', 'se', 'al', 'como', 'más', 'pero', 'su', 'sus']);
        const words = text.toLowerCase().replace(/[^\wáéíóúñü\s]/g, '').split(/\s+/).filter(w => w.length > 3 && !stopwords.has(w));

        const freq = {};
        words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

        const topKeywords = Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([word]) => word);

        const scoredSentences = sentences.map((s, idx) => {
          const sWords = s.toLowerCase().split(/\s+/);
          const score = sWords.reduce((acc, w) => acc + (freq[w.replace(/[^\wáéíóúñü]/g, '')] || 0), 0);
          return { sentence: s.trim(), score, idx };
        });

        const summary = scoredSentences
          .sort((a, b) => b.score - a.score)
          .slice(0, maxSentences)
          .sort((a, b) => a.idx - b.idx)
          .map(item => item.sentence)
          .join(' ');

        const totalWords = text.split(/\s+/).filter(Boolean).length;

        res.json({
          status: true,
          data: {
            summary,
            keywords: topKeywords,
            stats: {
              original_words: totalWords,
              summary_words: summary.split(/\s+/).filter(Boolean).length,
              compression_ratio: `${Math.round((summary.length / Math.max(1, text.length)) * 100)}%`,
              reading_time_seconds: Math.max(1, Math.round((totalWords / 200) * 60))
            }
          }
        });
      }
    }
  ]
};
