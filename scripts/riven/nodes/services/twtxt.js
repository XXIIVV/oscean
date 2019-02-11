'use strict'

RIVEN.lib.Twtxt = function TwtxtNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M65,65 L65,65 L245,65 L245,245 L65,245 Z M65,125 L65,125 L245,125 M95,95 L95,95 L95,95 '

  function _template (acc, log) {
    const date = log.time.toGregorian() + 'T12:00:00'
    return `${acc}${date}\t${log.toText()}\n`
  }

  this.receive = function () {
    return Ø('database').cache.horaire.filter(__onlyPast).reduce(_template, '')
  }
}
