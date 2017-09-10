const filterRecursiveKeys = require('./filterRecursiveKeys')
const isGood = key => key !== 'bad'
const song = require('./formattedSong.json')
const filteredSong = require('./filteredSong.json')

test('it filters shallow keys', () => {
  const filtered = filterRecursiveKeys(isGood)({ good: true, bad: false })
  expect(filtered).toEqual({ good: true })
})

test('it filters deep keys whose values are primitives', () => {
  const filtered = filterRecursiveKeys(isGood)({
    nested: { good: true, bad: false },
    bad: false
  })
  expect(filtered).toEqual({ nested: { good: true } })
})

test('it filters deep keys whose values are objects', () => {
  const filtered = filterRecursiveKeys(isGood)({
    nested: { good: true, bad: { bad: false } },
    bad: false
  })
  expect(filtered).toEqual({ nested: { good: true } })
})

test('it filters songs for current_user_metadata', () => {
  const isOk = key => key !== 'current_user_metadata'
  const filtered = filterRecursiveKeys(isOk)(song)
  expect(filtered).toEqual(filteredSong)
})
