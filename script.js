(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Cookie banner
  const cookie = $('#cookie');
  const cookieOk = $('#cookie-ok');
  if (cookie && cookieOk) {
    const seen = localStorage.getItem('kerf-cookie-ok');
    if (!seen) cookie.classList.add('show');
    cookieOk.addEventListener('click', () => {
      localStorage.setItem('kerf-cookie-ok', '1');
      cookie.classList.remove('show');
    });
  }

  // Talk to sales
  const talk = $('#talk-sales');
  const salesNote = $('#sales-note');
  if (talk && salesNote) {
    talk.addEventListener('click', () => {
      salesNote.hidden = false;
      talk.classList.add('is-disabled');
      talk.setAttribute('disabled', 'disabled');
    });
  }

  // Gantt kerf shrink effect
  const bars = $$('.bar');
  let tick = 0;
  if (bars.length) {
    setInterval(() => {
      tick += 1;
      bars.forEach((bar, i) => {
        const base = parseFloat(getComputedStyle(bar).getPropertyValue('--w')) || 50;
        // subtle breathe + occasional shave
        const shave = (tick % 8 === 0) ? 1.2 + i * 0.15 : 0;
        const next = Math.max(14, base - shave + Math.sin((tick + i) / 3) * 0.4);
        bar.style.setProperty('--w', next.toFixed(2) + '%');
      });
    }, 400);
  }

  // Service / material toggle
  const modeService = $('#mode-service');
  const modeMaterial = $('#mode-material');
  const modeIcons = $('#mode-icons');
  const modeText = $('#mode-text');
  const toast = $('#toast');
  let lastMode = 'service';
  let crisisArmed = false;

  function setMode(mode, { forceCrisis = false } = {}) {
    const isService = mode === 'service';
    modeService.classList.toggle('active', isService);
    modeMaterial.classList.toggle('active', !isService);
    modeIcons.textContent = isService ? '👷 👷 👷 👷' : '📦 🪵 📐 📦';
    modeText.textContent = isService
      ? 'Hours that walk, talk, and burn PTO.'
      : 'Sheet goods, hardware, and the stuff that dents the truck.';

    if (forceCrisis || (crisisArmed && mode !== lastMode)) {
      toast.hidden = false;
      clearTimeout(toast._t);
      toast._t = setTimeout(() => { toast.hidden = true; }, 3200);
    }
    lastMode = mode;
    crisisArmed = true;
  }

  if (modeService && modeMaterial) {
    modeService.addEventListener('click', () => setMode('service'));
    modeMaterial.addEventListener('click', () => setMode('material'));
  }

  // Quotes carousel
  const quotes = $$('.quote');
  const dotsWrap = $('#quote-dots');
  let qIndex = 0;
  if (quotes.length && dotsWrap) {
    quotes.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show quote ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => showQuote(i));
      dotsWrap.appendChild(b);
    });
    const dots = $$('button', dotsWrap);
    function showQuote(i) {
      qIndex = i;
      quotes.forEach((q, idx) => q.classList.toggle('active', idx === i));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    }
    setInterval(() => showQuote((qIndex + 1) % quotes.length), 4200);
  }

  // Chat widget
  const chatToggle = $('#chat-toggle');
  const chatPanel = $('#chat-panel');
  if (chatToggle && chatPanel) {
    chatToggle.addEventListener('click', () => {
      const open = chatPanel.hidden;
      chatPanel.hidden = !open;
      chatToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Demo buttons that are intentionally useless-ish
  $$('a.btn').forEach((btn) => {
    if (btn.textContent.trim() === 'Start Free Trial') {
      btn.addEventListener('click', (e) => {
        if (btn.getAttribute('href') === '#cta') {
          e.preventDefault();
          btn.textContent = 'Trial disabled (on purpose)';
          btn.classList.add('is-disabled');
        }
      }, { once: true });
    }
    if (btn.textContent.trim() === 'Book a Demo') {
      btn.addEventListener('click', (e) => {
        if (btn.getAttribute('href') === '#cta') {
          e.preventDefault();
          btn.textContent = 'Next slot: Q4 2029';
        }
      }, { once: true });
    }
  });
})();
