const {
  FIAT_ALLOWED,
  CRYPTO_ALLOWED
} = require('../configs')

const validatePairsMiddleware = (req, res, next) => {
  const { cryptoPair, fiatPair } = req.params

  if (!FIAT_ALLOWED.includes(fiatPair.toLowerCase())) {
    return res.status(400).json({
      ok: false,
      param: 'fiatPair',
      message: `Fiat pair(s) accepted: ${FIAT_ALLOWED.join(', ').toUpperCase()}`
    })
  }

  if (!CRYPTO_ALLOWED.includes(cryptoPair.toLowerCase())) {
    return res.status(400).json({
      ok: false,
      param: 'cryptoPair',
      message: `Crypto pair(s) accepted: ${CRYPTO_ALLOWED.join(', ').toUpperCase()}`
    })
  }
  next()
}

module.exports = {
  validatePairsMiddleware
}
