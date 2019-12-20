var txnMap = new Map();
var highestTxn;



function setTxnMapNewElement(newTxn, addr){

    for (const txn of newTxn){
        if (txn.data.txn>highestTxn && txn.data.from == addr){
            txnMap.set(txn.data.txn,txn.data);
        }
    }

}

function getNextTxnMapElement(){

    var min = Math.min.apply(Math,txnMap.keys());
    var o = txnMap.get(min);
    txnMap.delete(min);
    return o;
}

function getUrlParams (url) {
    // http://stackoverflow.com/a/23946023/2407309
    if (typeof url == 'undefined') {
        url = window.location.search
    }
    var url = url.split('#')[0]; // Discard fragment identifier.
    var urlParams = {};
    var queryString = url.split('?')[1];
    if (!queryString) {
        if (url.search('=') !== false) {
            queryString = url
        }
    }
    if (queryString) {
        var keyValuePairs = queryString.split('&');
        for (var i = 0; i < keyValuePairs.length; i++) {
            var keyValuePair = keyValuePairs[i].split('=');
            var paramName = keyValuePair[0];
            var paramValue = keyValuePair[1] || '';
            urlParams[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '))
        }
    }
    return urlParams
}

function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}


var req = new XMLHttpRequest();

function getTitlefromMinterscan(incomAddr){

    let outb;

    req.open('GET', 'https://minterscan.pro/profiles/'+incomAddr, false);
    
        req.onload = function () {

            if (req.status != 404){

                let inc = JSON.parse(this.response);
                outb = inc.title;
            } else {
                outb = 'Кто-то';
            }

        };

    req.send();
    return outb;

}

function getSum(str) {
    p=parseInt(str);
    if (p>0){
        return p;
    }else{
        return parseFloat(str);
    }
}


var urlAddr = getUrlParams().addr;
console.log(getUrlParams());
var urlImg = getUrlParams().imgsrc;
var last_txn;
var max_txn;

const app = document.getElementById('root');
var logo = document.createElement('img');
logo.type = "image";
logo.src = urlImg;

const sfx = new Audio();
sfx.src = 'assets/sfx/11119_1393961437.mp3';

var message = document.createElement('p');
message.type = "text";

var comment = document.createElement('pc');
comment.type = "text";

const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(container);



setInterval(function () {

   container.innerHTML = '';

var request = new XMLHttpRequest();
request.open('GET','https://explorer-api.apps.minter.network/api/v1/addresses/'+urlAddr+'/transactions', true);
//?addr=Mx5505f59922b452cb69587c93b5e52f8d0464f622

request.onload = function () {

    var income =JSON.parse(this.response);

    max_txn = Math.max.apply(Math, income.data.map(function(o) { return o.txn; }));
    highestTxn = max_txn;

    //console.log(max_txn);

    //container.appendChild(logo);

if ((max_txn > last_txn)&&(income.data[0].data.to == urlAddr)){
    var max_txn_obj = income.data[0];

    if (getSum(max_txn_obj.data.value)!==0){
    //console.log(max_txn_obj);
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        console.log(max_txn_obj.from);

        message.textContent = '{Хей! '+getTitlefromMinterscan(max_txn_obj.from)+' насыпал ' + (getSum(max_txn_obj.data.value)) + ' ' + max_txn_obj.data.coin + "!";
        if (max_txn_obj.payload !== ""){comment.textContent = b64DecodeUnicode(max_txn_obj.payload)}else{comment.textContent = ""};
        sfx.play();
        container.appendChild(logo);
        container.appendChild(message);
        container.appendChild(comment);
    //container.appendChild(sfx);

    last_txn = max_txn;
    }
}


};


    request.send();

last_txn = max_txn;
},20000);
