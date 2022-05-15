const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
let { BTC, ETH} = require("./ws");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/price/:crypto_pair-:fiat_pair", (
    req,
    res,
) => {
    const { crypto_pair, fiat_pair} = req.params

    if (fiat_pair.toLowerCase() !== "usd") {
        return res.status(400).json({
            ok: false,
            param: "fiat_pair",
            message: "The only fiat pair accepted is 'USD'",
        })
    }

    if (![ "btc", "eth" ].includes(crypto_pair.toLowerCase())) {
        return res.status(400).json({
            ok: false,
            param: "crypto_pair",
            message: "Crypto pairs accepted are 'BTC' and 'ETH",
        })
    }


    if (crypto_pair.toLowerCase() === "btc") {
        console.log(BTC)
        return res.json({
            bid_price: BTC.bid_price,
            bid_amount: BTC.bid_amount,
            ask_price: BTC.ask_price,
            ask_amount: BTC.ask_amount,
        })
    } else {
        console.log(ETH)
        return res.json({
            ok: true,
            bid_price: ETH.bid_price,
            bid_amount: ETH.bid_amount,
            ask_price: ETH.ask_price,
            ask_amount: ETH.ask_amount,
        })
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
