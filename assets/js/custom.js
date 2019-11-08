$('.btn').on('mousemove', function(event) {
    let offseyTop = $(this).offset().top
    let offseyLeft = $(this).offset().left
    let resTop = (event.pageY - offseyTop - 100)
    let resLeft = (event.pageX - offseyLeft - 100)
    $(this).find('.btn-effect').css('left', resLeft).css('top', resTop );
});

function showMenu() {
    $('.hamburger').addClass('active-hamburger').attr('onclick', 'hideMenu()');
    $('.menu').css('z-index', '3').css('opacity', '1');
};

function hideMenu() {
    $('.active-hamburger').removeClass('active-hamburger').attr('onclick', 'showMenu()');
    $('.menu').css('z-index', '-1').css('opacity', '0');
};

$('.lang-btn .btn').click(function() {
    $('.lang-btn__active').removeClass('lang-btn__active');
    $(this).addClass('lang-btn__active');
});

$('.advantages-slider').slick({
    arrows: false,
    dots: true,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive:[
    {
    breakpoint: 761,
    settings:{
    slidesToShow: 2,
    slidesToScroll: 2,
    }
    },
    {
    breakpoint: 516,
    settings:{
    slidesToShow: 1,
    slidesToScroll: 1,
    }
    }
    ]
});

$(function(){
  $('a[href^="#"]').on('click', function(event) {
    event.preventDefault();
    var sc = $(this).attr("href"),
        dn = $(sc).offset().top;
    $('html, body').animate({scrollTop: dn}, 1000);
  });


  /////////////////

  $('.lang').on('click', function() {
      let $this = $(this)
      let $parent = $this.parent()
      let activeLangIndex = null // это индекс замены текущего языка
      let translateLangReplace = null // это индекс замены нового языка на какой то язык
      let $linkBtn = $('.js-replace-link')

      if($this.hasClass('js-lang-active')) {
          return false
      }

      if($('.hamburger').hasClass('active-hamburger')) {
          $('.hamburger').click()
      }
      activeLangIndex = $parent.find('.js-lang-active').data('index')
      translateLangReplace = $this.data('index')

      $this.siblings().removeClass('js-lang-active')
      $this.addClass('js-lang-active')


      let $replaceWords = $('.replacer');
      let arrWordsToFile = ''

      // подставить url в кнопку если русский иначе по дефолту
      if(translateLangReplace == 2) {
          $linkBtn.attr('href', 'https://ru.minter.wiki/%D0%9A%D0%B0%D0%BA_%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D1%82%D1%8C_%D0%BA%D0%BE%D1%88%D0%B5%D0%BB%D0%B5%D0%BA')
      }else {
          $linkBtn.attr('href', 'https://en.minter.wiki/How_to_create_wallet')
      }

      $.get('./action.php', {}, function(data) {
          // TODO: сюда приходит массив, нужно определить какой сейчас на сайте язык и на какой менять
          // массив слов будет такого вида ['eng', 'chine', 'rus]
          // индекс eng 0 chine - 1 rus - 2 Соответсвенно если на сайте был английский то взять 0 индекс и если кликнули на русский то подставить 2 индекс
          //console.log(data);
          //debugger
          $replaceWords.each(function(i, $item) {
              let $tag = $($item),
                  strHtml = $tag.html(),
                  strIn = '',
                  strReplace = '';
              // пробежаться по тегам сожержащий текс
              data.forEach(function(item, i) {
                  strIn = item[activeLangIndex]
                  strReplace = item[translateLangReplace]

                  let strInSplit = strIn.split(' ')

                  if(strInSplit.length > 0) {
                      // флаг показатель если есть совпадение
                      let flag = true
                      strInSplit.forEach(function(val, index) {
                          if(!strHtml.includes(val)) {
                              // если хоть одно не совпадение то поменять на false
                              flag = false
                          }
                      })
                      if(flag) {
                          // перед перезаписью содержимого проверить есть ли текст вида www.minter.network то обурнуть в ссылку
                          // из за китайского языка не выходит функция split разбивает в 1 элемет мссива
                         /* if(strReplace.includes('www.minter.network')) {
                              let newReplace = strReplace.replace(/www.minter.network/igm, '<a target="_blank" href="https://www.minter.network/ru">www.minter.network</a>')
                              $tag.html(newReplace)
                          }else {
                              $tag.html(strReplace)
                          }*/
                          $tag.html(strReplace)
                      }
                  }
              })

          })
      }, 'json')


  })

});

$('.slider-gallery').slick({
    arrow: true,
});