(function () {
  const mobile = window.matchMedia('(max-width: 640px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const groups = Array.from(document.querySelectorAll('.service-group')).map(section => {
    const button = section.querySelector('button[aria-controls]');
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    const list = panel.querySelector('.pricing-services-list');
    return { section, button, panel, list, cards: Array.from(list.querySelectorAll('.course-card')) };
  });
  let cleanups = [];

  function centerCard(list, card, behavior) {
    const left = card.offsetLeft + card.offsetWidth / 2 - list.clientWidth / 2;
    list.scrollTo({ left, behavior });
  }

  function setupGroup(group) {
    const { button, panel, list, cards } = group;
    const clones = [];
    let timer;
    let frame;

    function makeClones() {
      return cards.map((card, index) => {
        const clone = card.cloneNode(true);
        clone.dataset.clone = String(index);
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(element => {
          element.setAttribute('tabindex', '-1');
        });
        clones.push(clone);
        return clone;
      });
    }

    cards.forEach((card, index) => card.style.setProperty('--i', index));
    const before = makeClones();
    const after = makeClones();
    before.forEach((clone, index) => clone.style.setProperty('--i', index));
    after.forEach((clone, index) => clone.style.setProperty('--i', index));
    list.prepend(...before);
    list.append(...after);
    list.setAttribute('tabindex', '0');
    list.setAttribute('role', 'region');
    list.setAttribute('aria-label', button.textContent.replace(/^Show\/Hide\s+/, '') + ' courses');
    button.removeAttribute('data-bs-toggle');
    panel.classList.add('pricing-mobile-panel');
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');

    function jumpTo(card) {
      cancelAnimationFrame(frame);
      list.style.scrollSnapType = 'none';
      centerCard(list, card, 'instant');
      frame = requestAnimationFrame(() => {
        list.style.removeProperty('scroll-snap-type');
      });
    }

    function settle() {
      clearTimeout(timer);
      if (panel.hidden) return;
      const center = list.scrollLeft + list.clientWidth / 2;
      const nearest = Array.from(list.children).reduce((closest, card) => {
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        return !closest || distance < closest.distance ? { card, distance } : closest;
      }, null);
      if (nearest && nearest.card.hasAttribute('data-clone')) {
        jumpTo(cards[Number(nearest.card.dataset.clone)]);
      }
    }

    function onScroll() {
      clearTimeout(timer);
      timer = setTimeout(settle, 180);
    }

    function onKeydown(event) {
      if (event.target !== list || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
      event.preventDefault();
      const center = list.scrollLeft + list.clientWidth / 2;
      const allCards = Array.from(list.children);
      const nearest = allCards.reduce((closest, card, index) => {
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        return distance < closest.distance ? { index, distance } : closest;
      }, { index: 0, distance: Infinity }).index;
      const target = allCards[nearest + (event.key === 'ArrowRight' ? 1 : -1)];
      if (target) centerCard(list, target, reducedMotion.matches ? 'instant' : 'smooth');
    }

    function onClick(event) {
      event.stopPropagation();
      const opening = panel.hidden;
      groups.forEach(other => {
        other.panel.hidden = true;
        other.button.setAttribute('aria-expanded', 'false');
        other.list.classList.remove('is-revealing');
      });
      if (!opening) return;
      panel.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      jumpTo(cards[0]);
      void list.offsetWidth;
      list.classList.add('is-revealing');
    }

    button.addEventListener('click', onClick, true);
    list.addEventListener('scroll', onScroll, { passive: true });
    list.addEventListener('scrollend', settle);
    list.addEventListener('keydown', onKeydown);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      button.removeEventListener('click', onClick, true);
      list.removeEventListener('scroll', onScroll);
      list.removeEventListener('scrollend', settle);
      list.removeEventListener('keydown', onKeydown);
      clones.forEach(clone => clone.remove());
      cards.forEach(card => card.style.removeProperty('--i'));
      list.classList.remove('is-revealing');
      list.style.removeProperty('scroll-snap-type');
      list.removeAttribute('tabindex');
      list.removeAttribute('role');
      list.removeAttribute('aria-label');
      list.scrollLeft = 0;
      panel.hidden = false;
      panel.classList.remove('pricing-mobile-panel');
      button.setAttribute('data-bs-toggle', 'collapse');
      button.setAttribute('aria-expanded', String(panel.classList.contains('show')));
    };
  }

  function openHashGroup() {
    if (!mobile.matches) return;
    const group = groups.find(item => '#' + item.section.id === window.location.hash);
    if (!group) return;
    if (group.panel.hidden) group.button.click();
    group.section.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  function updateViewport() {
    cleanups.forEach(cleanup => cleanup());
    cleanups = mobile.matches ? groups.map(setupGroup) : [];
    openHashGroup();
  }

  mobile.addEventListener('change', updateViewport);
  window.addEventListener('hashchange', openHashGroup);
  updateViewport();
})();
