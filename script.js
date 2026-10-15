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
        setTimeout(() => cell.classList.add('entered'), index * 80);
        observer.unobserve(cell);
      }
    });
  }, { threshold: 0.1 });

  cells.forEach(cell => observer.observe(cell));
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

// ============ 图片灯箱（支持同组切换 + 返回键关闭 + 视频自动播放） ============
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxVideo = lightbox.querySelector('.lightbox-video');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const counter = lightbox.querySelector('.lightbox-counter');

  let group = [];
  let index = 0;
  let historyPushed = false;

  const render = () => {
    if (!group.length) return;
    const img = group[index];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    if (counter) counter.textContent = (index + 1) + ' / ' + group.length;
    lightbox.classList.toggle('has-multi', group.length > 1);
  };

  const findGroup = (img) => {
    const dataGallery = img.closest('[data-gallery]');
    if (dataGallery) {
      return Array.from(dataGallery.querySelectorAll('img'));
    }
    const internGallery = img.closest('.intern-gallery');
    if (internGallery) {
      return Array.from(internGallery.querySelectorAll('img'));
    }
    const courtyardGallery = img.closest('.courtyard-gallery');
    if (courtyardGallery) {
      return Array.from(courtyardGallery.querySelectorAll('img'));
    }
    return [img];
  };

  const pushHistory = () => {
    history.pushState({ lightbox: true }, '');
    historyPushed = true;
  };

  const open = (img) => {
    lightbox.classList.remove('video-mode');
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');

    group = findGroup(img);
    index = group.indexOf(img);
    if (index < 0) index = 0;
    render();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    pushHistory();
  };

  const openVideo = (src) => {
    lightbox.classList.remove('has-multi');
    lightbox.classList.add('video-mode');
    lightboxVideo.src = src;
    lightboxVideo.currentTime = 0;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    pushHistory();

    // 自动播放（muted 时浏览器允许自动播放）
    const playPromise = lightboxVideo.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {});
    }
  };

  const close = (viaBack = false) => {
    if (!lightbox.classList.contains('active')) return;
    lightbox.classList.remove('active', 'has-multi', 'video-mode');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxVideo.pause();
    setTimeout(() => {
      lightboxImg.src = '';
      lightboxVideo.removeAttribute('src');
    }, 260);

    if (!viaBack && historyPushed) {
      historyPushed = false;
      history.back();
    } else {
      historyPushed = false;
    }
  };

  const prev = () => {
    if (lightbox.classList.contains('video-mode')) return;
    if (group.length < 2) return;
    index = (index - 1 + group.length) % group.length;
    render();
  };

  const next = () => {
    if (lightbox.classList.contains('video-mode')) return;
    if (group.length < 2) return;
    index = (index + 1) % group.length;
    render();
  };

  document.querySelectorAll('.card img, .project-visual img, .design-visual img, .intern-gallery img, .courtyard-gallery img').forEach(img => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      open(img);
    });
  });

  document.querySelectorAll('.video-trigger').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openVideo(a.dataset.video);
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  if (closeBtn) closeBtn.addEventListener('click', () => close());
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  window.addEventListener('popstate', () => {
    if (lightbox.classList.contains('active')) {
      close(true);
    }
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

  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem(KEY, window.scrollY);
  });

  window.addEventListener('load', () => {
    const saved = sessionStorage.getItem(KEY);
    if (saved !== null) {
      const y = parseInt(saved, 10);
      if (!isNaN(y) && y > 0) {
        requestAnimationFrame(() => {
          window.scrollTo(0, y);
        });
      }
    }
  });
})();