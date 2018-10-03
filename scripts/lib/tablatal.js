'use strict'

function Tablatal (data) {
  this.data = data

  this.parse = function (type) {
    const a = []
    const lines = this.data.trim().split('\n')
    const key = make_key(lines[0])
    for (const id in lines) {
      if (id == 0 || lines[id].trim() == '' || lines[id].substr(0, 1) == '~') { continue }
      const entry = {}
      for (const i in key) {
        entry[i] = lines[id].substr(key[i].from, key[i].to).trim()
      }
      a[a.length] = type ? new type(entry) : entry
    }
    return a
  }

  function make_key (raw) {
    const parts = raw.split(' ')
    const key = {}
    let distance = 0
    let prev = null
    for (const id in parts) {
      const part = parts[id].toLowerCase()
      if (part != '') {
        key[part] = { from: distance, to: 0 }
        if (key[prev]) { key[prev].to = distance - key[prev].from - 1 }
        prev = part
      }
      distance += part == '' ? 1 : part.length + 1
    }
    return key
  }
}
