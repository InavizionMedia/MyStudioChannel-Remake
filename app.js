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
    }, { threshold: 0.18 });
    locks.forEach(function (s) { io.observe(s); });
  }

  /* Top bar state */
  var topbar = document.getElementById('topbar');
  function onScroll() {
    topbar.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
})();
