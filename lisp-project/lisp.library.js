'use strict'

function Library () {
  // Modularity: Write simple parts connected by clean interfaces.
  // Composition: Design programs to be connected to other programs.
  // Parsimony: Write a big program only when it is clear by demonstration that nothing else will do.

  this.Tablatal = tablatal
  this.Indental = indental
  this.Log = Log
  this.Term = Term

  this.database = {
    index: {},
    tables: {},
    'create-table': (name, parser, type) => {
      const time = performance.now()
      this.database.tables[name] = parser(database[name], type)
      console.info(`Created table ${name}, in ${(performance.now() - time).toFixed(2)}ms.`)
    },
    'create-index': () => {
      const time = performance.now()
      for (const id in this.database.tables) {
        const table = this.database.tables[id]
        for (const id in table) {
          const entry = table[id]
          for (const id in entry.indexes) {
            this.database.index[entry.indexes[id].toUpperCase()] = entry
          }
        }
      }
      console.info(`Indexed ${this.database.length()} searchables, in ${(performance.now() - time).toFixed(2)}ms.`)
    },
    find: (q) => {
      return this.database.index[q.toUpperCase()]
    },
    length: () => {
      return Object.keys(this.database.index).length
    }
  }

  this.dom = {
    create: (id, type = 'div', cl = '') => {
      const el = document.createElement(type)
      el.id = id
      el.className = cl
      return el
    },
    text: (el, s) => {
      el.textContent = s
    },
    append: (host, children) => {
      for (const child of children) {
        host.appendChild(child)
      }
    },
    'set-html': (host, html) => {
      host.innerHTML = html
    },
    'set-attr': (host, attr, value) => {
      host.setAttribute(attr, value)
    },
    wrap: (content, tag, cl) => {
      return `<${tag} class='${cl}'>${content}</${tag}>`
    },
    body: document.body
  }

  this.on = {
    click: (fn) => {
      bindings.click = fn
    },
    load: (fn) => {
      bindings.load = fn
    }
  }

  this.document = document
  this.location = document.location

  this.substr = (str, from, len) => {
    return str.substr(from, len)
  }

  this.concat = (...items) => { // Concat multiple strings.
    return items.reduce((acc, item) => { return `${acc}${item}` }, '')
  }

  this.split = (string, char) => { // Split string at character.
    return string.split(char)
  }

  this.debug = (arg) => {
    console.log(arg)
    return arg
  }
}
