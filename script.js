// ===== 语言切换（中文 / EN），记忆偏好 =====
const body = document.body;
const langButtons = document.querySelectorAll('.lang-btn');

function setLang(lang) {
  body.classList.toggle('lang-zh', lang === 'zh');
  body.classList.toggle('lang-en', lang === 'en');
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  langButtons.forEach((b) => {
    const active = b.dataset.lang === lang;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', String(active));
  });
  try { localStorage.setItem('siteLang', lang); } catch (e) {}
  document.title = lang === 'en'
    ? 'Jerry Hu — Director of Curriculum & Instruction · IB Educator'
    : '胡叶涛 Jerry Hu — 课程教学总监 · IB 教育者';
}

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

// 初始化：优先读取记忆的语言，否则按浏览器语言
let savedLang = null;
try { savedLang = localStorage.getItem('siteLang'); } catch (e) {}
if (savedLang === 'en' || savedLang === 'zh') {
  setLang(savedLang);
} else {
  setLang((navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en');
}

// ===== 横向栏目 Tab 切换 =====
const tabButtons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');

function activateTab(name, scroll = false) {
  tabButtons.forEach((b) => {
    const active = b.dataset.tab === name;
    b.classList.toggle('active', active);
    b.setAttribute('aria-selected', String(active));
  });
  panels.forEach((p) => {
    const active = p.id === `panel-${name}`;
    p.classList.toggle('active', active);
    // 切换后触发该面板内元素的入场动画
    if (active) {
      p.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
        requestAnimationFrame(() => el.classList.add('visible'));
      });
    }
  });
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

// 页面内指向其他栏目的链接（如"了解我的工作""查看现场照片"）
document.querySelectorAll('a[data-tab]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    activateTab(link.dataset.tab, true);
  });
});

// ===== 导航滚动阴影 =====
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

// ===== 入场动画 =====
const revealTargets = document.querySelectorAll(
  '.section-heading, .about-body, .hero-copy, .hero-portrait, .stats-bar, .contact-inner, .profile-photo, .ib-card, .ib-feature, .ib-note, .timeline-item, .edu-card, .cred-item, .quote-card, .reference-note'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('visible'));
}

// 首屏面板立即可见
document.querySelectorAll('#panel-overview .reveal').forEach((el) => el.classList.add('visible'));

// ===== 首页底部：照片左右轮播 =====
(function initGallery() {
  const root = document.getElementById('galleryCarousel');
  if (!root) return;
  const track = root.querySelector('.gallery-track');
  const slides = Array.from(root.querySelectorAll('.gallery-slide'));
  const dots = Array.from(root.querySelectorAll('.gallery-dot'));
  const counter = root.querySelector('.gallery-current');
  const total = slides.length;
  let idx = 0;

  function show(n) {
    idx = (n + total) % total;
    track.style.transform = 'translateX(' + (-idx * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    if (counter) counter.textContent = String(idx + 1);
  }

  root.querySelector('.gallery-prev').addEventListener('click', () => show(idx - 1));
  root.querySelector('.gallery-next').addEventListener('click', () => show(idx + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => show(i)));

  // 键盘左右键（仅当概览面板可见时响应）
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('panel-overview').classList.contains('active')) return;
    if (e.key === 'ArrowLeft') { show(idx - 1); }
    else if (e.key === 'ArrowRight') { show(idx + 1); }
  });

  // 触摸滑动
  let startX = null;
  const viewport = root.querySelector('.gallery-viewport');
  viewport.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
})();

// 年份
document.getElementById('year').textContent = new Date().getFullYear();
