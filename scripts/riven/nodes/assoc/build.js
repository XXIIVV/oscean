'use strict'

RIVEN.lib.Build = function BuildNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M150,60 L150,60 L240,150 L150,240 '

  this.receive = function (q) {
    const builds = this.request(q)

    this.send({
      title: `XXIIVV — ${q.target.toCapitalCase()}`,
      theme: q.result ? q.result.theme : 'default',
      view: {
        header: builds._header,
        core: {
          sidebar: builds._sidebar,
          content: builds._content,
          navi: builds._navi
        }
      }
    })

    document.body.appendChild(this.signal('assoc').signal('client').signal('view').answer())
  }
}
