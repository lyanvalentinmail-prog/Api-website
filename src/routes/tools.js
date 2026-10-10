/**
 * Categoría: TOOLS (14 Endpoints)
 * Utilidades para desarrolladores: QR, Hashing, Contraseñas, UUID, Base64, VCC, JWT, Cron, Color, Unidades, Ipsum, Slug, CIDR y User-Agent.
 */

const crypto = require('crypto');
const QRCode = require('qrcode');

function generateLuhnCard(prefix, length = 16) {
  let num = prefix;
  while (num.length < length - 1) num += Math.floor(Math.random() * 10);
  let sum = 0;
  let shouldDouble = true;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return num + checkDigit;
}

module.exports = {
  category: 'TOOLS',
  description: 'Criptografía, códigos QR, JWT, Cron, calculadoras de red CIDR, paletas de colores y utilidades de desarrollo.',
  endpoints: [
    {
      name: 'QR Code Generator',
      path: '/api/tools/qrcode',
      method: 'GET',
      description: 'Genera un código QR escaneable en formato de imagen SVG directa o JSON.',
      responseType: 'image',
      params: [
        { name: 'text', type: 'string', required: true, example: 'https://github.com/lyanvalentinmail-prog/Api-website', description: 'Texto o URL a codificar' },
        { name: 'format', type: 'select', options: ['svg', 'json'], required: false, example: 'svg', description: 'Formato de salida' }
      ],
      handler: async (req, res) => {
        const text = (req.query.text || '').trim();
        const format = (req.query.format || 'svg').toLowerCase();
        if (!text) return res.status(400).json({ status: false, error: 'El parámetro "text" es obligatorio.' });

        const svg = await QRCode.toString(text, {
          type: 'svg',
          width: 300,
          margin: 2,
          color: { dark: '#00f5d4', light: '#090d16' }
        });

        if (format === 'json') {
          const dataUrl = await QRCode.toDataURL(text, { width: 300, margin: 2 });
          return res.json({ status: true, data: { text, data_url: dataUrl } });
        }

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
      }
    },
    {
      name: 'Cryptographic Hash Generator',
      path: '/api/tools/hash',
      method: 'GET',
      description: 'Calcula hashes criptográficos (SHA-256, SHA-512, SHA-1, MD5) a partir de cualquier cadena.',
      responseType: 'json',
      params: [
        { name: 'text', type: 'string', required: true, example: 'api-console-v2-secret', description: 'Texto de entrada' },
        { name: 'algorithm', type: 'select', options: ['sha256', 'sha512', 'sha1', 'md5'], required: false, example: 'sha256', description: 'Algoritmo hash' }
      ],
      handler: async (req, res) => {
        const text = req.query.text || '';
        const algo = (req.query.algorithm || 'sha256').toLowerCase();
        const allowed = ['sha256', 'sha512', 'sha1', 'md5'];
        const selectedAlgo = allowed.includes(algo) ? algo : 'sha256';
        if (!text) return res.status(400).json({ status: false, error: 'El parámetro "text" es obligatorio.' });

        const hash = crypto.createHash(selectedAlgo).update(text).digest('hex');
        res.json({ status: true, data: { input: text, algorithm: selectedAlgo.toUpperCase(), hash, bits: hash.length * 4 } });
      }
    },
    {
      name: 'Secure Password & Entropy Generator',
      path: '/api/tools/password',
      method: 'GET',
      description: 'Genera contraseñas criptográficamente seguras y calcula su entropía en bits.',
      responseType: 'json',
      params: [
        { name: 'length', type: 'number', required: false, example: '20', description: 'Longitud (8 - 64)' },
        { name: 'symbols', type: 'select', options: ['true', 'false'], required: false, example: 'true', description: 'Incluir símbolos' }
      ],
      handler: async (req, res) => {
        const length = Math.max(8, Math.min(64, parseInt(req.query.length || '20', 10) || 20));
        const useSymbols = String(req.query.symbols ?? 'true') !== 'false';
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + (useSymbols ? '!@#$%^&*()-_=+[]{}<>?' : '');
        const bytes = crypto.randomBytes(length);
        let password = '';
        for (let i = 0; i < length; i++) password += chars[bytes[i] % chars.length];
        const entropyBits = Math.round(length * Math.log2(chars.length));
        res.json({
          status: true,
          data: { password, length, entropy_bits: entropyBits, strength: entropyBits >= 100 ? 'VERY_STRONG' : 'STRONG' }
        });
      }
    },
    {
      name: 'UUID & API Token Generator',
      path: '/api/tools/uuid',
      method: 'GET',
      description: 'Genera múltiples identificadores UUID v4 y tokens hexadecimales.',
      responseType: 'json',
      params: [
        { name: 'count', type: 'number', required: false, example: '5', description: 'Cantidad (1 - 20)' }
      ],
      handler: async (req, res) => {
        const count = Math.max(1, Math.min(20, parseInt(req.query.count || '5', 10) || 5));
        const uuids = Array.from({ length: count }, () => crypto.randomUUID());
        res.json({ status: true, count, data: { uuids, sample_bearer_token: `sk_live_${crypto.randomBytes(18).toString('hex')}` } });
      }
    },
    {
      name: 'Base64 Encoder / Decoder',
      path: '/api/tools/base64',
      method: 'GET',
      description: 'Codifica o decodifica cadenas en formato Base64.',
      responseType: 'json',
      params: [
        { name: 'text', type: 'string', required: true, example: 'Hola desde API Console V2!', description: 'Texto a procesar' },
        { name: 'mode', type: 'select', options: ['encode', 'decode'], required: false, example: 'encode', description: 'Operación' }
      ],
      handler: async (req, res) => {
        const text = req.query.text || '';
        const mode = (req.query.mode || 'encode').toLowerCase();
        if (!text) return res.status(400).json({ status: false, error: 'El parámetro "text" es obligatorio.' });

        const output = mode === 'decode' ? Buffer.from(text, 'base64').toString('utf8') : Buffer.from(text, 'utf8').toString('base64');
        res.json({ status: true, data: { mode, input: text, output } });
      }
    },
    {
      name: 'VCC Sandbox Generator (Luhn Valid)',
      path: '/api/tools/vcc-generator',
      method: 'GET',
      description: 'Genera números de tarjeta ficticios válidos por algoritmo de Luhn para pruebas de QA.',
      responseType: 'json',
      params: [
        { name: 'brand', type: 'select', options: ['visa', 'mastercard', 'amex'], required: false, example: 'visa', description: 'Marca' },
        { name: 'count', type: 'number', required: false, example: '3', description: 'Cantidad (1 - 10)' }
      ],
      handler: async (req, res) => {
        const brand = (req.query.brand || 'visa').toLowerCase();
        const count = Math.max(1, Math.min(10, parseInt(req.query.count || '3', 10) || 3));
        const prefixes = { visa: '4532', mastercard: '5425', amex: '3782' };
        const prefix = prefixes[brand] || '4532';
        const len = brand === 'amex' ? 15 : 16;

        const cards = Array.from({ length: count }, () => ({
          brand: brand.toUpperCase(),
          card_number: generateLuhnCard(prefix, len),
          expiry: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${2027 + Math.floor(Math.random() * 4)}`,
          cvv: String(Math.floor(100 + Math.random() * 900)),
          luhn_valid: true,
          purpose: 'SANDBOX_TESTING_ONLY'
        }));
        res.json({ status: true, data: cards });
      }
    },
    {
      name: 'JWT Token Decoder & Inspector',
      path: '/api/tools/jwt-decoder',
      method: 'GET',
      description: 'Decodifica el Header y Payload de cualquier JSON Web Token (JWT) y verifica su expiración.',
      responseType: 'json',
      params: [
        {
          name: 'token',
          type: 'string',
          required: true,
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEwMjQiLCJuYW1lIjoiTHlhbiBWYWxlbnRpbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MDAwMDAwMH0.signature',
          description: 'Token JWT separado por puntos'
        }
      ],
      handler: async (req, res) => {
        const token = (req.query.token || '').trim();
        const parts = token.split('.');
        if (parts.length < 2) {
          return res.status(400).json({ status: false, error: 'Formato JWT inválido. Debe contener al menos Header y Payload separados por punto.' });
        }
        try {
          const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
          const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
          res.json({
            status: true,
            data: {
              header,
              payload,
              has_signature: Boolean(parts[2]),
              is_expired: payload.exp ? Date.now() / 1000 > payload.exp : false
            }
          });
        } catch (err) {
          res.status(400).json({ status: false, error: 'No se pudo decodificar el JWT: ' + err.message });
        }
      }
    },
    {
      name: 'Cron Expression Humanizer',
      path: '/api/tools/cron-parser',
      method: 'GET',
      description: 'Traduce una expresión Cron de 5 campos a una explicación clara en español.',
      responseType: 'json',
      params: [
        { name: 'expression', type: 'string', required: true, example: '*/15 * * * *', description: 'Expresión Cron (min hora día-mes mes día-semana)' }
      ],
      handler: async (req, res) => {
        const expr = (req.query.expression || '*/15 * * * *').trim();
        const fields = expr.split(/\s+/);
        if (fields.length !== 5) {
          return res.status(400).json({ status: false, error: 'La expresión Cron debe tener exactamente 5 campos separados por espacio.' });
        }
        const [min, hour, dom, mon, dow] = fields;
        res.json({
          status: true,
          data: {
            expression: expr,
            breakdown: { minute: min, hour, day_of_month: dom, month: mon, day_of_week: dow },
            human_readable: `Se ejecuta cuando minuto="${min}", hora="${hour}", día del mes="${dom}", mes="${mon}", día de la semana="${dow}".`
          }
        });
      }
    },
    {
      name: 'Color Converter & Palette Generator',
      path: '/api/tools/color-palette',
      method: 'GET',
      description: 'Convierte un color HEX a RGB/HSL y genera su color complementario y paleta armónica.',
      responseType: 'json',
      params: [
        { name: 'hex', type: 'string', required: true, example: '#00f5d4', description: 'Color en formato HEX' }
      ],
      handler: async (req, res) => {
        const clean = (req.query.hex || '#00f5d4').replace('#', '').trim();
        const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean.padEnd(6, '0').slice(0, 6);
        const r = parseInt(full.slice(0, 2), 16) || 0;
        const g = parseInt(full.slice(2, 4), 16) || 245;
        const b = parseInt(full.slice(4, 6), 16) || 212;
        const compHex = '#' + [255 - r, 255 - g, 255 - b].map(x => x.toString(16).padStart(2, '0')).join('');

        res.json({
          status: true,
          data: {
            hex: `#${full}`,
            rgb: `rgb(${r}, ${g}, ${b})`,
            rgb_object: { r, g, b },
            complementary: compHex,
            css_gradient: `linear-gradient(135deg, #${full}, ${compHex})`
          }
        });
      }
    },
    {
      name: 'Universal Unit Converter',
      path: '/api/tools/unit-converter',
      method: 'GET',
      description: 'Convierte valores entre unidades de temperatura, distancia, peso y almacenamiento digital.',
      responseType: 'json',
      params: [
        { name: 'value', type: 'number', required: true, example: '100', description: 'Valor numérico' },
        { name: 'conversion', type: 'select', options: ['c-to-f', 'f-to-c', 'km-to-mi', 'kg-to-lb', 'gb-to-mb'], required: false, example: 'c-to-f', description: 'Tipo de conversión' }
      ],
      handler: async (req, res) => {
        const val = parseFloat(req.query.value || '100');
        const conv = req.query.conversion || 'c-to-f';
        const formulas = {
          'c-to-f': { result: (val * 9) / 5 + 32, from: '°C', to: '°F' },
          'f-to-c': { result: ((val - 32) * 5) / 9, from: '°F', to: '°C' },
          'km-to-mi': { result: val * 0.621371, from: 'km', to: 'miles' },
          'kg-to-lb': { result: val * 2.20462, from: 'kg', to: 'lbs' },
          'gb-to-mb': { result: val * 1024, from: 'GB', to: 'MB' }
        };
        const out = formulas[conv] || formulas['c-to-f'];
        res.json({
          status: true,
          data: { input: val, from: out.from, to: out.to, result: Number(out.result.toFixed(3)) }
        });
      }
    },
    {
      name: 'Cyber & Lorem Ipsum Generator',
      path: '/api/tools/lorem-ipsum',
      method: 'GET',
      description: 'Genera párrafos de texto de relleno en estilo clásico Lorem Ipsum o Cyber/Tech Ipsum.',
      responseType: 'json',
      params: [
        { name: 'paragraphs', type: 'number', required: false, example: '2', description: 'Cantidad de párrafos (1-5)' },
        { name: 'style', type: 'select', options: ['cyber', 'classic'], required: false, example: 'cyber', description: 'Estilo del texto' }
      ],
      handler: async (req, res) => {
        const count = Math.max(1, Math.min(5, parseInt(req.query.paragraphs || '2', 10) || 2));
        const style = req.query.style || 'cyber';
        const cyberText = 'El nodo cuántico sincroniza el protocolo RESTful a través del firewall neuronal de baja latencia, desplegando contenedores efímeros en el clúster distribuido sin fricción de autenticación.';
        const classicText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';
        const unit = style === 'classic' ? classicText : cyberText;
        const paragraphs = Array.from({ length: count }, (_, i) => `${unit} (Bloque #${i + 1})`);
        res.json({ status: true, data: { style, count, paragraphs, text: paragraphs.join('\n\n') } });
      }
    },
    {
      name: 'SEO Slugify & Text Metrics',
      path: '/api/tools/slugify',
      method: 'GET',
      description: 'Transforma cualquier título con tildes o símbolos en un slug limpio para URLs y cuenta sus palabras.',
      responseType: 'json',
      params: [
        { name: 'text', type: 'string', required: true, example: '¡Cómo Crear una API Pública en Node.js & Express (2026)!', description: 'Título o texto' }
      ],
      handler: async (req, res) => {
        const text = (req.query.text || '').trim();
        const slug = text
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        res.json({
          status: true,
          data: {
            original: text,
            slug,
            char_count: text.length,
            word_count: text.split(/\s+/).filter(Boolean).length
          }
        });
      }
    },
    {
      name: 'IPv4 CIDR Subnet Calculator',
      path: '/api/tools/ip-subnet',
      method: 'GET',
      description: 'Calcula máscara de subred, cantidad de hosts disponibles y rango para una red CIDR.',
      responseType: 'json',
      params: [
        { name: 'cidr', type: 'string', required: false, example: '192.168.1.0/24', description: 'Notación IPv4/Prefijo (ej: 10.0.0.0/16 o 192.168.1.0/24)' }
      ],
      handler: async (req, res) => {
        const cidr = (req.query.cidr || '192.168.1.0/24').trim();
        const [ip, prefixStr] = cidr.split('/');
        const prefix = Math.max(8, Math.min(32, parseInt(prefixStr || '24', 10) || 24));
        const totalAddresses = Math.pow(2, 32 - prefix);
        const usableHosts = Math.max(0, totalAddresses - 2);

        res.json({
          status: true,
          data: {
            cidr: `${ip}/${prefix}`,
            network_ip: ip,
            prefix_length: `/${prefix}`,
            total_ip_addresses: totalAddresses,
            usable_hosts: usableHosts
          }
        });
      }
    },
    {
      name: 'User-Agent Parser & Generator',
      path: '/api/tools/user-agent',
      method: 'GET',
      description: 'Inspecciona el User-Agent de tu petición actual y devuelve cadenas User-Agent modernas para scraping/testing.',
      responseType: 'json',
      params: [],
      handler: async (req, res) => {
        const currentUa = req.headers['user-agent'] || 'Unknown Client';
        res.json({
          status: true,
          data: {
            your_user_agent: currentUa,
            sample_user_agents: {
              chrome_windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
              safari_macos: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
              mobile_ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
            }
          }
        });
      }
    }
  ]
};
