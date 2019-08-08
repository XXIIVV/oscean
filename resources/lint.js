const fs = require('fs')
const styles = ['./links/main.css']
const tablatals = ['./scripts/database/asulodeta.tbtl', './scripts/database/horaire.tbtl']
const indentals = ['./scripts/database/lexicon.ndtl', './scripts/database/glossary.ndtl']
const lisps = ['./scripts/lisp/graph.lisp']

String.prototype.insert = function (s, i) { return [this.slice(0, i), `${s}`, this.slice(i)].join('') }

function lintLisp (input) {
  let txt = input.split('\n')
  // remove first and last line
  let head = txt.shift() 
  let foot = txt.pop()
  txt = txt.join('')
  // parse
  let val = txt.replace(/\n/g, '').replace(/ \)/g, ')').replace(/ +(?= )/g, '').replace(/\( \(/g, '((').replace(/\) \)/g, '))').trim()
  let depth = 0
  if (val.split('(').length !== val.split(')').length) {
    console.log('Uneven number of parens.')
    return
  }
  let inString = false
  for (let i = 0; i < val.length; i++) {
    const c = val.charAt(i)
    if (c === '"') { inString = !inString }
    if (inString === true) { continue }
    if (c === '(') { depth++ } else if (c === ')') { depth-- }
    if (c === ';') {
      const indent = '\n' + ('  '.repeat(depth))
      val = val.insert(indent, i)
      i += indent.length
    }
    if (c === '(') {
      const indent = '\n' + ('  '.repeat(depth - 1))
      val = val.insert(indent, i)
      i += indent.length
    }
  }
  return head + '\n' + val.trim() + '\n' + foot
}

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

for (const path of lisps) {
  const lines = fs.readFileSync(path, 'utf8')
  const fixed = lintLisp(lines)
  fs.writeFileSync(path, fixed)
  console.log(`${path} ${fixed.length - lines.length} characters.`)
}
