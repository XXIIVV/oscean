'use strict'

function tablatal (data, Type) {
  function makeKey (line) {
    const parts = line.split(' ')
    const key = {}
    let distance = 0
    let prev = null
    for (const id in parts) {
      const part = parts[id].toLowerCase()
      if (part !== '') {
        key[part] = { from: distance, to: 0 }
        if (key[prev]) { key[prev].to = distance - key[prev].from - 1 }
        prev = part
      }
      distance += part === '' ? 1 : part.length + 1
    }
    return key
  }

  const a = []
  const lines = data.trim().split('\n')
  const key = makeKey(lines.splice(0, 1)[0])
  for (const id in lines) {
    if (parseInt(id) === 0 || lines[id].trim() === '' || lines[id].substr(0, 1) === '~') { continue }
    const entry = {}
    for (const i in key) {
      entry[i] = lines[id].substr(key[i].from, key[i].to).trim()
    }
    a[a.length] = Type ? new Type(entry) : entry
  }
  return a
}
