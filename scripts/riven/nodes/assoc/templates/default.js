'use strict'

RIVEN.lib.default = function DefaultTemplate (id, rect, ...params) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q) {
    if (!q.result) { return this.signal('missing').answer(q) }
    return `${q.result.body()}`
  }
}
