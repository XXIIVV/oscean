'use strict'

RIVEN.lib.StaticService = function StaticNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M65,65 L65,65 L245,65 L245,245 L65,245 Z M65,125 L65,125 L245,125 M95,95 L95,95 L95,95 '

  function _header () {
    const lastLog = Ø('database').cache.horaire[0]
    return `\n\nUpdated ${lastLog.time} — ${lastLog.time.toGregorian()}\n\n`
  }

  function _item (term) {
    return `${term.name.toTitleCase()}\n  ${term.bref.toHeol(term).stripHTML()}\n${term.links ? Object.keys(term.links).reduce((acc, val) => { return `${acc}  - ${term.links[val]}\n` }, '') : ''}\n`
  }

  function _items () {
    const terms = Ø('database').cache.lexicon
    const items = Object.keys(terms).sort()
    return items.reduce((acc, val) => {
      return `${acc}${_item(terms[val])}`
    }, '').trim()
  }

  this.receive = function () {
    return `${_header()}${_items()}`
  }
}
