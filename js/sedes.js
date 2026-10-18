/**
 * INSTITUCIÓN ETNOEDUCATIVA DE SIDÓN
 * Módulo Interactivo de Búsqueda, Filtrado y Ficha Modal de Sedes Educativas
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('sedeSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sedeCards = document.querySelectorAll('.sede-card');
  const countBadge = document.getElementById('sedesCount');

  if (!sedeCards.length) return;

  // Crear modal dinámico para detalle de sede si no existe
  let modalOverlay = document.getElementById('sedeModalOverlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'sedeModalOverlay';
    modalOverlay.className = 'sede-modal-overlay';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');
    modalOverlay.setAttribute('aria-label', 'Ficha informativa de la sede');
    modalOverlay.innerHTML = `
      <div class="sede-modal-card">
        <button class="sede-modal-close" aria-label="Cerrar ficha">&times;</button>
        <div class="sede-modal-header">
          <img class="sede-modal-img" src="" alt="">
        </div>
        <div class="sede-modal-body">
          <div class="sede-modal-badge" style="display:inline-block; font-size:0.75rem; font-weight:700; background:var(--color-slate-100); padding:0.2rem 0.6rem; border-radius:4px; margin-bottom:0.5rem; text-transform:uppercase;"></div>
          <h2 class="sede-modal-title"></h2>
          <div class="sede-modal-location"></div>
          <div class="sede-modal-details"></div>
          <div class="sede-modal-badges-container" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--color-slate-100);"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  const modalImg = modalOverlay.querySelector('.sede-modal-img');
  const modalBadge = modalOverlay.querySelector('.sede-modal-badge');
  const modalTitle = modalOverlay.querySelector('.sede-modal-title');
  const modalLocation = modalOverlay.querySelector('.sede-modal-location');
  const modalDetails = modalOverlay.querySelector('.sede-modal-details');
  const modalBadges = modalOverlay.querySelector('.sede-modal-badges-container');
  const modalClose = modalOverlay.querySelector('.sede-modal-close');

  function openSedeModal(card) {
    const name = card.querySelector('.sede-name')?.textContent || '';
    const vereda = card.querySelector('.sede-vereda')?.textContent || '';
    const badgeNum = card.querySelector('.sede-badge-number')?.textContent || '';
    const imgSrc = card.querySelector('.sede-card-img')?.src || '';
    const features = Array.from(card.querySelectorAll('.sede-feature-item')).map(el => el.textContent.trim());
    const badgesHtml = card.querySelector('.sede-badges-row')?.innerHTML || '';

    modalImg.src = imgSrc;
    modalImg.alt = name;
    modalBadge.textContent = badgeNum;
    modalTitle.textContent = name;
    modalLocation.textContent = vereda;
    modalBadges.innerHTML = badgesHtml;

    let detailsHtml = '<h3 class="sede-modal-section-title">Información de la Sede:</h3><ul style="padding-left:1.25rem; font-size:0.95rem; line-height:1.7;">';
    features.forEach(f => {
      detailsHtml += `<li>${escapeHtml(f)}</li>`;
    });
    detailsHtml += '</ul>';

    detailsHtml += `
      <div style="background:var(--color-slate-50); padding:1rem; border-radius:var(--radius-md); margin-top:1rem; font-size:0.875rem; color:var(--color-slate-600); border-left:3px solid var(--color-green-primary);">
        <strong>Atención Oficial:</strong> Integrada formalmente a la Institución Etnoeducativa de Sidón bajo los lineamientos del Proyecto Educativo Comunitario (PEC) y la Secretaría de Educación Departamental de Nariño.
      </div>
    `;

    modalDetails.innerHTML = detailsHtml;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeSedeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeSedeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeSedeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeSedeModal();
    }
  });

  // Agregar botón "Ver Ficha de Sede" a cada tarjeta e interactividad
  sedeCards.forEach((card) => {
    // Si no tiene botón, agregar botón accesible
    let btnView = card.querySelector('.btn-view-sede');
    if (!btnView) {
      btnView = document.createElement('button');
      btnView.className = 'btn-view-sede';
      btnView.type = 'button';
      btnView.textContent = 'Ver Ficha Informativa →';
      card.querySelector('.sede-card-body')?.appendChild(btnView);
    }

    btnView.addEventListener('click', (e) => {
      e.stopPropagation();
      openSedeModal(card);
    });

    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      openSedeModal(card);
    });
  });

  let currentFilter = 'all';
  let searchQuery = '';

  function updateDisplay() {
    let visibleCount = 0;

    sedeCards.forEach((card) => {
      const name = (card.dataset.name || '').toLowerCase();
      const vereda = (card.dataset.vereda || '').toLowerCase();
      const hasRestaurant = card.dataset.restaurant === 'true';
      const hasHousing = card.dataset.housing === 'true';
      const isSecundaria = card.dataset.secundaria === 'true';

      const matchesSearch = searchQuery === '' || name.includes(searchQuery) || vereda.includes(searchQuery);

      let matchesFilter = true;
      if (currentFilter === 'restaurante') {
        matchesFilter = hasRestaurant;
      } else if (currentFilter === 'casa') {
        matchesFilter = hasHousing;
      } else if (currentFilter === 'secundaria') {
        matchesFilter = isSecundaria;
      }

      if (matchesSearch && matchesFilter) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countBadge) {
      countBadge.textContent = `Mostrando ${visibleCount} de ${sedeCards.length} sedes`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      updateDisplay();
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      updateDisplay();
    });
  });

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }

  updateDisplay();
});
