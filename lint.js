const fs = require('fs')
const styles = ['./links/main.css']
const tablatals = ['./scripts/database/asulodeta.tbtl', './scripts/database/horaire.tbtl']
const indentals = ['./scripts/database/lexicon.ndtl', './scripts/database/glossary.ndtl']

function lintStyle (txt) {
  const lines = txt.split('\n')
  return lines.filter((line) => {
    // Remove blanks
    return line.trim() !== ''
  }).map((line) => {
    line = line.replace(/;/g, '; ')
    // Remove double spaces
    line = line.replace(/ {2}/g, ' ')
    // Remove trailing ;
    line = line.replace('; }', ' }').replace(';}', ' }')
    // Always begin nested with double-space
    line = line.substr(0, 1) === ' ' ? line.replace(' ', '  ') : line
    // Trim
    return line.trimEnd()
  }).join('\n')
}

function lintTablatal (txt) {
  const lines = txt.split('\n')
  return lines.filter((line) => {
    // Remove blanks
    return line.trim() !== ''
  }).map((line) => {
    // Trim
    return line.trimEnd()
  }).join('\n')
}

function lintIndetal (txt) {
  const lines = txt.split('\n')
  return lines.filter((line) => {
    // Remove blanks
    return line.trim() !== ''
  }).map((line) => {
    // Trim
    return line.trimEnd()
  }).join('\n')
}

console.log('Starting..')

for (const path of styles) {
  const lines = fs.readFileSync(path, 'utf8')
  const fixed = lintStyle(lines)
  fs.writeFileSync(path, fixed)
  console.log(`${path} ${fixed.length - lines.length} characters.`)
}

for (const path of indentals) {
  const lines = fs.readFileSync(path, 'utf8')
  const fixed = lintIndetal(lines)
  fs.writeFileSync(path, fixed)
  console.log(`${path} ${fixed.length - lines.length} characters.`)
}

for (const path of tablatals) {
  const lines = fs.readFileSync(path, 'utf8')
  const fixed = lintTablatal(lines)
  fs.writeFileSync(path, fixed)
  console.log(`${path} ${fixed.length - lines.length} characters.`)
}
