'use strict'

RIVEN.lib.Document = function DocumentNode (id, rect, ...params) {
  RIVEN.lib.Dom.call(this, id, rect)

  this.glyph = 'M150,60 L150,60 L240,150 L150,240 L60,150 Z M150,120 L150,120 L180,150 L150,180 L120,150 Z '

  this.view = 'main'

  this.receive = function (content = { title: 'Unknown' }) {
    document.title = content.title

    this.label = `${content.title}`

    this.setView(content.view)

    if (content && content[this.id] !== null) {
      this.update(content[this.id])
      this.send(content[this.id])
    }
  }

  this.install = function (elements) {
    if (!params[0]) { return }

    this.is_installed = true

    for (const id in elements) {
      this.el.appendChild(elements[id])
    }
  }

  this.setView = function (view = 'main') {
    if (this.view === view && this.view !== 'main') { this.setView('main'); return }

    this.remove_class(this.view)
    this.view = view
    this.add_class(this.view)

    if (this.view === 'main') {
      this.remove_class('analytics')
    } else {
      this.add_class('analytics')
    }
  }
}

function on_scroll () {
  const info_el = document.getElementById('info')
  const scroll = window.scrollY

  // Logo/Search
  const header_el = document.getElementById('header')
  const logo_el = document.getElementById('logo')
  const menu_el = document.getElementById('menu')
  if (scroll > header.offsetHeight - 90) {
    if (menu_el.className !== 'sticky') { menu_el.className = 'sticky' }
  } else {
    if (menu_el.className === 'sticky') { menu_el.className = '' }
  }
}

window.addEventListener('scroll', on_scroll)
