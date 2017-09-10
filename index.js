require('dotenv').config()
require('glitchup')()

const startServer = require('./startServer')
const scrape = require('./scrape')
scrape()
startServer()
