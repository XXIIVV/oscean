'use strict'

RIVEN.lib.Database = function DatabaseNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M60,150 L60,150 L240,150 M60,105 L60,105 L240,105 M60,195 L60,195 L240,195 '

  this.cache = null
  this.index = {}

  function index_tables (tables) {
    const h = {}
    const time = performance.now()
    for (const table_id in tables) {
      for (const entry_id in tables[table_id]) {
        for (const index_id in tables[table_id][entry_id].indexes) {
          const entry = tables[table_id][entry_id]
          const index = entry.indexes[index_id].toUpperCase()
          h[index] = entry
        }
      }
    }
    console.info('database', `Indexed ${Object.keys(h).length} searchables in ${(performance.now() - time).toFixed(2)}ms.`)
    return h
  }

  this.answer = function (q) {
    if (!this.cache) {
      this.cache = this.request(this.cache)
      this.index = index_tables(this.cache)
      // Send ref to Ø(MAP), for filtering.
      this.send(this.cache)
    }
    return this.cache
  }

  this.find = function (q, deep = false) {
    const key = q.toUpperCase()
    return this.index[key]
  }
}

const DATABASE = {}
