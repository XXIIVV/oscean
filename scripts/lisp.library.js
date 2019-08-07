'use strict'

function Library (host) {
  // Modularity: Write simple parts connected by clean interfaces.
  // Composition: Design programs to be connected to other programs.
  // Parsimony: Write a big program only when it is clear by demonstration that nothing else will do.

  this.host = host

  this.dom = {
    create: (id, type = 'div', cl = '') => {
      const el = document.createElement(type)
      this.dom['set-attr'](el, 'id', id)
      this.dom['set-class'](el, cl)
      return el
    },
    'create-ns': (id, type = 'svg', cl = '') => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', type)
      this.dom['set-attr'](el, 'id', id)
      this.dom['set-class'](el, cl)
      return el
    },
    append: (el, children) => {
      for (const child of children) {
        el.appendChild(child)
      }
    },
    bind: (el, event, fn) => {
      el.addEventListener(event, fn)
    },
    'set-text': (el, text) => {
      el.textContent = text
    },
    'set-html': (el, html) => {
      el.innerHTML = html
    },
    'set-attr': (el, attr, value) => {
      el.setAttribute(attr, value)
    },
    'set-class': (el, cl) => {
      this.dom['set-attr'](el, 'class', cl)
    },
    'set-title': (title) => {
      document.title = title
    },
    'set-hash': (hash) => {
      document.location.hash = `${hash}`.toUrl()
    },
    scroll: (y) => {
      window.scrollTo(0, y)
    },
    show: (el) => {
      this.dom['set-class'](el, 'visible')
    },
    hide: (el) => {
      this.dom['set-class'](el, 'hidden')
    },
    body: document.body
  }

  this.on = {
    click: (fn) => {
      bindings.click = fn
    },
    load: (fn) => {
      bindings.load = fn
    },
    search: (fn) => {
      bindings.search = fn
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

  this.replace = (str, from, to) => {
    return str.replace(/\+/g, to)
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
    const a = []
    for (const item in arr) {
      a.push(fn(arr[item]))
    }
    return a
  }

  this.join = (arr, ch = '') => {
    return arr.join(ch)
  }

  this.first = (arr) => {
    return arr[0]
  }

  this.last = (arr) => {
    return arr[arr.length - 1]
  }

  this.len = (arr) => {
    return arr.length
  }

  this.entries = (obj) => {
    return obj ? Object.entries(obj) : []
  }

  this.debug = (arg) => {
    console.log(arg)
    return arg
  }

  this.set = (host, key, val) => {
    console.log(host, key, val)
    host[key] = val
  }

  this.gt = (a, b) => { // Returns true if a is greater than b, else false.
    return a > b
  }

  this.lt = (a, b) => { // Returns true if a is less than b, else false.
    return a < b
  }

  this.eq = (a, b) => { // Returns true if a is equal to b, else false.
    return a === b
  }

  this.and = (...args) => { // Returns true if all conditions are true.
    for (let i = 0; i < args.length; i++) {
      if (!args[i]) {
        return args[i]
      }
    }
    return args[args.length - 1]
  }

  this.or = (a, b, ...rest) => { // Returns true if at least one condition is true.
    let args = [a, b].concat(rest)
    for (let i = 0; i < args.length; i++) {
      if (args[i]) {
        return args[i]
      }
    }
    return args[args.length - 1]
  }

  this.get = (host, key) => {
    return host[key]
  }

  this.tunnel = (h, ...keys) => {
    return keys.reduce((acc, key) => {
      return key && acc && acc[key] ? acc[key] : null
    }, h)
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

  this.link = (target = this.host.name.toTitleCase(), name) => {
    return target.toLink(name)
  }

  this.template = (items, t, p) => {
    return items.map((val) => { return `${t(val, p)}` }).join('')
  }

  this.INDEX = (item) => {
    return `<h3>{(link "${item.name.toTitleCase()}")}</h3><h4>${item.bref}</h4><ul class='bullet'>${item.children.reduce((acc, term) => { return `${acc}<li>${term.bref}</li>`.template(term) }, '')}</ul>`.template(item)
  }

  this.REDIRECT = (item) => {
    return `<meta http-equiv="refresh" content="2; url=#${item}">`
  }

  this.TITLE = (item) => {
    return `<h2>${item.name.toTitleCase()}</h2><h4>${item.bref}</h4>`.template(item)
  }

  this.PHOTO = (item) => {
    return this.host.photo() && this.host.photo().pict !== item.pict ? item.name.toLink(`<img title="${item.name}" src="media/diary/${item.pict}.jpg"/>`) : ''
  }

  this.GALLERY = (item) => {
    return `${item.photo() ? item.name.toLink(`<img title="${item.name}" src="media/diary/${item.photo().pict}.jpg"/>`) : ''}<h2>${item.name.toTitleCase()}</h2><h4>${item.bref}</h4>`.template(item)
  }

  this.LIST = (item) => {
    return `<li>${item.bref}</li>`.template(item)
  }

  this.FULL = (item) => {
    return item.toString(true).template(item)
  }

  this.SPAN = (item) => {
    return item.logs.length > 10 && item.span.from && item.span.to ? `<li>${item.name.toTitleCase().toLink()} ${item.span.from}—${item.span.to}</li>` : ''
  }

  //

  this.add = (...args) => { // Adds values.
    return args.reduce((sum, val) => sum + val)
  }

  this.sub = (...args) => { // Subtracts values.
    return args.reduce((sum, val) => sum - val)
  }

  this.mul = (...args) => { // Multiplies values.
    return args.reduce((sum, val) => sum * val)
  }

  this.div = (...args) => { // Divides values.
    return args.reduce((sum, val) => sum / val)
  }

  this.mod = (a, b) => { // Returns the modulo of a and b.
    return a % b
  }

  this.rad = (degrees) => { // Convert radians to degrees.
    return degrees * (Math.PI / 180)
  }

  this.deg = (radians) => { // Convert degrees to radians.
    return radians * (180 / Math.PI)
  }

  this.clamp = (val, min, max) => { // Clamps a value between min and max.
    return this.min(max, this.max(min, val))
  }

  this.step = (val, step) => {
    return this.round(val / step) * step
  }

  this.match = (source, items) => {
    const filtered = items.filter((val) => { return source[val.toUpperCase()] })
    return filtered.map((val) => { return source[val.toUpperCase()] })
  }

  this.fix = (...items) => {
    return items[0].toFixed(items[1])
  }

  this.floor = (item) => {
    return Math.floor(item)
  }

  this.ceil = (item) => {
    return Math.ceil(item)
  }

  this.lc = (item) => {
    return item.toLowerCase()
  }

  this.tc = (item) => {
    return item.toTitleCase()
  }

  this.uc = (item) => {
    return item.toUpperCase()
  }

  this.cc = (item) => {
    return item.substr(0, 1).toUpperCase() + item.substr(1)
  }

  this.splice = (arr, index, length) => {
    return arr.splice(index, length)
  }

  this.slice = (arr, index, length) => {
    return arr.slice(index, length)
  }

  this.reverse = (arr) => {
    return arr.reverse()
  }

  this.first = (arr) => {
    return arr[0]
  }

  this.count = (item) => {
    return item.length
  }

  this.sort = (a) => {
    return a.sort()
  }

  this.uniq = (items) => {
    return items.filter((value, index, self) => { return self.indexOf(value) === index })
  }

  this.like = (source, target) => {
    return source.filter((val) => { return val.indexOf(target) > -1 })
  }

  this.daysSince = (greg) => {
    return parseInt((Date.now() - new Date(greg)) / 1000 / 86400)
  }

  this.msSince = (greg) => {
    return Date.now() - new Date(greg)
  }

  this.neralie = () => {
    return `${new Neralie()}`
  }

  this.arvelie = () => {
    return `${new Arvelie()}`
  }

  this.dtog = (q) => {
    return `${new Arvelie(q).toGregorian()}`
  }

  this.gtod = (q) => {
    return !isNaN(new Date(q)) ? `${new Date(q).toArvelie()}` : 'Invalid Date'
  }

  // Access

  this.document = document
  this.location = document.location

  // Monsters, to migrate to lisp

  this.Tablatal = tablatal
  this.Indental = indental
  this.Log = Log
  this.Term = Term
  this.List = List

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
    'select-table': (name) => {
      return this.database.tables[name]
    },
    find: (q) => {
      return this.database.index[q.toUpperCase()] ? this.database.index[q.toUpperCase()] : new Entry(q)
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

  // end
}
