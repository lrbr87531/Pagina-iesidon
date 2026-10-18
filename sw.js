/**
 * INSTITUCIÓN ETNOEDUCATIVA DE SIDÓN - SERVICE WORKER
 * Optimización de Resiliencia para Conectividad Rural Limitada
 * Permite la consulta offline de las páginas, directorio de sedes,
 * símbolos institucionales y saberes ancestrales en el río Patía.
 */

const CACHE_NAME = 'iesidon-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './presentacion.html',
  './horizonte-institucional.html',
  './identidad-institucional.html',
  './etnohistoria.html',
  './sedes.html',
  './oferta-educativa.html',
  './proyectos-steam.html',
  './convivencia-residencia.html',
  './geografia.html',
  './documentos.html',
  './galeria.html',
  './noticias.html',
  './contacto.html',
  './404.html',
  './css/main.css',
  './css/pages.css',
  './js/main.js',
  './js/sedes.js',
  './js/galeria.js',
  './js/contacto.js',
  './manifest.json',
  './imagenes/escudo3.png',
  './imagenes/bandera.png',
  './imagenes/fachada.png',
  './imagenes/imgcumbitara/sidon.jpg',
  './imagenes/imgcumbitara/MAPA CUMBITARA.png',
  './imagenes/imgcolegio/1.jpg',
  './imagenes/imgcolegio/15.jpg',
  './imagenes/imgcolegio/ESTUDIA1.jpg',
  './imagenes/imgcolegio/ESTUDIA2.jpg',
  './imagenes/imgcolegio/ESTUDIA3.jpg'
];

// Instalación y almacenamiento en caché inicial
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Algunos recursos secundarios se cachearán bajo demanda:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activación y limpieza de versiones obsoletas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia Network First con fallback a Cache para garantizar frescura y soporte offline
self.addEventListener('fetch', (event) => {
  // Solo interceptar peticiones GET dentro del mismo origen
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Si la red responde, clonar y actualizar la caché
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Si no hay conexión o falla la red, servir desde caché
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si es una navegación HTML que no está en caché, servir la página de error o inicio
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});
