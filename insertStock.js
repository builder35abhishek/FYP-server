var rp = require('request-promise');

async function insertStock(stockCodes) {
  let testStocksData = {
    GOOGL: {code: 'GOOGL', name: 'Alphabet Inc Class A'},
    AAPL: {code: 'AAPL', name: 'Apple Inc.'},
    MSFT: {code: 'MSFT', name: 'Microsoft Corporation'},
    FB: {code: 'FB', name: 'Facebook, Inc. Common Stock'}
  };

  let stocksData = await rp({
    uri: `https://api.iextrading.com/1.0/stock/market/batch?symbols=${stockCodes.join(',')}&types=company`,
    json: true
  });

  let stocks = {};
  for (let stockCode in stocksData) {
    stocks[stockCode] = {
      code: stockCode,
      name: stocksData[stockCode].company.companyName
    };
  }
  for (let stockCode in testStocksData) {
    if (stockCode in stocks) {
      stocks[stockCode].test = testStocksData[stockCode];
    }
  }

  await rp({
    uri: 'https://us-central1-cmms-fyp.cloudfunctions.net/insertStocks',
    method: 'POST',
    body: {stocks: stocks},
    json: true
  });
}

insertStock(process.argv.slice(2))
    .then(() => {
      console.log('inserted stocks');
    }).catch((err) => {
      console.log('isnert stock error', err);
    });
