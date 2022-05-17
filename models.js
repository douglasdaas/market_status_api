const TICKER = {
  currency: undefined,
  ask_price: 0,
  ask_amount: 0,
  bid_price: 0,
  bid_amount: 0
}
const BOOK = {
  currency: undefined,
  bids: {},
  asks: {},
  price_snapchat: {
    bids: [],
    asks: []
  },
  empty_book: true
}

module.exports = {
  TICKER,
  BOOK
}
