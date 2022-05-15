const express = require('express');
const router = express.Router();

const {
    BTC_TICKER,
    ETH_TICKER,
} = require("../websocket");
const {
    validatePairsMiddleware,
} = require("../helpers/midelware");



router.get("/:crypto_pair-:fiat_pair", validatePairsMiddleware,(
    req,
    res,
) => {
    const { crypto_pair } = req.params

    if (crypto_pair.toLowerCase() === "btc") {
        return res.json({
            ok: true,
            currency: "BTC",
            bid_price: BTC_TICKER.bid_price,
            bid_amount: BTC_TICKER.bid_amount,
            ask_price: BTC_TICKER.ask_price,
            ask_amount: BTC_TICKER.ask_amount,
        })
    } else {
        return res.json({
            ok: true,
            currency: "ETH",
            bid_price: ETH_TICKER.bid_price,
            bid_amount: ETH_TICKER.bid_amount,
            ask_price: ETH_TICKER.ask_price,
            ask_amount: ETH_TICKER.ask_amount,
        })
    }
});

module.exports = router;
