'use strict'

function tablatal (data, Type) {
  function makeKey (segs) {
    const keys = {}
    let counter = 0
    for (const id in segs) {
      const key = segs[id].trim().toLowerCase()
      const len = segs[id].length
      keys[key] = [counter, len - 1]
      counter += len
    }
    return keys
  }

  const a = []
  const lines = data.trim().split('\n')
  const key = makeKey(lines.splice(0, 1)[0].match(/(\w*\W*)/g))
  for (const id in lines) {
    if (lines[id].trim() === '') { continue }
    if (lines[id].substr(0, 1) === ';') { continue }
    const entry = {}
    for (const i in key) {
      entry[i] = lines[id].substr(key[i][0], key[i][1]).trim()
    }
    a.push(Type ? new Type(entry) : entry)
  }
  return a
}
