'use strict'

RIVEN.lib.Table = function TableNode (id, rect, parser, Type) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M120,120 L120,120 L180,120 M120,180 L120,180 L180,180 M120,150 L120,150 L180,150'

  this.cache = null

  this.answer = function (q) {
    if (!DATABASE[this.id]) { console.warn(`Missing /database/${this.id}`); return null }

    this.cache = this.cache ? this.cache : parser(DATABASE[this.id], Type)

    return this.cache
  }

  this.find = function (q) {
    if (this.cache.constructor === Array) {
      if (!this.indexes) {
        this.indexes = this.assoc(this.cache)
      }
      return this.indexes[q.toUpperCase()]
    } else {
      return this.cache[q.toUpperCase()]
    }
  }

  this.assoc = function (a) {
    const time = performance.now()
    const h = {}
    for (const id in a) {
      if (!a[id].name) { continue }
      h[a[id].name.toUpperCase()] = a[id]
    }
    console.info(`table-${id}`, `Built special indexes in ${(performance.now() - time).toFixed(2)}ms.`)
    return h
  }
}
