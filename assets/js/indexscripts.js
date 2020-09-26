const app = document.getElementById('root');
const genButton = document.getElementById('generateAddr');
const inputAddr = document.getElementById('inputAddr');
const outputAddr = document.getElementById('outputAddr');
let imagesource = null;
let sfxsource = null;


function generate(lang) {
    if (lang==undefined){
        lang = 'en'
    }else{
        lang = lang.lngnow;
    }

    outputAddr.value = 'https://tonalerts.com/tonpwidget.html?addr='+inputAddr.value.toLowerCase()+'&imgsrc='+imagesource+'&lang='+lang;
}

function sfxGetter(id) {
    sfxsource = document.getElementById(id).src;
}

function imgsrcGetter(id) {
    imagesource = document.getElementById(id).src;
//    console.log(imagesource)
}


function highlightImages() {
    //You do not use getElementsByid but getElementsByTagName
    var allimages = document.getElementsByTagName('img');
    var nrallimgs = allimages.length;

    // traverses the <img> elements, and register onclick to each one
    // else, apply the properties defined in $imagesProp
    for(i=0; i<nrallimgs; i++) {
        allimages[i].onclick=function() {


                imgsrcGetter(this.id);
                console.log(imagesource);
            }
        }
    }



highlightImages();
