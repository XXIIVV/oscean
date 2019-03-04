'use strict'

RIVEN.lib.Twtxt = function TwtxtNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M65,65 L65,65 L245,65 L245,245 L65,245 Z M65,125 L65,125 L245,125 M95,95 L95,95 L95,95 '

  function _template (acc, log) {
    const date = log.time.toGregorian() + 'T01:01:01+01:00'
    const logText = log.toText() + '.'
    const lexText = log.host.bref.toHeol(log.host).stripHTML()
    const urlText = `https://wiki.xxiivv.com/${log.host.name.toUrl()}`
    let text = `${logText} ${lexText} ${urlText}`.trim()

    if (text.length > 140) {
      text = `${logText} ${lexText} ${urlText}`.trim()
    }

    if (text.length > 140) {
      text = `${lexText} ${urlText}`.trim()
    }

    if (text.length > 140) {
      console.warn(`[>${text.length}ch]${text}`)
      return `${acc}`
    }
    return `${acc}${date}\t${text}\n`
  }

  this.receive = function () {
    return Ø('database').cache.horaire.filter(__onlyLast).reduce(_template, '')
  }
}
