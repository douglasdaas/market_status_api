const express = require('express');
const router = express.Router();
const {
    validatePairsMiddleware
} = require("../helpers/midelware");
const {
    searchOrder
} = require("../helpers/orderBook");
const {
    BTC_BOOK,
    ETH_BOOK,
} = require("../websocket");


router.post("/:crypto_pair-:fiat_pair", validatePairsMiddleware, (
    req,
    res,
) => {
    const { crypto_pair } = req.params
    const { operation_type, amount } = req.body

    if (!operation_type) {
        return res.status(400).json({
            ok: false,
            field: "operationType",
            message: "operationType field is required"
        })
    }

    if (![ "buy", "sell" ].includes(operation_type.toLowerCase())) {
        return res.status(400).json({
            ok: false,
            field: "operationType",
            message: "operationType need to be 'buy' or 'sell'"
        })
    }

    if (amount === undefined) {
        return res.status(400).json({
            ok: false,
            field: "amount",
            message: "amount field is required"
        })
    }

    if (amount <= 0){
        return res.status(400).json({
            ok: false,
            field: "amount",
            message: "amount need to be greater than zero"
        })
    }

    let price
    const book_side = operation_type === "buy" ? "asks" : "bids"
    const order_book = crypto_pair.toLowerCase() === "btc" ? BTC_BOOK : ETH_BOOK
    try {
        price = searchOrder({
            order_book,
            book_side,
            amount,
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error.message
        })
    }
    if (!price) {
        return res.json({
            ok: true,
            currency: crypto_pair.toUpperCase(),
            message: `Not single order for ${operation_type} find for the amount: ${amount}`
        })
    }
    return res.json({
        ok: true,
        currency: crypto_pair.toUpperCase(),
        message: `The ${operation_type} order for amount: ${amount} will be execute at price: ${price}`,
    })
});

module.exports = router;
