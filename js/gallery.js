// ============ screenshot lightbox ============
// Thumbnails are plain links to the full image (works without JS). With JS they
// open in a <dialog>: Esc closes, arrow keys / buttons move between shots, and
// focus returns to the thumbnail that opened it.
(function(){
  const list = document.querySelector(".g-shots");
  if (!list || typeof HTMLDialogElement !== "function") return;
  const links = [...list.querySelectorAll(".g-shot")];
  if (!links.length) return;

  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.innerHTML = `
    <figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>
    <button type="button" class="lb-btn lb-close" aria-label="${list.dataset.close}">✕</button>
    <button type="button" class="lb-btn lb-prev" aria-label="${list.dataset.prev}">‹</button>
    <button type="button" class="lb-btn lb-next" aria-label="${list.dataset.next}">›</button>`;
  document.body.appendChild(dlg);

  const img = dlg.querySelector(".lb-img");
  const cap = dlg.querySelector(".lb-cap");
  let index = 0, opener = null;

  const show = (i) => {
    index = (i + links.length) % links.length;
    const thumb = links[index].querySelector("img");
    img.src = links[index].href;
    img.alt = thumb.alt;
    cap.textContent = `${index + 1} / ${links.length} · ${thumb.alt}`;
  };

  links.forEach((a, i) => a.addEventListener("click", (e) => {
    e.preventDefault();
    opener = a;
    show(i);
    dlg.showModal();
  }));

  dlg.querySelector(".lb-close").addEventListener("click", () => dlg.close());
  dlg.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
  dlg.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  // click on the backdrop closes
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { if (opener) opener.focus(); });
})();
