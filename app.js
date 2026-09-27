/* PRIME TIME — signal lock, word staggers, menu, accordion (brief §5–§7) */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Wrap words in [data-words] headlines so staggers can address them */
  function wrapWords(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    var i = 0;
    nodes.forEach(function (node) {
      if (node.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(' '));
        } else {
          var s = document.createElement('span');
          s.className = 'wd';
          s.style.setProperty('--i', i++);
          s.textContent = part;
          frag.appendChild(s);
        }
      });
      el.replaceChild(frag, node);
    });
  }
  document.querySelectorAll('[data-words]').forEach(wrapWords);

  /* Hero load choreography */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('loaded'); });
  });

  /* Signal lock — sections tune from grain to clarity once in view */
  var locks = document.querySelectorAll('.lock');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    locks.forEach(function (s) { s.classList.add('locked'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('locked');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 100px 0px' });
    locks.forEach(function (s) { io.observe(s); });
  }

  /* FAQ gold-wash parallax — the glow drifts slower than the scroll */
  (function () {
    var faq = document.getElementById('faq');
    if (!faq || reduceMotion) return;
    var ticking = false;
    function paint() {
      ticking = false;
      var r = faq.getBoundingClientRect();
      var vh = window.innerHeight;
      if (r.bottom > -200 && r.top < vh + 200) {
        var p = (r.top + r.height / 2 - vh / 2) / vh;
        faq.style.setProperty('--faqGlow', (p * 60).toFixed(1) + 'px');
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    paint();
  })();

  /* Hero parallax — slide imagery drifts slower than the scroll, copy drifts least */
  (function () {
    var hero = document.getElementById('heroSlider');
    var slides = hero && hero.querySelector('.hero-slides');
    var content = hero && hero.querySelector('.hero-content');
    if (!hero || !slides || reduceMotion) return;
    var ticking = false;
    function paint() {
      ticking = false;
      var r = hero.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        var y = Math.max(0, Math.min(window.scrollY, r.height));
        slides.style.transform = 'translate3d(0,' + (y * 0.28).toFixed(1) + 'px,0) scale(1.06)';
        if (content) content.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0)';
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    paint();
  })();

  /* Top bar state */
  var topbar = document.getElementById('topbar');
  function onScroll() {
    topbar.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Demo lightbox — click a card for the full story */
  (function () {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.demo-card'));
    var lb = document.getElementById('demoLightbox');
    if (!cards.length || !lb) return;
    /* Fuller descriptions per demo; url: set a live URL when one exists and the
       "View Live Demo" button appears. null keeps it hidden. */
    var details = [
      { url: null, desc: 'A broadcast-grade home for hosts and their shows — episode guides, guest segments, and highlight reels, wrapped in a set design that puts the conversation front and center.' },
      { url: null, desc: 'A content platform with commerce baked in — product storytelling, step-by-step guides, and custom shop planning that turns viewers into buyers without ever leaving the channel.' },
      { url: null, desc: 'A network-style hub for a culture brand — guest management, episode scheduling, and live audience interaction, all under one roof and unmistakably on brand.' },
      { url: null, desc: 'An audio-first streaming experience — playlists, episode transcriptions, and subscriber management for shows that live in the listener\u2019s ears.' },
      { url: null, desc: 'A cinematic home for long-form storytelling — chapter navigation, behind-the-scenes features, and filmmaker profiles that give every film its own premiere.' }
    ];
    var lbImg = document.getElementById('lbImg');
    var lbCat = document.getElementById('lbCat');
    var lbTitle = document.getElementById('lbTitle');
    var lbDesc = document.getElementById('lbDesc');
    var lbVisit = document.getElementById('lbVisit');
    var lbBuild = document.getElementById('lbBuild');
    var current = 0, lastFocus = null;
    function show(i) {
      current = (i + cards.length) % cards.length;
      var card = cards[current];
      var img = card.querySelector('img');
      var title = card.querySelector('h3').textContent.trim();
      var d = details[current] || { url: null, desc: '' };
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.getAttribute('alt') || title;
      lbCat.textContent = card.querySelector('.cat').textContent.trim();
      lbTitle.textContent = title;
      lbDesc.textContent = d.desc || card.querySelector('.demo-body p').textContent.trim();
      if (d.url) { lbVisit.href = d.url; lbVisit.hidden = false; }
      else { lbVisit.hidden = true; }
      lbBuild.dataset.demo = title;
      lb.querySelector('.lightbox-panel').scrollTop = 0;
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lightbox-close').focus();
    }
    function close() {
      lb.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    cards.forEach(function (card, i) {
      var title = card.querySelector('h3').textContent.trim();
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Open details for ' + title);
      card.addEventListener('click', function () { open(i); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });
    document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
    document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });
    lb.querySelectorAll('[data-lb-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });
    /* "Build One Like This" — close, then jump to contact with the demo named */
    lbBuild.addEventListener('click', function () {
      var demo = lbBuild.dataset.demo || 'this demo';
      close();
      var project = document.querySelector('#contactForm textarea[name="project"]');
      if (project && !project.value) project.value = 'I\u2019m interested in a site like \u201C' + demo + '.\u201D ';
    });
  })();
  /* Back-to-top button — fades in once the reader is down the page */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    var showTop = function () {
      var y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      toTop.classList.toggle('show', y > 500);
    };
    window.addEventListener('scroll', showTop, { passive: true });
    document.addEventListener('scroll', showTop, { passive: true });
    showTop();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* Dev settings — gear menu (God UI style dropdown w/ submenus): slideshow modes + type combos */
  (function () {
    var btn = document.getElementById('settingsBtn');
    var root = document.getElementById('settingsMenu');
    if (!btn || !root) return;
    var combos = [
      { id: 'prime', name: 'Prime Time', display: "'Oswald',Impact,sans-serif", body: "'Inter',system-ui,sans-serif" },
      { id: 'condensed', name: 'Condensed', display: "'Barlow Condensed',Impact,sans-serif", body: "'Barlow',system-ui,sans-serif" },
      { id: 'montserrat', name: 'Montserrat', display: "'Montserrat',system-ui,sans-serif", body: "'Montserrat',system-ui,sans-serif" },
      { id: 'poppins', name: 'Poppins', display: "'Poppins',system-ui,sans-serif", body: "'Poppins',system-ui,sans-serif" },
      { id: 'dmsans', name: 'DM Sans', display: "'DM Sans',system-ui,sans-serif", body: "'DM Sans',system-ui,sans-serif" },
      { id: 'jonbeatz', name: 'JonBeatz', display: "'Syne',system-ui,sans-serif", body: "'Inter',system-ui,sans-serif" },
      { id: 'jonbeatzmono', name: 'JonBeatz Mono', display: "'IBM Plex Mono',ui-monospace,monospace", body: "'IBM Plex Mono',ui-monospace,monospace" }
    ];
    var activeCombo = 'montserrat';
    var fontsLoaded = false;
    function loadFonts() {
      if (fontsLoaded) return;
      fontsLoaded = true;
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&family=Montserrat:wght@400;500;700;800&family=Poppins:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&family=Syne:wght@400..800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';
      document.head.appendChild(l);
    }
    function applyCombo(id) {
      var c = null;
      combos.forEach(function (x) { if (x.id === id) c = x; });
      c = c || combos[2];
      activeCombo = c.id;
      document.documentElement.style.setProperty('--font-display', c.display);
      document.documentElement.style.setProperty('--font-body', c.body);
      try { localStorage.setItem('ptFontCombo3', c.id); } catch (e) {}
      refresh();
    }
    try { var sv = localStorage.getItem('ptFontCombo3'); if (sv) activeCombo = sv; } catch (e) {}
    function S() { return (window.PTSlideshow && window.PTSlideshow.get()) || { trans: 'fade', kb: true }; }
    function setTrans(m) { if (window.PTSlideshow) window.PTSlideshow.setTrans(m); refresh(); }
    function setKB(on) { if (window.PTSlideshow) window.PTSlideshow.setKB(on); refresh(); }
    var IC = {
      slides: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M10 9.5l4 2.5-4 2.5z" fill="currentColor" stroke="none"/></svg>',
      type: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 18L10 6l5 12M6.8 14h6.4"/></svg>',
      check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
      chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>'
    };
    function typeSubmenu() {
      var items = [{ type: 'label', label: 'Type combo' }];
      combos.forEach(function (c) {
        items.push({ label: c.name, checked: function () { return activeCombo === c.id; },
          select: function () { loadFonts(); applyCombo(c.id); } });
      });
      items.push({ type: 'separator' });
      items.push({ type: 'label', label: 'Locked: Montserrat' });
      return items;
    }
    function menuModel() {
      var st = S();
      return [
        { type: 'label', label: 'Preview settings' },
        { label: 'Slideshow', icon: IC.slides, submenu: [
          { type: 'label', label: 'Transition' },
          { label: 'Fade', checked: function () { return st.trans === 'fade'; }, select: function () { setTrans('fade'); } },
          { label: 'Slide', checked: function () { return st.trans === 'slide'; }, select: function () { setTrans('slide'); } },
          { label: 'Dip to black', checked: function () { return st.trans === 'dip'; }, select: function () { setTrans('dip'); } },
          { type: 'separator' },
          { label: 'Ken Burns', toggle: true, on: function () { return st.kb; }, select: function () { setKB(!st.kb); } }
        ] },
        { label: 'Typography', icon: IC.type, submenu: typeSubmenu() }
      ];
    }
    var openKey = null; // label of the row whose submenu is open
    function el(tag, cls, html) {
      var d = document.createElement(tag);
      if (cls) d.className = cls;
      if (html != null) d.innerHTML = html;
      return d;
    }
    function buildPanel(items, isSub) {
      var p = el('div', 'godmenu' + (isSub ? ' godmenu-sub opening' : ''));
      p.setAttribute('role', 'menu');
      items.forEach(function (it) {
        if (it.type === 'label') { p.appendChild(el('div', 'godmenu-label', it.label)); return; }
        if (it.type === 'separator') { p.appendChild(el('hr', 'godmenu-sep')); return; }
        var b = el('button', 'godmenu-row');
        b.setAttribute('role', 'menuitem');
        b.innerHTML = '<span class="ric">' + (it.icon || '') + '</span><span class="rlab">' +
          it.label + '</span>' +
          (it.toggle ? '<span class="rswitch" aria-hidden="true"></span>'
            : '<span class="rcheck" aria-hidden="true">' + IC.check + '</span>') +
          (it.submenu ? '<span class="rchev" aria-hidden="true">' + IC.chev + '</span>' : '');
        if (it.checked && it.checked()) b.classList.add('is-checked');
        if (it.toggle && it.on && it.on()) b.classList.add('is-on');
        b.setAttribute('aria-checked', it.toggle ? String(!!(it.on && it.on())) : String(!!(it.checked && it.checked())));
        if (it.submenu) {
          b.setAttribute('aria-haspopup', 'menu');
          b.setAttribute('aria-expanded', openKey === it.label ? 'true' : 'false');
          var open = function () { openKey = it.label; refresh(); };
          var close = function () { if (openKey === it.label) { openKey = null; refresh(); } };
          b.addEventListener('mouseenter', function () { if (window.matchMedia('(hover:hover)').matches) open(); });
          b.addEventListener('click', function (e) {
            e.stopPropagation();
            if (openKey === it.label) close(); else open();
          });
          if (openKey === it.label) b.appendChild(buildPanel(it.submenu, true));
        } else {
          b.addEventListener('click', function (e) { e.stopPropagation(); it.select(); });
          b.addEventListener('mouseenter', function () {
            if (window.matchMedia('(hover:hover)').matches && openKey) { openKey = null; refresh(); }
          });
        }
        p.appendChild(b);
      });
      return p;
    }
    function refresh() {
      root.innerHTML = '';
      var p = buildPanel(menuModel(), false);
      while (p.firstChild) root.appendChild(p.firstChild);
    }
    function isOpen() { return !root.hasAttribute('hidden'); }
    function open() {
      refresh();
      root.removeAttribute('hidden');
      root.classList.remove('opening');
      void root.offsetWidth;
      root.classList.add('opening');
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      root.setAttribute('hidden', '');
      root.classList.remove('opening');
      openKey = null;
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isOpen()) close(); else { loadFonts(); open(); }
    });
    document.addEventListener('mousedown', function (e) {
      if (isOpen() && !root.contains(e.target) && e.target !== btn && !btn.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { close(); btn.focus(); }
    });
    if (activeCombo !== 'montserrat') loadFonts();
    applyCombo(activeCombo);
  })();

  /* Scroll-spy — highlight the nav link for the section in view */
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-desktop a[data-nav]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('is-active'); });
          var a = map[en.target.id];
          if (a) a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) obs.observe(s);
    });
  })();

  /* Contact form — no backend on a static page, so compose a mailto */
  (function () {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var pkg = document.getElementById('packageSelect');
    var nameInput = form.querySelector('input[name="name"]');
    var emailInput = form.querySelector('input[name="email"]');
    var projectInput = form.querySelector('textarea[name="project"]');
    document.querySelectorAll('.pkg-cta').forEach(function (a) {
      a.addEventListener('click', function () {
        var card = a.closest('.pkg');
        var h3 = card && card.querySelector('h3');
        if (pkg && h3) pkg.value = h3.textContent.trim();
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = nameInput.value.trim();
      var email = emailInput.value.trim();
      if (!name || !/.+@.+\..+/.test(email)) {
        (name ? emailInput : nameInput).focus();
        return;
      }
      var subject = 'Consultation inquiry — ' + pkg.value;
      var body = 'Name: ' + name + '\nEmail: ' + email + '\nPackage: ' + pkg.value +
        '\n\nWhat I\'m launching:\n' + projectInput.value.trim();
      window.location.href = 'mailto:Admin@MyStudioChannel.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  })();

  /* Mobile overlay menu */
  var burger = document.getElementById('burger');
  var overlay = document.getElementById('menuOverlay');
  var closeBtn = document.getElementById('menuClose');
  function openMenu() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* Mobile submenu accordions (mocked submenu system) */
  overlay.querySelectorAll('.menu-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var row = btn.closest('.menu-row');
      var open = row.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* Selected-link highlight (click + scroll spy) */
  var spyLinks = document.querySelectorAll('[data-nav],[data-menu]');
  function setSelected(hash) {
    spyLinks.forEach(function (a) {
      a.classList.toggle('is-selected', a.getAttribute('href') === hash);
    });
  }
  spyLinks.forEach(function (a) {
    a.addEventListener('click', function () { setSelected(a.getAttribute('href')); });
  });
  var spyIds = ['own', 'packages', 'demos', 'process', 'contact'];
  if ('IntersectionObserver' in window && !reduceMotion) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setSelected('#' + e.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    spyIds.forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* FAQ accordion — first item open by default */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    btn.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  /* Voices — single quote stage rotator */
  var stage = document.getElementById('voiceStage');
  if (stage) {
    var slides = Array.prototype.slice.call(stage.querySelectorAll('.voice-slide'));
    var dotsBox = document.getElementById('voiceDots');
    var bar = document.getElementById('voiceBar');
    var idxEl = document.getElementById('voiceIndex');
    var totalEl = document.getElementById('voiceTotal');
    var DUR = 7000, idx = 0, timer = null, holding = false;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    totalEl.textContent = pad(slides.length);
    var dots = slides.map(function (_, i) {
      var d = document.createElement('button');
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      d.addEventListener('click', function () { show(i); restart(); });
      dotsBox.appendChild(d);
      return d;
    });
    function restartBar() {
      bar.classList.remove('run', 'hold');
      void bar.offsetWidth;
      if (!reduceMotion && !holding) bar.classList.add('run');
    }
    function show(n) {
      n = (n + slides.length) % slides.length;
      if (n === idx && slides[idx].classList.contains('is-active')) return;
      var prev = slides[idx];
      prev.classList.remove('is-active');
      prev.classList.add('is-leaving');
      prev.setAttribute('aria-hidden', 'true');
      setTimeout(function () { prev.classList.remove('is-leaving'); }, 650);
      idx = n;
      var cur = slides[idx];
      cur.classList.add('is-active');
      cur.setAttribute('aria-hidden', 'false');
      dots.forEach(function (d, i) {
        d.classList.toggle('is-on', i === idx);
        d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
      idxEl.textContent = pad(idx + 1);
      restartBar();
    }
    function next() { show(idx + 1); }
    function prev() { show(idx - 1); }
    function play() {
      stop();
      if (reduceMotion) return;
      timer = setInterval(next, DUR);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); play(); }
    function hold(on) {
      holding = on;
      bar.classList.toggle('hold', on);
      if (on) stop(); else play();
    }
    document.getElementById('voicePrev').addEventListener('click', function () { prev(); restart(); });
    document.getElementById('voiceNext').addEventListener('click', function () { next(); restart(); });
    stage.addEventListener('mouseenter', function () { hold(true); });
    stage.addEventListener('mouseleave', function () { hold(false); });
    stage.addEventListener('focusin', function () { hold(true); });
    stage.addEventListener('focusout', function () { hold(false); });
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); restart(); }
      else if (e.key === 'ArrowLeft') { prev(); restart(); }
    });
    var tx = null;
    stage.addEventListener('touchstart', function (e) {
      tx = e.touches[0].clientX;
      hold(true);
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (tx !== null) {
        var dx = e.changedTouches[0].clientX - tx;
        if (dx < -40) next();
        else if (dx > 40) prev();
      }
      tx = null;
      hold(false);
    }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else play();
    });
    dots[0].classList.add('is-on');
    dots[0].setAttribute('aria-selected', 'true');
    restartBar();
    play();
  }
  /* Hero — 4-slide slider (fade / slide / dip-to-black) with arrows + 01/04 counter */
  (function () {
    var hero = document.getElementById('heroSlider');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var copies = Array.prototype.slice.call(hero.querySelectorAll('.hero-copy'));
    var indexEl = document.getElementById('heroIndex');
    var prevBtn = document.getElementById('heroPrev');
    var nextBtn = document.getElementById('heroNext');
    var dotsBox = document.getElementById('heroDots');
    var bar = document.getElementById('heroBar');
    if (!slides.length || slides.length !== copies.length) return;
    var DUR = 7000, i = 0, timer = null, held = false;
    var trans = 'fade', kb = true, dipping = false;
    try {
      var sv = JSON.parse(localStorage.getItem('ptSlideSettings') || '{}');
      if (sv.trans === 'fade' || sv.trans === 'slide' || sv.trans === 'dip') trans = sv.trans;
      if (typeof sv.kb === 'boolean') kb = sv.kb;
    } catch (e) {}
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    var dots = [];
    if (dotsBox) {
      dots = slides.map(function (_, k) {
        var d = document.createElement('button');
        d.setAttribute('role', 'tab');
        d.setAttribute('aria-label', 'Show slide ' + (k + 1));
        d.addEventListener('click', function () { manual(k); });
        dotsBox.appendChild(d);
        return d;
      });
      dots[0].classList.add('is-on');
    }
    function applyMode() {
      if (trans === 'slide') hero.setAttribute('data-trans', 'slide');
      else hero.removeAttribute('data-trans');
      hero.setAttribute('data-kb', kb ? 'on' : 'off');
      slides.forEach(function (s) { s.classList.remove('was-active'); });
      try { localStorage.setItem('ptSlideSettings', JSON.stringify({ trans: trans, kb: kb })); } catch (e) {}
    }
    function restartBar() {
      if (!bar) return;
      bar.classList.remove('run', 'hold');
      void bar.offsetWidth;
      if (!reduceMotion && !held) bar.classList.add('run');
    }
    function setActiveVisual(next, dir) {
      if (trans === 'slide') {
        hero.setAttribute('data-dir', dir || 'fwd');
        var old = slides[i];
        old.classList.remove('is-active');
        old.classList.add('was-active');
        void hero.offsetWidth;
        slides[next].classList.add('is-active');
        setTimeout(function () { old.classList.remove('was-active'); }, 1300);
      } else {
        slides.forEach(function (s, k) { s.classList.toggle('is-active', k === next); });
      }
      copies.forEach(function (c, k) { c.classList.toggle('is-active', k === next); });
      dots.forEach(function (d, k) {
        d.classList.toggle('is-on', k === next);
        d.setAttribute('aria-selected', k === next ? 'true' : 'false');
      });
      if (indexEl) indexEl.textContent = pad(next + 1);
      i = next;
      restartBar();
    }
    function show(n, dir) {
      var next = (n + slides.length) % slides.length;
      if (dipping || next === i) return;
      if (trans === 'dip') {
        dipping = true;
        hero.classList.add('dipping');
        setTimeout(function () { setActiveVisual(next, dir); }, 480);
        setTimeout(function () { hero.classList.remove('dipping'); dipping = false; }, 980);
        return;
      }
      setActiveVisual(next, dir);
    }
    function pickDir(from, to) {
      var len = slides.length;
      if (to === (from + 1) % len) return 'fwd';
      if (from === (to + 1) % len) return 'back';
      return to > from ? 'fwd' : 'back';
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function play() {
      stop();
      if (reduceMotion || held || document.hidden) return;
      timer = setInterval(function () { show(i + 1, 'fwd'); }, DUR);
    }
    function hold(v) {
      held = v;
      if (bar) bar.classList.toggle('hold', v);
      if (v) { stop(); } else { play(); restartBar(); }
    }
    function manual(n) { show(n, pickDir(i, n)); stop(); play(); }
    if (prevBtn) prevBtn.addEventListener('click', function () { manual(i - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { manual(i + 1); });
    hero.addEventListener('mouseenter', function () { hold(true); });
    hero.addEventListener('mouseleave', function () { hold(false); });
    hero.addEventListener('focusin', function () { hold(true); });
    hero.addEventListener('focusout', function () { hold(false); });
    var tx = null;
    hero.addEventListener('touchstart', function (e) {
      tx = e.touches[0].clientX;
      hold(true);
    }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (tx !== null) {
        var dx = e.changedTouches[0].clientX - tx;
        if (dx < -40) show(i + 1, 'fwd');
        else if (dx > 40) show(i - 1, 'back');
      }
      tx = null;
      hold(false);
    }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { play(); restartBar(); }
    });
    window.PTSlideshow = {
      setTrans: function (m) { if (m === 'fade' || m === 'slide' || m === 'dip') { trans = m; applyMode(); } },
      setKB: function (on) { kb = !!on; applyMode(); },
      get: function () { return { trans: trans, kb: kb }; }
    };
    applyMode();
    play();
  })();

  /* Demos — creator carousel arrows + counter */
  (function () {
    var row = document.getElementById('demoRow');
    if (!row) return;
    var prevBtn = document.getElementById('demoPrev');
    var nextBtn = document.getElementById('demoNext');
    var indexEl = document.getElementById('demoIndex');
    var totalEl = document.getElementById('demoTotal');
    var controls = document.querySelector('.demo-controls');
    var cards = Array.prototype.slice.call(row.querySelectorAll('.demo-card'));
    if (!cards.length) return;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    if (totalEl) totalEl.textContent = pad(cards.length);
    function currentCard() {
      var x = row.scrollLeft + row.clientWidth * 0.2;
      var best = 0;
      cards.forEach(function (c, k) { if (c.offsetLeft <= x) best = k; });
      return best;
    }
    function goTo(k) {
      k = Math.max(0, Math.min(cards.length - 1, k));
      row.scrollTo({ left: cards[k].offsetLeft - row.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    var raf = null;
    function paintIndex() {
      raf = null;
      if (indexEl) indexEl.textContent = pad(currentCard() + 1);
    }
    row.addEventListener('scroll', function () {
      if (!raf) raf = requestAnimationFrame(paintIndex);
    }, { passive: true });
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(currentCard() - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(currentCard() + 1); });
    function checkStatic() {
      var isStatic = row.scrollWidth <= row.clientWidth + 8;
      if (controls) controls.classList.toggle('is-static', isStatic);
    }
    window.addEventListener('resize', checkStatic);
    checkStatic();
    paintIndex();
  })();

  /* Process — GodUI-style scroll timeline: gold line draws as you scroll */
  (function () {
    var timeline = document.getElementById('processTimeline');
    if (!timeline) return;
    var fill = document.getElementById('tlFill');
    var steps = Array.prototype.slice.call(timeline.querySelectorAll('.step'));
    if (reduceMotion || !('IntersectionObserver' in window)) {
      steps.forEach(function (s) { s.classList.add('is-on'); });
      if (fill) fill.style.transform = 'scaleY(1)';
      return;
    }
    var stepIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-on');
          stepIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });
    steps.forEach(function (s) { stepIO.observe(s); });
    var ticking = false;
    function paint() {
      ticking = false;
      if (!fill) return;
      var r = timeline.getBoundingClientRect();
      var done = Math.min(Math.max((window.innerHeight * 0.62 - r.top) / r.height, 0), 1);
      fill.style.transform = 'scaleY(' + done.toFixed(3) + ')';
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(paint); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    paint();
  })();

})();
