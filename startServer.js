const express = require('express')
const app = express()
const bigquery = require('@google-cloud/bigquery')()

async function countScrapedSongs() {
  const query = `SELECT COUNT(*) FROM lyrics.songs;`
  const response = await bigquery.query(query)
  const count = response[0][0].f0_
  return count
}

app.get('/', async (req, res) => {
  const count = await countScrapedSongs()
  res.send(`We've scraped ${count} songs so far.`)
})

module.exports = function startServer() {
  app.listen(3000)
}
