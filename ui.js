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

  function positionChatWidgets() {
    var mobile = window.innerWidth <= 640;
    var side = mobile ? '12px' : '20px';
    var toggle = byId('floating-chat-toggle');
    if (toggle) {
      toggle.style.setProperty('position', 'fixed', 'important');
      toggle.style.setProperty('left', side, 'important');
      toggle.style.setProperty('right', 'auto', 'important');
      toggle.style.setProperty('bottom', mobile ? '150px' : '150px', 'important');
    }

    var container = byId('floating-chat-container');
    if (container) {
      container.style.setProperty('left', side, 'important');
      container.style.setProperty('right', 'auto', 'important');
      container.style.setProperty('align-items', 'flex-start', 'important');
    }

    var options = byId('floating-chat-options');
    if (options) {
      options.style.setProperty('left', side, 'important');
      options.style.setProperty('right', 'auto', 'important');
      options.style.setProperty('bottom', mobile ? '215px' : '225px', 'important');
      options.style.setProperty('transform-origin', 'bottom left', 'important');
    }

    document.querySelectorAll('iframe[title="Chat widget"]').forEach(function (frame) {
      var frameStyle = window.getComputedStyle(frame);
      if (frameStyle.display === 'none') return;
      var width = parseFloat(frame.style.width) || parseFloat(frameStyle.width) || 0;
      var currentBottom = frameStyle.bottom === 'auto' ? '90px' : frameStyle.bottom;
      var bottom = width <= 100 ? '20px' : (width <= 150 ? '30px' : currentBottom);
      frame.style.setProperty('inset', 'auto auto ' + bottom + ' ' + side, 'important');
      frame.style.setProperty('left', side, 'important');
      frame.style.setProperty('right', 'auto', 'important');
      frame.style.setProperty('bottom', bottom, 'important');
    });
  }

  function installChatPositioning() {
    positionChatWidgets();
    if (!window.__PVAITHUB_CHAT_POSITION_OBSERVER && document.body) {
      window.__PVAITHUB_CHAT_POSITION_OBSERVER = new MutationObserver(positionChatWidgets);
      window.__PVAITHUB_CHAT_POSITION_OBSERVER.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'title']
      });
    }
    window.addEventListener('resize', positionChatWidgets);
  }

  function loadTawkOnce() {
    if (window.__PVAITHUB_TAWK_LOADED || document.getElementById('pvaithub-tawk-loader')) return;
    window.__PVAITHUB_TAWK_LOADED = true;
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();

    if (!document.getElementById('pvaithub-tawk-position')) {
      var style = document.createElement('style');
      style.id = 'pvaithub-tawk-position';
      style.textContent = [
        '#floating-chat-container { left: 20px !important; right: auto !important; align-items: flex-start !important; }',
        '#floating-chat-toggle { position: fixed !important; left: 20px !important; right: auto !important; bottom: 150px !important; }',
        '#floating-chat-options, .floating-chat-options { left: 20px !important; right: auto !important; bottom: 225px !important; transform-origin: bottom left !important; }',
        '@media (max-width: 640px) {',
        '  #floating-chat-container { left: 12px !important; right: auto !important; bottom: 16px !important; }',
        '  #floating-chat-toggle { left: 12px !important; bottom: 150px !important; }',
        '  #floating-chat-options, .floating-chat-options { left: 12px !important; right: auto !important; bottom: 215px !important; }',
        '}'
      ].join('\n');
      (document.body || document.head).appendChild(style);
    }

    installChatPositioning();
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
    installChatPositioning();
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
