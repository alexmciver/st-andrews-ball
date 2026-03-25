/**
 * Dancing-themed motion: GSAP + ScrollTrigger, Particles.js sparkles.
 * Skips when prefers-reduced-motion or libraries fail to load.
 */
(function () {
  'use strict';

  var REVEAL_SELECTOR =
    '.about, .includes, .venue, .gallery, .info-cols, .tix-form';

  function markRevealTargets() {
    document.querySelectorAll(REVEAL_SELECTOR).forEach(function (el) {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });
  }

  markRevealTargets();

  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  window.gsapHandlesReveals = false;

  if (reducedMotion()) {
    return;
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var html = document.documentElement;
  html.classList.add('html-motion');

  var easeLux = 'power3.out';
  var easeSnap = 'back.out(1.35)';

  /* ── Ballroom sparkles (Particles.js) ── */
  function runParticles(id, dense) {
    if (typeof particlesJS === 'undefined' || !document.getElementById(id)) return;
    particlesJS(id, {
      particles: {
        number: { value: dense ? 28 : 14, density: { enable: true, value_area: 980 } },
        color: { value: ['#c8a96e', '#9bbde0', '#e8d5a8'] },
        shape: { type: 'circle' },
        opacity: {
          value: 0.35,
          random: true,
          anim: { enable: dense, speed: 0.22, opacity_min: 0.08, sync: false }
        },
        size: {
          value: 2,
          random: true,
          anim: { enable: dense, speed: 1.0, size_min: 0.4, sync: false }
        },
        line_linked: { enable: false },
        move: {
          enable: dense,
          speed: dense ? 0.42 : 0,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: { enable: false }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: false }, onclick: { enable: false }, resize: true },
        modes: {}
      },
      retina_detect: true
    });
  }

  runParticles('dance-particles', true);
  runParticles('dance-particles-sub', false);

  /* ── Hero entrance (home) ── */
  var hero = document.querySelector('.hero');
  if (hero) {
    var hc = hero.querySelector('.hero-content');
    var lines = hero.querySelectorAll('.hero-ornament-line');
    var diamond = hero.querySelector('.hero-ornament-diamond');
    var scrollHint = hero.querySelector('.hero-scroll');

    if (hc) {
      gsap.set(hc.children, { opacity: 0, y: 44 });
      gsap.to(hc.children, {
        opacity: 1,
        y: 0,
        duration: 1.05,
        stagger: 0.11,
        ease: easeLux,
        delay: 0.12
      });
    }
    if (lines.length) {
      gsap.from(lines, {
        scaleX: 0,
        duration: 0.95,
        stagger: 0.14,
        ease: 'power2.out',
        transformOrigin: 'center center',
        delay: 0.2
      });
    }
    if (diamond) {
      gsap.from(diamond, {
        scale: 0,
        rotation: 45,
        duration: 0.75,
        ease: easeSnap,
        delay: 0.45
      });
    }
    if (scrollHint) {
      gsap.to(scrollHint, { opacity: 1, duration: 0.9, delay: 1.35, ease: 'power2.out' });
    }

    var heroBg = hero.querySelector('.hero-bg');
    if (heroBg) {
      gsap.fromTo(
        heroBg,
        { scale: 1.12 },
        {
          scale: 1.04,
          duration: 2.4,
          ease: 'power2.out',
          delay: 0
        }
      );
      gsap.to(heroBg, {
        y: '6%',
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.7
        }
      });
    }
  }

  /* ── Inner page hero parallax ── */
  var pageHero = document.querySelector('.page-hero');
  if (pageHero && !hero) {
    var phImg = pageHero.querySelector('img');
    if (phImg) {
      gsap.fromTo(
        phImg,
        { scale: 1.08, y: '-3%' },
        {
          scale: 1,
          y: '0%',
          duration: 1.6,
          ease: easeLux
        }
      );
      gsap.to(phImg, {
        y: '4%',
        ease: 'none',
        scrollTrigger: {
          trigger: pageHero,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.65
        }
      });
    }
  }

  /* ── Keyline strip: stagger in ── */
  var ksItems = gsap.utils.toArray('.keyline-strip .ks-item');
  if (ksItems.length) {
    gsap.set(ksItems, { opacity: 0, y: 28 });
    ScrollTrigger.batch(ksItems, {
      start: 'top 90%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.14,
          ease: easeLux,
          overwrite: true
        });
      }
    });
  }

  /* ── Section reveals (avoid double-hit on programme + ticket cards) ── */
  var reveals = gsap.utils.toArray('.reveal').filter(function (el) {
    return (
      !el.classList.contains('tix-cards') && !el.classList.contains('dance-section')
    );
  });
  reveals.forEach(function (el) {
    gsap.set(el, { opacity: 0, y: 52 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 89%',
      once: true,
      onEnter: function () {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.95, ease: easeLux });
      }
    });
  });

  /* ── Dance programme: rhythmic stagger ── */
  var danceItems = gsap.utils.toArray('.dance-section .d-item');
  if (danceItems.length) {
    gsap.set(danceItems, { opacity: 0, x: -28 });
    ScrollTrigger.batch(danceItems, {
      start: 'top 88%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          x: 0,
          duration: 0.42,
          stagger: 0.038,
          ease: 'power2.out',
          overwrite: true
        });
      }
    });
  }

  /* ── Ticket cards ── */
  var tixCards = gsap.utils.toArray('.tix-cards .tix-card');
  if (tixCards.length) {
    gsap.set(tixCards, { opacity: 0, y: 48 });

    tixCards.forEach(function (card) {
      var rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        gsap.set(card, { opacity: 1, y: 0 });
      }
    });

    ScrollTrigger.batch(tixCards, {
      start: 'top 86%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.16,
          ease: easeLux,
          overwrite: true
        });
      }
    });
  }

  /* ── Ribbon subtle pulse ── */
  var ribbon = document.querySelector('.ribbon');
  if (ribbon) {
    gsap.from(ribbon, {
      y: -8,
      opacity: 0,
      duration: 0.65,
      ease: easeLux
    });
  }

  window.gsapHandlesReveals = true;
})();
