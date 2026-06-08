const _ldk='$12cutDefaultLang';
if(!localStorage.$mylang||(!localStorage[_ldk]&&localStorage.$mylang!=='ja')){localStorage[_ldk]='ja';localStorage.$mylang='ja';localStorage.removeItem('$lang');location.reload();}
if(!localStorage[_ldk])localStorage[_ldk]='ja';
const custom={
  isReserve:gno=>(ui.gdEtc[gno]?.catecd||'').indexOf('001004')>-1,
  main:({parseList,lang,setGdEtc,setPrice,setGoodsList})=>{
    // 네이티브 홈: main/index.html이 랜딩을 직접 렌더(iframe 미사용). dev=1은 편집기 미리보기 유지.
    if(location.search.includes('dev=1')) return wrap.innerHTML=`<iframe src="/dobuddy/12cut/12cutEditor.html" style="position:fixed;inset:0;width:100%;height:100%;border:none"></iframe>`;
    var _homeCartCnt=Number(localStorage.cartCnt||ui.gdEtc?.cartCnt||0)||0;
    $('.nav__cart-badge').text(_homeCartCnt>0?String(_homeCartCnt):'');
    $(`[data-lang="${localStorage.$mylang||'ja'}"]`).click();
    $('[data-lang]').each((i,e)=>e.addEventListener('click',function(){try{localStorage.$mylang=this.dataset.lang||['en','ko','ja','zh'][i];localStorage.removeItem('$lang');}catch(err){}}));
  },
  beforeRun:_=>{
    if(!document.querySelector('link[href*="pretendardvariable"]')){var l=document.createElement('link');l.rel='stylesheet';l.href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css';document.head.appendChild(l);}
    // 장바구니 리스트 드롭 방지: global setCartList가 no(goodsNo) 미해결 행을 통째로 떨궈 리스트가 비고 요약 금액만 남는 증상(스토리 편집상품 등)을 사전 보정. 정상 행엔 무영향(이미 goodsno 있으면 skip).
    try{
      if(window.ui&&ui.setCartList&&!ui.__cutCartFix){
        ui.__cutCartFix=1;
        var _origSetCartList=ui.setCartList;
        ui.setCartList=function(){
          try{
            var rows=document.querySelectorAll('.cart_cont_list tbody>tr');
            for(var i=0;i<rows.length;i++){
              var tr=rows[i];
              var inp=tr.querySelector('input');
              if(!inp){if(tr.parentNode)tr.parentNode.removeChild(tr);continue;}
              if(tr.dataset.goodsno)continue;
              var dno=inp&&inp.dataset?inp.dataset.goodsNo:'';
              if(!dno){var pi=tr.querySelector('[name^="priceInfo"]');if(pi){try{dno=(JSON.parse(pi.value)||{}).goodsNo;}catch(e){}}}
              if(!dno){var a=tr.querySelector('a[href*="goodsNo="]');if(a){var m=(a.getAttribute('href')||'').match(/goodsNo=(\d+)/);if(m)dno=m[1];}}
              if(!dno)dno='1000000000';
              if(dno)tr.dataset.goodsno=dno;
            }
          }catch(e){}
          return _origSetCartList.apply(this,arguments);
        };
      }
    }catch(e){}
  },
  afterRun:_=>{
    var _boardCss='/dobuddy/12cut/board.css';
    var _kakaoTalk='http://pf.kakao.com/_MhWxkM';
    var _kakaoLabel='1:1 문의';
    var _isQaHref=function(v){v=String(v||'');return v.indexOf('/service/qa.php')>-1||v.indexOf('/board/list.php?bdId=qa')>-1||v.indexOf('/mypage/mypage_qa.php')>-1;};
    var _wireKakaoInquiry=function(ctx){
      ctx=ctx||document;
      $(ctx).find('a').each(function(){
        var $a=$(this),txt=$a.text().replace(/\s+/g,' ').trim(),href=$a.attr('href')||'';
        if(_isQaHref(href)||txt==='1:1 문의'||txt==='1:1문의'||txt==='문의하기'||txt==='お問い合わせ'||txt==='聯絡我們'){
          $a.attr({href:_kakaoTalk,target:'_blank',rel:'noopener'});
          if($a.children().length){
            $a.contents().filter(function(){return this.nodeType===3;}).remove();
            $a.append(_kakaoLabel);
          }else{
            $a.text(_kakaoLabel);
          }
        }
      });
    };
    var _loadBoardCss=function(d){
      d=d||document;
      if(!d.querySelector('link[href*="/dobuddy/12cut/board.css"]')){
        var l=d.createElement('link');l.rel='stylesheet';l.href=_boardCss;d.head.appendChild(l);
      }
    };
    var _markBoard=function(d,asPopup){
      try{
        d=d||document;
        if(!d.body)return;
        if(!d.querySelector('meta[name="viewport"]')){
          var m=d.createElement('meta');m.name='viewport';m.content='width=device-width, initial-scale=1.0';d.head.appendChild(m);
        }
        d.body.classList.add('cut-board-ready');
        if(!d.getElementById('wrap')||d.querySelector('input[name="noheader"][value="1"]'))d.body.classList.add('cut-board-noheader');
        if(asPopup)d.body.classList.add('cut-board-popup');
      }catch(e){}
    };
    if(location.pathname.indexOf('/board/')===0||$('body').hasClass('body-board')){
      _loadBoardCss();
      _markBoard(document,false);
      setTimeout(function(){
        if(location.pathname.indexOf('/board/list.php')!==0||location.search.indexOf('bdId=notice')<0)return;
        var $tbody=$('.board_list_table tbody').first();
        if(!$tbody.length||$tbody.data('cutNoticeReady'))return;
        var _empty=!$tbody.find('tr').length||$tbody.text().indexOf('게시글이 존재하지')>-1;
        if(!_empty){
          $tbody.find('a[href^="javascript:"]').on('click.cutNoticeNoPopup',function(e){e.preventDefault();});
          return;
        }
        var _notices=[
          ['12cut 서비스 이용 안내','12cut은 필름 슬라이드 뷰어 경험을 더 쉽게 시작할 수 있도록 주문, 제작, 배송 과정을 순차적으로 정리하고 있습니다. 주요 변경 사항은 공지사항을 통해 먼저 안내드립니다.','2026.06.06','12cut'],
          ['배송 및 교환/반품 안내','상품 수령 후 파손이나 오배송이 확인되면 7일 이내 1:1 문의를 통해 사진과 함께 접수해 주세요. 확인 후 교환 또는 환불 절차를 안내드립니다.','2026.06.06','12cut'],
          ['글로벌 주문 고객 안내','해외 고객도 동일한 주문 흐름으로 이용할 수 있도록 언어와 주소 입력 경험을 개선하고 있습니다. 국가별 배송 가능 여부는 주문 단계에서 확인해 주세요.','2026.06.06','12cut']
        ];
        var _esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
        $tbody.data('cutNoticeReady',1).empty().append(_notices.map(function(n,i){
          return '<tr class="cut-notice-row" data-cut-notice="'+i+'"><td>'+(i+1)+'</td><td class="cut-notice-subject"><button type="button" class="cut-notice-toggle" aria-expanded="false">'+_esc(n[0])+'</button></td><td>'+_esc(n[2])+'</td><td>'+_esc(n[3])+'</td><td>0</td></tr><tr class="cut-notice-detail" data-cut-notice-detail="'+i+'" hidden><td colspan="5"><div><b>'+_esc(n[0])+'</b><p>'+_esc(n[1])+'</p></div></td></tr>';
        }).join(''));
        $tbody.off('click.cutNotice').on('click.cutNotice','.cut-notice-toggle',function(e){
          e.preventDefault();
          var $row=$(e.target).closest('.cut-notice-row'),i=$row.data('cutNotice'),$detail=$tbody.find('[data-cut-notice-detail="'+i+'"]'),open=$detail.is('[hidden]');
          $tbody.find('.cut-notice-detail').attr('hidden',true);
          $tbody.find('.cut-notice-toggle').attr('aria-expanded','false');
          if(open){$detail.removeAttr('hidden');$row.find('.cut-notice-toggle').attr('aria-expanded','true');}
        });
      },300);
    }
    $('a[href*="join_method"]').attr('href','/member/join_agreement.php?memberFl=personal');
    $('.top_member_box a[href*="order/cart.php"]').attr('href','/order/cart.php');
    var _cutCartIconSvg='<svg class="cut-header-cart-icon" viewBox="0 0 20.325 22" aria-hidden="true"><path d="M14.1625 8V5C14.1625 2.79086 12.3716 1 10.1625 1C7.95334 1 6.16248 2.79086 6.16248 5V8M1.75449 9.35196L1.15449 15.752C0.983889 17.5717 0.898591 18.4815 1.20053 19.1843C1.46578 19.8016 1.9306 20.3121 2.5205 20.6338C3.19201 21 4.10585 21 5.93353 21H14.3914C16.2191 21 17.133 21 17.8045 20.6338C18.3944 20.3121 18.8592 19.8016 19.1244 19.1843C19.4264 18.4815 19.3411 17.5717 19.1705 15.752L18.5705 9.35197C18.4264 7.81535 18.3544 7.04704 18.0088 6.46616C17.7045 5.95458 17.2548 5.54511 16.7171 5.28984C16.1065 5 15.3348 5 13.7914 5L6.53353 5C4.99017 5 4.21849 5 3.6079 5.28984C3.07015 5.54511 2.62049 5.95458 2.31614 6.46616C1.97057 7.04704 1.89854 7.81534 1.75449 9.35196Z"></path></svg>';
    var _syncCutHeaderCart=function(){
      var $box=$('.top_member_box');
      if(!$box.length)return;
      $box.find('img[src*="icon_cart"],img[onclick*="order/cart.php"],img[onclick*="../order/cart.php"]').addClass('cut-hide-cart-img').attr('onclick','');
      $box.find('a[href*="order/cart.php"]').attr('href','/order/cart.php');
      var $host=$box.find('li[data-n],a[href*="order/cart.php"],[onclick*="order/cart.php"],[onclick*="../order/cart.php"]').not('.cut-header-cart-link').first();
      if(!$host.length)return;
      if($host.is('a')){
        if(!$host.hasClass('cut-header-cart-link'))$host.addClass('cut-header-cart-link cut-header-cart-host').attr({'aria-label':'장바구니',href:'/order/cart.php'}).empty().append(_cutCartIconSvg);
        return;
      }
      if($host.is('img')){
        if(!$host.prev('.cut-header-cart-link').length)$('<button type="button" class="cut-header-cart-link" aria-label="장바구니">'+_cutCartIconSvg+'</button>').insertBefore($host).on('click',function(){location.href='/order/cart.php';});
        return;
      }
      var _cartN=$host.attr('data-n');
      $host.addClass('cut-header-cart-host').empty();
      if(typeof _cartN!=='undefined')$host.attr('data-n',_cartN);
      $host.append($('<button type="button" class="cut-header-cart-link" aria-label="장바구니">'+_cutCartIconSvg+'</button>').on('click',function(e){e.preventDefault();e.stopPropagation();location.href='/order/cart.php';}));
    };
    _syncCutHeaderCart();
    setTimeout(_syncCutHeaderCart,300);
    $('.top_member_box a[href*="mypage/index.php"]').attr('href','/mypage/index.php');
    $('.top_member_box img[onclick*="mypage/index.php"]').attr('onclick','location="/mypage/index.php"');
    $('.top_member_box a[href*="mypage/order_list.php"]').attr('href','/mypage/order_list.php');
    var _cutEditorUrl='/dobuddy/12cut/12cutEditor.html',_cutEditorLoginKey='$12cutEditorAfterLogin',_cutEditorReturnKey='$12cutEditorReturnUrl';
    var _isCutLoggedIn=function(){var $b=$('.top_member_box'),t=$b.text().replace(/\s/g,'').toUpperCase();if($b.find('a[href*="logout"],[onclick*="logout"]').length||t.indexOf('LOGOUT')>-1||t.indexOf('로그아웃')>-1)return true;if($b.find('a[href*="login.php"],[onclick*="login.php"]').length||t.indexOf('LOGIN')>-1||t.indexOf('로그인')>-1)return false;if($b.find('a[href*="mypage/"],[onclick*="mypage/"]').length||t.indexOf('MYPAGE')>-1||t.indexOf('注文照会')>-1||t.indexOf('주문조회')>-1)return true;return false;};
    // 장바구니 배지 stale 보정: localStorage.cartCnt가 로그아웃 후에도 안 지워져 배지가 남는 문제. 로그아웃 클릭 시 + 비로그인 상태(cart/order 페이지 제외)에서 캐시 제거. cart/order는 setCartList가 실제 행수로 동기화하므로 건드리지 않음.
    try{
      var _dropCutCartCnt=function(){try{localStorage.removeItem('cartCnt');localStorage.cartCnt='';localStorage.removeItem('cartCnt');}catch(e){}};
      var _getCutCartCnt=function(){var n=parseInt($('li[data-n]').first().attr('data-n'),10)||0;if(!n&&window.ui&&ui.gdEtc)n=Number(ui.gdEtc.cartCnt||0)||0;if(!n){try{n=Number(localStorage.cartCnt||0)||0;}catch(e){}}return n>0?n:0;};
      var _syncCutCartBadges=function(){var allowed=location.pathname==='/order/cart.php'||location.pathname==='/order/order.php'||_isCutLoggedIn(),n=allowed?_getCutCartCnt():0,txt=n>0?String(n>9?'9+':n):'';$('.nav__cart-badge,.cut-mobile-header__badge').text(txt);$('li[data-n]').attr('data-n',txt);};
      var _clearCutCartBadge=function(){_dropCutCartCnt();if(window.ui&&ui.gdEtc)ui.gdEtc.cartCnt=0;$('.nav__cart-badge,.cut-mobile-header__badge').text('');$('li[data-n]').attr('data-n','');};
      $('.top_member_box').find('a[href*="logout"],[onclick*="logout"]').off('click.cutCart').on('click.cutCart',function(){_clearCutCartBadge();});
      if(location.pathname!=='/order/cart.php'&&location.pathname!=='/order/order.php'&&!_isCutLoggedIn()){
        _clearCutCartBadge();
      }
      _syncCutCartBadges();setTimeout(_syncCutCartBadges,500);setTimeout(_syncCutCartBadges,1200);
    }catch(e){}
    $('#sel_currency option,#sel_lang option').removeAttr('disabled');
    var _cl=localStorage.$mylang||'ja';$('#sel_lang').val(_cl);$('body').removeClass('ko en ja zh').addClass(_cl);
    var _syncLoginSnsButtons=function(){
      if(location.pathname!=='/member/login.php')return;
      [
        ['.sns_btn--apple','.btn_apple_login'],
        ['.sns_btn--facebook','.btn_facebook_login']
      ].forEach(function(v){
        var $btn=$(v[0]),ok=$(v[1]).length>0;
        if(!$btn.length)return;
        $btn.toggleClass('cut-sns-unavailable',!ok).attr('aria-disabled',ok?'false':'true');
        if(ok)$btn.off('click.cutSnsUnavailable');
        else $btn.off('click.cutSnsUnavailable').on('click.cutSnsUnavailable',function(e){e.preventDefault();e.stopImmediatePropagation();return false;});
      });
    };
    _syncLoginSnsButtons();setTimeout(_syncLoginSnsButtons,300);setTimeout(_syncLoginSnsButtons,900);
    var _cutMobileHeader=function(){
      if($('.cut-mobile-header').length||$('body').hasClass('body-main'))return;
      var blocked=location.pathname.indexOf('/dobuddy/12cut/12cutEditor.html')===0;
      if(blocked)return;
      var cnt=0;
      try{cnt=_isCutLoggedIn()?(Number(ui.gdEtc&&ui.gdEtc.cartCnt||localStorage.cartCnt||0)||0):0;}catch(e){}
      var langBtns=[['en','EN'],['ko','KR'],['ja','JP'],['zh','CN']].map(function(v){return '<button type="button" data-lang="'+v[0]+'" class="cut-mobile-lang-btn'+(_cl===v[0]?' is-active':'')+'">'+v[1]+'</button>';}).join('');
      $('body').prepend('<div class="cut-mobile-header" role="banner"><a class="cut-mobile-header__logo" href="/" aria-label="12cut 홈"><img src="/data/skin/front/moment/img/home/assets/images/nav-logo.svg" alt=""></a><div class="cut-mobile-header__actions"><button type="button" class="cut-mobile-header__lang" aria-label="Language"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.25 2.45 3.35 5.45 3.35 9S14.25 18.55 12 21M12 3c-2.25 2.45-3.35 5.45-3.35 9S9.75 18.55 12 21"></path></svg></button><div class="cut-mobile-lang-popover">'+langBtns+'</div><a class="cut-mobile-header__cart" href="/order/cart.php" aria-label="장바구니">'+_cutCartIconSvg+'<span class="cut-mobile-header__badge">'+(cnt>0?String(cnt>9?'9+':cnt):'')+'</span></a></div></div>');
      $('.cut-mobile-header__lang').on('click',function(e){e.preventDefault();e.stopPropagation();$('.cut-mobile-lang-popover').toggleClass('is-open');});
      $('.cut-mobile-lang-popover .cut-mobile-lang-btn').on('click',function(){try{localStorage.$mylang=this.dataset.lang;localStorage.removeItem('$lang');}catch(e){}location.reload();});
      $(document).on('click.cutMobileLang',function(e){if(!$(e.target).closest('.cut-mobile-header__lang,.cut-mobile-lang-popover').length)$('.cut-mobile-lang-popover').removeClass('is-open');});
    };
    _cutMobileHeader();
    var _hasCutEditorStoredIntent=function(){try{return localStorage.getItem(_cutEditorLoginKey)==='1'||sessionStorage.getItem(_cutEditorLoginKey)==='1';}catch(e){return false;}};
    var _clearCutEditorStoredIntent=function(){try{localStorage.removeItem(_cutEditorLoginKey);sessionStorage.removeItem(_cutEditorLoginKey);}catch(e){}};
    var _setCutEditorReturnUrl=function(){try{localStorage.setItem(_cutEditorReturnKey,location.href);sessionStorage.setItem(_cutEditorReturnKey,location.href);}catch(e){}};
    var _openCutEditor=function(){if(innerWidth<=430||innerWidth*1.5<innerHeight)wrap.insertAdjacentHTML('beforeEnd','<iframe src="'+_cutEditorUrl+'" style="z-index:1000;animation:.5s slide-up;background:#fff;position:fixed;inset:0;margin:0 auto;width:100%;height:100%;border:none"></iframe>');else wrap.insertAdjacentHTML('beforeEnd','<div style="background-color:rgba(0,0,0,.5);z-index:101;position:fixed;inset:0"><iframe src="'+_cutEditorUrl+'" style="animation:.5s slide-up;background:#fff;position:fixed;inset:0;margin:0 auto;aspect-ratio:.5;height:100%;border:none"></iframe></div>');window.closeEditor=function(){wrap.removeChild(wrap.lastChild);};};
    var _goCutEditorLogin=function(){try{localStorage.setItem(_cutEditorLoginKey,'1');sessionStorage.setItem(_cutEditorLoginKey,'1');}catch(e){}_setCutEditorReturnUrl();location.href='/member/login.php?cutEditor=1';};
    var _hasCutEditorLoginIntent=location.search.indexOf('cutEditor=1')>-1||_hasCutEditorStoredIntent();
    if(location.pathname!=='/member/login.php'&&_hasCutEditorStoredIntent()){var _cutEditorIntentTries=0,_cutEditorIntentTimer=setInterval(function(){if(++_cutEditorIntentTries>80){clearInterval(_cutEditorIntentTimer);return;}if(_isCutLoggedIn()){clearInterval(_cutEditorIntentTimer);_clearCutEditorStoredIntent();location.href=location.origin+_cutEditorUrl;}},150);}
    if(location.pathname==='/member/login.php'&&_hasCutEditorLoginIntent){var _cutEditorAbs=location.origin+_cutEditorUrl,$ru=$('#returnUrl');if($ru.length)$ru.val(encodeURIComponent(_cutEditorAbs));if(!window.__cutEditorLoginPatch&&window.jQuery&&$.post){var _post=$.post;$.post=function(url){var jq=_post.apply(this,arguments);try{if(String(url).indexOf('login_ps.php')>-1){var _done=jq.done;jq.done=function(cb){return _done.call(this,function(data){if(data&&typeof data==='object'&&typeof data.code==='undefined'&&typeof data.message==='undefined'){_clearCutEditorStoredIntent();location.href=_cutEditorAbs;return;}return cb.apply(this,arguments);});};}}catch(e){}return jq;};window.__cutEditorLoginPatch=1;}}
    if(location.pathname=='/service/notice.php'||location.search.indexOf('bdId=notice')>-1)return location.replace('/');
    if(location.pathname=='/service/qa.php'||location.pathname=='/mypage/mypage_qa.php'||location.search.indexOf('bdId=qa')>-1)return location.replace(_kakaoTalk);
    $('a[href*="service/notice.php"],a[href*="board/list.php?bdId=notice"]').closest('li,dd,div,a').addClass('cut-hide-notice-link');
    $('a[href*="service/qa.php"],a[href*="board/list.php?bdId=qa"],a[href*="mypage/mypage_qa.php"],.footer__links a[data-i18n="footer_contact"]').attr({href:_kakaoTalk,target:'_blank',rel:'noopener'});
    var _hideFooterPartnership=function(){
      $('#footer_wrap a,.footer a').each(function(){
        var $a=$(this),txt=$a.text().replace(/\s+/g,' ').trim();
        if(!/^(Partnership Inquiry|제휴\s*문의|パートナーシップ|合作咨询)$/i.test(txt))return;
        $a.addClass('cut-hide-footer-link');
        var n=this.nextSibling;
        if(n&&n.nodeType===3)n.nodeValue=n.nodeValue.replace(/^\s*[|·ㆍ]\s*/,'');
      });
    };
    _hideFooterPartnership();
    setTimeout(_hideFooterPartnership,300);
    var _cutFooterOriginalHtml=null;
    var _cutFooterJa={
      copy:'ⓒDOBUDDY',
      ceo:'ヤンスンヨン',
      email:'dobuddy.inc@gmail.com',
      address:'〒162-0801<br>東京都新宿区山吹町331−4 RBW JAPANビル 2F',
      tel:'（＋81）090-6884-5330<br>（＋81）03-6280-8849',
      fax:'03-6280-8879'
    };
    var _syncCutFooter=function(){
      var lang=_cl==='ko'?'ko':'ja',$fw=$('#footer_wrap');
      if(!$fw.length)return;
      if(_cutFooterOriginalHtml===null)_cutFooterOriginalHtml=$fw.html();
      if(lang==='ko'){
        if($fw.attr('data-cut-footer-lang')==='ja')$fw.html(_cutFooterOriginalHtml);
        $fw.attr('data-cut-footer-lang','ko');
        _hideFooterPartnership();
        return;
      }
      var f=_cutFooterJa;
      $fw.attr('data-cut-footer-lang','ja');
      $fw.find('.content_info_wrap').hide();
      var _setFootLink=function(key,label,strong){
        var $a=$fw.find('.foot_list a[href*="'+key+'"]').first();
        if(!$a.length)return;
        if(strong)$a.html('<strong>'+label+'</strong>');
        else $a.text(label);
      };
      _setFootLink('company.php','会社紹介');
      _setFootLink('agreement.php','利用規約');
      _setFootLink('private.php','プライバシーポリシー',true);
      _setFootLink('guide.php','ご利用ガイド');
      _setFootLink('cooperation.php','パートナーシップ');
      $fw.find('.foot_info address strong').text(f.copy);
      $fw.find('.foot_info address span').html('Address.<br>'+f.address);
      var $lists=$fw.find('.foot_info_list'),$legal=$lists.eq(0).find('dl'),$contact=$lists.eq(1).find('dl');
      $legal.show();$contact.show();
      $legal.eq(0).find('dt').text('CEO.');$legal.eq(0).find('dd').text(f.ceo);
      $legal.eq(1).find('dt').text('E-mail.');
      var $email=$legal.eq(1).find('dd').empty();
      $('<a class="btn_email">').attr('href','mailto:'+f.email).text(f.email).appendTo($email);
      $legal.eq(2).find('dt').text('Address.');$legal.eq(2).find('dd').html(f.address);
      $legal.eq(3).hide();
      $contact.eq(0).find('dt').text('Tel.');$contact.eq(0).find('dd').html(f.tel);
      $contact.eq(1).find('dt').text('FAX');$contact.eq(1).find('dd').text(f.fax);
      $contact.eq(2).hide();
      $contact.eq(3).hide();
      $fw.find('.copyright').text(f.copy);
      var $mobileFoot=$fw.find('.foot_cont>div').first();
      if($mobileFoot.find('#sel_lang,#sel_currency').length){
        var $tools=$mobileFoot.children('div').first().detach();
        $mobileFoot.empty().append($tools);
        $mobileFoot.append('<div style="margin-top:2em"><a href="../service/company.php">会社紹介</a> | <a href="../service/guide.php">ご利用ガイド</a> | <a href="../service/agreement.php">利用規約</a> | <a href="../service/private.php"><b>プライバシーポリシー</b></a></div>');
        $mobileFoot.append('<div style="margin-top:1.5em"><b>'+f.copy+'</b><br>CEO. '+f.ceo+'<br>E-mail. <a style="text-decoration:underline" href="mailto:'+f.email+'">'+f.email+'</a></div>');
        $mobileFoot.append('<div style="margin-top:1.5em"><b>Address.</b><br>'+f.address+'</div>');
        $mobileFoot.append('<div style="margin-top:1.5em"><b>Tel.</b><br>'+f.tel+'</div>');
        $mobileFoot.append('<div style="margin-top:1.5em"><b>FAX</b><br>'+f.fax+'</div>');
      }
    };
    _syncCutFooter();
    setTimeout(_syncCutFooter,300);
    _wireKakaoInquiry();
    var _ff={en:["'Nunito'",'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap'],ja:["'Zen Maru Gothic'",'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700;900&display=swap'],zh:["'GenSenRounded2 TC'",'https://fontsapi.zeoseven.com/303/main/result.css']}[_cl];
    if(_ff){var _s=document.createElement('style');_s.textContent='@import url("'+_ff[1]+'");body,body *{font-family:'+_ff[0]+",'Pretendard Variable','Pretendard',sans-serif!important}";document.head.appendChild(_s);}
    var _cutPageTx={
      en:{'구매 불가능한 상품이 존재합니다. 장바구니 상품을 확인해 주세요!':'Some items can’t be purchased. Please check the items in your cart.','구매확정 하시겠습니까?':'Confirm this purchase?','회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 확인해 주세요.':'To keep your account secure, please verify your password once more.','홈':'Home','마이':'My','12cut 이용을 위한':'To use 12cut,','약관에 동의해주세요.':'please agree to the terms.','12cut의 모든 약관을 확인하고 전체 동의합니다.':'I have reviewed and agree to all 12cut terms.','구글로 로그인':'Continue with Google','Apple로 로그인':'Continue with Apple','Facebook으로 로그인':'Continue with Facebook','12cut 아이디로 로그인':'Log in with 12cut ID','카카오로 로그인':'Continue with Kakao','네이버로 로그인':'Continue with Naver','회원가입':'Sign Up','아이디 찾기':'Find ID','비밀번호 찾기':'Find Password','아이디 저장':'Save ID','또는':'or','비회원 주문조회 하기':'Non-member Order Lookup','주문번호와 비밀번호를 잊으신 경우, 고객센터로 문의하여 주시기 바랍니다.':'If you forgot your order number or password, please contact Customer Support.','아이디, 비밀번호가 일치하지 않습니다. 다시 입력해 주세요.':'The ID and password do not match. Please try again.','장바구니에 담겨있는 상품이 없습니다.':'There are no items in your cart.','회원정보 수정':'Edit Member Information','회원정보 변경':'Edit Member Information','회원 탈퇴':'Delete Account','찜한 상품이 없습니다.':'No wishlisted items.','주문취소':'Cancel Order','주문 취소':'Cancel Order','회원탈퇴':'Delete Account','탈퇴':'Delete','탈퇴하기':'Delete Account','회원탈퇴 신청':'Request Account Deletion','회원탈퇴 안내':'Account Deletion Notice','회원탈퇴 사유':'Reason for Account Deletion','비밀번호 확인':'Confirm Password','비밀번호':'Password','현재 비밀번호':'Current Password','취소':'Cancel','확인':'Confirm','완료':'Done','회원 탈퇴를 하시겠습니까?':'Are you sure you want to delete your account?','회원탈퇴를 하시겠습니까?':'Are you sure you want to delete your account?','탈퇴하시겠습니까?':'Are you sure you want to delete your account?','탈퇴가 완료되었습니다.':'Your account has been deleted.','회원탈퇴가 완료되었습니다.':'Your account has been deleted.','회원탈퇴를 신청하기 전에 안내 사항을 꼭 확인해주세요.':'Please review the notice before deleting your account.','탈퇴 후 개인정보 및 구매 기록은 관계 법령에 따라 보관 후 파기됩니다.':'After account deletion, personal information and purchase records are stored and deleted according to applicable laws.','탈퇴 후에는 회원정보가 삭제되며 복구할 수 없습니다.':'After account deletion, your member information will be deleted and cannot be restored.','진행 중인 주문이 있는 경우 회원탈퇴가 제한될 수 있습니다.':'Account deletion may be restricted if you have orders in progress.'},
      ja:{'구매 불가능한 상품이 존재합니다. 장바구니 상품을 확인해 주세요!':'購入できない商品があります。カートの商品をご確認ください。','구매확정 하시겠습니까?':'購入を確定しますか？','회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 확인해 주세요.':'お客様の情報を安全に保護するため、パスワードをもう一度ご確認ください。','홈':'ホーム','마이':'マイ','12cut 이용을 위한':'12cutをご利用いただくため','약관에 동의해주세요.':'規約に同意してください。','12cut의 모든 약관을 확인하고 전체 동의합니다.':'12cutのすべての規約を確認し、全てに同意します。','구글로 로그인':'Googleでログイン','Apple로 로그인':'Appleでログイン','Facebook으로 로그인':'Facebookでログイン','12cut 아이디로 로그인':'12cut IDでログイン','카카오로 로그인':'Kakaoでログイン','네이버로 로그인':'Naverでログイン','회원가입':'会員登録','아이디 찾기':'IDを探す','비밀번호 찾기':'パスワードを探す','아이디 저장':'IDを保存','또는':'または','비회원 주문조회 하기':'非会員注文照会','주문번호와 비밀번호를 잊으신 경우, 고객센터로 문의하여 주시기 바랍니다.':'注文番号とパスワードを忘れた場合は、カスタマーセンターまでお問い合わせください。','아이디, 비밀번호가 일치하지 않습니다. 다시 입력해 주세요.':'IDまたはパスワードが一致しません。もう一度入力してください。','장바구니에 담겨있는 상품이 없습니다.':'カートに商品が入っていません。','회원정보 수정':'会員情報修正','회원정보 변경':'会員情報修正','회원 탈퇴':'退会','찜한 상품이 없습니다.':'お気に入り商品がありません。','주문취소':'注文キャンセル','주문 취소':'注文キャンセル','회원탈퇴':'退会','탈퇴':'退会','탈퇴하기':'退会する','회원탈퇴 신청':'退会申請','회원탈퇴 안내':'退会のご案内','회원탈퇴 사유':'退会理由','비밀번호 확인':'パスワード確認','비밀번호':'パスワード','현재 비밀번호':'現在のパスワード','취소':'キャンセル','확인':'確認','완료':'完了','회원 탈퇴를 하시겠습니까?':'退会しますか？','회원탈퇴를 하시겠습니까?':'退会しますか？','탈퇴하시겠습니까?':'退会しますか？','탈퇴가 완료되었습니다.':'退会が完了しました。','회원탈퇴가 완료되었습니다.':'退会が完了しました。','회원탈퇴를 신청하기 전에 안내 사항을 꼭 확인해주세요.':'退会申請前に案内事項を必ずご確認ください。','탈퇴 후 개인정보 및 구매 기록은 관계 법령에 따라 보관 후 파기됩니다.':'退会後、個人情報および購入履歴は関連法令に基づき保管後、破棄されます。','탈퇴 후에는 회원정보가 삭제되며 복구할 수 없습니다.':'退会後は会員情報が削除され、復元できません。','진행 중인 주문이 있는 경우 회원탈퇴가 제한될 수 있습니다.':'進行中の注文がある場合、退会が制限されることがあります。'},
      zh:{'구매 불가능한 상품이 존재합니다. 장바구니 상품을 확인해 주세요!':'购物车中有无法购买的商品，请确认购物车商品！','구매확정 하시겠습니까?':'确认购买吗？','회원님의 정보를 안전하게 보호하기 위해 비밀번호를 다시 한번 확인해 주세요.':'为了安全保护您的信息，请再次确认密码。','홈':'首页','마이':'我的','12cut 이용을 위한':'为使用 12cut，','약관에 동의해주세요.':'请同意以下条款。','12cut의 모든 약관을 확인하고 전체 동의합니다.':'我已确认并同意 12cut 的所有条款。','구글로 로그인':'使用 Google 登录','Apple로 로그인':'使用 Apple 登录','Facebook으로 로그인':'使用 Facebook 登录','12cut 아이디로 로그인':'使用 12cut ID 登录','카카오로 로그인':'使用 Kakao 登录','네이버로 로그인':'使用 Naver 登录','회원가입':'注册','아이디 찾기':'找回账号','비밀번호 찾기':'找回密码','아이디 저장':'保存账号','또는':'或','비회원 주문조회 하기':'非会员订单查询','주문번호와 비밀번호를 잊으신 경우, 고객센터로 문의하여 주시기 바랍니다.':'如果忘记订单号或密码，请联系客服中心。','아이디, 비밀번호가 일치하지 않습니다. 다시 입력해 주세요.':'账号或密码不一致，请重新输入。','장바구니에 담겨있는 상품이 없습니다.':'购物车中没有商品。','회원정보 수정':'修改会员信息','회원정보 변경':'修改会员信息','회원 탈퇴':'注销会员','찜한 상품이 없습니다.':'暂无收藏商品。','주문취소':'取消订单','주문 취소':'取消订单','회원탈퇴':'注销会员','탈퇴':'注销','탈퇴하기':'注销会员','회원탈퇴 신청':'申请注销会员','회원탈퇴 안내':'注销会员须知','회원탈퇴 사유':'注销原因','비밀번호 확인':'确认密码','비밀번호':'密码','현재 비밀번호':'当前密码','취소':'取消','확인':'确认','완료':'完成','회원 탈퇴를 하시겠습니까?':'确定要注销会员吗？','회원탈퇴를 하시겠습니까?':'确定要注销会员吗？','탈퇴하시겠습니까?':'确定要注销会员吗？','탈퇴가 완료되었습니다.':'会员注销已完成。','회원탈퇴가 완료되었습니다.':'会员注销已完成。','회원탈퇴를 신청하기 전에 안내 사항을 꼭 확인해주세요.':'申请注销会员前，请务必确认相关说明。','탈퇴 후 개인정보 및 구매 기록은 관계 법령에 따라 보관 후 파기됩니다.':'注销后，个人信息及购买记录将按相关法规保存后销毁。','탈퇴 후에는 회원정보가 삭제되며 복구할 수 없습니다.':'注销后会员信息将被删除，且无法恢复。','진행 중인 주문이 있는 경우 회원탈퇴가 제한될 수 있습니다.':'如有进行中的订单，会员注销可能会受到限制。'}
    };
    var _ct=function(s){return (_cutPageTx[_cl]&&_cutPageTx[_cl][s])||$t(s);};
    var _cutImageBase='https://img.12cut.net/12cut_usr/cart/';
    var _getCutOrderImageMeta=function(){
      try{
        var raw=sessionStorage.getItem('12cutOrderImage')||localStorage.getItem('12cutLastOrderImage');
        var meta=raw?JSON.parse(raw):null;
        var cartSno=sessionStorage.getItem('cartSno')||(meta&&meta.cartSno);
        if(cartSno&&(!meta||String(meta.cartSno)!==String(cartSno))){
          raw=localStorage.getItem('12cutOrderImage:'+cartSno);
          meta=raw?JSON.parse(raw):{cartSno:String(cartSno)};
        }
        if(!meta||!meta.cartSno)return null;
        meta.cartSno=String(meta.cartSno);
        meta.thumbUrl=meta.thumbUrl||(_cutImageBase+meta.cartSno+'_thumb.png');
        meta.printUrl=meta.printUrl||(_cutImageBase+meta.cartSno+'.png');
        return meta;
      }catch(e){return null;}
    };
    var _cutOrderImageText=function(meta){
      if(!meta)return '';
      return '[12CUT_IMAGE]\ncartSno: '+meta.cartSno+'\ncartThumb(before order): '+meta.thumbUrl+'\ncartPrint(before order): '+meta.printUrl+'\norderThumb(after order): https://img.12cut.net/12cut_usr/{ORDER_NO}_thumb.png\norderPrint(after order): https://img.12cut.net/12cut_usr/{ORDER_NO}.png';
    };
    var _injectCutOrderImageMeta=function(){
      var meta=_getCutOrderImageMeta(),$form=$('#frmOrder');
      if(!meta||!$form.length)return;
      var text=_cutOrderImageText(meta);
      var _upsertHidden=function(name,value){
        var $el=$form.find('input[name="'+name+'"]').first();
        if(!$el.length)$el=$('<input type="hidden">').attr('name',name).appendTo($form);
        $el.val(value);
      };
      _upsertHidden('cut12CartSno',meta.cartSno);
      _upsertHidden('cut12ImageThumb',meta.thumbUrl);
      _upsertHidden('cut12ImagePrint',meta.printUrl);
      _upsertHidden('cut12ImageNote',text);
    };
    var _translateCutText=function(root,exclude){
      if(!_cutPageTx[_cl])return;
      root=root||document;
      exclude=exclude||'.agreement_box,textarea,.terms_box,.scroll_box,script,style';
      $(root).find('*').addBack().contents().filter(function(){return this.nodeType===3&&!$(this).parent().closest(exclude).length;}).each(function(){
        var raw=this.nodeValue,t=$.trim(raw);
        if(t&&_cutPageTx[_cl][t])this.nodeValue=raw.replace(t,_ct(t));
      });
      $(root).find('input,button,a').each(function(){
        var $e=$(this),v=$.trim(this.value||$e.text()),p=this.placeholder,a=this.getAttribute('aria-label');
        if(v&&_cutPageTx[_cl][v]){if(this.value)this.value=_ct(v);else $e.text(_ct(v));}
        if(p&&_cutPageTx[_cl][p])this.placeholder=_ct(p);
        if(a&&_cutPageTx[_cl][a])this.setAttribute('aria-label',_ct(a));
      });
    };
    var _watchCutLayerText=function(){
      if(window.__cutLayerTxWatch)return;
      window.__cutLayerTxWatch=1;
      var _run=function(){_translateCutText(document.body,'.agreement_box,textarea,.terms_box,.scroll_box,script,style');};
      _run();
      if(window.MutationObserver)new MutationObserver(function(){clearTimeout(window.__cutLayerTxTimer);window.__cutLayerTxTimer=setTimeout(_run,30);}).observe(document.body,{childList:true,subtree:true});
    };
    var _getCutBottomNavActive=function(){
      var p=location.pathname;
      if(p==='/'||p==='/main/index.php')return 'home';
      if(p==='/goods/goods_view.php'||p.indexOf('/goods/goods_view.php')===0)return 'cut';
      return 'my';
    };
    var _syncCutBottomNav=function(){
      var $nav=$('.cut-bottom-nav');if(!$nav.length)return;
      var homeLbl=_ct('홈'),myLbl=_ct('마이'),navLbl=_ct('주요 메뉴'),$items=$nav.children('.cut-bottom-nav__item');
      $nav.attr('aria-label',navLbl);
      if($items.length<3)return;
      $items.eq(0).attr('aria-label',homeLbl).find('span').text(homeLbl);
      $items.eq(1).attr('aria-label','12cut').find('span').text('12cut');
      $items.eq(2).attr('aria-label',myLbl).find('span').text(myLbl);
      var active=_getCutBottomNavActive();
      $items.removeClass('is-active');
      if(active==='home')$items.eq(0).addClass('is-active');
      if(active==='cut')$items.eq(1).addClass('is-active');
      if(active==='my')$items.eq(2).addClass('is-active');
    };
    var _applyCutLang=function(lang){
      if(lang)_cl=lang;
      $('#sel_lang').val(_cl);
      $('body').removeClass('ko en ja zh').addClass(_cl);
      $('.cut-mobile-lang-btn').removeClass('is-active').filter('[data-lang="'+_cl+'"]').addClass('is-active');
      _syncCutFooter();
      _syncCutBottomNav();
      _translateCutText(document.body);
    };
    var _setLinkText=function($a,key){$a.contents().filter(function(){return this.nodeType===3;}).remove();$a.append(_ct(key));};
    if(location.pathname.indexOf('/mypage/')===0)$('body').addClass('body-mypage');
    if(location.pathname==='/mypage/mypage_qa.php')$('body').addClass('body-mypage-qa');
    if(location.pathname==='/mypage/my_page_password.php')$('body').addClass('body-mypage-password body-reauth');
    var _fixPasswordPageSpacing=function(){
      if(location.pathname!=='/mypage/my_page_password.php')return;
      $('body').addClass('body-mypage-password body-reauth');
      $('#contents').css({padding:'200px 16px 86px',boxSizing:'border-box'});
      $('.content_box,.member_wrap,.member_cont,#my_custom').css({boxSizing:'border-box'});
      $('.content_box,.member_wrap,.member_cont').first().css({paddingTop:'0',marginTop:'0'});
    };
    _fixPasswordPageSpacing();
    setTimeout(_fixPasswordPageSpacing,300);
    setTimeout(_fixPasswordPageSpacing,900);
    var _hideMypageMenus=function(ctx){
      $(ctx||document).find('.aside a,#my_custom a').each(function(){
        var $a=$(this),href=$a.attr('href')||'',txt=$a.text().replace(/\s+/g,' ').trim();
        var hide=href.indexOf('wish_list.php')>-1||href.indexOf('goods_review')>-1||href.indexOf('review')>-1||href.indexOf('mileage')>-1||href.indexOf('hack_out.php')>-1||/찜|마이\s*리뷰|리뷰|마일리지|회원\s*탈퇴|회원탈퇴|탈퇴|Mileage|Review|Delete Account/i.test(txt);
        if(!hide)return;
        var $row=$a.closest('li,dd');
        ($row.length?$row:$a).addClass('cut-hide-mypage-link');
      });
    };
    _hideMypageMenus();
    setTimeout(_hideMypageMenus,300);
    var _orderMypageMenus=function(ctx){
      var $scope=$(ctx||document).find('.aside,#my_custom').addBack('.aside,#my_custom');
      var $delivery=$scope.find('a').filter(function(){
        var $a=$(this),href=$a.attr('href')||'',txt=$a.text().replace(/\s+/g,' ').trim();
        return /배송\s*안내|배송안내|배송|Shipping Guide|Shipping|Delivery|配送案内|配送|送料|送货|物流/i.test(txt)||href.indexOf('delivery')>-1||href.indexOf('shipping')>-1;
      }).first();
      var $inquiry=$scope.find('a').filter(function(){
        var $a=$(this),href=$a.attr('href')||'',txt=$a.text().replace(/\s+/g,' ').trim();
        return _isQaHref(href)||/1:1\s*(문의|상담)|1:1문의|1:1 상담|Contact|Inquiry|문의|상담|お問い合わせ|問い合わせ|咨询|諮詢|聯絡/i.test(txt);
      }).first();
      if(!$delivery.length||!$inquiry.length||$delivery[0]===$inquiry[0])return;
      var _row=function($a){
        var $r=$a.closest('li,dd');
        if($r.length)return $r;
        var $p=$a.parent();
        if($p.length&&$p.find('>a').length===1&&$p.parent().children().length>1)return $p;
        return $a;
      };
      var $d=_row($delivery),$q=_row($inquiry);
      if($d[0]&&$q[0]&&$d.parent()[0]===$q.parent()[0]&&$d.index()>$q.index())$d.insertBefore($q);
    };
    _orderMypageMenus();
    setTimeout(_orderMypageMenus,300);
    setTimeout(_orderMypageMenus,900);
    setTimeout(_orderMypageMenus,1600);
    $('.aside a[href*="my_page_password.php"]').each(function(){_setLinkText($(this),'회원정보 수정');});
    $('.aside a[href*="hack_out.php"]').each(function(){_setLinkText($(this),'회원 탈퇴');});
    var _cutBottomNav=function(){
      if($('.cut-bottom-nav').length)return;
      var p=location.pathname;
      var blocked=p.indexOf('/member/')===0||p==='/order/order.php'||p==='/order/order_end.php'||p.indexOf('/dobuddy/12cut/12cutEditor.html')===0;
      if(blocked)return;
      var active=_getCutBottomNavActive();
      var item=function(key,href,label,icon){
        return '<a class="cut-bottom-nav__item'+(active===key?' is-active':'')+'" href="'+href+'" aria-label="'+label+'">'+icon+'<span>'+label+'</span></a>';
      };
      var homeIcon='<svg class="cut-bottom-nav__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.75 10.6 12 3.75l8.25 6.85v8.65a1 1 0 0 1-1 1h-4.6v-5.7h-5.3v5.7h-4.6a1 1 0 0 1-1-1V10.6Z"/></svg>';
      var cutIcon='<svg class="cut-bottom-nav__icon cut-bottom-nav__logo" viewBox="0 0 31 23" aria-hidden="true"><path d="M23.3471 1.5 15.4957 5.9698 7.6529 1.5 1.5 5.7399v6.8336l13.9957 8.6577L29.5 12.5735V5.7399L23.3471 1.5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
      var myIcon='<svg class="cut-bottom-nav__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12.1a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Zm-7.2 8c.55-3.35 3.55-5.85 7.2-5.85s6.65 2.5 7.2 5.85H4.8Z"/></svg>';
      $('body').append('<nav class="cut-bottom-nav" aria-label="'+_ct('주요 메뉴')+'">'+item('home','/',_ct('홈'),homeIcon)+item('cut','/goods/goods_view.php?goodsNo=1000000000','12cut',cutIcon)+item('my','/mypage/index.php',_ct('마이'),myIcon)+'</nav>');
    };
    _cutBottomNav();
    _syncCutBottomNav();
    $('.cut-mobile-lang-popover .cut-mobile-lang-btn').off('click.cutLangMobile').on('click.cutLangMobile',function(){try{localStorage.$mylang=this.dataset.lang;localStorage.removeItem('$lang');}catch(e){}_applyCutLang(this.dataset.lang);location.reload();});
    $(document).off('change.cutLang').on('change.cutLang','#sel_lang',function(){try{localStorage.$mylang=this.value;localStorage.removeItem('$lang');}catch(e){}_applyCutLang(this.value);});
    $(document).off('click.cutLangBtn').on('click.cutLangBtn','.lang-btn,[data-lang]',function(){var lang=this.dataset.lang;if(!lang||$(this).hasClass('cut-mobile-lang-btn'))return;try{localStorage.$mylang=lang;localStorage.removeItem('$lang');}catch(e){}_applyCutLang(lang);});
    var _hdrBack={'/member/login.php':['로그인','/'],'/member/join_agreement.php':['회원가입','/member/login.php'],'/member/find_id.php':['아이디 찾기','/member/login.php'],'/member/find_password.php':['비밀번호 찾기','/member/login.php']}[location.pathname];
    if(_hdrBack){$('.header_top').attr('data-h',$t(_hdrBack[0]));$('.header_top').off('click.hdr').on('click.hdr',function(e){if(this.dataset.h&&innerWidth<851&&((e.clientX||0)-this.getBoundingClientRect().left)<44&&!$(e.target).closest('a,button,input,select,label,img,[onclick],.top_member_box').length){e.stopImmediatePropagation();location.href=_hdrBack[1];}});}
    if(!window.__cutPostcodeOpen){
      var _cutOpen=window.open;
      window.open=function(){
        var w=_cutOpen.apply(window,arguments),u=String(arguments[0]||'');
        if(w&&u.indexOf('postcode_search.php')>-1){
          var _css='html,body{min-width:0!important;width:100%!important;margin:0!important;background:#fff!important;font-family:\"Pretendard Variable\",Pretendard,\"Apple SD Gothic Neo\",sans-serif!important;color:#333342!important}body,body *{box-sizing:border-box!important;font-family:inherit!important}.post-search,#wrap,#container,#contents,.content,.layer_wrap,.postcode_search{width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;background:#fff!important;font-size:14px!important}.post-search h1,h1,.title{display:flex!important;align-items:center!important;min-height:56px!important;margin:0!important;padding:14px 56px 14px 24px!important;background:#333342!important;color:#fff!important;font-size:22px!important;font-weight:800!important;line-height:1.2!important;letter-spacing:-.04em!important}.title-close,.close,.btn_close{top:18px!important;right:22px!important;color:#fff!important}#search-form,form[name=\"frmPostcode\"],.postcode_search form{position:relative!important;padding:28px 24px 0!important;margin:0!important}#address_search_name,input[name=\"addressSearchString\"],input[name=\"keyword\"],input[type=\"text\"]{height:48px!important;width:100%!important;border:1px solid #F63237!important;border-radius:8px!important;background:#fff!important;font-size:15px!important;font-weight:600!important;padding:0 112px 0 16px!important;color:#111!important;box-shadow:none!important;outline:none!important}input.button,input[type=\"submit\"],button[type=\"submit\"],.btn_search{position:absolute!important;top:28px!important;right:24px!important;width:96px!important;height:48px!important;border:1px solid #F63237!important;border-radius:8px!important;background:#F63237!important;color:#fff!important;font-size:16px!important;font-weight:700!important;line-height:48px!important;text-align:center!important}.tip,.result,.postcode_result,.address_list,table{margin-left:24px!important;margin-right:24px!important;width:calc(100% - 48px)!important}.tip{margin-top:16px!important;color:#777!important;line-height:1.5!important}.result,.postcode_result,.address_list{margin-top:20px!important}table,tbody,tr,td{display:block!important;border:none!important}td{padding:10px 0!important;border-bottom:1px solid #eee!important;color:#333!important;font-size:14px!important;line-height:1.45!important}';
          var _injectPost=function(){try{var d=w.document;if(!d||d.getElementById('cut-postcode-style'))return;var s=d.createElement('style');s.id='cut-postcode-style';s.textContent=_css;d.head.appendChild(s);}catch(e){}};
          setTimeout(_injectPost,250);setTimeout(_injectPost,900);setTimeout(_injectPost,1600);
        }
        if(w&&u.indexOf('/board/')>-1){
          var _injectBoard=function(){try{var d=w.document;if(!d||!d.head)return;_loadBoardCss(d);_markBoard(d,true);}catch(e){}};
          setTimeout(_injectBoard,250);setTimeout(_injectBoard,900);setTimeout(_injectBoard,1600);
        }
        return w;
      };
      window.__cutPostcodeOpen=1;
    }
    var _reauth=function(){if($('body').data('cutReauthReady'))return;var _cancel=$t('취소').replace(/\s+/g,'').trim(),_pri=$t('인증하기').replace(/\s+/g,'').trim(),$pri=$('button,input,a').filter(function(){var t=(this.value||$(this).text()).replace(/\s+/g,'').trim();return t==_pri;});if(!$pri.length)return;if(!$('.c-red').length&&!$('img[src*="kakao"],img[alt*="kakao"],img[alt*="카카오"]').length&&!$('body').hasClass('body-mypage-password'))return;$('body').data('cutReauthReady',1).addClass('body-reauth');$('button,input,a').filter(function(){var t=(this.value||$(this).text()).replace(/\s+/g,'').trim();return t==_cancel;}).addClass('cut-reauth-cancel');$pri.addClass('cut-reauth-primary');var _setAuthLogo=function(q,src){$('body').find(q).attr('src',src);};_setAuthLogo('img[alt*="kakao"],img[src*="kakao"],img[alt*="카카오"]','/dobuddy/12cut/sns-kakao.png');_setAuthLogo('img[alt*="naver"],img[src*="naver"],img[alt*="네이버"]','/dobuddy/12cut/sns-naver.png');_setAuthLogo('img[alt*="facebook"],img[src*="facebook"],img[alt*="페이스북"]','/dobuddy/12cut/sns-facebook.png');var $k=$('img[alt*="kakao"],img[src*="sns-kakao"],img[alt*="카카오"]').first();if(!$k.length)$k=$('body *').filter(function(){var t=$(this).text().replace(/\s+/g,' ').trim().toLowerCase();return t&&(t.indexOf('kakao')>-1||t.indexOf('카카오')>-1);}).not('.cut-reauth-cancel,.cut-reauth-primary').last();var $box=$k;for(var i=0;i<5&&$box.length;i++){var r=$box[0].getBoundingClientRect();if(r.width>200&&r.height>50)break;$box=$box.parent();}if($box.length)$box.addClass('cut-kakao-plain');};
    _reauth();setTimeout(_reauth,300);setTimeout(_reauth,900);
    _watchCutLayerText();
    switch(location.pathname){
      case '/order/order.php':
        $('body').addClass('body-orderform');
        $('.header_top').attr('data-h',$t('주문하기'));
        $('#frmOrder>a.btn.primary').text($t('결제하기'));
        _injectCutOrderImageMeta();
        $('#frmOrder').off('submit.cut12Image').on('submit.cut12Image',_injectCutOrderImageMeta);
        $('#frmOrder>a.btn.primary,.body-orderform a.btn.primary,.body-orderform button[type="submit"],.body-orderform input[type="submit"]').off('click.cut12Image').on('click.cut12Image',_injectCutOrderImageMeta);
        var _cutImageMetaTry=0,_cutImageMetaTimer=setInterval(function(){_injectCutOrderImageMeta();if(++_cutImageMetaTry>20)clearInterval(_cutImageMetaTimer);},250);
        var _hideOrderMemo=function(){
          var $memo=$('#frmOrder [name="orderMemo"]').first();
          if(!$memo.length)return;
          $memo.addClass('cut-order-memo-hidden').val('');
          var $memoLabel=$memo.prevAll('b').first();
          if($memoLabel.length&&/배송\s*메시지|配送メッセージ|Delivery Message|배송메세지/i.test($memoLabel.text().replace(/\s+/g,' ')))$memoLabel.addClass('cut-order-memo-hidden');
        };
        _hideOrderMemo();
        var _cutMemoTry=0,_cutMemoTimer=setInterval(function(){_hideOrderMemo();if(++_cutMemoTry>20)clearInterval(_cutMemoTimer);},250);
        var _copyOrdererToReceiver=function(){
          var $same=$('#frmOrder input').filter(function(){
            var id=this.id,$label=id?$('label[for="'+id+'"]').first():$(this).next('label');
            return /주문자정보와\s*동일|注文者情報と同じ|Same as Customer|Same as orderer|同订购人信息/i.test($label.text());
          }).first();
          if($same.length&&!$same.prop('checked'))return;
          var pairs=[
            ['orderName','receiverName'],['orderCellPhone','receiverCellPhone'],['orderPhone','receiverPhone'],
            ['orderZonecode','receiverZonecode'],['orderZipcode','receiverZipcode'],
            ['orderAddress','receiverAddress'],['orderAddressSub','receiverAddressSub']
          ];
          pairs.forEach(function(p){
            var $src=$('#frmOrder [name="'+p[0]+'"]').first(),$dst=$('#frmOrder [name="'+p[1]+'"]').first();
            if($src.length&&$dst.length&&$src.val()&&(!$dst.val()||$dst.is('[readonly]')))$dst.val($src.val()).trigger('input').trigger('change');
          });
        };
        var _activateSameAsCustomer=function($input){
          if(!$input||!$input.length)return;
          var el=$input.get(0);
          if(!el)return;
          if(!$input.data('cutSameActivated')){
            $input.data('cutSameActivated',1).prop('checked',false);
            el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
          }
          $input.prop('checked',true).trigger('input').trigger('change');
          _copyOrdererToReceiver();
        };
        var _simplifyShippingOptions=function(){
          $('#shippingBasic,#shippingRecently').each(function(){
            var $i=$(this),id=$i.attr('id');
            $i.addClass('cut-hide-ship-option').prop('checked',false);
            if(id)$('label[for="'+id+'"]').addClass('cut-hide-ship-option');
            $i.next('label').addClass('cut-hide-ship-option');
            $i.closest('.order-ship-opt').addClass('cut-hide-ship-option');
          });
          var $sg=$('#shippingBasic').closest('.form_element');
          if(!$sg.length)$sg=$('#frmOrder .f2 .form_element').filter(function(){return $(this).find('input[type="checkbox"],input[type="radio"]').length>=2;}).first();
          if(!$sg.length)return;
          if(!$sg.hasClass('order-ship-done')){
            $sg.addClass('order-ship-done');
            $sg.children('input[type="checkbox"],input[type="radio"]').each(function(){
              var $i=$(this),$l=$i.next('label');
              if($l.length){$('<span class="order-ship-opt"></span>').insertBefore($i).append($i).append($l);}
            });
          }
          var $opts=$sg.find('.order-ship-opt');
          $opts.each(function(){
            var $opt=$(this),txt=$opt.text().replace(/\s+/g,' ').trim();
            if(/기본\s*배송지|최근\s*배송지|基本配送先|最近配送先|Default Address|Recent Address|默认地址|最近地址/i.test(txt))$opt.addClass('cut-hide-ship-option').find('input').prop('checked',false);
          });
          if($opts.length>=4)$opts.slice(0,2).addClass('cut-hide-ship-option').find('input').prop('checked',false);
          var $visible=$opts.not('.cut-hide-ship-option');
          var $sameOpt=$visible.filter(function(){return /주문자정보와\s*동일|注文者情報と同じ|Same as Customer|Same as orderer|同订购人信息/i.test($(this).text());}).first();
          var $manualOpt=$visible.filter(function(){return /직접\s*입력|直接入力|手動入力|Manual Input|手动输入/i.test($(this).text());}).first();
          $manualOpt.addClass('cut-manual-ship-option');
          if($sameOpt.length){
            if($manualOpt.length)$manualOpt.before($sameOpt);
            else $sg.prepend($sameOpt);
            _activateSameAsCustomer($sameOpt.find('input').first());
          }else{
            var $sameLabel=$sg.find('label').filter(function(){return /주문자정보와\s*동일|注文者情報と同じ|Same as Customer|Same as orderer|同订购人信息/i.test($(this).text());}).first();
            var $manualLabel=$sg.find('label').filter(function(){return /직접\s*입력|直接入力|手動入力|Manual Input|手动输入/i.test($(this).text());}).first();
            $manualLabel.addClass('cut-manual-ship-label');
            if($sameLabel.length&&$manualLabel.length){
              var $sameInput=$sameLabel.attr('for')?$('#'+$sameLabel.attr('for')):$sameLabel.prev('input');
              var $manualInput=$manualLabel.attr('for')?$('#'+$manualLabel.attr('for')):$manualLabel.prev('input');
              if($sameInput.length&&$manualInput.length){
                $manualInput.before($sameInput.add($sameLabel));
                $manualInput.prop('checked',false);
                _activateSameAsCustomer($sameInput);
              }
            }
          }
          if($visible.length&&!$visible.find('input:checked').length){
            var $same=$sameOpt.find('input').first();
            if($same.length)_activateSameAsCustomer($same);
            else $visible.find('input').first().prop('checked',true).trigger('change');
          }
          $sg.find('.js_shipping').remove();
        };
        _simplifyShippingOptions();
        _copyOrdererToReceiver();
        var _cutShipTry=0,_cutShipTimer=setInterval(function(){_simplifyShippingOptions();if(++_cutShipTry>20)clearInterval(_cutShipTimer);},250);
        var _cutCopyTry=0,_cutCopyTimer=setInterval(function(){_copyOrdererToReceiver();if(++_cutCopyTry>20)clearInterval(_cutCopyTimer);},250);
        // 외화(비-KRW) 주문요약 금액 보정: 공용 global.js 외화 분기가 배송비를 1000 상수로 하드코딩(통화 무관 $1,000)하고
        // '총 상품 금액'에 할인액(0)을 잘못 표기하는 버그를 12cut 측에서만 오버라이드. KRW 결제는 global 정상 분기라 미개입.
        if(typeof sel_currency!=='undefined'&&sel_currency.selectedIndex){
          var _cutFixOrderSum=function(){
            var $items=$('#frmOrder .cart-div .cart-li'),$box=$('#frmOrder .cart-sumbox');
            if(!$items.length||!$box.length)return;
            var rate=(window.ui&&ui.gdEtc&&ui.gdEtc[sel_currency.value])||1,T=0,D=0;
            $items.each(function(){
              var pr=(this.getAttribute('data-p')||'').split('-'),p0=parseFloat(pr[0])||0,ds=parseFloat(pr[1])||0;
              T+=p0;D+=Math.round(p0*ds);
            });
            var shipEl=document.getElementById('totalDeliveryCharge');
            var shipKRW=shipEl?(parseFloat((shipEl.innerText||'').replace(/[^0-9.]/g,''))||0):0;
            var ship=Math.ceil(shipKRW*rate),total=T-D+ship;
            $box.html($t('총 상품 금액')+'<s style=float:right><s>'+ui.fmPrice(T,1)+'</s></s>'
              +'<br>'+$t('총 배송비')+'<s style=float:right>+ <s>'+ui.fmPrice(ship,1)+'</s></s>'
              +(D>0?'<br>'+$t('할인 금액')+'<s style=float:right>- <s>'+ui.fmPrice(D,1)+'</s></s>':'')
              +'<div style=font-size:16px>'+$t('최종결제금액')+' <b style=float:right;color:#0B84EC><b>'+ui.fmPrice(total,1)+'</b></b></div>');
            $('#frmOrder .ord-p>b').text(ui.fmPrice(total,1));
          };
          var _cutSumN=0,_cutSumIv=setInterval(function(){_cutSumN++;_cutFixOrderSum();if(_cutSumN>=25)clearInterval(_cutSumIv);},200);
        }
        setTimeout(()=>{
          _simplifyShippingOptions();
          if(!$('#frmOrder .f2 .order-addr-row').length){
            var $ab=$('#frmOrder .f2>b').filter(function(){return $(this).text().replace(/[\s*]/g,'')==$t('주소');}).first();
            if($ab.length){
              var $nodes=$ab.nextUntil('b');
              var $btn=$nodes.filter('button,.btn_post_search').add($nodes.find('button,.btn_post_search')).first();
              var $zip=$nodes.filter('input').add($nodes.find('input')).first();
              if($zip.length&&$btn.length){
                var $row=$('<div class="order-addr-row"></div>');
                var $anchor=$zip.closest('div').length?$zip.closest('div'):$zip;
                $anchor.before($row);
                $row.append($zip).append($btn);
                $nodes.filter('div').each(function(){var $d=$(this);if(!$d.hasClass('order-addr-row')&&!$d.find('input,button,select,textarea').length&&!$.trim($d.text()))$d.hide();});
              }
            }
          }
          _hideOrderMemo();
          var $mile=$('#frmOrder .useMileage');
          if($mile.length&&!$mile.hasClass('order-mileage-ready')){
            $mile.addClass('order-mileage-ready');
            var $mi=$mile.find('input[type="text"],input:not([type])').first().addClass('order-mileage-input');
            $mi.closest('div').addClass('order-mileage-box');
            $mile.find('*').addBack().contents().filter(function(){return this.nodeType==3&&this.nodeValue.replace(/\s/g,'')=='원';}).first().wrap('<span class="order-mileage-unit"></span>');
            $mile.find('label').addClass('order-mileage-label');
            var mileText=$mile.text().replace(/\s+/g,' ');
            var mileVal=parseInt((mileText.match(/보유\s*마일리지\s*:\s*([0-9,]+)/)||mileText.match(/Mileage\s*:\s*([0-9,]+)/)||[])[1]?.replace(/,/g,'')||'0',10)||0;
            if(mileVal<=0)$mile.addClass('cut-mileage-empty');
            $mile.find('button,a,input[type="button"]').filter(function(){return /전액\s*사용|全部使用|Use All|全额使用/i.test((this.value||$(this).text()).replace(/\s+/g,' '));}).addClass('cut-mileage-use-all');
          }
          var $payTabs=$('#my_custom .filter>a').filter(function(){return $(this).is(':visible');});
          var onlyBank=$payTabs.length===1&&/무통장|Bank Transfer|銀行振込|银行转账/.test($payTabs.first().text().replace(/\s+/g,' ').trim());
          if(onlyBank&&!$('.cut-payment-setup-notice').length){
            var notice={
              ko:'현재 카드/간편/해외 결제수단을 활성화 중입니다. 설정 완료 전까지는 무통장 입금만 임시로 표시됩니다.',
              en:'Card, express, and international payments are being enabled. Bank transfer is shown temporarily until setup is complete.',
              ja:'カード・かんたん決済・海外決済を有効化中です。設定完了までは銀行振込のみ一時的に表示されます。',
              zh:'正在启用银行卡、快捷支付及海外支付。设置完成前将暂时仅显示银行转账。'
            }[_cl]||'현재 카드/간편/해외 결제수단을 활성화 중입니다. 설정 완료 전까지는 무통장 입금만 임시로 표시됩니다.';
            $('#my_custom .filter').after('<div class="cut-payment-setup-notice" style="margin:-12px 0 20px;padding:12px 14px;border:1px solid #FFE0E1;border-radius:10px;background:#FFF7F7;color:#F63237;font-size:13px;font-weight:600;line-height:1.45;letter-spacing:-.02em">'+notice+'</div>');
          }
        },0);
        var _cutPayNoticeTry=0,_cutPayNoticeTimer=setInterval(function(){
          if($('.cut-payment-setup-notice').length||++_cutPayNoticeTry>20)return clearInterval(_cutPayNoticeTimer);
          var $payTabs=$('#my_custom .filter>a').filter(function(){return $(this).is(':visible');});
          var onlyBank=$payTabs.length===1&&/무통장|Bank Transfer|銀行振込|银行转账/.test($payTabs.first().text().replace(/\s+/g,' ').trim());
          if(!onlyBank)return;
          var notice={
            ko:'현재 카드/간편/해외 결제수단을 활성화 중입니다. 설정 완료 전까지는 무통장 입금만 임시로 표시됩니다.',
            en:'Card, express, and international payments are being enabled. Bank transfer is shown temporarily until setup is complete.',
            ja:'カード・かんたん決済・海外決済を有効化中です。設定完了までは銀行振込のみ一時的に表示されます。',
            zh:'正在启用银行卡、快捷支付及海外支付。设置完成前将暂时仅显示银行转账。'
          }[_cl]||'현재 카드/간편/해외 결제수단을 활성화 중입니다. 설정 완료 전까지는 무통장 입금만 임시로 표시됩니다.';
          $('#my_custom .filter').after('<div class="cut-payment-setup-notice" style="margin:-12px 0 20px;padding:12px 14px;border:1px solid #FFE0E1;border-radius:10px;background:#FFF7F7;color:#F63237;font-size:13px;font-weight:600;line-height:1.45;letter-spacing:-.02em">'+notice+'</div>');
          clearInterval(_cutPayNoticeTimer);
        },200);
        // 무통장
        $('[name="bankSender"]').val($('[name="orderName"]').val());
        $('[name="bankAccount"]').val(1);
        break;
      case '/member/join_agreement.php':
        setTimeout(()=>{
          $('#btnPrevStep').off('click').on('click',function(e){e.preventDefault();location.href='/member/login.php';});
          if(!$('.agree_headline').length){$('.join_agreement_cont').first().before('<h2 class="agree_headline">'+_ct('12cut 이용을 위한')+'<br>'+_ct('약관에 동의해주세요.')+'</h2>');}
          // 12cut 전용 문구는 공용 사전(bd2 기반)에 없어 $t로는 번역 안 됨 → 로컬 보강맵(_cutPageTx)으로 치환. 약관 조항 본문(.agreement_box)은 서버 법무 텍스트라 제외.
          if(_cutPageTx[_cl]){
            $('.join_agreement_cont').find('*').addBack().contents().filter(function(){return this.nodeType===3&&!$(this).parent().closest('.agreement_box,textarea,.terms_box,.scroll_box').length;}).each(function(){
              var raw=this.nodeValue,t=$.trim(raw);
              if(t&&_cutPageTx[_cl][t])this.nodeValue=raw.replace(t,_ct(t));
            });
          }
          $('.js_terms_view').each(function(){var $b=$(this);$b.find('.form_element').css('cursor','pointer').off('click.acc').on('click.acc',function(e){if($(e.target).closest('input,label,a').length)return;$b.toggleClass('open');});});
          var _syncBtn=function(){var ok=$(':checkbox.require','#formTerms').length&&!$(':checkbox.require:not(:checked)','#formTerms').length;$('#btnNextStep').toggleClass('btn--disabled',!ok);};
          $(':checkbox','#formTerms').on('change',_syncBtn);_syncBtn();
        },300);
        break;
      case '/member/join.php':
        setTimeout(()=>{
          $('.header_top').attr('data-h',$t('회원가입'));
          $('.header_top').off('click').on('click',function(e){if(this.dataset.h&&innerWidth<851&&((e.clientX||0)-this.getBoundingClientRect().left)<44&&!$(e.target).closest('a,button,input,select,label,img,[onclick],.top_member_box').length){e.preventDefault();location.href='/member/join_agreement.php?memberFl=personal';}});
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
      case '/service/faq.php':{
        $('body').addClass('body-faq');
        const _faqData={
          '자주 묻는 질문':[
            ['배송 방법 및 배송비는 어떻게 되나요?',['저희는 우체국 택배를 통해 안전하게 상품을 배송해 드립니다. 배송비는 기본 3,000원이며, 5만원 이상 구매 시 무료배송 혜택을 드리고 있습니다. 도서산간 지역은 추가 운임이 발생할 수 있습니다.']],
            ['주문 후 배송 기간은 얼마나 걸리나요?',['주문하신 상품은 결제 완료일 기준 영업일 2~3일 이내에 출고됩니다. 발송 후 배송은 영업일 기준 1~2일가량 소요될 수 있습니다. 주말 및 공휴일은 배송 기간에 포함되지 않습니다.','재고 상황이나 도서산간 지역, 택배사 사정에 따라 지연될 수 있으며, 연말연시, 대형 이벤트 기간 등 특수기에는 배송이 평소보다 지연될 수 있으니 미리 공지사항을 확인해 주세요.']],
            ['상품이 파손되어 도착했어요.',['상품 수령 후 7일 이내에 파손된 부분의 사진을 찍어 1:1 문의 게시판에 첨부하여 접수해 주세요. 확인 후 신속하게 교환 또는 환불 처리 도와드리겠습니다.']],
            ['회원가입 없이도 주문할 수 있나요?',['더 나은 서비스 제공을 위해 회원가입 후 이용 가능합니다.','회원가입은 무료이며, 마일리지 적립, 이벤트 참여 등 다양한 혜택을 받으실 수 있습니다.']],
            ['상품을 받았는데 교환이나 반품/환불이 가능한가요?',['상품 수령일로부터 7일 이내에는 교환 및 반품/환불이 가능합니다. 단, 다음의 경우에는 처리가 어렵습니다.','상품 포장이 훼손되거나 사용 흔적이 있는 경우','고객님의 부주의로 상품이 훼손되거나 가치가 감소한 경우','시간 경과에 따라 재판매가 어렵게 된 경우(예: 한정판 상품, 시간이 중요한 상품 등)','특히, 밀봉된 상품의 경우 포장(비닐 등)을 개봉하거나 상품을 사용한 경우 자세한 내용은 1:1 문의를 통해 접수해 주시면 확인 후 안내해 드리겠습니다.']],
            ['반품 비용은 어떻게 되나요?',['고객님의 단순 변심으로 인한 교환/반품 시에는 왕복 배송비가 발생합니다. 상품 불량, 오배송 등 저희 측의 귀책 사유로 인한 교환/반품 시에는 별도의 배송비가 발생하지 않습니다. 자세한 금액은 1:1 문의 접수 시 안내 드립니다.']],
            ['주문취소 했는데 언제 환불되나요?',['환불은 반품 상품이 당사에 도착하여 검수가 완료된 후 3~5 영업일 이내에 처리됩니다.','카드결제: 카드사 승인 취소까지 3~7 영업일 소요될 수 있습니다. 카드사 정책에 따라 다를 수 있습니다.','현금결제: 요청하신 계좌로 환불 처리되며, 익영업일에 입금될 수 있습니다.']]
          ],
          '상품':[
            ['상품은 어디서 제작되나요?',['12cut의 모든 상품은 두버디에서 제작됩니다.','각 상품의 제작지는 상품 상세페이지에서 확인하실 수 있으며, 엄격한 품질 관리를 통해 최상의 퀄리티를 보장합니다.']],
            ['예약 주문은 어떻게 진행되나요?',['일부 신상품은 예약 주문으로 진행될 수 있습니다.','예약 주문 시 결제는 즉시 진행되며, 상품 출고 예정일은 상품 페이지에서 안내됩니다.','출고 지연 시 개별적으로 안내 메시지를 발송해드립니다.']]
          ],
          '배송':[
            ['배송완료 상태인데 물건을 받지 못했습니다.',['먼저 해당 택배사의 배송 현황을 다시 한번 확인해 주시거나, 경비실/택배 보관함 등을 확인해 주시면 감사하겠습니다. 이후에도 상품을 받지 못하신 경우, 1:1 문의를 남겨주시면 저희가 택배사와 확인하여 빠르게 해결해 드리겠습니다.']],
            ['배송지를 변경하고 싶습니다.',['결제 완료 상태에서는 마이페이지 > 주문 내역에서 직접 배송지 변경이 가능합니다.','상품이 상품 준비 중으로 넘어간 이후에는 변경이 불가하오니, 반드시 결제 완료 상태에서 변경해 주세요.']],
            ['배송 현황은 어떻게 확인하나요?',['마이페이지 > 주문 번호 > 배송 정보에서 운송장 번호를 확인하실 수 있습니다.','발송 문자(운송장 번호) 발송 후 실시간 배송 추적이 가능합니다.']],
            ['배송 방법 및 배송비는 어떻게 되나요?',['저희는 우체국 택배를 통해 안전하게 상품을 배송해 드립니다. 배송비는 기본 3,000원이며, 5만원 이상 구매 시 무료배송 혜택을 드리고 있습니다. 도서산간 지역은 추가 운임이 발생할 수 있습니다.']],
            ['주문 후 배송 기간은 얼마나 걸리나요?',['주문하신 상품은 결제 완료일 기준 영업일 2~3일 이내에 출고됩니다. 발송 후 배송은 영업일 기준 1~2일가량 소요될 수 있습니다. 주말 및 공휴일은 배송 기간에 포함되지 않습니다.','재고 상황이나 도서산간 지역, 택배사 사정에 따라 지연될 수 있으며, 연말연시, 대형 이벤트 기간 등 특수기에는 배송이 평소보다 지연될 수 있으니 미리 공지사항을 확인해 주세요.']],
            ['상품이 파손되어 도착했어요.',['상품 수령 후 7일 이내에 파손된 부분의 사진을 찍어 1:1 문의 게시판에 첨부하여 접수해 주세요. 확인 후 신속하게 교환 또는 환불 처리 도와드리겠습니다.']]
          ],
          '교환/반품/환불':[
            ['환불이 완료되면 어떤 방법으로 알 수 있나요?',['환불 처리가 완료되면 고객님의 가입 시 등록된 휴대폰 번호로 알림 메시지가 발송됩니다. 마이페이지에서도 환불 진행 상황을 확인하실 수 있습니다.']],
            ['예약 상품 취소는 어떻게 되나요?',['예약/취소 기간 내 취소','구매 후 7일 이내: 전액 환불 가능','결제 수단에 따라 10% 위약금 발생 가능','예약/취소 기간 후 취소','결제 시점과 상관없이 20% 위약금 적용','배송 시작 전까지만 취소 가능','배송 시작 후','주문 취소 불가능','반품을 통한 취소만 가능','반품 처리 시 20% 위약금 제외 후 환불','중요 안내','상품별로 예약/취소 기간이 다를 수 있습니다','하자에 대한 기준은 품목별로 상이하니 1:1 문의를 통해 문의해주세요.']],
            ['상품을 받았는데 교환이나 반품/환불이 가능한가요?',['상품 수령일로부터 7일 이내에는 교환 및 반품/환불이 가능합니다. 단, 다음의 경우에는 처리가 어렵습니다.','상품 포장이 훼손되거나 사용 흔적이 있는 경우','고객님의 부주의로 상품이 훼손되거나 가치가 감소한 경우','시간 경과에 따라 재판매가 어렵게 된 경우(예: 한정판 상품, 시간이 중요한 상품 등)','특히, 밀봉된 상품의 경우 포장(비닐 등)을 개봉하거나 상품을 사용한 경우 자세한 내용은 1:1 문의를 통해 접수해 주시면 확인 후 안내해 드리겠습니다.']],
            ['반품 비용은 어떻게 되나요?',['고객님의 단순 변심으로 인한 교환/반품 시에는 왕복 배송비가 발생합니다. 상품 불량, 오배송 등 저희 측의 귀책 사유로 인한 교환/반품 시에는 별도의 배송비가 발생하지 않습니다. 자세한 금액은 1:1 문의 접수 시 안내 드립니다.']],
            ['주문취소 했는데 언제 환불되나요?',['환불은 반품 상품이 당사에 도착하여 검수가 완료된 후 3~5 영업일 이내에 처리됩니다.','카드결제: 카드사 승인 취소까지 3~7 영업일 소요될 수 있습니다. 카드사 정책에 따라 다를 수 있습니다.','현금결제: 요청하신 계좌로 환불 처리되며, 익영업일에 입금될 수 있습니다.']]
          ],
          '마일리지 적립':[
            ['마일리지 적립은 언제 되나요?',['구매 확정 후 익일에 자동 적립됩니다.','교환/반품 시에는 해당 마일리지가 차감되며, 이미 사용한 경우 환불 금액에서 차감됩니다.']]
          ],
          '기타':[
            ['본인 명의 휴대폰이 해지되었는데 어떻게 하죠?',['본인 확인이 어려워 자동 찾기는 불가합니다. 1:1 문의 게시판에 본인 확인 가능한 정보를 남겨주시면 도움 드리겠습니다.']],
            ['결제수단 변경 가능한가요?',['죄송하지만, 결제 완료 후에는 결제 수단 변경이 어렵습니다. 결제 수단 변경을 원하시면 기존 주문을 취소하신 후 원하시는 결제 수단으로 재주문 해주셔야 합니다.']],
            ['여러 개를 주문했는데 일부만 취소하고 싶습니다.',['부분 취소는 마이페이지에서 직접 지원되지 않을 수 있습니다. 1:1 문의를 통해 취소하고자 하는 상품명과 수량을 정확히 알려주시면, 확인 후 부분 취소를 도와드리겠습니다.']],
            ['주문을 취소하고 싶습니다.',['결제 완료 상태에서 배송 준비 중으로 변경되기 전까지는 마이페이지 > 주문 내역에서 직접 취소가 가능합니다. 이미 배송 준비 중이거나 배송 중인 경우, 1:1 문의를 통해 취소 가능 여부 및 방법을 확인해 주세요. 단, 배송이 시작된 후에는 취소가 어려울 수 있습니다.']],
            ['주문 진행 상태는 어떻게 알 수 있나요?',['마이페이지 > 주문 내역에서 고객님의 주문 상태를 실시간으로 확인하실 수 있습니다. 각 상태(결제 대기, 배송 준비 중, 배송 중, 배송 완료)에 대한 자세한 설명도 함께 확인 가능합니다.']],
            ['재가입은 가능한가요?',['네, 가능합니다. 단, 탈퇴 후 일정 기간 재가입 제한이 있을 수 있습니다.']],
            ['회원 탈퇴는 어떻게 하나요?',['마이페이지 > 회원 정보 수정에서 회원 탈퇴 버튼으로 가능합니다. 탈퇴 시 개인정보 및 구매 기록은 관계 법령에 따라 보관 후 파기됩니다.']],
            ['아이디/비밀번호를 잊어버렸어요.',['로그인 화면 하단의 아이디 찾기 또는 비밀번호 찾기를 통해 본인 인증 후 확인 및 재설정이 가능합니다. 문제가 지속될 경우 1:1 문의를 남겨주시면 빠르게 도움 드리겠습니다.']],
            ['회원가입은 어떻게 하나요?',['사이트 상단의 회원가입 버튼을 통해 약관 동의 후 본인 명의 휴대폰 인증을 거쳐 가입하실 수 있습니다.']],
            ['고객센터 운영시간은 어떻게 되나요?',['운영시간: 평일 오전 10시 ~ 오후 5시','점심시간: 오후 12시 30분 ~ 오후 1시 30분','휴무: 주말, 공휴일']],
            ['대량 주문이 가능한가요?',['기업 고객 및 대량 주문을 원하시는 경우 별도 문의를 통해 맞춤 서비스를 제공합니다.','수량에 따른 할인 혜택 및 전용 배송 서비스를 이용하실 수 있습니다.']],
            ['개인정보는 안전하게 관리되나요?',['12cut은 개인정보보호법에 따라 고객님의 개인정보를 안전하게 관리합니다.','SSL 보안 인증서를 통한 암호화 통신으로 결제 정보를 보호하며, 개인정보 처리방침은 사이트 하단에서 확인하실 수 있습니다.']],
            ['회원가입 없이도 주문할 수 있나요?',['더 나은 서비스 제공을 위해 회원가입 후 이용 가능합니다.','회원가입은 무료이며, 마일리지 적립, 이벤트 참여 등 다양한 혜택을 받으실 수 있습니다.']]
          ]
        };
        const _esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const _faqLang=(localStorage.$mylang||'ko').slice(0,2);
        const _faqTx={
          en:{
            '배송 방법 및 배송비는 어떻게 되나요?':'What shipping method do you use and how much is shipping?',
            '저희는 우체국 택배를 통해 안전하게 상품을 배송해 드립니다. 배송비는 기본 3,000원이며, 5만원 이상 구매 시 무료배송 혜택을 드리고 있습니다. 도서산간 지역은 추가 운임이 발생할 수 있습니다.':'We ship safely via Korea Post parcel service. The standard shipping fee is KRW 3,000, and orders over KRW 50,000 qualify for free shipping. Additional charges may apply for remote or island areas.',
            '주문 후 배송 기간은 얼마나 걸리나요?':'How long does delivery take after ordering?',
            '주문하신 상품은 결제 완료일 기준 영업일 2~3일 이내에 출고됩니다. 발송 후 배송은 영업일 기준 1~2일가량 소요될 수 있습니다. 주말 및 공휴일은 배송 기간에 포함되지 않습니다.':'Orders are shipped within 2 to 3 business days after payment is completed. Delivery usually takes another 1 to 2 business days after dispatch. Weekends and holidays are not included in the delivery period.',
            '재고 상황이나 도서산간 지역, 택배사 사정에 따라 지연될 수 있으며, 연말연시, 대형 이벤트 기간 등 특수기에는 배송이 평소보다 지연될 수 있으니 미리 공지사항을 확인해 주세요.':'Delivery may be delayed depending on inventory, remote-area delivery, or courier conditions. During peak seasons such as year-end holidays or major events, shipping may take longer than usual, so please check notices in advance.',
            '상품이 파손되어 도착했어요.':'My item arrived damaged.',
            '상품 수령 후 7일 이내에 파손된 부분의 사진을 찍어 1:1 문의 게시판에 첨부하여 접수해 주세요. 확인 후 신속하게 교환 또는 환불 처리 도와드리겠습니다.':'Within 7 days of receiving the item, please take photos of the damaged parts and attach them to a 1:1 inquiry. After review, we will help with an exchange or refund as quickly as possible.',
            '회원가입 없이도 주문할 수 있나요?':'Can I order without signing up?',
            '더 나은 서비스 제공을 위해 회원가입 후 이용 가능합니다.':'To provide better service, orders are available after signing up.',
            '회원가입은 무료이며, 마일리지 적립, 이벤트 참여 등 다양한 혜택을 받으실 수 있습니다.':'Membership is free and includes benefits such as mileage rewards and event participation.',
            '상품을 받았는데 교환이나 반품/환불이 가능한가요?':'Can I exchange, return, or refund an item after receiving it?',
            '상품 수령일로부터 7일 이내에는 교환 및 반품/환불이 가능합니다. 단, 다음의 경우에는 처리가 어렵습니다.':'Exchanges, returns, and refunds are available within 7 days of receiving the item. However, they may not be possible in the following cases.',
            '상품 포장이 훼손되거나 사용 흔적이 있는 경우':'The product packaging is damaged or there are signs of use.',
            '고객님의 부주의로 상품이 훼손되거나 가치가 감소한 경우':'The item is damaged or its value has decreased due to customer negligence.',
            '시간 경과에 따라 재판매가 어렵게 된 경우(예: 한정판 상품, 시간이 중요한 상품 등)':'The item has become difficult to resell over time, such as limited-edition or time-sensitive products.',
            '특히, 밀봉된 상품의 경우 포장(비닐 등)을 개봉하거나 상품을 사용한 경우 자세한 내용은 1:1 문의를 통해 접수해 주시면 확인 후 안내해 드리겠습니다.':'For sealed items, exchanges or returns may be restricted if the packaging, such as vinyl wrapping, has been opened or the item has been used. Please submit a 1:1 inquiry for details.',
            '반품 비용은 어떻게 되나요?':'How much is the return shipping fee?',
            '고객님의 단순 변심으로 인한 교환/반품 시에는 왕복 배송비가 발생합니다. 상품 불량, 오배송 등 저희 측의 귀책 사유로 인한 교환/반품 시에는 별도의 배송비가 발생하지 않습니다. 자세한 금액은 1:1 문의 접수 시 안내 드립니다.':'For exchanges or returns due to a change of mind, round-trip shipping fees apply. If the issue is caused by us, such as a defective or incorrect item, no separate shipping fee is charged. The exact amount will be provided through a 1:1 inquiry.',
            '주문취소 했는데 언제 환불되나요?':'When will I receive a refund after canceling my order?',
            '환불은 반품 상품이 당사에 도착하여 검수가 완료된 후 3~5 영업일 이내에 처리됩니다.':'Refunds are processed within 3 to 5 business days after the returned item arrives and inspection is completed.',
            '카드결제: 카드사 승인 취소까지 3~7 영업일 소요될 수 있습니다. 카드사 정책에 따라 다를 수 있습니다.':'Card payment: It may take 3 to 7 business days for the card approval to be canceled, depending on the card company policy.',
            '현금결제: 요청하신 계좌로 환불 처리되며, 익영업일에 입금될 수 있습니다.':'Cash payment: The refund will be sent to the requested account and may be deposited on the next business day.',
            '상품은 어디서 제작되나요?':'Where are the products made?',
            '12cut의 모든 상품은 두버디에서 제작됩니다.':'All 12cut products are made by Dobuddy.',
            '각 상품의 제작지는 상품 상세페이지에서 확인하실 수 있으며, 엄격한 품질 관리를 통해 최상의 퀄리티를 보장합니다.':'You can check each product origin on the product detail page. We maintain strict quality control to ensure the best possible quality.',
            '예약 주문은 어떻게 진행되나요?':'How do pre-orders work?',
            '일부 신상품은 예약 주문으로 진행될 수 있습니다.':'Some new products may be sold through pre-order.',
            '예약 주문 시 결제는 즉시 진행되며, 상품 출고 예정일은 상품 페이지에서 안내됩니다.':'Payment is completed immediately when placing a pre-order, and the expected shipping date is shown on the product page.',
            '출고 지연 시 개별적으로 안내 메시지를 발송해드립니다.':'If shipment is delayed, we will send an individual notification.',
            '배송완료 상태인데 물건을 받지 못했습니다.':'The order says delivered, but I have not received it.',
            '먼저 해당 택배사의 배송 현황을 다시 한번 확인해 주시거나, 경비실/택배 보관함 등을 확인해 주시면 감사하겠습니다. 이후에도 상품을 받지 못하신 경우, 1:1 문의를 남겨주시면 저희가 택배사와 확인하여 빠르게 해결해 드리겠습니다.':'Please first check the courier tracking status again, as well as locations such as the security office or parcel locker. If you still cannot find the item, leave a 1:1 inquiry and we will check with the courier to resolve it quickly.',
            '배송지를 변경하고 싶습니다.':'I want to change my shipping address.',
            '결제 완료 상태에서는 마이페이지 > 주문 내역에서 직접 배송지 변경이 가능합니다.':'If the order is still in payment completed status, you can change the shipping address from My Page > Order History.',
            '상품이 상품 준비 중으로 넘어간 이후에는 변경이 불가하오니, 반드시 결제 완료 상태에서 변경해 주세요.':'Once the item moves to preparing product status, the address can no longer be changed. Please make changes while the order is still in payment completed status.',
            '배송 현황은 어떻게 확인하나요?':'How can I check the delivery status?',
            '마이페이지 > 주문 번호 > 배송 정보에서 운송장 번호를 확인하실 수 있습니다.':'You can check the tracking number under My Page > Order Number > Shipping Information.',
            '발송 문자(운송장 번호) 발송 후 실시간 배송 추적이 가능합니다.':'Real-time tracking is available after the shipping notification with tracking number is sent.',
            '환불이 완료되면 어떤 방법으로 알 수 있나요?':'How will I know when my refund is complete?',
            '환불 처리가 완료되면 고객님의 가입 시 등록된 휴대폰 번호로 알림 메시지가 발송됩니다. 마이페이지에서도 환불 진행 상황을 확인하실 수 있습니다.':'When the refund is completed, a notification will be sent to the phone number registered with your account. You can also check the refund status in My Page.',
            '예약 상품 취소는 어떻게 되나요?':'How are pre-order cancellations handled?',
            '예약/취소 기간 내 취소':'Cancellation within the pre-order cancellation period',
            '구매 후 7일 이내: 전액 환불 가능':'Within 7 days of purchase: full refund available',
            '결제 수단에 따라 10% 위약금 발생 가능':'A 10% cancellation fee may apply depending on the payment method',
            '예약/취소 기간 후 취소':'Cancellation after the pre-order cancellation period',
            '결제 시점과 상관없이 20% 위약금 적용':'A 20% cancellation fee applies regardless of payment timing',
            '배송 시작 전까지만 취소 가능':'Cancellation is only available before shipping begins',
            '배송 시작 후':'After shipping begins',
            '주문 취소 불가능':'Order cancellation is not available',
            '반품을 통한 취소만 가능':'Cancellation is only possible through return processing',
            '반품 처리 시 20% 위약금 제외 후 환불':'Refund is issued after deducting a 20% cancellation fee during return processing',
            '중요 안내':'Important notice',
            '상품별로 예약/취소 기간이 다를 수 있습니다':'The pre-order and cancellation period may differ by product.',
            '하자에 대한 기준은 품목별로 상이하니 1:1 문의를 통해 문의해주세요.':'Defect criteria may differ by item, so please contact us through a 1:1 inquiry.',
            '마일리지 적립은 언제 되나요?':'When is mileage credited?',
            '구매 확정 후 익일에 자동 적립됩니다.':'Mileage is automatically credited the day after purchase confirmation.',
            '교환/반품 시에는 해당 마일리지가 차감되며, 이미 사용한 경우 환불 금액에서 차감됩니다.':'For exchanges or returns, the mileage is deducted. If it has already been used, it will be deducted from the refund amount.',
            '본인 명의 휴대폰이 해지되었는데 어떻게 하죠?':'What if the phone under my name has been canceled?',
            '본인 확인이 어려워 자동 찾기는 불가합니다. 1:1 문의 게시판에 본인 확인 가능한 정보를 남겨주시면 도움 드리겠습니다.':'Automatic lookup is not available because identity verification is difficult. Please leave identity-verifiable information through a 1:1 inquiry and we will help.',
            '결제수단 변경 가능한가요?':'Can I change my payment method?',
            '죄송하지만, 결제 완료 후에는 결제 수단 변경이 어렵습니다. 결제 수단 변경을 원하시면 기존 주문을 취소하신 후 원하시는 결제 수단으로 재주문 해주셔야 합니다.':'Unfortunately, the payment method cannot be changed after payment is completed. To use another payment method, please cancel the existing order and place a new order.',
            '여러 개를 주문했는데 일부만 취소하고 싶습니다.':'I ordered multiple items and want to cancel only some of them.',
            '부분 취소는 마이페이지에서 직접 지원되지 않을 수 있습니다. 1:1 문의를 통해 취소하고자 하는 상품명과 수량을 정확히 알려주시면, 확인 후 부분 취소를 도와드리겠습니다.':'Partial cancellation may not be supported directly in My Page. Please submit the product name and quantity you want to cancel through a 1:1 inquiry, and we will help after checking.',
            '주문을 취소하고 싶습니다.':'I want to cancel my order.',
            '결제 완료 상태에서 배송 준비 중으로 변경되기 전까지는 마이페이지 > 주문 내역에서 직접 취소가 가능합니다. 이미 배송 준비 중이거나 배송 중인 경우, 1:1 문의를 통해 취소 가능 여부 및 방법을 확인해 주세요. 단, 배송이 시작된 후에는 취소가 어려울 수 있습니다.':'You can cancel directly from My Page > Order History while the order is in payment completed status and before it changes to preparing shipment. If it is already preparing shipment or in transit, please submit a 1:1 inquiry to check whether cancellation is possible. Once shipping has started, cancellation may not be possible.',
            '주문 진행 상태는 어떻게 알 수 있나요?':'How can I check my order status?',
            '마이페이지 > 주문 내역에서 고객님의 주문 상태를 실시간으로 확인하실 수 있습니다. 각 상태(결제 대기, 배송 준비 중, 배송 중, 배송 완료)에 대한 자세한 설명도 함께 확인 가능합니다.':'You can check your order status in real time from My Page > Order History. Details for each status, such as pending payment, preparing shipment, in transit, and delivered, are also available.',
            '재가입은 가능한가요?':'Can I sign up again?',
            '네, 가능합니다. 단, 탈퇴 후 일정 기간 재가입 제한이 있을 수 있습니다.':'Yes, you can. However, sign-up may be restricted for a certain period after account deletion.',
            '회원 탈퇴는 어떻게 하나요?':'How do I delete my account?',
            '마이페이지 > 회원 정보 수정에서 회원 탈퇴 버튼으로 가능합니다. 탈퇴 시 개인정보 및 구매 기록은 관계 법령에 따라 보관 후 파기됩니다.':'You can delete your account from My Page > Edit Member Information. Upon deletion, personal information and purchase records are stored and deleted according to applicable laws.',
            '아이디/비밀번호를 잊어버렸어요.':'I forgot my ID or password.',
            '로그인 화면 하단의 아이디 찾기 또는 비밀번호 찾기를 통해 본인 인증 후 확인 및 재설정이 가능합니다. 문제가 지속될 경우 1:1 문의를 남겨주시면 빠르게 도움 드리겠습니다.':'Use Find ID or Find Password at the bottom of the login screen to verify your identity and check or reset your information. If the problem continues, leave a 1:1 inquiry and we will help quickly.',
            '회원가입은 어떻게 하나요?':'How do I sign up?',
            '사이트 상단의 회원가입 버튼을 통해 약관 동의 후 본인 명의 휴대폰 인증을 거쳐 가입하실 수 있습니다.':'Click the Sign Up button at the top of the site, agree to the terms, and complete phone verification under your own name.',
            '고객센터 운영시간은 어떻게 되나요?':'What are customer center hours?',
            '운영시간: 평일 오전 10시 ~ 오후 5시':'Hours: Weekdays 10:00 AM to 5:00 PM',
            '점심시간: 오후 12시 30분 ~ 오후 1시 30분':'Lunch break: 12:30 PM to 1:30 PM',
            '휴무: 주말, 공휴일':'Closed: Weekends and holidays',
            '대량 주문이 가능한가요?':'Can I place a bulk order?',
            '기업 고객 및 대량 주문을 원하시는 경우 별도 문의를 통해 맞춤 서비스를 제공합니다.':'For corporate customers or bulk orders, we provide customized service through separate inquiry.',
            '수량에 따른 할인 혜택 및 전용 배송 서비스를 이용하실 수 있습니다.':'Quantity-based discounts and dedicated shipping service may be available.',
            '개인정보는 안전하게 관리되나요?':'Is my personal information managed safely?',
            '12cut은 개인정보보호법에 따라 고객님의 개인정보를 안전하게 관리합니다.':'12cut manages your personal information safely in accordance with the Personal Information Protection Act.',
            'SSL 보안 인증서를 통한 암호화 통신으로 결제 정보를 보호하며, 개인정보 처리방침은 사이트 하단에서 확인하실 수 있습니다.':'Payment information is protected through encrypted communication using an SSL certificate, and the privacy policy is available at the bottom of the site.'
          }
        };
        _faqTx.ja={
          '배송 방법 및 배송비는 어떻게 되나요?':'配送方法と送料はどうなりますか？','저희는 우체국 택배를 통해 안전하게 상품을 배송해 드립니다. 배송비는 기본 3,000원이며, 5만원 이상 구매 시 무료배송 혜택을 드리고 있습니다. 도서산간 지역은 추가 운임이 발생할 수 있습니다.':'商品は郵便局の宅配便で安全にお届けします。基本送料は3,000ウォンで、5万ウォン以上のご購入で送料無料となります。離島・山間部は追加送料が発生する場合があります。','주문 후 배송 기간은 얼마나 걸리나요?':'注文後、配送にはどのくらいかかりますか？','상품이 파손되어 도착했어요.':'商品が破損した状態で届きました。','회원가입 없이도 주문할 수 있나요?':'会員登録なしで注文できますか？','상품을 받았는데 교환이나 반품/환불이 가능한가요?':'商品受け取り後、交換・返品・返金はできますか？','반품 비용은 어떻게 되나요?':'返品送料はどうなりますか？','주문취소 했는데 언제 환불되나요?':'注文をキャンセルした場合、返金はいつ行われますか？','상품은 어디서 제작되나요?':'商品はどこで製作されますか？','12cut의 모든 상품은 두버디에서 제작됩니다.':'12cutのすべての商品はDobuddyで製作されています。','예약 주문은 어떻게 진행되나요?':'予約注文はどのように進みますか？','배송완료 상태인데 물건을 받지 못했습니다.':'配送完了になっていますが、商品を受け取っていません。','배송지를 변경하고 싶습니다.':'配送先を変更したいです。','배송 현황은 어떻게 확인하나요?':'配送状況はどこで確認できますか？','환불이 완료되면 어떤 방법으로 알 수 있나요?':'返金完了はどのように確認できますか？','예약 상품 취소는 어떻게 되나요?':'予約商品のキャンセルはどうなりますか？','마일리지 적립은 언제 되나요?':'マイレージはいつ付与されますか？','본인 명의 휴대폰이 해지되었는데 어떻게 하죠?':'本人名義の携帯電話が解約されている場合はどうすればよいですか？','결제수단 변경 가능한가요?':'支払い方法の変更はできますか？','여러 개를 주문했는데 일부만 취소하고 싶습니다.':'複数注文した商品の一部だけをキャンセルしたいです。','주문을 취소하고 싶습니다.':'注文をキャンセルしたいです。','주문 진행 상태는 어떻게 알 수 있나요?':'注文状況はどこで確認できますか？','재가입은 가능한가요?':'再登録はできますか？','회원 탈퇴는 어떻게 하나요?':'退会はどのように行いますか？','아이디/비밀번호를 잊어버렸어요.':'IDまたはパスワードを忘れました。','회원가입은 어떻게 하나요?':'会員登録はどのように行いますか？','고객센터 운영시간은 어떻게 되나요?':'カスタマーセンターの営業時間は？','대량 주문이 가능한가요?':'大量注文は可能ですか？','개인정보는 안전하게 관리되나요?':'個人情報は安全に管理されていますか？'
        };
        _faqTx.zh={
          '배송 방법 및 배송비는 어떻게 되나요?':'配送方式和运费是怎样的？','저희는 우체국 택배를 통해 안전하게 상품을 배송해 드립니다. 배송비는 기본 3,000원이며, 5만원 이상 구매 시 무료배송 혜택을 드리고 있습니다. 도서산간 지역은 추가 운임이 발생할 수 있습니다.':'我们通过邮局快递安全配送商品。基础运费为3,000韩元，购买满50,000韩元可享受免运费。偏远或岛屿地区可能产生额外运费。','주문 후 배송 기간은 얼마나 걸리나요?':'下单后配送需要多久？','상품이 파손되어 도착했어요.':'商品到达时已经破损。','회원가입 없이도 주문할 수 있나요?':'不注册会员也可以下单吗？','상품을 받았는데 교환이나 반품/환불이 가능한가요?':'收到商品后可以换货、退货或退款吗？','반품 비용은 어떻게 되나요?':'退货费用是多少？','주문취소 했는데 언제 환불되나요?':'取消订单后什么时候退款？','상품은 어디서 제작되나요?':'商品在哪里制作？','12cut의 모든 상품은 두버디에서 제작됩니다.':'12cut的所有商品均由Dobuddy制作。','예약 주문은 어떻게 진행되나요?':'预售订单如何进行？','배송완료 상태인데 물건을 받지 못했습니다.':'显示已送达，但我没有收到商品。','배송지를 변경하고 싶습니다.':'我想更改收货地址。','배송 현황은 어떻게 확인하나요?':'如何确认配送状态？','환불이 완료되면 어떤 방법으로 알 수 있나요?':'退款完成后如何通知？','예약 상품 취소는 어떻게 되나요?':'预售商品如何取消？','마일리지 적립은 언제 되나요?':'积分什么时候到账？','본인 명의 휴대폰이 해지되었는데 어떻게 하죠?':'本人名义的手机已停用怎么办？','결제수단 변경 가능한가요?':'可以更改支付方式吗？','여러 개를 주문했는데 일부만 취소하고 싶습니다.':'我订购了多个商品，只想取消其中一部分。','주문을 취소하고 싶습니다.':'我想取消订单。','주문 진행 상태는 어떻게 알 수 있나요?':'如何确认订单进度？','재가입은 가능한가요?':'可以重新注册吗？','회원 탈퇴는 어떻게 하나요?':'如何注销会员？','아이디/비밀번호를 잊어버렸어요.':'忘记了账号或密码。','회원가입은 어떻게 하나요?':'如何注册会员？','고객센터 운영시간은 어떻게 되나요?':'客服中心营业时间是怎样的？','대량 주문이 가능한가요?':'可以大量订购吗？','개인정보는 안전하게 관리되나요?':'个人信息是否安全管理？'
        };
        Object.assign(_faqTx.ja,{
          '주문하신 상품은 결제 완료일 기준 영업일 2~3일 이내에 출고됩니다. 발송 후 배송은 영업일 기준 1~2일가량 소요될 수 있습니다. 주말 및 공휴일은 배송 기간에 포함되지 않습니다.':'ご注文商品は決済完了日を基準に、営業日2〜3日以内に出荷されます。出荷後の配送には営業日1〜2日ほどかかる場合があります。週末および祝日は配送期間に含まれません。',
          '재고 상황이나 도서산간 지역, 택배사 사정에 따라 지연될 수 있으며, 연말연시, 대형 이벤트 기간 등 특수기에는 배송이 평소보다 지연될 수 있으니 미리 공지사항을 확인해 주세요.':'在庫状況、離島・山間部、配送会社の事情により遅延する場合があります。年末年始や大型イベント期間などは通常より配送が遅れることがあるため、事前にお知らせをご確認ください。',
          '상품 수령 후 7일 이내에 파손된 부분의 사진을 찍어 1:1 문의 게시판에 첨부하여 접수해 주세요. 확인 후 신속하게 교환 또는 환불 처리 도와드리겠습니다.':'商品受け取り後7日以内に破損部分の写真を撮影し、1:1お問い合わせに添付してご連絡ください。確認後、速やかに交換または返金をサポートいたします。',
          '더 나은 서비스 제공을 위해 회원가입 후 이용 가능합니다.':'より良いサービス提供のため、会員登録後にご利用いただけます。',
          '회원가입은 무료이며, 마일리지 적립, 이벤트 참여 등 다양한 혜택을 받으실 수 있습니다.':'会員登録は無料で、マイレージ付与やイベント参加などさまざまな特典をご利用いただけます。',
          '상품 수령일로부터 7일 이내에는 교환 및 반품/환불이 가능합니다. 단, 다음의 경우에는 처리가 어렵습니다.':'商品受け取り日から7日以内であれば、交換および返品・返金が可能です。ただし、次の場合は対応が難しい場合があります。',
          '상품 포장이 훼손되거나 사용 흔적이 있는 경우':'商品パッケージが破損している、または使用跡がある場合',
          '고객님의 부주의로 상품이 훼손되거나 가치가 감소한 경우':'お客様の不注意により商品が破損した、または価値が低下した場合',
          '시간 경과에 따라 재판매가 어렵게 된 경우(예: 한정판 상품, 시간이 중요한 상품 등)':'時間の経過により再販売が難しくなった場合（例：限定商品、時期が重要な商品など）',
          '특히, 밀봉된 상품의 경우 포장(비닐 등)을 개봉하거나 상품을 사용한 경우 자세한 내용은 1:1 문의를 통해 접수해 주시면 확인 후 안내해 드리겠습니다.':'特に密封商品の場合、包装（ビニール等）を開封したり商品を使用した場合は制限されることがあります。詳細は1:1お問い合わせよりご連絡ください。',
          '고객님의 단순 변심으로 인한 교환/반품 시에는 왕복 배송비가 발생합니다. 상품 불량, 오배송 등 저희 측의 귀책 사유로 인한 교환/반품 시에는 별도의 배송비가 발생하지 않습니다. 자세한 금액은 1:1 문의 접수 시 안내 드립니다.':'お客様都合による交換・返品の場合、往復送料が発生します。商品不良や誤配送など当社都合の場合、別途送料は発生しません。詳しい金額は1:1お問い合わせ時にご案内します。',
          '환불은 반품 상품이 당사에 도착하여 검수가 완료된 후 3~5 영업일 이내에 처리됩니다.':'返金は返品商品が当社に到着し、検品が完了した後、営業日3〜5日以内に処理されます。',
          '카드결제: 카드사 승인 취소까지 3~7 영업일 소요될 수 있습니다. 카드사 정책에 따라 다를 수 있습니다.':'カード決済：カード会社の承認取消まで営業日3〜7日かかる場合があります。カード会社の方針により異なります。',
          '현금결제: 요청하신 계좌로 환불 처리되며, 익영업일에 입금될 수 있습니다.':'現金決済：ご指定の口座へ返金処理され、翌営業日に入金される場合があります。',
          '각 상품의 제작지는 상품 상세페이지에서 확인하실 수 있으며, 엄격한 품질 관리를 통해 최상의 퀄리티를 보장합니다.':'各商品の製作地は商品詳細ページで確認できます。厳格な品質管理により高い品質を保っています。',
          '일부 신상품은 예약 주문으로 진행될 수 있습니다.':'一部の新商品は予約注文として販売される場合があります。',
          '예약 주문 시 결제는 즉시 진행되며, 상품 출고 예정일은 상품 페이지에서 안내됩니다.':'予約注文時、決済はすぐに行われ、出荷予定日は商品ページで案内されます。',
          '출고 지연 시 개별적으로 안내 메시지를 발송해드립니다.':'出荷が遅れる場合は、個別にご案内メッセージをお送りします。',
          '먼저 해당 택배사의 배송 현황을 다시 한번 확인해 주시거나, 경비실/택배 보관함 등을 확인해 주시면 감사하겠습니다. 이후에도 상품을 받지 못하신 경우, 1:1 문의를 남겨주시면 저희가 택배사와 확인하여 빠르게 해결해 드리겠습니다.':'まず配送会社の追跡状況、管理室や宅配ボックスなどをご確認ください。それでも商品が見つからない場合は、1:1お問い合わせを残していただければ配送会社に確認し、迅速に対応します。',
          '결제 완료 상태에서는 마이페이지 > 주문 내역에서 직접 배송지 변경이 가능합니다.':'決済完了状態では、マイページ > 注文履歴から配送先を直接変更できます。',
          '상품이 상품 준비 중으로 넘어간 이후에는 변경이 불가하오니, 반드시 결제 완료 상태에서 변경해 주세요.':'商品準備中に進んだ後は変更できません。必ず決済完了状態で変更してください。',
          '마이페이지 > 주문 번호 > 배송 정보에서 운송장 번호를 확인하실 수 있습니다.':'マイページ > 注文番号 > 配送情報で送り状番号を確認できます。',
          '발송 문자(운송장 번호) 발송 후 실시간 배송 추적이 가능합니다.':'発送案内（送り状番号）送信後、リアルタイム配送追跡が可能です。',
          '환불 처리가 완료되면 고객님의 가입 시 등록된 휴대폰 번호로 알림 메시지가 발송됩니다. 마이페이지에서도 환불 진행 상황을 확인하실 수 있습니다.':'返金処理が完了すると、登録済みの携帯電話番号へ通知メッセージが送信されます。マイページでも返金状況を確認できます。',
          '예약/취소 기간 내 취소':'予約・キャンセル期間内のキャンセル','구매 후 7일 이내: 전액 환불 가능':'購入後7日以内：全額返金可能','결제 수단에 따라 10% 위약금 발생 가능':'決済手段により10%の違約金が発生する場合があります','예약/취소 기간 후 취소':'予約・キャンセル期間後のキャンセル','결제 시점과 상관없이 20% 위약금 적용':'決済時点に関係なく20%の違約金が適用されます','배송 시작 전까지만 취소 가능':'配送開始前のみキャンセル可能','배송 시작 후':'配送開始後','주문 취소 불가능':'注文キャンセル不可','반품을 통한 취소만 가능':'返品によるキャンセルのみ可能','반품 처리 시 20% 위약금 제외 후 환불':'返品処理時、20%の違約金を差し引いて返金','중요 안내':'重要なお知らせ','상품별로 예약/취소 기간이 다를 수 있습니다':'商品ごとに予約・キャンセル期間が異なる場合があります','하자에 대한 기준은 품목별로 상이하니 1:1 문의를 통해 문의해주세요.':'不良基準は品目ごとに異なるため、1:1お問い合わせよりご連絡ください。',
          '구매 확정 후 익일에 자동 적립됩니다.':'購入確定の翌日に自動付与されます。','교환/반품 시에는 해당 마일리지가 차감되며, 이미 사용한 경우 환불 금액에서 차감됩니다.':'交換・返品時には該当マイレージが差し引かれ、すでに使用済みの場合は返金額から差し引かれます。',
          '본인 확인이 어려워 자동 찾기는 불가합니다. 1:1 문의 게시판에 본인 확인 가능한 정보를 남겨주시면 도움 드리겠습니다.':'本人確認が難しいため自動検索はできません。1:1お問い合わせに本人確認可能な情報を残していただければサポートします。',
          '죄송하지만, 결제 완료 후에는 결제 수단 변경이 어렵습니다. 결제 수단 변경을 원하시면 기존 주문을 취소하신 후 원하시는 결제 수단으로 재주문 해주셔야 합니다.':'申し訳ありませんが、決済完了後の支払い方法変更はできません。変更をご希望の場合は既存注文をキャンセルし、ご希望の支払い方法で再注文してください。',
          '부분 취소는 마이페이지에서 직접 지원되지 않을 수 있습니다. 1:1 문의를 통해 취소하고자 하는 상품명과 수량을 정확히 알려주시면, 확인 후 부분 취소를 도와드리겠습니다.':'一部キャンセルはマイページで直接対応できない場合があります。1:1お問い合わせでキャンセルしたい商品名と数量を正確にお知らせください。確認後サポートします。',
          '결제 완료 상태에서 배송 준비 중으로 변경되기 전까지는 마이페이지 > 주문 내역에서 직접 취소가 가능합니다. 이미 배송 준비 중이거나 배송 중인 경우, 1:1 문의를 통해 취소 가능 여부 및 방법을 확인해 주세요. 단, 배송이 시작된 후에는 취소가 어려울 수 있습니다.':'決済完了状態から配送準備中に変わる前までは、マイページ > 注文履歴で直接キャンセルできます。すでに配送準備中または配送中の場合は、1:1お問い合わせで可否をご確認ください。配送開始後はキャンセルが難しい場合があります。',
          '마이페이지 > 주문 내역에서 고객님의 주문 상태를 실시간으로 확인하실 수 있습니다. 각 상태(결제 대기, 배송 준비 중, 배송 중, 배송 완료)에 대한 자세한 설명도 함께 확인 가능합니다.':'マイページ > 注文履歴で注文状況をリアルタイムに確認できます。各状態（決済待ち、配送準備中、配送中、配送完了）の説明も確認できます。',
          '네, 가능합니다. 단, 탈퇴 후 일정 기간 재가입 제한이 있을 수 있습니다.':'はい、可能です。ただし退会後、一定期間は再登録が制限される場合があります。',
          '마이페이지 > 회원 정보 수정에서 회원 탈퇴 버튼으로 가능합니다. 탈퇴 시 개인정보 및 구매 기록은 관계 법령에 따라 보관 후 파기됩니다.':'マイページ > 会員情報修正から退会できます。退会時、個人情報および購入履歴は関連法令に基づき保管後、破棄されます。',
          '로그인 화면 하단의 아이디 찾기 또는 비밀번호 찾기를 통해 본인 인증 후 확인 및 재설정이 가능합니다. 문제가 지속될 경우 1:1 문의를 남겨주시면 빠르게 도움 드리겠습니다.':'ログイン画面下部のID検索またはパスワード検索から本人確認後、確認・再設定が可能です。問題が続く場合は1:1お問い合わせよりご連絡ください。',
          '사이트 상단의 회원가입 버튼을 통해 약관 동의 후 본인 명의 휴대폰 인증을 거쳐 가입하실 수 있습니다.':'サイト上部の会員登録ボタンから、規約同意後に本人名義の携帯電話認証を行って登録できます。',
          '운영시간: 평일 오전 10시 ~ 오후 5시':'営業時間：平日 午前10時〜午後5時','점심시간: 오후 12시 30분 ~ 오후 1시 30분':'昼休み：午後12時30分〜午後1時30分','휴무: 주말, 공휴일':'休業：週末・祝日',
          '기업 고객 및 대량 주문을 원하시는 경우 별도 문의를 통해 맞춤 서비스를 제공합니다.':'法人のお客様や大量注文をご希望の場合は、別途お問い合わせによりカスタム対応いたします。','수량에 따른 할인 혜택 및 전용 배송 서비스를 이용하실 수 있습니다.':'数量に応じた割引特典および専用配送サービスをご利用いただけます。',
          '12cut은 개인정보보호법에 따라 고객님의 개인정보를 안전하게 관리합니다.':'12cutは個人情報保護法に基づき、お客様の個人情報を安全に管理します。','SSL 보안 인증서를 통한 암호화 통신으로 결제 정보를 보호하며, 개인정보 처리방침은 사이트 하단에서 확인하실 수 있습니다.':'SSL証明書による暗号化通信で決済情報を保護し、個人情報処理方針はサイト下部で確認できます。'
        });
        Object.assign(_faqTx.zh,{
          '주문하신 상품은 결제 완료일 기준 영업일 2~3일 이내에 출고됩니다. 발송 후 배송은 영업일 기준 1~2일가량 소요될 수 있습니다. 주말 및 공휴일은 배송 기간에 포함되지 않습니다.':'商品将在支付完成日起2～3个工作日内发出。发出后配送通常需要1～2个工作日。周末及节假日不计入配送时间。',
          '재고 상황이나 도서산간 지역, 택배사 사정에 따라 지연될 수 있으며, 연말연시, 대형 이벤트 기간 등 특수기에는 배송이 평소보다 지연될 수 있으니 미리 공지사항을 확인해 주세요.':'根据库存、偏远地区或快递公司情况，配送可能延迟。年末年初、大型活动期间等特殊时期可能比平时更慢，请提前查看公告。',
          '상품 수령 후 7일 이내에 파손된 부분의 사진을 찍어 1:1 문의 게시판에 첨부하여 접수해 주세요. 확인 후 신속하게 교환 또는 환불 처리 도와드리겠습니다.':'收到商品后7日内，请拍摄破损部位照片并通过1:1咨询提交。确认后我们将尽快协助换货或退款。',
          '더 나은 서비스 제공을 위해 회원가입 후 이용 가능합니다.':'为提供更好的服务，需注册会员后使用。','회원가입은 무료이며, 마일리지 적립, 이벤트 참여 등 다양한 혜택을 받으실 수 있습니다.':'会员注册免费，可享受积分累积、活动参与等多种权益。',
          '상품 수령일로부터 7일 이내에는 교환 및 반품/환불이 가능합니다. 단, 다음의 경우에는 처리가 어렵습니다.':'自收到商品之日起7日内可申请换货、退货或退款。但以下情况可能无法处理。','상품 포장이 훼손되거나 사용 흔적이 있는 경우':'商品包装损坏或有使用痕迹','고객님의 부주의로 상품이 훼손되거나 가치가 감소한 경우':'因顾客疏忽导致商品损坏或价值降低','시간 경과에 따라 재판매가 어렵게 된 경우(예: 한정판 상품, 시간이 중요한 상품 등)':'因时间经过导致难以再次销售的情况（如限量商品、时效性商品等）','특히, 밀봉된 상품의 경우 포장(비닐 등)을 개봉하거나 상품을 사용한 경우 자세한 내용은 1:1 문의를 통해 접수해 주시면 확인 후 안내해 드리겠습니다.':'特别是密封商品，如已拆开包装（塑封等）或使用商品，可能受到限制。详情请通过1:1咨询提交，我们确认后 안내。',
          '고객님의 단순 변심으로 인한 교환/반품 시에는 왕복 배송비가 발생합니다. 상품 불량, 오배송 등 저희 측의 귀책 사유로 인한 교환/반품 시에는 별도의 배송비가 발생하지 않습니다. 자세한 금액은 1:1 문의 접수 시 안내 드립니다.':'因个人原因换货或退货时需承担往返运费。因商品不良、错发等我方原因造成的换货或退货不收取额外运费。具体金额将在1:1咨询中 안내。',
          '환불은 반품 상품이 당사에 도착하여 검수가 완료된 후 3~5 영업일 이내에 처리됩니다.':'退回商品到达并完成检查后，退款将在3～5个工作日内处理。','카드결제: 카드사 승인 취소까지 3~7 영업일 소요될 수 있습니다. 카드사 정책에 따라 다를 수 있습니다.':'银行卡支付：取消授权可能需要3～7个工作日，具体取决于发卡机构政策。','현금결제: 요청하신 계좌로 환불 처리되며, 익영업일에 입금될 수 있습니다.':'现金支付：退款将汇入您指定的账户，可能于下一个工作日到账。',
          '각 상품의 제작지는 상품 상세페이지에서 확인하실 수 있으며, 엄격한 품질 관리를 통해 최상의 퀄리티를 보장합니다.':'各商品产地可在商品详情页确认。我们通过严格的质量管理保证品质。','일부 신상품은 예약 주문으로 진행될 수 있습니다.':'部分新品可能以预售形式销售。','예약 주문 시 결제는 즉시 진행되며, 상품 출고 예정일은 상품 페이지에서 안내됩니다.':'预售下单时会立即付款，预计出货日期将在商品页 안내。','출고 지연 시 개별적으로 안내 메시지를 발송해드립니다.':'如出货延迟，我们将单独发送通知。',
          '먼저 해당 택배사의 배송 현황을 다시 한번 확인해 주시거나, 경비실/택배 보관함 등을 확인해 주시면 감사하겠습니다. 이후에도 상품을 받지 못하신 경우, 1:1 문의를 남겨주시면 저희가 택배사와 확인하여 빠르게 해결해 드리겠습니다.':'请先再次确认快递追踪状态，以及门卫室、快递柜等位置。如仍未收到商品，请提交1:1咨询，我们会与快递公司确认并尽快处理。',
          '결제 완료 상태에서는 마이페이지 > 주문 내역에서 직접 배송지 변경이 가능합니다.':'在支付完成状态下，可在我的页面 > 订单记录中直接更改收货地址。','상품이 상품 준비 중으로 넘어간 이후에는 변경이 불가하오니, 반드시 결제 완료 상태에서 변경해 주세요.':'商品进入准备中状态后无法更改，请务必在支付完成状态下修改。','마이페이지 > 주문 번호 > 배송 정보에서 운송장 번호를 확인하실 수 있습니다.':'可在我的页面 > 订单编号 > 配送信息中查看运单号。','발송 문자(운송장 번호) 발송 후 실시간 배송 추적이 가능합니다.':'发送包含运单号的发货短信后，可实时追踪配送。',
          '환불 처리가 완료되면 고객님의 가입 시 등록된 휴대폰 번호로 알림 메시지가 발송됩니다. 마이페이지에서도 환불 진행 상황을 확인하실 수 있습니다.':'退款处理完成后，将向注册时登记的手机号码发送通知。也可在我的页面查看退款进度。',
          '예약/취소 기간 내 취소':'预售/取消期限内取消','구매 후 7일 이내: 전액 환불 가능':'购买后7日内：可全额退款','결제 수단에 따라 10% 위약금 발생 가능':'根据支付方式可能产生10%违约金','예약/취소 기간 후 취소':'预售/取消期限后取消','결제 시점과 상관없이 20% 위약금 적용':'无论支付时间，均适用20%违约金','배송 시작 전까지만 취소 가능':'仅在开始配送前可取消','배송 시작 후':'配送开始后','주문 취소 불가능':'无法取消订单','반품을 통한 취소만 가능':'只能通过退货方式取消','반품 처리 시 20% 위약금 제외 후 환불':'退货处理时扣除20%违约金后退款','중요 안내':'重要 안내','상품별로 예약/취소 기간이 다를 수 있습니다':'各商品的预售/取消期限可能不同','하자에 대한 기준은 품목별로 상이하니 1:1 문의를 통해 문의해주세요.':'瑕疵判定标准因品类而异，请通过1:1咨询 문의。',
          '구매 확정 후 익일에 자동 적립됩니다.':'购买确认后的次日自动累积。','교환/반품 시에는 해당 마일리지가 차감되며, 이미 사용한 경우 환불 금액에서 차감됩니다.':'换货或退货时将扣除相应积分；如已使用，则从退款金额中扣除。',
          '본인 확인이 어려워 자동 찾기는 불가합니다. 1:1 문의 게시판에 본인 확인 가능한 정보를 남겨주시면 도움 드리겠습니다.':'由于难以验证本人身份，无法自动查找。请在1:1咨询中留下可验证身份的信息，我们会协助处理。','죄송하지만, 결제 완료 후에는 결제 수단 변경이 어렵습니다. 결제 수단 변경을 원하시면 기존 주문을 취소하신 후 원하시는 결제 수단으로 재주문 해주셔야 합니다.':'很抱歉，支付完成后无法更改支付方式。如需更改，请取消原订单后使用 원하는支付方式重新下单。','부분 취소는 마이페이지에서 직접 지원되지 않을 수 있습니다. 1:1 문의를 통해 취소하고자 하는 상품명과 수량을 정확히 알려주시면, 확인 후 부분 취소를 도와드리겠습니다.':'部分取消可能无法在我的页面直接操作。请通过1:1咨询准确告知要取消的商品名和数量，我们确认后协助处理。','결제 완료 상태에서 배송 준비 중으로 변경되기 전까지는 마이페이지 > 주문 내역에서 직접 취소가 가능합니다. 이미 배송 준비 중이거나 배송 중인 경우, 1:1 문의를 통해 취소 가능 여부 및 방법을 확인해 주세요. 단, 배송이 시작된 후에는 취소가 어려울 수 있습니다.':'在支付完成且尚未变为准备配送前，可在我的页面 > 订单记录中直接取消。若已准备配送或配送中，请通过1:1咨询确认是否可取消及处理方式。配送开始后可能无法取消。',
          '마이페이지 > 주문 내역에서 고객님의 주문 상태를 실시간으로 확인하실 수 있습니다. 각 상태(결제 대기, 배송 준비 중, 배송 중, 배송 완료)에 대한 자세한 설명도 함께 확인 가능합니다.':'可在我的页面 > 订单记录中实时确认订单状态，也可查看各状态（待支付、准备配送、配送中、已送达）的说明。','네, 가능합니다. 단, 탈퇴 후 일정 기간 재가입 제한이 있을 수 있습니다.':'可以。但注销后可能在一定期间内限制重新注册。','마이페이지 > 회원 정보 수정에서 회원 탈퇴 버튼으로 가능합니다. 탈퇴 시 개인정보 및 구매 기록은 관계 법령에 따라 보관 후 파기됩니다.':'可在我的页面 > 修改会员信息中点击注销会员。注销后，个人信息及购买记录将按相关法规保存后销毁。','로그인 화면 하단의 아이디 찾기 또는 비밀번호 찾기를 통해 본인 인증 후 확인 및 재설정이 가능합니다. 문제가 지속될 경우 1:1 문의를 남겨주시면 빠르게 도움 드리겠습니다.':'可通过登录页面下方的找回账号或找回密码，完成身份验证后确认或重设。如问题持续，请提交1:1咨询。','사이트 상단의 회원가입 버튼을 통해 약관 동의 후 본인 명의 휴대폰 인증을 거쳐 가입하실 수 있습니다.':'点击网站顶部的注册按钮，同意条款并完成本人名义手机验证后即可注册。',
          '운영시간: 평일 오전 10시 ~ 오후 5시':'营业时间：工作日上午10点～下午5点','점심시간: 오후 12시 30분 ~ 오후 1시 30분':'午休时间：下午12点30分～下午1点30分','휴무: 주말, 공휴일':'休息：周末及节假日','기업 고객 및 대량 주문을 원하시는 경우 별도 문의를 통해 맞춤 서비스를 제공합니다.':'企业客户或大量订购可通过单独咨询获得定制服务。','수량에 따른 할인 혜택 및 전용 배송 서비스를 이용하실 수 있습니다.':'可根据数量享受折扣及专用配送服务。','12cut은 개인정보보호법에 따라 고객님의 개인정보를 안전하게 관리합니다.':'12cut依据个人信息保护法安全管理您的个人信息。','SSL 보안 인증서를 통한 암호화 통신으로 결제 정보를 보호하며, 개인정보 처리방침은 사이트 하단에서 확인하실 수 있습니다.':'通过SSL安全证书进行加密通信以保护支付信息，个人信息处理方针可在网站底部查看。'
        });
        const _tr=s=>(_faqTx[_faqLang]&&_faqTx[_faqLang][s])||(_faqLang!='ko'&&_faqTx.en[s])||s;
        const _linkKakao=s=>{
          var h=_esc(_tr(s));
          return h
            .replace(/1:1 문의 게시판/g,'<a class="cut-kakao-inline" href="'+_kakaoTalk+'" target="_blank" rel="noopener">1:1 문의</a>')
            .replace(/1:1 문의/g,'<a class="cut-kakao-inline" href="'+_kakaoTalk+'" target="_blank" rel="noopener">1:1 문의</a>')
            .replace(/1:1お問い合わせ/g,'<a class="cut-kakao-inline" href="'+_kakaoTalk+'" target="_blank" rel="noopener">1:1 문의</a>')
            .replace(/1:1咨询/g,'<a class="cut-kakao-inline" href="'+_kakaoTalk+'" target="_blank" rel="noopener">1:1 문의</a>')
            .replace(/1:1 inquiry/g,'<a class="cut-kakao-inline" href="'+_kakaoTalk+'" target="_blank" rel="noopener">1:1 문의</a>');
        };
        const _renderFaq=tab=>{
          tab=_faqData[tab]?tab:'자주 묻는 질문';
          $('#my_custom .filter a').removeClass('on').filter(function(){return this.dataset.faqTab==tab||$(this).text().trim()==tab;}).addClass('on');
          $('#my_custom .faq').html(_faqData[tab].map((r,i)=>`<div onclick="tC2(${i})" class="li"><h3>Q. ${_esc(_tr(r[0]))}</h3><b style="display:none">${r[1].map(p=>`<p>${_linkKakao(p)}</p>`).join('')}</b></div>`).join(''));
          _wireKakaoInquiry($('#my_custom .faq')[0]);
        };
        window.tC=_renderFaq;
        window.tC2=i=>$('#my_custom .faq .li').eq(i).toggleClass('on').find('b').stop(true,true).slideToggle(150);
        let _ft=0,_fiv=setInterval(()=>{
          if(++_ft>40){clearInterval(_fiv);return;}
          if(!$('#my_custom .faq').length)return;
          clearInterval(_fiv);
          Object.keys(_faqData).forEach((tab,i)=>{$('#my_custom .filter a').eq(i).attr('data-faq-tab',tab).off('click.faq12').on('click.faq12',e=>{e.preventDefault();_renderFaq(tab);});});
          _renderFaq('자주 묻는 질문');
        },150);
        break;}
      case '/mypage/wish_list.php':
        $('body').addClass('body-mypage-wish');
        $('.header_top').attr('data-h',$t('찜한 상품'));
        setTimeout(()=>{
          $('#my_custom .list-msg').filter(function(){return $.trim($(this).text())==='찜한 상품이 없습니다.';}).text(_ct('찜한 상품이 없습니다.'));
        },300);
        break;
      case '/mypage/my_page.php':
        $('body').removeClass('body-index').addClass('body-mypage-edit');
        setTimeout(()=>{
          $('.header_top').attr('data-h',$t('회원정보 수정'));
          $('#formJoin .f .btns>a:not(.primary)').text($t('취소'));
          $('#formJoin .f .btns .primary').text($t('완료'));
          $('#formJoin .f input[name="zonecode"]').attr('placeholder',$t('우편번호'));
          $('#formJoin .f input[name="address"]').attr('placeholder',$t('도로명 주소 검색'));
          $('#formJoin .f input[name="addressSub"]').attr('placeholder',$t('상세 주소를 입력해 주세요.'));
          var _bd=$('#formJoin .f>.member_warning').filter(function(){return $(this).find('select').length;});
          if(_bd.length&&!_bd.parent().hasClass('bday-row'))_bd.wrapAll('<div class="bday-row"></div>');
        },300);
        break;
      case '/mypage/hack_out.php':
        $('body').addClass('body-mypage-withdraw');
        $('.header_top').attr('data-h',_ct('회원 탈퇴'));
        setTimeout(()=>{
          var _translateWithdraw=function(root){
            $(root).find('*').addBack().contents().filter(function(){return this.nodeType===3;}).each(function(){
              var raw=this.nodeValue,trim=$.trim(raw);
              if(trim&&_cutPageTx[_cl]&&_cutPageTx[_cl][trim])this.nodeValue=raw.replace(trim,_ct(trim));
            });
            $(root).find('input,button,a').each(function(){
              var $e=$(this),v=$.trim(this.value||$e.text()),p=this.placeholder;
              if(v&&_cutPageTx[_cl]&&_cutPageTx[_cl][v]){if(this.value)this.value=_ct(v);else $e.text(_ct(v));}
              if(p&&_cutPageTx[_cl]&&_cutPageTx[_cl][p])this.placeholder=_ct(p);
              ['onclick','onsubmit'].forEach(a=>{
                var val=$e.attr(a);
                if(!val)return;
                Object.keys(_cutPageTx[_cl]||{}).sort((a,b)=>b.length-a.length).forEach(k=>{val=val.split(k).join(_ct(k));});
                $e.attr(a,val);
              });
            });
          };
          _translateWithdraw('#my_custom .body');
          $('.aside a[href*="hack_out.php"]').each(function(){_setLinkText($(this),'회원 탈퇴');});
        },300);
        break;
      case '/order/order_end.php':
        var _cutOrderNo=(location.search.match(/[?&]orderNo=([^&]+)/)||[])[1],_cutOrderMeta=_getCutOrderImageMeta(),_cutCartSno=sessionStorage.getItem('cartSno')||(_cutOrderMeta&&_cutOrderMeta.cartSno);
        if(_cutOrderNo&&_cutCartSno){
          var _cutOrderBody='type=12cut_order&o='+encodeURIComponent(_cutOrderNo)+'&c='+encodeURIComponent(_cutCartSno);
          if(_cutOrderMeta)_cutOrderBody+='&thumb='+encodeURIComponent(_cutOrderMeta.thumbUrl)+'&print='+encodeURIComponent(_cutOrderMeta.printUrl);
          fetch('https://img.12cut.net/api.php',{body:_cutOrderBody,headers:{'Content-Type':'application/x-www-form-urlencoded'},method:'POST'}).then(function(){
            try{localStorage.setItem('12cutOrderImage:order:'+_cutOrderNo,JSON.stringify(_cutOrderMeta||{cartSno:_cutCartSno}));}catch(e){}
          }).catch(function(e){console.warn('12cut_order map failed',e);});
        }
        break;
      case '/mypage/order_list.php':
        $('body').addClass('body-mypage-order');
        $('.header_top').attr('data-h',$t('주문내역'));
        setTimeout(()=>{
          $('.body-mypage-order button,.body-mypage-order a,.body-mypage-order input[type="button"],.body-mypage-order input[type="submit"]').each(function(){
            var $e=$(this),v=$.trim(this.value||$e.text());
            if(v==='주문취소'||v==='주문 취소'){if(this.value)this.value=_ct(v);else $e.text(_ct(v));}
          });
        },300);
        $('.cart-div a[href]').toArray().forEach(e=>{e.href=e.firstChild.src.replace('_thumb','');e.download='12cut.png'});
        break;
      case '/goods/goods_view.php':
        $('.item_info_box .hide').off('click').click(_=>ui.clk('.ord-box .primary'));
        const setBtn=e=>e.attr('style','background-color:#F63237!important;border-color:#F63237').off('click').attr('onclick','').text($t('스토리 만들기'))
        .click(_=>{
          if(!_isCutLoggedIn())return _goCutEditorLogin();
          _openCutEditor();
        })
        setBtn($('.ord-box .primary'));
        setTimeout(_=>{
          setBtn($('.sticky-order .primary'));
          const colors=[{t:'화이트',n:1000000000,c:'#FFF'},{t:'크림',n:1000000001,c:'#FFF4EE'},{t:'라이트 블루',n:1000000014,c:'#EFF6FC'},{t:'그린',n:1000000017,c:'#019573'},{t:'레드',n:1000000015,c:'#DD3848'},{t:'다크 그레이',n:1000000016,c:'#3B3B47'}];
          $('.item_info_box h2>br')[0].outerHTML=`<div class="product__colors" role="group" aria-label="색상 선택">
            ${colors.map(o=>`<button type=button onclick="location='/goods/goods_view.php?goodsNo=${o.n}'" class="product__color" style="background:${o.c}"></button>`).join('')}</div>`;
        },700);

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
window.custom=custom;
$(_=>{
  $('.menus').hide();
});
