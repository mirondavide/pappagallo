/* ============================================
   PIZZERIA PAPPAGALLO - GSAP Animations & UI
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ---- PRELOADER ----
  const preloader = document.getElementById('preloader');

  function hidePreloader() {
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        preloader.classList.add('hidden');
        startAnimations();
      }
    });
  }

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 300));
  }

  // ---- CUSTOM CURSOR ----
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (window.matchMedia('(hover: hover)').matches && cursor && follower) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
    });

    (function updateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(updateFollower);
    })();

    document.querySelectorAll('a, button, .menu-item, .offer-card, .contact-card, .feature').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('active'); follower.classList.add('active'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('active'); follower.classList.remove('active'); });
    });
  }

  // ---- NAVBAR ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  });

  // ---- MOBILE MENU ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---- ALL ANIMATIONS ----
  function startAnimations() {
    // HERO
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-glow', { scale: 0.5, opacity: 0, duration: 2, stagger: 0.3, ease: 'power2.out' })
      .from('.hero-badge', { y: 30, opacity: 0, duration: 0.8 }, '-=1.2')
      .from('.title-word', { y: 120, opacity: 0, duration: 1, stagger: 0.15, ease: 'power4.out' }, '-=0.6')
      .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.hero-actions .btn', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
      .from('.hero-scroll', { opacity: 0, duration: 0.6 }, '-=0.2')
      .from('.hero-stats', { y: 40, opacity: 0, duration: 0.8 }, '-=0.4');

    // Counter animation
    document.querySelectorAll('.stat-number[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      gsap.to(el, { textContent: target, duration: 2, delay: 1.2, snap: { textContent: 1 }, ease: 'power2.out' });
    });

    // Hero glow parallax
    gsap.to('.hero-glow-1', {
      y: 80,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 }
    });
    gsap.to('.hero-glow-2', {
      y: 50,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 }
    });

    // ---- SCROLL-TRIGGERED REVEALS ----
    // Helper: animate elements when they scroll into view
    function reveal(selector, from, triggerEl) {
      const els = gsap.utils.toArray(selector);
      if (!els.length) return;
      const trigger = triggerEl || els[0];
      gsap.set(els, { opacity: 0, ...from });
      ScrollTrigger.create({
        trigger: trigger,
        start: 'top 88%',
        onEnter: () => {
          gsap.to(els, {
            opacity: 1,
            x: 0, y: 0, scale: 1, rotation: 0,
            duration: from.duration || 0.7,
            stagger: from.stagger || 0,
            delay: from.delay || 0,
            ease: from.ease || 'power2.out',
            clearProps: 'transform'
          });
        },
        once: true
      });
    }

    // About
    reveal('.about-content .section-tag', { x: -30, duration: 0.6 }, '#chi-siamo');
    reveal('.about-content .section-title', { y: 40, duration: 0.8, delay: 0.1 }, '#chi-siamo');
    reveal('.about-text', { y: 30, duration: 0.6, stagger: 0.15, delay: 0.2 }, '#chi-siamo');
    reveal('.feature', { x: -30, duration: 0.5, stagger: 0.12 }, '.about-features');
    reveal('.visual-card', { scale: 0.9, duration: 1 }, '.about-visual');

    // Parrot special
    gsap.set('.about-parrot', { opacity: 0, scale: 0, rotation: -180 });
    ScrollTrigger.create({
      trigger: '.about-visual',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to('.about-parrot', { opacity: 1, scale: 1, rotation: 0, duration: 1, delay: 0.5, ease: 'back.out(1.7)' });
      }
    });

    // Offers
    reveal('#offerte .section-tag', { y: 20, duration: 0.6 }, '#offerte');
    reveal('#offerte .section-title', { y: 30, duration: 0.7, delay: 0.1 }, '#offerte');
    reveal('.offer-card', { y: 50, duration: 0.7, stagger: 0.15 }, '.offers-grid');

    // Menu section header
    reveal('#menu .section-tag', { y: 20, duration: 0.6 }, '#menu');
    reveal('#menu .section-title', { y: 30, duration: 0.7, delay: 0.1 }, '#menu');
    reveal('#menu .section-desc', { y: 20, duration: 0.5, delay: 0.15 }, '#menu');
    reveal('.menu-search-wrapper', { y: 20, duration: 0.5, delay: 0.2 }, '#menu');
    reveal('.menu-tabs', { y: 20, duration: 0.5, delay: 0.25 }, '#menu');
    reveal('.menu-notice', { y: 20, duration: 0.5, delay: 0.3 }, '#menu');

    // Menu items (initial panel)
    const initialItems = gsap.utils.toArray('.menu-panel.active .menu-item');
    if (initialItems.length) {
      gsap.set(initialItems, { opacity: 0, y: 25 });
      ScrollTrigger.create({
        trigger: '.menu-panel.active',
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(initialItems, { opacity: 1, y: 0, duration: 0.4, stagger: 0.02, ease: 'power2.out', clearProps: 'transform' });
        }
      });
    }

    // Contact
    reveal('#contatti .section-tag', { y: 20, duration: 0.6 }, '#contatti');
    reveal('#contatti .section-title', { y: 30, duration: 0.7, delay: 0.1 }, '#contatti');
    reveal('.contact-card', { y: 40, duration: 0.6, stagger: 0.1 }, '.contact-grid');
    reveal('.map-wrapper', { y: 40, duration: 0.8 });

    // Footer
    reveal('.footer-inner', { y: 30, duration: 0.7 }, '.footer');

    // Refresh ScrollTrigger after everything is set
    ScrollTrigger.refresh();
  }

  // ---- MENU TABS ----
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuPanels = document.querySelectorAll('.menu-panel');
  const searchInput = document.getElementById('menu-search');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      searchInput.value = '';
      clearSearch();

      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetPanel = tab.dataset.tab;
      menuPanels.forEach(panel => {
        if (panel.dataset.panel === targetPanel) {
          panel.classList.add('active');
          const items = panel.querySelectorAll('.menu-item');
          gsap.fromTo(items,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.35, stagger: 0.025, ease: 'power2.out', clearProps: 'transform' }
          );
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // ---- MENU SEARCH ----
  const noResults = document.getElementById('menu-no-results');
  const searchQuerySpan = document.getElementById('search-query');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) { clearSearch(); return; }

    let anyFound = false;
    menuPanels.forEach(panel => {
      panel.classList.add('active');
      panel.querySelectorAll('.menu-item').forEach(item => {
        const match = item.textContent.toLowerCase().includes(query);
        item.classList.toggle('hidden-by-search', !match);
        if (match) anyFound = true;
      });
    });

    menuTabs.forEach(t => t.classList.remove('active'));
    noResults.style.display = anyFound ? 'none' : 'block';
    if (!anyFound) searchQuerySpan.textContent = searchInput.value;
  });

  function clearSearch() {
    document.querySelectorAll('.menu-item.hidden-by-search').forEach(item => item.classList.remove('hidden-by-search'));
    const activeTab = document.querySelector('.menu-tab.active');
    if (activeTab) {
      const targetPanel = activeTab.dataset.tab;
      menuPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === targetPanel));
    } else {
      menuTabs[0].classList.add('active');
      menuPanels.forEach((panel, i) => panel.classList.toggle('active', i === 0));
    }
    noResults.style.display = 'none';
  }

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  // ---- ACTIVE NAV LINK ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
      const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
      if (link) {
        const active = scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight;
        link.style.color = active ? 'var(--accent)' : '';
      }
    });
  });

  // ---- MARQUEE DUPLICATE ----
  const marqueeTrack = document.querySelector('.marquee-track');
  const marqueeContent = document.querySelector('.marquee-content');
  if (marqueeTrack && marqueeContent) {
    marqueeTrack.appendChild(marqueeContent.cloneNode(true));
  }

  // ---- TILT on offer cards ----
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.offer-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const rotateX = (e.clientY - rect.top - rect.height / 2) / 15;
        const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 15;
        gsap.to(card, { rotateX, rotateY, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
      });
    });
  }
});
