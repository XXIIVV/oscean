'use strict'

RIVEN.lib.Mesh = function (id, rect, children) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = ''
  this.name = 'meshnode'

  this.update = function () {
    const bounds = { x: 0, y: 0 }
    for (const id in this.children) {
      const node = this.children[id]
      bounds.x = node.rect.x > bounds.x ? node.rect.x : bounds.x
      bounds.y = node.rect.y > bounds.y ? node.rect.y : bounds.y
    }
    this.rect.w = bounds.x + 7
    this.rect.h = bounds.y + 6
  }

  for (const cid in children) {
    children[cid].parent = this
    this.children.push(children[cid])
    this.update()
  }
}
