const custom={
  isReserve:gno=>(ui.gdEtc[gno]?.catecd||'').indexOf('001004')>-1,
  main:({parseList,lang,setGdEtc,setPrice,setGoodsList})=>{
    if(location.search.includes('dev=1')) return wrap.innerHTML=`<iframe src="/dobuddy/12cut/12cutEditor.html" style="position:fixed;inset:0;width:100%;height:100%;border:none"></iframe>`;
    document.body.style.opacity=0;
    wrap.innerHTML=`<iframe style="position:fixed;inset:0;width:100%;height:100%;border:none"></iframe>`;
    const w=wrap.firstChild.contentWindow, d=w.document, q=q=>[].slice.call(d.querySelectorAll(q));
    fetch('https://12cut.pages.dev/').then(r=>r.text().then(r=>{
      d.open();
      d.write(r.replace('<head>',`<head><base href=https://12cut.pages.dev/ >`));
      d.close();
      w.onload=_=>{
        document.body.style.opacity=1;
        q(`[data-lang="${localStorage.$mylang||navigator.language.slice(0,2)}"]`)[0].click();
        const setLink=_=>q('[href*="/12cut_editor/"]').forEach((e,i)=>{
          e.removeAttribute('target');
          e.href=`javascript:`;
          e.onclick=_=>parent.location='/goods/goods_view.php?goodsNo=1000000000';
        });
        setLink();
        q('[data-lang]').forEach((e,i)=>e.addEventListener('click',_=>{setLink();localStorage.$mylang=['en','ko','ja','zh'][i]}));
      }
    }));
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
        break;
    }
  }
}
$(_=>{
  $('.menus').hide();
});
