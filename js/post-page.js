/* ============================================================
   POST PAGE LOGIC
   - Baca ?id= dari URL
   - Cari artikel di BLOG_DATA
   - Render article lengkap + KaTeX
   - Render QUIZ (kalau artikel punya properti `quiz`)
   - Related articles
   - Views counter (localStorage)
   - Reading progress bar
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       CONFIG
       ============================================================ */
    const FACEBOOK_PROFILE_URL = 'https://www.facebook.com/yantho.rundy6';
    const PLACEHOLDER_IMG = 'images/blog/Video.png';

    // Mapping kategori — pakai bahasa Indonesia
    const CATEGORY_INFO = {
        berita: { label: 'Berita', color: '#3b82f6' },
        acara: { label: 'Acara', color: '#f59e0b' },
        prestasi: { label: 'Prestasi', color: '#ef4444' },
        kegiatan: { label: 'Kegiatan', color: '#8b5cf6' },
        workshop: { label: 'Workshop', color: '#06b6d4' },
        tips: { label: 'Tips', color: '#10b981' },
        pengalaman: { label: 'Pengalaman', color: '#ec4899' }
    };

    /* ============================================================
       HELPERS
       ============================================================ */
    function escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatDateLong(isoDate) {
        if (!isoDate) return '';
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const d = new Date(isoDate);
        if (isNaN(d.getTime())) return isoDate;
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    function getCategoryInfo(cat) {
        return CATEGORY_INFO[cat] || { label: 'Lainnya', color: '#64748b' };
    }

    function getInitials(name) {
        if (!name) return '?';
        const parts = String(name).trim().split(/\s+/);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }

    function getQueryParam(key) {
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    }

    function readingTime(text) {
        const plain = String(text || '').replace(/<[^>]+>/g, ' ');
        const words = plain.trim().split(/\s+/).filter(Boolean).length;
        const minutes = Math.max(1, Math.round(words / 200));
        return `${minutes} menit baca`;
    }

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html || '';
        return (tmp.textContent || tmp.innerText || '').trim();
    }

    /* ============================================================
       VIEWS COUNTER (localStorage)
       ============================================================ */
    function getViews(articleId) {
        const key = `skb_blog_views_${articleId}`;
        const stored = parseInt(localStorage.getItem(key), 10) || 0;
        const article = (typeof BLOG_DATA !== 'undefined') ?
            BLOG_DATA.find(a => a.id === articleId) : null;
        const base = (article && article.views) || 0;
        return base + stored;
    }

    function incrementViews(articleId) {
        const key = `skb_blog_views_${articleId}`;
        const viewedKey = `skb_blog_viewed_${articleId}`;

        if (localStorage.getItem(viewedKey)) {
            return getViews(articleId);
        }

        const current = parseInt(localStorage.getItem(key), 10) || 0;
        localStorage.setItem(key, current + 1);
        localStorage.setItem(viewedKey, '1');

        return getViews(articleId);
    }

    /* ============================================================
       RENDER ERROR
       ============================================================ */
    function renderError(title, message) {
        const container = document.getElementById('articleContainer');
        if (!container) return;

        document.title = 'Tidak Ditemukan | SMP Negeri Pulau Tiga';

        container.innerHTML = `
            <div class="error-state">
                <div class="error-state-icon">
                    <i class="fas fa-file-circle-question"></i>
                </div>
                <h1>${escapeHtml(title)}</h1>
                <p>${escapeHtml(message)}</p>
                <a href="blog.html" class="back-btn">
                    <i class="fas fa-arrow-left"></i>
                    Kembali ke Blog
                </a>
            </div>
        `;
    }

    /* ============================================================
       RENDER ARTICLE
       ============================================================ */
    function renderArticle(article) {
        const container = document.getElementById('articleContainer');
        if (!container) return;

        document.title = `${article.title} | SMP Negeri Pulau Tiga`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', article.excerpt || '');

        const views = incrementViews(article.id);
        const cat = getCategoryInfo(article.category);
        const initials = getInitials(article.author || 'Admin');
        const rt = readingTime(article.content || article.excerpt);
        const authorRole = article.authorRole || 'Kontributor';

        const tagsHtml = (article.tags || []).length
            ? `<div class="article-tags">
                   ${article.tags.map(t => `<span class="article-tag">${escapeHtml(t)}</span>`).join('')}
               </div>`
            : '';

        const shareUrl = window.location.href;
        const shareTitle = article.title;

        container.innerHTML = `
            <div class="article-container">

                <header class="article-header">
                    <span class="article-category" style="background: ${cat.color};">
                        ${escapeHtml(cat.label)}
                    </span>
                    <h1 class="article-title">${escapeHtml(article.title)}</h1>
                    <p class="article-lead">${escapeHtml(article.excerpt || '')}</p>

                    <div class="article-meta">
                        <div class="article-author">
                            <span class="article-author-avatar">${escapeHtml(initials)}</span>
                            <div class="article-author-info">
                                <span class="article-author-name">${escapeHtml(article.author || 'Admin')}</span>
                                <span class="article-author-role">${escapeHtml(authorRole)}</span>
                            </div>
                        </div>
                        <div class="article-meta-divider"></div>
                        <span class="article-meta-item">
                            <i class="fas fa-calendar"></i>
                            ${formatDateLong(article.date)}
                        </span>
                        <span class="article-meta-item">
                            <i class="fas fa-clock"></i>
                            ${rt}
                        </span>
                        <span class="article-meta-item">
                            <i class="fas fa-eye"></i>
                            ${views} views
                        </span>
                    </div>
                </header>

                <figure class="article-cover">
                    <img src="${escapeHtml(article.thumbnail || PLACEHOLDER_IMG)}"
                         alt="${escapeHtml(article.title)}"
                         loading="eager"
                         onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';">
                </figure>

                <div class="article-content" id="articleBody">
                    ${article.content || '<p>Konten tidak tersedia.</p>'}
                </div>

                ${tagsHtml}

                <div class="article-share">
                    <span class="article-share-label">Bagikan artikel ini</span>
                    <div class="article-share-buttons">
                        <a class="share-btn"
                           href="https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}"
                           target="_blank" rel="noopener" aria-label="Share to WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                        <a class="share-btn"
                           href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}"
                           target="_blank" rel="noopener" aria-label="Share to Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a class="share-btn"
                           href="https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}"
                           target="_blank" rel="noopener" aria-label="Share to Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <button class="share-btn" type="button" id="copyLinkBtn" aria-label="Copy link">
                            <i class="fas fa-link"></i>
                        </button>
                    </div>
                </div>

                <div class="article-bottom">
                    <a href="blog.html" class="back-btn">
                        <i class="fas fa-arrow-left"></i>
                        Kembali ke semua artikel
                    </a>
                </div>

            </div>
        `;

        // Bind copy link
        const copyBtn = document.getElementById('copyLinkBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                const original = copyBtn.innerHTML;
                navigator.clipboard.writeText(shareUrl).then(() => {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => { copyBtn.innerHTML = original; }, 1500);
                }).catch(() => {
                    const tmp = document.createElement('textarea');
                    tmp.value = shareUrl;
                    document.body.appendChild(tmp);
                    tmp.select();
                    try { document.execCommand('copy'); } catch (e) { }
                    document.body.removeChild(tmp);
                    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => { copyBtn.innerHTML = original; }, 1500);
                });
            });
        }

        // Render KaTeX
        const bodyEl = document.getElementById('articleBody');
        if (bodyEl) {
            renderKatexWhenReady(bodyEl);
        }

        // ✅ RENDER QUIZ — kalau artikel punya properti quiz
        if (article.quiz && article.quiz.questions && article.quiz.questions.length > 0) {
            renderQuiz(article.quiz);
        } else {
            const quizContainer = document.getElementById('quizContainer');
            if (quizContainer) quizContainer.style.display = 'none';
        }

        // Render related articles
        renderRelated(article);
    }

    /* ============================================================
       QUIZ RENDERER
       ============================================================ */
    function renderQuiz(quizData) {
        const container = document.getElementById('quizContainer');
        if (!container) return;

        if (!quizData || !quizData.questions || quizData.questions.length === 0) {
            container.style.display = 'none';
            return;
        }

        const title = quizData.title || 'Uji Pemahamanmu';
        const desc = quizData.description || 'Jawab soal berikut untuk menguji pemahamanmu.';
        const questions = quizData.questions;

        // Build soal
        let questionsHTML = '';
        questions.forEach((q, idx) => {
            const num = idx + 1;
            let optionsHTML = '';
            q.options.forEach((opt, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                optionsHTML += `
                    <label class="quiz-option">
                        <input type="radio" name="q${num}" value="${optIdx}">
                        <span>${letter}. ${escapeHtml(opt)}</span>
                    </label>
                `;
            });

            questionsHTML += `
                <div class="quiz-question">
                    <div class="quiz-question-header">
                        <span class="quiz-question-number">${num}</span>
                        <p class="quiz-question-text">${escapeHtml(q.question)}</p>
                    </div>
                    <div class="quiz-options">
                        ${optionsHTML}
                    </div>
                </div>
            `;
        });

        container.innerHTML = `
            <div class="quiz-wrapper">
                <div class="quiz-section">
                    <div class="quiz-header">
                        <div class="quiz-header-icon">
                            <i class="fas fa-question"></i>
                        </div>
                        <div>
                            <h3 class="quiz-title">${escapeHtml(title)}</h3>
                            <span class="quiz-subtitle">Quiz Interaktif</span>
                        </div>
                    </div>
                    <p class="quiz-desc">${escapeHtml(desc)}</p>

                    <form id="quizForm">
                        ${questionsHTML}

                        <div class="quiz-actions">
                            <button type="button" class="quiz-submit-btn" id="quizSubmitBtn">
                                <i class="fab fa-facebook"></i>
                                Kirim Jawaban ke Facebook
                            </button>
                            <button type="button" class="quiz-reset-btn" id="quizResetBtn">
                                <i class="fas fa-redo"></i>
                                Ulangi
                            </button>
                        </div>

                        <p class="quiz-note">
                            <i class="fas fa-info-circle"></i>
                            <span>Jawabanmu akan otomatis tersalin. Setelah Facebook terbuka, tinggal tempel (paste) di kolom komentar atau pesan.</span>
                        </p>

                        <div class="quiz-score" id="quizScore"></div>
                    </form>
                </div>
            </div>
        `;

        container.style.display = 'block';

        // ===== QUIZ LOGIC =====
        const form = document.getElementById('quizForm');
        const submitBtn = document.getElementById('quizSubmitBtn');
        const resetBtn = document.getElementById('quizResetBtn');
        const scoreBox = document.getElementById('quizScore');
        const toast = document.getElementById('quizToast');

        function showToast(message, duration = 3000) {
            if (!toast) return;
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), duration);
        }

        submitBtn.addEventListener('click', async function () {
            const formData = new FormData(form);
            const total = questions.length;
            let answered = 0;
            let correct = 0;
            const userAnswers = [];

            for (let i = 0; i < total; i++) {
                const num = i + 1;
                const val = formData.get('q' + num);
                if (val !== null) {
                    answered++;
                    const answerIdx = parseInt(val, 10);
                    userAnswers.push(answerIdx);
                    if (answerIdx === questions[i].answer) correct++;
                } else {
                    userAnswers.push(null);
                }
            }

            if (answered < total) {
                showToast(`Masih ada ${total - answered} soal yang belum dijawab.`);
                return;
            }

            const score = Math.round((correct / total) * 100);

            scoreBox.classList.remove('good', 'average', 'low');
            if (score >= 80) {
                scoreBox.classList.add('good');
                scoreBox.innerHTML = `🎉 Hebat! Skor kamu: <strong>${correct}/${total} (${score})</strong>`;
            } else if (score >= 60) {
                scoreBox.classList.add('average');
                scoreBox.innerHTML = `👍 Bagus! Skor kamu: <strong>${correct}/${total} (${score})</strong>`;
            } else {
                scoreBox.classList.add('low');
                scoreBox.innerHTML = `💪 Semangat! Skor kamu: <strong>${correct}/${total} (${score})</strong>`;
            }
            scoreBox.classList.add('show');

            // Buat teks jawaban
            let answerText = `Jawaban Quiz — ${document.title}\n\n`;
            userAnswers.forEach((ans, idx) => {
                const letter = ans !== null ? String.fromCharCode(65 + ans) : '-';
                answerText += `${idx + 1}. ${letter}\n`;
            });
            answerText += `\nSkor: ${correct}/${total} (${score})`;

            // Copy ke clipboard
            try {
                await navigator.clipboard.writeText(answerText);
                showToast('✅ Jawaban tersalin! Facebook akan terbuka...');
            } catch (err) {
                const textarea = document.createElement('textarea');
                textarea.value = answerText;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast('✅ Jawaban tersalin! Facebook akan terbuka...');
            }

            // Buka Facebook
            setTimeout(() => {
                window.open(FACEBOOK_PROFILE_URL, '_blank');
            }, 1000);
        });

        resetBtn.addEventListener('click', function () {
            form.reset();
            scoreBox.classList.remove('show', 'good', 'average', 'low');
            showToast('Quiz direset. Silakan coba lagi.');
        });
    }

    /* ============================================================
       KATEX RENDERER
       ============================================================ */
    function renderKatexWhenReady(rootEl) {
        function tryRender() {
            if (typeof renderMathInElement !== 'undefined') {
                try {
                    renderMathInElement(rootEl, {
                        delimiters: [
                            { left: '$$', right: '$$', display: true },
                            { left: '$', right: '$', display: false },
                            { left: '\\[', right: '\\]', display: true },
                            { left: '\\(', right: '\\)', display: false }
                        ],
                        throwOnError: false
                    });
                } catch (e) {
                    console.warn('KaTeX render error:', e);
                }
            } else {
                setTimeout(tryRender, 100);
            }
        }
        tryRender();
    }

    /* ============================================================
       RELATED ARTICLES
       ============================================================ */
    function renderRelated(currentArticle) {
        const container = document.getElementById('relatedContainer');
        if (!container || typeof BLOG_DATA === 'undefined') return;

        let related = BLOG_DATA
            .filter(a => a.id !== currentArticle.id)
            .filter(a => a.category === currentArticle.category);

        if (related.length < 3) {
            const others = BLOG_DATA
                .filter(a => a.id !== currentArticle.id)
                .filter(a => a.category !== currentArticle.category);
            related = [...related, ...others].slice(0, 3);
        } else {
            related = related.slice(0, 3);
        }

        if (related.length === 0) return;

        const cards = related.map(a => {
            const cat = getCategoryInfo(a.category);
            return `
                <a class="related-card" href="post.html?id=${encodeURIComponent(a.id)}">
                    <div class="related-image">
                        <img src="${escapeHtml(a.thumbnail || PLACEHOLDER_IMG)}"
                             alt="${escapeHtml(a.title)}"
                             loading="lazy"
                             onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';">
                    </div>
                    <div class="related-body">
                        <span class="related-cat" style="color: ${cat.color};">
                            ${escapeHtml(cat.label)}
                        </span>
                        <h4>${escapeHtml(a.title)}</h4>
                        <span class="related-date">
                            <i class="fas fa-calendar"></i>
                            ${formatDateLong(a.date)}
                        </span>
                    </div>
                </a>
            `;
        }).join('');

        container.innerHTML = `
            <section class="related-section">
                <h2 class="related-title">
                    <i class="fas fa-book-open"></i>
                    Artikel Terkait
                </h2>
                <div class="related-grid">
                    ${cards}
                </div>
            </section>
        `;
    }

    /* ============================================================
       READING PROGRESS BAR
       ============================================================ */
    function initReadingProgress() {
        const bar = document.getElementById('readingProgress');
        if (!bar) return;

        function updateProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    /* ============================================================
       BOOT
       ============================================================ */
    function boot() {
        if (typeof BLOG_DATA === 'undefined') {
            renderError('Data tidak dimuat', 'Data blog tidak dapat dimuat. Silakan refresh halaman.');
            console.error('❌ BLOG_DATA tidak ditemukan.');
            return;
        }

        const id = getQueryParam('id');
        if (!id) {
            renderError('Tidak ada artikel dipilih', 'Silakan pilih artikel dari halaman blog.');
            return;
        }

        const article = BLOG_DATA.find(a => a.id === id);
        if (!article) {
            renderError('Artikel tidak ditemukan', `Artikel dengan ID "${id}" tidak tersedia atau sudah dihapus.`);
            return;
        }

        renderArticle(article);
        initReadingProgress();

        console.log(`✅ Article rendered: ${article.title}`);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();