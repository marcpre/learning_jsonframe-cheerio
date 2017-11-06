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
	const data = await scrapCoinmarketCapOverview()

	data.currency.forEach(function(cur) {
		if (cur.Url) {
			const url = "https://coinmarketcap.com" + cur.Url
			console.log(url)
			const html = await got(url)
			const $ = cheerio.load(html.body)

			jsonframe($)

			const frame = {
				currency: {
					_s: 'tr', // the selector
					_d: [{ // allow you to get an array of data, not just the first item
						Url: url,
						ImgLink: ".currency-logo-32x32 @ src"
						Twitter: '',
						Reddit: '.reddit-title > a:nth-child(2) @ href',
						Website1: '',
						Website2: '',
						Website3: '',
						Website4: '',
						MessageBoard1: '',
						MessageBoard2: '',
						MessageBoard3: '',
					}],
				},
			}

			const buffer = $('body').scrape(frame, {
				string: true,
			})
			console.log(buffer)
		}
	})
	
	return data
}

// scrapCoinmarketCapOverview()
scrapCoinmarketCapSubPages()