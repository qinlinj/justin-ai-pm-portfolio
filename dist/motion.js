(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const lite = navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 4);
  if (lite) document.documentElement.classList.add('lite-glass');
  const header = document.querySelector('header');
  const menu = document.querySelector('.menu-toggle');
  const closeMenu = () => { header.classList.remove('nav-open'); menu?.setAttribute('aria-expanded', 'false'); };
  menu?.addEventListener('click', () => { const open = header.classList.toggle('nav-open'); menu.setAttribute('aria-expanded', String(open)); });
  header.querySelectorAll('nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && header.classList.contains('nav-open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!header.contains(e.target)) closeMenu(); });
  const updateLanguageLinks = () => {
    header.querySelectorAll('.language-switch a').forEach(a => { a.href = (a.classList.contains('lang-zh') ? 'zh.html' : './') + location.hash; });
  };
  updateLanguageLinks(); addEventListener('hashchange', updateLanguageLinks);
  let scheduled = false;
  const paint = () => {
    scheduled = false;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(paint); } }, { passive: true });
  addEventListener('resize', () => { if (innerWidth > 900) closeMenu(); paint(); }, { passive: true });
  reduced.addEventListener('change', paint);
  paint();
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
    }), { threshold: .04, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.profile-intro,.proof-strip,.career-card,.project-card,.insight-grid article,.career-focus,.glance-heading,.glance-points li,.teamwork,.contact>.section-label,.about>.section-label,.about-copy,.interests,.work>.section-label,.work>.section-intro,.study-group,.foundation,.thinking .section-label,.thinking .section-intro,.framework,.principles article,.contact-main,.contact-links').forEach(el => { el.classList.add('reveal'); reveal.observe(el); });
    document.documentElement.classList.add('motion-ready');
  }
  const controllers = new Map();
  document.querySelectorAll('details').forEach((details, index) => {
    const summary = details.querySelector(':scope > summary');
    const content = details.querySelector(':scope > .study-body, :scope > .secondary-body, :scope > .profile-body, :scope > .research-body, :scope > .experience-body');
    if (!summary || !content) return;
    details.id ||= `disclosure-${index + 1}`;
    content.id ||= `detail-panel-${index + 1}`;
    summary.setAttribute('aria-controls', content.id + (details.id === 'profile-background' ? ' profile-reflections' : ''));
    const sync = open => summary.setAttribute('aria-expanded', String(open));
    sync(details.open);
    let animation;
    let intendedOpen = details.open;
    const settle = () => {
      if (!animation) return;
      animation.cancel(); animation = null;
      details.open = intendedOpen;
      details.style.height = ''; details.style.overflow = '';
      sync(intendedOpen);
    };
    const setOpen = open => {
      if (details.classList.contains('experience-details')) dispatchEvent(new Event('settle-disclosures'));
      const start = details.getBoundingClientRect().height;
      settle(); intendedOpen = open; sync(open);
      if (reduced.matches || !details.animate) { details.open = open; return; }
      details.open = true;
      const end = open ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + 2;
      details.style.overflow = 'hidden';
      animation = details.animate([{height: `${start}px`}, {height: `${end}px`}], {duration: 280, easing: 'ease-out', fill: 'both'});
      animation.onfinish = settle;
    };
    controllers.set(details.id, setOpen);
    details.addEventListener('toggle', () => { if (!animation) { intendedOpen = details.open; sync(details.open); } });
    addEventListener('settle-disclosures', settle);
    summary.addEventListener('click', event => {
      if (event.defaultPrevented) return;
      event.preventDefault();
      const open = !(animation ? intendedOpen : details.open);
      setOpen(open);
      // Background controls both panels; research also has its own independent control.
      if (details.id === 'profile-background') controllers.get('profile-research')?.(open);
    });
  });
})();
