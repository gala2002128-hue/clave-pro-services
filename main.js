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

  /* ---------- Contact Form → Airtable ---------- */
  var AIRTABLE_BASE  = 'appZpPihAI3InXMdx';
  var AIRTABLE_TABLE = 'tbl1TjdsA3JgCAfdl';
  var AIRTABLE_TOKEN = 'patnswTAVvjglK3b8.511e3c35ea5640400933c2b00eb454429724ad480c293a60cd91bca9f77df1d7';

  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var lang = getStoredLang();

      var name    = form.querySelector('[name="name"]').value.trim();
      var email   = form.querySelector('[name="email"]').value.trim();
      var phone   = form.querySelector('[name="phone"]').value.trim();
      var service = form.querySelector('[name="service"]');
      var serviceText = service.options[service.selectedIndex].getAttribute('data-en') || service.value;
      var message = form.querySelector('[name="message"]').value.trim();

      // Disable button while submitting
      submitBtn.disabled = true;
      submitBtn.textContent = lang === 'en' ? 'Sending...' : 'Enviando...';

      var payload = {
        records: [{
          fields: {
            'Name': name,
            'E-mail': email,
            'Phone': phone,
            'Type of Service': serviceText,
            'Status': 'New'
          }
        }]
      };

      // Store message in Notes if field exists, otherwise append to Name
      if (message) {
        payload.records[0].fields['Name'] = name + ' — ' + message;
      }

      fetch('https://api.airtable.com/v0/' + AIRTABLE_BASE + '/' + AIRTABLE_TABLE, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + AIRTABLE_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(function (res) {
        if (!res.ok) throw new Error('Airtable error: ' + res.status);
        return res.json();
      })
      .then(function () {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = lang === 'en' ? 'Send Message' : 'Enviar Mensaje';

        // Send WhatsApp notification to Angela
        var waMsg = '🔔 New lead from clavepros.com\n\n'
          + '👤 ' + name + '\n'
          + '📧 ' + email + '\n'
          + (phone ? '📱 ' + phone + '\n' : '')
          + '🏷️ ' + serviceText + '\n'
          + (message ? '\n💬 ' + message : '');
        var waURL = 'https://wa.me/12819357568?text=' + encodeURIComponent(waMsg);
        window.open(waURL, '_blank');

        alert(lang === 'en'
          ? 'Thank you! We will contact you shortly.'
          : '¡Gracias! Nos pondremos en contacto contigo pronto.');
      })
      .catch(function (err) {
        console.error(err);
        submitBtn.disabled = false;
        submitBtn.textContent = lang === 'en' ? 'Send Message' : 'Enviar Mensaje';
        alert(lang === 'en'
          ? 'Something went wrong. Please try again or contact us via WhatsApp.'
          : 'Algo salió mal. Inténtalo de nuevo o contáctanos por WhatsApp.');
      });
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
