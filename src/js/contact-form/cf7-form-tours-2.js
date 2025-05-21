document.addEventListener('DOMContentLoaded', () => {
  
  const days     = parseInt(params.get('duracion'), 10) || 0;
  const inEl     = document.getElementById('fecha-llegada');
  const outEl    = document.getElementById('fecha-salida');

  if (!inEl || !outEl) return;

  // never allow past dates
  inEl.setAttribute('min', new Date().toISOString().split('T')[0]);

  inEl.addEventListener('change', () => {
    if (!inEl.value) {
      outEl.value = '';
      return;
    }
    const d0 = new Date(inEl.value);
    d0.setDate(d0.getDate() + days);
    outEl.value = d0.toISOString().split('T')[0];
  });
});
