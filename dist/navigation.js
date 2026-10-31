(() => {
  const header = document.querySelector('header');
  const links = [...document.querySelectorAll('.work-index a')];
  const sections = links.map(a => document.getElementById(a.hash.slice(1)));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selectedTarget = null;
  let expiry = 0;
  let frame = 0;
  let idle;
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
    if (selectedTarget && performance.now() < expiry) { mark(selectedTarget); return; }
    selectedTarget = null;
    // One ordered position model for both scrolling and clicked anchors.
    const line = offset() + 2;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= line) current = section;
      else break;
    }
    if (current) mark(current.id);
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(sync); };
  const navigate = (id, smooth = true) => {
    dispatchEvent(new Event('settle-disclosures'));
    const target = document.getElementById(id);
    if (!target) return;
    // Open direct study links before measuring the destination.
    if (target.matches('.study-group details, .allocated-study')) target.open = true;
    // Stop an earlier animation before measuring a new destination.
    window.scrollTo({ top: window.scrollY, behavior: 'instant' });
    const top = Math.max(0, Math.round(window.scrollY + target.getBoundingClientRect().top - offset()));
    selectedTarget = sections.includes(target) ? id : null;
    expiry = performance.now() + 1800;
    if (selectedTarget) mark(selectedTarget);
    window.scrollTo({ top, behavior: smooth && !reduced.matches ? 'smooth' : 'instant' });
    clearTimeout(idle);
    idle = setTimeout(() => { selectedTarget = null; queue(); }, 1900);
  };
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
  new ResizeObserver(queue).observe(document.querySelector('#studies'));
  document.addEventListener('click', () => { userInteracted = true; }, { once: true });
  // Deep links are aligned after dynamic studies and fonts have their final size.
  requestAnimationFrame(() => { if (location.hash) navigate(location.hash.slice(1), false); else sync(); });
  document.fonts?.ready.then(() => { if (!userInteracted && location.hash) navigate(location.hash.slice(1), false); });
})();
