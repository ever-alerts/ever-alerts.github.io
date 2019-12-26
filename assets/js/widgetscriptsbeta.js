let urlAddr = getUrlParams().addr;
console.log(getUrlParams());
let urlImg = getUrlParams().imgsrc;

let logo = document.createElement('img');
logo.type = "image";
logo.src = urlImg;

const sfx = new Audio();
sfx.src = 'assets/sfx/11119_1393961437.mp3';

let message = document.createElement('p');
message.type = "text";

let comment = document.createElement('pc');
comment.type = "text";

const container = document.createElement('div');
container.setAttribute('class', 'container');

const app = document.getElementById('root');
app.appendChild(container);

let max_txn=0;

function Transaction(id,from,coin,value,payload){
    this.id=id;
    this.from=from;
    this.coin=coin;
    this.value=value;
    this.payload=payload;
}
let arrayTransactions = new Array();



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



function getTitlefromMinterscan(incomAddr){
    let req = new XMLHttpRequest();
    let outb;

    req.open('GET', 'https://minterscan.pro/profiles/'+incomAddr, false);

    req.onload = function () {

        if (req.status != 404){

            let inc = JSON.parse(this.response);
            outb = inc.title;
        } else {
            outb = 'Somebody';
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
setInterval(function () {


    let request = new XMLHttpRequest();
    request.open('GET','https://explorer-api.apps.minter.network/api/v1/addresses/'+urlAddr+'/transactions', true);

    request.onload = function () {
        let income = JSON.parse(this.response);
        if (max_txn == 0) {
            max_txn = Math.max.apply(Math, income.data.map(function (o) {
                return o.txn;
            }));
        };

        console.log(income.data);

        container.innerHTML = '';
        income.data.forEach(function (item, i, arr) {
            if (item.txn > max_txn && item.data.value !== 0 && item.data.to == urlAddr) {
                arrayTransactions.push(new Transaction(item.txn, item.from, item.data.coin, item.data.value, item.payload));
            }
        });
    };
    request.send();
},10000);




console.log(arrayTransactions);

const getTransaction = () => {
    let transaction = arrayTransactions.shift;
    if (transaction == null){
        setTimeout(getTransaction,2000)
    }else{
        showAlert(transaction)
    }
};

const showAlert = (trans) => {

    const card = document.createElement('div');
    card.setAttribute('class', 'card');
    console.log(trans.from);
    message.textContent = getTitlefromMinterscan(trans.from) + ' just sent you ' + getSum(trans.value) + ' ' + trans.coin + "!";

    if (trans.payload !== "") {
        comment.textContent = b64DecodeUnicode(trans.payload)
    } else {
        comment.textContent = ""
    };

    sfx.play();
    container.appendChild(logo);
    container.appendChild(message);
    container.appendChild(comment);

    if (max_txn < trans.id){max_txn=trans.id};

    setTimeout(clearAlert,10000);
};

const clearAlert = () => {
    container.innerHTML = '';
    setTimeout(getTransaction,2000);
};




