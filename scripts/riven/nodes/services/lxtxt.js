'use strict'

RIVEN.lib.Lxtxt = function LxtxtNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M65,65 L65,65 L245,65 L245,245 L65,245 Z M65,125 L65,125 L245,125 M95,95 L95,95 L95,95 '

  function _template (acc, id) {
    const term = Ø('database').cache.lexicon[id]
    if (term.logs.length < 1) { return `${acc}` }
    const name = term.name.toTitleCase()
    const date = term.logs[0].time.toGregorian() + 'T12:00:00'
    const text = term.bref.toHeol(term).stripHTML().trim()
    return `${acc}${name}\t${date}\t${text}\n`
  }

  this.receive = function () {
    return Object.keys(Ø('database').cache.lexicon).reduce(_template, '')
  }
}
