'use strict'

function RouterNode (id, rect) {
  Node.call(this, id, rect)

  this.glyph = 'M60,120 L60,120 L150,120 L240,60 M60,150 L60,150 L240,150 M60,180 L60,180 L150,180 L240,240'

  this.archives = {}

  this.cache = { target: null, params: null, tables: null, result: null }

  this.receive = function (q) {
    this.cache.target = q.indexOf(':') > -1 ? q.split(':')[0].replace(/\+/g, ' ') : q.replace(/\+/g, ' ')
    this.cache.params = q.indexOf(':') > -1 ? q.split(':')[1] : null
    this.cache.tables = this.request('database').database
    this.cache.result = Ø('database').find(this.cache.target)

    this.send(this.cache)
  }
}
