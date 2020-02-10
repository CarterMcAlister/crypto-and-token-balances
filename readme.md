# crypto-and-token-balances

## Overview

This application allows you to get the balances and USD values for crypto assets from wallet addresses.

Input: object with `ETH` and `BTC` keys, with an array of string addresses as the value.

Output: an array of objects with the ticker, balance, and usd value of the addresses.

Contributions welcome, feel free to open a pull request adding other crypto assets.

## Usage

Installation:
```bash
npm i crypto-and-token-balances
```

Example usage:
```javascript
const walletData = require('./wallets.json')
const CryptoBalance = require('crypto-and-token-balances')

const ETHPLORER_API_KEY = 'freekey'
const COINMARKETCAP_API_KEY = 'your-key-here'

async function getBalanceInfo() {
  const cryptoBalance = new CryptoBalance(
    COINMARKETCAP_API_KEY,
    ETHPLORER_API_KEY
  )
  const balanceInfo = await cryptoBalance.getBalances(walletData)

  console.log(balanceInfo)
}

getBalanceInfo()
```

## Development
Clone the repository and edit `demo.js` with your Coinmarketcap API key.

You can edit wallets.json with your own wallet addresses.

Run the demo project with `node demo.js`
