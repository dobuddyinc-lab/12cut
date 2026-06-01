const custom={
  isReserve:gno=>(ui.gdEtc[gno]?.catecd||'').indexOf('001004')>-1,
  main:({parseList,lang,setGdEtc,setPrice,setGoodsList})=>{
    // 네이티브 홈: main/index.html이 랜딩을 직접 렌더(iframe 미사용). dev=1은 편집기 미리보기 유지.
    if(location.search.includes('dev=1')) return wrap.innerHTML=`<iframe src="/dobuddy/12cut/12cutEditor.html" style="position:fixed;inset:0;width:100%;height:100%;border:none"></iframe>`;
    $('.nav__right').append(`<a href='javascript:' onclick=location='/mypage/index.php'>MY</a>`);
    $(`[data-lang="${localStorage.$mylang||navigator.language.slice(0,2)}"]`).click();
    $('[data-lang]').each((i,e)=>e.addEventListener('click',_=>localStorage.$mylang=['en','ko','ja','zh'][i]));
  },
  beforeRun:_=>{
  },
  afterRun:_=>{
    $('#sel_currency option,#sel_lang option').removeAttr('disabled');
    switch(location.pathname){
      case '/order/order.php':
        $('[name="bankSender"]').val($('[name="orderName"]').val());
        $('[name="bankAccount"]').val(1);
        break;
      case '/order/order_end.php':
        fetch('https://img.12cut.net/api.php',{body:`type=12cut_order&o=${location.search.split('orderNo=')[1].split('&')[0]}&c=${sessionStorage.getItem('cartSno')}`,headers:{'Content-Type':'application/x-www-form-urlencoded'},method:'POST'});
        break;
      case '/mypage/order_list.php':
        $('.cart-div a[href]').toArray().forEach(e=>{e.href=e.firstChild.src.replace('_thumb','');e.download='12cut.png'});
        break;
      case '/goods/goods_view.php':
        $('.item_info_box .hide').off('click').click(_=>ui.clk('.ord-box .primary'));
        const setBtn=e=>e.attr('style','background-color:#F63237!important;border-color:#F63237').off('click').attr('onclick','').text($t('스토리 만들기'))
        .click(_=>{
          if(innerWidth<=430 || innerWidth*1.5<innerHeight) wrap.insertAdjacentHTML('beforeEnd',`<iframe src="/dobuddy/12cut/12cutEditor.html" style="z-index:101;animation:.5s slide-up;background:#fff;position:fixed;inset:0;margin:0 auto;width:100%;height:100%;border:none"></iframe>`);
          else wrap.insertAdjacentHTML('beforeEnd',`<div style="background-color:rgba(0,0,0,.5);z-index:101;position:fixed;inset:0"><iframe src="/dobuddy/12cut/12cutEditor.html" style="animation:.5s slide-up;background:#fff;position:fixed;inset:0;margin:0 auto;aspect-ratio:.5;height:100%;border:none"></iframe></div>`);
          window.closeEditor=_=>wrap.removeChild(wrap.lastChild);
        })
        setBtn($('.ord-box .primary'));
        setTimeout(_=>setBtn($('.sticky-order .primary')),500);

        // gallary 관련 커스텀
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
        start();
        break;
    }
  }
}
$(_=>{
  $('.menus').hide();
});
