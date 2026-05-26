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
