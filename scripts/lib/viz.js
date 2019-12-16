'use strict'

/* global Horaire */

function Viz (logs, from, to, size = 12) {
  this.logs = []

  for (const log of logs) {
    if (log.time.offset < from) { continue }
    if (log.time.offset > to) { continue }
    this.logs.push(log)
  }

  function makePercentage (val, sum, len = 1) {
    return `${((val / sum) * 100).toFixed(len)}%`
  }

  function _legend (logs) {
    const horaire = new Horaire(logs)
    const sum = horaire.sectors.audio + horaire.sectors.visual + horaire.sectors.research

    return `
    <rect class="bg_audio" x="${size * 0}" y="105" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(size + 1) * 2}' y='115' style='text-anchor:start'>Audio ${makePercentage(horaire.sectors.audio, sum)}</text>
    <rect class="bg_visual" x="${(size + 1) * 9}" y="105" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(size + 1) * 11}' y='115' style='text-anchor:start'>Visual ${makePercentage(horaire.sectors.visual, sum)}</text>
    <rect class="bg_research" x="${(size + 1) * 18}" y="105" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(size + 1) * 20}' y='115' style='text-anchor:start'>Research ${makePercentage(horaire.sectors.research, sum)}</text>
    <text x='675' y='115' style='text-anchor:end'>${horaire.range.from.time.ago()}</text>`
  }

  this.draw = function () {
    return ''
  }

  this.toString = function (showDetails = true) {
    return `
    <svg class='viz'>
      ${showDetails === true ? _legend(this.logs) : ''}
      ${this.draw()}
    </svg>`
  }
}

function ActivityViz (logs) {
  Viz.call(this, logs, -365, 0)

  function parse (logs) {
    const h = {}
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
    const cell = 12
    let html = ''
    let week = 0
    while (week < 52) {
      const x = parseInt(week * (cell + 1))
      let day = 0
      while (day < 7) {
        const y = parseInt(day * (cell + 1))
        const offset = (365 - (week * 7) - (day + 1)) * -1
        const log = data[offset + 1]
        html += log && log.sector ? `<rect class='bg_${log.sector} ${log.isEvent ? 'event' : ''}' x='${x}' y='${y}' width='${cell}' height='${cell}' rx="2" ry="2" title='${log.time}' data-goto='${log.term}'></rect>` : `<rect class='missing ${day === 6 && week === 51 ? 'today' : ''}' x='${x}' y='${y}' width='${cell}' height='${cell}' rx="2" ry="2"></rect>`
        day += 1
      }
      week += 1
    }

    return html
  }
}

function BarViz (logs) {
  Viz.call(this, logs, -365 * 10, 0)

  function distribute (logs, parts = 51) {
    const limit = logs[logs.length - 1].time.offset * -1
    const h = {}
    for (const id in logs) {
      const log = logs[id]
      const offset = log.time.offset
      const pos = parts - (((offset * -1) / limit) * parts)
      const share = (pos - Math.floor(pos))

      if (!h[Math.floor(pos)]) { h[Math.floor(pos)] = { audio: 0, visual: 0, research: 0 } }
      if (!h[Math.ceil(pos)]) { h[Math.ceil(pos)] = { audio: 0, visual: 0, research: 0 } }
      if (!h[Math.floor(pos)][log.sector]) { h[Math.floor(pos)][log.sector] = 0 }
      if (!h[Math.ceil(pos)][log.sector]) { h[Math.ceil(pos)][log.sector] = 0 }

      h[Math.floor(pos)][log.sector] += ((log.fh + log.ch) / 2) * (1 - share)
      h[Math.ceil(pos)][log.sector] += ((log.fh + log.ch) / 2) * share
    }
    return h
  }

  this.draw = function () {
    const segments = distribute(this.logs)
    const cell = 12
    const mod = 0.16
    return Object.keys(segments).reduce((acc, val, id) => {
      const seg = segments[val]
      const x = parseInt(id) * (cell + 1)
      const audioh = clamp(seg.audio * mod, 4, 100)
      const audioy = audioh + 35
      const visualh = clamp(seg.visual * mod, 4, 100)
      const visualy = (visualh + audioy) + 0.5
      const researchh = clamp(seg.visual * mod, 4, 100)
      const researchy = (researchh + visualy) + 0.5
      return `${acc}
      <rect class='bg_audio' x='${x}' y='${125 - audioy}' width='${cell}' height='${audioh}' rx="2" ry="2"></rect>
      <rect class='bg_visual' x='${x}' y='${125 - visualy}' width='${cell}' height='${visualh}' rx="2" ry="2"></rect>
      <rect class='bg_research' x='${x}' y='${125 - researchy}' width='${cell}' height='${researchh}' rx="2" ry="2"></rect>`
    }, '')
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

function BalanceViz (logs) {
  Viz.call(this, logs, -365 * 10, 0)

  function distribute (logs, parts = 51) {
    const limit = logs[logs.length - 1].time.offset * -1
    const h = {}
    for (const id in logs) {
      const log = logs[id]
      const offset = log.time.offset
      const pos = parts - (((offset * -1) / limit) * parts)
      const share = (pos - Math.floor(pos))
      if (!h[Math.floor(pos)]) { h[Math.floor(pos)] = { audio: 0, visual: 0, research: 0 } }
      if (!h[Math.ceil(pos)]) { h[Math.ceil(pos)] = { audio: 0, visual: 0, research: 0 } }
      if (!h[Math.floor(pos)][log.sector]) { h[Math.floor(pos)][log.sector] = 0 }
      if (!h[Math.ceil(pos)][log.sector]) { h[Math.ceil(pos)][log.sector] = 0 }
      h[Math.floor(pos)][log.sector] += ((log.fh + log.ch) / 2) * (1 - share)
      h[Math.ceil(pos)][log.sector] += ((log.fh + log.ch) / 2) * share
    }
    return h
  }

  this.draw = function () {
    const segments = distribute(this.logs)
    const cell = 12
    return Object.keys(segments).reduce((acc, val, id) => {
      const seg = segments[val]
      const x = parseInt(id) * (cell + 1)
      const sum = seg.audio + seg.visual + seg.research
      const audioh = Math.floor(clamp((seg.audio / sum) * 90, 4, 125))
      const audioy = 0
      const visualh = Math.floor(clamp((seg.visual / sum) * 90, 4, 125))
      const visualy = audioh + 0.5
      const researchh = 89 - audioh - visualh
      const researchy = (audioh + visualh) + 1
      return `${acc}
      <rect class='bg_audio' x='${x}' y='${audioy}' width='${cell}' height='${audioh}' rx="2" ry="2"></rect>
      <rect class='bg_visual' x='${x}' y='${visualy}' width='${cell}' height='${visualh}' rx="2" ry="2"></rect>
      <rect class='bg_research' x='${x}' y='${researchy}' width='${cell}' height='${researchh}' rx="2" ry="2"></rect>`
    }, '')
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

function HoraireViz (logs) {
  const end = new Date() // 5 years ago
  const start = new Date(new Date() - (31536000 * 1000 * 5)) // 5 years ago

  function distribute (logs, parts) {
    const h = {}
    for (const id in logs) {
      const log = logs[id]
      const ratio = (log.time.date - start) / (end - start)
      if (ratio < 0) { continue }
      const pos = ratio * parts
      const share = (pos - Math.floor(pos))
      const low = Math.floor(pos)
      const high = Math.ceil(pos)
      const value = log.ch / log.fh
      if (!h[low]) { h[low] = 0 }
      if (!h[high]) { h[high] = 0 }
      h[low] += value * (1 - share)
      h[high] += value * share
    }
    return h
  }

  this.toString = function (parts = 28, height = 20) {
    const segments = distribute(logs, parts)
    let html = ''
    const max = Math.max(...Object.values(segments))
    const real = []
    for (let i = 0; i < parts; i++) {
      const v = !isNaN(segments[i]) ? segments[i] : 0
      real.push((1 - (v / max)) * height)
    }
    for (const i in real) {
      const x = (parseInt(i) * 3) + 2
      const y = real[i]
      const before = !isNaN(real[i - 1]) ? real[i - 1] : height
      const after = !isNaN(real[i + 1]) ? real[i + 1] : height
      const soften = ((y + before + after) / 3)
      html += `M${x},${height} L${x},${parseInt(soften)} `
    }
    return `<svg class='horaire' style='width:${parts * 3}px; height: ${height + 4}px'><path d="${html}"/></svg>`
  }
}

function PieChart (logs) {
  this.colors = ['#72dec2', '#51a196', '#316067']
  this.data = sortHash(Horaire(logs).terms).slice(0, 18)
  this.size = { w: 120, h: 120, t: 12 }

  this.pie = (id, ratio, color = 'red', offset = 0) => {
    const r = (this.size.w / 2) - this.size.t
    const c = 2 * Math.PI * r
    return `
    <g transform = "rotate(${offset} ${this.size.w / 2} ${this.size.h / 2})">
      <circle 
        r='${r}' 
        cx="${this.size.w / 2}" 
        cy="${this.size.h / 2}" 
        fill='none' 
        stroke='${color}' 
        stroke-width='${this.size.t}' 
        stroke-dasharray='${c}' 
        stroke-dashoffset='${c * (1 - ratio)}' 
        stroke-linecap='butt'/>
    </g>`
  }

  this.legend = () => {
    let html = ''
    let count = 0
    for (const item of this.data) {
      html += `<li>${item[0].toLink()} ${item[1]}fh <span style='color:${this.color(count)}'>•</span></li>`
      count++
    }
    return `<ul class='tidy col3'>${html}</ul>`
  }

  this.color = (id) => {
    return this.colors[id % this.colors.length]
  }

  this.toString = () => {
    let xml = ''
    const sum = Object.values(this.data).reduce((acc, item) => { return acc + item[1] }, 0)
    let count = 0
    let total = 0
    for (const item of this.data) {
      const value = item[1]
      xml += this.pie(item[0], value / sum, this.color(count), (total / sum) * 360)
      total += value
      count++
    }
    return `
    <svg class='horaire' style='
      width:${this.size.w}px; 
      height: ${this.size.h}px; 
      float:left; 
      margin-right:45px; 
      transform: rotate(-90deg);'>
      ${xml}
    </svg>
    ${this.legend()}
    <hr />`
  }
}
