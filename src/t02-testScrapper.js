const cheerio = require('cheerio')
const jsonframe = require('jsonframe-cheerio')
const fs = require('fs')

const $ = cheerio.load(fs.readFileSync('../data/test.html'))

jsonframe($) // initializing the plugin

let frame = {
  "Plan Price": "#pricing > li:nth-child(1) > span.planPrice", 
	"Plan Name": "#pricing > li:nth-child(1) > span.planName", 
	"Contact": "#contact > span" 
}

console.log( $('body').scrape(frame, { string: true } ))
