const express = require('express')
const router = express.Router()

const {
  BTC_TICKER,
  ETH_TICKER,
  BTC_BOOK,
  ETH_BOOK
} = require('../websocket')
const {
  validatePairsMiddleware
} = require('../helpers/midelware')
const {
  getTips
} = require('../helpers/orderBook')

router.get('/ticker/:cryptoPair-:fiatPair', validatePairsMiddleware, (
  req,
  res
) => {
  const { cryptoPair } = req.params
  const ticker = cryptoPair.toLowerCase() === 'btc' ? BTC_TICKER : ETH_TICKER

  return res.json({
    ok: true,
    currency: cryptoPair.toUpperCase(),
    bid_price: ticker.bid_price,
    bid_25_first_sum_amount: ticker.bid_amount,
    ask_price: ticker.ask_price,
    ask_25_first_sum_amount: ticker.ask_amount
  })
})

router.get('/orderBook/:cryptoPair-:fiatPair', validatePairsMiddleware, (
  req,
  res
) => {
  const { cryptoPair } = req.params
  const orderBook = cryptoPair.toLowerCase() === 'btc' ? BTC_BOOK : ETH_BOOK
  const { bid, ask } = getTips(orderBook)

  return res.json({
    ok: true,
    currency: cryptoPair.toUpperCase(),
    bid: {
      price: bid.price,
      amount: bid.amount
    },
    ask: {
      price: ask.price,
      amount: ask.amount
    }
  })
})

module.exports = router
