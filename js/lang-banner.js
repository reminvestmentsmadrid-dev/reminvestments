(function () {
  var storageKey = 'rem_lang_banner_dismissed_v1';

  function getPrimaryLanguage() {
    var lang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return lang.toLowerCase();
  }

  function isDismissed() {
    try {
      return localStorage.getItem(storageKey) === '1';
    } catch (err) {
      return false;
    }
  }

  function dismiss() {
    try {
      localStorage.setItem(storageKey, '1');
    } catch (err) {
      // no-op
    }
  }

  function shouldShowBanner() {
    var browserLang = getPrimaryLanguage();
    var primary = browserLang.split('-')[0];

    if (!browserLang || primary === 'es') {
      return false;
    }

    if (isDismissed()) {
      return false;
    }

    if (window.location.hostname.indexOf('translate.goog') !== -1) {
      return false;
    }

    if (window.location.search.indexOf('_x_tr_sl=') !== -1) {
      return false;
    }

    if (document.cookie.indexOf('googtrans=') !== -1) {
      return false;
    }

    return true;
  }

  function buildBanner() {
    var browserLang = getPrimaryLanguage();
    var primary = browserLang.split('-')[0];

    var banner = document.createElement('aside');
    banner.className = 'lang-banner';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');

    var text = document.createElement('p');
    text.className = 'lang-banner__text';
    text.textContent = 'We detected your browser language (' + browserLang + '). Translate this page with Google Translate?';

    var actions = document.createElement('div');
    actions.className = 'lang-banner__actions';

    var translateBtn = document.createElement('button');
    translateBtn.type = 'button';
    translateBtn.className = 'lang-banner__btn lang-banner__btn--primary';
    translateBtn.textContent = 'Translate';
    translateBtn.addEventListener('click', function () {
      var currentUrl = encodeURIComponent(window.location.href);
      var tl = encodeURIComponent(primary || 'en');
      window.location.href = 'https://translate.google.com/translate?sl=es&tl=' + tl + '&u=' + currentUrl;
    });

    var dismissBtn = document.createElement('button');
    dismissBtn.type = 'button';
    dismissBtn.className = 'lang-banner__btn lang-banner__btn--ghost';
    dismissBtn.textContent = 'No thanks';
    dismissBtn.addEventListener('click', function () {
      dismiss();
      banner.remove();
    });

    actions.appendChild(translateBtn);
    actions.appendChild(dismissBtn);
    banner.appendChild(text);
    banner.appendChild(actions);

    document.body.appendChild(banner);
  }

  if (!shouldShowBanner()) {
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildBanner);
  } else {
    buildBanner();
  }
})();
