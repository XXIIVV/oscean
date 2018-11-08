'use strict'

RIVEN.lib.Content = function BuildContentNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z'

  this.answer = function (q) {
    const analytics = this.signal('analytics').answer(q)
    const main = this.signal('default').answer(q)

    return {
      main: main,
      calendar: analytics.calendar,
      journal: analytics.journal,
      tracker: analytics.tracker
    }
  }
}
