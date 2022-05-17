const updateOrderBook = ({ pricePointArray, orderBook }) => {
  // Fill the empty orderBook
  if (orderBook.empty_book) {
    pricePointArray.forEach((pricePoint) => {
      const pricePointDict = {
        price: pricePoint[0],
        count: pricePoint[1],
        amount: pricePoint[2]
      }
      const side = pricePointDict.amount >= 0 ? 'bids' : 'asks'
      pricePointDict.amount = Math.abs(pricePointDict.amount)
      orderBook[side][pricePointDict.price] = pricePointDict

      // console.log(`Added price point: ${pricePointDict.price} to the ${side} ${orderBook.currency} book`)
    })
  // Update the orderBook
  } else {
    const pricePointDict = {
      price: pricePointArray[0],
      count: pricePointArray[1],
      amount: pricePointArray[2]
    }
    // Delete price point
    if (!pricePointDict.count) {
      // Bid price point
      if (pricePointDict.amount > 0) {
        if (orderBook.bids[pricePointDict.price]) {
          delete orderBook.bids[pricePointDict.price]
          // console.log(`price point: ${pricePointDict.price} deleted on ${orderBook.currency} bids book`)
        }
      // Asks price point
      } else if (pricePointDict.amount < 0) {
        if (orderBook.asks[pricePointDict.price]) {
          delete orderBook.asks[pricePointDict.price]
          // console.log(`price point: ${pricePointDict.price} deleted on ${orderBook.currency} asks book`)
        }
      } else {
        console.log(`price point: ${pricePointDict.price}  with count 0 not deleted because not found on ${orderBook.currency} book`)
      }
    } else {
      // Add price point
      const side = pricePointDict.amount >= 0 ? 'bids' : 'asks'
      pricePointDict.amount = Math.abs(pricePointDict.amount)
      orderBook[side][pricePointDict.price] = pricePointDict

      // console.log(`Added price point: ${pricePointDict.price} to the ${orderBook.currency} ${side} book`)
    }
  }

  const bookSides = ['bids', 'asks']
  // Sort the price_snapchat array
  bookSides.forEach((bookSide) => {
    const prices = Object.keys(orderBook[bookSide])
    orderBook.price_snapchat[bookSide] = prices.sort((a, b) => {
      if (bookSide === 'bids') {
        return +a >= +b ? -1 : 1
      } else {
        return +a <= +b ? -1 : 1
      }
    })
  })

  orderBook.empty_book = false
}

const searchOrder = ({ orderBook, bookSide, amount, limit }) => {
  if (!['bids', 'asks'].includes(bookSide)) {
    throw new Error(`bookSide error, value: "${bookSide}". bookSide only can be "bids" or "asks"`)
  }
  let accumulatedAmount = 0
  let accumulatedPrice = 0
  let amountMissing = amount - accumulatedAmount

  if (!orderBook.price_snapchat[bookSide].length) {
    return {
      message: 'Data not available yet, try again'
    }
  }

  for (const pricePoint of orderBook.price_snapchat[bookSide]) {
    if (limit) {
      // The operation is buying, so it looks for asks
      if (bookSide === 'asks') {
        // Buy limit is less than the cheapest selling price?
        if (parseFloat(limit) < parseFloat(pricePoint)) {
          // If it's the first price point return not price or amount
          if (pricePoint === orderBook.price_snapchat.asks[0]) {
            return {
              message: `The buy limit: ${limit} is less than the cheapest sell price ${orderBook.price_snapchat.asks[0]}`
            }
          }
          return {
            limit: true,
            price: parseFloat(accumulatedPrice.toFixed(2)),
            max_amount: accumulatedAmount
          }
        }
      // The operation is selling, so it looks for bids
      } else {
        // Sell limit is more than the most expensive buying price?
        if (parseFloat(limit) > parseFloat(pricePoint)) {
          // If it's the first price point return not price or amount
          if (pricePoint === orderBook.price_snapchat.bids[0]) {
            return {
              message: `The sell limit: ${limit} is more than most expensive buy price ${orderBook.price_snapchat.asks[0]}`
            }
          }
          return {
            limit: true,
            price: parseFloat(accumulatedPrice.toFixed(2)),
            max_amount: accumulatedAmount
          }
        }
      }
    }

    if (orderBook[bookSide][pricePoint].amount <= amountMissing) {
      accumulatedAmount += orderBook[bookSide][pricePoint].amount
      accumulatedPrice += orderBook[bookSide][pricePoint].amount * orderBook[bookSide][pricePoint].price
      amountMissing = amount - accumulatedAmount
    } else {
      accumulatedPrice += (amount - accumulatedAmount) * orderBook[bookSide][pricePoint].price
      accumulatedAmount = amount
    }
    if (accumulatedAmount === amount) {
      return parseFloat(accumulatedPrice.toFixed(2))
    }
  }
  return false
}

const getTips = (orderBook) => {
  if (!orderBook.price_snapchat.asks.length || !orderBook.price_snapchat.bids.length) {
    return {
      message: 'Data not available yet, try again'
    }
  }
  const bid = orderBook.price_snapchat.bids[0]
  const ask = orderBook.price_snapchat.asks[0]
  return {
    bid: orderBook.bids[bid],
    ask: orderBook.asks[ask]
  }
}

module.exports = {
  updateOrderBook,
  searchOrder,
  getTips
}
