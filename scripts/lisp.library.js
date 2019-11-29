'use strict'

/* global performance */

function Library (host) {
  // Modularity: Write simple parts connected by clean interfaces.
  // Composition: Design programs to be connected to other programs.
  // Parsimony: Write a big program only when it is clear by demonstration that nothing else will do.

  this.host = host

  // str

  this.substr = (str, from, len) => {
    return `${str}`.substr(from, len)
  }

  this.split = (str, char) => {
    return `${str}`.split(char)
  }

  this.replace = (str, from, to) => {
    return `${str}`.replaceAll(from, to)
  }

  this.lc = (str) => {
    return `${str}`.toLowerCase()
  }

  this.tc = (str) => {
    return `${str}`.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
  }

  this.uc = (str) => {
    return `${str}`.toUpperCase()
  }

  this.cc = (str) => {
    return `${str}`.substr(0, 1).toUpperCase() + `${str}`.substr(1)
  }

  // arr

  this.map = (arr, fn) => {
    return arr.map((val, id, arr) => fn)
  }

  this.filter = (arr, name) => {
    return arr.filter(window[name])
  }

  this.sort = (arr, name) => {
    return arr.sort(window[name])
  }

  this.reduce = (arr, fn, acc = '') => {
    return arr.reduce((acc, val, id, arr) => fn, acc)
  }

  this.concat = (...arr) => {
    return arr.reduce((acc, item) => { return `${acc}${item}` }, '')
  }

  this.join = (arr, ch = '') => {
    return arr ? arr.join(ch) : arr
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

  this.for = (arr, fn) => {
    return arr.reduce((acc, item) => { acc.push(fn(item)); return acc }, [])
  }

  this.rest = ([_, ...arr]) => {
    return arr
  }

  this.len = (arr) => {
    return arr.length
  }

  this.index = (arr, item) => {
    return arr.indexOf(item)
  }

  this.pry = (arr, name) => {
    return arr.map((val) => { return val[name] })
  }

  this['pry-method'] = (arr, name, param) => {
    return arr.map((val) => { return val[name](param) })
  }

  this.uniq = (arr) => {
    return arr.filter((value, index, self) => { return self.indexOf(value) === index })
  }

  this.like = (arr, target) => {
    return arr.filter((val) => { return val.indexOf(target) > -1 })
  }

  this.until = (arr, fn) => {
    for (const item of arr) {
      if (fn(item)) { return item }
    }
  }

  this.random = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  this.similars = (target, arr) => {
    return findSimilar(target, arr)
  }

  // obj

  this.set = (obj, key, val) => {
    obj[key] = val
  }

  this.get = (obj, key) => {
    return obj[key]
  }

  this.keys = (obj) => {
    return obj ? Object.keys(obj) : []
  }

  this.values = (obj) => {
    return obj ? Object.values(obj) : []
  }

  this.entries = (obj) => {
    return obj ? Object.entries(obj) : []
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
    for (const arg of args) {
      if (!arg) { return arg }
    }
    return args[args.length - 1]
  }

  this.or = (...args) => {
    for (const arg of args) {
      if (arg) { return arg }
    }
    return args[args.length - 1]
  }

  this.either = (...args) => {
    for (const arg of args) {
      if (arg) { return arg }
    }
    return null
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

  this.clamp = (val, min, max) => { // Clamps a value between min and max.
    return Math.min(max, Math.max(min, val))
  }

  this.floor = (item) => {
    return Math.floor(item)
  }

  this.ceil = (item) => {
    return Math.ceil(item)
  }

  this.step = (val, step) => {
    return Math.round(val / step) * step
  }

  this.match = (source, items) => {
    const filtered = items.filter((val) => { return source[val.toUpperCase()] })
    return filtered.map((val) => { return source[val.toUpperCase()] })
  }

  this.fix = (...items) => {
    return items[0].toFixed(items[1])
  }

  // Javascript

  this.require = (name, params) => {
    return window[name]
  }

  this.new = (name, params) => {
    return new window[name](params)
  }

  this.debug = (arg) => {
    console.log(arg)
  }

  this.wait = (s, fn) => {
    setTimeout(fn, s * 1000)
  }

  this.perf = (id, fn) => {
    const time = performance.now()
    fn()
    console.info(`Completed ${id}, in ${(performance.now() - time).toFixed(2)}ms.`)
  }

  this.test = (name, a, b) => {
    return `${name} ${`${a}` === `${b}` ? 'OK' : `FAILED [${a}] [${b}]`} \n`
  }

  // Time

  this.time = {
    now: () => {
      return Date.now()
    },
    new: (g) => {
      return new Date(g)
    },
    iso: (g) => {
      return (g ? new Date(g) : new Date()).toISOString()
    },
    doty: () => {
      const year = this.getFullYear()
      const start = new Date(year, 0, 0)
      const diff = (this - start) + ((start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000)
      return Math.floor(diff / 86400000)
    },
    'years-since': (q = '1986-03-22') => {
      return ((new Date() - new Date(q)) / 31557600000)
    }
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

  // Special

  this.neralie = () => {
    return `${new Neralie()}`
  }

  this.arvelie = () => {
    return `${new Arvelie()}`
  }

  this.atog = (q) => {
    return `${new Arvelie(q).toGregorian()}`
  }

  this.gtoa = (q) => {
    return !isNaN(new Date(q)) ? `${new Date(q).toArvelie()}` : 'Invalid Date'
  }

  this.on = {
    click: (fn) => {
      BINDINGS.click = fn
    },
    start: (fn) => {
      BINDINGS.start = fn
    },
    search: (fn) => {
      BINDINGS.search = fn
    },
    change: (fn) => {
      BINDINGS.change = fn
    }
  }

  // Dom

  this.dom = {
    body: document.body,
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
    select: (id) => {
      return document.getElementById(id)
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
      el.setAttribute(attr, value.trim())
    },
    'get-attr': (el, attr) => {
      return el.getAttribute(attr)
    },
    'set-value': (el, value) => {
      el.value = value
    },
    'set-hash': (hash) => {
      document.location.hash = `${hash}`.toUrl()
    },
    'set-title': (title) => {
      document.title = title
    },
    scroll: (y) => {
      window.scrollTo(0, y)
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
    }
  }

  this.database = {
    index: null,
    tables: {},
    'create-table': (name, parser, type) => {
      this.database.tables[name] = parser(DATABASE[name], type)
    },
    'create-index': () => {
      const time = performance.now()
      this.database.index = {}
      for (const table of Object.values(this.database.tables)) {
        for (const entry of Object.values(table)) {
          for (const key of entry.indexes) {
            this.database.index[key.toUpperCase()] = entry
          }
        }
      }
      console.info(`Indexed ${Object.keys(this.database.index).length} searchables, in ${(performance.now() - time).toFixed(2)}ms.`)
    },
    'create-map': () => {
      const time = performance.now()
      const tables = this.database.tables
      // Connect Parents
      for (const term of Object.values(tables.lexicon)) {
        const parent = tables.lexicon[term.data.UNDE.toUpperCase()]
        if (!parent) { console.warn(`Unknown parent ${parent.name} for ${term.name}`); continue }
        term.parent = parent
        term.parent.children.push(term)
      }
      // Connect Logs
      for (const log of tables.horaire) {
        const index = log.term.toUpperCase()
        log.host = tables.lexicon[index]
        if (!log.host) { console.warn(`Missing log host, on ${log.time}`, index); continue }
        log.host.logs.push(log)
      }
      console.info(`Mapped ${tables.horaire.length} logs to ${Object.keys(tables.lexicon).length} terms, in ${(performance.now() - time).toFixed(2)}ms.`)
    },
    select: (name) => {
      return this.database.tables[name]
    },
    find: (q, from) => {
      const source = from ? this.database.tables[from] : this.database.index
      return source && source[q.toUpperCase()] ? source[q.toUpperCase()] : new Entry(q)
    }
  }

  // Templating

  this.link = (target = this.host ? this.host.name.toTitleCase() : '??', name, cl = '') => {
    if (target.indexOf('//') > -1) { return `<a href='${target}' target='_blank' rel='noreferrer' class='external ${cl}'>${name || target}</a>` }
    if (target.substr(0, 1) === '(') { return `<a href='#${this}' data-goto='${this}' class='repl ${cl}'>${name || this}</a>` }
    if (this.database.index && !this.database.find(target).data) { console.warn(`Redlink: ${target} ${host}.`) }
    return `<a href='#${target.toUrl()}' data-goto='${target.toUrl()}' target='_self' class='local ${cl}'>${name || target}</a>`
  }

  this.template = (entries, name) => {
    return entries.map((entry, id, arr) => {
      if (!entry.templates[name]) { console.warn(`Unknown ${name} template for ${entry.name}.`) }
      return `${entry.templates[name](id, arr)}`
    }).join('')
  }

  // Misc

  this.lietal = {
    cache: {},
    create: () => {
      this.lietal.cache.en = {}
      this.lietal.cache.li = {}
      for (const yleta of this.database.select('asulodeta')) {
        this.lietal.cache.en[yleta.english] = yleta
        this.lietal.cache.li[yleta.childspeak] = yleta
      }
    },
    adultspeak: (childspeak, vowels = { a: 'ä', i: 'ï', o: 'ö', y: 'ÿ' }) => {
      if (childspeak.length === 2) {
        return childspeak.substr(1, 1) + childspeak.substr(0, 1)
      }
      if (childspeak.length === 6) {
        return this.lietal.adultspeak(childspeak.substr(0, 2)) + this.lietal.adultspeak(childspeak.substr(2, 4))
      }
      if (childspeak.length === 8) {
        return (this.lietal.adultspeak(childspeak.substr(0, 4)) + this.lietal.adultspeak(childspeak.substr(4, 4))).replace('aa', 'ä').replace('ii', 'ï').replace('oo', 'ö').replace('yy', 'ÿ')
      }
      const c1 = childspeak.substr(0, 1)
      const v1 = childspeak.substr(1, 1)
      const c2 = childspeak.substr(2, 1)
      const v2 = childspeak.substr(3, 1)
      if (c1 === c2 && v1 === v2) { // lili -> lï
        return vowels[v1] + c1
      }
      if (c1 === c2) { // lila -> lia
        return v1 + c1 + v2
      }
      if (v1 === v2) { // kala -> käl
        return vowels[v1] + c1 + 'e' + c2
      }
      return v1 + c1 + 'e' + c2 + v2
    },
    enli: (...q) => {
      if (!this.lietal.cache.en) { this.lietal.create() }
      let text = ''
      for (const word of q) {
        text += this.lietal.cache.en[word] ? this.lietal.adultspeak(this.lietal.cache.en[word].childspeak) + ' ' : word + ' '
      }
      return text.trim().replace(/ , /g, ', ')
    },
    lien: (...q) => {
      if (!this.lietal.cache.en) { this.lietal.create() }
      let text = ''
      for (const word of q) {
        text += this.lietal.cache.li[word] ? this.lietal.cache.li[word].english + ' ' : '?? '
      }
      return text.trim()
    }
  }

  this.services = {
    help: (q) => {
      return 'Available commands:\n\n' + plainTable(Object.keys(this.services))
    },

    close: (q) => {
      document.getElementById('terminal').className = ''
    },

    otd: (q) => {
      const today = new Date().toArvelie()
      const a = []
      const logs = this.database.select('horaire').filter(__onlyEvents).filter(__onlyThisDay)
      if (logs.length < 1) { return 'There were no past events on this date.' }
      return `On This Day, on ${timeAgo(logs[0].time, 14)}, ${logs[0].host.name.toTitleCase()} — ${logs[0].name}.`
    },

    next: (q) => {
      const used = []
      for (const log of this.database.select('horaire')) {
        if (!log.pict) { continue }
        used.push(log.pict)
      }
      let available = 1
      while (available < 999) {
        const target = available.toString(16).toUpperCase()
        if (used.indexOf(target) < 0) { return `The next available diary ID is ${target}.` }
        available += 1
      }
      return 'There are no available diary IDs under 999.'
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

    pomodoro: (q) => {
      if (!('Notification' in window)) {
        return 'This browser does not support desktop notification'
      }
      if (Notification.permission === 'granted') {
        setTimeout(() => {
          const body = `The pomodoro has ended at ${neralie()}.`
          new Notification('Oscean', { body, icon: 'media/icon/notification.jpg' })
        }, 20 * 86.4 * 1000)
        return `The pomodoro has started at ${neralie()}.\nDo not close this window.`
      }
      if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => { this.pomodoro(q) })
        return 'You must allow notifications.'
      }
      return 'You have not allowed notifications.'
    },

    static: () => {
      const terms = Object.values(this.database.select('lexicon')).filter(__onlyNotSpecial)
      return `
<!DOCTYPE html>
  <html lang='en'>
  <head>
    <meta charset='utf-8'>
    <title>Oscean — Static</title>
  </head>
  <body>
  ${terms.reduce((acc, term) => {
    return `${acc}
    <h2 id='${term.name.toUrl()}'>${term.name.toTitleCase()}</h2>
    <h3>${term.bref.template(term)}</h3>
    ${runic(term.data.BODY.filter(__onlyStaticRunes), term).template(term)}
    ${term.links ? '<ul>' + Object.values(term.links).reduce((acc, item) => {
    return `${acc}<li><a href='${item}'>${item}</a></li>`
  }, '') + '</ul>' : ''}`.trim()
  }, '')}
  </body>
</html>`.trim()
    },

    rss: () => {
      const logs = this.database.select('horaire').filter(__onlyPast60).filter(__onlyDiaries)
      function makeRssItems (logs) {
        let html = ''
        for (const log of logs) {
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
      return `<?xml version="1.0" encoding="UTF-8" ?>
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
    }
  }
}
