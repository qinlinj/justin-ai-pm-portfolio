/* Defer fragment alignment so the browser cannot expand disclosures on arrival. */
(() => {
  history.scrollRestoration = 'manual';
  window.portfolioInitialHash = location.hash;
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
})();
