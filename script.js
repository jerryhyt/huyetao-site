// 导航滚动阴影
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

// 移动端菜单
const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// 入场动画
const revealTargets = document.querySelectorAll(
  '.section-heading, .about-body, .focus-card, .program-card, .journey-item, .hero-copy, .hero-portrait, .stats-bar, .contact-inner, .profile-photo, .role-card, .ib-card, .timeline-item, .edu-card, .cred-item, .gallery-item'
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
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('visible'));
}

// 年份
document.getElementById('year').textContent = new Date().getFullYear();
