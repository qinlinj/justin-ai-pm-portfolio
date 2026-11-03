/* Real language URLs carry only public UI state, then return to a clean address. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const nativeTransition = 'onpageswap' in window && 'onpagereveal' in window;
  const incoming = new URL(location.href);
  incoming.hash = window.portfolioInitialHash || incoming.hash;
  if (incoming.searchParams.has('panels')) {
    incoming.searchParams.get('panels').split(',').forEach(id => {
      const node = document.getElementById(id);
      if (node?.matches('details')) node.open = true;
    });
    const scenario = incoming.searchParams.get('scenario');
    [...document.querySelectorAll('.scenario-switch button')].find(button => button.dataset.case === scenario)?.click();
    const progress = Number(incoming.searchParams.get('position')) || 0;
    window.portfolioLanguagePosition = {id: incoming.hash.slice(1), progress: Math.min(1, Math.max(0, progress))};
    incoming.searchParams.delete('panels'); incoming.searchParams.delete('position'); incoming.searchParams.delete('scenario');
    incoming.hash = '';
    history.replaceState(null, '', incoming.href);
    if (!reduced.matches && !nativeTransition) document.querySelector('main').animate([{opacity: .92}, {opacity: 1}], {duration: 180, easing: 'ease-out'});
  }
  let leaving = false;
  document.querySelectorAll('.language-switch a').forEach(link => {
    if (!link.hasAttribute('aria-current')) {
      const preload = () => {
        const hint = document.createElement('link');
        hint.rel = 'prefetch'; hint.href = link.href.split('#')[0]; hint.as = 'document';
        document.head.appendChild(hint);
      };
      link.addEventListener('pointerenter', preload, {once: true});
      link.addEventListener('focus', preload, {once: true});
    }
    link.addEventListener('click', event => {
      if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.hasAttribute('aria-current') || leaving) { event.preventDefault(); return; }
      event.preventDefault(); leaving = true;
      dispatchEvent(new Event('settle-disclosures'));
      // Freeze any in-page scroll before recording the reading position.
      window.scrollTo({top: window.scrollY, behavior: 'instant'});
      const line = document.querySelector('header').getBoundingClientRect().bottom + 24;
      const candidates = [...document.querySelectorAll('#main, #about, #focus, .boundary-explorer, #experience, .career-card, #projects, .project-card, #work, .study-group, .allocated-study, #thinking, #contact')];
      let anchor = candidates.filter(el => {
        for (let node = el.parentElement; node; node = node.parentElement) if (node.matches('details:not([open])')) return false;
        return el.getClientRects().length && el.getBoundingClientRect().top <= line + 1;
      }).at(-1) || document.querySelector('main');
      const selected = document.getElementById(location.hash.slice(1));
      const selectedBounds = selected?.getBoundingClientRect();
      const selectedCaseVisible = selected?.matches('.allocated-study[open]') && selectedBounds.top < line + 160 && selectedBounds.bottom > line;
      if (selectedCaseVisible || (selected && candidates.includes(selected) && selectedBounds.top >= 0 && selectedBounds.top < line + 160)) anchor = selected;
      const explorer = document.querySelector('.boundary-explorer[open]');
      const explorerBounds = explorer?.getBoundingClientRect();
      const scenarioBounds = explorer?.querySelector('.scenario-switch')?.getBoundingClientRect();
      if (explorerBounds && scenarioBounds.top < innerHeight && explorerBounds.bottom > line) anchor = explorer;
      const progress = anchor.id === 'main' ? 0 : Math.max(0, (line - anchor.getBoundingClientRect().top) / anchor.offsetHeight);
      const destination = new URL(link.href);
      destination.hash = anchor.id;
      destination.searchParams.set('panels', [...document.querySelectorAll('details[open]')].map(el => el.id).join(','));
      destination.searchParams.set('position', progress.toFixed(4));
      const scenario = document.querySelector('.scenario-switch button[aria-pressed="true"]');
      if (scenario) destination.searchParams.set('scenario', scenario.dataset.case);
      // Native cross-document transitions preserve the old frame until the new one is ready.
      // Without them, navigate immediately instead of fading to a washed-out loading state.
      location.assign(destination.href);
    });
  });
  addEventListener('pageshow', event => {
    if (event.persisted) { leaving = false; document.querySelector('main').getAnimations().forEach(animation => animation.cancel()); }
  });
})();
