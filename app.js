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
})();
