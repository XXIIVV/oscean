'use strict'

function Library (host) {
  // Modularity: Write simple parts connected by clean interfaces.
  // Composition: Design programs to be connected to other programs.
  // Parsimony: Write a big program only when it is clear by demonstration that nothing else will do.

  // Custom

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

  this.time = {
    now: () => {
      return Date.now()
    },
    new: (g) => {
      return new Date(g)
    },
    iso: (g) => {
      new Date(g).toISOString()
    }
  }

  this.host = host
  this.document = document
  this.location = document.location
  this.Tablatal = tablatal
  this.Indental = indental
  this.Log = Log
  this.Term = Term
  this.List = List
  this.js = window
  this.projects = PROJECTS

  this.neralie = () => {
    return `${new Neralie()}`
  }

  this.arvelie = () => {
    return `${new Arvelie()}`
  }

  atog: (q) => {
    return `${new Arvelie(q).toGregorian()}`
  }

  gtoa: (q) => {
    return !isNaN(new Date(q)) ? `${new Date(q).toArvelie()}` : 'Invalid Date'
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

  this.join = (arr, ch = '') => {
    return arr.join(ch)
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

  this.sort = (arr) => {
    return arr.sort()
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

  // Templating

  this.link = (target = this.host.name.toTitleCase(), name, cl = '') => {
    return target.toLink(name, cl)
  }

  this.template = (items, t) => {
    return items.map((val, id, arr) => { return `${t(val, id, arr)}` }).join('')
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

  this.DATE = (item, id, arr) => {
    return `${arr[id - 1] && item.time.y != arr[id - 1].time.y ? `<li class='head'>20${item.time.y}</li>` : ''}<li style='${item.time.offset > 0 ? 'color:#aaa' : ''}'>${item.term.toLink(item.name)} <span title='${item.time}'>${timeAgo(item.time, 60)}</span></li>`
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

  // Misc

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

  // Monsters, TODO migrate to lisp, omg..
  // Lietal TODO placeholders

  this.lien = (q) => {
    return ''
  }

  this.enli = (q) => {
    return ''
  }

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
    index: {},
    tables: {},
    'create': (name, parser, type) => {
      const time = performance.now()
      this.database.tables[name] = parser(DATABASE[name], type)
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
            this.database.index[key] = entry
          }
        }
      }
      console.info(`Indexed ${Object.keys(this.database.index).length} searchables, in ${(performance.now() - time).toFixed(2)}ms.`)
    },
    'select': (name) => {
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
          tables.lexicon[index].span.from = log.time
          if (!tables.lexicon[index].span.to) {
            tables.lexicon[index].span.to = log.time
          }
          if (log.ch === 8) {
            if (tables.lexicon[index].span.release) { console.warn(`Re-released ${log.term} ${log.time} ${tables.lexicon[index].span.release}`) }
            tables.lexicon[index].span.release = log.time
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
      if (logs.length < 1) { return `There were no past events on this date.` }
      return `<b>On This Day</b>, on ${timeAgo(logs[0].time, 14)}, ${logs[0].host.name.toTitleCase()} — ${logs[0].name}.`
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
      return `There are no available diary IDs under 999.`
    },

    age: (q) => {
      return ((new Date() - new Date('1986-03-22')) / 31557600000)
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

    progress: (q) => {
      const score = { ratings: 0, entries: 0 }
      const lexicon = this.database.select('lexicon')
      for (const id in exicon) {
        score.ratings += lexicon[id].rating()
        score.entries += 1
      }
      return ((score.ratings / score.entries) * 100)
    },

    forecast: (q) => {
      const forecast = new Forecast(this.database.select('horaire'))
      return `${forecast.fh}fh of ${forecast.sector} ${forecast.task}`
    },

    orphans: (q) => {
      let index = {}
      let orphans = []
      const lexicon = this.database.select('lexicon')
      for (const id in lexicon) {
        console.log(id, lexicon)
        const links = lexicon[id].outgoing()
        for (const link of links) {
          index[link] = index[link] ? index[link] + 1 : 1
        }
      }
      for (const key of Object.keys(lexicon)) {
        if (!index[key]) { orphans.push(key.toLowerCase()) }
      }
      return plainTable(orphans, 2, 3)
    },

    tracker: (projects) => {
      let html = ''
      let bounds = { from: null, to: null }
      for (const project of projects.sort(__byRecentLog).reverse()) {
        bounds.from = !bounds.from || project.span.from.offset < bounds.from.offset ? project.span.from : bounds.from
        bounds.to = !bounds.to || project.span.to.offset > bounds.to.offset ? project.span.to : bounds.to
      }
      let lastYear = null
      for (const project of projects) {
        if (lastYear && project.span.to.y !== lastYear) {
          html += `<li class='head'>20${project.span.to.y}</li>`
        }
        const a = (1 - (project.span.from.offset / bounds.from.offset)) * 100
        const b = (1 - (project.span.to.offset / bounds.from.offset)) * 100
        const c = project.span.release ? (1 - (project.span.release.offset / bounds.from.offset)) * 100 : 0
        html += `
        <li class='${!project.span.release ? 'unreleased' : ''}'><a>${project.name.toTitleCase()}</a> <span>${project.status()}</span>
          <div class='progress'>
            <div class='bar' style='width:${(b - a).toFixed(2)}%;left:${a.toFixed(2)}%'></div>
            <div class='maintenance' style='width:${b - c}%; left:${c}%; ${!project.span.release ? 'display:none' : ''}'></div>
            <div class='release' style='left:${c}%; ${!project.span.release ? 'display:none' : ''}'></div>
            <div class='to' style='left:${b}%'></div>
          </div>
        </li>`
        lastYear = project.span.to.y
      }
      return `<ul class='tracker'>${html}</ul>`
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

    'activity-viz': (logs) => {
      return `${new ActivityViz(logs)}`
    },
    'bar-viz': (logs) => {
      return `${new BarViz(logs)}`
    },
    'balance-viz': (logs) => {
      return `${new BalanceViz(logs)}`
    },

    rss: () => {
      const logs = this.database.select('horaire').filter(__onlyPast60).filter(__onlyPhotos)
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
    }
  }
}
