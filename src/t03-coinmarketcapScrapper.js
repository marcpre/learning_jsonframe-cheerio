const cheerio = require('cheerio')
const jsonframe = require('jsonframe-cheerio')
const got = require('got')
const fs = require('fs')

async function scrapCoinmarketCap() {
  const url = 'https://coinmarketcap.com/all/views/all/'
  const html = await got(url)
  const $ = cheerio.load(html.body)

  jsonframe($) // initializing the plugin

  const frame = {
    currency: {
      _s: 'tr', // the selector
      _d: [{ // allow you to get an array of data, not just the first item
        Coin: 'td.no-wrap.currency-name > a',
        Url: 'td.no-wrap.currency-name > a @ href',
        Symbol: 'td.text-left.col-symbol',
        Price: 'td:nth-child(5) > a',
      }],
    },
  }

  const data = JSON.stringify($('body').scrape(frame, {
    string: true,
  }))

  console.log(data)

  fs.writeFile('../data/allCoins.json', data, 'utf8', (err) => {
    if (err) {
      return console.log(err)
    }
    console.log('The file was saved!')
  })
}

scrapCoinmarketCap()
