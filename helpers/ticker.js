const updateTicker = ({ tickerArray, currency }) => {
  currency.bid_price = tickerArray[0]
  currency.bid_amount = tickerArray[1]
  currency.ask_price = tickerArray[2]
  currency.ask_amount = tickerArray[3]
}

module.exports = {
  updateTicker
}
