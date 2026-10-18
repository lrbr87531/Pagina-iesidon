/**
 * INSTITUCIÓN ETNOEDUCATIVA DE SIDÓN
 * Módulo de Galería Multimedia y Visor Lightbox Accesible
 */

document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');

  // Elementos del modal lightbox
  let lightbox = document.getElementById('lightboxModal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightboxModal';
    lightbox.className = 'lightbox-modal';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Visor de imagen');
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Cerrar visor">&times;</button>
        <button class="lightbox-btn-prev" aria-label="Imagen anterior">&#10094;</button>
        <img class="lightbox-img" src="" alt="">
        <div class="lightbox-caption"></div>
        <button class="lightbox-btn-next" aria-label="Imagen siguiente">&#10095;</button>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-btn-prev');
  const nextBtn = lightbox.querySelector('.lightbox-btn-next');

  let activeImages = [];
  let currentIndex = 0;

  function refreshActiveImages() {
    activeImages = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  function showImage(index) {
    if (activeImages.length === 0) return;
    currentIndex = (index + activeImages.length) % activeImages.length;
    const targetItem = activeImages[currentIndex];
    const imgEl = targetItem.querySelector('img');
    const captionEl = targetItem.querySelector('.gallery-caption-overlay') || targetItem.querySelector('figcaption');
    
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || 'Fotografía de la Institución Etnoeducativa de Sidón';
    lightboxCaption.textContent = captionEl ? captionEl.textContent : imgEl.alt;
  }

  function openLightbox(index) {
    refreshActiveImages();
    showImage(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      refreshActiveImages();
      const currentActiveIndex = activeImages.indexOf(item);
      openLightbox(currentActiveIndex >= 0 ? currentActiveIndex : 0);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        refreshActiveImages();
        const currentActiveIndex = activeImages.indexOf(item);
        openLightbox(currentActiveIndex >= 0 ? currentActiveIndex : 0);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Filtrado por categoría
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.dataset.category || 'all';

        galleryItems.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
        refreshActiveImages();
      });
    });
  }

  refreshActiveImages();
});
