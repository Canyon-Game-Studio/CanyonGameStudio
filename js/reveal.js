// ============ reveal-title animation ============
// Splits a title into line / word / char spans and slides each char up into
// place when the title scrolls into view. Re-runnable: call it again after the
// i18n layer rewrites a title's innerHTML (language toggle) to re-split.
// Inline elements inside a title (e.g. a coloured <span>) are preserved by
// copying their class onto the char spans, so the letters still animate AND
// keep their styling.
function initRevealTitles(){
  const widgets = document.querySelectorAll(".reveal-title");
  if (!widgets.length) return;

  widgets.forEach(widget => {
    const title = widget.querySelector(".elementor-heading-title") || widget;
    if (!title) return;

    const source = document.createElement("div");
    source.innerHTML = title.innerHTML;
    title.innerHTML = "";

    let line = null;
    let word = null;

    const newLine = () => {
      line = document.createElement("span");
      line.className = "line-wrap";
      title.appendChild(line);
      word = null;
    };

    const addChar = (ch, cls) => {
      if (/\s/.test(ch)) {                 // whitespace ends the current word
        line.appendChild(document.createTextNode(ch));
        word = null;
        return;
      }
      if (!word) {
        word = document.createElement("span");
        word.className = "word";
        line.appendChild(word);
      }
      const c = document.createElement("span");
      c.className = cls ? ("char " + cls) : "char";
      c.textContent = ch;
      word.appendChild(c);
    };

    // Walk the source DOM. Text becomes chars; inline elements recurse and pass
    // their class down so a coloured letter keeps its colour; <br> starts a line.
    const walk = (node, cls) => {
      node.childNodes.forEach(n => {
        if (n.nodeName === "BR") { newLine(); return; }
        if (n.nodeType === Node.TEXT_NODE) {
          [...n.textContent].forEach(ch => addChar(ch, cls));
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          walk(n, n.getAttribute("class") || cls);
        }
      });
    };

    newLine();
    walk(source, null);

    // Titles are hidden until split (see `.js .reveal-title` in the CSS) so the
    // un-animated text never flashes on load. Reveal now that it's split.
    widget.style.visibility = "visible";

    const chars = title.querySelectorAll(".char");

    if (widget._revealObserver) widget._revealObserver.disconnect();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          chars.forEach((char, index) => {
            setTimeout(() => {
              char.classList.add("is-visible");
            }, index * 28);
          });

          observer.unobserve(widget);
        }
      });
    }, {
      threshold: 0.25
    });

    widget._revealObserver = observer;
    observer.observe(widget);
  });
}

window.initRevealTitles = initRevealTitles;


// ============ scale-in on scroll ============
// Elements with .scale-in start small + hidden and grow to full size from their
// centre the first time they scroll into view (used by the contact button).
function initScaleIns(){
  const els = document.querySelectorAll(".scale-in");
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  els.forEach(el => observer.observe(el));
}

// ============ marquee ============
// Duplicate the marquee content once so the -50% keyframe loops seamlessly,
// then start it. Without JS the single group just shows statically.
function initMarquees(){
  document.querySelectorAll(".marquee-track").forEach(track => {
    const group = track.querySelector(".marquee-group");
    if (!group) return;
    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
    track.classList.add("is-ready");
  });
}

function bootAnimations(){
  initScaleIns();
  initMarquees();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootAnimations);
} else {
  bootAnimations();
}
