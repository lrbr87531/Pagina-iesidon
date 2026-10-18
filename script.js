// script.js
const carouselInner = document.querySelector('.carousel-inner');
const images = [
    'imagenes/imgcolegio/1.jpg',
    /* 'imagenes/imgcolegio/2.jpg' */
    'imagenes/imgcolegio/3.jpg',
    'imagenes/imgcolegio/4.jpg',
    'imagenes/imgcolegio/5.jpg',
    'imagenes/imgcolegio/6.jpg',
    'imagenes/imgcolegio/7.jpg',
    'imagenes/imgcolegio/8.jpg',
    'imagenes/imgcolegio/9.jpg',
    'imagenes/imgcolegio/10.jpg',
    'imagenes/imgcolegio/11.jpg',
    'imagenes/imgcolegio/12.jpg',
    'imagenes/imgcolegio/13.jpg',
    'imagenes/imgcolegio/14.jpg',
    'imagenes/imgcolegio/15.jpg',
];

let currentIndex = 0;

// Cargar las imágenes en el carrusel
images.forEach((image, index) => {
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');

    const img = document.createElement('img');
    img.src = image;
    img.alt = `Imagen ${index + 1}`;

    carouselItem.appendChild(img);
    carouselInner.appendChild(carouselItem);
});

// Función para mover el carrusel
function moveSlide(direction) {
    const totalImages = images.length;
    currentIndex = (currentIndex + direction + totalImages) % totalImages;
    const offset = -currentIndex * 100;
    carouselInner.style.transform = `translateX(${offset}%)`;
}

// Función para mover el carrusel automáticamente
function autoMoveSlide() {
    moveSlide(1); // Mueve al siguiente slide
}

// Iniciar el carrusel con la primera imagen
moveSlide(0);

// Cambiar automáticamente cada 2 segundos
setInterval(autoMoveSlide, 2000);

// Eventos para los controles de navegación
document.querySelector('.carousel-control.prev').addEventListener('click', () => moveSlide(-1));
document.querySelector('.carousel-control.next').addEventListener('click', () => moveSlide(1));