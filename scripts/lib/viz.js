'use strict'

/* global Horaire */

function Viz (logs, from, to, name) {
  this.size = 12

  this.slice = (logs, from, length) => {
    const h = {}
    for (const id in logs) {
      const log = logs[id]
      if (log.time.offset < from || log.time.offset > from + length) { continue }
      h[log.time.offset] = log
    }
    return h
  }

  this.distrib = (logs, from, length) => {
    const a = Array(52).fill()
    let i = 0
    while (i < length) {
      const offset = from + i
      const pos = (i / length) * 52
      const share = (pos - Math.floor(pos))
      const log = logs[offset]
      if (log) {
        const floor = Math.floor(pos)
        const ceil = Math.ceil(pos)
        if (!a[floor]) { a[floor] = { audio: 0, visual: 0, research: 0 } }
        if (!a[ceil]) { a[ceil] = { audio: 0, visual: 0, research: 0 } }
        a[floor][log.sector] += ((log.fh + log.ch) / 2) * (1 - share)
        a[ceil][log.sector] += ((log.fh + log.ch) / 2) * share
      }
      i++
    }
    return a
  }

  this._legend = function (logs) {
    const horaire = new Horaire(logs)
    const sum = horaire.sectors.audio + horaire.sectors.visual + horaire.sectors.research

    return `
    <rect class="bg_audio" x="${this.size * 0}" y="105" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(this.size + 1) * 2}' y='115' style='text-anchor:start'>Audio ${makePercentage(horaire.sectors.audio, sum)}</text>
    <rect class="bg_visual" x="${(this.size + 1) * 9}" y="105" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(this.size + 1) * 11}' y='115' style='text-anchor:start'>Visual ${makePercentage(horaire.sectors.visual, sum)}</text>
    <rect class="bg_research" x="${(this.size + 1) * 18}" y="105" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(this.size + 1) * 20}' y='115' style='text-anchor:start'>Research ${makePercentage(horaire.sectors.research, sum)}</text>
    <text x='675' y='115' style='text-anchor:end'>${name} — ${timeAgo(from)}</text>`
  }

  this.draw = function () {
    return ''
  }

  this.toString = function (showDetails = true) {
    return `
    <svg class='viz'>
      ${showDetails === true ? this._legend(logs) : ''}
      ${this.draw()}
    </svg>`
  }

  function makePercentage (val, sum, len = 1) {
    return `${((val / sum) * 100).toFixed(len)}%`
  }
}

function DotViz (logs, from = -365, length = 365) {
  Viz.call(this, logs, from, length, 'Activity')

  this.draw = function () {
    const data = this.slice(logs, from)
    let html = ''
    let week = 0
    while (week < 52) {
      const x = parseInt(week * (this.size + 1))
      let day = 0
      while (day < 7) {
        const y = parseInt(day * (this.size + 1))
        const offset = ((from * -1) - (week * 7) - (day + 1)) * -1
        const log = data[offset + 1]
        html += log && log.sector ? `<rect class='bg_${log.sector} ${log.isEvent ? 'event' : ''}' x='${x}' y='${y}' width='${this.size}' height='${this.size}' rx="2" ry="2" title='${log.time}' data-goto='${log.term}'></rect>` : `<rect class='missing ${day === 6 && week === 51 ? 'today' : ''}' x='${x}' y='${y}' width='${this.size}' height='${this.size}' rx="2" ry="2"></rect>`
        day += 1
      }
      week += 1
    }

    return html
  }
}

function BarViz (logs, from = -365, length = 365) {
  Viz.call(this, logs, from, length, 'Focus')

  this.draw = function () {
    const data = this.slice(logs, from, length)
    const segments = this.distrib(data, from, length)
    const range = { min: 9999, max: 0 }

    // Clamp
    for (const key in segments) {
      if (!segments[key]) { segments[key] = { audio: 0, visual: 0, research: 0 } }
      segments[key].audio = clamp(segments[key].audio, 2)
      segments[key].visual = clamp(segments[key].visual, 2)
      segments[key].research = clamp(segments[key].research, 2)
    }

    // min
    for (const seg of Object.values(segments)) {
      const sum = seg.audio + seg.visual + seg.research
      if (sum < range.min) { range.min = sum }
      if (sum > range.max) { range.max = sum }
    }

    return Object.keys(segments).reduce((acc, val, id) => {
      const x = parseInt(id) * (this.size + 1)
      const seg = segments[val]
      const sum = seg.audio + seg.visual + seg.research
      const sumHeight = (sum / range.max) * 91
      const audio = { h: (seg.audio / sum) * sumHeight, y: 91 - sumHeight }
      const visual = { h: (seg.visual / sum) * sumHeight, y: audio.y + audio.h + 0.5 }
      const research = { h: (seg.research / sum) * sumHeight, y: visual.y + visual.h + 0.5 }

      return `${acc}
      <rect class='bg_misc' x='${x}' y='${91 - sumHeight}' width='${this.size}' height='${sumHeight}' rx="2" ry="2"></rect>
      <rect class='bg_audio' x='${x}' y='${audio.y}' width='${this.size}' height='${audio.h}' rx="2" ry="2"></rect>
      <rect class='bg_visual' x='${x}' y='${visual.y}' width='${this.size}' height='${visual.h}' rx="2" ry="2"></rect>
      <rect class='bg_research' x='${x}' y='${research.y}' width='${this.size}' height='${research.h}' rx="2" ry="2"></rect>
      `
    }, '')
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

function BalViz (logs, from = -365, length = 365) {
  Viz.call(this, logs, from, length, 'Balance')

  this.draw = function () {
    const data = this.slice(logs, from, length)
    const segments = this.distrib(data, from, length)
    const range = { min: 9999, max: 0 }

    // Clamp
    for (const key in segments) {
      if (!segments[key]) { segments[key] = { audio: 0, visual: 0, research: 0 } }
      segments[key].audio = clamp(segments[key].audio, 2)
      segments[key].visual = clamp(segments[key].visual, 2)
      segments[key].research = clamp(segments[key].research, 2)
    }

    // min
    for (const seg of Object.values(segments)) {
      const sum = seg.audio + seg.visual + seg.research
      if (sum < range.min) { range.min = sum }
      if (sum > range.max) { range.max = sum }
    }

    return Object.keys(segments).reduce((acc, val, id) => {
      const x = parseInt(id) * (this.size + 1)
      const seg = segments[val]
      const sum = seg.audio + seg.visual + seg.research
      const audioh = Math.floor(clamp((seg.audio / sum) * 90, 4, 125))
      const audioy = 0
      const visualh = Math.floor(clamp((seg.visual / sum) * 90, 4, 125))
      const visualy = audioh + 0.5
      const researchh = 89 - audioh - visualh
      const researchy = (audioh + visualh) + 1
      return `${acc}
      <rect class='bg_audio' x='${x}' y='${audioy}' width='${this.size}' height='${audioh}' rx="2" ry="2"></rect>
      <rect class='bg_visual' x='${x}' y='${visualy}' width='${this.size}' height='${visualh}' rx="2" ry="2"></rect>
      <rect class='bg_research' x='${x}' y='${researchy}' width='${this.size}' height='${researchh}' rx="2" ry="2"></rect>`
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

function PieViz (logs) {
  this.colors = ['#72dec2', '#51a196', '#316067']
  this.data = sortHash(Horaire(logs).terms).slice(0, 18)
  this.diameter = 120
  this.size = 12

  this.pie = (id, ratio, color = 'red', offset = 0) => {
    const r = (this.diameter / 2) - this.size
    const c = 2 * Math.PI * r
    return `
    <g transform = "rotate(${offset} ${this.diameter / 2} ${this.diameter / 2})">
      <circle 
        r='${r}' 
        cx="${this.diameter / 2}" 
        cy="${this.diameter / 2}" 
        fill='none' 
        stroke='${color}' 
        stroke-width='${this.size}' 
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
      width:${this.diameter}px; 
      height: ${this.diameter}px; 
      float:left; 
      margin-right:45px; 
      transform: rotate(-90deg);'>
      ${xml}
    </svg>
    ${this.legend()}
    <hr />`
  }
}
