const axios = require('axios')
const {
  asyncForEach,
  getTokenValue,
  getFormattedTokenBalance
} = require('./utils')

class CryptoBalance {
  constructor(COINMARKETCAP_API_KEY, ETHPLORER_API_KEY) {
    this.COINMARKETCAP_API_KEY = COINMARKETCAP_API_KEY
    this.ETHPLORER_API_KEY = ETHPLORER_API_KEY
    this.API = {
      BTC: this.getBitcoinBalance.bind(this),
      ETH: this.getEthereumAndTokenBalance.bind(this)
    }
    this.getBalances.bind(this)
  }

  async getBitcoinBalance(address) {
    const BTC_DECIMAL_MULTIPLIER = 0.00000001
    let usdValue
    const addressInfo = await axios.post(
      'https://www.blockonomics.co/api/balance',
      {
        addr: address
      }
    )
    const balance =
      addressInfo.data.response[0].confirmed * BTC_DECIMAL_MULTIPLIER
    const usdPrice = await getCryptoPriceData('BTC')

    if (usdPrice) {
      usdValue = balance * usdPrice
    }

    return [{ ticker: 'BTC', balance, usdValue, usdPrice }]
  }

  async getEthereumAndTokenBalance(address) {
    const addressInfo = await axios.get(
      `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=${this.ETHPLORER_API_KEY}`
    )
    const balance = addressInfo.data.ETH.balance
    const ethPrice = addressInfo.data.ETH.price.rate

    const usdValue = balance * ethPrice

    const tokens = addressInfo.data.tokens
    const tokenData = tokens.map(token => getTokenData(token))

    await asyncForEach(tokenData, async token => {
      if (!token.usdValue) {
        const price = await getCryptoPriceData(token.ticker)
        if (price) {
          token.usdValue = getTokenValue(
            parseFloat(price).toFixed(20),
            token.balance
          )
          token.usdPrice = price
        }
      }
    })
    return [
      { ticker: 'ETH', balance, usdValue, usdPrice: ethPrice },
      ...tokenData
    ]
  }

  async getBalances(walletData) {
    const balanceInfo = []
    await asyncForEach(Object.keys(walletData), async ticker => {
      const getBalance = this.API[ticker]
      await asyncForEach(walletData[ticker], async address => {
        const balance = await getBalance(address)
        balanceInfo.push(...balance)
      })
    })
    return balanceInfo
  }
}

const getTokenData = tokenData => {
  let usdValue

  const formattedBalance = getFormattedTokenBalance(tokenData)
  if (tokenData.tokenInfo.price) {
    usdValue = getTokenValue(tokenData.tokenInfo.price.rate, formattedBalance)
  }
  return {
    ticker: tokenData.tokenInfo.symbol,
    balance: formattedBalance,
    usdValue,
    usdPrice: tokenData.tokenInfo.price.rate
  }
}

async function getCryptoPriceData(ticker) {
  try {
    const pricingData = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${ticker}&CMC_PRO_API_KEY=${this.COINMARKETCAP_API_KEY}`
    )
    return pricingData.data.data[ticker].quote.USD.price
  } catch (e) {
    return undefined
  }
}

module.exports = CryptoBalance
