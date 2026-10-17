// ============ language ============
// Each language is its own page (/ and /pt/). Remember the visitor's choice so
// the first-visit redirect in <head> never overrides it.
document.querySelectorAll('.lang-toggle a').forEach(a => {
  a.addEventListener('click', () => {
    try{ localStorage.setItem('canyon_lang', a.dataset.lang); }catch(e){}
  });
});

// ============ Steam Next Fest demo ============
// The demo URL only lives through Next Fest (ends 26 Oct 2026, 10:00 PDT). After
// that, drop the demo buttons and point the cover at the main store page.
// Keep in sync with SITE.demoEnds in src/content.mjs.
const DEMO_ENDS = Date.UTC(2026, 9, 26, 17);
if (Date.now() >= DEMO_ENDS){
  document.querySelectorAll('[data-demo-only]').forEach(el => el.remove());
  document.querySelectorAll('[data-after-demo-href]').forEach(el => {
    el.href = el.dataset.afterDemoHref;
    el.setAttribute('aria-label', el.dataset.afterDemoLabel);
  });
}
