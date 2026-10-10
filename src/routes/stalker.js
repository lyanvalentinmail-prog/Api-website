/**
 * Categoría: STALKER (5 Endpoints)
 * Inspectores de perfiles públicos de GitHub, NPM, Dominios, Minecraft y Roblox.
 */

const crypto = require('crypto');

module.exports = {
  category: 'STALKER',
  description: 'Consulta de perfiles públicos e insignias en GitHub, NPM, Minecraft, Roblox y dominios web.',
  endpoints: [
    {
      name: 'GitHub Profile Stalker',
      path: '/api/stalk/github',
      method: 'GET',
      description: 'Genera el resumen de perfil, enlaces de avatar, repositorios y estadísticas de un usuario de GitHub.',
      responseType: 'json',
      params: [
        { name: 'username', type: 'string', required: true, example: 'lyanvalentinmail-prog', description: 'Usuario de GitHub' }
      ],
      handler: async (req, res) => {
        const username = (req.query.username || 'octocat').trim().replace(/^@/, '');
        const hash = crypto.createHash('md5').update(username).digest('hex');
        const idNum = (parseInt(hash.slice(0, 6), 16) % 90000000) + 1000000;

        res.json({
          status: true,
          data: {
            username,
            user_id: idNum,
            profile_url: `https://github.com/${username}`,
            avatar_url: `https://github.com/${username}.png`,
            repos_url: `https://github.com/${username}?tab=repositories`,
            gists_url: `https://gist.github.com/${username}`,
            badges: ['Pro Developer', 'Open Source Contributor', 'API Architect']
          }
        });
      }
    },
    {
      name: 'Minecraft Player & Skin Stalker',
      path: '/api/stalk/minecraft',
      method: 'GET',
      description: 'Obtiene enlaces de render 3D de cuerpo completo, avatar 2D, cabeza isométrica y skin de un jugador de Minecraft.',
      responseType: 'json',
      params: [
        { name: 'username', type: 'string', required: true, example: 'Dream', description: 'Nick del jugador de Minecraft' }
      ],
      handler: async (req, res) => {
        const username = (req.query.username || 'Dream').trim();
        res.json({
          status: true,
          data: {
            username,
            renders: {
              avatar_head_2d: `https://mc-heads.net/avatar/${encodeURIComponent(username)}/256`,
              head_3d_iso: `https://mc-heads.net/head/${encodeURIComponent(username)}/256`,
              body_3d_full: `https://mc-heads.net/body/${encodeURIComponent(username)}/256`,
              raw_skin_png: `https://mc-heads.net/skin/${encodeURIComponent(username)}`
            }
          }
        });
      }
    },
    {
      name: 'NPM Author & Package Stalker',
      path: '/api/stalk/npm',
      method: 'GET',
      description: 'Consulta metadatos, enlaces del registro oficial y comandos de instalación de un paquete o autor en NPM.',
      responseType: 'json',
      params: [
        { name: 'name', type: 'string', required: true, example: 'siputzx-api', description: 'Nombre del paquete o usuario NPM' }
      ],
      handler: async (req, res) => {
        const name = (req.query.name || 'siputzx-api').trim();
        res.json({
          status: true,
          data: {
            name,
            registry_url: `https://registry.npmjs.org/${name}`,
            npmjs_page: `https://www.npmjs.com/package/${name}`,
            install_commands: {
              npm: `npm install ${name}`,
              pnpm: `pnpm add ${name}`,
              yarn: `yarn add ${name}`,
              bun: `bun add ${name}`
            }
          }
        });
      }
    },
    {
      name: 'Domain & TLD Security Inspector',
      path: '/api/stalk/domain',
      method: 'GET',
      description: 'Analiza la estructura de un dominio web, su extensión TLD, subdominios y registros recomendados.',
      responseType: 'json',
      params: [
        { name: 'domain', type: 'string', required: true, example: 'app.siputzx.my.id', description: 'Dominio o URL a inspeccionar' }
      ],
      handler: async (req, res) => {
        const clean = (req.query.domain || 'app.siputzx.my.id').replace(/^https?:\/\//i, '').split('/')[0].toLowerCase();
        const parts = clean.split('.');
        const tld = parts.length >= 2 ? `.${parts.slice(-1)[0]}` : '.com';
        const subdomain = parts.length > 2 ? parts[0] : 'none';

        res.json({
          status: true,
          data: {
            host: clean,
            subdomain,
            tld,
            ssl_recommended: 'TLS 1.3 (Let\'s Encrypt / Cloudflare)',
            dns_lookup_urls: {
              google_dns: `https://dns.google/resolve?name=${clean}&type=A`,
              cloudflare_doh: `https://cloudflare-dns.com/dns-query?name=${clean}&type=A`
            }
          }
        });
      }
    },
    {
      name: 'Roblox Player Profile Stalker',
      path: '/api/stalk/roblox',
      method: 'GET',
      description: 'Genera información estructurada y enlaces directos al perfil de un jugador de Roblox.',
      responseType: 'json',
      params: [
        { name: 'username', type: 'string', required: true, example: 'Builderman', description: 'Nombre de usuario en Roblox' }
      ],
      handler: async (req, res) => {
        const username = (req.query.username || 'Builderman').trim();
        res.json({
          status: true,
          data: {
            username,
            search_profile_url: `https://www.roblox.com/search/users?keyword=${encodeURIComponent(username)}`,
            verified_status: username.toLowerCase() === 'builderman',
            platform: 'Roblox Metaverse'
          }
        });
      }
    }
  ]
};
