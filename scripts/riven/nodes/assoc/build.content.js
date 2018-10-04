'use strict'

RIVEN.lib.content = function BuildContentNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z'

  this.answer = function (q) {
    if (!q.result) { return this.signal('default').answer(q) }

    const template = q.params ? q.params.toLowerCase() : q.result.type ? q.result.type.toLowerCase() : null

    if (!template) { return this.signal('default').answer(q) }

    const responder = this.signal(template)

    if (!responder) { return this.signal('default').answer(q) }

    return responder.answer(q)
  }
}
