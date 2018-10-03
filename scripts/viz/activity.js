'use strict'

function ActivityViz (logs) {
  Viz.call(this, logs, -365, 0)

  function parse (logs) {
    const h = {}
    const i = 0
    for (const id in logs) {
      const log = logs[id]
      const offset = log.time.offset
      if (offset > 0) { continue }
      if (offset < -364) { break }
      h[log.time.offset] = log
    }
    return h
  }

  this.draw = function () {
    const data = parse(this.logs)
    const cell = parseInt(700 / 52)

    let html = ''
    let week = 0
    while (week < 52) {
      const x = parseInt(week * (cell + 1))
      const offset = -(365 - (week * 7))
      let day = 0
      while (day < 7) {
        const y = parseInt(day * (cell + 1))
        const offset = (365 - (week * 7) - (day + 1)) * -1
        const log = data[offset + 1]
        html += log && log.sector ? `<rect class='${log.sector} ${log.time.offset == 0 ? 'today' : ''}' x='${x}' y='${y}' width='${cell}' height='${cell}' rx="2" ry="2" title='${log.time}' data-goto='${log.term}'></rect>` : `<rect class='missing ${day == 6 && week == 51 ? 'today' : ''}' x='${x}' y='${y}' width='${cell}' height='${cell}' rx="2" ry="2"></rect>`
        html += log && log.photo ? `<circle cx='${x + (cell / 2)}' cy='${y + (cell / 2)}' r='2.5' class='photo'></circle>` : ''
        html += log && log.is_event ? `<circle cx='${x + (cell / 2)}' cy='${y + (cell / 2)}' r='2' class='event'></circle>` : ''
        day += 1
      }
      week += 1
    }

    return html
  }
}
