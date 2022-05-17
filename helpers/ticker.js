const updateTicker = ({ tickerArray, tickerCurrency }) => {
  tickerCurrency.bid_price = tickerArray[0]
  tickerCurrency.bid_amount = tickerArray[1]
  tickerCurrency.ask_price = tickerArray[2]
  tickerCurrency.ask_amount = tickerArray[3]
}

module.exports = {
  updateTicker
}
