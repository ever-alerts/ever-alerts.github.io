const DEFAULT_LANGUAGE = 'en'
const inputAddr = document.getElementById('inputAddr')
const outputAddr = document.getElementById('outputAddr')
let imagesource = null
let LANGUAGE = DEFAULT_LANGUAGE

function langSwitch(lang) {
  hideMenu()
  $.ajax({
    url: 'languages/' + lang + '.json',
    dataType: 'json',
    success: function (response) {
      LANGUAGE = response
      $('body').find("[lng]").each(function () {
        var lng = LANGUAGE[$(this).attr('lng')]
        var tag = $(this)[0].tagName.toLowerCase()
        switch (tag) {
          case 'input':
            $(this).val(lng)
            break
          default:
            $(this).html(lng)
            break
        }
      })
    }
  })
}

function generate(lang) {
  if (lang === undefined) {
    lang = DEFAULT_LANGUAGE
  }
  const addr = inputAddr.value.toLowerCase()
  outputAddr.value = `${window.location.origin}/widget.html?addr=${addr}&imgsrc=${imagesource}&lang=${lang}`
}

function imgsrcGetter(id) {
  imagesource = document.getElementById(id).src
}

function highlightImages() {
  const imageList = document.getElementsByTagName('img')
  const imageCount = imageList.length

  let i = 0
  for (; i < imageCount; i++) {
    imageList[i].onclick = function () {
      imgsrcGetter(this.id)
      console.log(imagesource)
    }
  }
}

highlightImages()
