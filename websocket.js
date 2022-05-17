const Websocket = require('ws')
const {
  BTC_TICKER,
  ETH_TICKER,
  BTC_BOOK,
  ETH_BOOK
} = require('./models')
const {
  CONFIG_BTC_USD_TICKER,
  CONFIG_ETH_USD_TICKER,
  CONFIG_BTC_USD_BOOK,
  CONFIG_ETH_USD_BOOK,
  WEB_SOCKET_URL
} = require('./configs')
const {
  updateTicker
} = require('./helpers/ticker')
const {
  updateOrderBook
} = require('./helpers/orderBook')

const webSocketClient = new Websocket(WEB_SOCKET_URL)

webSocketClient.on('open', () => {
  webSocketClient.send(CONFIG_BTC_USD_TICKER)
  webSocketClient.send(CONFIG_ETH_USD_TICKER)
  webSocketClient.send(CONFIG_BTC_USD_BOOK)
  webSocketClient.send(CONFIG_ETH_USD_BOOK)
})

let BTCTicketChannelId
let BTCBookChannelId
let ETHTicketChannelId
let ETHBookChannelId

webSocketClient.on('message', (response) => {
  const data = JSON.parse(response.toString())

  if (data.event === 'subscribed' && data.channel === 'ticker') {
    switch (data.symbol) {
      case 'tBTCUSD':
        BTCTicketChannelId = data.chanId
        break
      case 'tETHUSD':
        ETHTicketChannelId = data.chanId
        break
      default:
        console.log('Error ticker pair invalid')
    }
  } else if (data.event === 'subscribed' && data.channel === 'book') {
    switch (data.symbol) {
      case 'tBTCUSD':
        BTCBookChannelId = data.chanId
        break
      case 'tETHUSD':
        ETHBookChannelId = data.chanId
        break
      default:
        console.log('Error book pair invalid')
    }
  }

  if (data.length) {
    if (data[1] !== 'hb') {
      const channelId = data[0]
      const tickerBookDataArray = data[1]
      switch (channelId) {
        // Tickers
        case BTCTicketChannelId:
          updateTicker({
            ticker_array: tickerBookDataArray,
            currency: BTC_TICKER
          })
          break
        case ETHTicketChannelId:
          updateTicker({
            ticker_array: tickerBookDataArray,
            currency: ETH_TICKER
          })
          break
          // Books
        case BTCBookChannelId:
          updateOrderBook({
            price_point_array: tickerBookDataArray,
            order_book: BTC_BOOK,
            currency: 'BTC'
          })
          break
        case ETHBookChannelId:
          updateOrderBook({
            price_point_array: tickerBookDataArray,
            order_book: ETH_BOOK,
            currency: 'ETH'
          })
          break
      }
    }
  }
})

module.exports = {
  BTC_TICKER,
  ETH_TICKER,
  BTC_BOOK,
  ETH_BOOK
}
