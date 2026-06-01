(() => {
  if (location.pathname !== '/goods/goods_view.php') return;

  const start = () => {
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      const big = document.querySelector('.item_photo_big');
      const wrap = big && (big.querySelector('.img_photo_big') || big);
      const thumbs = [].slice.call(document.querySelectorAll('.slider_goods_nav a'))
        .filter((a) => /gd_change_image/.test(a.getAttribute('href') || '') && !a.closest('.slick-cloned'));
      if (big && wrap && thumbs.length >= 2) {
        clearInterval(timer);
        init(big, wrap, thumbs);
      } else if (tries > 80) {
        clearInterval(timer);
      }
    }, 150);
  };

  const init = (big, wrap, thumbs) => {
    if (big.dataset.galleryReady) return;
    big.dataset.galleryReady = '1';

    if (innerWidth <= 1200 && window.jQuery) {
      const nav = jQuery('.slider_goods_nav');
      if (nav.length && jQuery.fn.slick && nav.hasClass('slick-initialized')) {
        try { nav.slick('unslick'); } catch (e) {}
      }
    }

    const total = thumbs.length;
    const keyIdx = {};
    thumbs.forEach((a, i) => {
      const m = (a.getAttribute('href') || '').match(/gd_change_image\(\s*'([^']+)'/);
      if (m) keyIdx[m[1]] = i;
    });

    wrap.style.position = 'relative';
    wrap.style.display = 'block';
    wrap.style.textAlign = 'center';

    const dots = document.createElement('div');
    dots.style.cssText = 'position:absolute;left:0;right:0;bottom:14px;display:flex;justify-content:center;gap:8px;z-index:5;pointer-events:none';
    for (let i = 0; i < total; i++) {
      dots.insertAdjacentHTML('beforeend', '<i style="width:8px;height:8px;border-radius:50%;background:rgba(0,0,0,.25);box-shadow:0 0 3px rgba(0,0,0,.25);transition:background .25s,transform .25s;display:block"></i>');
    }
    wrap.appendChild(dots);
    const dotEls = dots.querySelectorAll('i');

    let cur = 0;
    const paint = () => dotEls.forEach((d, j) => {
      d.style.background = j === cur ? '#F63237' : 'rgba(0,0,0,.25)';
      d.style.transform = j === cur ? 'scale(1.25)' : 'none';
    });
    paint();

    const goTo = (n) => {
      if (n < 0) n = total - 1;
      if (n >= total) n = 0;
      const key = Object.keys(keyIdx).find((k) => keyIdx[k] === n);
      if (key != null && typeof window.gd_change_image === 'function') window.gd_change_image(key, 'detail');
    };
    dotEls.forEach((d, i) => {
      d.style.pointerEvents = 'auto';
      d.style.cursor = 'pointer';
      d.addEventListener('click', () => goTo(i));
    });

    const animate = (dir) => {
      const img = wrap.querySelector('img');
      if (!img || !dir) return;
      img.style.transition = 'none';
      img.style.transform = `translateX(${dir * 40}px)`;
      img.style.opacity = '0';
      requestAnimationFrame(() => {
        img.style.transition = 'transform .3s ease,opacity .3s ease';
        img.style.transform = 'translateX(0)';
        img.style.opacity = '1';
      });
    };
    const setActive = (i) => {
      if (i == null || i === cur) return;
      const dir = i > cur ? 1 : -1;
      cur = i;
      paint();
      animate(dir);
    };

    if (typeof window.gd_change_image === 'function' && !window.__gci) {
      window.__gci = window.gd_change_image;
      window.gd_change_image = function (key, type) {
        const r = window.__gci.apply(this, arguments);
        try { if (type === 'detail' && keyIdx[key] != null) setActive(keyIdx[key]); } catch (e) {}
        return r;
      };
    }

    if (!big.dataset.gallerySwipe) {
      big.dataset.gallerySwipe = '1';
      big.style.touchAction = 'pan-y';
      big.style.userSelect = 'none';
      big.addEventListener('dragstart', (e) => e.preventDefault());
      let x0 = null, y0 = null;
      big.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; });
      big.addEventListener('pointerup', (e) => {
        if (x0 == null) return;
        const dx = e.clientX - x0, dy = e.clientY - y0;
        x0 = null;
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
        goTo(dx < 0 ? cur + 1 : cur - 1);
      });
      big.addEventListener('pointercancel', () => { x0 = null; });
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
