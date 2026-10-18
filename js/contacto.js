/**
 * INSTITUCIÓN ETNOEDUCATIVA DE SIDÓN
 * Módulo de Validación y Manejo del Formulario de Contacto
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('institutionalContactForm');
  const feedbackBox = document.getElementById('formFeedback');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener campos
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const phone = document.getElementById('contactPhone');
    const subject = document.getElementById('contactSubject');
    const message = document.getElementById('contactMessage');
    const privacyCheck = document.getElementById('contactPrivacy');

    // Validación básica de campos requeridos
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      showFeedback('Por favor complete todos los campos obligatorios marcados con (*).', 'danger');
      return;
    }

    // Validación formato email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showFeedback('Por favor ingrese una dirección de correo electrónico válida.', 'warning');
      email.focus();
      return;
    }

    if (privacyCheck && !privacyCheck.checked) {
      showFeedback('Debe autorizar el tratamiento de datos personales institucionales para continuar.', 'warning');
      privacyCheck.focus();
      return;
    }

    // Simular recepción y confirmación
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando mensaje...';
    }

    setTimeout(() => {
      showFeedback(
        '¡Mensaje recibido con éxito! La rectoría o el área encargada de la Institución Etnoeducativa de Sidón atenderá su solicitud al correo ' +
        escapeHtml(email.value.trim()) + ' a la mayor brevedad posible.',
        'success'
      );
      contactForm.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensaje Institucional';
      }
    }, 600);
  });

  function showFeedback(text, type) {
    if (!feedbackBox) return;
    feedbackBox.className = 'form-feedback ' + type;
    feedbackBox.innerHTML = text;
    feedbackBox.style.display = 'block';
    feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }
});
