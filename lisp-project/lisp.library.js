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
    map: () => {
      const time = performance.now()
      const count = { links: 0, diaries: 0, events: 0 }
      const tables = this.database.tables
      // Connect Parents
      for (const id in tables.lexicon) {
        const term = tables.lexicon[id]
        const parent = !term.data.UNDE ? 'HOME' : term.data.UNDE.toUpperCase()
        if (!tables.lexicon[parent]) { console.warn(`Unknown parent ${parent} for ${term.name}`); continue }
        term.parent = tables.lexicon[parent]
      }
      // Connect children
      for (const id in tables.lexicon) {
        const term = tables.lexicon[id]
        if (!term.parent) { console.warn('Missing parent term', id); continue }
        const parent = term.parent.name
        if (!tables.lexicon[parent]) { console.warn('Missing children term', parent); continue }
        tables.lexicon[parent].children.push(term)
      }
      // Connect Logs
      for (const id in tables.horaire) {
        const log = tables.horaire[id]
        const index = log.term.toUpperCase()
        if (!log.term) { console.warn(`Empty log at ${log.time}`); continue }
        if (!tables.lexicon[index]) { console.warn(`Missing log term at ${log.time}`, index); continue }
        log.host = tables.lexicon[index]
        tables.lexicon[index].logs.push(log)
        // Span
        if (log.time.offset < 0) {
          tables.lexicon[index].span.from = `${log.time}`
          if (!tables.lexicon[index].span.to) {
            tables.lexicon[index].span.to = `${log.time}`
          }
        }
        if (log.isEvent) {
          tables.lexicon[index].events.push(log)
          count.events += 1
        }
        if (!log.pict) { continue }
        if (log.time.offset > 0) { continue }
        tables.lexicon[index].diaries.push(log)
        count.diaries += 1
      }
      console.info(`Mapped ${tables.horaire.length} logs, ${count.events} events, and ${count.diaries} diaries to ${Object.keys(tables.lexicon).length} terms, in ${(performance.now() - time).toFixed(2)}ms.`)
    },
    length: () => {
      return Object.keys(this.database.index).length
    }
  }

  this.dom = {
    create: (id, type = 'div', cl = '') => {
      const el = document.createElement(type)
      this.dom['set-attr'](el, 'id', id)
      this.dom['set-attr'](el, 'class', cl)
      return el
    },
    'create-ns': (id, type = 'svg', cl = '') => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', type)
      this.dom['set-attr'](el, 'id', id)
      this.dom['set-attr'](el, 'class', cl)
      return el
    },
    append: (host, children) => {
      for (const child of children) {
        host.appendChild(child)
      }
    },
    'set-text': (host, text) => {
      el.textContent = text
    },
    'set-html': (host, html) => {
      host.innerHTML = html
    },
    'set-attr': (host, attr, value) => {
      host.setAttribute(attr, value)
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

  this.substr = (str, from, len) => {
    return str.substr(from, len)
  }

  this.concat = (...items) => { // Concat multiple strings.
    return items.reduce((acc, item) => { return `${acc}${item}` }, '')
  }

  this.split = (string, char) => { // Split string at character.
    return string.split(char)
  }

  this.keys = (h) => {
    return Object.keys(h)
  }

  this.values = (h) => {
    return Object.values(h)
  }

  this.map = (arr, fn) => {
    return arr.map((val, id, arr) => fn)
  }

  this.filter = (arr, name) => {
    return arr.filter(window[name])
  }

  this.reduce = (arr, fn, acc = '') => {
    console.log(arr, fn)
    return arr.reduce((acc, val, id, arr) => fn, acc)
  }

  this.for = (arr, fn) => {
    for (const item in arr) {
      arr[item] = fn(arr[item])
    }
    return arr
  }

  this.join = (arr, ch = '') => {
    return arr.join(ch)
  }

  this.entries = (obj) => {
    return Object.entries(obj)
  }

  this.debug = (arg) => {
    console.log(arg)
    return arg
  }

  // Templating

  this.wrap = (content, tag, cl) => {
    return `<${tag} class='${cl}'>${content}</${tag}>`
  }

  this.bold = (item) => {
    return this.wrap(item, 'b')
  }

  this.ital = (item) => {
    return this.wrap(item, 'i')
  }

  this.code = (item) => {
    return this.wrap(item, 'code')
  }

  this.link = (target, handle) => {
    return `<a href='${target}'>${handle || target}</a>`
  }

  // Access

  this.document = document
  this.location = document.location
}
