'use strict'

RIVEN.lib.Missing = function MissingTemplate (id, rect, ...params) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q) {
    const index = Object.keys(Ø('database').index)
    const similar = findSimilar(q.target.toUpperCase(), index)

    return `
    <p>Sorry, there are no pages for {*/${q.target.toCapitalCase()}*}, did you mean {(${similar[0].word.toCapitalCase()})} or {(${similar[1].word.toCapitalCase()})}?</p>
    <p>{*Create this page*} by submitting a {Pull Request(https://github.com/XXIIVV/oscean)}, or if you believe this to be an error, please contact {@neauoire(https://twitter.com/neauoire)}. Alternatively, you locate missing pages from within the {progress tracker(Tracker)}.</p>`.to_curlic()
  }

  function findSimilar (target, list) {
    const similar = []
    for (const key in list) {
      const word = list[key]
      similar.push({ word: word, value: similarity(target, word) })
    }
    return similar.sort(function (a, b) {
      return a.value - b.value
    }).reverse()
  }

  function similarity (a, b) {
    let val = 0
    for (let i = 0; i < a.length; ++i) { val += b.indexOf(a.substr(i)) > -1 ? 1 : 0 }
    for (let i = 0; i < b.length; ++i) { val += a.indexOf(b.substr(i)) > -1 ? 1 : 0 }
    a = a.split('').sort().join('')
    b = b.split('').sort().join('')
    for (let i = 0; i < a.length; ++i) { val += b.indexOf(a.substr(i)) > -1 ? 1 : 0 }
    for (let i = 0; i < b.length; ++i) { val += a.indexOf(b.substr(i)) > -1 ? 1 : 0 }
    return val
  }
}
