'use strict'

/* global performance */

const lainLibrary = {
  // Modularity: Write simple parts connected by clean interfaces.
  // Composition: Design programs to be connected to other programs.
  // Parsimony: Write a big program only when it is clear by demonstration that nothing else will do.

  // str

  substr: (str, from, len) => {
    return `${str}`.substr(from, len)
  },

  split: (str, char) => {
    return `${str}`.split(char)
  },

  replace: (str, from, to) => {
    return `${str}`.replaceAll(from, to)
  },

  lc: (str) => {
    return `${str}`.toLowerCase()
  },

  tc: (str) => {
    return `${str}`.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
  },

  uc: (str) => {
    return `${str}`.toUpperCase()
  },

  cc: (str) => {
    return `${str}`.substr(0, 1).toUpperCase() + `${str}`.substr(1)
  },

  __link: (str, a,b) => {
    if(str.isUrl()){
      if(!a){ return `?"? LINK(?"?${str}?"?) ?"?` }
      return `?"? LINKNAME(?"?${str}?"?, ?"?${a}?"?) ?"?`
    }
    if(!a){ 
      return `?"? SEND(${str.toSnake()}_path) ?"?` 
    }
    return `?"? SENDNAME(${str.toSnake()}_path, ?"?${a}?"?) ?"?` 
  },

  // arr

  map: (arr, fn) => {
    return arr.map((val, id, arr) => fn)
  },

  filter: (arr, name) => {
    return arr.filter(window[name])
  },

  sort: (arr, name) => {
    return arr.sort(window[name])
  },

  reduce: (arr, fn, acc = '') => {
    return arr.reduce((acc, val, id, arr) => fn, acc)
  },

  concat: (...arr) => {
    return arr.reduce((acc, item) => { return `${acc}${item}` }, '')
  },

  join: (arr, ch = '') => {
    return arr ? arr.join(ch) : arr
  },

  splice: (arr, index, length) => {
    return arr.splice(index, length)
  },

  slice: (arr, index, length) => {
    return arr.slice(index, length)
  },

  reverse: (arr) => {
    return arr.reverse()
  },

  for: (arr, fn) => {
    return arr.reduce((acc, item) => { acc.push(fn(item)); return acc }, [])
  },

  rest: ([_, ...arr]) => {
    return arr
  },

  len: (arr) => {
    return arr.length
  },

  index: (arr, item) => {
    return arr.indexOf(item)
  },

  pry: (arr, name) => {
    return arr.map((val) => { return val[name] })
  },

  'pry-method': (arr, name, param) => {
    return arr.map((val) => { return val[name](param) })
  },

  uniq: (arr) => {
    return arr.filter((value, index, self) => { return self.indexOf(value) === index })
  },

  like: (arr, target) => {
    return arr.filter((val) => { return val.indexOf(target) > -1 })
  },

  until: (arr, fn) => {
    for (const item of arr) {
      if (fn(item)) { return item }
    }
  },

  random: (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
  },

  similars: (target, arr) => {
    return findSimilar(target, arr)
  },

  // obj

  set: (obj, key, val) => {
    obj[key] = val
  },

  get: (obj, key) => {
    return obj[key]
  },

  keys: (obj) => {
    return obj ? Object.keys(obj) : []
  },

  values: (obj) => {
    return obj ? Object.values(obj) : []
  },

  entries: (obj) => {
    return obj ? Object.entries(obj) : []
  },

  tunnel: (obj, ...keys) => {
    return keys.reduce((acc, key) => { return key && acc ? acc[key] : null }, obj)
  },

  // logic

  gt: (a, b) => {
    return a > b
  },

  lt: (a, b) => {
    return a < b
  },

  eq: (a, b) => {
    return a === b
  },

  neq: (a, b) => {
    return a !== b
  },

  and: (...args) => {
    for (const arg of args) {
      if (!arg) { return arg }
    }
    return args[args.length - 1]
  },

  or: (...args) => {
    for (const arg of args) {
      if (arg) { return arg }
    }
    return args[args.length - 1]
  },

  either: (...args) => {
    for (const arg of args) {
      if (arg) { return arg }
    }
    return null
  },

  // Math

  add: (...args) => { // Adds values.
    return args.reduce((sum, val) => sum + val)
  },

  sub: (...args) => { // Subtracts values.
    return args.reduce((sum, val) => sum - val)
  },

  mul: (...args) => { // Multiplies values.
    return args.reduce((sum, val) => sum * val)
  },

  div: (...args) => { // Divides values.
    return args.reduce((sum, val) => sum / val)
  },

  mod: (a, b) => { // Returns the modulo of a and b.
    return a % b
  },

  clamp: (val, min, max) => { // Clamps a value between min and max.
    return Math.min(max, Math.max(min, val))
  },

  floor: (item) => {
    return Math.floor(item)
  },

  ceil: (item) => {
    return Math.ceil(item)
  },

  step: (val, step) => {
    return Math.round(val / step) * step
  },

  match: (source, items) => {
    const filtered = items.filter((val) => { return source[val.toUpperCase()] })
    return filtered.map((val) => { return source[val.toUpperCase()] })
  },

  fix: (...items) => {
    return items[0].toFixed(items[1])
  },

  // Javascript

  require: (name, params) => {
    return window[name]
  },

  new: (name, p1, p2, p3, p4) => {
    return new window[name](p1, p2, p3, p4)
  },

  run: (fn, ...params) => {
    return fn(params)
  },

  debug: (...args) => {
    for (const arg of args) {
      console.log(arg)
    }
  },

  wait: (s, fn) => {
    setTimeout(fn, s * 1000)
  },

  perf: (id, fn) => {
    const time = performance.now()
    fn()
    console.info(`Completed ${id}, in ${(performance.now() - time).toFixed(2)}ms.`)
  },

  test: (name, a, b) => {
    return `${name} ${`${a}` === `${b}` ? 'OK' : `FAILED [${a}] [${b}]`} \n`
  },

  // Time

  time: {
    date: (g) => {
      return new Date(g)
    },
    now: () => {
      return Date.now()
    },
    iso: (g) => {
      return (g ? new Date(g) : new Date()).toISOString()
    },
    year: (g) => {
      return new Date().getFullYear()
    },
    ago: (offset) => {
      return timeAgo(offset)
    },
    doty: (date = new Date()) => {
      const start = new Date(date.getFullYear(), 0, 0)
      const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000)
      return Math.floor(diff / 86400000) - 1
    }
  },

  is: {
    null: (q) => {
      return q === undefined || q === null
    },
    real: (q) => {
      return !lainLibrary.is.null(q)
    },
    false: (q) => {
      return q === false
    },
    true: (q) => {
      return !lainLibrary.is.false(q)
    }
  },

  // Special

  atog: (q) => {
    return `${new Arvelie(q).toGregorian()}`
  },

  gtoa: (q) => {
    return !isNaN(new Date(q)) ? `${new Date(q).toArvelie()}` : 'Invalid Date'
  },

  on: {
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
    },
    scroll: (fn) => {
      BINDINGS.scroll = fn
    }
  },

  // Dom

  dom: {
    body: () => {
      return document.body
    },
    create: (id, type = 'div', cl = '') => {
      const el = document.createElement(type)
      el.setAttribute('id', id)
      el.setAttribute('class', cl)
      return el
    },
    'create-ns': (id, type = 'svg', cl = '') => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', type)
      el.setAttribute('id', id)
      el.setAttribute('class', cl)
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
      if (el.textContent === html) { return }
      el.textContent = text
    },
    'set-html': (el, html) => {
      if (el.innerHTML === html) { return }
      el.innerHTML = html
    },
    'set-attr': (el, attr, value) => {
      if (el.getAttribute(attr) === value) { return }
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
      const canvas = document.createElement('canvas')
      img.src = path
      img.onload = function () {
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
  },

  database: {
    index: null,
    tables: {},
    'create-table': (name, parser, type) => {
      lainLibrary.database.tables[name] = parser(DATABASE[name], type)
    },
    'create-index': () => {
      const time = performance.now()
      lainLibrary.database.index = {}
      for (const table of Object.values(lainLibrary.database.tables)) {
        for (const entry of Object.values(table)) {
          for (const key of entry.indexes) {
            lainLibrary.database.index[key.toUpperCase()] = entry
          }
        }
      }
      console.info(`Indexed ${Object.keys(lainLibrary.database.index).length} searchables, in ${(performance.now() - time).toFixed(2)}ms.`)
    },
    'create-map': () => {
      const time = performance.now()
      const tables = lainLibrary.database.tables
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
      return lainLibrary.database.tables[name]
    },
    find: (q, from) => {
      const source = from ? lainLibrary.database.tables[from] : lainLibrary.database.index
      return source && source[q.toUpperCase()] ? source[q.toUpperCase()] : new Entry(q)
    }
  },

  // Templating

  link: (target = lainLibrary.host ? lainLibrary.host.name.toTitleCase() : '??', name, cl = '') => {
    if (target.indexOf('//') > -1) { return `<a href='${target}' target='_blank' rel='noreferrer' class='external ${cl}'>${name || target}</a>` }
    if (target.substr(0, 1) === '(') { return `<a href='#${this}' data-goto='${this}' class='repl ${cl}'>${name || this}</a>` }
    if (lainLibrary.database.index && !lainLibrary.database.find(target).data) { console.warn(`Redlink: ${target} ${host}.`) }
    return `<a href='#${target.toUrl()}' data-goto='${target.toUrl()}' target='_self' class='local ${cl}'>${name || target}</a>`
  },

  template: (entries, name) => {
    if (!entries) { console.warn('No entries', name); return '?' }
    return entries.map((entry, id, arr) => {
      if (!entry.templates[name]) { console.warn(`Unknown ${name} template for ${entry.name}.`) }
      return `${entry.templates[name](id, arr)}`
    }).join('')
  },

  // Misc

  lietal: {
    cache: {},
    create: () => {
      lainLibrary.lietal.cache.en = {}
      lainLibrary.lietal.cache.li = {}
      for (const yleta of lainLibrary.database.select('asulodeta')) {
        lainLibrary.lietal.cache.en[yleta.english] = yleta
        lainLibrary.lietal.cache.li[yleta.childspeak] = yleta
      }
    },
    adultspeak: (childspeak, vowels = { a: 'ä', i: 'ï', o: 'ö', y: 'ÿ' }) => {
      if (childspeak.length === 2) {
        return childspeak.substr(1, 1) + childspeak.substr(0, 1)
      }
      if (childspeak.length === 6) {
        return lainLibrary.lietal.adultspeak(childspeak.substr(0, 2)) + lainLibrary.lietal.adultspeak(childspeak.substr(2, 4))
      }
      if (childspeak.length === 8) {
        return (lainLibrary.lietal.adultspeak(childspeak.substr(0, 4)) + lainLibrary.lietal.adultspeak(childspeak.substr(4, 4))).replace('aa', 'ä').replace('ii', 'ï').replace('oo', 'ö').replace('yy', 'ÿ')
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
      if (!lainLibrary.lietal.cache.en) { lainLibrary.lietal.create() }
      let text = ''
      for (const word of q) {
        text += lainLibrary.lietal.cache.en[word] ? lainLibrary.lietal.adultspeak(lainLibrary.lietal.cache.en[word].childspeak) + ' ' : word + ' '
      }
      return text.trim().replace(/ , /g, ', ')
    },
    lien: (...q) => {
      if (!lainLibrary.lietal.cache.en) { lainLibrary.lietal.create() }
      let text = ''
      for (const word of q) {
        text += lainLibrary.lietal.cache.li[word] ? lainLibrary.lietal.cache.li[word].english + ' ' : '?? '
      }
      return text.trim()
    }
  },

  services: {
    help: (q) => {
      return 'Available commands:\n\n' + plainTable(Object.keys(lainLibrary.services))
    },

    close: (q) => {
      document.getElementById('terminal').className = ''
    },

    otd: (q) => {
      const today = new Date().toArvelie()
      const a = []
      const logs = lainLibrary.database.select('horaire').filter(__onlyEvents).filter(__onlyThisDay)
      if (logs.length < 1) { return 'There were no past events on this date.' }
      return `On This Day, on ${timeAgo(logs[0].time.offset, 14)}, ${logs[0].host.name.toTitleCase()} — ${logs[0].name}.`
    },

    next: (q) => {
      const used = []
      for (const log of lainLibrary.database.select('horaire')) {
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
      for (const id in lainLibrary.database.index) {
        const entryTime = performance.now()
        lainLibrary.database.index[id].toString()
        const entryTimeComplete = performance.now() - entryTime
        if (entryTimeComplete > 300) {
          console.log(`${id} slow: ${entryTimeComplete}ms.`)
        }
      }
      return `Walked ${Object.keys(lainLibrary.database.index).length} indexes, in ${(performance.now() - totalTime).toFixed(2)}ms.`
    },

    danglings: (q) => {
      const logs = lainLibrary.database.select('horaire').filter(__onlyDanglings)
      return logs.reduce((acc, log) => { return `${acc}${log.time} ${log.term}\n` }, '')
    },

    convert_lexicon: (q) => {
      let html = ''
      for (const id in lainLibrary.database.select('lexicon')) {
        const term = lainLibrary.database.select('lexicon')[id]
        // html += `#define ${id.toSnake()}_path ${id.toSnake()}`;
        html += `Term ${id.toSnake()} = create_term("${id.toLowerCase()}", "${term.bref.template(term).stripHTML()}");\n`
        html += `set_parent(&${term.name.toSnake()}, &${term.data.UNDE.toSnake()});\n`
        if(term.glyph()){
          html += `set_icon(&${term.name.toSnake()}, "${term.glyph()}");\n`
        }

        for(let line of term.data.BODY){
          const rune = line.substr(0,1)
          line = line.replaceAll('{(link ','{(__link ')
          if(rune === '&'){
            const text = line.substr(2).template(term).replace(/\"/g,'\\"')
            html += `add_text(&${term.name.toSnake()}, "${text}");\n`
          }
          else if(rune === '@'){
            const text = line.substr(2).template(term).split('|')[0].trim().replace(/\"/g,'\\"')
            const source = line.replace(text,'').replace('@ ').trim()
            html += `add_quote(&${term.name.toSnake()}, "${text}", "${source}");\n`
          }
          else if(rune === '*'){
            const text = line.substr(2).template(term).trim().replace(/\"/g,'\\"')
            html += `add_header(&${term.name.toSnake()}, "${text}");\n`
          }
          else if(rune === '+'){
            const text = line.substr(2).template(term).trim().replace(/\"/g,'\\"')
            html += `add_subheader(&${term.name.toSnake()}, "${text}");\n`
          }
          else if(rune === '?'){
            const text = line.substr(2).template(term).trim().replace(/\"/g,'\\"')
            html += `add_note(&${term.name.toSnake()}, "${text}");\n`
          }
          else if(rune === '%'){
            const source = line.substr(2).trim().split(' ')[0]
            const id = line.substr(2).trim().split(' ')[1]
            html += `add_${source}(&${term.name.toSnake()}, "${id}");\n`
          }
          else if(rune === '>'){
            const text = line.substr(2).template(term).trim().replace(/\"/g,'\\"')
            html += `add_html(&${term.name.toSnake()}, "${text}");\n`
          }
          else if(rune === '#'){
            const text = line.substr(2).template(term).trim().replace(/\"/g,'\\"')
            html += `add_code(&${term.name.toSnake()}, "${text}");\n`
          }
          else if(rune === '|'){
            const text = line.substr(2).template(term).trim().replace(/\"/g,'\\"')
            html += `add_table(&${term.name.toSnake()}, "${text}");\n`
          }
          else if(rune === '-'){
            const text = line.substr(2).template(term).trim().replace(/\"/g,'\\"')
            html += `add_list(&${term.name.toSnake()}, "${text}");\n`
          }
          else{
            console.warn('unknown rune', rune)
          }
        }

        for(const id in term.links){
          html += `add_link(&${term.name.toSnake()}, "${id.toLowerCase()}", "${term.links[id]}");\n`
        }
        html += `\n`
      }


      html += `Term lexicon = {`;
      for (const id in lainLibrary.database.select('lexicon')) {
        const term = lainLibrary.database.select('lexicon')[id]
        html += `&${term.name.toSnake()}, `
      }
      html += `};`;


      for (const id in lainLibrary.database.select('lexicon')) {
        const term = lainLibrary.database.select('lexicon')[id]
        html += `#define ${term.name.toSnake()}_path "${term.name.toSnake()}"\n`
      }

      return html.replace(/\?\\"\?/g,'"')
    },

    convert_horaire: (q) => {
      let html = ''
      for (const log of lainLibrary.database.select('horaire')) {
        if(log.pict > 0){
          if(log.isEvent){
            html += `add_diary_event(&${log.data.term.toSnake()}, "${log.time}", ${parseInt(log.data.code.substr(1))}, "${log.name}", ${log.pict});\n`
          }
          else{
            html += `add_diary(&${log.data.term.toSnake()}, "${log.time}", ${parseInt(log.data.code.substr(1))}, "${log.name}", ${log.pict});\n`  
          }
        }
        else{
          if(log.isEvent){
            html += `add_event(&${log.data.term.toSnake()}, "${log.time}", ${parseInt(log.data.code.substr(1))}, "${log.name}");\n`
          }
          else{
            html += `add_log(&${log.data.term.toSnake()}, "${log.time}", ${parseInt(log.data.code.substr(1))});\n`  
          }
        }
      }

      return html.replace(/\?\\"\?/g,'"')
    },

    convert_glossary: (q) => {
      let html = ''
      const lists = lainLibrary.database.select('glossary')
      for (const id in lists) {
        html += `Dict ${id.toSnake()} = create_dict("${id.toSnake()}");\n`
        for(const word in lists[id].data){
          html += `add_word(&${id.toSnake()}, "${word.toSnake()}", "${lists[id].data[word].trim().replace(/\"/g,'\\"')}");\n`
        }
        html += `\n`
      }

      return html.replace(/\?\\"\?/g,'"')
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
        Notification.requestPermission().then((permission) => { lainLibrary.pomodoro(q) })
        return 'You must allow notifications.'
      }
      return 'You have not allowed notifications.'
    },

    static: () => {
      const terms = Object.values(lainLibrary.database.select('lexicon')).filter(__onlyNotSpecial)
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
    ${runic.run(term.data.BODY.filter(__onlyStaticRunes), term).template(term)}
    ${term.links ? '<ul>' + Object.values(term.links).reduce((acc, item) => {
    return `${acc}<li><a href='${item}'>${item}</a></li>`
  }, '') + '</ul>' : ''}`.trim()
  }, '')}
  </body>
</html>`.trim()
    },

    txt: () => {
      const terms = Object.values(lainLibrary.database.select('lexicon')).filter(__onlyNotSpecial)
      return terms.reduce((acc, term) => {
        const body = term.data.BODY.filter(__onlyStaticRunes).map((line) => { return line.substr(2) }).join('\n').template(term).stripHTML().trim()
        return `${acc}
${term.name.toTitleCase()}
${term.bref.template(term).stripHTML()}\n
${wrapTo(body, 80)}\n
${Object.keys(term.links).reduce((acc, key) => { return `${acc}* ${key.toTitleCase()}: ${term.links[key]}\n` }, '').trim()}
-- 
`
      }, '').trim()
    },

    rss: () => {
      const logs = lainLibrary.database.select('horaire').filter(__onlyPast60).filter(__onlyDiaries)
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
