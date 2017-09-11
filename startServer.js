const express = require('express')
const emojiFavicon = require('emoji-favicon')
const bigquery = require('@google-cloud/bigquery')()

async function countScrapedSongs() {
  const query = `SELECT COUNT(*) FROM lyrics.songs;`
  const response = await bigquery.query(query)
  const count = response[0][0].f0_
  return count
}

const musicalNotesEmoji = `iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAFYUlEQVR4Ae2ZA3QkWRSG/3OqutxV
bUSj3mRt27Zt2/bu0dq2bdt8Y9u2JzOduduvXirdg6AxldX/Bfe9g/uVhbKSwglQ0GnZXp9jEN6H
hE5JtTEzRA4ZhHPQGZHfdyhMDpkkT4YC37OxSXz5g2SQSjgBfkd6Nkg26Y3yO4FnlSw+gs9RtJkW
qaPQAJ77pPl+74j7GaQ3Yl2INICwAXzNIwZJj0jwAGE/+Bmlt0HYHl5SMuEo+BhdzxozIcHLUQHC
ISg1W69TLIlDDNJ/zo+1nwPknMarUsCmbIMiqRtmUWyKN6odoVKA1urP61JAhtUVSWSURaHxoq7u
qy7TSFnK69JAF5YqEmeERfYYXiV66gv4mdCYyUclUSiQZtWHV6N9sLFBOBaALn9qkEFl7YJAHUs2
U8Uyh2fQPrAMkk6Do35tiSvBBEgVEahhDYc3oCNoY83XzAlBMknny38F4LOA+UU4fyUcDsVnAZxv
Z8Nku+2lRmwP+CgASXpQ3IhYYvWfD1RMIM3qn9r42k3bYMObgkPCFKWQu/oDFPuAz5bHCgJ1LMPq
WyXTy57L20fcGzFleWwMny0XLpBXaIte5jzRXiy/NYXPlg0XiAu4wlPJa1dP4gZ9VMhtHyaLzF76
BP03Pl8+BQKpNs6E0iMORdylNxpxMoDH8Skqk7xAutUzIY4KUjiH235X8FwkjZJQAbhArJl0K4ch
IvoE0d7M4kCI7K0SHJSfDgnc57jtLcJp8FKtE3b1RQCWMYcvv03yfTLyBOebL+NMnIA6lJdaT6CV
fQCn2e6ZT58AC14atBdi2STFXDGF4cCKCKRYd7Ye22AlnFmOu/prR3gz6dHBpjilqCpHmpIUJYtC
0zfoWeItWV6AHwc1rHYl9MUO2WTN8cbOBJtiFM+RbCbuKljTa1kpoIbF2kRfxk+89lAxsoda4oDM
wf/z3TOawyGd7BExVjQrCsTPT6+zMlrWJn2SN1J62pQbL9W+0183yLhdOy5wjzklRFwy0Du9TvEU
CCRZ3eF1WBn+GCq/KYODiJa1SB2OBgCSPB97gCei97MpN0+oRvHJC6RWexQoQwzCjRDZUieDsCVE
euNSiGT0rMkFDilJICpoRUB+36CWRpuppAxRIMALeBnNkT8yuMCZa0AAl2qE2yFiyYvkX2QIcDX6
wctFGgUI56wJgWqlUf60pelr+YsQDpSy0CFyiMoF9kbxqWoRSLIet69/6KarYH4jL8ucKuquZ0tz
q64QdZdzZaq7UNSROwMkNdWfyOviKBCIsRrWg2VWoWtfucme6o2qB2sLu/bhVY+eclNyhJiNTJDJ
ms2rYnEF8grJ1eKMxHJnhDeK9jcnJXrySllojxNz2jypKd6XV8WCNIvk+Sj64uox/kTW+q5g5iX+
Vx2pDeH/7Y+x3GC8Kp68AD8THh5Ha2BvTMPLSKEw1+F9ACkMz1WlplCAnwlbB3G8gEV4ATvBy4GB
sbnxZJwDVEAgybod3g1tg2pchx8xByzH2ACpJP+OBqAsgVAzcSHQIbAxNuNIjdgD8F0gD3rjwM4V
eBnnV0qA74QfrfPi+kUR6W2PEFWpFAhE3dc0NUURHaEsFlWp5AVcIizaKuFe+kRtoTbfHJefCw0A
hXvxqlRQc2i0g0R+2oA2onqKkvZGy9zhaAxexqtSQbSDBM5ahzaldak71ZCyCAq8DMfh8CPqdzVU
T10oTVFSCSl4GYiT/REYEnbfjdhkkjxNhgfmYHufvpLZbnuLtMI3g5thJnT4kmN1Msng2/8WeFHw
HS6Fb3lW5e23hJdt8CMehK85E78gi3dwO+7DR/gUe6MTEseuOA2bQUFF8n/+AnRasRgSGcnoAAAA
AElFTkSuQmCC`

const html = count => `
<html>
  <head>
    <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64,${musicalNotesEmoji}" />
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
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
