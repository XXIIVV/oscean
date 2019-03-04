'use strict'

RIVEN.lib.CalendarTemplate = function TemplateNode (id, rect) {
  RIVEN.Node.call(this, id, rect)

  this.glyph = 'M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240'

  this.answer = function (q) {
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
        {λ(link "${log.term}" "${log.name}")}</a> 
        <span title='${log.time}'>${timeAgo(log.time, 60)}</span>
      </li>`
    }, '')}</ul>`.toCurlic()

    return `${viz}${html}`
  }
}
