(() => {
  const cards = [...document.querySelectorAll('.about-fact')];
  const scene = document.querySelector('.about-scene');
  const stage = scene.querySelector('.about-scene__stage');
  const items = [...scene.querySelectorAll('.about-scene__items li')];
  const dots = [...scene.querySelectorAll('.about-scene__dots span')];
  const fill = scene.querySelector('.about-scene__progress-fill');
  const count = scene.querySelector('.about-scene__count');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  let scheduled = false;

  function update() {
    scheduled = false;
    if (reducedMotion.matches) {
      scene.classList.remove('is-enhanced');
      cards.forEach(card => { card.style.transform = ''; });
      return;
    }

    scene.classList.add('is-enhanced');
    cards.forEach((card, index) => {
      const next = cards[index + 1];
      if (!next) return;
      const topDifference = parseFloat(getComputedStyle(next).top) - parseFloat(getComputedStyle(card).top);
      const distance = next.getBoundingClientRect().top - card.getBoundingClientRect().top;
      const range = card.offsetHeight + 30 - topDifference;
      const progress = clamp((card.offsetHeight + 30 - distance) / range);
      card.style.transform = `scale(${1 - progress * .05})`;
    });

    const rect = scene.getBoundingClientRect();
    const progress = clamp(-rect.top / Math.max(1, rect.height - stage.offsetHeight));
    const active = Math.min(items.length - 1, Math.floor(progress * items.length));
    fill.style.width = `${progress * 100}%`;
    count.textContent = `${active + 1} of ${items.length}`;
    items.forEach((item, index) => item.classList.toggle('is-active', index === active));
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === active));
  }

  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  reducedMotion.addEventListener('change', scheduleUpdate);
  scheduleUpdate();
})();
