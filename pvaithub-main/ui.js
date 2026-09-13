(function () {
  'use strict';

  function byId(id) { return document.getElementById(id); }

  window.openPopup = function openPopup() {
    var popup = byId('contact-popup');
    var backdrop = byId('popup-backdrop');
    var panel = byId('popup-panel');
    if (!popup) return;
    popup.classList.remove('hidden');
    if (backdrop) {
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      backdrop.classList.add('opacity-100');
    }
    if (panel) {
      panel.classList.remove('opacity-0', 'scale-95');
      panel.classList.add('opacity-100', 'scale-100');
    }
    document.body.style.overflow = 'hidden';
  };

  window.closePopup = function closePopup() {
    var popup = byId('contact-popup');
    var backdrop = byId('popup-backdrop');
    var panel = byId('popup-panel');
    if (!popup) return;
    if (backdrop) {
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      backdrop.classList.remove('opacity-100');
    }
    if (panel) {
      panel.classList.add('opacity-0', 'scale-95');
      panel.classList.remove('opacity-100', 'scale-100');
    }
    window.setTimeout(function () { popup.classList.add('hidden'); }, 180);
    document.body.style.overflow = '';
  };

  function initContactLinks() {
    var currentUrl = window.location.href;
    var isProduct = window.location.pathname.indexOf('/product/') !== -1;
    var h1 = document.querySelector('h1');
    var productName = h1 ? h1.textContent.trim() : document.title;
    var message = isProduct
      ? 'Hello! I am interested in: ' + productName + '\nProduct Link: ' + currentUrl + '\n\nPlease help me with the ordering process.'
      : 'Hello! I visited your website and would like to learn more about your services.\nLink: ' + currentUrl;
    var encoded = encodeURIComponent(message);
    document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
      var base = a.getAttribute('href').split('?')[0];
      a.setAttribute('href', base + '?text=' + encoded);
    });
  }

  function loadTawkOnce() {
    if (window.__PVAITHUB_TAWK_LOADED || document.getElementById('pvaithub-tawk-loader')) return;
    window.__PVAITHUB_TAWK_LOADED = true;
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();
    var script = document.createElement('script');
    script.id = 'pvaithub-tawk-loader';
    script.async = true;
    script.src = 'https://embed.tawk.to/6a80312f1d4a11217dfc40b8/1k02c094a';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.head.appendChild(script);
  }

  window.initUI = function initUI() {
    initContactLinks();
    loadTawkOnce();
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
      window.closePopup();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initUI, { once: true });
  } else {
    window.initUI();
  }
})();
