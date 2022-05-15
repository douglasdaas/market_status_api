const ws = require('ws')
const w = new ws('wss://api-pub.bitfinex.com/ws/2')

let BTC = {
    ask_price: 0,
    ask_amount: 0,
    bid_price: 0,
    bid_amount: 0,
};
let ETH = {
    ask_price: 0,
    ask_amount: 0,
    bid_price: 0,
    bid_amount: 0,
};

let BTC_USD = JSON.stringify({
    event: 'subscribe',
    channel: 'ticker',
    symbol: 'tBTCUSD'
})

let ETH_USD = JSON.stringify({
    event: 'subscribe',
    channel: 'ticker',
    symbol: 'tETHUSD'
})

let BTC_USD_BOOK = JSON.stringify({
    event: 'subscribe',
    channel: 'book',
    symbol: 'tBTCUSD',
})

let ETH_USD_BOOK = JSON.stringify({
    event: 'subscribe',
    channel: 'book',
    symbol: 'tETHUSD',
})

w.on('open', () => w.send(BTC_USD))
w.on('open', () => w.send(ETH_USD))

// w.on('open', () => w.send(BTC_USD_BOOK))
// w.on('open', () => w.send(ETH_USD_BOOK))

let BTC_channel_id;
let ETH_channel_id;

w.on('message', (response) =>{
    const data = JSON.parse(response.toString())

    if (data.event === "subscribed") {
        switch (data.symbol){
            case "tBTCUSD":
                BTC_channel_id = data.chanId;
                break
            case "tETHUSD":
                ETH_channel_id = data.chanId;
                break
            default:
                console.log("Error pair invalid")
        }
    }


    if (data.length) {
        if  (data[1] !== 'hb') {
            switch (data[0]) {
                case BTC_channel_id:
                    BTC.bid_price = data[1][0]
                    BTC.bid_amount = data[1][1]
                    BTC.ask_price = data[1][2]
                    BTC.ask_amount = data[1][3]
                    break
                case ETH_channel_id:
                    ETH.bid_price = data[1][0]
                    ETH.bid_amount = data[1][1]
                    ETH.ask_price = data[1][2]
                    ETH.ask_amount = data[1][3]
            }
        }
    }

})

module.exports = {
    BTC,
    ETH,
}
