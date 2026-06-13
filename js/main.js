// ===== DARK MODE =====
const html = document.documentElement;

function setTheme(dark) {
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  const ball = document.querySelector('.dark-toggle-ball');
  if (ball) ball.innerHTML = dark ? '🌙' : '☀️';
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  setTheme(isDark);
}

function toggleTheme() {
  const isDark = html.getAttribute('data-theme') === 'dark';
  setTheme(!isDark);
}

// ===== RE-ATTACH DARK TOGGLE (untuk navbar.js) =====
function reattachDarkToggle() {
  const darkToggle = document.getElementById('darkToggleBtn');
  if (darkToggle) {
    const newDarkToggle = darkToggle.cloneNode(true);
    darkToggle.parentNode.replaceChild(newDarkToggle, darkToggle);
    newDarkToggle.addEventListener('click', toggleTheme);
    const isDark = html.getAttribute('data-theme') === 'dark';
    const ball = newDarkToggle.querySelector('.dark-toggle-ball');
    if (ball) ball.innerHTML = isDark ? '🌙' : '☀️';
  }
}

// ===== FADE UP ON SCROLL =====
function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ===== LOADING INDICATOR =====
let loadingOverlay = null;

function showLoadingIndicator(fileName) {
  if (loadingOverlay) hideLoadingIndicator();

  loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  loadingOverlay.innerHTML = `
    <div class="loading-card">
      <div class="loading-spinner"></div>
      <div class="loading-text">
        <i class="fas fa-download"></i> Mengunduh File
        <strong style="display:block; margin-top:8px; font-size:1rem;">${fileName}</strong>
      </div>
      <div class="loading-message">Mohon tunggu, sedang mengunduh...</div>
      <div class="loading-hint">
        <i class="fas fa-info-circle"></i>
        Koneksi internet mungkin lambat, harap sabar
      </div>
    </div>
  `;
  document.body.appendChild(loadingOverlay);

  requestAnimationFrame(() => {
    if (loadingOverlay) {
      loadingOverlay.classList.add('active');
    }
  });
}

function hideLoadingIndicator() {
  if (loadingOverlay) {
    loadingOverlay.classList.remove('active');
    setTimeout(() => {
      if (loadingOverlay && loadingOverlay.remove) {
        loadingOverlay.remove();
        loadingOverlay = null;
      }
    }, 300);
  }
}

// ===== DATA DOKUMEN UNTUK TABEL =====
const documentsData = [
  { no: "01", name: "Ijazah Sarjana (S1)", type: "pdf", icon: "fa-file-pdf", desc: "Ijazah Sarjana Pendidikan Bahasa Inggris", size: "~2.5 MB", link: "https://drive.google.com/uc?export=download&id=1kQxhubOSgE9pZeAB9QtHHHojbgsGh0kB", available: true },
  { no: "02", name: "Ijazah SMA", type: "pdf", icon: "fa-file-pdf", desc: "Ijazah Sekolah Menengah Atas", size: "~1.8 MB", link: "https://drive.google.com/uc?export=download&id=1irCfRd6JHdLPsjBxyOzjcqokTXgOGAtb", available: true },
  { no: "03", name: "Ijazah SMP", type: "pdf", icon: "fa-file-pdf", desc: "Ijazah Sekolah Menengah Pertama", size: "~1.5 MB", link: "https://drive.google.com/uc?export=download&id=1m6bhWIYA3X7st0P-k4SoFKmagq0d98h7", available: true },
  { no: "04", name: "Ijazah SD", type: "pdf", icon: "fa-file-pdf", desc: "Ijazah Sekolah Dasar", size: "~1.2 MB", link: "https://drive.google.com/uc?export=download&id=1lpWM0bd8CqH1utpGSHhE2GEEQtGNMNmd", available: true },
  { no: "05", name: "SK Dinas & SK Pembagian Tugas", type: "pdf", icon: "fa-file-pdf", desc: "SK Dinas Pendidikan dan Pembagian Tugas Mengajar", size: "~3.2 MB", link: "https://drive.google.com/uc?export=download&id=1IVrOtRUw2TAWYRkyuuUAR2iAUw91JDBo", available: true },
  { no: "06", name: "Rekap Nilai Siswa", type: "excel", icon: "fa-file-excel", desc: "Rekapitulasi nilai siswa semester ganjil 2025/2026", size: "~0.8 MB", link: "#", available: false },
  { no: "07", name: "Proposal Program Kerja", type: "word", icon: "fa-file-word", desc: "Proposal program kerja tahun ajaran 2025/2026", size: "~1.1 MB", link: "#", available: false }
];

// ===== RENDER TABEL =====
function renderTable() {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  documentsData.forEach(doc => {
    const row = tbody.insertRow();
    const typeColor = doc.type === 'pdf' ? '#d93025' : doc.type === 'excel' ? '#217346' : '#2b579a';

    let actionBtn;
    if (doc.available) {
      actionBtn = `<a href="${doc.link}" target="_blank" class="btn btn-download" style="padding:6px 14px;"><i class="fas fa-download"></i> Download</a>`;
    } else {
      actionBtn = `<button class="btn btn-disabled" style="padding:6px 14px;opacity:0.6;cursor:pointer;" data-file-name="${doc.name}" data-file-type="${doc.type}"><i class="fas fa-download"></i> Belum Tersedia</button>`;
    }

    row.innerHTML = `
      <td><span style="font-weight:600;color:var(--text2);">${doc.no}</span></td>
      <td><div style="display:flex;align-items:center;gap:10px;"><i class="fas ${doc.icon}" style="color:${typeColor};font-size:1.1rem;"></i><span style="font-weight:600;">${doc.name}</span></div></td>
      <td><span class="file-badge ${doc.type}">${doc.type.toUpperCase()}</span></td>
      <td style="color:var(--text2);">${doc.desc}</td>
      <td style="color:var(--text3);font-size:0.75rem;">${doc.size}</td>
      <td>${actionBtn}</td>
    `;
  });

  document.querySelectorAll('#tableBody .btn-disabled').forEach(btn => {
    btn.removeEventListener('click', handleDisabledClick);
    btn.addEventListener('click', handleDisabledClick);
  });
}

function handleDisabledClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const fileName = e.currentTarget.getAttribute('data-file-name') || 'file';
  const fileType = e.currentTarget.getAttribute('data-file-type') || '';
  showUnavailableModal(fileName, fileType);
}

// ===== MODAL UNTUK FILE BELUM TERSEDIA =====
function showUnavailableModal(fileName, fileType) {
  let modal = document.getElementById('errorModal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'errorModal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>File Belum Tersedia</h3>
        <p id="modalMessage">Maaf, file yang Anda cari belum tersedia saat ini. File sedang dalam proses persiapan dan akan segera diunggah.</p>
        <div class="modal-buttons">
          <a href="contact.html" class="modal-btn modal-btn-primary">
            <i class="fab fa-whatsapp"></i> Hubungi Pengelola
          </a>
          <button class="modal-btn modal-btn-secondary" id="closeModalBtn">
            <i class="fas fa-times"></i> Tutup
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  const modalMessage = document.getElementById('modalMessage');
  if (modalMessage) {
    const typeText = fileType === 'excel' ? 'Excel' : (fileType === 'word' ? 'Word' : 'file');
    modalMessage.innerHTML = `Maaf, file <strong>${fileName}</strong> (${typeText}) belum tersedia saat ini. File sedang dalam proses persiapan dan akan segera diunggah.`;
  }

  const closeBtn = document.getElementById('closeModalBtn');
  if (closeBtn) {
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    newCloseBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('errorModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('errorModal');
    if (modal && modal.classList.contains('show')) {
      closeModal();
    }
  }
});

// ===== DOWNLOAD HANDLER =====
function initDownloadButtons() {
  setTimeout(() => {
    const downloadBtns = document.querySelectorAll('.btn-download:not(.btn-disabled)');

    downloadBtns.forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const url = this.getAttribute('href');
        if (!url || url === '#') {
          showNotif('⚠️ File belum tersedia', 'error');
          return;
        }

        let fileName = '';
        const card = this.closest('.doc-card');
        if (card) {
          const nameDiv = card.querySelector('.doc-name');
          fileName = nameDiv ? nameDiv.innerText : '';
        }

        if (!fileName) {
          const row = this.closest('tr');
          if (row) {
            const nameCell = row.querySelector('td:nth-child(2)');
            if (nameCell) {
              const nameSpan = nameCell.querySelector('span');
              fileName = nameSpan ? nameSpan.innerText : '';
            }
          }
        }

        if (!fileName) fileName = 'dokumen';
        fileName = fileName.replace(/[\\/*?:"<>|]/g, '').trim();
        if (!fileName.match(/\.(pdf|docx?|xlsx?)$/i)) {
          fileName += '.pdf';
        }

        showLoadingIndicator(fileName);

        setTimeout(() => {
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => {
            hideLoadingIndicator();
            showNotif(`📥 ${fileName} mulai diunduh`, 'success');
          }, 3000);
        }, 500);
      });
    });
  }, 1500);
}

// ===== FILTER DOKUMEN =====
function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const docCards = document.querySelectorAll('.doc-card');

  if (!filterBtns.length) return;

  const pdfCount = document.querySelectorAll('.doc-card[data-file-type="pdf"]').length;
  const excelCount = document.querySelectorAll('.doc-card[data-file-type="excel"]').length;
  const wordCount = document.querySelectorAll('.doc-card[data-file-type="word"]').length;
  const totalCount = pdfCount + excelCount + wordCount;

  filterBtns.forEach(btn => {
    const filter = btn.getAttribute('data-filter');
    if (filter === 'all') btn.innerHTML = `<i class="fas fa-folder-open"></i> Semua (${totalCount})`;
    if (filter === 'pdf') btn.innerHTML = `<i class="fas fa-file-pdf"></i> PDF (${pdfCount})`;
    if (filter === 'excel') btn.innerHTML = `<i class="fas fa-file-excel"></i> Excel (${excelCount})`;
    if (filter === 'word') btn.innerHTML = `<i class="fas fa-file-word"></i> Word (${wordCount})`;
  });

  filterBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      docCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-file-type') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initDisabledGridButtons() {
  const disabledBtns = document.querySelectorAll('.doc-card .btn-disabled');
  disabledBtns.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', handleGridDisabledClick);
  });
}

function handleGridDisabledClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const card = this.closest('.doc-card');
  let fileName = '';
  let fileType = '';
  if (card) {
    const nameDiv = card.querySelector('.doc-name');
    fileName = nameDiv ? nameDiv.innerText : 'file';
    fileType = card.getAttribute('data-file-type') || '';
  }
  showUnavailableModal(fileName, fileType);
}

// ===== WHATSAPP FORM =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showNotif('Harap isi semua field!', 'error');
      return;
    }

    const waMessage = `*PORTAL SMP PERSIAPAN NEGERI PULAU TIGA*\n\n👤 *Nama*: ${name}\n📧 *Email*: ${email}\n\n📝 *Pesan*:\n${message}\n\n_Terima kasih sudah mengirim pesan. Pesan Anda akan segera di proses. ✋_`;
    const encoded = encodeURIComponent(waMessage);
    const waNumber = '6282254730476';

    window.open(`https://wa.me/${waNumber}?text=${encoded}`, '_blank');
    showNotif('Membuka WhatsApp...', 'success');
    form.reset();
  });
}

// ===== NOTIFICATION =====
function showNotif(text, type = 'success') {
  const existing = document.querySelector('.notif');
  if (existing) existing.remove();

  const notif = document.createElement('div');
  notif.className = 'notif';
  notif.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 10001;
    padding: 14px 20px; border-radius: 12px;
    background: ${type === 'success' ? 'linear-gradient(135deg,#25D366,#128C7E)' : 'linear-gradient(135deg,#FF6B6B,#FF8B94)'};
    color: white; font-weight: 600; font-size: 0.9rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    display: flex; align-items: center; gap: 8px;
    animation: slideInRight 0.3s ease;
    font-family: 'Plus Jakarta Sans', sans-serif;
    max-width: 350px;
  `;
  notif.innerHTML = `${type === 'success' ? '✅' : '⚠️'} ${text}`;
  document.body.appendChild(notif);
  setTimeout(() => {
    notif.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// ===== VIEW TOGGLE =====
function initViewToggle() {
  const gridBtn = document.getElementById('gridBtn');
  const tableBtn = document.getElementById('tableBtn');
  const gridView = document.getElementById('gridView');
  const tableView = document.getElementById('tableView');

  if (!gridBtn || !tableBtn) return;

  gridBtn.addEventListener('click', () => {
    if (gridView) gridView.style.display = 'grid';
    if (tableView) tableView.style.display = 'none';
    gridBtn.classList.add('active');
    tableBtn.classList.remove('active');
  });

  tableBtn.addEventListener('click', () => {
    if (gridView) gridView.style.display = 'none';
    if (tableView) tableView.style.display = 'block';
    gridBtn.classList.remove('active');
    tableBtn.classList.add('active');
  });
}

function isDocumentsPage() {
  return window.location.pathname.includes('documents.html');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFadeUp();
  initContactForm();
  initViewToggle();

  if (isDocumentsPage()) {
    renderTable();
    initFilter();
    initDownloadButtons();
    initDisabledGridButtons();
  }

  // Dark toggle click (jika navbar sudah ada saat DOMContentLoaded)
  const toggle = document.querySelector('.dark-toggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);
});

// ===== EVENT UNTUK NAVBAR.JS =====
document.addEventListener('navbarUpdated', () => {
  reattachDarkToggle();

  if (isDocumentsPage()) {
    setTimeout(() => {
      renderTable();
      initFilter();
      initDownloadButtons();
      initDisabledGridButtons();
    }, 100);
  }
});