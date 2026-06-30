// ============================================
// CENTRALIZED NAVIGATION SYSTEM
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
      { name: 'Blog', url: 'blog.html' }
    ]
  },
  { name: 'PPDB', url: 'pendaftaran.html' },
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
  <nav class="navbar">
    <div class="container">
      <div class="nav-inner">
        <a href="index.html" class="logo">
          <div class="logo-icon">SMP</div>
          <div class="logo-text">
            <span class="logo-title">Persiapan Negeri</span>
            <span class="logo-sub">Pulau Tiga Nakai 🎓</span>
          </div>
        </a>
        <ul class="nav-links">
          ${renderNavLinks()}
        </ul>
        <div class="nav-right">
          <button class="dark-toggle" aria-label="Toggle dark mode" id="darkToggleBtn">
            <div class="dark-toggle-ball">☀️</div>
          </button>
          <button class="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </div>
  </nav>
  <div class="mobile-menu" id="mobileMenu">
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

    const newDarkToggle = document.getElementById('darkToggleBtn');
    if (newDarkToggle) {
      const event = new CustomEvent('navbarUpdated', { detail: { darkToggle: newDarkToggle } });
      document.dispatchEvent(event);
    }
  }
}

function attachAllEvents() {
  // Gunakan setTimeout untuk memastikan DOM benar-benar siap
  setTimeout(() => {
    // Hamburger toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
      // Hapus listener lama dengan clone
      const newHamburger = hamburger.cloneNode(true);
      hamburger.parentNode.replaceChild(newHamburger, hamburger);

      newHamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        this.classList.toggle('active');
        console.log('Menu active:', mobileMenu.classList.contains('active')); // Debug
      });
    } else {
      console.log('ERROR: Hamburger atau mobileMenu tidak ditemukan!');
    }

    // Submenu toggle di mobile
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

    // Tutup menu saat klik link
    const allLinks = document.querySelectorAll('#mobileMenu a');
    allLinks.forEach(link => {
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);

      newLink.addEventListener('click', function () {
        const mobileMenuDiv = document.getElementById('mobileMenu');
        const hamburgerBtn = document.querySelector('.hamburger');
        if (mobileMenuDiv) mobileMenuDiv.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
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
    .nav-links li { position: relative; }
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      min-width: 180px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      z-index: 1000;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
      list-style: none;
      padding: 8px 0;
      margin: 0;
    }
    .dropdown-menu li { list-style: none; }
    .dropdown-menu a {
      display: block;
      padding: 10px 18px;
      font-size: 0.85rem;
      white-space: nowrap;
      color: var(--text);
      text-decoration: none;
    }
    .dropdown-menu a:hover { background: var(--bg2); }
    .nav-links li:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .has-dropdown > a::after {
      content: " ▼";
      font-size: 0.7rem;
      margin-left: 4px;
    }

    .mobile-dropdown-item { border-bottom: 1px solid var(--border); }
    .mobile-dropdown-toggle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      cursor: pointer;
      font-weight: 500;
      color: var(--text);
    }
    .mobile-dropdown-toggle .toggle-icon {
      font-size: 0.7rem;
      transition: transform 0.2s;
    }
    .mobile-dropdown-toggle.open .toggle-icon { transform: rotate(180deg); }
    .mobile-submenu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      background: var(--bg2);
    }
    .mobile-submenu a {
      display: block;
      padding: 10px 20px 10px 40px;
      font-size: 0.85rem;
      color: var(--text2);
      text-decoration: none;
    }
    .mobile-submenu a:hover { background: var(--bg3); }

    .hamburger {
      cursor: pointer;
      background: none;
      border: none;
      display: none;
      flex-direction: column;
      gap: 5px;
      padding: 10px;
      z-index: 1100;
    }
    .hamburger span {
      width: 22px;
      height: 2px;
      background: var(--text);
      transition: all 0.3s ease;
    }
    .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.active span:nth-child(2) { opacity: 0; }
    .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

    /* MOBILE LAYOUT (<= 992px) */
    @media (max-width: 992px) {
      .nav-links {
        display: none !important;
      }
      .hamburger {
        display: flex !important;
      }
      .nav-inner {
        flex-wrap: nowrap;
      }
    }

    /* MOBILE MENU - perbaikan dengan top: 69px (tinggi navbar) */
    .mobile-menu {
      position: fixed;
      top: 69px;
      left: -100%;
      width: 80%;
      max-width: 320px;
      height: calc(100% - 69px);
      background: var(--card-bg);
      border-right: 1px solid var(--border);
      transition: left 0.3s ease;
      z-index: 999;
      overflow-y: auto;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }
    .mobile-menu.active {
      left: 0 !important;
    }
    .mobile-menu > a {
      display: block;
      padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      color: var(--text);
      text-decoration: none;
    }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Tambahan untuk memastikan menu terlihat */
    body.menu-open {
      overflow: hidden;
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// START
document.addEventListener('DOMContentLoaded', () => {
  injectNavbarStyles();
  initNavigation();
});

window.addEventListener('popstate', () => {
  setTimeout(updateActiveNavLink, 50);
});