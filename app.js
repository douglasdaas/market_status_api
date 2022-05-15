const express = require('express');
const logger = require('morgan');

const priceRouter = require("./routes/price");
const orderRouter = require("./routes/order")

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/price', priceRouter);
app.use('/order', orderRouter);

module.exports = app;
