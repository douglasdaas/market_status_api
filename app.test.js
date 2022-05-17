/* eslint-disable no-undef */
const app = require('./app')
const supertest = require('supertest')
const request = supertest(app)

describe('POST /order/:cryptoPair-:fiatPair', () => {
  it('should return 400 status and message contains: "Fiat pair(s) accepted:"', async () => {
    const response = await request.post('/order/BTC-USDC')
    expect(response.status).toBe(400)
    expect(response.body.message).toContain('Fiat pair(s) accepted:')
  })
  it('should return 400 status and message contains: "Crypto pair(s) accepted:"', async () => {
    const response = await request.post('/order/BTCA-USD')
    expect(response.status).toBe(400)
    expect(response.body.message).toContain('Crypto pair(s) accepted:')
  })
  it('should return 400 status, message contains: "operationType field is required"' +
    ' and field: "operationType"', async () => {
    const response = await request.post('/order/BTC-USD')
    expect(response.status).toBe(400)
    expect(response.body.message).toContain('operationType field is required')
    expect(response.body.field).toContain('operationType')
  })
  it('should return 400 status, message contains: "operationType field is required"' +
    ' and field: "operationType"', async () => {
    const response = await request
      .post('/order/BTC-USD')
      .send({
        operationType: 'else'
      })
    expect(response.status).toBe(400)
    expect(response.body.message).toContain('operationType need to be \'buy\' or \'sell\'')
    expect(response.body.field).toContain('operationType')
  })
  it('should return 400 status, message contains: "amount field is required"' +
    ' and field: "amount"', async () => {
    const response = await request
      .post('/order/BTC-USD')
      .send({
        operationType: 'buy'
      })
    expect(response.status).toBe(400)
    expect(response.body.message).toContain('amount field is required')
    expect(response.body.field).toContain('amount')
  })
  it('should return 400 status, message contains: "amount need to be greater than zero"' +
    ' and field: "amount"', async () => {
    const response = await request
      .post('/order/BTC-USD')
      .send({
        operationType: 'buy',
        amount: 0
      })
    expect(response.status).toBe(400)
    expect(response.body.message).toContain('amount need to be greater than zero')
    expect(response.body.field).toContain('amount')
  })
  it('should return 400 status, message contains: "limit need to be greater than zero"' +
    ' and field: "limit"', async () => {
    const response = await request
      .post('/order/BTC-USD')
      .send({
        operationType: 'buy',
        amount: 0.1,
        limit: 0
      })
    expect(response.status).toBe(400)
    expect(response.body.message).toContain('limit need to be greater than zero')
    expect(response.body.field).toContain('limit')
  })
  it('should return 200 status, message match the regex and ok === true"', async () => {
    // Wait for data to be load
    // eslint-disable-next-line promise/param-names
    await new Promise(r => setTimeout(r, 2000))

    const response = await request
      .post('/order/BTC-USD')
      .send({
        operationType: 'buy',
        amount: 1
      })
    expect(response.status).toBe(200)
    expect(response.body.ok).toBeTruthy()
    expect(response.body.message).toMatch(/The [a-zA-Z]+ order for amount: [0-9]+ will be execute for: \$[0-9]+,[0-9]*\.[0-9]+/)
  })
  it('should return 200 status, message match the regex, ok === true and limit === true', async () => {
    // Wait for data to be load
    // eslint-disable-next-line promise/param-names
    await new Promise(r => setTimeout(r, 4000))
    const prepareData = await request.get('/price/orderBook/BTC-USD')

    const response = await request
      .post('/order/BTC-USD')
      .send({
        operationType: 'buy',
        limit: prepareData.body.ask.price + 0.1,
        amount: prepareData.body.ask.amount + 1
      })

    expect(response.status).toBe(200)
    expect(response.body.ok).toBeTruthy()
    expect(response.body.limit).toBeTruthy()
    expect(response.body.message)
      .toMatch(
        /The [a-zA-Z]+ limit order for price: \$[0-9]+,[0-9]*\.[0-9]+ will be execute for: \$[0-9]+,[0-9]*\.[0-9]+ for a max amount of: [0-9]*\.[0-9]+/
      )
  })
  it('should return 200 status, message match the regex when the limit can\'t be done', async () => {
    // Wait for data to be load
    // eslint-disable-next-line promise/param-names
    await new Promise(r => setTimeout(r, 4000))
    const prepareData = await request.get('/price/orderBook/BTC-USD')

    const limitPrice = prepareData.body.ask.price - 0.1

    const response = await request
      .post('/order/BTC-USD')
      .send({
        operationType: 'buy',
        limit: limitPrice,
        amount: prepareData.body.ask.amount + 1
      })

    expect(response.status).toBe(200)
    expect(response.body.ok).toBeTruthy()
    expect(response.body.message)
      .toMatch(`The buy limit: ${limitPrice.toLocaleString()} is less than the cheapest sell price ${prepareData.body.ask.price.toLocaleString()}`)
  })
})
