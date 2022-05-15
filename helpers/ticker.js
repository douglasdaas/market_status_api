const updateTicker = ({ticker_array, currency}) => {
    currency.bid_price = ticker_array[0]
    currency.bid_amount = ticker_array[1]
    currency.ask_price = ticker_array[2]
    currency.ask_amount = ticker_array[3]
}

module.exports = {
    updateTicker,
}
