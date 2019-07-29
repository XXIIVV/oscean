const fs = require('fs')
const path = 'twtxt.txt'
const iso = new Date().toISOString()
const prev = fs.readFileSync(path, 'utf8')
const entry = process.argv[2]

if (fs.existsSync(path)) {
  fs.writeFileSync(path, iso + '   ' + entry + '\n' + prev)
  console.log(`Added entry #${prev.split('\n').length + 1}.\n> ${iso} ${entry}\n\n`)
}
