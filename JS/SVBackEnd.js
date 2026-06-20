// ================================================
//  INTEGRA CLINIC — SVBackEnd.js
//  Compatible con diseño A+ Socials (crema/nude)
// ================================================

// === NAVBAR TOGGLER MOBILE ====================
(function initNavbar() {
    const navbar  = document.getElementById('navbarNav');
    const toggler = document.querySelector('.navbar-toggler');
    if (!navbar || !toggler) return;

    const bsCollapse = new bootstrap.Collapse(navbar, { toggle: false });

    toggler.addEventListener('click', function () {
        bsCollapse.toggle();
    });

    document.addEventListener('click', function (e) {
        const insideMenu   = e.target.closest('#navbarNav');
        const clickToggler = e.target.closest('.navbar-toggler');
        if (!insideMenu && !clickToggler && navbar.classList.contains('show')) {
            bsCollapse.hide();
        }
    });
})();

// Cambiar estilo del navbar al hacer scroll (optimizado)
let scrollTimeout;
window.addEventListener('scroll', function() {
  if (scrollTimeout) return;
  scrollTimeout = requestAnimationFrame(() => {
    const navbar = document.querySelector('.navbar-custom');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    scrollTimeout = null;
  });
});

// === POPUP FUNCTIONALITY ======================
document.addEventListener('DOMContentLoaded', function () {
    let activePopup = null;

    function showPopup(popupId, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        if (activePopup) activePopup.style.display = 'none';

        const popup = document.getElementById(popupId);
        if (!popup) return;

        activePopup = popup;
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.documentElement.style.overflow = 'hidden';
            document.documentElement.style.position = 'fixed';
            document.documentElement.style.width = '100%';
            document.documentElement.style.height = '100%';
        }
    }

    function closePopup(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        if (!activePopup) return;

        activePopup.style.display = 'none';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        activePopup = null;

        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.documentElement.style.overflow = '';
            document.documentElement.style.position = '';
            document.documentElement.style.width = '';
            document.documentElement.style.height = '';
        }
    }

    // Triggers
    document.querySelectorAll('.popup-trigger').forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            showPopup(this.getAttribute('data-popup'), e);
        }, false);
        trigger.addEventListener('touchend', function (e) {
            showPopup(this.getAttribute('data-popup'), e);
        }, { passive: false });
    });

    // Close on backdrop / [data-close]
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', function (e) {
            if (e.target === this || e.target.closest('[data-close]')) closePopup(e);
        }, false);
        popup.addEventListener('touchend', function (e) {
            if (e.target === this || e.target.closest('[data-close]')) closePopup(e);
        }, { passive: false });
    });

    // ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && activePopup) closePopup();
    });

    // Text wrapping enforcement
    function enforceTextWrapping() {
        document.querySelectorAll('.popup-content, .popup-content-inner, .popup-content p, .popup-content h2').forEach(el => {
            el.style.wordBreak = 'break-word';
            el.style.overflowWrap = 'break-word';
            el.style.maxWidth = '100%';
        });
    }
    enforceTextWrapping();
    window.addEventListener('resize', enforceTextWrapping);
});


// === CONTACT FORM — EmailJS ===================
(function initContactForm() {
    if (typeof emailjs === 'undefined') return;

    emailjs.init("RW305hYZ62V-A18nB");

    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const SERVICE_ID  = "service_hbw2k4z";
        const TEMPLATE_ID = "template_cgtcodq";

        const formData = {
            name:    this.elements["name"].value,
            email:   this.elements["email"].value,
            message: this.elements["message"].value
        };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, formData)
            .then(function () {
                alert("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
                form.reset();
            }, function (error) {
                alert("Error al enviar. Por favor intenta más tarde.");
                console.error("EmailJS Error:", error);
            });
    });
})();


// === CAREERS FORM — EmailJS ===================
document.addEventListener('DOMContentLoaded', function () {
    if (typeof emailjs === 'undefined') return;

    emailjs.init("RW305hYZ62V-A18nB")
        .then(function () {
            const form = document.getElementById("applicant-form");
            if (!form) return;

            form.addEventListener("submit", function (event) {
                event.preventDefault();

                const SERVICE_ID  = "service_hbw2k4z";
                const TEMPLATE_ID = "template_n019kcj";

                const formData = {
                    from_name:    this.elements["from_name"].value,
                    from_email:   this.elements["from_email"].value,
                    from_job:     this.elements["from_job"].value,
                    from_message: this.elements["from_message"].value
                };

                emailjs.send(SERVICE_ID, TEMPLATE_ID, formData)
                    .then(function () {
                        alert("¡Solicitud enviada con éxito! Nos pondremos en contacto pronto.");
                        form.reset();
                    })
                    .catch(function (error) {
                        alert("Error al enviar. Por favor intenta más tarde.");
                        console.error("EmailJS Error:", error);
                    });
            });
        })
        .catch(function (err) {
            console.error("EmailJS init error:", err);
        });
});


// === CONTACT US FORM FALLBACK =================
(function initContactFallback() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    // Solo si EmailJS no está disponible
    if (typeof emailjs !== 'undefined') return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
        this.reset();
    });
})();


// === AOS ANIMATIONS ===========================
document.addEventListener('DOMContentLoaded', function () {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }
});


// === SMOOTH SCROLL (links internos) ===========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== CARRUSEL AUTOMÁTICO DE FEATURES/TESTIMONI =====
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.getElementById('featuresCarousel');
  const carouselContainer = carousel ? carousel.closest('.features-carousel-container') : null;
  const dotsContainer = document.getElementById('featuresCarouselDots');
  const prevBtn = document.getElementById('featuresPrevBtn');
  const nextBtn = document.getElementById('featuresNextBtn');
  
  if (!carousel || !carouselContainer || !dotsContainer) return;
  
  const features = Array.from(carousel.children);
  const totalFeatures = features.length;
  let currentIndex = 0;
  let autoSlideInterval;
  let itemsPerView = getItemsPerView();
  let totalSlides = Math.ceil(totalFeatures / itemsPerView);
  
  // Determinar cuántos items mostrar según el ancho de pantalla
  function getItemsPerView() {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }
  
  // Configurar el ancho de los slides
  function updateCarousel() {
    itemsPerView = getItemsPerView();
    totalSlides = Math.ceil(totalFeatures / itemsPerView);
    
    // Ajustar el ancho de cada feature
    const featureWidth = carouselContainer.clientWidth / itemsPerView;
    features.forEach(feature => {
      feature.style.flex = `0 0 ${featureWidth}px`;
      feature.style.maxWidth = `${featureWidth}px`;
    });
    
    // Asegurar que el índice actual sea válido
    if (currentIndex >= totalSlides) {
      currentIndex = totalSlides - 1;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    }
    
    updateCarouselPosition();
    updateDots();
  }
  
  // Mover el carrusel a la posición actual
  function updateCarouselPosition() {
    const slideWidth = carouselContainer.clientWidth;
    const translateX = -currentIndex * slideWidth;
    carousel.style.transform = `translateX(${translateX}px)`;
  }
  
  // Crear puntos indicadores
  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.addEventListener('click', () => {
        stopAutoSlide();
        goToSlide(i);
        startAutoSlide();
      });
      dotsContainer.appendChild(dot);
    }
    updateDots();
  }
  
  // Actualizar punto activo
  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Ir a un slide específico
  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    currentIndex = index;
    updateCarouselPosition();
    updateDots();
  }
  
  // Siguiente slide
  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    } else {
      // Volver al inicio (efecto infinito)
      goToSlide(0);
    }
  }
  
  // Slide anterior
  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else {
      // Ir al final (efecto infinito)
      goToSlide(totalSlides - 1);
    }
  }
  
  // Autoplay
  function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      nextSlide();
    }, 5000); // Cambiar cada 5 segundos
  }
  
  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }
  
  // Event listeners para botones
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    });
    
    nextBtn.addEventListener('click', () => {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    });
  }
  
  // Pausar autoplay al hacer hover
  carouselContainer.addEventListener('mouseenter', stopAutoSlide);
  carouselContainer.addEventListener('mouseleave', startAutoSlide);
  
  // Recalcular al redimensionar ventana
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel();
      startAutoSlide();
    }, 250);
  });
  
  // Inicializar
  updateCarousel();
  createDots();
  startAutoSlide();
});

// === 4 sERVICES Mobile carousel JS====================
(function() {
            const container = document.getElementById('snapsContainer');
            const wrapper = document.getElementById('carouselWrapper');
            const prevBtn = document.getElementById('snapsPrevBtn');
            const nextBtn = document.getElementById('snapsNextBtn');
            const dotsContainer = document.getElementById('snapsCarouselDots');

            if (!container || !wrapper || !prevBtn || !nextBtn || !dotsContainer) return;

            const cards = container.querySelectorAll('.snap-card');
            const totalSlides = cards.length;
            let currentIndex = 0;
            let isMobile = window.innerWidth <= 768;

            // ---- Create dots ----
            function createDots() {
                dotsContainer.innerHTML = '';
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('button');
                    dot.classList.add('dot');
                    if (i === 0) dot.classList.add('active');
                    dot.setAttribute('data-index', i);
                    dot.addEventListener('click', function() {
                        goToSlide(parseInt(this.getAttribute('data-index')));
                    });
                    dotsContainer.appendChild(dot);
                }
            }
            createDots();

            function updateDots(index) {
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }

            // ---- Slide transition ----
            function goToSlide(index) {
                if (index < 0) index = totalSlides - 1;
                if (index >= totalSlides) index = 0;
                currentIndex = index;

                if (window.innerWidth <= 768) {
                    const offset = -currentIndex * 100;
                    container.style.transform = `translateX(${offset}%)`;
                } else {
                    container.style.transform = 'translateX(0)';
                }
                updateDots(currentIndex);
            }

            function nextSlide() { goToSlide(currentIndex + 1); }
            function prevSlide() { goToSlide(currentIndex - 1); }

            // ---- Button listeners ----
            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);

            // ---- Touch / swipe support ----
            let startX = 0;
            let isDragging = false;
            const threshold = 30;

            wrapper.addEventListener('touchstart', function(e) {
                if (window.innerWidth > 768) return;
                startX = e.touches[0].clientX;
                isDragging = true;
            }, { passive: true });

            wrapper.addEventListener('touchmove', function(e) {
                if (!isDragging || window.innerWidth > 768) return;
                const deltaX = e.touches[0].clientX - startX;
                if (Math.abs(deltaX) > 10) {
                    e.preventDefault(); // prevent vertical scroll
                }
            }, { passive: false });

            wrapper.addEventListener('touchend', function(e) {
                if (!isDragging || window.innerWidth > 768) return;
                isDragging = false;
                const endX = e.changedTouches[0].clientX;
                const deltaX = endX - startX;
                if (Math.abs(deltaX) > threshold) {
                    if (deltaX < 0) nextSlide();
                    else prevSlide();
                }
            }, { passive: true });

            // ---- Resize handler ----
            let resizeTimeout;
            window.addEventListener('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const mobileNow = window.innerWidth <= 768;
                    if (!mobileNow) {
                        container.style.transform = 'translateX(0)';
                    } else {
                        goToSlide(currentIndex);
                    }
                }, 200);
            });

            // ---- Keyboard accessibility ----
            document.addEventListener('keydown', function(e) {
                if (window.innerWidth > 768) return;
                if (e.key === 'ArrowLeft') { prevSlide(); e.preventDefault(); }
                else if (e.key === 'ArrowRight') { nextSlide(); e.preventDefault(); }
            });

            // ---- Initialise ----
            window.addEventListener('load', function() {
                if (window.innerWidth <= 768) {
                    goToSlide(0);
                } else {
                    container.style.transform = 'translateX(0)';
                }
            });
            // fallback if load already fired
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                if (window.innerWidth <= 768) goToSlide(0);
                else container.style.transform = 'translateX(0)';
            }
        })();