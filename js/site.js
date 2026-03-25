(function () {
  'use strict';

  var REVEAL_SELECTOR =
    '.about, .includes, .venue, .gallery, .info-cols';

  function markRevealTargets() {
    document.querySelectorAll(REVEAL_SELECTOR).forEach(function (el) {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var required = form.querySelectorAll('[required]');
    var valid = true;
    required.forEach(function (field) {
      if (!field.value.trim()) {
        field.setAttribute('aria-invalid', 'true');
        field.style.borderColor = '#e05555';
        valid = false;
      } else {
        field.removeAttribute('aria-invalid');
        field.style.borderColor = '';
      }
    });
    if (!valid) {
      var ann = document.getElementById('sr-announce');
      if (ann) {
        ann.textContent = 'Please fill in all required fields before submitting.';
      }
      required[0].focus();
      return;
    }
    var announcer = document.getElementById('sr-announce');
    if (announcer) {
      announcer.textContent = 'Application submitted. We will be in touch to confirm your booking.';
    }
    form.innerHTML =
      '<p style="font-family:var(--serif-d);font-size:20px;font-style:italic;color:var(--muted);padding:32px 0;line-height:1.7">Thank you — your application has been received.<br>The ball secretary will be in touch shortly.</p>';
  }

  function isMobileMenuOpen() {
    return document.querySelector('.site-header').classList.contains('menu-open');
  }

  function openMobileMenu() {
    var header = document.querySelector('.site-header');
    var toggle = document.getElementById('mobile-menu-toggle');
    header.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }

  function closeMobileMenu() {
    var header = document.querySelector('.site-header');
    var toggle = document.getElementById('mobile-menu-toggle');
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  function toggleMobileMenu() {
    if (isMobileMenuOpen()) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMobileMenuOpen()) {
      closeMobileMenu();
    }
  });

  var mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  window.handleSubmit = handleSubmit;

  function initialiseRevealsIO() {
    var candidates = document.querySelectorAll(REVEAL_SELECTOR);

    candidates.forEach(function (el) {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      candidates.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    candidates.forEach(function (el) {
      if (!el.classList.contains('is-visible')) io.observe(el);
    });
  }

  markRevealTargets();
  if (window.gsapHandlesReveals !== true) {
    initialiseRevealsIO();
  }

  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.className = 'back-to-top';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Back to top');
      btn.textContent = 'Top';
      document.body.appendChild(btn);
    }

    function syncVisibility() {
      if (window.scrollY > 560) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }

    syncVisibility();
    window.addEventListener('scroll', syncVisibility, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initPageLoader() {
    var loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML =
      '<div class="page-loader-mark"><span class="page-loader-line"></span><span class="page-loader-dot"></span><span class="page-loader-line"></span></div>';
    document.body.appendChild(loader);
    document.documentElement.classList.add('is-loading');

    function dismissLoader() {
      loader.classList.add('is-done');
      document.documentElement.classList.remove('is-loading');
      window.setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 380);
    }

    if (document.readyState === 'complete') {
      dismissLoader();
      return;
    }

    window.addEventListener('load', dismissLoader, { once: true });
  }

  initBackToTop();
  initPageLoader();
})();
