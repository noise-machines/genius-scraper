const Lyricist = require('lyricist')
const bigquery = require('@google-cloud/bigquery')()
const filterRecursiveKeys = require('./filterRecursiveKeys')
const fs = require('fs')

const GENIUS_API_KEY = process.env.GENIUS_API_KEY
const lyricist = new Lyricist(GENIUS_API_KEY)

const dataset = bigquery.dataset('lyrics')
const table = dataset.table('songs')
const errorsTable = dataset.table('song_retrieval_errors')

const wait = delay =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, delay)
  })
const isOk = key => key !== 'current_user_metadata'

async function getNextSong(id) {
  let song = await lyricist.song(id, {
    textFormat: 'plain',
    fetchLyrics: true
  })
  console.log(`Got song ${song.id}`)
  song = filterRecursiveKeys(isOk)(song)
  return song
}

async function getAlreadySaved(song) {
  const query = `SELECT COUNT(id) FROM lyrics.songs WHERE id = ${song.id};`
  const response = await bigquery.query(query)
  const count = response[0][0].f0_
  const alreadySaved = count && count > 0
  if (alreadySaved) console.log(`Song ${song.id} was already saved`)
  return alreadySaved
}

async function saveToBigQuery(song) {
  console.log(`Trying to save song ${song.id}`)
  const alreadySaved = await getAlreadySaved(song)
  if (!alreadySaved) {
    const options = { ignoreUnknownValues: true }
    const response = await table.insert(song, options)
    console.log('Saved: ' + JSON.stringify(response))
    return response
  }
}

async function getErrorAlreadySaved(songId) {
  const query = `SELECT COUNT(id) FROM lyrics.song_retrieval_errors WHERE id = ${songId};`
  const response = await bigquery.query(query)
  const count = response[0][0].f0_
  const alreadySaved = count && count > 0
  if (alreadySaved)
    console.log(`Retrieval error for song ${songId} was already saved`)
  return alreadySaved
}

async function saveErrorToBigQuery(songId, error) {
  console.log(`Trying to save error for song ${songId}`)
  try {
    const alreadySaved = await getErrorAlreadySaved(songId)
    if (!alreadySaved) {
      const options = { ignoreUnknownValues: true }
      const response = await errorsTable.insert(
        { id: songId, error: JSON.stringify(error) },
        options
      )
      console.log('Saved error: ' + JSON.stringify(response))
      return response
    }
  } catch (error) {
    console.log(`Couldn't save song retrieval error ${songId}`)
  }
}

async function startAndSaveToLocalJSON() {
  while (true) {
    const song = await getNextSong()
    if (song) {
      const json = JSON.stringify(song)
      fs.appendFileSync('./songs.json', json + '\n')
    }
    fs.writeFileSync('./last-id.json', id)
    await wait(500)
  }
}

async function startAndSaveToBiqQuery() {
  let id = 0

  try {
    id = require('./last-id.json')
  } catch (err) {}

  console.log(`Starting from id ${id}`)
  while (true) {
    try {
      id += 1
      const song = await getNextSong(id)
      if (song) {
        await saveToBigQuery(song)
      }
    } catch (err) {
      saveErrorToBigQuery(id, err)
    }
    fs.writeFileSync('./last-id.json', id)
    await wait(1000)
  }
}

module.exports = startAndSaveToBiqQuery
