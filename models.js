const BTC_TICKER = {
    ask_price: 0,
    ask_amount: 0,
    bid_price: 0,
    bid_amount: 0,
};
const ETH_TICKER = {
    ask_price: 0,
    ask_amount: 0,
    bid_price: 0,
    bid_amount: 0,
};
const BTC_BOOK = {
    bids: {},
    asks: {},
    price_snapchat: {
        bids: [],
        asks: [],
    },
    empty_book: true,
}

const ETH_BOOK = {
    bids: {},
    asks: {},
    price_snapchat: {
        bids: [],
        asks: [],
    },
    empty_book: true,
}


module.exports = {
    BTC_TICKER,
    ETH_TICKER,
    BTC_BOOK,
    ETH_BOOK,
}
