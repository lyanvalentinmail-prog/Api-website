/**
 * Motor Interactivo del Playground — API CONSOLE V2 (Estilo Siputzx)
 * Maneja el auto-descubrimiento desde /api/endpoints, filtrado en tiempo real,
 * formularios dinámicos, generador de código (URL, cURL, JS, Python),
 * ejecución HTTP directa con visor inteligente (JSON / Imagen SVG) y Builder de Endpoints.
 */

document.addEventListener('DOMContentLoaded', () => {
  let catalog = { categories: [], total_endpoints: 0, total_categories: 0 };
  let activeCategory = 'ALL';
  let activeMethod = 'ALL';
  let searchQuery = '';

  let selectedEndpoint = null;
  let activeSnippetLang = 'url';
  let lastRawResponseText = '';

  // Referencias del DOM
  const categoriesContainer = document.getElementById('categories-container');
  const categoryPillsContainer = document.getElementById('category-pills');
  const searchInput = document.getElementById('endpoint-search');
  const summaryBadge = document.getElementById('playground-summary-badge');
  const hitsBadge = document.getElementById('playground-hits-badge');

  // Modal de Ejecución
  const executionModal = document.getElementById('execution-modal');
  const closeExecutionModalBtn = document.getElementById('close-execution-modal');
  const modalMethod = document.getElementById('modal-method');
  const modalPath = document.getElementById('modal-path');
  const modalCategory = document.getElementById('modal-category');
  const modalDescription = document.getElementById('modal-description');
  const paramsFieldsContainer = document.getElementById('params-fields-container');
  const paramsForm = document.getElementById('endpoint-params-form');
  const resetParamsBtn = document.getElementById('reset-params-btn');
  const openRawUrlBtn = document.getElementById('open-raw-url-btn');
  const snippetCodeBox = document.getElementById('snippet-code-box');
  const copySnippetBtn = document.getElementById('copy-snippet-btn');
  const copyResponseBtn = document.getElementById('copy-response-btn');
  const respStatusPill = document.getElementById('resp-status-pill');
  const respTimePill = document.getElementById('resp-time-pill');
  const respTypePill = document.getElementById('resp-type-pill');
  const responseViewer = document.getElementById('response-viewer');

  // Modal Builder
  const builderModal = document.getElementById('builder-modal');
  const openBuilderBtn = document.getElementById('open-builder-btn');
  const closeBuilderModalBtn = document.getElementById('close-builder-modal');
  const builderForm = document.getElementById('builder-form');
  const builderCodePreview = document.getElementById('builder-code-preview');
  const copyBuilderCodeBtn = document.getElementById('copy-builder-code-btn');

  // 1. Cargar catálogo de endpoints y estadísticas
  async function loadCatalog() {
    try {
      const [epRes, stRes] = await Promise.all([
        fetch('/api/endpoints'),
        fetch('/api/stats')
      ]);
      catalog = await epRes.json();
      const stats = await stRes.json();

      summaryBadge.textContent = `${catalog.total_categories} CATEGORÍAS • ${catalog.total_endpoints} ENDPOINTS`;
      hitsBadge.textContent = `${stats.total_requests || 0} REQUESTS`;

      renderCategoryPills();
      renderCategoriesList();
    } catch (err) {
      console.error('Error cargando catálogo:', err);
      categoriesContainer.innerHTML = `<div class="category-block" style="padding:2rem;text-align:center;color:#fb7185;">Error conectando con /api/endpoints</div>`;
    }
  }

  // 2. Renderizar píldoras de categorías
  function renderCategoryPills() {
    const allPill = `
      <button type="button" class="cat-pill ${activeCategory === 'ALL' ? 'active' : ''}" data-cat="ALL">
        <span>ALL</span>
        <span class="cat-pill-count">${catalog.total_endpoints}</span>
      </button>
    `;

    const pills = (catalog.categories || []).map(cat => `
      <button type="button" class="cat-pill ${activeCategory === cat.name ? 'active' : ''}" data-cat="${cat.name}">
        <span>${cat.name}</span>
        <span class="cat-pill-count">${cat.count}</span>
      </button>
    `).join('');

    categoryPillsContainer.innerHTML = allPill + pills;

    categoryPillsContainer.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat');
        renderCategoryPills();
        renderCategoriesList();
      });
    });
  }

  // 3. Renderizar bloques de categorías y filas de endpoints estilo Siputzx
  function renderCategoriesList() {
    const q = searchQuery.trim().toLowerCase();

    const filteredCategories = (catalog.categories || [])
      .filter(cat => activeCategory === 'ALL' || cat.name === activeCategory)
      .map(cat => {
        const endpoints = (cat.endpoints || []).filter(ep => {
          const matchesMethod = activeMethod === 'ALL' || ep.method === activeMethod;
          const matchesSearch = !q ||
            ep.path.toLowerCase().includes(q) ||
            ep.name.toLowerCase().includes(q) ||
            (ep.description || '').toLowerCase().includes(q) ||
            cat.name.toLowerCase().includes(q);
          return matchesMethod && matchesSearch;
        });
        return { ...cat, endpoints };
      })
      .filter(cat => cat.endpoints.length > 0);

    if (filteredCategories.length === 0) {
      categoriesContainer.innerHTML = `
        <div class="category-block" style="padding: 3rem 1.5rem; text-align: center;">
          <p style="font-family: var(--font-mono); color: var(--text-secondary); margin-bottom: 0.75rem;">
            No se encontraron endpoints que coincidan con tu filtro ("${escapeHtml(searchQuery)}").
          </p>
          <button type="button" class="btn btn-outline" id="clear-filters-btn">Limpiar Filtros</button>
        </div>
      `;
      const clearBtn = document.getElementById('clear-filters-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchQuery = '';
          activeCategory = 'ALL';
          activeMethod = 'ALL';
          searchInput.value = '';
          document.querySelectorAll('.method-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.method === 'ALL'));
          renderCategoryPills();
          renderCategoriesList();
        });
      }
      return;
    }

    categoriesContainer.innerHTML = filteredCategories.map(cat => `
      <div class="category-block">
        <div class="category-block-header">
          <div class="category-block-title-wrap">
            <h2 class="category-block-title">${escapeHtml(cat.name)}</h2>
            <span class="category-block-desc">${escapeHtml(cat.description || '')}</span>
          </div>
          <span class="category-endpoint-badge">${cat.endpoints.length} ENDPOINTS</span>
        </div>

        <div class="endpoint-list">
          ${cat.endpoints.map(ep => `
            <div class="endpoint-row" data-ep-id="${escapeHtml(ep.id)}">
              <div class="endpoint-row-left">
                <span class="method-badge method-${escapeHtml(ep.method)}">${escapeHtml(ep.method)}</span>
                <span class="endpoint-path">${escapeHtml(ep.path)}</span>
                <span class="endpoint-name">${escapeHtml(ep.name)}</span>
              </div>
              <div class="endpoint-row-right">
                <span class="type-tag">${ep.responseType === 'image' ? 'IMAGE / SVG' : 'JSON'}</span>
                <span class="try-btn-label">Probar →</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Eventos al hacer clic en cualquier endpoint
    categoriesContainer.querySelectorAll('.endpoint-row').forEach(row => {
      row.addEventListener('click', () => {
        const epId = row.getAttribute('data-ep-id');
        const found = findEndpointById(epId);
        if (found) {
          openEndpointConsole(found);
        }
      });
    });
  }

  function findEndpointById(id) {
    for (const cat of catalog.categories || []) {
      for (const ep of cat.endpoints || []) {
        if (ep.id === id) return ep;
      }
    }
    return null;
  }

  // 4. Abrir Consola de Ejecución Directa de un Endpoint
  function openEndpointConsole(ep) {
    selectedEndpoint = ep;
    modalMethod.textContent = ep.method;
    modalMethod.className = `method-badge method-${ep.method}`;
    modalPath.textContent = ep.path;
    modalCategory.textContent = ep.category;
    modalDescription.textContent = ep.description || '';

    renderParamFields(ep);
    updateSnippetsAndUrl();

    executionModal.classList.add('open');

    // Ejecutar automáticamente una vista previa con los valores de ejemplo para una experiencia instantánea
    executeCurrentEndpoint();
  }

  function renderParamFields(ep) {
    const params = ep.params || [];
    if (params.length === 0) {
      paramsFieldsContainer.innerHTML = `
        <div style="padding: 0.85rem; background: rgba(255,255,255,0.03); border: 1px dashed var(--border-subtle); border-radius: 8px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
          ✔ Este endpoint no requiere parámetros. Puedes ejecutarlo directamente.
        </div>
      `;
      return;
    }

    paramsFieldsContainer.innerHTML = params.map(p => {
      const reqBadge = p.required
        ? `<span class="param-req required">requerido</span>`
        : `<span class="param-req optional">opcional</span>`;

      let inputControl = '';
      if (p.type === 'select' && Array.isArray(p.options)) {
        inputControl = `
          <select name="${escapeHtml(p.name)}" class="param-select" data-param-input="true">
            ${p.options.map(opt => `
              <option value="${escapeHtml(opt)}" ${String(opt) === String(p.example) ? 'selected' : ''}>
                ${escapeHtml(opt)}
              </option>
            `).join('')}
          </select>
        `;
      } else {
        inputControl = `
          <input
            type="${p.type === 'number' ? 'number' : 'text'}"
            name="${escapeHtml(p.name)}"
            class="param-input"
            value="${escapeHtml(p.example !== undefined ? p.example : '')}"
            placeholder="${escapeHtml(p.description || p.name)}"
            data-param-input="true"
            ${p.required ? 'required' : ''}
          />
        `;
      }

      return `
        <div class="param-group">
          <div class="param-label-row">
            <span class="param-name">${escapeHtml(p.name)}</span>
            ${reqBadge}
          </div>
          ${inputControl}
          ${p.description ? `<div class="param-desc">${escapeHtml(p.description)}</div>` : ''}
        </div>
      `;
    }).join('');

    paramsFieldsContainer.querySelectorAll('[data-param-input]').forEach(el => {
      el.addEventListener('input', updateSnippetsAndUrl);
      el.addEventListener('change', updateSnippetsAndUrl);
    });
  }

  function getFormParamsObject() {
    const obj = {};
    if (!selectedEndpoint) return obj;
    const inputs = paramsFieldsContainer.querySelectorAll('[data-param-input]');
    inputs.forEach(input => {
      const val = input.value;
      if (val !== '') {
        obj[input.name] = val;
      }
    });
    return obj;
  }

  function buildRelativeUrl() {
    if (!selectedEndpoint) return '/';
    const params = getFormParamsObject();
    const qs = new URLSearchParams(params).toString();
    if (selectedEndpoint.method === 'GET' && qs) {
      return `${selectedEndpoint.path}?${qs}`;
    }
    return selectedEndpoint.path;
  }

  function updateSnippetsAndUrl() {
    if (!selectedEndpoint) return;
    const relUrl = buildRelativeUrl();
    const fullUrl = `${window.location.origin}${relUrl}`;
    const params = getFormParamsObject();

    openRawUrlBtn.href = relUrl;

    let code = '';
    if (activeSnippetLang === 'url') {
      code = fullUrl;
    } else if (activeSnippetLang === 'curl') {
      if (selectedEndpoint.method === 'GET') {
        code = `curl -X GET "${fullUrl}"`;
      } else {
        code = `curl -X POST "${fullUrl}" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(params, null, 2)}'`;
      }
    } else if (activeSnippetLang === 'js') {
      if (selectedEndpoint.method === 'GET') {
        code = `const response = await fetch("${fullUrl}");\nconst data = await response.${selectedEndpoint.responseType === 'image' ? 'blob()' : 'json()'};\nconsole.log(data);`;
      } else {
        code = `const response = await fetch("${fullUrl}", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(${JSON.stringify(params, null, 2)})\n});\nconst data = await response.json();\nconsole.log(data);`;
      }
    } else if (activeSnippetLang === 'python') {
      if (selectedEndpoint.method === 'GET') {
        code = `import requests\n\nres = requests.get("${fullUrl}")\nprint(res.${selectedEndpoint.responseType === 'image' ? 'content' : 'json()'})`;
      } else {
        code = `import requests\n\npayload = ${JSON.stringify(params, null, 2)}\nres = requests.post("${fullUrl}", json=payload)\nprint(res.json())`;
      }
    }

    snippetCodeBox.textContent = code;
  }

  // 5. Ejecutar Petición HTTP en Vivo
  async function executeCurrentEndpoint(e) {
    if (e) e.preventDefault();
    if (!selectedEndpoint) return;

    const relUrl = buildRelativeUrl();
    const params = getFormParamsObject();

    respStatusPill.className = 'meta-pill';
    respStatusPill.textContent = 'EJECUTANDO...';
    respTimePill.textContent = 'LATENCIA: ...';
    responseViewer.innerHTML = `<div style="color: var(--accent-emerald); text-align: center; padding-top: 4.5rem;">⏳ Ejecutando ${escapeHtml(selectedEndpoint.method)} ${escapeHtml(relUrl)}...</div>`;

    const t0 = performance.now();
    try {
      const fetchOptions = {
        method: selectedEndpoint.method,
        headers: {}
      };

      if (selectedEndpoint.method !== 'GET') {
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.body = JSON.stringify(params);
      }

      const res = await fetch(relUrl, fetchOptions);
      const elapsed = Math.max(1, Math.round(performance.now() - t0));
      const contentType = (res.headers.get('content-type') || '').toLowerCase();

      respStatusPill.textContent = `STATUS: ${res.status} ${res.statusText || 'OK'}`;
      respStatusPill.className = res.ok ? 'meta-pill ok' : 'meta-pill err';
      respTimePill.textContent = `LATENCIA: ${elapsed} ms`;
      respTypePill.textContent = `TYPE: ${contentType.split(';')[0] || 'unknown'}`;

      if (contentType.includes('image/')) {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        lastRawResponseText = `${window.location.origin}${relUrl}`;

        responseViewer.innerHTML = `
          <div class="image-preview-wrap">
            <img src="${objectUrl}" alt="Canvas / Image Output" />
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
              <a href="${objectUrl}" download="${selectedEndpoint.path.split('/').pop() || 'output'}.svg" class="btn btn-primary">
                ⬇ Descargar Imagen
              </a>
              <a href="${relUrl}" target="_blank" class="btn btn-outline">
                ↗ Ver Imagen Original
              </a>
            </div>
          </div>
        `;
      } else {
        const text = await res.text();
        lastRawResponseText = text;
        try {
          const parsed = JSON.parse(text);
          const formatted = JSON.stringify(parsed, null, 2);
          lastRawResponseText = formatted;
          responseViewer.innerHTML = `<pre style="color: #a7f3d0; white-space: pre-wrap; word-break: break-word;">${escapeHtml(formatted)}</pre>`;
        } catch {
          responseViewer.innerHTML = `<pre style="color: #e2e8f0; white-space: pre-wrap;">${escapeHtml(text)}</pre>`;
        }
      }

      // Actualizar contador global de requests
      fetch('/api/stats')
        .then(r => r.json())
        .then(st => {
          if (st && st.total_requests !== undefined) {
            hitsBadge.textContent = `${st.total_requests} REQUESTS`;
          }
        })
        .catch(() => {});
    } catch (err) {
      respStatusPill.textContent = 'STATUS: NETWORK ERROR';
      respStatusPill.className = 'meta-pill err';
      responseViewer.innerHTML = `<pre style="color: #fb7185;">Error al ejecutar la petición: ${escapeHtml(err.message)}</pre>`;
    }
  }

  // Eventos del formulario y controles del modal
  paramsForm.addEventListener('submit', executeCurrentEndpoint);

  resetParamsBtn.addEventListener('click', () => {
    if (selectedEndpoint) {
      renderParamFields(selectedEndpoint);
      updateSnippetsAndUrl();
    }
  });

  document.querySelectorAll('#snippet-tabs .snippet-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#snippet-tabs .snippet-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeSnippetLang = tab.dataset.lang;
      updateSnippetsAndUrl();
    });
  });

  copySnippetBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(snippetCodeBox.textContent || '');
    copySnippetBtn.textContent = '✔ Copiado!';
    setTimeout(() => { copySnippetBtn.textContent = '📋 Copiar Código'; }, 1500);
  });

  copyResponseBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(lastRawResponseText || '');
    copyResponseBtn.textContent = '✔ Copiado!';
    setTimeout(() => { copyResponseBtn.textContent = '📋 Copiar Respuesta'; }, 1500);
  });

  closeExecutionModalBtn.addEventListener('click', () => {
    executionModal.classList.remove('open');
  });

  executionModal.addEventListener('click', (e) => {
    if (e.target === executionModal) executionModal.classList.remove('open');
  });

  // 6. Buscador y filtros de método
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCategoriesList();
  });

  document.querySelectorAll('#method-filters .method-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#method-filters .method-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMethod = btn.dataset.method;
      renderCategoriesList();
    });
  });

  // Atajo de teclado '/' para enfocar el buscador y 'Escape' para cerrar modales
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && !executionModal.classList.contains('open') && !builderModal.classList.contains('open')) {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === 'Escape') {
      executionModal.classList.remove('open');
      builderModal.classList.remove('open');
    }
  });

  // 7. Creador Visual de Endpoints (+ Crear Endpoint)
  function updateBuilderCodePreview() {
    const name = document.getElementById('b-name').value || 'Mi Endpoint';
    const category = (document.getElementById('b-category').value || 'CUSTOM').toUpperCase();
    const method = document.getElementById('b-method').value || 'GET';
    const routePath = document.getElementById('b-path').value || '/api/custom/test';
    const desc = document.getElementById('b-desc').value || '';
    const pName = document.getElementById('b-param-name').value.trim();
    const pEx = document.getElementById('b-param-example').value.trim();

    const paramsArr = pName
      ? `[\n    { name: '${pName}', type: 'string', required: true, example: '${pEx}', description: 'Parámetro ${pName}' }\n  ]`
      : '[]';

    const code = `// Agrega este objeto al arreglo "endpoints" en src/routes/${category.toLowerCase()}.js
{
  name: '${name}',
  path: '${routePath}',
  method: '${method}',
  description: '${desc}',
  responseType: 'json',
  params: ${paramsArr},
  handler: async (req, res) => {
    const ${pName || 'input'} = req.${method === 'GET' ? 'query' : 'body'}.${pName || 'input'};
    res.json({
      status: true,
      data: {
        endpoint: '${name}',
        ${pName || 'result'}: ${pName || "'OK'"}
      }
    });
  }
}`;
    builderCodePreview.textContent = code;
  }

  openBuilderBtn.addEventListener('click', () => {
    updateBuilderCodePreview();
    builderModal.classList.add('open');
  });

  closeBuilderModalBtn.addEventListener('click', () => {
    builderModal.classList.remove('open');
  });

  builderModal.addEventListener('click', (e) => {
    if (e.target === builderModal) builderModal.classList.remove('open');
  });

  ['b-name', 'b-category', 'b-method', 'b-path', 'b-desc', 'b-param-name', 'b-param-example'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateBuilderCodePreview);
  });

  copyBuilderCodeBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(builderCodePreview.textContent || '');
    copyBuilderCodeBtn.textContent = '✔ Copiado!';
    setTimeout(() => { copyBuilderCodeBtn.textContent = '📋 Copiar Código'; }, 1500);
  });

  builderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('b-name').value.trim();
    const category = document.getElementById('b-category').value.trim().toUpperCase();
    const method = document.getElementById('b-method').value;
    const pathVal = document.getElementById('b-path').value.trim();
    const description = document.getElementById('b-desc').value.trim();
    const pName = document.getElementById('b-param-name').value.trim();
    const pEx = document.getElementById('b-param-example').value.trim();

    const params = pName
      ? [{ name: pName, type: 'string', required: false, example: pEx, description: `Parámetro ${pName}` }]
      : [];

    try {
      const res = await fetch('/api/admin/register-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, method, path: pathVal, description, params })
      });
      const data = await res.json();
      if (data && data.status) {
        builderModal.classList.remove('open');
        await loadCatalog();
        if (data.endpoint) {
          openEndpointConsole(data.endpoint);
        }
      }
    } catch (err) {
      alert('Error registrando endpoint: ' + err.message);
    }
  });

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Inicializar Playground
  loadCatalog();
});
