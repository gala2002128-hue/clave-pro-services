/* ============================================================
   Clave Pro Services — Shared JavaScript
   Language toggle, hamburger menu, active nav, document selector,
   contact form with Airtable integration
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Language Toggle ---------- */
  var LANG_KEY = 'clavepro_lang';

  function getStoredLang() {
    return localStorage.getItem(LANG_KEY) || 'es';
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

    var toggleBtns = document.querySelectorAll('.lang-toggle');
    toggleBtns.forEach(function (btn) {
      btn.innerHTML = lang === 'en' ? '🇲🇽 ES' : '🇺🇸 EN';
    });

    // Re-render document list if selector is active
    var sel = document.getElementById('docServiceSelect');
    if (sel && sel.value) renderDocList(sel.value);
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

  /* ---------- Document Requirements Data ---------- */
  var DOC_DATA = {
    'tax-individual': {
      en: {
        title: 'Tax Preparation — Individual',
        docs: [
          'Valid photo ID (driver\'s license or passport)',
          'Social Security cards for all household members',
          'W-2 forms from all employers',
          '1099 forms (1099-NEC, 1099-MISC, 1099-K if applicable)',
          '1095-A if you have Marketplace health insurance (Healthcare.gov)',
          'Last year\'s tax return (if available)',
          'Bank account information for direct deposit'
        ]
      },
      es: {
        title: 'Preparación de Impuestos — Individual',
        docs: [
          'Identificación con foto válida (licencia de conducir o pasaporte)',
          'Tarjetas de Seguro Social de todos los miembros del hogar',
          'Formularios W-2 de todos los empleadores',
          'Formularios 1099 (1099-NEC, 1099-MISC, 1099-K si aplica)',
          '1095-A si tiene seguro de salud del Marketplace (Healthcare.gov)',
          'Declaración del año anterior (si está disponible)',
          'Información bancaria para depósito directo'
        ]
      }
    },
    'tax-business': {
      en: {
        title: 'Tax Preparation — Business',
        docs: [
          'Valid photo ID',
          'Social Security card or EIN',
          'All 1099-NEC received from clients',
          'Business income records or bank statements (all 12 months)',
          'List of business expenses with receipts',
          '1099-NEC issued to subcontractors (if applicable)',
          'Vehicle mileage log for business use',
          'W-2 of spouse if filing jointly',
          '1095-A if applicable'
        ]
      },
      es: {
        title: 'Preparación de Impuestos — Negocio',
        docs: [
          'Identificación con foto válida',
          'Tarjeta de Seguro Social o EIN',
          'Todos los 1099-NEC recibidos de clientes',
          'Registros de ingresos del negocio o estados de cuenta (los 12 meses)',
          'Lista de gastos del negocio con recibos',
          '1099-NEC emitidos a subcontratistas (si aplica)',
          'Registro de millas del vehículo de uso comercial',
          'W-2 del cónyuge si declaran juntos',
          '1095-A si aplica'
        ]
      }
    },
    'llc': {
      en: {
        title: 'LLC Formation',
        docs: [
          'Valid photo ID',
          'Social Security Number or ITIN',
          'Desired company name (we\'ll verify availability)',
          'Business address',
          'Names and addresses of all members/owners',
          'Business purpose description'
        ]
      },
      es: {
        title: 'Formación de LLC',
        docs: [
          'Identificación con foto válida',
          'Número de Seguro Social o ITIN',
          'Nombre deseado para la empresa (verificaremos disponibilidad)',
          'Dirección del negocio',
          'Nombres y direcciones de todos los miembros/dueños',
          'Descripción del propósito del negocio'
        ]
      }
    },
    'trucking': {
      en: {
        title: 'Trucking Compliance (USDOT, TxDMV, IFTA, UCR, NY HUT)',
        docs: [
          'Valid photo ID',
          'EIN (Federal Employer Identification Number)',
          'Company name and business address',
          'Vehicle information: VIN, year, make, model, GVWR for each truck',
          'Number of trucks in fleet',
          'Type of cargo transported',
          'States of operation'
        ]
      },
      es: {
        title: 'Cumplimiento de Transporte (USDOT, TxDMV, IFTA, UCR, NY HUT)',
        docs: [
          'Identificación con foto válida',
          'EIN (Número de Identificación Federal del Empleador)',
          'Nombre de la empresa y dirección del negocio',
          'Información de vehículos: VIN, año, marca, modelo, GVWR de cada camión',
          'Número de camiones en la flota',
          'Tipo de carga transportada',
          'Estados de operación'
        ]
      }
    },
    'notary': {
      en: {
        title: 'Notary Services',
        docs: [
          'Valid government-issued photo ID for each person signing',
          'The document(s) to be notarized (do NOT sign before the appointment)'
        ]
      },
      es: {
        title: 'Servicios Notariales',
        docs: [
          'Identificación con foto emitida por el gobierno para cada firmante',
          'El/los documento(s) a notarizar (NO firme antes de la cita)'
        ]
      }
    },
    'immigration': {
      en: {
        title: 'Immigration Forms',
        docs: [
          'Valid photo ID (passport preferred)',
          'Current immigration documents (visa, green card, EAD, etc.)',
          'Previous immigration applications (if any)',
          'Fee payment receipt (USCIS fees paid separately by client)'
        ]
      },
      es: {
        title: 'Formularios de Inmigración',
        docs: [
          'Identificación con foto válida (pasaporte preferido)',
          'Documentos de inmigración actuales (visa, tarjeta verde, EAD, etc.)',
          'Solicitudes de inmigración anteriores (si las hay)',
          'Recibo de pago de tarifas (tarifas de USCIS pagadas por el cliente)'
        ]
      }
    },
    'lis-medicare': {
      en: {
        title: 'LIS / Medicare Extra Help',
        docs: [
          'Medicare card (red, white and blue)',
          'Social Security card',
          'Proof of income (Social Security award letter, W-2, or pay stubs)',
          'Bank statements (last 3 months)',
          'List of prescription medications'
        ]
      },
      es: {
        title: 'LIS / Ayuda Extra de Medicare',
        docs: [
          'Tarjeta de Medicare (roja, blanca y azul)',
          'Tarjeta de Seguro Social',
          'Prueba de ingresos (carta de beneficios del Seguro Social, W-2, o talones de pago)',
          'Estados de cuenta bancarios (últimos 3 meses)',
          'Lista de medicamentos recetados'
        ]
      }
    },
    'texas-benefits': {
      en: {
        title: 'Your Texas Benefits (SNAP/Medicaid/CHIP)',
        docs: [
          'Valid photo ID for all adults in household',
          'Social Security cards for all household members',
          'Proof of income (pay stubs, award letters, self-employment records)',
          'Proof of residence (utility bill or lease)',
          'Bank statements (last 3 months)',
          'Immigration documents (if applicable)'
        ]
      },
      es: {
        title: 'Your Texas Benefits (SNAP/Medicaid/CHIP)',
        docs: [
          'Identificación con foto válida de todos los adultos en el hogar',
          'Tarjetas de Seguro Social de todos los miembros del hogar',
          'Prueba de ingresos (talones de pago, cartas de beneficios, registros de trabajo por cuenta propia)',
          'Prueba de residencia (factura de servicios o contrato de arrendamiento)',
          'Estados de cuenta bancarios (últimos 3 meses)',
          'Documentos de inmigración (si aplica)'
        ]
      }
    },
    'web-development': {
      en: {
        title: 'Web Development / Digital Presence',
        docs: [
          'Business name, logo, and brand colors (if available)',
          'Short description of your business and services',
          'Photos of your work, team, or storefront (high quality if possible)',
          'List of services and starting prices',
          'Contact info to display: phone, email, address, social media',
          'Examples of websites you like (reference links)',
          'Domain name preferences (e.g., yourbusiness.com) — we help you register'
        ]
      },
      es: {
        title: 'Desarrollo Web / Presencia Digital',
        docs: [
          'Nombre del negocio, logo y colores de marca (si los tiene)',
          'Descripción corta de su negocio y servicios',
          'Fotos de su trabajo, equipo o local (de buena calidad si es posible)',
          'Lista de servicios y precios iniciales',
          'Información de contacto a mostrar: teléfono, correo, dirección, redes sociales',
          'Ejemplos de sitios web que le gusten (enlaces de referencia)',
          'Preferencias de nombre de dominio (ej. sunegocio.com) — le ayudamos a registrarlo'
        ]
      }
    }
  };

  function renderDocList(serviceKey) {
    var container = document.getElementById('docResults');
    var note = document.getElementById('docNote');
    if (!container) return;

    var data = DOC_DATA[serviceKey];
    if (!data) {
      container.classList.remove('visible');
      if (note) note.style.display = 'none';
      return;
    }

    var lang = getStoredLang();
    var info = data[lang] || data.en;

    var html = '<div class="doc-list"><h3>' + info.title + '</h3><ul>';
    info.docs.forEach(function (doc) {
      html += '<li>' + doc + '</li>';
    });
    html += '</ul></div>';

    container.innerHTML = html;
    container.classList.add('visible');
    if (note) note.style.display = 'block';
  }

  function initDocSelector() {
    var sel = document.getElementById('docServiceSelect');
    if (!sel) return;

    sel.addEventListener('change', function () {
      renderDocList(sel.value);
    });
  }

  /* ---------- Build Email Checklist HTML ---------- */
  // Map sub-services to their parent DOC_DATA key
  var SERVICE_DOC_MAP = {
    'ein': 'llc',
    'dba': 'llc',
    'ifta': 'trucking',
    'nyhut': 'trucking',
    'ucr': 'trucking',
    'fmcsa': 'trucking',
    'boc3': 'trucking'
  };

  function buildEmailChecklist(serviceValue) {
    var key = SERVICE_DOC_MAP[serviceValue] || serviceValue;
    var data = DOC_DATA[key];
    if (!data) return '';

    var en = data.en;
    var es = data.es;
    var html = '<div style="background:#F5F7FA;padding:16px;border-radius:8px;margin:16px 0">';
    html += '<h3 style="color:#003366;margin:0 0 10px;font-size:15px">' + en.title + ' / ' + es.title + '</h3>';
    for (var i = 0; i < en.docs.length; i++) {
      html += '<p style="margin:3px 0;font-size:14px">&#10004; ' + en.docs[i] + ' / ' + es.docs[i] + '</p>';
    }
    html += '</div>';
    return html;
  }

  /* ---------- EmailJS Config ---------- */
  var EMAILJS_PUBLIC_KEY = 'Msfzm0psTK4E5BCU6';
  var EMAILJS_SERVICE_ID = 'service_clavepro';
  var EMAILJS_TEMPLATE_ID = 'template_i2sf26j';

  /* ---------- Contact Form → Airtable + EmailJS ---------- */
  var AIRTABLE_BASE  = 'appZpPihAI3InXMdx';
  var AIRTABLE_TABLE = 'tbl1TjdsA3JgCAfdl';
  var AIRTABLE_TOKEN = 'patnswTAVvjglK3b8.511e3c35ea5640400933c2b00eb454429724ad480c293a60cd91bca9f77df1d7';

  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var lang = getStoredLang();

      var name    = form.querySelector('[name="name"]').value.trim();
      var email   = form.querySelector('[name="email"]').value.trim();
      var phone   = form.querySelector('[name="phone"]').value.trim();
      var checked = form.querySelectorAll('[name="service"]:checked');
      var message = form.querySelector('[name="message"]').value.trim();

      // Map form values to exact Airtable option names
      var SERVICE_MAP = {
        'tax-individual': 'Tax Preparation - Individual',
        'tax-business': 'Tax Preparation - Business',
        'llc': 'LLC Formation',
        'ein': 'EIN Registration',
        'dba': 'DBA Registration',
        'ifta': 'IFTA Registration / Filing',
        'nyhut': 'NY HUT Registration',
        'ucr': 'UCR Registration',
        'fmcsa': 'FMCSA / MC Authority',
        'boc3': 'BOC-3 Filing',
        'notary': 'Notary Services',
        'immigration': 'Immigration Forms',
        'lis-medicare': 'LIS / Medicare Extra Help',
        'texas-benefits': 'Your Texas Benefits (SNAP, Medicaid, CHIP)',
        'web-development': 'Desarrollo Web / Presencia Digital',
        'other': 'Other'
      };

      var serviceValues = [];
      var serviceTexts = [];
      checked.forEach(function (cb) {
        serviceValues.push(cb.value);
        serviceTexts.push(SERVICE_MAP[cb.value] || 'Other');
      });

      if (serviceValues.length === 0) {
        alert(lang === 'en' ? 'Please select at least one service.' : 'Por favor seleccione al menos un servicio.');
        submitBtn.disabled = false;
        submitBtn.textContent = lang === 'en' ? 'Send Message' : 'Enviar Mensaje';
        return;
      }

      var serviceText = serviceTexts.join(', ');

      submitBtn.disabled = true;
      submitBtn.textContent = lang === 'en' ? 'Sending...' : 'Enviando...';

      var fields = {
        'Name': name,
        'E-mail': email,
        'Phone': phone,
        'Type of Service': serviceTexts,
        'Status': 'New'
      };

      if (message) {
        fields['Notes'] = message;
      }

      var payload = { records: [{ fields: fields }] };

      // 1. Save to Airtable
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
        // 2. Send auto-reply email via EmailJS
        if (typeof emailjs !== 'undefined') {
          emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name: name,
            email: email,
            service: serviceText,
            checklist: serviceValues.map(buildEmailChecklist).join('')
          }).catch(function (err) {
            console.error('EmailJS error:', err);
          });
        }

        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = lang === 'en' ? 'Send Message' : 'Enviar Mensaje';

        // Show success message on page
        var successDiv = document.getElementById('formSuccess');
        if (successDiv) {
          successDiv.style.display = 'block';
          successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // 3. Send WhatsApp notification to Angela
        var waMsg = 'New lead from clavepros.com\n\n'
          + 'Name: ' + name + '\n'
          + 'Email: ' + email + '\n'
          + (phone ? 'Phone: ' + phone + '\n' : '')
          + 'Service: ' + serviceText + '\n'
          + (message ? '\nMessage: ' + message : '');
        var waURL = 'https://wa.me/12819357568?text=' + encodeURIComponent(waMsg);
        window.open(waURL, '_blank');
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
    initDocSelector();
  });
})();
