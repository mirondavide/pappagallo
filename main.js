/* ============================================
   PIZZERIA PAPPAGALLO - UI Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- PRELOADER ----
  const preloader = document.getElementById('preloader');

  function hidePreloader() {
    preloader.classList.add('hidden');
  }

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 300));
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

  // ---- MENU TABS & SEARCH ----
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuPanels = document.querySelectorAll('.menu-panel');
  const searchInput = document.getElementById('menu-search');
  const noResults = document.getElementById('menu-no-results');
  const searchQuerySpan = document.getElementById('search-query');

  if (searchInput) {
    menuTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch();

        menuTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetPanel = tab.dataset.tab;
        menuPanels.forEach(panel => {
          panel.classList.toggle('active', panel.dataset.panel === targetPanel);
        });
      });
    });

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
      if (noResults) noResults.style.display = anyFound ? 'none' : 'block';
      if (!anyFound && searchQuerySpan) searchQuerySpan.textContent = searchInput.value;
    });
  }

  function clearSearch() {
    document.querySelectorAll('.menu-item.hidden-by-search').forEach(item => item.classList.remove('hidden-by-search'));
    const activeTab = document.querySelector('.menu-tab.active');
    if (activeTab) {
      const targetPanel = activeTab.dataset.tab;
      menuPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === targetPanel));
    } else if (menuTabs.length) {
      menuTabs[0].classList.add('active');
      menuPanels.forEach((panel, i) => panel.classList.toggle('active', i === 0));
    }
    if (noResults) noResults.style.display = 'none';
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

  // ---- COOKIE CONSENT ----
  const MAPS_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2788.5!2d9.6545!3d45.6455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4781530ed5e6c40f%3A0x2e68b7a1d7b4f5e!2sPizzeria%20Pappagallo!5e0!3m2!1sen!2sit!4v1';
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieModal = document.getElementById('cookie-modal');

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function loadMap() {
    const wrapper = document.getElementById('map-wrapper');
    const placeholder = document.getElementById('map-placeholder');
    if (placeholder) {
      const iframe = document.createElement('iframe');
      iframe.src = MAPS_SRC;
      iframe.width = '100%';
      iframe.height = '400';
      iframe.style.cssText = 'border:0; border-radius: 16px;';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      wrapper.replaceChild(iframe, placeholder);
    }
  }

  function acceptCookies() {
    setCookie('cookie_consent', 'all', 365);
    cookieBanner.style.display = 'none';
    loadMap();
  }

  function rejectCookies() {
    setCookie('cookie_consent', 'necessary', 365);
    cookieBanner.style.display = 'none';
  }

  // Show banner or load map based on stored preference
  const consent = getCookie('cookie_consent');
  if (!consent) {
    cookieBanner.style.display = 'block';
  } else if (consent === 'all') {
    loadMap();
  }

  document.getElementById('cookie-accept').addEventListener('click', acceptCookies);
  document.getElementById('cookie-reject').addEventListener('click', rejectCookies);

  // Map placeholder accept button
  document.getElementById('accept-maps').addEventListener('click', acceptCookies);

  // Cookie policy modal
  function openCookieModal(e) {
    e.preventDefault();
    cookieModal.style.display = 'flex';
  }

  document.getElementById('cookie-policy-link').addEventListener('click', openCookieModal);
  document.getElementById('cookie-settings-link').addEventListener('click', openCookieModal);
  document.getElementById('cookie-modal-close').addEventListener('click', () => {
    cookieModal.style.display = 'none';
  });
  cookieModal.addEventListener('click', (e) => {
    if (e.target === cookieModal) cookieModal.style.display = 'none';
  });
});
