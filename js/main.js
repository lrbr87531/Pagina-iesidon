/**
 * INSTITUCIÓN ETNOEDUCATIVA DE SIDÓN
 * Script Principal de Navegación, Accesibilidad, Búsqueda Global y Utilidades
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initAccessibleDropdowns();
  initBackToTop();
  highlightActiveNavLink();
  initAccessibilityControls();
  initGlobalSearch();
  registerServiceWorker();
});

/**
 * Menú Móvil Accesible con Trap Focus y Backdrop
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  
  if (!toggleBtn || !primaryNav) return;

  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  function openMenu() {
    toggleBtn.setAttribute('aria-expanded', 'true');
    primaryNav.classList.add('nav-open');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
    
    const firstLink = primaryNav.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('nav-open');
    backdrop.classList.remove('visible');
    document.body.style.overflow = '';
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav.classList.contains('nav-open')) {
      closeMenu();
    }
  });
}

/**
 * Manejo de menús desplegables mediante teclado y clic en móvil
 */
function initAccessibleDropdowns() {
  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

  dropdownItems.forEach((item) => {
    const link = item.querySelector('.nav-link');
    const menu = item.querySelector('.dropdown-menu');
    if (!link || !menu) return;

    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 980) {
        e.preventDefault();
        const isOpen = item.classList.contains('dropdown-open');
        dropdownItems.forEach(other => {
          if (other !== item) other.classList.remove('dropdown-open');
        });
        item.classList.toggle('dropdown-open', !isOpen);
        link.setAttribute('aria-expanded', String(!isOpen));
      }
    });

    link.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        if (window.innerWidth > 980) {
          const firstSubLink = menu.querySelector('a');
          if (firstSubLink) {
            e.preventDefault();
            firstSubLink.focus();
          }
        }
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item.has-dropdown')) {
      dropdownItems.forEach(item => {
        item.classList.remove('dropdown-open');
        const link = item.querySelector('.nav-link');
        if (link) link.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/**
 * Resaltar enlace de navegación según la página actual
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || 'index.html';
  
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === pageName || (pageName === '' && href === 'index.html'))) {
      link.classList.add('active');
      const parentDropdown = link.closest('.nav-item.has-dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('.nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });
}

/**
 * Botón flotante Volver Arriba
 */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Controles de Accesibilidad (Aumento de fuente y Alto Contraste WCAG)
 */
function initAccessibilityControls() {
  const topBarRight = document.querySelector('.top-bar-right');
  if (!topBarRight) return;

  const a11yBox = document.createElement('div');
  a11yBox.className = 'accessibility-bar';
  a11yBox.setAttribute('aria-label', 'Herramientas de accesibilidad');
  a11yBox.innerHTML = `
    <span style="font-weight: 600; font-size: 0.7rem; text-transform: uppercase;">Accesibilidad:</span>
    <button type="button" class="a11y-btn" id="a11yFontMinus" title="Disminuir tamaño de texto" aria-label="Disminuir tamaño de texto">A-</button>
    <button type="button" class="a11y-btn" id="a11yFontReset" title="Restablecer tamaño de texto" aria-label="Restablecer tamaño de texto">A</button>
    <button type="button" class="a11y-btn" id="a11yFontPlus" title="Aumentar tamaño de texto" aria-label="Aumentar tamaño de texto">A+</button>
    <button type="button" class="a11y-btn" id="a11yContrast" title="Alternar modo de alto contraste" aria-label="Alternar modo de alto contraste">◐ Contraste</button>
  `;
  topBarRight.insertBefore(a11yBox, topBarRight.firstChild);

  const savedSize = localStorage.getItem('iesidon_font_size');
  if (savedSize === 'lg') document.body.classList.add('text-lg');
  if (savedSize === 'xl') document.body.classList.add('text-xl');

  const savedContrast = localStorage.getItem('iesidon_contrast');
  if (savedContrast === 'high') document.body.classList.add('high-contrast');

  document.getElementById('a11yFontMinus')?.addEventListener('click', () => {
    if (document.body.classList.contains('text-xl')) {
      document.body.classList.remove('text-xl');
      document.body.classList.add('text-lg');
      localStorage.setItem('iesidon_font_size', 'lg');
    } else if (document.body.classList.contains('text-lg')) {
      document.body.classList.remove('text-lg');
      localStorage.removeItem('iesidon_font_size');
    }
  });

  document.getElementById('a11yFontReset')?.addEventListener('click', () => {
    document.body.classList.remove('text-lg', 'text-xl');
    localStorage.removeItem('iesidon_font_size');
  });

  document.getElementById('a11yFontPlus')?.addEventListener('click', () => {
    if (document.body.classList.contains('text-lg')) {
      document.body.classList.remove('text-lg');
      document.body.classList.add('text-xl');
      localStorage.setItem('iesidon_font_size', 'xl');
    } else if (!document.body.classList.contains('text-xl')) {
      document.body.classList.add('text-lg');
      localStorage.setItem('iesidon_font_size', 'lg');
    }
  });

  document.getElementById('a11yContrast')?.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
    if (document.body.classList.contains('high-contrast')) {
      localStorage.setItem('iesidon_contrast', 'high');
    } else {
      localStorage.removeItem('iesidon_contrast');
    }
  });
}

/**
 * Modal y Motor de Búsqueda Global Institucional (Ctrl + K)
 */
function initGlobalSearch() {
  const SITE_INDEX = [
    { title: "Inicio", desc: "Portada institucional, visión general y accesos rápidos", url: "index.html", cat: "General" },
    { title: "Presentación y Rectoría", desc: "Rectora Segunda Georgina Rosero, instalaciones, ascensor y planta física", url: "presentacion.html", cat: "Institución" },
    { title: "Organigrama Institucional", desc: "Estructura orgánica, gobierno escolar y dependencias", url: "presentacion.html", cat: "Institución" },
    { title: "Horizonte Institucional y Misión", desc: "Misión oficial del PEC, Visión al 2030, filosofía y los 10 valores", url: "horizonte-institucional.html", cat: "Horizonte" },
    { title: "Himno Institucional Oficial", desc: "Las 5 estrofas completas y el coro del himno de Sidón", url: "horizonte-institucional.html#himno", cat: "Símbolos" },
    { title: "Símbolos: Bandera y Escudo", desc: "Heráldica, colores, lema y significado afrodescendiente", url: "identidad-institucional.html", cat: "Símbolos" },
    { title: "Etnohistoria y Origen de Sidón", desc: "Historia oral ('Sí, Don'), sabedores Adalberto y Lucinda, familias fundadoras", url: "etnohistoria.html", cat: "Cultura" },
    { title: "Medicina Tradicional (28 Plantas)", desc: "Zapatico, Verbena, Escancel, Chilangua, Sábila y plantas ancestrales", url: "etnohistoria.html#medicina", cat: "Cultura" },
    { title: "Directorio de las 23 Sedes", desc: "Sede principal y 22 veredas con fotos y servicios", url: "sedes.html", cat: "Sedes" },
    { title: "Sede 01 Principal Sidón", desc: "Casco urbano, 2 pisos, ascensor, restaurante y bachillerato", url: "sedes.html", cat: "Sedes" },
    { title: "Sede 02 San Martín", desc: "Vereda San Martín con restaurante y casa docente", url: "sedes.html", cat: "Sedes" },
    { title: "Sede 18 Bocas de Mares", desc: "Vereda Bocana de Mares en la ribera del río Patía", url: "sedes.html", cat: "Sedes" },
    { title: "Proyectos STEAM y Robótica", desc: "8 sesiones prácticas con micro:bit, Arduino, ultrasonido y 3D", url: "proyectos-steam.html", cat: "STEAM" },
    { title: "Residencia Escolar y Convivencia", desc: "Manual 2026, protección infantil y permanencia para estudiantes ribereños", url: "convivencia-residencia.html", cat: "Convivencia" },
    { title: "Oferta Educativa e Inclusión", desc: "Preescolar a grado 11°, bachillerato académico y ajustes PIAR/DUA", url: "oferta-educativa.html", cat: "Académico" },
    { title: "Documentos Oficiales y PEC", desc: "Descarga del PEC 2025, PEI y visor de documentos", url: "documentos.html", cat: "Documentos" },
    { title: "Geografía y Río Patía", desc: "Cuenca del río Patía, microcuencas, pisos térmicos y mapa de Cumbitara", url: "geografia.html", cat: "Territorio" },
    { title: "Galería Multimedia", desc: "Fotografías de vida escolar, sedes rurales y video comunitario", url: "galeria.html", cat: "Galería" },
    { title: "Noticias y Comunicados", desc: "Actualidad escolar, cronograma y avisos para familias", url: "noticias.html", cat: "Noticias" },
    { title: "Contacto y Canales Oficiales", desc: "Teléfono 311 331 5750, correo cesidon@gmail.com y formulario", url: "contacto.html", cat: "Contacto" },
    { title: "Plataforma de Notas SAPRED", desc: "Consulta de calificaciones en línea (Código 9015850958)", url: "https://sanpedro.sapred.com/9015850958/index.php", cat: "Plataforma" }
  ];

  // Crear botón de búsqueda en la cabecera si no existe
  const headerInner = document.querySelector('.header-inner');
  if (headerInner && !document.getElementById('globalSearchBtn')) {
    const searchBtn = document.createElement('button');
    searchBtn.id = 'globalSearchBtn';
    searchBtn.className = 'search-trigger-btn';
    searchBtn.type = 'button';
    searchBtn.setAttribute('aria-label', 'Buscar en el sitio web');
    searchBtn.innerHTML = `
      <span>🔍 Buscar</span>
      <span class="search-kbd-shortcut">Ctrl+K</span>
    `;
    // Insertar antes del botón del menú móvil
    const navToggle = headerInner.querySelector('.nav-toggle');
    if (navToggle) {
      headerInner.insertBefore(searchBtn, navToggle);
    } else {
      headerInner.appendChild(searchBtn);
    }
  }

  // Crear modal de búsqueda
  let searchModal = document.getElementById('globalSearchModal');
  if (!searchModal) {
    searchModal = document.createElement('div');
    searchModal.id = 'globalSearchModal';
    searchModal.className = 'global-search-modal';
    searchModal.setAttribute('role', 'dialog');
    searchModal.setAttribute('aria-modal', 'true');
    searchModal.setAttribute('aria-label', 'Búsqueda global');
    searchModal.innerHTML = `
      <div class="global-search-box">
        <div class="global-search-header">
          <span style="font-size:1.25rem;">🔍</span>
          <input type="text" id="globalSearchInput" class="global-search-input" placeholder="Buscar página, sede, PEC, robótica, rectoría..." autocomplete="off">
          <button type="button" class="global-search-close" aria-label="Cerrar búsqueda">&times;</button>
        </div>
        <ul id="globalSearchResults" class="global-search-results"></ul>
        <div class="global-search-footer">
          <span>Navegar con ↑ ↓ y Enter</span>
          <span>Cerrar con Esc</span>
        </div>
      </div>
    `;
    document.body.appendChild(searchModal);
  }

  const inputEl = document.getElementById('globalSearchInput');
  const resultsEl = document.getElementById('globalSearchResults');
  const closeBtn = searchModal.querySelector('.global-search-close');
  const triggerBtn = document.getElementById('globalSearchBtn');

  function openSearch() {
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    inputEl.value = '';
    renderResults('');
    setTimeout(() => inputEl.focus(), 50);
  }

  function closeSearch() {
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    let matches = SITE_INDEX;

    if (q !== '') {
      matches = SITE_INDEX.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.desc.toLowerCase().includes(q) || 
        item.cat.toLowerCase().includes(q)
      );
    }

    if (matches.length === 0) {
      resultsEl.innerHTML = `
        <li style="padding:1.5rem; text-align:center; color:var(--color-slate-500); font-size:0.9rem;">
          No se encontraron resultados para "<strong>${escapeHtml(query)}</strong>". Intente con otra palabra clave.
        </li>
      `;
      return;
    }

    resultsEl.innerHTML = matches.map((item, idx) => `
      <li class="global-search-item ${idx === 0 ? 'selected' : ''}">
        <a href="${item.url}" ${item.url.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>
          <div class="global-search-item-title">
            <span>${escapeHtml(item.title)}</span>
            <span style="font-size:0.65rem; background:var(--color-slate-100); padding:0.15rem 0.45rem; border-radius:3px; color:var(--color-slate-600); font-weight:600;">${escapeHtml(item.cat)}</span>
          </div>
          <div class="global-search-item-desc">${escapeHtml(item.desc)}</div>
        </a>
      </li>
    `).join('');
  }

  triggerBtn?.addEventListener('click', openSearch);
  closeBtn?.addEventListener('click', closeSearch);

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  inputEl?.addEventListener('input', (e) => {
    renderResults(e.target.value);
  });

  // Atajos de teclado: Ctrl+K o Cmd+K para abrir, Escape para cerrar
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal.classList.contains('active')) {
        closeSearch();
      } else {
        openSearch();
      }
    } else if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      closeSearch();
    }
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

/**
 * Registro de Service Worker para soporte Offline Rural
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then((reg) => {
          console.log('Service Worker de resiliencia rural activo:', reg.scope);
        })
        .catch((err) => {
          console.log('Service Worker no registrado (modo local/file):', err);
        });
    });
  }
}
