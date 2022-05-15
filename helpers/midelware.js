const {
    FIAT_ALLOWED,
    CRYPTO_ALLOWED
} = require("../configs");

const validatePairsMiddleware = (req, res, next) => {
    const { crypto_pair, fiat_pair} = req.params

    if (!FIAT_ALLOWED.includes(fiat_pair.toLowerCase())) {
        return res.status(400).json({
            ok: false,
            param: "fiat_pair",
            message: "The only fiat pair accepted is 'USD'",
        })
    }

    if (!CRYPTO_ALLOWED.includes(crypto_pair.toLowerCase())) {
        return res.status(400).json({
            ok: false,
            param: "crypto_pair",
            message: "Crypto pairs accepted are 'BTC' and 'ETH",
        })
    }
    next()
}

module.exports = {
    validatePairsMiddleware,
}
