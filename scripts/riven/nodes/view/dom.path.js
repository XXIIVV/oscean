'use strict'

RIVEN.lib.Path = function PathNode (id, rect, ...params) {
  RIVEN.lib.Dom.call(this, id, rect)

  this.type = params[0] ? params[0] : 'div'
  this.glyph = 'M60,90 L60,90 L60,60 L90,60 M210,60 L210,60 L240,60 L240,90 M240,210 L240,210 L240,240 L210,240 M90,240 L90,240 L60,240 L60,210 '
  this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  this.el.id = this.id
  this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  this.path.setAttribute('transform', 'scale(0.165,0.165) translate(-50,-50)')
  this.el.appendChild(this.path)
  this.isInstalled = false

  this.receive = function (content) {
    if (content && content[this.id] !== null) {
      this.update(content[this.id])
      this.send(content[this.id])
    }
  }

  this.update = function (content) {
    if (typeof content === 'string') {
      this.path.setAttribute('d', content)
    }
  }
}
