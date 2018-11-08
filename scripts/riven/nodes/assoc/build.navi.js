'use strict'

RIVEN.lib.Navi = function BuildNaviNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z'

  function _list (portal, term) {
    const _children = portal.children.reduce((acc, child, id) => {
      return `${acc}${`<ul><li>{(${child.name.toCapitalCase()})}</li>${_table_depth1(child, term)}</ul>`}`
    }, '')
    return `<ul>${_children}</ul>`
  }

  function _table_depth1 (portal, term) {
    const _children = portal.children.reduce((acc, child, id) => {
      return `${acc}${`<ul><li class='${child.name === term.name || child.name.toLowerCase() === term.unde.toLowerCase() ? 'selected' : ''}'>{(${child.name.toCapitalCase()})}</li>${child.name === term.name || child.name.toLowerCase() === term.unde.toLowerCase() ? _table_depth2(child, term) : ''}</ul>`}`
    }, '')
    return `<ul>${_children}</ul>`
  }

  function _table_depth2 (portal, term) {
    const _children = portal.children.reduce((acc, child, id) => {
      return `${acc}${`<ul><li class='${child.name === term.name ? 'selected' : ''}'>{(${child.name.toCapitalCase()})}</li></ul>`}`
    }, '')
    return `<ul>${_children}</ul>`
  }

  this.answer = function (q) {
    const portal = q.result ? q.result.portal() : null

    return portal ? `
    <svg id="glyph"><path transform="scale(0.15) translate(0,-150)" d="${portal.glyph()}"></path></svg>${_list(portal, q.result)}`.to_curlic() : ' '
  }
}
