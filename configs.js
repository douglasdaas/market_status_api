const CONFIG_BTC_USD_TICKER = JSON.stringify({
    event: 'subscribe',
    channel: 'ticker',
    symbol: 'tBTCUSD'
})

const CONFIG_ETH_USD_TICKER= JSON.stringify({
    event: 'subscribe',
    channel: 'ticker',
    symbol: 'tETHUSD'
})

const CONFIG_BTC_USD_BOOK = JSON.stringify({
    event: 'subscribe',
    channel: 'book',
    symbol: 'tBTCUSD',
    len: '250',
})

const CONFIG_ETH_USD_BOOK = JSON.stringify({
    event: 'subscribe',
    channel: 'book',
    symbol: 'tETHUSD',
    len: '250',
})

const WEB_SOCKET_URL = process.env.socket_uri || "wss://api-pub.bitfinex.com/ws/2"

const FIAT_ALLOWED = ['usd']
const CRYPTO_ALLOWED = ['btc', 'eth']

module.exports = {
    CONFIG_BTC_USD_TICKER,
    CONFIG_ETH_USD_TICKER,
    CONFIG_BTC_USD_BOOK,
    CONFIG_ETH_USD_BOOK,
    WEB_SOCKET_URL,
    FIAT_ALLOWED,
    CRYPTO_ALLOWED
}
