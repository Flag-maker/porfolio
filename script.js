// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// 首页格子入场动画
const cells = document.querySelectorAll('.cell');
if (cells.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cell = entry.target;
        const index = Array.from(cells).indexOf(cell);
        cell.style.opacity = '1';
        cell.style.transform = 'translateY(0)';
        cell.style.transition =
          `opacity 0.8s ease ${index * 0.08}s, transform 0.8s ease ${index * 0.08}s, background 0.5s ease`;
        observer.unobserve(cell);
      }
    });
  }, { threshold: 0.1 });

  cells.forEach(cell => {
    cell.style.opacity = '0';
    cell.style.transform = 'translateY(20px)';
    observer.observe(cell);
  });
}

// 鼠标移动时角落装饰轻微跟随
const landing = document.querySelector('.landing');
const corners = document.querySelectorAll('.landing-corner');
if (landing && corners.length) {
  landing.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    corners.forEach(c => {
      c.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}