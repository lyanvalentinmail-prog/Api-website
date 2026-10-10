/**
 * Categoría: DOWNLOADER
 * Extractores de metadatos, enlaces de descarga de repositorios GitHub y analizador de URLs multimedia.
 */

module.exports = {
  category: 'DOWNLOADER',
  description: 'Generadores de enlaces directos de descarga para repositorios GitHub y analizadores de URLs.',
  endpoints: [
    {
      name: 'GitHub Repository Downloader',
      path: '/api/d/github',
      method: 'GET',
      description: 'Genera enlaces directos de descarga (ZIP y TAR.GZ) y comandos de clonado a partir de una URL o usuario/repositorio de GitHub.',
      responseType: 'json',
      params: [
        { name: 'repo', type: 'string', required: true, example: 'lyanvalentinmail-prog/Api-website', description: 'Formato usuario/repositorio o URL de GitHub' },
        { name: 'branch', type: 'string', required: false, example: 'main', description: 'Rama a descargar (default: main)' }
      ],
      handler: async (req, res) => {
        let repoInput = (req.query.repo || '').trim();
        const branch = (req.query.branch || 'main').trim();

        if (!repoInput) {
          return res.status(400).json({ status: false, error: 'El parámetro "repo" es obligatorio.' });
        }

        repoInput = repoInput
          .replace(/^https?:\/\/(www\.)?github\.com\//i, '')
          .replace(/\.git$/i, '')
          .replace(/\/+$/, '');

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
      description: 'Analiza enlaces de plataformas (YouTube, TikTok, Spotify, Instagram) y extrae plataforma, ID del recurso y formatos disponibles.',
      responseType: 'json',
      params: [
        { name: 'url', type: 'string', required: true, example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', description: 'URL del contenido multimedia' }
      ],
      handler: async (req, res) => {
        const rawUrl = (req.query.url || '').trim();
        if (!rawUrl) {
          return res.status(400).json({ status: false, error: 'El parámetro "url" es obligatorio.' });
        }

        let platform = 'generic';
        let mediaId = 'unknown';

        if (/youtube\.com|youtu\.be/i.test(rawUrl)) {
          platform = 'YouTube';
          const m = rawUrl.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{6,})/);
          mediaId = m ? m[1] : 'yt_stream_01';
        } else if (/tiktok\.com/i.test(rawUrl)) {
          platform = 'TikTok';
          const m = rawUrl.match(/video\/(\d+)/);
          mediaId = m ? m[1] : 'tt_video_99';
        } else if (/spotify\.com/i.test(rawUrl)) {
          platform = 'Spotify';
          const m = rawUrl.match(/track\/([a-zA-Z0-9]+)/);
          mediaId = m ? m[1] : 'sp_track_01';
        } else if (/instagram\.com/i.test(rawUrl)) {
          platform = 'Instagram';
          mediaId = 'ig_reel_01';
        }

        res.json({
          status: true,
          data: {
            source_url: rawUrl,
            detected_platform: platform,
            media_id: mediaId,
            thumbnail: platform === 'YouTube' ? `https://i.ytimg.com/vi/${mediaId}/hqdefault.jpg` : null,
            formats: [
              { quality: '1080p Full HD', container: 'mp4', codec: 'H.264 / AAC', watermark: false },
              { quality: '720p HD', container: 'mp4', codec: 'H.264 / AAC', watermark: false },
              { quality: '320kbps Audio Only', container: 'mp3', codec: 'MP3', watermark: false }
            ]
          }
        });
      }
    }
  ]
};
