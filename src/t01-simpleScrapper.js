const cheerio = require('cheerio')
const jsonframe = require('jsonframe-cheerio')

const $ = cheerio.load(`
<body>
  <h1>I love jsonframe!</h1>
  <span itemprop="email"> Email: gabin@datascraper.pro  </span>
<body>`)

jsonframe($) // initializing the plugin

const frame = {
  title: 'h1', // this is an inline selector
  email: 'span[itemprop=email] < email', // output an extracted email
}

console.log($('body').scrape(frame, { string: true }))
