const fs = require('fs')
const path = 'twtxt.txt'

const entry = process.argv[2]
const d = new Date()
const iso = d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + 'Z'

function pad (n) { return n < 10 ? '0' + n : n }

let txt = ''

if (fs.existsSync(path)) {
  txt = fs.readFileSync(path, 'utf8')
  console.log(`Found ${path}, ${txt.split('\n').length} entries.`)
}

console.log(`Adding entry #${txt.split('\n').length + 1}\n${iso} ${entry}`)

fs.writeFileSync(path, iso + '   ' + entry + '\n' + txt)

console.log('Done.')
