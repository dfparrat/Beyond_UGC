const homePage = /(?:^|\/)index\.html$/i.test(window.location.pathname) || window.location.pathname.endsWith('/');
const services = homePage && document.querySelector('#hire');

if (services && !document.querySelector('.bu-ribbon')) {
  const ribbon = document.createElement('div');
  ribbon.className = 'bu-ribbon';
  ribbon.innerHTML = '<div class="bu-ribbon__track"><span>BEYOND UGC ✦ CREATE WITH PURPOSE ✦ GET PAID TO CREATE ✦</span><span aria-hidden="true">BEYOND UGC ✦ CREATE WITH PURPOSE ✦ GET PAID TO CREATE ✦</span></div>';
  services.before(ribbon);
  document.documentElement.classList.add('bu-ribbon-ready');
}

if (homePage) {
  const hero = document.querySelector('#heroCarousel');
  const heroImages = hero ? Array.from(hero.querySelectorAll('.hero-slide .photo-arch > img')) : [];
  heroImages.forEach(image => {
    const ring = document.createElement('div');
    ring.className = 'mobile-hero-ring';
    ring.setAttribute('aria-hidden', 'true');
    ring.style.setProperty('--image-count', heroImages.length);
    heroImages.forEach((source, index) => {
      const clone = source.cloneNode(true);
      clone.classList.remove('fx', 'fx-in');
      clone.removeAttribute('style');
      clone.setAttribute('aria-hidden', 'true');
      clone.style.setProperty('--image-index', index);
      ring.appendChild(clone);
    });
    image.parentElement.appendChild(ring);
  });

  const testimonials = document.querySelector('#testimonialsSection .features-carousel-container');
  const cards = testimonials ? Array.from(testimonials.querySelectorAll('.feature')) : [];
  if (cards.length) {
    const marquee = document.createElement('div');
    marquee.className = 'mobile-testimonial-marquee';
    marquee.setAttribute('aria-hidden', 'true');
    const midpoint = Math.ceil(cards.length / 2);
    [cards.slice(0, midpoint), cards.slice(midpoint)].forEach(rowCards => {
      if (!rowCards.length) return;
      const row = document.createElement('div');
      const track = document.createElement('div');
      const group = document.createElement('div');
      row.className = 'mobile-testimonial-row';
      track.className = 'mobile-testimonial-track';
      group.className = 'mobile-testimonial-group';
      rowCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.remove('fx', 'fx-in');
        clone.removeAttribute('style');
        clone.setAttribute('aria-hidden', 'true');
        group.appendChild(clone);
      });
      track.appendChild(group);
      track.appendChild(group.cloneNode(true));
      row.appendChild(track);
      marquee.appendChild(row);
    });
    testimonials.appendChild(marquee);
  }

  const servicesContainer = document.querySelector('.main-container.HireMain');
  const serviceCards = servicesContainer
    ? Array.from(servicesContainer.querySelectorAll('#servicesCarouselMobile .carousel-item > .service-card'))
    : [];
  if (serviceCards.length) {
    const stack = document.createElement('div');
    stack.className = 'mobile-service-stack';
    stack.setAttribute('aria-hidden', 'true');
    stack.style.setProperty('--card-count', serviceCards.length);
    serviceCards.forEach((card, index) => {
      const clone = card.cloneNode(true);
      clone.classList.remove('fx', 'fx-in');
      clone.removeAttribute('style');
      clone.setAttribute('aria-hidden', 'true');
      clone.style.setProperty('--card-index', index);
      clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(element => {
        element.setAttribute('tabindex', '-1');
      });
      stack.appendChild(clone);
    });
    servicesContainer.appendChild(stack);
  }
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const elements = document.querySelectorAll('.service-card:not([aria-hidden="true"]), .snap-card, section h1, section h2, .section-tag, .hero .photo-arch > img');
  const mobileViewport = window.matchMedia('(max-width: 767px)');
  const indexes = new Map(Array.from(elements, (element, index) => [element, index]));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = `${Math.min(indexes.get(entry.target) * 80, mobileViewport.matches ? 200 : 400)}ms`;
      entry.target.classList.add('fx-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: .15 });

  elements.forEach(element => {
    element.classList.add('fx');
    observer.observe(element);
  });
  document.documentElement.classList.add('fx-ready');
}
