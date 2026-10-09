// ============================================
// CENTRALIZED NAVIGATION SYSTEM
// SMP PERSIAPAN NEGERI PULAU TIGA
// ============================================

const MENU_STRUCTURE = [
  { name: 'Home', url: 'index.html' },
  {
    name: 'Akademik',
    dropdown: [
      { name: 'Students Grades', url: 'grades.html' },
      { name: 'Ujian', url: 'exam.html' },
      { name: 'Rapor', url: 'rapor.html' },
      { name: 'Absensi', url: 'https://mryanto96.github.io/ATTENDANCE-SYSTEM/', external: true }
    ]
  },
  {
    name: 'Content',
    dropdown: [
      { name: 'Documents', url: 'documents.html' },
      { name: 'Gallery', url: 'gallery.html' },
    ]
  },
  { name: 'Kelulusan', url: 'kelulusan.html' },
  { name: 'Blog', url: 'blog.html' },
  { name: 'PPDB', url: 'pendaftaran.html' },
  { name: 'Videos', url: 'videos.html' },
  { name: 'About Me', url: 'about.html' },
  { name: 'Contact Me', url: 'contact.html' }
];

function renderNavLinks() {
  let html = '';
  MENU_STRUCTURE.forEach(item => {
    if (item.dropdown) {
      html += `<li class="has-dropdown">
        <a href="#">${item.name}</a>
        <ul class="dropdown-menu">`;
      item.dropdown.forEach(sub => {
        const target = sub.external ? 'target="_blank" rel="noopener noreferrer"' : '';
        html += `<li><a href="${sub.url}" ${target}>${sub.name}</a></li>`;
      });
      html += `</ul></li>`;
    } else {
      html += `<li><a href="${item.url}">${item.name}</a></li>`;
    }
  });
  return html;
}

function renderMobileMenu() {
  let html = '';
  MENU_STRUCTURE.forEach(item => {
    if (item.dropdown) {
      html += `
        <div class="mobile-dropdown-item">
          <div class="mobile-dropdown-toggle">
            <span>${item.name}</span>
            <span class="toggle-icon">▼</span>
          </div>
          <div class="mobile-submenu">
      `;
      item.dropdown.forEach(sub => {
        const target = sub.external ? 'target="_blank" rel="noopener noreferrer"' : '';
        html += `<a href="${sub.url}" ${target}>${sub.name}</a>`;
      });
      html += `</div></div>`;
    } else {
      html += `<a href="${item.url}">${item.name}</a>`;
    }
  });
  return html;
}

function renderNavbar() {
  return `
  <nav class="navbar" aria-label="Main navigation">
    <div class="container">
      <div class="nav-inner">
        <a href="index.html" class="logo" aria-label="SMP Negeri Pulau Tiga Home">
          <img src="images/Logosekolah.jpg" alt="Logo SMP Negeri Pulau Tiga" class="logo-img">
          <div class="logo-text">
            <span class="logo-title">NEGERI PULAU TIGA</span>
            <span class="logo-sub">ASMAT PAPUA SELATAN</span>
          </div>
        </a>

        <ul class="nav-links">
          ${renderNavLinks()}
        </ul>

        <div class="nav-right">
          <button class="hamburger" aria-label="Menu" aria-expanded="false" aria-controls="mobileMenu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </div>
  </nav>
  <div class="mobile-menu" id="mobileMenu" aria-hidden="true">
    ${renderMobileMenu()}
  </div>
  `;
}

function initNavigation() {
  const existingNav = document.querySelector('nav.navbar');

  if (existingNav) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderNavbar();
    const newNavbar = tempDiv.querySelector('nav.navbar');
    const newMobileMenu = tempDiv.querySelector('#mobileMenu');

    existingNav.parentNode.replaceChild(newNavbar, existingNav);

    const oldMobileMenu = document.getElementById('mobileMenu');
    if (oldMobileMenu && oldMobileMenu !== newMobileMenu) {
      oldMobileMenu.remove();
    }

    if (newMobileMenu) {
      document.body.appendChild(newMobileMenu);
    }

    attachAllEvents();
    updateActiveNavLink();
    applyNavbarOffset();

    const newDarkToggle = document.getElementById('darkToggleBtn');
    if (newDarkToggle) {
      const event = new CustomEvent('navbarUpdated', { detail: { darkToggle: newDarkToggle } });
      document.dispatchEvent(event);
    }
  } else {
    const navbarHtml = renderNavbar();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = navbarHtml;
    const navbarElement = tempDiv.querySelector('nav.navbar');
    const mobileMenuElement = tempDiv.querySelector('#mobileMenu');

    const oldMobileMenu = document.getElementById('mobileMenu');
    if (oldMobileMenu) oldMobileMenu.remove();

    document.body.insertBefore(navbarElement, document.body.firstChild);
    if (mobileMenuElement) {
      document.body.appendChild(mobileMenuElement);
    }

    attachAllEvents();
    updateActiveNavLink();
    applyNavbarOffset();

    const newDarkToggle = document.getElementById('darkToggleBtn');
    if (newDarkToggle) {
      const event = new CustomEvent('navbarUpdated', { detail: { darkToggle: newDarkToggle } });
      document.dispatchEvent(event);
    }
  }
}

// ============================================
// Hitung tinggi navbar & set padding body
// ============================================
function applyNavbarOffset() {
  const navbar = document.querySelector('nav.navbar');
  if (!navbar) return;

  const updateOffset = () => {
    const h = navbar.offsetHeight;
    document.body.style.paddingTop = h + 'px';
    document.documentElement.style.setProperty('--navbar-height', h + 'px');
  };

  requestAnimationFrame(updateOffset);
  window.addEventListener('resize', updateOffset);
}

function attachAllEvents() {
  setTimeout(() => {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
      const newHamburger = hamburger.cloneNode(true);
      hamburger.parentNode.replaceChild(newHamburger, hamburger);

      newHamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        this.classList.toggle('active');
        document.body.classList.toggle('menu-open', mobileMenu.classList.contains('active'));
      });
    }

    const toggles = document.querySelectorAll('.mobile-dropdown-toggle');
    toggles.forEach(toggle => {
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);

      newToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        const submenu = this.nextElementSibling;
        this.classList.toggle('open');
        if (submenu.style.maxHeight) {
          submenu.style.maxHeight = null;
        } else {
          submenu.style.maxHeight = submenu.scrollHeight + 'px';
        }
      });
    });

    const allLinks = document.querySelectorAll('#mobileMenu a');
    allLinks.forEach(link => {
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);

      newLink.addEventListener('click', function () {
        const mobileMenuDiv = document.getElementById('mobileMenu');
        const hamburgerBtn = document.querySelector('.hamburger');
        if (mobileMenuDiv) mobileMenuDiv.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }, 50);
}

function updateActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  document.querySelectorAll('#mobileMenu > a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function injectNavbarStyles() {
  const styleId = 'navbar-dynamic-styles';
  if (document.getElementById(styleId)) return;

  const styles = `
    /* ============================================
       NAVBAR — FIXED, TIDAK HIDE SAAT SCROLL
       ============================================ */
    nav.navbar {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      z-index: 1000 !important;
      background: var(--card-bg, #fff) !important;
      border-bottom: 1px solid var(--border, #e5e7eb);
      transform: none !important;
      transition: none !important;
      will-change: auto !important;
      animation: none !important;
    }

    nav.navbar.hide,
    nav.navbar.hidden,
    nav.navbar.scroll-down {
      transform: none !important;
      top: 0 !important;
      visibility: visible !important;
      opacity: 1 !important;
    }

    /* Container & Inner */
    nav.navbar .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      height: 76px;
    }

    /* ============================================
       LOGO — Gambar + Teks
       ============================================ */
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: inherit;
      flex-shrink: 0;
      padding: 0;
    }

    .logo-img {
      width: 52px;
      height: 52px;
      object-fit: contain;
      flex-shrink: 0;
      display: block;
      background: transparent;
      border-radius: 0;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
      line-height: 1.15;
    }

    .logo-title {
      font-size: 0.95rem;
      font-weight: 800;
      letter-spacing: 0.3px;
      color: #ef4444;
      line-height: 1.15;
      white-space: nowrap;
    }

    .logo-sub {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: var(--text);
      line-height: 1.15;
      white-space: nowrap;
      text-transform: uppercase;
    }

    .logo-icon {
      display: none !important;
    }

    /* ============================================
       NAV LINKS (Desktop)
       ============================================ */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 2px;
      list-style: none;
      margin: 0;
      padding: 0;
      flex: 1;
      justify-content: center;
    }

    .nav-links li {
      position: relative;
      list-style: none;
    }

    .nav-links > li > a {
      display: inline-flex;
      align-items: center;
      padding: 9px 12px;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text);
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.2s ease, color 0.2s ease;
      white-space: nowrap;
    }

    .nav-links > li > a:hover {
      background: var(--bg2, #f3f4f6);
      color: var(--primary, #2563eb);
    }

    .nav-links > li > a.active {
      color: var(--primary, #2563eb);
      background: var(--bg2, #f3f4f6);
    }

    /* Dropdown */
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      min-width: 190px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.25s ease;
      z-index: 1000;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12);
      list-style: none;
      padding: 8px 0;
      margin: 0;
    }

    .dropdown-menu li {
      list-style: none;
    }

    .dropdown-menu a {
      display: block;
      padding: 9px 16px;
      font-size: 0.82rem;
      white-space: nowrap;
      color: var(--text);
      text-decoration: none;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .dropdown-menu a:hover {
      background: var(--bg2);
      color: var(--primary, #2563eb);
    }

    .nav-links li:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .has-dropdown > a::after {
      content: " ▼";
      font-size: 0.6rem;
      margin-left: 4px;
      opacity: 0.7;
    }

    /* Nav Right */
    .nav-right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    /* Hamburger */
    .hamburger {
      cursor: pointer;
      background: none;
      border: none;
      display: none;
      flex-direction: column;
      gap: 5px;
      padding: 7px;
      z-index: 1100;
      border-radius: 6px;
      transition: background 0.2s ease;
    }

    .hamburger:hover {
      background: var(--bg2, #f3f4f6);
    }

    .hamburger span {
      width: 22px;
      height: 2.5px;
      background: var(--text);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }

    /* ============================================
       MOBILE MENU
       ============================================ */
    .mobile-menu {
      position: fixed;
      top: var(--navbar-height, 76px);
      left: -100%;
      width: 85%;
      max-width: 340px;
      height: calc(100% - var(--navbar-height, 76px));
      background: var(--card-bg);
      border-right: 1px solid var(--border);
      transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 999;
      overflow-y: auto;
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
      -webkit-overflow-scrolling: touch;
    }

    .mobile-menu.active {
      left: 0 !important;
    }

    .mobile-menu > a {
      display: block;
      padding: 13px 18px;
      border-bottom: 1px solid var(--border);
      color: var(--text);
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      transition: background 0.2s ease;
    }

    .mobile-menu > a:hover,
    .mobile-menu > a.active {
      background: var(--bg2);
      color: var(--primary, #2563eb);
    }

    /* Mobile Dropdown */
    .mobile-dropdown-item {
      border-bottom: 1px solid var(--border);
    }

    .mobile-dropdown-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 13px 18px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.88rem;
      color: var(--text);
      transition: background 0.2s ease;
    }

    .mobile-dropdown-toggle:hover {
      background: var(--bg2);
    }

    .mobile-dropdown-toggle .toggle-icon {
      font-size: 0.65rem;
      transition: transform 0.3s ease;
      opacity: 0.7;
    }

    .mobile-dropdown-toggle.open .toggle-icon {
      transform: rotate(180deg);
    }

    .mobile-submenu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      background: var(--bg2);
    }

    .mobile-submenu a {
      display: block;
      padding: 10px 18px 10px 36px;
      font-size: 0.82rem;
      color: var(--text2);
      text-decoration: none;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .mobile-submenu a:hover {
      background: var(--bg3);
      color: var(--primary, #2563eb);
    }

    body.menu-open {
      overflow: hidden;
    }

    /* ============================================
       RESPONSIVE
       ============================================ */

    /* Desktop (≤ 1200px) */
    @media (max-width: 1200px) {
      .nav-links > li > a {
        padding: 9px 10px;
        font-size: 0.78rem;
      }
    }

    /* Tablet (≤ 1024px) — hamburger muncul */
    @media (max-width: 1024px) {
      .nav-links {
        display: none !important;
      }

      .hamburger {
        display: flex !important;
      }

      .nav-inner {
        height: 72px;
      }

      .logo-img {
        width: 46px;
        height: 46px;
      }

      .logo-title {
        font-size: 0.88rem;
      }

      .logo-sub {
        font-size: 0.66rem;
        letter-spacing: 0.4px;
      }
    }

    /* Tablet kecil (≤ 768px) */
    @media (max-width: 768px) {
      nav.navbar .container {
        padding: 0 16px;
      }

      .nav-inner {
        height: 68px;
        gap: 12px;
      }

      .logo {
        gap: 10px;
      }

      .logo-img {
        width: 44px;
        height: 44px;
      }

      .logo-title {
        font-size: 0.82rem;
        letter-spacing: 0.2px;
      }

      .logo-sub {
        font-size: 0.62rem;
        letter-spacing: 0.4px;
      }
    }

    /* Mobile (≤ 576px) */
    @media (max-width: 576px) {
      nav.navbar .container {
        padding: 0 14px;
      }

      .nav-inner {
        height: 64px;
        gap: 10px;
      }

      .logo {
        gap: 8px;
      }

      .logo-img {
        width: 40px;
        height: 40px;
      }

      .logo-title {
        font-size: 0.74rem;
        letter-spacing: 0.2px;
      }

      .logo-sub {
        font-size: 0.56rem;
        letter-spacing: 0.3px;
      }

      .hamburger {
        padding: 5px;
      }

      .hamburger span {
        width: 20px;
        height: 2px;
      }

      .mobile-menu {
        width: 90%;
        max-width: none;
      }
    }

    /* Mobile sangat kecil (≤ 400px) */
    @media (max-width: 400px) {
      .nav-inner {
        height: 60px;
      }

      .logo {
        gap: 7px;
      }

      .logo-img {
        width: 36px;
        height: 36px;
      }

      .logo-title {
        font-size: 0.66rem;
      }

      .logo-sub {
        font-size: 0.5rem;
      }

      .hamburger {
        padding: 4px;
      }

      .hamburger span {
        width: 18px;
      }
    }

    /* Aksesibilitas */
    @media (prefers-reduced-motion: reduce) {
      .logo:hover .logo-img {
        transform: none;
      }

      .hamburger span {
        transition: none;
      }

      .mobile-menu,
      .mobile-submenu,
      .dropdown-menu {
        transition: none;
      }
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// ============================================
// START
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  injectNavbarStyles();
  initNavigation();
});

window.addEventListener('popstate', () => {
  setTimeout(updateActiveNavLink, 50);
});