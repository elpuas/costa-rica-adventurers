document.addEventListener('DOMContentLoaded', () => {
  const htmlLang = document.documentElement.lang || 'es';
  const langCode = htmlLang.split('-')[0];

  const translations = {
    es: {
      room: 'Habitación',
      adultsLabel: 'Cantidad de Adultos',
      childrenLabel: 'Cantidad de Niños',
      childAgeLabel: 'Edad del Niño',
      underOne: 'Menor de 1',
      roomNote: '*Se considera niño hasta 12 años o menos.',
      removeRoom: 'Eliminar habitación'
    },
    en: {
      room: 'Room',
      adultsLabel: 'Number of Adults',
      childrenLabel: 'Number of Children',
      childAgeLabel: 'Child Age',
      underOne: 'Under 1',
      roomNote: '*Considered a child up to 12 years or younger.',
      removeRoom: 'Remove room'
    },
    fr: {
      room: 'Chambre',
      adultsLabel: "Nombre d'adultes",
      childrenLabel: "Nombre d'enfants",
      childAgeLabel: "Âge de l'enfant",
      underOne: 'Moins de 1',
      roomNote: '*Considéré comme enfant jusqu’à 12 ans ou moins.',
      removeRoom: 'Supprimer la chambre'
    },
    de: {
      room: 'Zimmer',
      adultsLabel: 'Anzahl der Erwachsenen',
      childrenLabel: 'Anzahl der Kinder',
      childAgeLabel: 'Alter des Kindes',
      underOne: 'Unter 1',
      roomNote: '*Als Kind gilt bis zu 12 Jahren.',
      removeRoom: 'Zimmer entfernen'
    }
  };

  const t = translations[langCode] || translations.es;

  const fechaIngreso = document.querySelector('[name="fecha-ingreso"]');
  const fechaSalida = document.querySelector('[name="fecha-salida"]');
  const cantidadDias = document.querySelector('[name="cantidad-dias"]');

  if (fechaIngreso && fechaSalida && cantidadDias) {
    const calculateDays = () => {
      if (fechaIngreso.value && fechaSalida.value) {
        const diff = (new Date(fechaSalida.value) - new Date(fechaIngreso.value)) / (1000 * 60 * 60 * 24);
        cantidadDias.value = diff;
      } else {
        cantidadDias.value = '';
      }
    };

    const today = new Date().toISOString().split('T')[0];
    fechaIngreso.setAttribute('min', today);

    fechaIngreso.addEventListener('change', () => {
      if (fechaIngreso.value) {
        const d = new Date(fechaIngreso.value);
        d.setDate(d.getDate() + 1);
        fechaSalida.setAttribute('min', d.toISOString().split('T')[0]);
      }
      calculateDays();
    });

    fechaSalida.addEventListener('change', calculateDays);
  }

  const firstRoom = document.querySelector('#rooms-container .room-box[data-room="1"]');
  if (firstRoom) {
    const a = firstRoom.querySelector('input[name="room1_adults"]');
    const c = firstRoom.querySelector('input[name="room1_children"]');
    if (a && !a.value.trim()) a.value = '2';
    if (c && !c.value.trim()) c.value = '0';
  }

  const MAX_ROOMS = 10;
  const roomsContainer = document.getElementById('rooms-container');
  const addRoomBtn = document.getElementById('add-room-btn');

  if (addRoomBtn && roomsContainer) {
    addRoomBtn.addEventListener('click', () => {
      const count = roomsContainer.querySelectorAll('.room-box').length;
      if (count >= MAX_ROOMS) return;

      const num = count + 1;
      const div = document.createElement('div');
      div.classList.add('room-box');
      div.dataset.room = num;

      div.innerHTML = `
        <h4>${t.room} ${num}</h4>
        <div class="room-row">
          <div class="room-adults">
            <label for="room${num}_adults">${t.adultsLabel}</label>
            <div class="step-input">
              <button type="button" class="decrease-adults">–</button>
              <input type="number" id="room${num}_adults" name="room${num}_adults" value="2" min="1" max="4" readonly>
              <button type="button" class="increase-adults">+</button>
            </div>
          </div>
          <div class="room-children">
            <label for="room${num}_children">${t.childrenLabel}</label>
            <div class="step-input">
              <button type="button" class="decrease-children">–</button>
              <input type="number" id="room${num}_children" name="room${num}_children" value="0" min="0" max="3" readonly>
              <button type="button" class="increase-children">+</button>
            </div>
          </div>
        </div>
        <div class="children-ages-container" id="children-ages-room${num}"></div>
        <div><small class="room-note">${t.roomNote}</small></div>
        <button type="button" class="remove-room">${t.removeRoom}</button>
      `;
      roomsContainer.appendChild(div);
    });

    document.addEventListener('click', (e) => {
      const isStepper = e.target.matches('.increase-adults, .decrease-adults, .increase-children, .decrease-children');
      if (isStepper) {
        const box = e.target.closest('.room-box');
        const ai = box.querySelector('input[name^="room"][name$="_adults"]');
        const ci = box.querySelector('input[name^="room"][name$="_children"]');
        const ages = box.querySelector('.children-ages-container');
        const rn = box.dataset.room;
        let adults = parseInt(ai.value, 10) || 0;
        let children = parseInt(ci.value, 10) || 0;
        const total = adults + children;

        if (e.target.matches('.increase-adults') && total < 4) adults++;
        if (e.target.matches('.decrease-adults') && adults > 1) adults--;
        if (e.target.matches('.increase-children') && total < 4) children++;
        if (e.target.matches('.decrease-children') && children > 0) children--;

        ai.value = adults;
        ci.value = children;

        ages.innerHTML = '';
        for (let i = 1; i <= children; i++) {
          const id = `child_age_${rn}_${i}`;
          ages.insertAdjacentHTML('beforeend', `
            <label for="${id}">${t.childAgeLabel} ${i}</label>
            <select id="${id}" name="child_age_${rn}_${i}">
              ${[...Array(13).keys()].map(age => `<option value="${age}">${age === 0 ? t.underOne : age}</option>`).join('')}
            </select>
          `);
        }
      }

      if (e.target.matches('.remove-room')) {
        const box = e.target.closest('.room-box');
        if (roomsContainer.querySelectorAll('.room-box').length > 1) {
          box.remove();
        }
      }
    });
  }
});
