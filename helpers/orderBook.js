const updateOrderBook = ({ pricePointArray, orderBook, currency }) => {
  if (orderBook.empty_book) {
    pricePointArray.map((pricePoint) => {
      const pricePointDict = {
        price: pricePoint[0],
        count: pricePoint[1],
        amount: pricePoint[2]
      }
      const side = pricePointDict.amount >= 0 ? 'bids' : 'asks'
      pricePointDict.amount = Math.abs(pricePointDict.amount)
      orderBook[side][pricePointDict.price] = pricePointDict

      return true
      // console.log(`Added price point: ${pricePointDict.price} to the ${side} ${currency} book`)
    })
  } else {
    const pricePointDict = {
      price: pricePointArray[0],
      count: pricePointArray[1],
      amount: pricePointArray[2]
    }

    if (!pricePointDict.count) {
      if (pricePointDict.amount > 0) {
        if (orderBook.bids[pricePointDict.price]) {
          delete orderBook.bids[pricePointDict.price]
          // console.log(`price point: ${pricePointDict.price} deleted on ${currency} bids book`)
        }
      } else if (pricePointDict.amount < 0) {
        if (orderBook.asks[pricePointDict.price]) {
          delete orderBook.asks[pricePointDict.price]
          // console.log(`price point: ${pricePointDict.price} deleted on ${currency} asks book`)
        }
      } else {
        // console.log(`price point: ${pricePointDict.price}  with count 0 not deleted because not found on ${currency} book`)
      }
    } else {
      const side = pricePointDict.amount >= 0 ? 'bids' : 'asks'
      pricePointDict.amount = Math.abs(pricePointDict.amount)
      orderBook[side][pricePointDict.price] = pricePointDict

      // console.log(`Added price point: ${pricePointDict.price} to the ${currency} ${side} book`)
    }
  }

  const bookSides = ['bids', 'asks']
  bookSides.map((bookSide) => {
    const prices = Object.keys(orderBook[bookSide])
    orderBook.price_snapchat[bookSide] = prices.sort((a, b) => {
      if (bookSide === 'bids') {
        return +a >= +b ? -1 : 1
      } else {
        return +a <= +b ? -1 : 1
      }
    })
    return true
  })

  orderBook.empty_book = false
}

const searchOrder = ({ orderBook, bookSide, amount }) => {
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
