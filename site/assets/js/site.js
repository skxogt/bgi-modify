/* BGI Solution | version 2 | no remote dependencies */
(() => {
  'use strict';
  const root = document.documentElement;
  const menu = document.getElementById('main-navigation');
  const menuButton = document.getElementById('menuToggle');
  let menuReady = false;
  if (menu && menuButton) {
    const narrow = window.matchMedia('(max-width: 960px)');
    const servicesDetails = menu.querySelector('details.nav-services');
    const closeMenu = (returnFocus = false) => {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      if (servicesDetails) servicesDetails.open = false;
      if (returnFocus && narrow.matches) menuButton.focus();
    };
    const setMode = () => {
      if (!narrow.matches) closeMenu(false);
      if (narrow.matches) {
        menuButton.hidden = false;
      } else {
        menuButton.hidden = true;
      }
    };
    menuButton.addEventListener('click', () => {
      const open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      if (!open && servicesDetails) servicesDetails.open = false;
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (servicesDetails?.open) { servicesDetails.open = false; servicesDetails.querySelector('summary')?.focus(); return; }
      if (menu.classList.contains('is-open')) { event.preventDefault(); closeMenu(true); }
    });
    document.addEventListener('pointerdown', (event) => {
      if (menu.contains(event.target) || menuButton.contains(event.target)) return;
      if (servicesDetails?.open) servicesDetails.open = false;
      if (menu.classList.contains('is-open')) closeMenu(false);
    });
    if (typeof narrow.addEventListener === 'function') narrow.addEventListener('change', setMode);
    else if (typeof narrow.addListener === 'function') narrow.addListener(setMode);
    setMode();
    menuReady = true;
  }
  // Hide the narrow menu only after listeners exist, preserving useful no-JS navigation.
  if (menuReady) root.classList.add('js');

  // One transient missing-image treatment; the original src stays unchanged for reload recovery.
  document.querySelectorAll('img[data-asset-id], .media-frame img').forEach((img) => {
    const frame = img.closest('.media-frame');
    const absent = () => { img.classList.add('is-missing'); frame?.classList.add('media--missing'); };
    const loaded = () => { img.classList.remove('is-missing'); frame?.classList.remove('media--missing'); };
    img.addEventListener('error', absent);
    img.addEventListener('load', loaded);
    if (img.complete) { if (img.naturalWidth === 0) absent(); else loaded(); }
  });

  // Hero video: UI reflects real media events. Absence or failed playback never hides HTML content/still.
  const video = document.getElementById('heroVideo');
  const videoBtn = document.getElementById('videoControlBtn');
  const heroFrame = video?.closest('.hero-media');
  if (video && videoBtn && heroFrame) {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    let userPaused = false;
    let manualOptIn = false;
    let failed = false;
    let pending = false;
    let confirmedPlaying = false;
    const dataSaving = () => Boolean(connection?.saveData);
    const render = () => {
      const playing = confirmedPlaying && !video.paused && !video.ended && !failed && video.readyState >= 2;
      heroFrame.classList.toggle('video-is-playing', playing);
      videoBtn.textContent = playing ? 'Pause background video' : 'Play background video';
      videoBtn.hidden = failed;
    };
    const stop = () => { confirmedPlaying = false; if (!video.paused) video.pause(); heroFrame.classList.remove('video-is-playing'); render(); };
    const attempt = (manual = false) => {
      if (failed || pending) return;
      if (manual) { userPaused = false; manualOptIn = true; }
      if (!manual && (userPaused || motion.matches || dataSaving())) return;
      pending = true;
      try {
        const result = video.play();
        Promise.resolve(result).catch(() => { if (!failed) { heroFrame.classList.remove('video-is-playing'); render(); } })
          .finally(() => { pending = false; });
      } catch (_) { pending = false; render(); }
    };
    video.addEventListener('playing', () => { confirmedPlaying = true; pending = false; render(); });
    video.addEventListener('pause', () => { confirmedPlaying = false; render(); });
    video.addEventListener('ended', () => { confirmedPlaying = false; render(); });
    video.addEventListener('waiting', () => { confirmedPlaying = false; render(); });
    video.addEventListener('stalled', () => { confirmedPlaying = false; pending = false; render(); });
    const fatal = () => { failed = true; pending = false; confirmedPlaying = false; stop(); videoBtn.hidden = true; };
    video.addEventListener('error', fatal);
    video.querySelectorAll('source').forEach(src => src.addEventListener('error', fatal));
    videoBtn.addEventListener('click', () => {
      if (failed) return;
      if (video.paused) attempt(true);
      else { userPaused = true; manualOptIn = false; stop(); }
    });
    const reduceChange = () => {
      if (motion.matches) { manualOptIn = false; stop(); }
      else if (!userPaused && !dataSaving()) attempt();
    };
    if (typeof motion.addEventListener === 'function') motion.addEventListener('change', reduceChange);
    else if (typeof motion.addListener === 'function') motion.addListener(reduceChange);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (!userPaused && (manualOptIn || (!motion.matches && !dataSaving()))) attempt(manualOptIn);
    });
    videoBtn.hidden = false;
    render();
    attempt();
  }

  // Search is a progressive enhancement. Native links remain usable without scripting.
  const searchPanel = document.getElementById('servicesSearch');
  const searchField = document.getElementById('serviceSearch');
  const aliases = {
    'customer acquisition': ['SVC-14','SVC-12'],
    'not enough customers': ['SVC-12','SVC-09','SVC-14'],
    'no leads': ['SVC-12','SVC-09'],
    'lead generation': ['SVC-12'],
    'getting leads': ['SVC-12','SVC-09'],
    'getting customers': ['SVC-12','SVC-14'],
    'need more customers': ['SVC-12','SVC-14'],
    'customer retention': ['SVC-17'],
    'keeping customers': ['SVC-17'],
    'website help': ['SVC-18'],
    'new website': ['SVC-18'],
    'online visibility': ['SVC-09'],
    'not showing on google': ['SVC-09'],
    'ai readiness': ['SVC-19']
  };
  const normalized = (s) => s.toLocaleLowerCase().normalize('NFKC').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  if (searchPanel && searchField) {
    const cards = Array.from(document.querySelectorAll('.service-item[data-filter-text]'));
    const groups = Array.from(document.querySelectorAll('.directory-group'));
    const status = document.getElementById('serviceCount');
    const clear = document.getElementById('clearSearch');
    const filter = () => {
      const query = normalized(searchField.value);
      const expected = aliases[query] || [];
      let visible = 0;
      cards.forEach(card => {
        const id = card.getAttribute('data-service-code');
        const hay = normalized(card.dataset.filterText || '');
        const show = !query || hay.includes(query) || expected.includes(id);
        card.hidden = !show;
        if (show) visible += 1;
      });
      groups.forEach(group => { group.hidden = !group.querySelector('.service-item:not([hidden])'); });
      if (status) status.textContent = !query ? 'Showing all 20 services' : visible ? `${visible} relevant service${visible===1?'':'s'} found. Open a service to learn more.` : 'No exact match. Try leads, website, customers, research or contact us with your question.';
      if (clear) clear.hidden = !query;
    };
    searchField.addEventListener('input', filter);
    clear?.addEventListener('click', () => { searchField.value=''; filter(); searchField.focus(); });
    searchPanel.hidden = false;
    filter();
  }
  const workPanel = document.getElementById('workDiscovery');
  const workSearch = document.getElementById('workSearch');
  if (workPanel && workSearch) {
    const demos = Array.from(document.querySelectorAll('.demo-list-item[data-niche], .demo-card[data-niche]'));
    const status = document.getElementById('workCount');
    const filterWork = () => {
      const query = normalized(workSearch.value);
      let count=0;
      demos.forEach(li=>{
        const text = normalized(li.dataset.niche+' '+li.textContent);
        li.hidden = !!query && !text.includes(query);
        if (!li.hidden) count++;
      });
      if (status) status.textContent = query ? (count ? `${count} matching design${count===1?'':'s'}` : 'No matching design yet. Try another industry, or contact us.') : 'Showing all 20 website designs';
    };
    workPanel.hidden = false;
    workSearch.addEventListener('input',filterWork);
    filterWork();
  }
  // Sticky header gets a hairline + shadow once the page scrolls.
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Gentle reveal on scroll. Content is fully visible without JS or with reduced motion.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length && !reduceMotion.matches) {
    root.classList.add('reveal-ready');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach((el) => {
      // Anything already on screen shows immediately (no flash on load).
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-visible');
      else io.observe(el);
    });
  }

  // Carousel pause/play (WCAG 2.2.2: moving content can be paused).
  document.querySelectorAll('[data-marquee-toggle]').forEach((btn) => {
    const target = document.getElementById(btn.getAttribute('aria-controls'));
    if (!target) return;
    const label = btn.querySelector('span');
    const svg = btn.querySelector('svg');
    const pausePath = '<path d="M9 5v14M15 5v14"/>';
    const playPath = '<path d="M7 5l12 7-12 7Z"/>';
    btn.addEventListener('click', () => {
      const paused = target.classList.toggle('is-paused');
      btn.setAttribute('aria-pressed', String(paused));
      if (label) label.textContent = paused ? 'Play carousel' : 'Pause carousel';
      if (svg) svg.innerHTML = paused ? playPath : pausePath;
    });
  });

  // Contact forms. If data-endpoint is set (e.g. a Formspree URL), the message is posted there.
  // Otherwise the visitor's email app opens with the message ready to send to data-email.
  document.querySelectorAll('form[data-contact-form]').forEach((form) => {
    const status = form.querySelector('.form-status');
    const submit = form.querySelector('[type="submit"]');
    const say = (msg, kind) => { if (!status) return; status.textContent = msg; status.className = 'form-status' + (kind ? ' is-' + kind : ''); };
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      if ((data.get('_gotcha') || '').toString().trim()) return; // bot trap
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const company = (data.get('company') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();
      const problems = [];
      [['name', !name], ['email', !emailOk(email)], ['message', !message]].forEach(([field, bad]) => {
        const el = form.elements[field];
        if (el) el.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad) problems.push(el);
      });
      if (problems.length) {
        say('Please add your name, a valid email address and a short message.', 'error');
        problems[0].focus();
        return;
      }
      const endpoint = form.dataset.endpoint;
      const to = form.dataset.email || 'hello@bgisolution.com';
      if (endpoint) {
        submit.disabled = true;
        say('Sending…');
        try {
          const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          say('Thank you! Your message has been sent. We will reply by email soon.', 'ok');
        } catch (_) {
          say('Sorry, your message could not be sent. Please email ' + to + ' instead.', 'error');
        } finally { submit.disabled = false; }
        return;
      }
      const subject = 'Website inquiry from ' + name + (company ? ' (' + company + ')' : '');
      const body = message + '\n\n' + name + '\n' + email + (company ? '\n' + company : '');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      say('Your email app should open with your message ready to send. If nothing happens, email us at ' + to + '.', 'ok');
    });
  });
})();
