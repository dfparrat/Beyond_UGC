// Popup functionality
document.addEventListener('DOMContentLoaded', function() {
    // Track active popup
    let activePopup = null;
    
    // Show popup function
    function showPopup(popupId, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        
        // Hide any currently open popup
        if (activePopup) {
            activePopup.style.display = 'none';
        }
        
        const popup = document.getElementById(popupId);
        if (!popup) return;
        
        activePopup = popup;
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // iOS specific fix
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.documentElement.style.overflow = 'hidden';
            document.documentElement.style.position = 'fixed';
            document.documentElement.style.width = '100%';
            document.documentElement.style.height = '100%';
        }
    }

    // Close popup function
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
        
        // iOS specific fix
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.documentElement.style.overflow = '';
            document.documentElement.style.position = '';
            document.documentElement.style.width = '';
            document.documentElement.style.height = '';
        }
    }

    // Click handler for popup triggers
    document.querySelectorAll('.popup-trigger').forEach(trigger => {
        // Mouse click
        trigger.addEventListener('click', function(e) {
            showPopup(this.getAttribute('data-popup'), e);
        }, false);
        
        // Touch support
        trigger.addEventListener('touchend', function(e) {
            showPopup(this.getAttribute('data-popup'), e);
        }, { passive: false, capture: false });
    });

    // Close handlers
    document.querySelectorAll('.popup').forEach(popup => {
        // Mouse click
        popup.addEventListener('click', function(e) {
            if (e.target === this || e.target.closest('[data-close]')) {
                closePopup(e);
            }
        }, false);
        
        // Touch support
        popup.addEventListener('touchend', function(e) {
            if (e.target === this || e.target.closest('[data-close]')) {
                closePopup(e);
            }
        }, { passive: false, capture: false });
    });

    // ESC key close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && activePopup) {
            closePopup();
        }
    });

    // Force text wrapping on load
    function enforceTextWrapping() {
        document.querySelectorAll('.popup-content, .popup-content-inner, .popup-content p, .popup-content h2').forEach(el => {
            el.style.wordBreak = 'break-word';
            el.style.overflowWrap = 'break-word';
            el.style.maxWidth = '100%';
        });
    }
    
    // Run on load and resize
    enforceTextWrapping();
    window.addEventListener('resize', enforceTextWrapping);
});


//===NAVBAR TOGGLER FOR MOBILE
//     // Menu toggler for mobile
    const navbar = document.getElementById('navbarNav');
    const toggler = document.querySelector('.navbar-toggler');
    const bsCollapse = new bootstrap.Collapse(navbar, { toggle: false });

    toggler.addEventListener('click', function() {
        bsCollapse.toggle();
    });

    document.addEventListener('click', function(e) {
        const clickedInsideMenu = e.target.closest('#navbarNav');
        const clickedToggler = e.target.closest('.navbar-toggler');
        
        if (!clickedInsideMenu && !clickedToggler && navbar.classList.contains('show')) {
            bsCollapse.hide();
        }
    });

//===CONTACT FORM EMAIL JS
// In your SVBackEnd.js file:
emailjs.init("RW305hYZ62V-A18nB");
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const SERVICE_ID = "service_hbw2k4z";
    const TEMPLATE_ID = "template_cgtcodq";

    // Get form data - fixed to use name attributes instead of IDs
    const formData = {
        name: this.elements["name"].value,
        email: this.elements["email"].value,
        message: this.elements["message"].value
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, formData)
        .then(function(response) {
            alert("Message sent successfully! We'll contact you soon.");
            event.target.reset(); // Fixed to reset the submitted form
        }, function(error) {
            alert("Failed to send message. Please try again later.");
            console.error("EmailJS Error:", error);
        });
});

//===CAREERS FORM EMAIL JS
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with error handling
    emailjs.init("RW305hYZ62V-A18nB")
        .then(function() {
            console.log('EmailJS initialized successfully');
            
            // Get the form element
            const form = document.getElementById("applicant-form");
            
            if (!form) {
                console.error('Form not found - check element ID');
                return;
            }

            form.addEventListener("submit", function(event) {
                event.preventDefault();

                const SERVICE_ID = "service_hbw2k4z";
                const TEMPLATE_ID = "template_n019kcj";

                // Form data collection
                const formData = {
                    from_name: this.elements["from_name"].value,
                    from_email: this.elements["from_email"].value,
                    from_job: this.elements["from_job"].value,
                    from_message: this.elements["from_message"].value
                };

                console.log("Form data being sent:", formData);

                // Email sending with better error handling
                emailjs.send(SERVICE_ID, TEMPLATE_ID, formData)
                    .then(function(response) {
                        console.log("EmailJS success:", response);
                        alert("Message sent successfully! We'll contact you soon.");
                        event.target.reset();
                    })
                    .catch(function(error) {
                        console.error("EmailJS failed:", error);
                        alert("Failed to send message. Error: " + error.text);
                    });
            });
        })
        .catch(function(initError) {
            console.error("EmailJS initialization failed:", initError);
            alert("Failed to initialize email service. Please refresh the page.");
        });
});

//===CONTACT US FORM EMAIL JS
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });


//===BUILDING STRONG ANIMATION JS
  document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
      duration: 800,
      once: true,
    });
  });

