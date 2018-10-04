'use strict'

RIVEN.lib.navi = function BuildNaviNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z'

  function _path (portal) {
    return `<svg id="glyph"><path transform="scale(0.12) translate(0,-150)" d="${portal.glyph()}"></path></svg>`
  }

  function _table (portal, term) {
    const _children = portal.children.reduce((acc, child, id) => {
      return `${acc}${`<tr class='head'><th class='${term && child.name === term.name ? 'selected' : ''}'>{(${child.name.capitalize()})}</th><td>${_table_depth1(child, term)}</td></tr>`}`
    }, '')
    return `<table width='100%'>${_children}</table>`
  }

  function _table_depth1 (portal, term) {
    const _children = portal.children.reduce((acc, child, id) => {
      return `${acc}${term && child.name === term.name ? `<span class='depth1'><b>${child.name.capitalize()}</b></span> ` : `<span class='depth1'>{(${child.name.capitalize()})}${_table_depth2(child, term)}</span> `}`
    }, '')
    return portal.children.length > 0 ? `${_children.trim()}` : ''
  }

  function _table_depth2 (portal, term) {
    const _children = portal.children.reduce((acc, child, id) => {
      return `${acc}${term && child.name === term.name ? `<span class='depth2'>{*${child.name.capitalize()}*}</span> ` : `<span class='depth2'>{(${child.name.capitalize()})}</span> `}`
    }, '')
    return portal.children.length > 0 ? `(${_children.trim()})` : ''
  }

  this.answer = function (q) {
    const portal = q.result ? q.result.portal() : null

    return portal ? `
    <table>
    <tr><td>${_path(portal)}</td></tr>
    <tr><td>${_table(portal, q.result)}</td></tr>
    </table>`.to_curlic() : ' '
  }
}
