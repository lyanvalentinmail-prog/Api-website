document.addEventListener('DOMContentLoaded', () => {
  // Acordeón FAQ
  document.querySelectorAll('.faq-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('open');
    });
  });

  // Cargar métricas en tiempo real desde /api/stats
  async function loadStats() {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data && data.status) {
        document.getElementById('stat-endpoints').textContent = data.total_endpoints;
        document.getElementById('stat-categories').textContent = data.total_categories;
        document.getElementById('stat-requests').textContent = data.total_requests;
        document.getElementById('stat-latency').textContent = `${data.average_latency_ms} ms`;
      }
    } catch (e) {
      console.warn('No se pudieron cargar las métricas:', e);
    }
  }

  loadStats();
  setInterval(loadStats, 8000);
});
