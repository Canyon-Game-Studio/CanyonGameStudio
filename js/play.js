// ============ Play in Browser ============
// The WebGL build is hundreds of MB, so the iframe only loads when the visitor
// asks for it. Fullscreen goes to the frame's box (the game's own canvas
// fullscreen also works inside the iframe thanks to allow="fullscreen").
const box = document.querySelector('[data-play]');
if (box){
  const start = box.querySelector('[data-play-start]');
  const full = document.querySelector('[data-play-full]');
  start.hidden = false;
  start.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = box.dataset.play;
    frame.title = box.dataset.title;
    frame.allow = 'fullscreen; autoplay; gamepad';
    frame.allowFullscreen = true;
    box.querySelector('.g-play-cover').replaceWith(frame);
    box.classList.add('is-playing');
    frame.focus();
    if (full && box.requestFullscreen) full.hidden = false;
  });
  if (full){
    full.addEventListener('click', () => {
      box.requestFullscreen().catch(() => {});
    });
  }
}
