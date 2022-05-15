const updateOrderBook =  ({price_point_array, order_book}) => {
    if (order_book.empty_book) {
        price_point_array.map((price_point) => {
            const price_point_dict = {
                price: price_point[0],
                count: price_point[1],
                amount: price_point[2]
            }
            const side = price_point_dict.amount >= 0 ? 'bids' : 'asks'
            price_point_dict.amount = Math.abs(price_point_dict.amount)
            order_book[side][price_point_dict.price] = price_point_dict

            // console.log(`Added price point: ${price_point_dict.price} to the ${side} book`)
        })
    } else {
        const price_point_dict = {
            price: price_point_array[0],
            count: price_point_array[1],
            amount: price_point_array[2],
        }

        if (!price_point_dict.count) {
            if (price_point_dict.amount > 0) {
                if (order_book['bids'][price_point_dict.price]) {
                    delete order_book['bids'][price_point_dict.price]
                    // console.log(`price point: ${price_point_dict.price} deleted on bids book`)
                }
            } else if (price_point_dict.amount < 0) {
                if (order_book['asks'][price_point_dict.price]) {
                    delete order_book['asks'][price_point_dict.price]
                    // console.log(`price point: ${price_point_dict.price} deleted on asks book`)
                }
            } else {
                // console.log(`price point: ${price_point_dict.price}  with count 0 not deleted because not found`)
            }
        } else {
            const side = price_point_dict.amount >= 0 ? 'bids' : 'asks'
            price_point_dict.amount = Math.abs(price_point_dict.amount)
            order_book[side][price_point_dict.price] = price_point_dict

            // console.log(`Added price point: ${price_point_dict.price} to the ${side} book`)
        }
    }

    const book_sides = [ "bids", "asks" ]
    book_sides.map((book_side) =>{
        const prices = Object.keys(order_book[book_side])
        order_book.price_snapchat[book_side] = prices.sort((a, b) =>{
            if (book_side === 'bids') {
                return +a >= +b ? -1 : 1
            } else {
                return +a <= +b ? -1 : 1
            }
        })
    })

    order_book.empty_book = false
}

const searchOrder = ({order_book, book_side, amount}) => {
    if (!["bids", "asks"].includes(book_side)){
        return new Error(`book_side error, value: ${book_side}. book_side only can be "bids" or "asks"`)
    }
    let i = 0
    let market_price = order_book.price_snapchat[book_side][i]

    if (book_side === "asks") {
        while (order_book.asks[market_price].amount > amount) {
            if (i === order_book.price_snapchat.asks.length - 1) {
                return false
            }
            i += 1
            market_price = order_book.price_snapchat.asks[i]
        }
        console.log(order_book.asks[market_price].price)
        return order_book.asks[market_price].price
    } else {
        while (order_book.bids[market_price].amount < amount) {
            if (i === order_book.price_snapchat.bids.length - 1) {
                return false
            }
            i += 1
            market_price = order_book.price_snapchat.bids[i]
        }
        return order_book.bids[market_price].price
    }

}

module.exports = {
    updateOrderBook,
    searchOrder,
}
