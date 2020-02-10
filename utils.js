const Decimal = require('decimal.js')

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const getTokenValue = (tokenPrice, balance) =>
  (parseFloat(balance) * parseFloat(tokenPrice)).toFixed(2)

function getFormattedTokenBalance(tokenData) {
  const num = new Decimal(tokenData.balance).toFixed()
  const decimalPos = num.length - tokenData.tokenInfo.decimals
  return `${num.slice(0, decimalPos)}.${num.slice(decimalPos)}`
}

module.exports = { asyncForEach, getTokenValue, getFormattedTokenBalance }
