'use strict'

RIVEN.lib.Header = function BuildHeaderNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z'

  function findFeaturedLog (q) {
    if (!q.result) { return }

    if (q.result.name === 'HOME') {
      for (const id in q.tables.horaire) {
        if (q.tables.horaire[id].isFeatured && q.tables.horaire[id].time.offset <= 0 && q.tables.horaire[id]) { return q.tables.horaire[id] }
      }
    }

    return q.result.featuredLog
  }

  function makeActivity (q) {
    if (!q.result) { return '' }

    if (q.result.name === 'HOME' || q.result.name === 'JOURNAL' || q.result.name === 'CALENDAR' || q.result.name === 'TRACKER') {
      return `
      <li><a class='issues' data-goto='Calendar' href='#Calendar'>Calendar</a></li> 
      <li><a class='diaries' data-goto='journal' href='#journal'>Journal</a> 
      <li><a class='logs' data-goto='Tracker' href='#Tracker'>Tracker</a></li>`
    }

    return `
    ${q.params ? `<li><a class='return' data-view='default' href='#${q.result.name}'>Return</a></li>` : ''}
    ${q.result.issues.length > 0 ? `<li><a class='issues' data-view='calendar' href='#${q.result.name}:calendar'>Calendar</a></li>` : ''}
    ${q.result.logs.length > 2 && !q.result.hasTag('journal') ? `<li><a class='diaries' data-view='journal' href='#${q.result.name}:journal'>${q.result.logs.length} Logs</a></li>` : ''}
    ${q.result.issues.length > 1 && !q.result.hasTag('diary') ? `<li><a class='logs' data-view='tracker' href='#${q.result.name}:tracker'>${q.result.issues.length} Issues</a></li>` : ''}
    `
  }

  this.answer = function (q) {
    const featuredLog = findFeaturedLog(q)

    return {
      photo: featuredLog ? featuredLog.photo : 0,
      menu: {
        search: q.target && q.target.toCapitalCase(),
        activity: makeActivity(q),
        info: {
          title: featuredLog ? `<a href='#(${featuredLog.term.to_url()}:diary)'>${featuredLog.name}</a> — ${timeAgo(featuredLog.time, 60)}` : ' ',
          glyph: featuredLog ? featuredLog.host.glyph() : q.result && q.result.glyph() ? q.result.glyph() : 'M240,240 l0,-90 a-90,-90 0 0,0 -90,-90 l-90,0 l0,90 a90,90 0 0,0 90,90 l60,0 l0,-90 a-60,-60 0 0,0 -60,-60 l-60,0 l0,60 a60,60 0 0,0 60,60 l30,0 l0,-60 a-30,-30 0 0,0 -30,-30 l-30,0 l0,30 a30,30 0 0,0 30,30'
        }
      }
    }
  }
}
