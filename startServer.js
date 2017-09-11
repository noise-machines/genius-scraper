const express = require('express')
const emojiFavicon = require('emoji-favicon')
const bigquery = require('@google-cloud/bigquery')()

async function countScrapedSongs() {
  const query = `SELECT COUNT(*) FROM lyrics.songs;`
  const response = await bigquery.query(query)
  const count = response[0][0].f0_
  return count
}

const html = count => `
<html>
  <head>
    <style>
      html {
        background: url(https://unsplash.it/1500/1000/?random) no-repeat center center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
      }
      h1 {
        font-size: 10vw;
        color: white;
        font-family: "HelveticaNeue";
        text-shadow: 5px 5px 0px rgba(0, 0, 0, 0.15);
        padding: 0.2em;
      }
      #center {
        transform: translate(-50%,-50%);
        display: block;
        top: 50%;
        left: 50%;
        width: 100%;
        text-align: center;
        position: absolute;
      }
    </style>
  </head>
  <body>
    <div id="center">
      <h1>We've scraped ${count} songs so far</h1>
    </div>
    <script>
      function updateCount () {
        window.fetch('/count.json')
          .then(response => response.json())
          .then(count => {
            const h1 = document.querySelector('h1')
            h1.innerHTML = "We've scraped " + count.toLocaleString() + " songs so far"
          })
      }
      window.setInterval(updateCount, 1000)
    </script>
  </body>
</html>
`

const app = express()
app.use(emojiFavicon('musical_score'))

app.get('/', async (req, res) => {
  const count = await countScrapedSongs()
  res.send(html(count.toLocaleString()))
})

app.get('/count.json', async (req, res) => {
  const count = await countScrapedSongs()
  res.send('' + count)
})

module.exports = function startServer() {
  app.listen(3000)
}
