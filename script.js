/* ============================================
   InfiniteUrban — Project Page Scripts
   ============================================ */

(() => {
  'use strict';

  /* ---------- Nav scrolled state ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    const toTop = document.getElementById('toTop');
    if (window.scrollY > 600) toTop.classList.add('show');
    else toTop.classList.remove('show');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- To-top button ---------- */
  document.getElementById('toTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Reveal-on-scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ---------- Animated counter for stats ---------- */
  const animateNumber = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(target * eased);
      el.textContent = val.toLocaleString() + (t === 1 ? suffix : '');
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateNumber(e.target);
        statObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stat-num').forEach((el) => statObserver.observe(el));

  /* ---------- Copy BibTeX ---------- */
  const copyBibBtn = document.getElementById('copyBib');
  if (copyBibBtn) {
    copyBibBtn.addEventListener('click', async () => {
      const text = document.getElementById('bibText').innerText;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      copyBibBtn.classList.add('copied');
      const original = copyBibBtn.innerHTML;
      copyBibBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        copyBibBtn.classList.remove('copied');
        copyBibBtn.innerHTML = original;
      }, 1600);
    });
  }

  /* ---------- Copy extraction code ---------- */
  const copyCode = document.getElementById('copyCode');
  if (copyCode) {
    copyCode.addEventListener('click', async () => {
      const code = 'pf32';
      try { await navigator.clipboard.writeText(code); } catch {}
      const original = copyCode.innerHTML;
      copyCode.innerHTML = '<i class="fas fa-check"></i> Copied: pf32';
      setTimeout(() => { copyCode.innerHTML = original; }, 1600);
    });
  }

  /* ---------- Marquee: duplicate items for a seamless loop ---------- */
  document.querySelectorAll('[data-marquee]').forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- Carousels (overview + 13 channels) ---------- */
  const GAP = 16;
  const initCarousel = (root) => {
    const viewport = root.querySelector('.carousel-viewport');
    const track = root.querySelector('.carousel-track');
    const slides = Array.from(root.querySelectorAll('.c-slide'));
    const prev = root.querySelector('.c-prev');
    const next = root.querySelector('.c-next');
    const dotsBox = root.querySelector('.c-dots');
    const basePer = parseInt(root.dataset.perView, 10) || 1;
    const autoMs = parseInt(root.dataset.autoplay, 10) || 0;
    if (!viewport || !track || !slides.length) return;

    let index = 0, perView = basePer, maxIndex = 0, step = 0, timer = null;

    const getPerView = () => {
      const w = window.innerWidth;
      if (w <= 560) return Math.min(1, basePer);
      if (w <= 900) return Math.min(2, basePer);
      if (w <= 1200) return Math.min(3, basePer);
      return basePer;
    };
    const buildDots = () => {
      if (!dotsBox) return;
      dotsBox.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.addEventListener('click', () => { index = i; render(); restart(); });
        dotsBox.appendChild(b);
      }
    };
    const updateDots = () => {
      if (!dotsBox) return;
      Array.from(dotsBox.children).forEach((d, i) => d.classList.toggle('active', i === index));
    };
    const render = () => {
      track.style.transform = `translateX(${-index * step}px)`;
      updateDots();
    };
    const layout = () => {
      perView = getPerView();
      maxIndex = Math.max(0, slides.length - perView);
      if (index > maxIndex) index = maxIndex;
      const vw = viewport.clientWidth;
      const slideW = (vw - (perView - 1) * GAP) / perView;
      slides.forEach((s) => { s.style.width = slideW + 'px'; });
      step = slideW + GAP;
      buildDots();
      render();
    };
    const go = (dir) => {
      if (dir > 0) index = index >= maxIndex ? 0 : index + 1;
      else index = index <= 0 ? maxIndex : index - 1;
      render();
    };
    const start = () => { if (autoMs && maxIndex > 0 && !timer) timer = setInterval(() => go(1), autoMs); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const restart = () => { stop(); start(); };

    if (prev) prev.addEventListener('click', () => { go(-1); restart(); });
    if (next) next.addEventListener('click', () => { go(1); restart(); });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    let resizeT;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(layout, 120);
    });

    layout();
    start();
  };
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);

  /* ---------- Lightbox: click any .zoomable image to enlarge ---------- */
  const lb = document.getElementById('lightbox');
  if (lb) {
    const lbImg = lb.querySelector('.lb-img');
    const lbCap = lb.querySelector('.lb-cap');
    const closeLb = () => {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      lbImg.src = '';
    };
    const openLb = (src, cap) => {
      lbImg.src = src;
      lbCap.textContent = cap || '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    };
    document.addEventListener('click', (e) => {
      const img = e.target.closest('img.zoomable');
      if (img) {
        const fig = img.closest('figure');
        const capEl = fig ? fig.querySelector('figcaption') : null;
        const cap = (capEl ? capEl.textContent : img.alt) || '';
        openLb(img.currentSrc || img.src, cap.trim());
        return;
      }
      if (e.target === lb || e.target.closest('.lb-close')) closeLb();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLb();
    });
  }

  /* ============================================
     Particle background — lightweight stars/lines
     ============================================ */
  const canvas = document.getElementById('particles');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let W, H, dpr;
  let particles = [];
  const COUNT = 70;
  const MAX_DIST = 130;
  let mouse = { x: -9999, y: -9999 };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const init = () => {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.4,
      });
    }
  };

  const step = () => {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      const dxm = p.x - mouse.x;
      const dym = p.y - mouse.y;
      const dm2 = dxm * dxm + dym * dym;
      if (dm2 < 14000) {
        const f = 0.0009;
        p.vx += dxm * f / 60;
        p.vy += dym * f / 60;
      }
      p.vx = Math.max(-0.9, Math.min(0.9, p.vx));
      p.vy = Math.max(-0.9, Math.min(0.9, p.vy));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180, 170, 255, 0.55)';
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MAX_DIST * MAX_DIST) {
          const alpha = 1 - Math.sqrt(d2) / MAX_DIST;
          ctx.strokeStyle = `rgba(124, 92, 255, ${alpha * 0.18})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  window.addEventListener('resize', () => { resize(); init(); });

  resize();
  init();
  step();
})();
