let urlAddr = getUrlParams().addr
console.log(getUrlParams())
let urlImg = getUrlParams().imgsrc

let logo = document.createElement('img')
logo.type = 'image'
logo.src = urlImg

const sfx = new Audio()
sfx.src = 'assets/sfx.mp3'

let message = document.createElement('p')
message.type = 'text'

let comment = document.createElement('pc')
comment.type = 'text'

const container = document.createElement('div')
container.setAttribute('class', 'container')

const app = document.getElementById('root')
app.appendChild(container)

function Transaction(id, from, coin, value, payload) {
  this.id = id
  this.from = from
  this.coin = coin
  this.value = value
  this.payload = payload
}

let arrayTransactions = []
let setOfLoaded = new Set()

function getUrlParams(url) {
  // http://stackoverflow.com/a/23946023/2407309
  if (typeof url == 'undefined') {
    url = window.location.search
  }
  url = url.split('#')[0] // Discard fragment identifier
  const urlParams = {}
  let queryString = url.split('?')[1]
  if (!queryString) {
    if (url.search('=') !== false) {
      queryString = url
    }
  }
  if (queryString) {
    var keyValuePairs = queryString.split('&')
    for (var i = 0; i < keyValuePairs.length; i++) {
      var keyValuePair = keyValuePairs[i].split('=')
      var paramName = keyValuePair[0]
      var paramValue = keyValuePair[1] || ''
      urlParams[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '))
    }
  }
  return urlParams
}

function getSum(str) {
  p = parseInt(str)
  if (p > 0) {
    return p
  } else {
    return parseFloat(str)
  }
}

function parseData(data) {
  if (!data) {
    data = '{}'
  }
  let income = { data: {}}
  try {
    income = JSON.parse(data)
  } catch (error) {
    console.log('data', data, error)
  }
  return income.data || {}
}

function parseTransactions(data) {
  const out = parseData(data)
  return out.transactions || []
}

setInterval(function () {
  try {
    const request = new XMLHttpRequest()
    const query = `query{transactions(filter:{account_addr:{eq:"${urlAddr}"}balance_delta: {gt: "0"}} orderBy:{ path: "now", direction: DESC}){id now account_addr balance_delta in_message{body}}}`
    const data = JSON.stringify({
      query
    })
    request.open('POST', 'https://mainnet.evercloud.dev/adcc958cf74545b99de7ee820297d487/graphql')
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(data)
    request.onreadystatechange = function () {
      const transactions = parseTransactions(this.responseText)
      console.log(transactions)
      if (setOfLoaded.size === 0) {
        transactions.reverse().forEach(function (item) {
          if (item.balance_delta.value !== 0 && !setOfLoaded.has(item.id)) {
            setOfLoaded.add(item.id)
          }
        })
      }
      transactions.reverse().forEach(function (item) {
        if (item.balance_delta.value !== 0 && !setOfLoaded.has(item.id)) {
          arrayTransactions.push(new Transaction(item.id, item.account_addr, 'Crystals', item.balance_delta, item.in_message.body))
          setOfLoaded.add(item.id)
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
}, 10000)

const getTransaction = () => {
  console.log(arrayTransactions)
  let trans = arrayTransactions.shift()
  if (trans === undefined) {
    setTimeout(getTransaction, 2000)
  } else {
    showAlert(trans)
  }
}

function u_atob(ascii) {
  return Uint8Array.from(atob(ascii), c => c.charCodeAt(0))
}

const showAlert = (trans) => {
  try {
    const card = document.createElement('div')
    card.setAttribute('class', 'card')
    console.log(trans.from)
    message.textContent = 'Somebody just sent you ' + getSum(trans.value) / 1000000000 + ' ' + trans.coin + '!'

    if (trans.payload !== "") {
      comment.textContent = new TextDecoder().decode(u_atob(trans.payload)).slice(10)
    } else {
      comment.textContent = ""
    }
    sfx.play()
    container.appendChild(logo)
    container.appendChild(message)
    container.appendChild(comment)
  } catch (e) {
    console.log(e)
  }
  setTimeout(clearAlert, 10000)
}

const clearAlert = () => {
  container.innerHTML = ''
  setTimeout(getTransaction, 2000)
}
getTransaction()
