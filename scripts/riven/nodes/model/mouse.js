'use strict'

RIVEN.lib.Mouse = function MouseNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,150 L60,150 L240,150 L240,150 L150,240 M150,60 L150,60 L240,150'

  window.addEventListener('click', (e) => { this.click(e) })

  this.click = function (e) {
    if(e.button || e.which === 3 || e.button === 2){ return }

    const in_tab = e.ctrlKey || e.shiftKey || e.metaKey
    const el = e.target.getAttribute('data-goto') ? e.target : e.target.parentNode.getAttribute('data-goto') ? e.target.parentNode : null
    const view = e.target.getAttribute('data-view') ? e.target : e.target.parentNode.getAttribute('data-view') ? e.target.parentNode : null

    if (view && !in_tab) {
      const dataView = view.getAttribute('data-view')
      Ø('document').setMode('view', dataView)
      e.preventDefault()
      return
    }

    if (!el || el.className === 'external' || in_tab) { return }

    const dataGoto = el.getAttribute('data-goto')
    Ø('query').bang(dataGoto)
    e.preventDefault()
  }
}
