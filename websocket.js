const websocket = require('ws')
const {
    BTC_TICKER,
    ETH_TICKER,
    BTC_BOOK,
    ETH_BOOK,
} = require("./models");
const {
    CONFIG_BTC_USD_TICKER,
    CONFIG_ETH_USD_TICKER,
    CONFIG_BTC_USD_BOOK,
    CONFIG_ETH_USD_BOOK,
    WEB_SOCKET_URL
} = require("./configs")
const {
    updateTicker,
} = require("./helpers/ticker")
const {
    updateOrderBook,
} = require("./helpers/orderBook")

const web_socket_client = new websocket(WEB_SOCKET_URL)

web_socket_client.on('open', () =>{
    web_socket_client.send(CONFIG_BTC_USD_TICKER)
    web_socket_client.send(CONFIG_ETH_USD_TICKER)
    web_socket_client.send(CONFIG_BTC_USD_BOOK)
    web_socket_client.send(CONFIG_ETH_USD_BOOK)
})

let BTC_ticket_channel_id;
let BTC_book_channel_id;
let ETH_ticket_channel_id;
let ETH_book_channel_id;

web_socket_client.on('message', (response) =>{
    const data = JSON.parse(response.toString())

    if (data.event === "subscribed" && data.channel === "ticker") {
        switch (data.symbol) {
            case "tBTCUSD":
                BTC_ticket_channel_id = data.chanId;
                break
            case "tETHUSD":
                ETH_ticket_channel_id = data.chanId;
                break
            default:
                console.log("Error ticker pair invalid")
        }
    } else if (data.event === "subscribed" && data.channel === "book") {
        switch (data.symbol) {
            case "tBTCUSD":
                BTC_book_channel_id = data.chanId;
                break
            case "tETHUSD":
                ETH_book_channel_id = data.chanId;
                break
            default:
                console.log("Error book pair invalid")
        }
    }


    if (data.length) {
        if  (data[1] !== 'hb') {
            const channel_id = data[0]
            const ticker_book_data_array = data[1]
            switch (channel_id) {
                // Tickers
                case BTC_ticket_channel_id:
                    updateTicker({
                        ticker_array: ticker_book_data_array,
                        currency: BTC_TICKER,
                    });
                    break
                case ETH_ticket_channel_id:
                    updateTicker({
                        ticker_array: ticker_book_data_array,
                        currency: ETH_TICKER,
                    });
                    break
                // Books
                case BTC_book_channel_id:
                    updateOrderBook({
                        price_point_array: ticker_book_data_array,
                        order_book: BTC_BOOK
                    })
                    break
                case ETH_book_channel_id:
                    updateOrderBook({
                        price_point_array: ticker_book_data_array,
                        order_book: ETH_BOOK
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
    ETH_BOOK,
}
