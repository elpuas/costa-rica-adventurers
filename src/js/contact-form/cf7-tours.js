document.addEventListener('DOMContentLoaded', () => {

  const htmlLang = document.documentElement.lang || 'es';
  const langCode = htmlLang.split('-')[0];
 
  // Agrega el bloque para alemán ("de") junto con los demás idiomas:
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
        const ingreso = new Date(fechaIngreso.value);
        const salida = new Date(fechaSalida.value);
        const diffTime = salida - ingreso;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        cantidadDias.value = diffDays;
      } else {
        cantidadDias.value = '';
      }
    };
    const today = new Date().toISOString().split('T')[0];
    fechaIngreso.setAttribute('min', today);

    fechaIngreso.addEventListener('change', () => {
      if (fechaIngreso.value) {
        const ingresoDate = new Date(fechaIngreso.value);
        ingresoDate.setDate(ingresoDate.getDate() + 1);
        const minSalida = ingresoDate.toISOString().split('T')[0];
        fechaSalida.setAttribute('min', minSalida);
        calculateDays();
      }
    });
    fechaSalida.addEventListener('change', calculateDays);
  }

  const firstRoom = document.querySelector('#rooms-container .room-box[data-room="1"]');
  if (firstRoom) {
    const adultsInput = firstRoom.querySelector('input[name="room1_adults"]');
    const childrenInput = firstRoom.querySelector('input[name="room1_children"]');
    if (adultsInput && adultsInput.value.trim() === '') {
      adultsInput.value = '2';
    }
    if (childrenInput && childrenInput.value.trim() === '') {
      childrenInput.value = '0';
    }
  }

  const MAX_ROOMS = 10;
  const roomsContainer = document.getElementById('rooms-container');
  const addRoomBtn = document.getElementById('add-room-btn');

  if (addRoomBtn && roomsContainer) {
    addRoomBtn.addEventListener('click', () => {
      const currentRooms = roomsContainer.querySelectorAll('.room-box').length;
      if (currentRooms < MAX_ROOMS) {
        const roomNumber = currentRooms + 1;
        const newRoom = document.createElement('div');
        newRoom.classList.add('room-box');
        newRoom.setAttribute('data-room', roomNumber);

        newRoom.innerHTML = `
          <h4>${t.room} ${roomNumber}</h4>
          <div class="room-row">
            <div class="room-adults">
              <label>${t.adultsLabel}</label>
              <div class="step-input">
                <button type="button" class="decrease-adults">–</button>
                <input type="number" name="room${roomNumber}_adults" value="2" min="1" max="4" readonly>
                <button type="button" class="increase-adults">+</button>
              </div>
            </div>
            <div class="room-children">
              <label>${t.childrenLabel}</label>
              <div class="step-input">
                <button type="button" class="decrease-children">–</button>
                <input type="number" name="room${roomNumber}_children" value="0" min="0" max="3" readonly>
                <button type="button" class="increase-children">+</button>
              </div>
            </div>
          </div>
          <div class="children-ages-container" id="children-ages-room${roomNumber}"></div>
          <div><small class="room-note">${t.roomNote}</small></div>
          <button type="button" class="remove-room">${t.removeRoom}</button>
        `;
        roomsContainer.appendChild(newRoom);
      }
    });

    document.addEventListener('click', (e) => {
      if (
        e.target.matches('.increase-adults, .decrease-adults, .increase-children, .decrease-children')
      ) {
        const roomBox = e.target.closest('.room-box');
        if (!roomBox) return;
        const adultsInput = roomBox.querySelector('input[name^="room"][name$="_adults"]');
        const childrenInput = roomBox.querySelector('input[name^="room"][name$="_children"]');
        const childrenAgesContainer = roomBox.querySelector('.children-ages-container');

        if (adultsInput.value.trim() === '') {
          adultsInput.value = '2';
        }
        if (childrenInput.value.trim() === '') {
          childrenInput.value = '0';
        }

        let adults = parseInt(adultsInput.value, 10);
        let children = parseInt(childrenInput.value, 10);
        const totalPersons = adults + children;

        if (e.target.matches('.increase-adults') && totalPersons < 4) {
          adultsInput.value = ++adults;
        }
        if (e.target.matches('.decrease-adults') && adults > 1) {
          adultsInput.value = --adults;
        }
        if (e.target.matches('.increase-children') && totalPersons < 4) {
          childrenInput.value = ++children;
        }
        if (e.target.matches('.decrease-children') && children > 0) {
          childrenInput.value = --children;
        }

        childrenAgesContainer.innerHTML = '';
        for (let i = 1; i <= children; i++) {
          childrenAgesContainer.insertAdjacentHTML(
            'beforeend',
            `
              <label>${t.childAgeLabel} ${i}</label>
              <select name="child_age_${i}">
                ${[...Array(13).keys()]
                  .map((age) => {
                    const label = age === 0 ? t.underOne : age;
                    return `<option value="${age}">${label}</option>`;
                  })
                  .join('')}
              </select>
            `
          );
        }
      }

      if (e.target.matches('.remove-room')) {
        const roomBox = e.target.closest('.room-box');
        if (roomsContainer.querySelectorAll('.room-box').length > 1) {
          roomBox.remove();
        }
      }
    });
  }
});
