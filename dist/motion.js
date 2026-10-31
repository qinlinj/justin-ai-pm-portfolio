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
  const hero = document.querySelector('.hero');
  let scheduled = false;
  const paint = () => {
    scheduled = false;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    const progress = reduced.matches ? 0 : Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * .85)));
    hero.style.setProperty('--hero-opacity', String(1 - progress * .32));
    hero.style.setProperty('--hero-scale', String(1 - progress * .025));
    hero.style.setProperty('--hero-y', `${progress * 24}px`);
    hero.style.setProperty('--hero-sub-y', `${progress * 11}px`);
  };
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(paint); } }, { passive: true });
  addEventListener('resize', paint, { passive: true });
  reduced.addEventListener('change', paint);
  paint();
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
    }), { threshold: .04, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.profile-intro,.proof-strip,.career-card,.project-card,.insight-grid article,.career-focus,.glance-heading,.glance-points li,.teamwork,.contact>.section-label,.about>.section-label,.about-copy,.interests,.work>.section-label,.work>.section-intro,.study-group,.foundation,.thinking .section-label,.thinking .section-intro,.framework,.principles article,.contact-main,.contact-links').forEach(el => { el.classList.add('reveal'); reveal.observe(el); });
    document.documentElement.classList.add('motion-ready');
  }
  document.querySelectorAll('details').forEach((details, index) => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.study-body, .secondary-body, .profile-body');
    if (!content) return;
    content.id = `${details.closest(".study-group") ? "study-panel" : "detail-panel"}-${index + 1}`;
    summary.setAttribute('aria-controls', content.id + (details.classList.contains('profile-details') ? ' profile-reflections' : ''));
    const syncProfile = open => { if (!details.classList.contains('profile-details')) return; document.querySelector('#about').classList.toggle('profile-expanded', open); document.querySelector('#profile-reflections').setAttribute('aria-hidden', String(!open)); summary.setAttribute('aria-expanded', String(open)); };
    syncProfile(details.open);
    const profileCue = details.querySelector('.profile-open');
    if (profileCue) details.addEventListener('toggle', () => {
      const label = key => window.studyLocaleData?.labels?.[key] || key;
      profileCue.textContent = details.open ? label('Close background & reflections ↑') : label('Open background & reflections ↗');
    });
    let animation;
    let fade;
    let intendedOpen = details.open;
    addEventListener('settle-disclosures', () => {
      if (!animation) return;
      animation.cancel(); fade?.cancel(); animation = null; fade = null;
      details.open = intendedOpen;
      details.style.height = ''; details.style.overflow = '';
    });
    summary.addEventListener('click', event => {
      if (event.defaultPrevented) return;
      event.preventDefault();
      intendedOpen = !(animation ? intendedOpen : details.open);
      syncProfile(intendedOpen);
      const start = details.getBoundingClientRect().height;
      animation?.cancel(); fade?.cancel();
      if (reduced.matches || !details.animate) {
        details.style.height = ''; details.style.overflow = ''; details.open = intendedOpen; return;
      }
      details.open = true;
      details.style.height = 'auto';
      const end = intendedOpen ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + 2;
      details.style.overflow = 'hidden';
      details.style.height = `${start}px`;
      animation = details.animate([{ height: `${start}px` }, { height: `${end}px` }], { duration: Math.min(540, 300 + Math.abs(end - start) * .16), easing: 'cubic-bezier(.22,.68,.25,1)', fill: 'both' });
      fade = content.animate(intendedOpen ? [{ opacity: .05, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }] : [{ opacity: 1 }, { opacity: 0 }], { duration: intendedOpen ? 360 : 200, easing: 'ease-out', fill: 'both' });
      animation.onfinish = () => {
        details.open = intendedOpen;
        details.style.height = ''; details.style.overflow = '';
        animation.cancel(); fade.cancel(); animation = null; fade = null;
      };
    });
  });
})();
