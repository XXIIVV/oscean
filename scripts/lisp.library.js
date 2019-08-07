'use strict'

function Library (host) {
  // Modularity: Write simple parts connected by clean interfaces.
  // Composition: Design programs to be connected to other programs.
  // Parsimony: Write a big program only when it is clear by demonstration that nothing else will do.

  this.host = host

  this.debug = (arg) => {
    console.log(arg)
  }

  // str

  this.substr = (str, from, len) => {
    return str.substr(from, len)
  }

  this.split = (str, char) => {
    return str.split(char)
  }

  this.replace = (str, from, to) => {
    return str.replace(/\+/g, to)
  }

  this.lc = (str) => {
    return `${str}`.toLowerCase()
  }

  this.tc = (str) => {
    return `${str}`.toTitleCase()
  }

  this.uc = (str) => {
    return `${str}`.toUpperCase()
  }

  this.cc = (str) => {
    return `${str}`.substr(0, 1).toUpperCase() + str.substr(1)
  }

  // arr

  this.map = (arr, fn) => {
    return arr.map((val, id, arr) => fn)
  }

  this.filter = (arr, name) => {
    return arr.filter(window[name])
  }

  this.reduce = (arr, fn, acc = '') => {
    return arr.reduce((acc, val, id, arr) => fn, acc)
  }

  this.concat = (...arr) => {
    return arr.reduce((acc, item) => { return `${acc}${item}` }, '')
  }

  this.for = (arr, fn) => {
    return arr.reduce((acc, item) => { acc.push(fn(item)); return acc }, [])
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

  this.until = (arr, fn) => {
    for (const item of arr) {
      if (fn(item)) { return item }
    }
  }

  this.index = (arr, item) => {
    return arr.indexOf(item)
  }

  this.pry = (arr, name) => {
    return arr.map((val) => { return val[name] })
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

  this.sort = (arr) => {
    return arr.sort()
  }

  this.uniq = (arr) => {
    return arr.filter((value, index, self) => { return self.indexOf(value) === index })
  }

  this.like = (arr, target) => {
    return arr.filter((val) => { return val.indexOf(target) > -1 })
  }

  this.random = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  this.similars = (target, arr) => {
    return findSimilar(target, arr)
  }

  // obj

  this.keys = (obj) => {
    return obj ? Object.keys(obj) : []
  }

  this.values = (obj) => {
    return obj ? Object.values(obj) : []
  }

  this.entries = (obj) => {
    return obj ? Object.entries(obj) : []
  }

  this.set = (obj, key, val) => {
    obj[key] = val
  }

  this.get = (obj, key) => {
    return obj[key]
  }

  this.tunnel = (obj, ...keys) => {
    return keys.reduce((acc, key) => { return key && acc && acc[key] ? acc[key] : null }, obj)
  }

  // logic

  this.gt = (a, b) => {
    return a > b
  }

  this.lt = (a, b) => {
    return a < b
  }

  this.eq = (a, b) => {
    return a === b
  }

  this.neq = (a, b) => {
    return a !== b
  }

  this.and = (...args) => {
    for (let i = 0; i < args.length; i++) {
      if (!args[i]) {
        return args[i]
      }
    }
    return args[args.length - 1]
  }

  this.or = (a, b, ...rest) => {
    let args = [a, b].concat(rest)
    for (let i = 0; i < args.length; i++) {
      if (args[i]) {
        return args[i]
      }
    }
    return args[args.length - 1]
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

  this.link = (target = this.host.name.toTitleCase(), name, cl = '') => {
    return target.toLink(name, cl)
  }

  this.template = (items, t, p) => {
    return items.map((val) => { return `${t(val, p)}` }).join('')
  }

  this.INDEX = (item) => {
    return `<h3>{(link "${item.name.toTitleCase()}")}</h3><h4>${item.bref}</h4><ul class='bullet'>${item.children.reduce((acc, term) => { return `${acc}<li>${term.bref}</li>`.template(term) }, '')}</ul>`.template(item)
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

  // Math

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

  // Misc

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

  this.delay = (s, fn) => {
    setTimeout(fn, s * 1000)
  }

  this.is = {
    null: (q) => {
      return q === undefined || q === null
    },
    real: (q) => {
      return !this.is.null(q)
    },
    false: (q) => {
      return q === false
    },
    true: (q) => {
      return !this.is.false(q)
    }
  }

  // Lietal TODO placeholders

  this.lien = (q) => {
    return ''
  }

  this.enli = (q) => {
    return ''
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
    'set-value': (el, value) => {
      el.value = value
    },
    'get-attr': (el, attr) => {
      return el.getAttribute(attr)
    },
    'set-class': (el, cl) => {
      this.dom['set-attr'](el, 'class', this.uniq(cl.split(' ')).join(' '))
    },
    'get-class': (el) => {
      return this.dom['get-attr'](el, 'class')
    },
    'has-class': (el, cl) => {
      return this.dom['get-class'](el).indexOf(cl) > -1
    },
    'add-class': (el, cl) => {
      if (!this.dom['has-class'](el, cl)) {
        this.dom['set-class'](el, el.getAttribute('class') + ' ' + cl)
      }
    },
    'remove-class': (el, cl) => {
      if (this.dom['has-class'](el, cl)) {
        this.dom['set-class'](el, el.getAttribute('class').replace(cl, '').trim())
      }
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
    goto: (target) => {
      console.log(target)
    },
    'get-pixels': (path, ratio = 1, callback = null) => {
      const img = document.createElement('img')
      img.src = path
      img.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = parseInt(img.width * ratio)
        canvas.height = parseInt(img.height * ratio)
        canvas.getContext('2d').drawImage(this, 0, 0, canvas.width, canvas.height)
        try {
          callback(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data)
        } catch (err) {
          console.warn('Could not get photo data', err)
        }
      }
    },
    'get-lum': (pixels) => {
      let sum = 0
      for (let x = 0, len = pixels.length; x < len; x += 4) {
        sum += pixels[x] + pixels[x + 1] + pixels[x + 2]
      }
      return sum / (pixels.length * 0.75)
    },
    body: document.body
  }

  this.on = {
    click: (fn) => {
      BINDINGS.click = fn
    },
    load: (fn) => {
      BINDINGS.load = fn
    },
    search: (fn) => {
      BINDINGS.search = fn
    },
    page: (fn) => {
      BINDINGS.page = fn
    }
  }

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
            const key = entry.indexes[id].toUpperCase()
            if (this.database.index[key]) { console.warn(`Redefining ${key}.`) }
            this.database.index[key] = entry
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

  this.terminal = {
    run: (q) => {
      this.terminal.activate()
      const words = q.split(' ')
      const cmd = words.shift()
      const params = words.join()
      if (this.services[cmd]) {
        this.terminal.update(this.services[cmd](params))
      } else {
        console.warn('Unknown ' + cmd)
      }
      document.getElementById('termhand').innerHTML = `<b>${this.arvelie()} ${this.neralie()}</b> ${q}<span class='right' data-term='~close'>~close</span>`
    },
    activate: () => {
      document.getElementById('terminal').className = 'active'
    },
    update: (res) => {
      document.getElementById('termview').innerHTML = `${res.trim()}`
    }
  }

  this.services = {
    help: (q) => {
      return 'Available commands:\n' + plainTable(Object.keys(this.services))
    },

    atog: (q) => {
      return `${new Arvelie(q).toGregorian()}`
    },

    gtoa: (q) => {
      return !isNaN(new Date(q)) ? `${new Date(q).toArvelie()}` : 'Invalid Date'
    },

    otd: (q) => {
      const today = new Date().toArvelie()
      const a = []
      const logs = this.database['select-table']('horaire').filter(__onlyEvents).filter(__onlyThisDay)
      if (logs.length < 1) { return `There were no past events on this date.` }
      return `<b>On This Day</b>, on ${timeAgo(logs[0].time, 14)}, ${logs[0].host.name.toTitleCase()} — ${logs[0].name}.`
    },

    iso: (q) => {
      return new Date().toISOString()
    },

    task: (q) => {
      return `${new Log({ code: '-' + q }).task}`
    },

    next: (q) => {
      const used = []
      for (const log of this.database['select-table']('horaire')) {
        if (!log.pict) { continue }
        used.push(log.pict)
      }
      let available = 1
      while (available < 999) {
        const target = available.toString(16).toUpperCase()
        if (used.indexOf(target) < 0) { return `The next available diary ID is ${target}.` }
        available += 1
      }
      return `There are no available diary IDs under 999.`
    },

    walk: (q) => {
      const totalTime = performance.now()
      for (const id in this.database.index) {
        const entryTime = performance.now()
        this.database.index[id].toString()
        const entryTimeComplete = performance.now() - entryTime
        if (entryTimeComplete > 300) {
          console.log(`${id} slow: ${entryTimeComplete}ms.`)
        }
      }
      return `Walked ${Object.keys(this.database.index).length} indexes, in ${(performance.now() - totalTime).toFixed(2)}ms.`
    },

    rss: (q) => {
      return `<textarea>${Ø('rss').receive(q)}</textarea>`
    },

    static: (q) => {
      return `<textarea>${Ø('static').receive(q)}</textarea>`
    },

    heol: (q) => {
      return `${new Heol(q, null)}`
    },

    age: (q) => {
      return ((new Date() - new Date('1986-03-22')) / 31557600000)
    },

    progress: (q) => {
      const score = { ratings: 0, entries: 0 }
      for (const id in Ø('database').cache.lexicon) {
        score.ratings += Ø('database').cache.lexicon[id].rating()
        score.entries += 1
      }
      return ((score.ratings / score.entries) * 100)
    },

    forecast: (q) => {
      const forecast = new Forecast(this.database['select-table']('horaire'))
      return `${forecast.fh}fh of ${forecast.sector} ${forecast.task}`
    },

    orphans: (q) => {
      let index = {}
      let orphans = []
      for (const id in Ø('database').cache.lexicon) {
        const links = Ø('database').cache.lexicon[id].outgoing()
        for (const link of links) {
          index[link] = index[link] ? index[link] + 1 : 1
        }
      }
      for (const key of Object.keys(Ø('database').cache.lexicon)) {
        if (!index[key]) { orphans.push(key.toLowerCase()) }
      }
      return plainTable(orphans, 2, 3)
    },

    pomodoro: (q) => {
      if (!('Notification' in window)) {
        return 'This browser does not support desktop notification'
      }
      if (Notification.permission === 'granted') {
        setTimeout(() => {
          const body = `The pomodoro has ended at ${neralie()}.`
          new Notification('Oscean', { body, icon: 'media/icon/notification.jpg' })
          Ø('terminal').push('pomodoro', body)
        }, 20 * 86.4 * 1000)
        return `The pomodoro has started at ${neralie()}.`
      }
      if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => { this.pomodoro(q) })
        return 'You must allow notifications.'
      }
      return 'You have not allowed notifications.'
    },

    clear: (q) => {
      this.el.innerHTML = ''
      return ``
    },

    close: (q) => {
      document.getElementById('terminal').className = ''
      return ``
    },

    rss: () => {
      const logs = this.database['select-table']('horaire').filter(__onlyPast60).filter(__onlyPhotos)
      function makeRssItems (logs) {
        let html = ''
        for (const id in logs) {
          const log = logs[id]
          html += `
  <item>
    <title>${log.term} — ${log.name}</title>
    <link>https://wiki.xxiivv.com/${log.term.toUrl()}</link>
    <guid isPermaLink='false'>IV${log.pict}</guid>
    <pubDate>${log.time.toDate().toUTCString()}</pubDate>
    <dc:creator><![CDATA[Devine Lu Linvega]]></dc:creator>
    <description>
      &lt;img src="https://wiki.xxiivv.com/media/diary/${log.pict}.jpg"/&gt;
      &lt;br/&gt;
      ${log.host.data.BREF.template(log.host).stripHTML()}
    </description>
  </item>\n`
        }
        return html
      }
      return `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>XXIIVV — Journal</title>
  <link>https://wiki.xxiivv.com/</link>
  <description>Devine Lu Linvega's Journal</description>
  <image>
    <url>https://wiki.xxiivv.com/media/services/rss.jpg</url>
    <title>XXIIVV — koseki091450</title>
    <link>https://wiki.xxiivv.com</link>
  </image>
  <pubDate>${logs[0].time.toDate().toUTCString()}</pubDate>
  <generator>Oscean - Riven</generator>
  ${makeRssItems(logs)}
</channel>
</rss>`.toEntities()
    },

    unknown: (q) => {
      return `Unknown command <i>${q}</i>, type <i>help</i> to see available commands.`
    }
  }

  // Generators TODO

  this.JOURNAL_TEMPLATE = () => {
    const logs = this.database['select-table']('horaire')
    const html = logs.slice(0, 14 * 4).filter(__onlyOnce).slice(0, 20).reduce((acc, log) => {
      return `${acc}${log}`
    }, '')
    return `${html}` // ${new ActivityViz(logs)}
  }

  this.CALENDAR_TEMPLATE = () => {
    const logs = this.database['select-table']('horaire')
    const events = logs.filter(__onlyEvents)
    const html = `<ul class='tidy ${events.length > 10 ? 'col3' : ''}'>${events.reduce((acc, log, id, arr) => {
      return `
      ${acc}
      ${!arr[id - 1] || arr[id - 1].time.y !== log.time.y ? `<li class='head'>20${log.time.y}</li>` : ''}
      <li style='${log.time.offset > 0 ? 'color:#aaa' : ''}'>
        ${log.term.toLink(log.name)} <span title='${log.time}'>${timeAgo(log.time, 60)}</span>
      </li>`
    }, '')}</ul>`

    return `${html}`
  }
}
