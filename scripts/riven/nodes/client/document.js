'use strict'

function DocumentNode (id, rect, ...params) {
  DomNode.call(this, id, rect)

  this.glyph = 'M150,60 L150,60 L240,150 L150,240 L60,150 Z M150,120 L150,120 L180,150 L150,180 L120,150 Z '

  this.receive = function (content = { title: 'Unknown' }) {
    document.title = content.title

    this.label = `${content.title}`

    setTimeout(() => {
      this.remove_class('loading')
      this.add_class(content.theme)
      this.add_class('ready')
    }, 100)

    if (content && content[this.id] != null) {
      this.update(content[this.id])
      this.send(content[this.id])
    }
  }

  this.install = function (elements) {
    if (RIVEN.is_graph) { return }

    this.is_installed = true

    for (const id in elements) {
      this.el.appendChild(elements[id])
    }
  }
}

function on_scroll () {
  const info_el = document.getElementById('info')
  const scroll = window.scrollY

  // Info
  if (scroll > 0) {
    if (info_el.className != 'ghost') {
      info_el.className = 'ghost'
    }
  } else {
    if (info_el.className == 'ghost') {
      info_el.className = ''
    }
  }

  // Logo/Search
  const header_el = document.getElementById('header')
  const logo_el = document.getElementById('logo')
  const menu_el = document.getElementById('menu')
  if (scroll > header.offsetHeight - 120) {
    if (logo_el.className != 'sticky') { logo_el.className = 'sticky' }
    if (menu_el.className != 'sticky') { menu_el.className = 'sticky' }
  } else {
    if (logo_el.className == 'sticky') { logo_el.className = '' }
    if (menu_el.className == 'sticky') { menu_el.className = '' }
  }
}

window.addEventListener('scroll', on_scroll)
