/**
 * Categoría: TOOLS
 * Herramientas esenciales para desarrolladores: QR Code, Hashing, UUID, Contraseñas, Base64, Paletas y Test VCC.
 */

const crypto = require('crypto');
const QRCode = require('qrcode');

function generateLuhnCard(prefix, length = 16) {
  let num = prefix;
  while (num.length < length - 1) {
    num += Math.floor(Math.random() * 10);
  }
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
  description: 'Utilidades de criptografía, códigos QR, generadores de tokens, colores y herramientas de testing.',
  endpoints: [
    {
      name: 'QR Code Generator',
      path: '/api/tools/qrcode',
      method: 'GET',
      description: 'Genera un código QR escaneable en formato de imagen SVG directa o respuesta JSON.',
      responseType: 'image',
      params: [
        { name: 'text', type: 'string', required: true, example: 'https://github.com/lyanvalentinmail-prog/Api-website', description: 'Texto o URL a codificar en el QR' },
        { name: 'format', type: 'select', options: ['svg', 'json'], required: false, example: 'svg', description: 'Formato de salida (svg devuelve imagen directa)' }
      ],
      handler: async (req, res) => {
        const text = (req.query.text || '').trim();
        const format = (req.query.format || 'svg').toLowerCase();

        if (!text) {
          return res.status(400).json({ status: false, error: 'El parámetro "text" es obligatorio.' });
        }

        const svg = await QRCode.toString(text, {
          type: 'svg',
          width: 300,
          margin: 2,
          color: {
            dark: '#00f5d4',
            light: '#090d16'
          }
        });

        if (format === 'json') {
          const dataUrl = await QRCode.toDataURL(text, { width: 300, margin: 2 });
          return res.json({
            status: true,
            data: {
              text,
              data_url: dataUrl
            }
          });
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

        if (!text) {
          return res.status(400).json({ status: false, error: 'El parámetro "text" es obligatorio.' });
        }

        const hash = crypto.createHash(selectedAlgo).update(text).digest('hex');

        res.json({
          status: true,
          data: {
            input: text,
            algorithm: selectedAlgo.toUpperCase(),
            hash,
            bits: hash.length * 4
          }
        });
      }
    },
    {
      name: 'Secure Password & Entropy Generator',
      path: '/api/tools/password',
      method: 'GET',
      description: 'Genera contraseñas criptográficamente seguras y calcula su entropía en bits.',
      responseType: 'json',
      params: [
        { name: 'length', type: 'number', required: false, example: '20', description: 'Longitud de la contraseña (8 - 64)' },
        { name: 'symbols', type: 'select', options: ['true', 'false'], required: false, example: 'true', description: 'Incluir caracteres especiales' }
      ],
      handler: async (req, res) => {
        const length = Math.max(8, Math.min(64, parseInt(req.query.length || '20', 10) || 20));
        const useSymbols = String(req.query.symbols ?? 'true') !== 'false';

        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + (useSymbols ? '!@#$%^&*()-_=+[]{}<>?' : '');
        const bytes = crypto.randomBytes(length);
        let password = '';
        for (let i = 0; i < length; i++) {
          password += chars[bytes[i] % chars.length];
        }

        const entropyBits = Math.round(length * Math.log2(chars.length));

        res.json({
          status: true,
          data: {
            password,
            length,
            entropy_bits: entropyBits,
            strength: entropyBits >= 100 ? 'VERY_STRONG' : entropyBits >= 72 ? 'STRONG' : 'MODERATE'
          }
        });
      }
    },
    {
      name: 'UUID & API Token Generator',
      path: '/api/tools/uuid',
      method: 'GET',
      description: 'Genera múltiples identificadores UUID v4 y tokens hexadecimales listos para bases de datos.',
      responseType: 'json',
      params: [
        { name: 'count', type: 'number', required: false, example: '5', description: 'Cantidad de UUIDs a generar (1 - 20)' }
      ],
      handler: async (req, res) => {
        const count = Math.max(1, Math.min(20, parseInt(req.query.count || '5', 10) || 5));
        const uuids = Array.from({ length: count }, () => crypto.randomUUID());

        res.json({
          status: true,
          count,
          data: {
            uuids,
            sample_bearer_token: `sk_live_${crypto.randomBytes(18).toString('hex')}`
          }
        });
      }
    },
    {
      name: 'Base64 Encoder / Decoder',
      path: '/api/tools/base64',
      method: 'GET',
      description: 'Codifica o decodifica cadenas en formato Base64 estándar y URL-Safe.',
      responseType: 'json',
      params: [
        { name: 'text', type: 'string', required: true, example: 'Hola desde API Console V2!', description: 'Texto a procesar' },
        { name: 'mode', type: 'select', options: ['encode', 'decode'], required: false, example: 'encode', description: 'Operación a realizar' }
      ],
      handler: async (req, res) => {
        const text = req.query.text || '';
        const mode = (req.query.mode || 'encode').toLowerCase();

        if (!text) {
          return res.status(400).json({ status: false, error: 'El parámetro "text" es obligatorio.' });
        }

        const output = mode === 'decode'
          ? Buffer.from(text, 'base64').toString('utf8')
          : Buffer.from(text, 'utf8').toString('base64');

        res.json({
          status: true,
          data: {
            mode,
            input: text,
            output
          }
        });
      }
    },
    {
      name: 'VCC Sandbox Generator (Luhn Valid)',
      path: '/api/tools/vcc-generator',
      method: 'GET',
      description: 'Genera números de tarjeta ficticios matemáticamente válidos por algoritmo de Luhn para pruebas de QA/Sandbox.',
      responseType: 'json',
      params: [
        { name: 'brand', type: 'select', options: ['visa', 'mastercard', 'amex'], required: false, example: 'visa', description: 'Red de tarjeta de prueba' },
        { name: 'count', type: 'number', required: false, example: '3', description: 'Cantidad a generar (1 - 10)' }
      ],
      handler: async (req, res) => {
        const brand = (req.query.brand || 'visa').toLowerCase();
        const count = Math.max(1, Math.min(10, parseInt(req.query.count || '3', 10) || 3));
        const prefixes = { visa: '4532', mastercard: '5425', amex: '3782' };
        const prefix = prefixes[brand] || '4532';
        const len = brand === 'amex' ? 15 : 16;

        const cards = Array.from({ length: count }, () => {
          const number = generateLuhnCard(prefix, len);
          const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
          const year = String(2027 + Math.floor(Math.random() * 4));
          const cvv = String(Math.floor(100 + Math.random() * 900));
          return {
            brand: brand.toUpperCase(),
            card_number: number,
            expiry: `${month}/${year}`,
            cvv,
            luhn_valid: true,
            purpose: 'SANDBOX_TESTING_ONLY'
          };
        });

        res.json({
          status: true,
          data: cards
        });
      }
    }
  ]
};
