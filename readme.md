# crypto-and-token-balances

## Overview



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

