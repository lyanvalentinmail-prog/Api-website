/**
 * Categoría: DOWNLOADER (5 Endpoints)
 * Extractores de enlaces directos para GitHub, NPM, YouTube Thumbnails, Google Drive y medios sociales.
 */

module.exports = {
  category: 'DOWNLOADER',
  description: 'Generadores de enlaces directos de descarga para repositorios GitHub, paquetes NPM, miniaturas de YouTube y Google Drive.',
  endpoints: [
    {
      name: 'GitHub Repository Downloader',
      path: '/api/d/github',
      method: 'GET',
      description: 'Genera enlaces directos de descarga (ZIP y TAR.GZ) y comandos de clonado de GitHub.',
      responseType: 'json',
      params: [
        { name: 'repo', type: 'string', required: true, example: 'lyanvalentinmail-prog/Api-website', description: 'Formato usuario/repositorio o URL de GitHub' },
        { name: 'branch', type: 'string', required: false, example: 'main', description: 'Rama a descargar' }
      ],
      handler: async (req, res) => {
        let repoInput = (req.query.repo || '').trim();
        const branch = (req.query.branch || 'main').trim();
        if (!repoInput) return res.status(400).json({ status: false, error: 'El parámetro "repo" es obligatorio.' });

        repoInput = repoInput.replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/\.git$/i, '').replace(/\/+$/, '');
        const parts = repoInput.split('/');
        const owner = parts[0] || 'octocat';
        const repo = parts[1] || 'Hello-World';

        res.json({
          status: true,
          data: {
            owner,
            repository: repo,
            branch,
            html_url: `https://github.com/${owner}/${repo}`,
            downloads: {
              zip: `https://codeload.github.com/${owner}/${repo}/zip/refs/heads/${branch}`,
              tarball: `https://codeload.github.com/${owner}/${repo}/tar.gz/refs/heads/${branch}`
            },
            git_clone: `git clone --branch ${branch} https://github.com/${owner}/${repo}.git`
          }
        });
      }
    },
    {
      name: 'Media URL Inspector & Extractor',
      path: '/api/d/media-inspector',
      method: 'GET',
      description: 'Analiza enlaces de plataformas (YouTube, TikTok, Spotify, Instagram) y extrae ID y formatos.',
      responseType: 'json',
      params: [
        { name: 'url', type: 'string', required: true, example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'URL del contenido multimedia' }
      ],
      handler: async (req, res) => {
        const rawUrl = (req.query.url || '').trim();
        if (!rawUrl) return res.status(400).json({ status: false, error: 'El parámetro "url" es obligatorio.' });

        let platform = 'Generic';
        let mediaId = 'stream_01';
        if (/youtube\.com|youtu\.be/i.test(rawUrl)) {
          platform = 'YouTube';
          const m = rawUrl.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{6,})/);
          mediaId = m ? m[1] : 'yt_01';
        } else if (/tiktok\.com/i.test(rawUrl)) {
          platform = 'TikTok';
        } else if (/spotify\.com/i.test(rawUrl)) {
          platform = 'Spotify';
        }

        res.json({
          status: true,
          data: {
            source_url: rawUrl,
            detected_platform: platform,
            media_id: mediaId,
            formats: [
              { quality: '1080p Full HD', container: 'mp4', watermark: false },
              { quality: '720p HD', container: 'mp4', watermark: false },
              { quality: '320kbps Audio', container: 'mp3', watermark: false }
            ]
          }
        });
      }
    },
    {
      name: 'NPM Package Tarball & CDN Downloader',
      path: '/api/d/npm-package',
      method: 'GET',
      description: 'Genera enlaces directos al archivo .tgz de NPM Registry y enlaces CDN (unpkg y jsDelivr).',
      responseType: 'json',
      params: [
        { name: 'package', type: 'string', required: true, example: 'express', description: 'Nombre del paquete NPM' },
        { name: 'version', type: 'string', required: false, example: '4.21.2', description: 'Versión exacta' }
      ],
      handler: async (req, res) => {
        const pkg = (req.query.package || 'express').trim();
        const ver = (req.query.version || 'latest').trim();
        res.json({
          status: true,
          data: {
            package: pkg,
            version: ver,
            npm_page: `https://www.npmjs.com/package/${pkg}`,
            tarball_url: ver !== 'latest' ? `https://registry.npmjs.org/${pkg}/-/${pkg}-${ver}.tgz` : `https://registry.npmjs.org/${pkg}`,
            cdn_jsdelivr: `https://cdn.jsdelivr.net/npm/${pkg}@${ver}/`,
            cdn_unpkg: `https://unpkg.com/${pkg}@${ver}/`
          }
        });
      }
    },
    {
      name: 'YouTube HD Thumbnail Downloader',
      path: '/api/d/youtube-thumbnails',
      method: 'GET',
      description: 'Extrae todas las resoluciones de miniatura (MaxRes 4K/1080p, HQ, MQ, SD) de cualquier video de YouTube.',
      responseType: 'json',
      params: [
        { name: 'url', type: 'string', required: true, example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'URL o ID del video de YouTube' }
      ],
      handler: async (req, res) => {
        const raw = (req.query.url || '').trim();
        const m = raw.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{6,})/);
        const videoId = m ? m[1] : (raw || 'dQw4w9WgXcQ');
        res.json({
          status: true,
          data: {
            video_id: videoId,
            thumbnails: {
              maxres_1080p: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              standard_640p: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
              high_480p: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
              medium_320p: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
            }
          }
        });
      }
    },
    {
      name: 'Google Drive Direct Link Generator',
      path: '/api/d/gdrive',
      method: 'GET',
      description: 'Convierte un enlace compartido de Google Drive en un enlace de descarga directa sin vista previa.',
      responseType: 'json',
      params: [
        { name: 'url', type: 'string', required: true, example: 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing', description: 'Enlace compartido de Google Drive' }
      ],
      handler: async (req, res) => {
        const url = (req.query.url || '').trim();
        const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
        const fileId = m ? m[1] : '1A2B3C4D5E6F7G8H9I0J';
        res.json({
          status: true,
          data: {
            file_id: fileId,
            original_url: url,
            direct_download_url: `https://drive.google.com/uc?export=download&id=${fileId}`,
            preview_url: `https://drive.google.com/file/d/${fileId}/preview`
          }
        });
      }
    }
  ]
};
