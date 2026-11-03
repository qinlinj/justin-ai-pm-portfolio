(() => {
  history.scrollRestoration = 'manual';
  const initialHash = window.portfolioInitialHash || location.hash;
  const header = document.querySelector('header');
  const links = [...document.querySelectorAll('.work-index a')];
  const sections = links.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
  const mainLinks = [...document.querySelectorAll('#main-nav a:not([hidden])')];
  const mainSections = mainLinks.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selectedTarget = null;
  let expiry = 0;
  let frame = 0;
  let idle;
  let highlightTimer;
  let userInteracted = false;
  const offset = () => Math.ceil(header.getBoundingClientRect().height) + 24;
  const mark = id => links.forEach(a => {
    const active = a.hash === '#' + id;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
  const sync = () => {
    frame = 0;
    const line = offset() + 2;
    const mainCurrent = [...mainSections].reverse().find(section => section.getBoundingClientRect().top <= line);
    mainLinks.forEach(a => {
      if (mainCurrent && a.hash === '#' + mainCurrent.id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
    if (selectedTarget && performance.now() < expiry) { mark(selectedTarget); return; }
    selectedTarget = null;
    // One ordered position model for both scrolling and clicked anchors.
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= line) current = section;
      else break;
    }
    if (current) mark(current.id);
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(sync); };
  const navigate = (id, smooth = true, expand = true) => {
    dispatchEvent(new Event('settle-disclosures'));
    let target = document.getElementById(id);
    if (!target) { if (!id) window.scrollTo({ top: 0, behavior: 'instant' }); return; }
    // Nested case links open every enclosing disclosure before measuring the target.
    const ancestors = [];
    for (let node = target; node; node = node.parentElement) {
      if (node.matches('details')) ancestors.push(node);
    }
    if (expand) ancestors.reverse().forEach(details => { details.open = true; });
    else {
      const closedParent = ancestors.filter(details => !details.open).at(-1);
      if (closedParent) target = closedParent.closest('.career-card, .project-card') || closedParent;
    }
    // Stop an earlier animation before measuring a new destination.
    window.scrollTo({ top: window.scrollY, behavior: 'instant' });
    const restored = window.portfolioLanguagePosition;
    const progress = !userInteracted && restored?.id === id ? restored.progress * target.offsetHeight : 0;
    const top = Math.max(0, Math.round(window.scrollY + target.getBoundingClientRect().top - offset() + progress));
    selectedTarget = sections.includes(target) ? id : null;
    expiry = performance.now() + 1800;
    if (selectedTarget) mark(selectedTarget);
    const bounds = target.getBoundingClientRect();
    const alreadyVisible = smooth && bounds.top >= offset() && bounds.top < innerHeight - 100;
    if (!alreadyVisible) window.scrollTo({ top, behavior: smooth && !reduced.matches ? 'smooth' : 'instant' });
    clearTimeout(idle);
    idle = setTimeout(() => { selectedTarget = null; queue(); }, 1900);
  };
  document.querySelectorAll('a[aria-disabled="true"]').forEach(a => a.addEventListener('click', event => event.preventDefault()));
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', event => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = a.hash.slice(1);
    if (!id || !document.getElementById(id)) return;
    event.preventDefault();
    userInteracted = true;
    if (location.hash !== a.hash) history.pushState(null, '', a.hash);
    // Notify language links without invoking a second browser anchor jump.
    dispatchEvent(new Event('hashchange'));
    navigate(id);
    // The destination cue ties a cross-reference to its source without adding a page.
    const destination = document.getElementById(id);
    document.querySelectorAll('.destination-highlight').forEach(node => node.classList.remove('destination-highlight'));
    destination.classList.add('destination-highlight');
    clearTimeout(highlightTimer);
    highlightTimer = setTimeout(() => destination.classList.remove('destination-highlight'), 2800);
    if (event.detail === 0) {
      const target = document.getElementById(id);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }));
  addEventListener('scroll', () => {
    queue();
    clearTimeout(idle);
    idle = setTimeout(() => { selectedTarget = null; queue(); }, 160);
  }, { passive: true });
  ['wheel', 'touchstart'].forEach(type => addEventListener(type, () => { userInteracted = true; selectedTarget = null; }, { passive: true }));
  addEventListener('keydown', e => { if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)) { userInteracted = true; selectedTarget = null; } });
  addEventListener('popstate', () => { navigate(location.hash.slice(1), false); queue(); });
  addEventListener('resize', queue, { passive: true });
  new ResizeObserver(queue).observe(document.querySelector('main'));
  document.addEventListener('click', () => { userInteracted = true; }, { once: true });
  // Deep links are aligned after dynamic studies and fonts have their final size.
  const alignInitial = () => { if (!userInteracted && initialHash) navigate(initialHash.slice(1), false, false); else sync(); };
  alignInitial();
  requestAnimationFrame(alignInitial);
  addEventListener('load', () => requestAnimationFrame(() => {
    if (!userInteracted && initialHash) {
      history.replaceState(null, '', location.pathname + location.search + initialHash);
      dispatchEvent(new Event('hashchange'));
    }
    alignInitial();
  }));
  document.fonts?.ready.then(alignInitial);
})();
