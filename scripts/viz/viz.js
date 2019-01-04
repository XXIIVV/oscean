'use strict'

function Viz (logs, from, to, showDetails = true) {
  this.logs = slice(logs, from, to)

  const cell = 13

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

  function offset (recent, before, trail = 1) {
    const print = recent - before > 0 ? `+${(recent - before).toFixed(trail)}` : `${(recent - before).toFixed(trail)}`
    return print !== '-0.0' && print !== '+0.0' ? print : '0.0'
  }

  function _legend (logs) {
    if (!showDetails) { return '' }
    const horaire = new Horaire(logs)
    return `
    <text x='${2}' y='${-15}' style='text-anchor:start'>${timeAgo(logs[logs.length - 1].time).toTitleCase()}</text>
    <text x='${730}' y='${-15}' style='text-anchor:end'>${timeAgo(logs[0].time).toTitleCase()}</text>

    <rect class="audio" x="${cell * 0}" y="115" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell + 1) * 2}' y='125' style='text-anchor:start'>Audio ${(horaire.sectors.audio * 10).toFixed(1)}%</text>
    <rect class="visual" x="${(cell + 1) * 8}" y="115" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell + 1) * 10}' y='125' style='text-anchor:start'>Visual ${(horaire.sectors.visual * 10).toFixed(1)}%</text>
    <rect class="research" x="${(cell + 1) * 16}" y="115" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell + 1) * 18}' y='125' style='text-anchor:start'>Research ${(horaire.sectors.research * 10).toFixed(1)}%</text>
    <text x='725' y='125' style='text-anchor:end'>${horaire.fhs.toFixed(0)} Hours</text>`
  }

  function _status (data) {
    if (!showDetails || data.recent.length < 2 || data.before.length < 2) { return '' }

    const recent = new Horaire(data.recent)
    const before = new Horaire(data.before)

    return `
    <line x1='0' y1='${cell * 11.5}' x2='730' y2='${cell * 11.5}'/>
    <text class='display' x='${0}' y='${cell * 16.5}'>${recent.ch.toFixed(2)}</text>
    <text class='display small' x='${cell * 7}' y='${cell * 15.1}'>${offset(recent.ch, before.ch)}</text>
    <text class='display small' x='${cell * 7}' y='${cell * 16.5}' style='font-family: var(--mono);'>ch/day</text>

    <text class='display' x='${180}' y='${cell * 16.5}'>${recent.fh.toFixed(2)}</text>
    <text class='display small' x='${180 + (cell * 7)}' y='${cell * 15.1}'>${offset(recent.fh, before.fh)}</text>
    <text class='display small' x='${180 + (cell * 7)}' y='${cell * 16.5}' style='font-family: var(--mono);'>fh/day</text>

    <text class='display' x='${360}' y='${cell * 16.5}'>${recent.focus.toFixed(2).substr(0, 4)}</text>
    <text class='display small' x='${360 + (cell * 7)}' y='${cell * 15.1}'>${offset(recent.focus, before.focus)}</text>
    <text class='display small' x='${360 + (cell * 7)}' y='${cell * 16.5}' style='font-family: var(--mono);'>focus</text>

    <text class='display' x='${550}' y='${cell * 16.5}'>${recent.balance.toFixed(2).substr(0, 4)}</text>
    <text class='display small' x='${550 + (cell * 7)}' y='${cell * 15.1}'>${offset(recent.balance, before.balance)}</text>
    <text class='display small' x='${550 + (cell * 7)}' y='${cell * 16.5}' style='font-family: var(--mono);'>balance</text>
    `
  }

  this.draw = function () {
    return ''
  }

  this.toString = function () {
    if (this.logs.length < 1) { return '' }

    const data = { recent: [], before: [] }
    // Split the last 14 days
    for (const id in this.logs) {
      const log = this.logs[id]
      const offset = log.time.offset
      if (offset > 0) { continue }
      if (offset > -(this.logs.length / 2)) { data.recent[data.recent.length] = log } else { data.before[data.before.length] = log }
    }

    return `
    <svg class='viz ${data.recent.length < 2 || data.before.length < 2 ? 'no_status' : ''}'>
      ${_legend(this.logs)}
      ${_status(data)}
      ${this.draw()}
    </svg>`
  }
}
