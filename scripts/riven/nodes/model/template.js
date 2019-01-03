'use strict'

RIVEN.lib.Template = function TemplateNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.receive = function (q) {
    const time = performance.now()
    const featuredLog = q.result ? q.result.featuredLog : null

    const template = {
      title: `XXIIVV — ${q.target.toTitleCase()}`,
      view: this._view(q),
      theme: this._theme(q),
      document: {
        header: {
          photo: q.result ? q.result.photo() : 0,
          menu: {
            search: q.target && q.target.toTitleCase(),
            activity: this._activity(q),
            info: {
              title: featuredLog ? `<a data-goto='journal' href='#journal'>${featuredLog.name}</a> — ${timeAgo(featuredLog.time, 60)}` : ' ',
              glyph: featuredLog ? featuredLog.host.glyph() : q.result && q.result.glyph() ? q.result.glyph() : 'M240,240 l0,-90 a-90,-90 0 0,0 -90,-90 l-90,0 l0,90 a90,90 0 0,0 90,90 l60,0 l0,-90 a-60,-60 0 0,0 -60,-60 l-60,0 l0,60 a60,60 0 0,0 60,60 l30,0 l0,-60 a-30,-30 0 0,0 -30,-30 l-30,0 l0,30 a30,30 0 0,0 30,30'
            }
          }
        },
        core: {
          sidebar: this._sidebar(q),
          content: {
            main: this._main(q),
            calendar: this._calendar(q),
            journal: this._journal(q),
            tracker: this._tracker(q)
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
      <li><a class='calendar' data-goto='calendar' href='#calendar'>Calendar</a></li> 
      <li><a class='journal' data-goto='journal' href='#journal'>Journal</a> 
      <li><a class='tracker' data-goto='tracker' href='#tracker'>Tracker</a></li>`
    }

    return `
    ${q.result.events.length > 0 ? `<li><a class='calendar' data-view='calendar' href='#${q.result.name.toUrl()}:calendar'>${q.result.events.length} Event${q.result.events.length > 1 ? 's' : ''}</a></li>` : ''}
    ${q.result.activity().length > 2 && !q.result.hasTag('journal') ? `<li><a class='journal' data-view='journal' href='#${q.result.name.toUrl()}:journal'>${q.result.activity().length} Logs</a></li>` : ''}
    ${q.result.issues.length > 0 && !q.result.hasTag('diary') ? `<li><a class='tracker' data-view='tracker' href='#${q.result.name.toUrl()}:tracker'>${q.result.issues.length} Issue${q.result.issues.length > 1 ? 's' : ''}</a></li>` : ''}
    `
  }

  // Sidebar

  function _links (term) {
    if (!term.links) { return '' }
    return `
    <ul class='links'>
      ${Object.keys(term.links).reduce((acc, val) => { return `${acc}<li><a href='${term.links[val]}' target='_blank'>${val.toLowerCase()}</a></li>` }, '')}
    </ul>`
  }

  function _directory (term) {
    if (!term.children) { return '' }
    const stem = term.children.length > 0 ? term : term.parent
    let html = `<li class='parent'>{${stem.name.toTitleCase()}(${stem.name === term.name ? stem.parent.name : stem.name}))}</li>`
    for (const id in stem.children) {
      const leaf = stem.children[id]
      if (leaf.name === stem.name) { continue }
      if (leaf.hasTag('hidden')) { continue }
      html += `<li class='children ${leaf.name === term.name ? 'active' : ''}'>{(${leaf.name.toTitleCase()})}</li>`
    }
    return `<ul class='directory'>${html}</ul>`.toCurlic()
  }

  this._sidebar = function (q) {
    if (!q.result) { return '<h1>The {(Nataniev)} Services Desk</h1><h2>{(Home)}</h2>'.toCurlic() }
    return `
    <h1>${q.result.bref.toCurlic()}</h1>
    ${q.result.logs.length > 2 ? `<h2>${q.result.logs[q.result.logs.length - 1].time}—${q.result.logs[0].time}</h2>` : ''}
    ${_links(q.result)}
    ${_directory(q.result)}`
  }

  // Main

  this._main = function (q) {
    if (q.result) { return `${q.result.body()}` }

    const index = Object.keys(Ø('database').index)
    const similar = findSimilar(q.target.toUpperCase(), index)

    return `
    <p>Sorry, there are no pages for {*/${q.target.toTitleCase()}*}, did you mean {(${similar[0].word.toTitleCase()})} or {(${similar[1].word.toTitleCase()})}?</p>
    <p>{*Create this page*} by submitting a {Pull Request(https://github.com/XXIIVV/oscean)}, or if you believe this to be an error, please contact {@neauoire(https://twitter.com/neauoire)}. Alternatively, you locate missing pages from within the {progress tracker(Tracker)}.</p>`.toCurlic()
  }

  // Tracker

  this._tracker = function (q) {
    const issues = q.result && q.result.name === 'TRACKER' ? Object.values(q.tables.lexicon).reduce((acc, term) => { acc = acc.concat(term.issues); return acc }, []) : q.result ? q.result.issues : []

    if (issues.length < 1) {
      return `<p>There are no issues to the {(${q.target.toTitleCase()})} project.</p>`.toCurlic()
    }

    const viz = new BalanceViz(q.tables.horaire)
    const html = issues.reduce((acc, key) => { return `${acc}${key}` }, '')

    return `${viz}${html}`
  }

  // Calendar

  this._calendar = function (q) {
    const events = q.result && q.result.name === 'CALENDAR' ? q.tables.horaire.filter((log) => { return log.isEvent }) : q.result ? q.result.events : []

    if (events.length < 1) {
      return `<p>There is no events to the {(${q.target.toTitleCase()})} project.</p>`.toCurlic()
    }

    const viz = new BarViz(q.target === 'calendar' ? q.tables.horaire : q.result.logs)
    const html = `<ul class='tidy ${events.length > 20 ? 'col3' : ''}' style='padding-top:30px;'>${events.reduce((acc, log, id, arr) => {
      return `
      ${acc}
      ${!arr[id - 1] || arr[id - 1].time.y !== log.time.y ? `<li class='head'>20${log.time.y}</li>` : ''}
      <li style='${log.time.offset > 0 ? 'color:#aaa' : ''}'>
        {${log.name}(${log.term})}</a> 
        <span title='${log.time}'>${timeAgo(log.time, 60)}</span>
      </li>`
    }, '')}</ul>`.toCurlic()

    return `${viz}${html}`
  }

  // Journal

  this._journal = function (q, upcoming = false) {
    const logs = q.result && q.result.name === 'JOURNAL' ? q.tables.horaire : q.result ? q.result.activity() : []

    if (logs.length < 1) {
      return `<p>There is no recent activity to the {(${q.target.toTitleCase()})} project.</p>`.toCurlic()
    }

    const viz = new ActivityViz(logs)
    const known = []
    let html = ''
    let i = 0
    for (let id in logs) {
      if (i > 20) { break }
      const log = logs[id]
      if (!log.photo && !log.isEvent && known.indexOf(log.term) > -1) { continue }
      html += `${log}`
      known.push(log.term)
      i += 1
    }

    return `${viz}${html}`
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
    return `${acc}${`<ul><li>{(${child.name.toTitleCase()})}</li><ul>${child.children.reduce((acc, child, id) => {
      return `${acc}${`<ul><li class='${child.name === term.name || child.name.toLowerCase() === term.unde.toLowerCase() ? 'selected' : ''}'>{(${child.name.toTitleCase()})}</li>${child.name === term.name || child.name.toLowerCase() === term.unde.toLowerCase() ? `<ul>${child.children.reduce((acc, child, id) => {
        return `${acc}${`<ul><li class='${child.name === term.name ? 'selected' : ''}'>{(${child.name.toTitleCase()})}</li></ul>`}`
      }, '')}</ul>` : ''}</ul>`}`
    }, '')}</ul></ul>`}`
  }, '')}</ul>`.toCurlic()
  }
}
