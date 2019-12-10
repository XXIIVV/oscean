'use strict'

function Runic (lib = {}) {
  function filter (line) {
    const pass = lib[line.substr(0, 1)] && line.substr(1, 1) === ' '
    if (pass !== true) { console.warn('Runic', 'Error near: ', line) }
    return pass
  }

  function stash (acc, line) {
    const rune = line.substr(0, 1)
    const prev = acc[acc.length - 1] ? acc[acc.length - 1] : [{ rune: rune, arr: [] }]
    if (prev.rune === rune) { prev.arr.push(line.substr(2)) } else { acc.push({ rune: rune, arr: [line.substr(2)] }) }
    return acc
  }

  function wrap (html, tag, cl) {
    return tag ? `<${tag} ${cl ? 'class="' + cl + '"' : ''}>${html}</${tag}>` : html
  }

  this.run = (input = [], host = null) => {
    return input.filter(filter).reduce(stash, []).reduce((acc, stash) => {
      const rune = lib[stash.rune]
      const html = stash.arr.reduce((acc, val, id) => {
        const inner = rune.fn ? rune.fn(stash.arr[id], host) : stash.arr[id]
        const outer = rune.tag ? wrap(inner, rune.tag, rune.class) : inner
        return `${acc}${outer}`
      }, '')
      return `${acc}${wrap(html, rune.wrapper, rune.wrapperClass)}`
    }, '')
  }
}
