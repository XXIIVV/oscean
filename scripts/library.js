'use strict'

// Database

const DATABASE = {}

RIVEN.lib.Database = function DatabaseNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M60,150 L60,150 L240,150 M60,105 L60,105 L240,105 M60,195 L60,195 L240,195 '

  this.cache = null
  this.index = {}

  function indexTables (tables) {
    const h = {}
    const time = performance.now()
    for (const tId in tables) {
      const table = tables[tId]
      for (const eId in table) {
        const entry = table[eId]
        for (const i in entry.indexes) {
          h[entry.indexes[i].toUpperCase()] = entry
        }
      }
    }
    console.info('database', `Indexed ${Object.keys(h).length} searchables in ${(performance.now() - time).toFixed(2)}ms.`)
    return h
  }

  this.answer = function (q) {
    if (!this.cache) {
      this.cache = this.request(this.cache)
      this.index = indexTables(this.cache)
      // Send ref to Ø(MAP), for filtering.
      this.send(this.cache)
    }
    return this.cache
  }

  this.find = function (q) {
    const key = q.toUpperCase().trim()
    return this.index[key]
  }
}

RIVEN.lib.Table = function TableNode (id, rect, parser, Type) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M120,120 L120,120 L180,120 M120,180 L120,180 L180,180 M120,150 L120,150 L180,150'

  this.cache = null

  this.answer = function (q) {
    if (!DATABASE[this.id]) { console.warn(`Missing /database/${this.id}`); return null }
    const time = performance.now()
    this.cache = this.cache ? this.cache : parser(DATABASE[this.id], Type)
    console.info(`table-${id}`, `Parsed ${this.length()} items, in ${(performance.now() - time).toFixed(2)}ms.`)
    return this.cache
  }

  // Query

  this.indexes = {}

  this.find = function (q, key) {
    if (this.cache.constructor === Array) {
      if (!this.indexes[key]) {
        this.indexes[key] = this.assoc(key)
      }
      return this.indexes[key][q.toUpperCase()]
    } else {
      return this.cache[q.toUpperCase()]
    }
  }

  this.assoc = function (key) {
    const time = performance.now()
    const h = {}
    for (const id in this.cache) {
      const entry = this.cache[id]
      if (!entry || !entry[key]) { continue }
      const index = entry[key].toUpperCase()
      if (h[index]) { console.warn(`Duplicated special index for ${index}`) }
      h[index] = entry
    }
    console.info(`table-${id}`, `Built special index for '${key}' in ${(performance.now() - time).toFixed(2)}ms.`)
    return h
  }

  this.length = function () {
    return this.cache.constructor === Array ? this.cache.length : Object.keys(this.cache).length
  }
}

RIVEN.lib.Map = function MapNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M150,60 L150,60 L150,240 M60,150 L60,150 L240,150 '

  this.isMapped = false

  this.receive = function (tables) {
    try {
      return this.map(tables)
    } catch (err) {
      console.log(this, err)
    }
  }

  this.map = function (tables) {
    const time = performance.now()
    const count = { links: 0, diaries: 0, events: 0, issues: 0 }

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

    // Connect/Unwrap issues
    for (const term in tables.issues) {
      const issue = tables.issues[term]
      const index = term.toUpperCase()
      if (!tables.lexicon[index]) { console.warn('Missing issue parent', index); continue }
      const issues = issue.unwrap()
      tables.lexicon[index].issues = issues
      count.issues += issues.length
      for (const id in issues) {
        issues[id].host = tables.lexicon[index]
      }
    }
    this.isMapped = true
    console.info(this.id, `Mapped ${tables.horaire.length} logs, ${count.issues} issues, ${count.events} events, and ${count.diaries} diaries to ${Object.keys(tables.lexicon).length} terms, in ${(performance.now() - time).toFixed(2)}ms.`)
  }
}

// Template

RIVEN.lib.Template = function TemplateNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.receive = function (q) {
    const time = performance.now()
    const photo = q.result ? q.result.photo() : null
    const content = this.request(q)

    const template = {
      title: `XXIIVV — ${q.target.toTitleCase()}`,
      view: this._view(q),
      theme: this._theme(q),
      document: {
        header: {
          photo: photo ? photo.pict : 0,
          menu: {
            search: q.target && q.target.toTitleCase(),
            activity: this._activity(q),
            info: {
              title: photo ? `${'journal'.toLink(photo.name)} — ${timeAgo(photo.time, 60)}` : ' ',
              glyph: photo ? photo.host.glyph() : q.result && q.result.glyph() ? q.result.glyph() : 'M240,240 l0,-90 a-90,-90 0 0,0 -90,-90 l-90,0 l0,90 a90,90 0 0,0 90,90 l60,0 l0,-90 a-60,-60 0 0,0 -60,-60 l-60,0 l0,60 a60,60 0 0,0 60,60 l30,0 l0,-60 a-30,-30 0 0,0 -30,-30 l-30,0 l0,30 a30,30 0 0,0 30,30'
            }
          }
        },
        core: {
          sidebar: this._sidebar(q),
          content: {
            main: content[':default'],
            calendar: content[':calendar'],
            journal: content[':journal'],
            tracker: content[':tracker']
          },
          navi: this._navi(q)
        }
      }
    }

    console.info(`${this.id}-${q.target}`, `Template completed in ${(performance.now() - time).toFixed(2)}ms.`)

    this.send(template)
  }

  this._view = function (q) {
    return q.params ? q.params : q.result ? q.result.view : 'main'
  }

  this._theme = function (q) {
    return q.params ? 'noir' : q.result ? q.result.theme : 'blanc'
  }

  this._activity = function (q) {
    if (!q.result) { return '' }

    if (q.result.name === 'HOME' || q.result.name === 'JOURNAL' || q.result.name === 'CALENDAR' || q.result.name === 'TRACKER') {
      return `
      <li>${'calendar'.toLink('Calendar', 'calendar sprite_calendar')}</li> 
      <li>${'journal'.toLink('Journal', 'journal sprite_journal')}</li>
      <li>${'tracker'.toLink('Tracker', 'tracker sprite_tracker')}</li>`
    }

    const activity = q.result.activity()
    const events = activity.filter(__onlyEvents)

    return `
    ${events.length > 0 ? `<li><a class='calendar sprite_calendar' data-goto='${q.result.name.toUrl()}:calendar' href='#${q.result.name.toUrl()}:calendar'>${events.length} Event${events.length > 1 ? 's' : ''}</a></li>` : ''}
    ${activity.length > 2 && !q.result.hasTag('journal') ? `<li><a class='journal sprite_journal' data-goto='${q.result.name.toUrl()}:journal' href='#${q.result.name.toUrl()}:journal'>${activity.length} Logs</a></li>` : ''}
    ${q.result.issues.length > 0 && !q.result.hasTag('diary') ? `<li><a class='tracker sprite_tracker' data-goto='${q.result.name.toUrl()}:tracker' href='#${q.result.name.toUrl()}:tracker'>${q.result.issues.length} Issue${q.result.issues.length > 1 ? 's' : ''}</a></li>` : ''}`
  }

  // Sidebar

  function _links (term) {
    return term.links ? `
    <ul class='links'>
      ${Object.keys(term.links).reduce((acc, val) => { return `${acc}<li>${term.links[val].toLink(val)}</li>` }, '')}
    </ul>` : ''
  }

  function _directory (term) {
    if (!term.children) { return '' }
    const stem = term.children.length > 0 ? term : term.parent
    let html = `<li class='parent'>${(stem.name === term.name ? stem.parent.name : stem.name).toLink(stem.name.toTitleCase())}</li>`
    for (const id in stem.children) {
      const leaf = stem.children[id]
      if (leaf.name === stem.name) { continue }
      if (leaf.hasTag('hidden')) { continue }
      html += `<li class='children ${leaf.name === term.name ? 'active' : ''}'>${leaf.name.toTitleCase().toLink()}</li>`
    }
    return `<ul class='directory'>${html}</ul>`
  }

  this._sidebar = function (q) {
    if (!q.result) { return `<h2>${'Home'.toLink('Return')}</h2>` }
    return `
    ${q.result.logs.length > 2 ? `<h2>${q.result.logs[q.result.logs.length - 1].time} — ${q.result.logs[0].time}</h2>` : `<h2>${q.tables.horaire[q.tables.horaire.length - 1].time} — ${q.tables.horaire[0].time}</h2>`}
    ${_links(q.result)}
    ${_directory(q.result)}`
  }

  // Navi

  this._navi = function (q) {
    if (!q.result) { return '' }

    const term = q.result
    const portal = q.result.portal()

    if (!portal) { return '' }

    return `
      <svg id="glyph"><path transform="scale(0.15)" d="${portal.glyph()}"></path></svg>
      <ul>${portal.children.reduce((acc, child, id) => {
    return `${acc}${`<ul><li>${child.name.toTitleCase().toLink()}</li><ul>${child.children.reduce((acc, child, id) => {
      return `${acc}${`<ul><li class='${child.name === term.name || child.name.toLowerCase() === term.unde.toLowerCase() ? 'selected' : ''}'>${child.name.toTitleCase().toLink()}</li>${child.name === term.name || child.name.toLowerCase() === term.unde.toLowerCase() ? `<ul>${child.children.reduce((acc, child, id) => {
        return `${acc}${`<ul><li class='${child.name === term.name ? 'selected' : ''}'>${child.name.toTitleCase().toLink()}</li></ul>`}`
      }, '')}</ul>` : ''}</ul>`}`
    }, '')}</ul></ul>`}`
  }, '')}</ul>`
  }
}

RIVEN.lib.DefaultTemplate = function TemplateNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q) {
    if (q.params) { return '' }
    if (q.result) { return `${_redirected(q)}${q.result.head()}${q.result.body()}` }

    const index = Object.keys(Ø('database').index)
    const similar = findSimilar(q.target.toUpperCase(), index)

    return `
    <p>Sorry, there are no pages for <b>${q.target.toTitleCase()}</b>, did you mean ${similar[0].word.toTitleCase().toLink()} or ${similar[1].word.toTitleCase().toLink()}?</p>
    <p><b>Create this page</b> by submitting a ${'https://github.com/XXIIVV/oscean'.toLink('Pull Request', true)}, or if you believe this to be an error, please contact ${'https://twitter.com/neauoire'.toLink('@neauoire', true)}. Alternatively, you locate missing pages from within the ${'Tracker'.toLink('progress tracker')}.</p>`
  }

  function _redirected (q) {
    if (q.target.toUrl() !== q.result.name.toUrl()) {
      return `<div class='notice'>Redirected to ${q.result.name.toTitleCase().toLink()}, from <b>${q.target.toTitleCase()}</b>.</div>`
    }
    return ``
  }
}

RIVEN.lib.TrackerTemplate = function TemplateNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q) {
    if (`:${q.params}` !== id && `:${q.target}` !== id) { return '' }
    const issues = q.result && q.result.name === 'TRACKER' ? Object.values(q.tables.lexicon).reduce((acc, term) => { acc = acc.concat(term.issues); return acc }, []) : q.result ? q.result.issues : []

    if (issues.length < 1) {
      return `<p>There are no issues to the ${q.target.toTitleCase().toLink()} project.</p>`
    }

    const viz = new BalanceViz(q.tables.horaire)
    const html = issues.reduce((acc, key) => { return `${acc}${key}` }, '')

    return `${viz}${html}`
  }
}

RIVEN.lib.JournalTemplate = function TemplateNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q) {
    if (`:${q.params}` !== id && `:${q.target}` !== id) { return '' }
    const logs = q.result && q.result.name === 'JOURNAL' ? q.tables.horaire : q.result ? q.result.activity() : []

    if (logs.length < 1) {
      return `<p>There is no recent activity to the ${q.target.toTitleCase().toLink()} project.</p>`
    }

    const html = logs.slice(0, 14 * 4).filter(__onlyOnce).slice(0, 20).reduce((acc, log) => {
      return `${acc}${log}`
    }, '')

    return `${new ActivityViz(logs)}${html}`
  }
}

RIVEN.lib.CalendarTemplate = function TemplateNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q) {
    if (`:${q.params}` !== id && `:${q.target}` !== id) { return '' }
    const events = q.result && q.result.name === 'CALENDAR' ? q.tables.horaire.filter(__onlyEvents) : q.result ? q.result.activity().filter(__onlyEvents) : []

    if (events.length < 1) {
      return `<p>There is no events to the ${q.target.toLink()} project.</p>`
    }

    const viz = new BarViz(q.target === 'calendar' ? q.tables.horaire : q.result.activity())

    const html = `<ul class='tidy ${events.length > 10 ? 'col3' : ''}' style='padding-top:30px;'>${events.reduce((acc, log, id, arr) => {
      return `
      ${acc}
      ${!arr[id - 1] || arr[id - 1].time.y !== log.time.y ? `<li class='head'>20${log.time.y}</li>` : ''}
      <li style='${log.time.offset > 0 ? 'color:#aaa' : ''}'>
        ${log.term.toLink(log.name)} <span title='${log.time}'>${timeAgo(log.time, 60)}</span>
      </li>`
    }, '')}</ul>`

    return `${viz}${html}`
  }
}

// Services

RIVEN.lib.RssService = function RssNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M65,65 L65,65 L245,65 L245,245 L65,245 Z M65,125 L65,125 L245,125 M95,95 L95,95 L95,95 '

  this.receive = function () {
    const logs = Ø('database').cache.horaire
    const selection = []
    for (const id in logs) {
      const log = logs[id]
      if (selection.length >= 60) { break }
      if (log.time.offset > 0) { continue }
      if (!log.pict) { continue }
      selection.push(log)
    }

    return this.render(selection)
  }

  this.items = function (logs) {
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
      ${log.host.data.BREF.toHeol(log.host).stripHTML()}
    </description>
  </item>
`
    }
    return html
  }

  this.render = function (logs) {
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
  ${this.items(logs)}
</channel>

</rss>`.toEntities()
  }
}

RIVEN.lib.StaticService = function StaticNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M65,65 L65,65 L245,65 L245,245 L65,245 Z M65,125 L65,125 L245,125 M95,95 L95,95 L95,95 '

  function _header () {
    const lastLog = Ø('database').cache.horaire[0]
    return `\n\nUpdated ${lastLog.time} — ${lastLog.time.toGregorian()}\n\n`
  }

  function _item (term) {
    return `${term.name.toTitleCase()}\n  ${term.bref.toHeol(term).stripHTML()}\n${term.links ? Object.keys(term.links).reduce((acc, val) => { return `${acc}  - ${term.links[val]}\n` }, '') : ''}\n`
  }

  function _items () {
    const terms = Ø('database').cache.lexicon
    const items = Object.keys(terms).sort()
    return items.reduce((acc, val) => {
      return `${acc}${_item(terms[val])}`
    }, '').trim()
  }

  this.receive = function () {
    return `${_header()}${_items()}`
  }
}

// Query

RIVEN.lib.Init = function QueryNode (id, rect) {
  RIVEN.Node.call(this, id, rect)
  this.glyph = 'M60,150 L60,150 L240,150 L240,150 L150,240 M150,60 L150,60 L240,150'
}

RIVEN.lib.Router = function RouterNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,120 L60,120 L150,120 L240,60 M60,150 L60,150 L240,150 M60,180 L60,180 L150,180 L240,240'

  this.archives = {}

  this.cache = { target: null, params: null, tables: null, result: null }

  this.receive = function (q) {
    this.cache.target = q.indexOf(':') > -1 ? q.split(':')[0].replace(/\+/g, ' ') : q.replace(/\+/g, ' ')
    this.cache.params = q.indexOf(':') > -1 ? q.split(':')[1] : null
    this.cache.tables = this.request('database').database
    this.cache.result = Ø('database').find(this.cache.target)

    this.send(this.cache)
  }
}

RIVEN.lib.Query = function QueryNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,150 L60,150 L240,150 L240,150 L150,240 M150,60 L150,60 L240,150'
  this.location = null

  this.bang = function (input = window.location.hash) {
    if (input.indexOf('~') > -1) {
      Ø('terminal').bang(input)
      this.goto('home')
    } else if (this.location !== input.toUrl()) {
      this.goto(input || 'home')
    }
  }

  this.goto = function (input = 'home') {
    const time = performance.now()
    this.location = input.toUrl()
    window.location.hash = this.location
    Ø('document').setMode('state', 'loading')
    setTimeout(() => { this.send(this.location) }, 50)
    setTimeout(() => { Ø('document').setMode('state', 'ready') }, 150)
    console.info(`${this.id}-${this.location}`, `Query completed in ${(performance.now() - time).toFixed(2)}ms.`)
  }

  this.answer = function (q) {
    this.bang()
  }

  this.queue = function (a, speed = 1000) {
    if (a.length === 0) { return }
    setTimeout(() => {
      this.send(a[0].toUrl())
      this.queue(a.slice(1))
    }, speed)
  }
}

RIVEN.lib.Mouse = function MouseNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,150 L60,150 L240,150 L240,150 L150,240 M150,60 L150,60 L240,150'

  window.addEventListener('click', (e) => { this.click(e) })

  this.click = function (e) {
    if (e.button || e.which === 3 || e.button === 2) { return }

    const inTab = e.ctrlKey || e.shiftKey || e.metaKey
    const el = e.target.getAttribute('data-goto') ? e.target : e.target.parentNode.getAttribute('data-goto') ? e.target.parentNode : null
    const view = e.target.getAttribute('data-view') ? e.target : e.target.parentNode.getAttribute('data-view') ? e.target.parentNode : null

    if (view && !inTab) {
      Ø('document').setMode('view', view.getAttribute('data-view'))
      e.preventDefault()
      return
    }

    if (!el || el.className === 'external' || inTab) { return }

    Ø('query').bang(el.getAttribute('data-goto'))
    e.preventDefault()
  }
}

const detectBackOrForward = function (onBack, onForward) {
  let hashHistory = [window.location.hash]
  let historyLength = window.history.length

  return function () {
    let hash = window.location.hash; let length = window.history.length
    if (hashHistory.length && historyLength === length) {
      if (hashHistory[hashHistory.length - 2] === hash) {
        hashHistory = hashHistory.slice(0, -1)
        onBack()
      } else {
        hashHistory.push(hash)
        onForward()
      }
    } else {
      hashHistory.push(hash)
      historyLength = length
    }
  }
}

window.addEventListener('hashchange', detectBackOrForward(
  function () { Ø('query').bang() },
  function () { Ø('query').bang() }
))

// Dom

RIVEN.lib.Document = function DocumentNode (id, rect, ...params) {
  RIVEN.lib.Dom.call(this, id, rect)

  this.glyph = 'M150,60 L150,60 L240,150 L150,240 L60,150 Z M150,120 L150,120 L180,150 L150,180 L120,150 Z '

  // Modes
  this.modes = { state: '', view: '', theme: '' }

  this.receive = function (content = { title: 'Unknown' }) {
    document.title = content.title

    window.scrollTo(0, 0)

    this.setMode('view', content.view)
    this.setMode('theme', content.theme)

    if (content && content[this.id] !== null) {
      this.update(content[this.id])
      this.send(content[this.id])
    }
  }

  this.answer = function (q) {
    if (!params[0]) { return }
    if (!this.isInstalled) {
      this.install(this.request())
      window.addEventListener('scroll', this.onScroll)
    }
    document.body.appendChild(this.el)
  }

  this.setMode = function (mode, value) {
    if (this.modes[mode] === value) { return }

    if (mode === 'view') {
      if (this.view === value) {
        value = 'main'
        this.modes.theme = 'blanc'
      }
      if (value !== 'main') {
        this.modes.theme = 'noir'
      }
    }

    this.modes[mode] = value
    this.setClass(`state_${this.modes.state} view_${this.modes.view} theme_${this.modes.theme}`)
  }

  this.onScroll = function () {
    Ø('menu').setClass(window.scrollY > Ø('header').el.offsetHeight - 90 ? 'sticky' : '')
  }
}

RIVEN.lib.Dom = function DomNode (id, rect, ...params) {
  RIVEN.Node.call(this, id, rect)

  this.type = params[0] ? params[0] : 'div'
  this.glyph = 'M150,60 L150,60 L60,150 L150,240 L240,150 Z'
  this.label = `#${this.id}`
  this.el = document.createElement(this.type)
  this.el.id = this.id
  this.isInstalled = false

  // Set Content
  if (params[1]) {
    this.el.innerHTML = params[1]
  }

  // Set Attributes
  if (params[2]) {
    for (const id in params[2]) {
      this.el.setAttribute(id, params[2][id])
    }
  }

  this.receive = function (content) {
    if (content && content[this.id] !== null) {
      this.update(content[this.id])
      this.send(content[this.id])
    }
  }

  this.answer = function () {
    if (!this.isInstalled) {
      this.install(this.request())
    }
    return this.el
  }

  this.install = function (elements) {
    this.isInstalled = true
    for (const id in elements) {
      this.el.appendChild(elements[id])
    }
  }

  this.update = function (content) {
    if (typeof content === 'string') {
      this.el.innerHTML = content
      this.el.className = !content || content.trim() === '' ? 'empty' : ''
    }
  }

  // Class

  this.setClass = function (c) {
    if (this.el.className === c) { return }

    this.el.className = `${c.toLowerCase()}`
  }

  this.addClass = function (c) {
    if (!c || this.hasClass(c)) { return }

    this.el.className = `${this.el.className} ${c.toLowerCase()}`.trim()
  }

  this.removeClass = function (c) {
    if (!c || !this.hasClass(c)) { return }

    this.el.className = this.el.className.replace(c.toLowerCase(), '').trim()
  }

  this.hasClass = function (c) {
    if (!c) { return }
    return this.el.className.indexOf(c.toLowerCase()) > -1
  }
}

RIVEN.lib.Input = function InputNode (id, rect, ...params) {
  RIVEN.lib.Dom.call(this, id, rect, ...params)

  this.el = document.createElement('input')
  this.el.id = this.id
  this.isInstalled = false
  this.el.setAttribute('spellcheck', false)

  this.el.addEventListener('keydown', (e) => { this.onInput(e) })
  this.el.addEventListener('focus', () => { this.txt = this.el.value; this.el.value = '' })
  this.el.addEventListener('blur', () => { this.el.value = this.txt ? this.txt : window.location.hash.replace('#', '').trim() })

  this.onInput = function (e) {
    const target = this.el.value.toUrl()
    if (Ø('database').find(target)) {
      this.addClass('known')
    } else {
      this.removeClass('known')
    }
    // Shortcuts
    if (e.key === 'Enter') {
      this.validate(target)
    }
    if (e.key === 'Escape') {
      Ø('terminal').removeClass('active')
    }
  }

  this.validate = function (target) {
    if (target.substr(0, 1) === '~') {
      Ø('terminal').bang(target)
    } else {
      Ø('query').bang(target)
    }
  }

  this.update = function (content) {
    if (typeof content === 'string') {
      this.el.value = content.toTitleCase()
    }
  }
}

RIVEN.lib.Path = function PathNode (id, rect, ...params) {
  RIVEN.lib.Dom.call(this, id, rect)

  this.type = params[0] ? params[0] : 'div'
  this.glyph = 'M60,90 L60,90 L60,60 L90,60 M210,60 L210,60 L240,60 L240,90 M240,210 L240,210 L240,240 L210,240 M90,240 L90,240 L60,240 L60,210 '
  this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  this.el.id = this.id
  this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  this.path.setAttribute('transform', 'scale(0.165,0.165) translate(-50,-50)')
  this.el.appendChild(this.path)
  this.isInstalled = false

  this.receive = function (content) {
    if (content && content[this.id] !== null) {
      this.update(content[this.id])
      this.send(content[this.id])
    }
  }

  this.update = function (content) {
    if (typeof content === 'string') {
      this.path.setAttribute('d', content)
    }
  }
}

RIVEN.lib.Photo = function PhotoNode (id, rect, ...params) {
  RIVEN.lib.Dom.call(this, id, rect)

  this._media = document.createElement('media')
  this._media.id = 'media'
  this.glyph = 'M60,90 L60,90 L60,60 L90,60 M210,60 L210,60 L240,60 L240,90 M240,210 L240,210 L240,240 L210,240 M90,240 L90,240 L60,240 L60,210 '

  this.install = function (elements) {
    this.isInstalled = true
    this.el.appendChild(this._media)

    for (const id in elements) {
      this.el.appendChild(elements[id])
    }
  }

  this.update = function (content) {
    if (parseInt(content, 16) > 0) {
      isDark(`media/diary/${content}.jpg`, this.update_header)
      this._media.style.backgroundImage = `url(media/diary/${content}.jpg)`
      this.el.className = ''
    } else {
      this.el.className = 'empty'
      Ø('header').el.className = 'no_photo'
    }
  }

  this.update_header = function (v = true) {
    Ø('header').el.className = v ? 'dark' : 'light'
  }

  function diff (data, width, height) {
    let fuzzy = -0.4
    let r, g, b, max_rgb
    let light = 0; let dark = 0
    for (let x = 0, len = data.length; x < len; x += 4) {
      r = data[x]
      g = data[x + 1]
      b = data[x + 2]
      max_rgb = Math.max(Math.max(r, g), b)
      if (max_rgb < 128) { dark++ } else { light++ }
    }
    let dl_diff = ((light - dark) / (width * height))
    return dl_diff + fuzzy < 0
  }

  function isDark (imageSrc, callback, w = 200, h = 200) {
    const fuzzy = -0.4
    const img = document.createElement('img')
    img.src = imageSrc
    img.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(this, 0, 0, canvas.width, canvas.height)
      try {
        callback(diff(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height))
      } catch (err) { console.warn('Could not get photo data'); callback() }
    }
  }
}

RIVEN.lib.Terminal = function TerminalNode (id, rect, ...params) {
  RIVEN.lib.Dom.call(this, id, rect, 'div')

  this.glyph = 'M65,65 L65,65 L245,65 M65,125 L65,125 L245,125 M65,185 L65,185 L245,185 M65,245 L65,245 L245,245 '

  this.isBooted = false

  this.bang = function (q) {
    if (q.indexOf('~') < 0) { return }

    const words = q.substr(1).split('+')
    const cmd = words[0].substr(0, 1) === '~' ? words[0].substr(1) : words[0]
    const par = words.splice(1).join(' ')

    if (!cmd) { return }

    this.boot()

    this.push('guest', `${cmd}${par ? '(' + par + ')' : ''}`, 125)
    this.push('maeve', `${this.services[cmd] ? this.services[cmd](par) : this.services['unknown'](cmd)}`, 250)

    Ø('search').el.value = '~'
    Ø('terminal').addClass('active')
  }

  this.boot = function () {
    if (this.isBooted === true) { return }
    this.push('maeve', `The local time is ${arvelie()} ${neralie()}.
Today's forecast is <b>${this.services.forecast()}</b>.
Oscean is presently <b>${this.services.progress().toFixed(2)}% Completed</b>.
Devine is now <b>${this.services.age().toFixed(4)} years</b> old.
${this.services.otd()}`, 0)
    this.isBooted = true
  }

  this.push = function (author, txt, delay = 0) {
    setTimeout(() => {
      this.el.innerHTML = `
      <div class='line ${author}'>
        <span class='time'>${neralie()}</span>
        <span class='author'>${author}</span>
        <span class='body'>${txt}</span>
      </div>\n${this.el.innerHTML}`
    }, delay)
  }

  // Services

  this.services =
  {
    help: (q) => {
      return 'Available commands:\n' + plainTable(Object.keys(this.services))
    },

    atog: (q) => {
      return `${new Arvelie(q).toGregorian()}`
    },

    gtoa: (q) => {
      return !isNaN(new Date(q)) ? `${new Date(q).toArvelie()}` : 'Invalid Date'
    },

    litoen: (q) => {
      const res = Ø('asulodeta').find(q, 'name')
      return res ? `The English translation of "${res.childspeak.toLink(res.adultspeak.toTitleCase())}" is "<b>${res.english.toTitleCase()}</b>".` : 'Unknown'
    },

    entoli: (q) => {
      const res = Ø('asulodeta').find(q, 'english')
      return res ? `The Lietal translation of "<b>${q.toTitleCase()}</b>" is "${res.childspeak.toLink(res.adultspeak.toTitleCase())}".` : 'Unknown'
    },

    otd: (q) => {
      const today = new Date().toArvelie()
      const a = []
      const logs = Ø('database').cache.horaire.filter(__onlyEvents).filter(__onlyThisDay)
      if (logs.length < 1) { return `There were no past events on this date.` }
      return `<b>On This Day</b>, on ${timeAgo(logs[0].time, 14)}, ${logs[0].host.name.toTitleCase()} — ${logs[0].name}.`
    },

    iso: (q) => {
      return new Date().toISOString()
    },

    task: (q) => {
      return `${new Log({ code: '-' + q }).task}`
    },

    yleta: (q) => {
      return new Yleta({ name: q }).body()
    },

    next: (q) => {
      const used = []
      for (const id in Ø('database').cache.horaire) {
        const log = Ø('database').cache.horaire[id]
        if (!log.pict) { continue }
        used.push(log.pict)
      }
      let available = 1
      while (available < 999) {
        const target = available.toString(16).toUpperCase()
        if (used.indexOf(target) < 0) { return `The next available diary ID is <b>${target}</b>.` }
        available += 1
      }
      return `There are no available diary IDs under 999.`
    },

    walk: (q) => {
      const totalTime = performance.now()
      for (const id in Ø('database').index) {
        const entryTime = performance.now()
        Ø('database').index[id].toString()
        const entryTimeComplete = performance.now() - entryTime
        if (entryTimeComplete > 300) {
          Ø('terminal').push('null', `${id} slow: ${entryTimeComplete}ms.`)
        }
      }
      return `Walked ${Object.keys(Ø('database').index).length} indexes, in ${(performance.now() - totalTime).toFixed(2)}ms.`
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
      const forecast = new Forecast(Ø('database').cache.horaire)
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

    unknown: (q) => {
      return `Unknown command <i>${q}</i>, type <i>help</i> to see available commands.`
    }
  }
}
