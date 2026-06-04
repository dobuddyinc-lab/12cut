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
    if(!document.querySelector('link[href*="pretendardvariable"]')){var l=document.createElement('link');l.rel='stylesheet';l.href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';document.head.appendChild(l);}
  },
  afterRun:_=>{
    $('a[href*="join_method"]').attr('href','/member/join_agreement.php?memberFl=personal');
    $('.top_member_box a[href*="order/cart.php"]').attr('href','/order/cart.php');
    $('#sel_currency option,#sel_lang option').removeAttr('disabled');
    var _cl=localStorage.$mylang||navigator.language.slice(0,2);$('body').removeClass('ko en ja zh').addClass(_cl);
    var _ff={en:["'Nunito'",'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap'],ja:["'Zen Maru Gothic'",'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700;900&display=swap'],zh:["'ZCOOL KuaiLe'",'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap']}[_cl];
    if(_ff){var _s=document.createElement('style');_s.textContent='@import url("'+_ff[1]+'");body,body *{font-family:'+_ff[0]+",'Pretendard Variable','Pretendard',sans-serif!important}";document.head.appendChild(_s);}
    var _hdrBack={'/member/login.php':['로그인','/'],'/member/join_agreement.php':['회원가입','/member/login.php'],'/member/find_id.php':['아이디 찾기','/member/login.php'],'/member/find_password.php':['비밀번호 찾기','/member/login.php']}[location.pathname];
    if(_hdrBack){$('.header_top').attr('data-h',$t(_hdrBack[0]));$('.header_top').off('click.hdr').on('click.hdr',function(e){if(this.dataset.h&&innerWidth<851&&e.offsetX<34&&!$(e.target).closest('a,button,input,select,label').length){e.stopImmediatePropagation();location.href=_hdrBack[1];}});}
    switch(location.pathname){
      case '/member/join_agreement.php':
        setTimeout(()=>{
          $('#btnPrevStep').off('click').on('click',function(e){e.preventDefault();location.href='/member/login.php';});
          if(!$('.agree_headline').length){$('.join_agreement_cont').first().before('<h2 class="agree_headline">'+$t('12cut 이용을 위한')+'<br>'+$t('약관에 동의해주세요.')+'</h2>');}
          $('.js_terms_view').each(function(){var $b=$(this);$b.find('.form_element').css('cursor','pointer').off('click.acc').on('click.acc',function(e){if($(e.target).closest('input,label,a').length)return;$b.toggleClass('open');});});
          var _syncBtn=function(){var ok=$(':checkbox.require','#formTerms').length&&!$(':checkbox.require:not(:checked)','#formTerms').length;$('#btnNextStep').toggleClass('btn--disabled',!ok);};
          $(':checkbox','#formTerms').on('change',_syncBtn);_syncBtn();
        },300);
        break;
      case '/member/join.php':
        setTimeout(()=>{
          $('.header_top').attr('data-h',$t('회원가입'));
          $('.header_top').off('click').on('click',function(e){if(this.dataset.h&&innerWidth<851&&e.offsetX<34&&!$(e.target).closest('a,button,input,select,label').length){e.preventDefault();location.href='/member/join_agreement.php?memberFl=personal';}});
          $('#formJoin .f .btns .primary').text($t('확인'));
          $('#formJoin .f input[name="zonecode"]').attr('placeholder',$t('우편번호'));
          $('#formJoin .f input[name="address"]').attr('placeholder',$t('도로명 주소 검색'));
          $('#formJoin .f input[name="addressSub"]').attr('placeholder',$t('상세 주소를 입력해 주세요.'));
          var _bd=$('#formJoin .f>.member_warning').filter(function(){return $(this).find('select').length;});
          if(_bd.length&&!_bd.parent().hasClass('bday-row'))_bd.wrapAll('<div class="bday-row"></div>');
          var _id=$('#memId');
          if(_id.length&&!_id.next('.join-id-warn').length){
            var _w=$('<p class="join-id-warn"></p>').insertAfter(_id),_t;
            var _show=function(){_w.text($t('영문 소문자·숫자만 입력할 수 있어요')).addClass('show');clearTimeout(_t);_t=setTimeout(function(){_w.removeClass('show');},2500);};
            _id.on('compositionstart',_show);
            _id.on('beforeinput',function(e){var d=(e.originalEvent||e).data;if(d&&/[^A-Za-z0-9]/.test(d))_show();});
          }
        },300);
        break;
      case '/member/find_id.php':{
        let _ft=0,_fiv=setInterval(()=>{
          if(++_ft>40){clearInterval(_fiv);return;}
          if(!$('#userName').length)return;clearInterval(_fiv);
          $('.btn_member_id').text($t('확인'));
          if(!$('.find_lbl').length){
            $('#userName').before('<label class="find_lbl" data-flbl="name">'+$t('이름')+' <i>*</i></label>');
            $('#userCellPhoneNum').before('<label class="find_lbl" data-flbl="phone">'+$t('휴대폰번호')+' <i>*</i></label>');
            $('#userEmail').before('<label class="find_lbl" data-flbl="email">'+$t('이메일')+' <i>*</i></label>');
          }
          var _sync=function(){var p=$('#findIdPhone').is(':checked');$('[data-flbl="phone"]').toggle(p);$('[data-flbl="email"]').toggle(!p);};
          $('input[name="findIdFl"]').off('click.flbl').on('click.flbl',_sync);_sync();
        },150);
        break;}
      case '/member/find_password.php':{
        let _pt=0,_piv=setInterval(()=>{
          if(++_pt>40){clearInterval(_piv);return;}
          if(!$('#memberId').length)return;clearInterval(_piv);
          $('.btn_member_next').text($t('확인'));
          if(!$('.find_lbl').length){
            $('#memberId').before('<label class="find_lbl">'+$t('아이디')+' <i>*</i></label>');
            $('#memberName').before('<label class="find_lbl">'+$t('이름')+' <i>*</i></label>');
          }
        },150);
        break;}
      case'/mypage/index.php':
        $("body").removeClass("body-index");
        break;
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
