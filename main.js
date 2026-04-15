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

  /* ---------- Contact Form → EmailJS + WhatsApp ---------- */
  // Airtable integration temporarily disabled while backend proxy is built.

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
        'lis-medicare': 'LIS/Medicare Extra Help',
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

      // Send auto-reply email via EmailJS (Airtable call removed for security)
      var emailPromise = (typeof emailjs !== 'undefined')
        ? emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name: name,
            email: email,
            service: serviceText,
            checklist: serviceValues.map(buildEmailChecklist).join('')
          })
        : Promise.resolve();

      emailPromise
        .catch(function (err) { console.error('EmailJS error:', err); })
        .then(function () {
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = lang === 'en' ? 'Send Message' : 'Enviar Mensaje';

          var successDiv = document.getElementById('formSuccess');
          if (successDiv) {
            successDiv.style.display = 'block';
            successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          // Send WhatsApp notification to Angela so leads are not lost
          var waMsg = 'New lead from clavepros.com\n\n'
            + 'Name: ' + name + '\n'
            + 'Email: ' + email + '\n'
            + (phone ? 'Phone: ' + phone + '\n' : '')
            + 'Service: ' + serviceText + '\n'
            + (message ? '\nMessage: ' + message : '');
          var waURL = 'https://wa.me/12819357568?text=' + encodeURIComponent(waMsg);
          window.open(waURL, '_blank');
        });
    });
  }

  /* ============================================================
     SERVICE DETAIL PAGE (service-detail.html)
     Rich config with weHelp flags, form fields, conditional email.
     ============================================================ */

  // Helper: bilingual label
  function L(en, es) { return { en: en, es: es }; }
  // Helper: checklist item
  function CL(en, es, weHelp, suggest) {
    return { en: en, es: es, weHelp: !!weHelp, suggest: suggest || null };
  }

  var SERVICE_CONFIG = {
    'tax-preparation': {
      icon: '📋',
      title: L('Tax Preparation', 'Preparación de Impuestos'),
      description: L('Individual, self-employed, and small business tax returns prepared with precision. IRS Registered (PTIN).', 'Declaraciones de individuos, autónomos y pequeños negocios preparadas con precisión. Registrada ante el IRS (PTIN).'),
      priceLabel: L('From $175', 'Desde $175'),
      airtableValue: 'Tax Preparation - Individual',
      subServices: [
        { key: 'individual', label: L('Individual (1040)', 'Individual (1040)'), airtableValue: 'Tax Preparation - Individual' },
        { key: 'business',   label: L('Self-Employed / Business', 'Autónomo / Negocio'), airtableValue: 'Tax Preparation - Business' }
      ],
      checklists: {
        individual: [
          CL("Valid photo ID (driver's license or passport)", 'Identificación con foto válida (licencia o pasaporte)', false),
          CL('Social Security cards for all household members', 'Tarjetas de Seguro Social de todos los miembros del hogar', false),
          CL('W-2 forms from all employers', 'Formularios W-2 de todos los empleadores', false),
          CL('1099 forms (NEC, MISC, K if applicable)', 'Formularios 1099 (NEC, MISC, K si aplica)', false),
          CL('1095-A if you have Marketplace health insurance', '1095-A si tiene seguro de salud del Marketplace', false),
          CL("Last year's tax return (if available)", 'Declaración del año anterior (si la tiene)', false),
          CL('Bank account info for direct deposit', 'Información bancaria para depósito directo', false)
        ],
        business: [
          CL('Valid photo ID', 'Identificación con foto válida', false),
          CL('EIN (Federal Employer ID)', 'EIN (Número de Identificación Federal)', true, 'business-formation'),
          CL('Business income records (12 months of bank statements)', 'Registros de ingresos (12 meses de estados de cuenta)', false),
          CL('List of business expenses with receipts', 'Lista de gastos del negocio con recibos', false),
          CL('1099-NEC received from clients', '1099-NEC recibidos de clientes', false),
          CL('1099-NEC issued to subcontractors (if any)', '1099-NEC emitidos a subcontratistas (si aplica)', false),
          CL('Vehicle mileage log for business use', 'Registro de millas del vehículo de uso comercial', false),
          CL('LLC formation documents (if incorporated)', 'Documentos de formación de LLC (si está incorporado)', true, 'business-formation')
        ]
      },
      externalForm: {
        subService: 'business',
        url: 'tax-expense-form.html',
        label: L('Open Business Tax Form →', 'Abrir Formulario de Impuestos de Negocio →')
      }
    },

    'business-formation': {
      icon: '🏢',
      title: L('Business Formation', 'Formación de Negocios'),
      description: L('LLC formation, EIN, and DBA registration. We handle the paperwork so you can focus on your business.', 'Formación de LLC, EIN y registro de DBA. Nosotros manejamos el papeleo para que te enfoques en tu negocio.'),
      priceLabel: L('From $75 (EIN only) / $250 (LLC)', 'Desde $75 (solo EIN) / $250 (LLC)'),
      airtableValue: 'LLC Formation',
      checklist: [
        CL('Valid photo ID', 'Identificación con foto válida', false),
        CL('Social Security Number or ITIN', 'Número de Seguro Social o ITIN', false),
        CL('Desired company name (we verify availability)', 'Nombre deseado de la empresa (verificamos disponibilidad)', false),
        CL('Business mailing address', 'Dirección del negocio', false),
        CL('Names and addresses of all members/owners', 'Nombres y direcciones de todos los miembros/dueños', false),
        CL('Business purpose description', 'Descripción del propósito del negocio', false)
      ],
      formFields: [
        { name: 'companyName', type: 'text', required: true, label: L('Desired company name', 'Nombre deseado de la empresa') },
        { name: 'businessAddress', type: 'text', label: L('Business mailing address', 'Dirección del negocio') },
        { name: 'members', type: 'textarea', label: L('Members/owners (names and %)', 'Miembros/dueños (nombres y %)') },
        { name: 'purpose', type: 'textarea', label: L('Business purpose', 'Propósito del negocio') },
        { name: 'needsEIN', type: 'select', label: L('Do you need an EIN?', '¿Necesita un EIN?'), options: [L('Yes, include EIN', 'Sí, incluir EIN'), L('No, I already have one', 'No, ya lo tengo')] }
      ]
    },

    'trucking': {
      icon: '🚛',
      title: L('Trucking Compliance', 'Cumplimiento de Transporte'),
      description: L('IFTA, NY HUT, UCR, FMCSA authority, BOC-3, and quarterly filings. Full-service compliance for owner-operators and fleets.', 'IFTA, NY HUT, UCR, autoridad FMCSA, BOC-3 y presentaciones trimestrales. Cumplimiento completo para propietarios-operadores y flotas.'),
      priceLabel: L('From $85', 'Desde $85'),
      airtableValue: 'IFTA Registration / Filing',
      checklist: [
        CL('Valid photo ID', 'Identificación con foto válida', false),
        CL('EIN (Federal Employer ID)', 'EIN (Número de Identificación Federal)', true, 'business-formation'),
        CL('Company name and business address', 'Nombre de empresa y dirección', false),
        CL('Vehicle info: VIN, year, make, model, GVWR per truck', 'Info del vehículo: VIN, año, marca, modelo, GVWR por camión', false),
        CL('Number of trucks in fleet', 'Número de camiones en la flota', false),
        CL('Type of cargo transported', 'Tipo de carga transportada', false),
        CL('States of operation', 'Estados de operación', false)
      ],
      formFields: [
        { name: 'companyName', type: 'text', required: true, label: L('Company name', 'Nombre de la empresa') },
        { name: 'fleetSize', type: 'text', label: L('Number of trucks', 'Número de camiones') },
        { name: 'cargoType', type: 'text', label: L('Type of cargo', 'Tipo de carga') },
        { name: 'states', type: 'text', label: L('States of operation', 'Estados de operación') },
        { name: 'vehicles', type: 'textarea', label: L('Vehicle info: VIN, year, make, model, GVWR', 'Info del vehículo: VIN, año, marca, modelo, GVWR') },
        { name: 'services', type: 'select', label: L('What service do you need?', '¿Qué servicio necesita?'), options: [
          L('IFTA Registration', 'Registro de IFTA'),
          L('IFTA Quarterly Filing', 'Presentación trimestral IFTA'),
          L('NY HUT', 'NY HUT'),
          L('UCR', 'UCR'),
          L('FMCSA / MC Authority', 'Autoridad FMCSA / MC'),
          L('BOC-3', 'BOC-3'),
          L('Multiple — please specify in notes', 'Varios — especifico en notas')
        ] }
      ]
    },

    'notary': {
      icon: '📝',
      title: L('Notary Services', 'Servicios Notariales'),
      description: L('Fast, reliable notarization for all your documents. Walk-ins welcome during business hours.', 'Notarización rápida y confiable para todos tus documentos. Aceptamos sin cita durante horas de oficina.'),
      priceLabel: L('$10 per signature', '$10 por firma'),
      airtableValue: 'Notary Services',
      checklist: [
        CL('Valid government-issued photo ID for each signer', 'Identificación con foto emitida por el gobierno de cada firmante', false),
        CL('The document(s) to be notarized (do NOT sign in advance)', 'El/los documento(s) a notarizar (NO firmar por adelantado)', false)
      ]
    },

    'immigration': {
      icon: '🌎',
      title: L('Immigration Forms', 'Formularios de Inmigración'),
      description: L('Form completion assistance for I-765, I-131, I-130, and more. We are NOT attorneys — we help you fill out the forms correctly.', 'Asistencia para completar formularios I-765, I-131, I-130 y más. NO somos abogados — te ayudamos a llenar los formularios correctamente.'),
      priceLabel: L('From $200', 'Desde $200'),
      airtableValue: 'Immigration Forms',
      checklist: [
        CL('Valid photo ID (passport preferred)', 'Identificación con foto válida (pasaporte preferido)', false),
        CL('Current immigration documents (visa, green card, EAD)', 'Documentos de inmigración actuales (visa, green card, EAD)', false),
        CL('Previous immigration applications (if any)', 'Solicitudes de inmigración anteriores (si las hay)', false),
        CL('Fee payment receipt (USCIS fees paid separately)', 'Recibo de pago de tarifas USCIS (pagadas por separado)', false)
      ],
      formFields: [
        { name: 'formType', type: 'select', required: true, label: L('Which form do you need?', '¿Qué formulario necesita?'), options: [
          L('I-765 — Work Authorization', 'I-765 — Autorización de Trabajo'),
          L('I-131 — Travel Document', 'I-131 — Documento de Viaje'),
          L('I-130 — Family Petition', 'I-130 — Petición Familiar'),
          L('I-90 — Green Card Renewal', 'I-90 — Renovación de Green Card'),
          L('N-400 — Citizenship', 'N-400 — Ciudadanía'),
          L('Other — specify in notes', 'Otro — especifico en notas')
        ] },
        { name: 'hasUSCIS', type: 'select', label: L('Do you have a USCIS online account?', '¿Tiene cuenta en línea de USCIS?'), options: [L('Yes', 'Sí'), L('No', 'No'), L("I'm not sure", 'No estoy seguro')] }
      ]
    },

    'lis-medicare': {
      icon: '🏥',
      title: L('LIS / Medicare Extra Help', 'LIS / Ayuda Extra de Medicare'),
      description: L("Low Income Subsidy (Extra Help) can save Medicare beneficiaries thousands annually on prescription costs. We help you apply.", "El Subsidio de Bajos Ingresos (Extra Help) puede ahorrar miles de dólares al año en medicamentos. Te ayudamos a aplicar."),
      priceLabel: L('From $50', 'Desde $50'),
      airtableValue: 'LIS/Medicare Extra Help',
      checklist: [
        CL('Medicare card (red, white and blue)', 'Tarjeta de Medicare (roja, blanca y azul)', false),
        CL('Social Security card', 'Tarjeta de Seguro Social', false),
        CL('Proof of income (SS award letter, W-2, or pay stubs)', 'Prueba de ingresos (carta de SS, W-2 o talones)', false),
        CL('Bank statements (last 3 months)', 'Estados de cuenta bancarios (últimos 3 meses)', false),
        CL('List of prescription medications', 'Lista de medicamentos recetados', false)
      ]
    },

    'texas-benefits': {
      icon: '🤝',
      title: L('Your Texas Benefits (SNAP / Medicaid / CHIP)', 'Your Texas Benefits (SNAP / Medicaid / CHIP)'),
      description: L("We assist you with applications for Texas government benefit programs: food assistance, health coverage, and children's insurance.", 'Te asistimos con solicitudes de programas de beneficios del gobierno de Texas: asistencia alimentaria, cobertura de salud y seguro para niños.'),
      priceLabel: L('From $50', 'Desde $50'),
      airtableValue: 'Your Texas Benefits (SNAP, Medicaid, CHIP)',
      checklist: [
        CL('Valid photo ID for all adults in household', 'ID con foto de todos los adultos del hogar', false),
        CL('Social Security cards for all household members', 'Tarjetas de SS de todos los miembros del hogar', false),
        CL('Proof of income (pay stubs, award letters, self-employment)', 'Prueba de ingresos (talones, cartas, trabajo por cuenta propia)', false),
        CL('Proof of residence (utility bill or lease)', 'Prueba de residencia (factura o contrato de renta)', false),
        CL('Bank statements (last 3 months)', 'Estados de cuenta bancarios (últimos 3 meses)', false),
        CL('Immigration documents (if applicable)', 'Documentos de inmigración (si aplica)', false)
      ]
    },

    'web-development': {
      icon: '💻',
      title: L('Digital Presence', 'Presencia Digital'),
      description: L('Professional websites and booking systems for small businesses. Three packages from $400–$2,500 — built to attract clients and grow your brand.', 'Sitios web profesionales y sistemas de reservas para pequeños negocios. Tres paquetes desde $400–$2,500 — diseñados para atraer clientes y hacer crecer tu marca.'),
      priceLabel: L('From $400', 'Desde $400'),
      airtableValue: 'Desarrollo Web / Presencia Digital',
      checklist: [
        CL('Business name and short description', 'Nombre del negocio y descripción corta', false),
        CL('Logo and brand colors', 'Logo y colores de marca', true, 'web-development'),
        CL('Photos of your work, team, or storefront', 'Fotos de tu trabajo, equipo o local', false),
        CL('List of services and starting prices', 'Lista de servicios y precios iniciales', false),
        CL('Contact info to display (phone, email, social)', 'Info de contacto a mostrar (teléfono, email, redes)', false),
        CL('Reference websites you like', 'Sitios web de referencia que te gusten', false),
        CL('Domain name preference', 'Preferencia de nombre de dominio', false)
      ],
      formFields: [
        { name: 'businessName', type: 'text', required: true, label: L('Business name', 'Nombre del negocio') },
        { name: 'package', type: 'select', required: true, label: L('Preferred package', 'Paquete preferido'), options: [
          L('Basic — $400-600', 'Básico — $400-600'),
          L('Standard — $800-1,200', 'Estándar — $800-1,200'),
          L('Premium — $1,500-2,500', 'Premium — $1,500-2,500'),
          L('Not sure — recommend one', 'No estoy seguro — recomienden')
        ] },
        { name: 'domain', type: 'text', label: L('Desired domain (e.g., mybusiness.com)', 'Dominio deseado (ej. minegocio.com)') },
        { name: 'timeline', type: 'select', label: L('Desired timeline', 'Tiempo deseado'), options: [
          L('ASAP (1-2 weeks)', 'Lo antes posible (1-2 semanas)'),
          L('1 month', '1 mes'),
          L('2-3 months', '2-3 meses'),
          L('Flexible', 'Flexible')
        ] },
        { name: 'references', type: 'textarea', label: L('Reference websites you like', 'Sitios de referencia que te gusten') }
      ]
    }
  };

  /* ---------- Service Detail: renderer ---------- */
  function getServiceKeyFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return params.get('s');
  }

  function renderServiceDetail() {
    var root = document.getElementById('serviceDetailRoot');
    if (!root) return;
    if (typeof emailjs !== 'undefined') {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
    var key = getServiceKeyFromUrl();
    var cfg = SERVICE_CONFIG[key];
    var lang = getStoredLang();

    if (!cfg) {
      root.style.display = 'none';
      document.getElementById('sdNotFound').style.display = 'block';
      return;
    }

    document.title = (cfg.title[lang] || cfg.title.en) + ' — Clave Pro Services';
    document.getElementById('sdTitle').textContent = cfg.icon + ' ' + (cfg.title[lang] || cfg.title.en);
    document.getElementById('sdDescription').textContent = cfg.description[lang] || cfg.description.en;
    document.getElementById('sdPrice').textContent = cfg.priceLabel[lang] || cfg.priceLabel.en;

    var currentSub = null;
    if (cfg.subServices && cfg.subServices.length) {
      var subSection = document.getElementById('sdSubServiceSection');
      var tabs = document.getElementById('sdSubServiceTabs');
      subSection.style.display = 'block';
      tabs.innerHTML = '';
      cfg.subServices.forEach(function (sub, i) {
        var btn = document.createElement('button');
        btn.className = 'sd-tab' + (i === 0 ? ' active' : '');
        btn.setAttribute('data-sub', sub.key);
        btn.textContent = sub.label[lang] || sub.label.en;
        btn.addEventListener('click', function () {
          document.querySelectorAll('.sd-tab').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          renderChecklist(cfg, sub.key);
          handleExternalForm(cfg, sub.key);
        });
        tabs.appendChild(btn);
      });
      currentSub = cfg.subServices[0].key;
    }

    renderChecklist(cfg, currentSub);
    renderFormFields(cfg, lang);
    handleExternalForm(cfg, currentSub);

    // Wire submit + PDF
    var form = document.getElementById('sdContactForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitServiceDetail(cfg, currentSub, form);
    });

    var pdfBtn = document.getElementById('sdDownloadPdf');
    pdfBtn.addEventListener('click', function () {
      downloadServiceDetailPdf(cfg, currentSub, form);
    });

    // Track sub-service changes
    document.querySelectorAll('.sd-tab').forEach(function (b) {
      b.addEventListener('click', function () { currentSub = b.getAttribute('data-sub'); });
    });
  }

  function renderChecklist(cfg, subKey) {
    var container = document.getElementById('sdChecklist');
    container.innerHTML = '';
    var lang = getStoredLang();
    var items = subKey && cfg.checklists ? cfg.checklists[subKey] : cfg.checklist;
    if (!items) return;
    items.forEach(function (item, idx) {
      var label = document.createElement('label');
      label.className = 'sd-checkbox';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('data-idx', idx);
      input.setAttribute('data-weHelp', item.weHelp ? '1' : '0');
      var span = document.createElement('span');
      span.textContent = item[lang] || item.en;
      if (item.weHelp) {
        var badge = document.createElement('em');
        badge.className = 'sd-wehelp-badge';
        badge.textContent = lang === 'en' ? ' ✦ We can help' : ' ✦ Podemos ayudarte';
        span.appendChild(badge);
      }
      label.appendChild(input);
      label.appendChild(span);
      container.appendChild(label);
    });
    updateChecklistStatus();
    container.querySelectorAll('input').forEach(function (i) {
      i.addEventListener('change', updateChecklistStatus);
    });
  }

  function updateChecklistStatus() {
    var inputs = document.querySelectorAll('#sdChecklist input[type=checkbox]');
    var total = inputs.length;
    var checked = 0;
    inputs.forEach(function (i) { if (i.checked) checked++; });
    var status = document.getElementById('sdChecklistStatus');
    var lang = getStoredLang();
    if (total === 0) { status.textContent = ''; return; }
    status.textContent = lang === 'en'
      ? checked + ' of ' + total + ' ready'
      : checked + ' de ' + total + ' listos';
  }

  function renderFormFields(cfg, lang) {
    var section = document.getElementById('sdFormSection');
    var form = document.getElementById('sdIntakeForm');
    if (!cfg.formFields || !cfg.formFields.length) {
      section.style.display = 'none';
      form.innerHTML = '';
      return;
    }
    section.style.display = 'block';
    form.innerHTML = '';
    cfg.formFields.forEach(function (f) {
      var label = document.createElement('label');
      label.textContent = (f.label[lang] || f.label.en) + (f.required ? ' *' : '');
      form.appendChild(label);
      var el;
      if (f.type === 'textarea') {
        el = document.createElement('textarea');
        el.rows = 3;
      } else if (f.type === 'select') {
        el = document.createElement('select');
        var blank = document.createElement('option');
        blank.value = '';
        blank.textContent = lang === 'en' ? '— Choose —' : '— Elige —';
        el.appendChild(blank);
        f.options.forEach(function (opt) {
          var o = document.createElement('option');
          o.value = opt.en; // use English as canonical value
          o.textContent = opt[lang] || opt.en;
          el.appendChild(o);
        });
      } else {
        el = document.createElement('input');
        el.type = f.type || 'text';
      }
      el.name = f.name;
      if (f.required) el.required = true;
      form.appendChild(el);
    });
  }

  function handleExternalForm(cfg, subKey) {
    var section = document.getElementById('sdExternalFormSection');
    var link = document.getElementById('sdExternalFormLink');
    if (!cfg.externalForm || (cfg.externalForm.subService && cfg.externalForm.subService !== subKey)) {
      section.style.display = 'none';
      return;
    }
    section.style.display = 'block';
    link.href = cfg.externalForm.url;
    var lang = getStoredLang();
    link.textContent = cfg.externalForm.label[lang] || cfg.externalForm.label.en;
  }

  function collectChecklistState(cfg, subKey) {
    var items = subKey && cfg.checklists ? cfg.checklists[subKey] : cfg.checklist;
    if (!items) return { have: [], missing: [], weCanHelp: [], clientNeeds: [] };
    var inputs = document.querySelectorAll('#sdChecklist input[type=checkbox]');
    var have = [], missing = [], weCanHelp = [], clientNeeds = [];
    inputs.forEach(function (input, i) {
      var item = items[i];
      if (!item) return;
      if (input.checked) have.push(item);
      else {
        missing.push(item);
        if (item.weHelp) weCanHelp.push(item);
        else clientNeeds.push(item);
      }
    });
    return { have: have, missing: missing, weCanHelp: weCanHelp, clientNeeds: clientNeeds };
  }

  function collectFormFieldValues(cfg) {
    if (!cfg.formFields) return [];
    var result = [];
    var form = document.getElementById('sdIntakeForm');
    if (!form) return result;
    var lang = getStoredLang();
    cfg.formFields.forEach(function (f) {
      var el = form.querySelector('[name="' + f.name + '"]');
      if (el && el.value) {
        result.push({ label: f.label[lang] || f.label.en, value: el.value });
      }
    });
    return result;
  }

  function submitServiceDetail(cfg, subKey, contactForm) {
    var lang = getStoredLang();
    var name = contactForm.querySelector('[name=name]').value.trim();
    var email = contactForm.querySelector('[name=email]').value.trim();
    var phone = contactForm.querySelector('[name=phone]').value.trim();
    var message = contactForm.querySelector('[name=message]').value.trim();

    var cl = collectChecklistState(cfg, subKey);
    var formValues = collectFormFieldValues(cfg);

    var submitBtn = contactForm.querySelector('button[type=submit]');
    submitBtn.disabled = true;
    submitBtn.textContent = lang === 'en' ? 'Sending...' : 'Enviando...';

    // Build Notes for Airtable
    var notes = '';
    if (subKey) notes += 'Sub-service: ' + subKey + '\n';
    notes += '\n--- CHECKLIST ---\n';
    notes += 'Has (' + cl.have.length + '):\n';
    cl.have.forEach(function (i) { notes += '  ✓ ' + i.en + '\n'; });
    notes += '\nMissing (' + cl.missing.length + '):\n';
    cl.missing.forEach(function (i) {
      notes += '  ✗ ' + i.en + (i.weHelp ? ' [WE CAN HELP]' : '') + '\n';
    });
    if (formValues.length) {
      notes += '\n--- INTAKE FORM ---\n';
      formValues.forEach(function (v) { notes += v.label + ': ' + v.value + '\n'; });
    }
    if (message) notes += '\n--- NOTES ---\n' + message + '\n';

    var serviceAirtable = cfg.airtableValue;
    if (subKey && cfg.subServices) {
      var sub = cfg.subServices.filter(function (s) { return s.key === subKey; })[0];
      if (sub) serviceAirtable = sub.airtableValue;
    }

    // Airtable write removed for security. Lead is delivered via EmailJS + WhatsApp.
    var emailPromise = (typeof emailjs !== 'undefined')
      ? emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name: name,
          email: email,
          service: cfg.title[lang] || cfg.title.en,
          checklist: buildConditionalChecklistHtml(cfg, cl, lang)
        })
      : Promise.resolve();

    emailPromise
      .catch(function (err) { console.error('EmailJS error:', err); })
      .then(function () {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = lang === 'en' ? 'Request Quote →' : 'Pedir Cotización →';

        var success = document.getElementById('sdFormSuccess');
        var msg = buildSuccessMessage(cl, lang);
        success.innerHTML = msg;
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });

        var waMsg = 'New lead from ' + (cfg.title.en) + '\n\n'
          + 'Name: ' + name + '\nEmail: ' + email + '\n'
          + (phone ? 'Phone: ' + phone + '\n' : '')
          + 'Has: ' + cl.have.length + '/' + (cl.have.length + cl.missing.length) + ' items\n'
          + (cl.weCanHelp.length ? 'Needs help with: ' + cl.weCanHelp.map(function (i) { return i.en; }).join(', ') + '\n' : '')
          + (message ? '\nNotes: ' + message : '');
        window.open('https://wa.me/12819357568?text=' + encodeURIComponent(waMsg), '_blank');
      });
  }

  function buildSuccessMessage(cl, lang) {
    var html = '<h3>' + (lang === 'en' ? 'Thank you!' : '¡Gracias!') + '</h3>';
    if (cl.missing.length === 0) {
      html += '<p>' + (lang === 'en'
        ? "You're all set! We have everything we need. We'll contact you within 24 hours to confirm your appointment."
        : '¡Estás listo! Tenemos todo lo que necesitamos. Te contactaremos en menos de 24 horas para confirmar tu cita.') + '</p>';
    } else {
      html += '<p>' + (lang === 'en'
        ? "We received your request and will contact you within 24 hours. Check your email for a summary of what you have and what you still need."
        : 'Recibimos tu solicitud y te contactaremos en menos de 24 horas. Revisa tu correo con el resumen de lo que tienes y lo que aún necesitas.') + '</p>';
      if (cl.weCanHelp.length) {
        html += '<p><strong>' + (lang === 'en'
          ? '✦ Good news: some of the items you\'re missing are services we offer!'
          : '✦ Buenas noticias: algunos de los documentos que te faltan son servicios que ofrecemos!') + '</strong></p>';
      }
    }
    return html;
  }

  function buildConditionalChecklistHtml(cfg, cl, lang) {
    var title = cfg.title[lang] || cfg.title.en;
    var html = '<div style="background:#F5F7FA;padding:16px;border-radius:8px;margin:16px 0">';
    html += '<h3 style="color:#003366;margin:0 0 10px">' + title + '</h3>';

    if (cl.have.length) {
      html += '<p style="margin:8px 0 4px"><strong>' + (lang === 'en' ? '✓ What you have:' : '✓ Lo que tienes:') + '</strong></p>';
      cl.have.forEach(function (i) {
        html += '<p style="margin:2px 0;color:#2E7D32">&#10004; ' + (i[lang] || i.en) + '</p>';
      });
    }

    if (cl.clientNeeds.length) {
      html += '<p style="margin:12px 0 4px"><strong>' + (lang === 'en' ? '⚠ You still need to get:' : '⚠ Todavía necesitas conseguir:') + '</strong></p>';
      cl.clientNeeds.forEach(function (i) {
        html += '<p style="margin:2px 0;color:#B45309">• ' + (i[lang] || i.en) + '</p>';
      });
    }

    if (cl.weCanHelp.length) {
      html += '<p style="margin:12px 0 4px;background:#FFF7E6;padding:10px;border-left:4px solid #C9A84C"><strong>' + (lang === 'en' ? '✦ We can help you with these:' : '✦ Nosotros te podemos ayudar con estos:') + '</strong></p>';
      cl.weCanHelp.forEach(function (i) {
        html += '<p style="margin:2px 0;color:#003366">→ ' + (i[lang] || i.en) + '</p>';
      });
      html += '<p style="margin:8px 0;font-size:13px;color:#555">' + (lang === 'en'
        ? "These are services we offer at Clave Pro — ask us for a bundled quote!"
        : 'Estos son servicios que ofrecemos en Clave Pro — ¡pídenos una cotización combinada!') + '</p>';
    }

    if (cl.missing.length === 0) {
      html += '<p style="margin:12px 0;color:#2E7D32;font-weight:600">' + (lang === 'en'
        ? "✓ You have everything ready!"
        : '✓ ¡Tienes todo listo!') + '</p>';
    }

    html += '</div>';
    return html;
  }

  function downloadServiceDetailPdf(cfg, subKey, contactForm) {
    if (typeof window.jspdf === 'undefined') {
      alert('PDF library not loaded');
      return;
    }
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();
    var lang = getStoredLang();
    var cl = collectChecklistState(cfg, subKey);
    var formValues = collectFormFieldValues(cfg);
    var name = contactForm.querySelector('[name=name]').value.trim();
    var email = contactForm.querySelector('[name=email]').value.trim();
    var phone = contactForm.querySelector('[name=phone]').value.trim();
    var message = contactForm.querySelector('[name=message]').value.trim();

    var y = 18;
    var pageWidth = doc.internal.pageSize.getWidth();
    var margin = 14;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102);
    doc.text('Clave Pro Services', margin, y); y += 7;
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(lang === 'en' ? 'Service Request Summary' : 'Resumen de Solicitud de Servicio', margin, y); y += 10;

    // Service
    doc.setDrawColor(201, 168, 76);
    doc.setLineWidth(0.6);
    doc.line(margin, y, pageWidth - margin, y); y += 6;
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.setFont('helvetica', 'bold');
    doc.text((cfg.title[lang] || cfg.title.en), margin, y); y += 6;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(cfg.priceLabel[lang] || cfg.priceLabel.en, margin, y); y += 8;

    // Contact
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'en' ? 'Contact Information' : 'Información de Contacto', margin, y); y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (name)  { doc.text((lang === 'en' ? 'Name: ' : 'Nombre: ') + name, margin, y); y += 5; }
    if (email) { doc.text('Email: ' + email, margin, y); y += 5; }
    if (phone) { doc.text((lang === 'en' ? 'Phone: ' : 'Teléfono: ') + phone, margin, y); y += 5; }
    y += 4;

    // Checklist
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(lang === 'en' ? 'Document Checklist' : 'Lista de Documentos', margin, y); y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (cl.have.length) {
      doc.setTextColor(46, 125, 50);
      doc.text(lang === 'en' ? '✓ What you have:' : '✓ Lo que tienes:', margin, y); y += 5;
      doc.setTextColor(0, 0, 0);
      cl.have.forEach(function (i) {
        var lines = doc.splitTextToSize('  ✓ ' + (i[lang] || i.en), pageWidth - margin * 2);
        doc.text(lines, margin, y); y += 5 * lines.length;
        if (y > 270) { doc.addPage(); y = 18; }
      });
      y += 2;
    }

    if (cl.clientNeeds.length) {
      doc.setTextColor(180, 83, 9);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'en' ? 'You still need:' : 'Todavía necesitas:', margin, y); y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      cl.clientNeeds.forEach(function (i) {
        var lines = doc.splitTextToSize('  • ' + (i[lang] || i.en), pageWidth - margin * 2);
        doc.text(lines, margin, y); y += 5 * lines.length;
        if (y > 270) { doc.addPage(); y = 18; }
      });
      y += 2;
    }

    if (cl.weCanHelp.length) {
      doc.setTextColor(201, 168, 76);
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'en' ? '✦ We can help with:' : '✦ Podemos ayudarte con:', margin, y); y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 51, 102);
      cl.weCanHelp.forEach(function (i) {
        var lines = doc.splitTextToSize('  → ' + (i[lang] || i.en), pageWidth - margin * 2);
        doc.text(lines, margin, y); y += 5 * lines.length;
        if (y > 270) { doc.addPage(); y = 18; }
      });
      y += 4;
    }

    // Intake form
    if (formValues.length) {
      if (y > 250) { doc.addPage(); y = 18; }
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(lang === 'en' ? 'Intake Form' : 'Formulario de Solicitud', margin, y); y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      formValues.forEach(function (v) {
        var text = v.label + ': ' + v.value;
        var lines = doc.splitTextToSize(text, pageWidth - margin * 2);
        doc.text(lines, margin, y); y += 5 * lines.length;
        if (y > 270) { doc.addPage(); y = 18; }
      });
    }

    if (message) {
      if (y > 250) { doc.addPage(); y = 18; }
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.text(lang === 'en' ? 'Notes' : 'Notas', margin, y); y += 5;
      doc.setFont('helvetica', 'normal');
      var mLines = doc.splitTextToSize(message, pageWidth - margin * 2);
      doc.text(mLines, margin, y); y += 5 * mLines.length;
    }

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text('Clave Pro Services · Houston, TX · angela@clavepros.com · clavepros.com', margin, 285);

    var filename = (cfg.title.en.replace(/[^a-z0-9]+/gi, '_') + '_summary.pdf').toLowerCase();
    doc.save(filename);
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
    renderServiceDetail();
  });
})();
