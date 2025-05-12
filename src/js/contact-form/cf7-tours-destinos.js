// src/js/contact-form/index.js

document.addEventListener('DOMContentLoaded', () => {
  // Only run on the inquiry page
  if (!window.ToursCartCfg || !ToursCartCfg.isInquiryPage) {
    return;
  }

  const key = ToursCartCfg.storageKey;
  const raw = localStorage.getItem(key);
  if (!raw) return;

  let tours;
  try {
    tours = JSON.parse(raw);
  } catch (e) {
    console.error('Invalid cart JSON:', e);
    return;
  }
  if (!Array.isArray(tours) || tours.length === 0) return;

  // Container in the CF7 form for the summary
  const container = document.getElementById('tour-summary');
  if (!container) return;

  // Build the summary table
  const table = document.createElement('table');
  table.className = 'tour-summary-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Tour</th>
        <th>Precio</th>
        <th>Cantidad</th>
      </tr>
    </thead>
    <tbody>
      ${tours.map(item => {
        const price = item.tour_price || '0';
        const qty = item.quantity || 1;
        return `
          <tr>
            <td>${item.tour_name}</td>
            <td>${price}</td>
            <td>${qty}</td>
          </tr>`;
      }).join('')}
    </tbody>
  `;
  container.appendChild(table);

  // Compute and display total
  const total = tours.reduce((sum, t) => {
    const p = parseFloat((t.tour_price || '0').replace(/[^0-9.]/g, '')) || 0;
    const q = parseInt(t.quantity || 1, 10);
    return sum + p * q;
  }, 0);

  const totalEl = document.createElement('p');
  totalEl.className = 'tour-summary-total';
  totalEl.innerHTML = `<strong>Total</strong>: $${total.toFixed(2)}`;
  container.appendChild(totalEl);

  // Populate hidden CF7 fields
  const cartItemsField = document.querySelector('input[name="cart_items"]');
  const cartTotalField = document.querySelector('input[name="cart_total"]');
  if (cartItemsField && cartTotalField) {
    const lines = tours.map(t => {
      const price = t.tour_price || '0';
      const qty = t.quantity || 1;
      return `• ${t.tour_name} | Precio: ${price} | Cantidad: ${qty}`;
    });
    cartItemsField.value = lines.join('\n');
    cartTotalField.value = total.toFixed(2);
  }
});
