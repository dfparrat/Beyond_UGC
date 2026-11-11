const homePage = /(?:^|\/)index\.html$/i.test(window.location.pathname) || window.location.pathname.endsWith('/');
const services = homePage && document.querySelector('#hire');

if (services && !document.querySelector('.bu-ribbon')) {
  const ribbon = document.createElement('div');
  ribbon.className = 'bu-ribbon';
  ribbon.innerHTML = '<div class="bu-ribbon__track"><span>BEYOND UGC ✦ CREATE WITH PURPOSE ✦ GET PAID TO CREATE ✦</span><span aria-hidden="true">BEYOND UGC ✦ CREATE WITH PURPOSE ✦ GET PAID TO CREATE ✦</span></div>';
  services.before(ribbon);
  document.documentElement.classList.add('bu-ribbon-ready');
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const elements = document.querySelectorAll('.service-card, .snap-card, section h1, section h2, .section-tag, .hero .photo-arch img');
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
