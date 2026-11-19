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
  '.section-heading, .about-body, .hero-copy, .hero-portrait, .stats-bar, .contact-inner, .profile-photo, .role-card, .ib-card, .ib-feature, .ib-note, .timeline-item, .edu-card, .cred-item, .gallery-item'
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

// 年份
document.getElementById('year').textContent = new Date().getFullYear();
