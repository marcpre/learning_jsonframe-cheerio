const cheerio = require('cheerio')
const jsonframe = require('jsonframe-cheerio')
const got = require('got')

async function scrapCoinmarketCapOverview() {
  const url = 'https://coinmarketcap.com/all/views/all/'
  const html = await got(url)
  const $ = cheerio.load(html.body)

  jsonframe($) // initializing the plugin

  const frame = {
    currency: {
      _s: 'tr', // the selector
      _d: [{ // allow you to get an array of data, not just the first item
        CoinName: 'td.no-wrap.currency-name > a',
        Url: 'td.no-wrap.currency-name > a @ href',
        Symbol: 'td.text-left.col-symbol',
        Price: 'td:nth-child(5) > a',
        MarketCap: 'td.no-wrap.market-cap.text-right',
        CirculatingSupply: 'td.no-wrap.text-right.circulating-supply > a @ data-supply',
        Volume24h: 'td:nth-child(7) > a @ data-usd',
      }],
    },
  }

  const data = $('body').scrape(frame, {
    string: true,
  })

  return data
}

async function scrapCoinmarketCapSubPages() {
  //const data = await scrapCoinmarketCapOverview()

	const obj = {
		"currency": [
			{},
			{
				"CoinName": "Bitcoin",
				"Url": "/currencies/bitcoin/",
				"Symbol": "BTC",
				"Price": "$7267.97",
				"MarketCap": "$121,128,438,634",
				"CirculatingSupply": "16666062.0",
				"Volume24h": "2664950000.0"
			},
		]
	}
		
	
  for (const cur of obj.currency) {
    if (cur.Url) {
      const url = `https://coinmarketcap.com${cur.Url}`
      console.log(url)
      const html = await got(url)
      const $ = cheerio.load(html.body)

      jsonframe($)

      const frame = {
        currency: {
          _s: 'body', 
          _d: [{ 
            Url: url,
            ImgLink: '.currency-logo-32x32 @ src',
            Twitter: 'body > div > div.timeline-Header.timeline-InformationCircle-widgetParent > h1 > span > a @ href',
            Reddit: '.reddit-title > a:nth-child(2) @ href',
            Website1: 'body > div.container > div > div.col-xs-12.col-sm-12.col-md-12.col-lg-10 > div.row.bottom-margin-2x > div.col-sm-4.col-sm-pull-8 > ul > li:nth-child(1) > a',
            MessageBoard1: 'body > div.container > div > div.col-xs-12.col-sm-12.col-md-12.col-lg-10 > div.row.bottom-margin-2x > div.col-sm-4.col-sm-pull-8 > ul > li:nth-child(5) > a',
          }],
        },
      }

      const buffer = $('body').scrape(frame, {
        string: true,
      })
      console.log(buffer)
    }
  }

  return obj
}


module.exports = {
  scrapCoinmarketCapSubPages,
  scrapCoinmarketCapOverview,
}
