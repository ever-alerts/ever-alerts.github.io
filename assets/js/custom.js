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


    $('body').on('click', '.js-copied', function(e) {
        e.preventDefault()

        let _this = $(this),
            input = _this.closest('form').find('#outputAddr'),
            inputValue = input.val(),
            strCopied = 'Copied'

        if(!inputValue) {
            return false
        }

        input.select();

        document.execCommand("copy");

        _this.text(strCopied)

    }).on('click', '.alert__item', function() {
        $(this).siblings().removeClass('focus')
        $(this).addClass('focus')
    })
    // скрол по кнопке next
    $('.js-to-scroll-next').on('click', function(e) {
        let $target = $(this).data('target');
        if($target) {
            $('html, body').animate({ scrollTop: $("."+$target).offset().top-30 }, 500);
        }
        return false;
    });
});

$('.slider-gallery').slick({
    arrow: true,
});