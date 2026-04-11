/* ============================================================
   Clave Pro Services — Shared JavaScript
   Language toggle, hamburger menu, active nav, WhatsApp tooltip
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Language Toggle ---------- */
  const LANG_KEY = 'clavepro_lang';

  function getStoredLang() {
    return localStorage.getItem(LANG_KEY) || 'es'; // default Spanish
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = el.getAttribute('data-' + lang) || '';
      } else if (el.tagName === 'OPTION') {
        el.textContent = el.getAttribute('data-' + lang) || '';
      } else {
        el.innerHTML = el.getAttribute('data-' + lang) || '';
      }
    });

    // Update toggle button
    var toggleBtns = document.querySelectorAll('.lang-toggle');
    toggleBtns.forEach(function (btn) {
      if (lang === 'en') {
        btn.innerHTML = '🇲🇽 ES';
      } else {
        btn.innerHTML = '🇺🇸 EN';
      }
    });
  }

  /* ---------- Hamburger Menu ---------- */
  function initHamburger() {
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  /* ---------- Active Nav Link ---------- */
  function setActiveNav() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ---------- Contact Form mailto ---------- */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]').value;
      var email = form.querySelector('[name="email"]').value;
      var phone = form.querySelector('[name="phone"]').value;
      var service = form.querySelector('[name="service"]').value;
      var message = form.querySelector('[name="message"]').value;

      var subject = encodeURIComponent('New Inquiry from ' + name);
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Service: ' + service + '\n\n' +
        message
      );

      window.location.href = 'mailto:angela@clavepros.com?subject=' + subject + '&body=' + body;
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    // Language
    var lang = getStoredLang();
    setLang(lang);

    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = getStoredLang();
        var next = current === 'en' ? 'es' : 'en';
        setLang(next);
      });
    });

    initHamburger();
    setActiveNav();
    initContactForm();
  });
})();
