'use strict'

function BalanceViz (logs) {
  Viz.call(this, logs, -52 * 2, 0)

  function slice (logs, from, to) {
    const a = []
    for (const id in logs) {
      const log = logs[id]
      if (log.time.offset < from) { continue }
      if (log.time.offset > to) { continue }
      a.push(log)
    }
    return a
  }

  function make_balance (logs, offset) {
    const sliced_logs = slice(logs, offset - 52, offset)
    const sectors = { audio: 0, visual: 0, research: 0, sum: 0 }

    for (const id in sliced_logs) {
      const log = sliced_logs[id]
      if (!log.term) { continue }
      sectors[log.sector] += (log.fh + log.ch) / 2
      sectors.sum += (log.fh + log.ch) / 2
    }

    return {
      audio: sectors.audio > 0 ? (sectors.audio / sectors.sum) : 0,
      visual: sectors.visual > 0 ? (sectors.visual / sectors.sum) : 0,
      research: sectors.research ? (sectors.research / sectors.sum) : 0
    }
  }

  function parse (logs) {
    const days = []
    let day = 53
    while (day > 0) {
      days.push(make_balance(logs, -day))
      day -= 1
    }
    return days
  }

  this.draw = function () {
    const data = parse(this.logs)

    let html = ''
    let day = 52
    const cell = 13
    const height = 95
    const y = 0
    while (day > 0) {
      const x = parseInt(day * (cell + 1) - (cell))
      const bal = data[day]
      const h_research = parseInt(100 * bal.research)
      const h_visual = parseInt(100 * bal.visual)
      const h_audio = height - h_visual - h_research
      html += `<rect class='research' x='${x}' y='${y}' width='${cell}' height='${clamp(h_research, 0)}' rx="2" ry="2"></rect>`
      html += `<rect class='visual' x='${x}' y='${h_research + 1}' width='${cell}' height='${clamp(h_visual, 0)}' rx="2" ry="2"></rect>`
      html += `<rect class='audio' x='${x}' y='${h_research + h_visual + 2}' width='${cell}' height='${clamp(h_audio, 0)}' rx="2" ry="2"></rect>`
      day -= 1
    }

    return html
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
