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
        panel.classList.toggle('active', panel.dataset.panel === targetPanel);
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
});
