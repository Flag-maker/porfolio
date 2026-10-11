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

// ============ 图片灯箱（支持同组切换） ============
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const counter = lightbox.querySelector('.lightbox-counter');

  let group = [];
  let index = 0;

  const render = () => {
    if (!group.length) return;
    const img = group[index];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    if (counter) counter.textContent = (index + 1) + ' / ' + group.length;
    lightbox.classList.toggle('has-multi', group.length > 1);
  };

  const open = (img) => {
    const gallery = img.closest('.intern-gallery');
    if (gallery) {
      group = Array.from(gallery.querySelectorAll('img'));
    } else {
      group = [img];
    }
    index = group.indexOf(img);
    if (index < 0) index = 0;
    render();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('active', 'has-multi');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 260);
  };

  const prev = () => {
    if (group.length < 2) return;
    index = (index - 1 + group.length) % group.length;
    render();
  };

  const next = () => {
    if (group.length < 2) return;
    index = (index + 1) % group.length;
    render();
  };

  document.querySelectorAll('.card img, .project-visual img, .design-visual img, .intern-gallery img').forEach(img => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      open(img);
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      close();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
})();

// ============ 回到顶部 ============
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggleVisible = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleVisible, { passive: true });
  toggleVisible();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ============ 滚动位置恢复 ============
(function initScrollRestore() {
  const KEY = 'portfolio-scroll-y';

  // 离开页面前保存当前位置
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem(KEY, window.scrollY);
  });

  // 返回页面时恢复
  window.addEventListener('load', () => {
    const saved = sessionStorage.getItem(KEY);
    if (saved !== null) {
      const y = parseInt(saved, 10);
      if (!isNaN(y) && y > 0) {
        // 等页面渲染完成再滚
        requestAnimationFrame(() => {
          window.scrollTo(0, y);
        });
      }
    }
  });
})();