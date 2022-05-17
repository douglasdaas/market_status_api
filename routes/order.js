const express = require('express')
const router = express.Router()
const {
  validatePairsMiddleware
} = require('../helpers/midelware')
const {
  searchOrder
} = require('../helpers/orderBook')
const {
  BTC_BOOK,
  ETH_BOOK
} = require('../websocket')

router.post('/:cryptoPair-:fiatPair', validatePairsMiddleware, (
  req,
  res
) => {
  const { cryptoPair } = req.params
  const { operationType, amount } = req.body

  if (!operationType) {
    return res.status(400).json({
      ok: false,
      field: 'operationType',
      message: 'operationType field is required'
    })
  }

  if (!['buy', 'sell'].includes(operationType.toLowerCase())) {
    return res.status(400).json({
      ok: false,
      field: 'operationType',
      message: "operationType need to be 'buy' or 'sell'"
    })
  }

  if (amount === undefined) {
    return res.status(400).json({
      ok: false,
      field: 'amount',
      message: 'amount field is required'
    })
  }

  if (amount <= 0) {
    return res.status(400).json({
      ok: false,
      field: 'amount',
      message: 'amount need to be greater than zero'
    })
  }

  let price
  const bookSide = operationType === 'buy' ? 'asks' : 'bids'
  const orderBook = cryptoPair.toLowerCase() === 'btc' ? BTC_BOOK : ETH_BOOK
  try {
    price = searchOrder({
      orderBook,
      bookSide,
      amount
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      ok: false,
      message: error.message
    })
  }
  if (price === false) {
    return res.json({
      ok: true,
      currency: cryptoPair.toUpperCase(),
      message: `Amount: ${amount} not available for ${operationType} `
    })
  }
  if (price.message) {
    return res.json({
      ok: true,
      currency: cryptoPair.toUpperCase(),
      message: price.message
    })
  }
  return res.json({
    ok: true,
    currency: cryptoPair.toUpperCase(),
    message: `The ${operationType} order for amount: ${amount} will be execute at price: ${price}`
  })
})

module.exports = router
