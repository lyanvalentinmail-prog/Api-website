/**
 * API CONSOLE V2 - Servidor Principal (Estilo Siputzx API Playground)
 * Auto-descubre todos los endpoints en src/routes/*.js y sirve la Landing Page (/) y el Playground (/playground).
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const registry = require('./src/registry');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Middlewares globales
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Cabeceras amigables con previsualización y clientes externos
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  res.removeHeader('X-Frame-Options');
  next();
});

// 1. Cargar y registrar automáticamente todos los endpoints desde src/routes/*.js
registry.loadAllRoutes(app);

// 2. Endpoints de sistema para el Playground y SDKs (Auto-Discovery & Telemetría)
app.get('/api/endpoints', (req, res) => {
  res.json(registry.getCatalog());
});

app.get('/api/stats', (req, res) => {
  res.json(registry.getStats());
});

// 3. Endpoint interactivo para registrar nuevos endpoints en caliente desde el Playground UI
app.post('/api/admin/register-endpoint', (req, res) => {
  const { name, path: routePath, method = 'GET', category = 'CUSTOM', description = '', params = [], sampleResponse = {} } = req.body || {};

  if (!name || !routePath) {
    return res.status(400).json({
      status: false,
      error: 'Los campos "name" y "path" son obligatorios.'
    });
  }

  const normalizedPath = routePath.startsWith('/api/')
    ? routePath
    : `/api/${routePath.replace(/^\/+/, '')}`;

  const metadata = registry.registerEndpoint(app, category.toUpperCase(), {
    name,
    path: normalizedPath,
    method: method.toUpperCase(),
    description,
    responseType: 'json',
    params,
    handler: async (reqObj, resObj) => {
      const receivedParams = reqObj.method === 'GET' ? reqObj.query : reqObj.body;
      resObj.json({
        status: true,
        endpoint: name,
        received_params: receivedParams,
        data: sampleResponse && Object.keys(sampleResponse).length
          ? sampleResponse
          : {
              message: `Respuesta exitosa desde tu endpoint personalizado ${normalizedPath}`,
              params_echo: receivedParams
            }
      });
    }
  });

  res.json({
    status: true,
    message: `Endpoint ${normalizedPath} registrado en caliente y disponible en el Playground.`,
    endpoint: metadata
  });
});

// 4. Archivos estáticos y rutas principales de interfaz
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get(['/playground', '/playground/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'playground.html'));
});

// Manejador 404 JSON para rutas /api/* no encontradas
app.use('/api', (req, res) => {
  res.status(404).json({
    status: false,
    error: `El endpoint ${req.method} ${req.originalUrl} no existe.`,
    hint: 'Visita /playground o consulta /api/endpoints para ver la lista completa de rutas activas.'
  });
});

// Fallback para otras rutas hacia la Landing
app.use((req, res) => {
  res.redirect('/');
});

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    const catalog = registry.getCatalog();
    console.log(`========================================================`);
    console.log(`🚀 API CONSOLE V2 ejecutándose en http://${HOST}:${PORT}`);
    console.log(`📦 Categorías cargadas : ${catalog.total_categories}`);
    console.log(`⚡ Endpoints activos   : ${catalog.total_endpoints}`);
    console.log(`🎮 Playground URL      : http://${HOST}:${PORT}/playground`);
    console.log(`========================================================`);
  });
}

module.exports = app;

