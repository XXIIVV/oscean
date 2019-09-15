'use strict'

function Entry (name, data) {
  this.name = name
  this.data = data
  this.unde = 'Home'
  this.bref = null

  this.view = 'main'
  this.theme = 'noir'

  this.indexes = [this.name]

  this.span = { from: null, to: null }
  this.links = []
  this.logs = []
  this.children = []
  this.diaries = []
  this.events = []
  this.tags = []

  this.activity = function () {
    return []
  }

  this.head = () => {
    if (name === 'HOME') { return '' }
    return this.bref ? `<p>${this.bref.template(this)}</p>` : `<p>The term {(bold "${name}")} could not be found.</p>`.template(this)
  }

  this.body = () => {
    return 'Unformatted entry.'
  }

  this.indexes = function () {
    return [this.name]
  }

  this.glyph = function () {
    return null
  }

  this.portal = function () {
    return null
  }

  this._portal = function () {
    return null
  }

  this.photo = function () {
    return null
  }

  this.horaire = (parts = 28) => {
    if (!this.span.to) { return '' }
    const h = new Horaire(this.logs)
    const v = new HoraireViz(this.activity()).toString(parts)
    return this.span.to ? `<div class='horaire'>${'Horaire'.toLink(v)}<span>${h.ph.toFixed(2)}</span></div>` : ''
  }

  this.status = () => {
    if (!this.span.from || !this.span.to) { return 'Unknown' }
    if (this.span.to.offset < -365) {
      return this.span.release ? 'complete' : 'inactive'
    }
    if (this.span.to.offset > -365) {
      return this.span.release ? `maintenance` : `development`
    }
    return 'unknown'
  }

  this.hasTag = function (str) {
    const target = str.toLowerCase().replace(/ /g, '_').trim()
    return this.tags.indexOf(target) > -1
  }

  this.toString = function () {
    return `<div class='error'>${this.body()}</div>`
  }
}

// Log

function Log (data = { code: '-400' }) {
  Entry.call(this, data.name, data)

  this.host = null

  this.term = data.term ? data.term.toTitleCase() : ''
  this.text = data.text
  this.time = data.date ? new Arvelie(data.date) : null
  this.pict = data.pict ? data.pict : null
  this.bref = `A log added on ${this.time} to ${this.term.toLink()}.`
  this.indexes = data.name && this.pict ? [data.name, `${this.pict}`, `${this.time}`] : []
  this.theme = 'noir'

  this.rune = data.code.length > 0 ? data.code.substr(0, 1) : '-'
  this.sc = data.code.length > 1 ? parseInt(data.code.substr(1, 1)) : 0
  this.ch = data.code.length > 2 ? parseInt(data.code.substr(2, 1)) : 0
  this.fh = data.code.length > 3 ? parseInt(data.code.substr(3, 1)) : 0

  this.sector = ['misc', 'audio', 'visual', 'research', 'misc'][this.sc]
  this.featured = this.pict && (this.rune === '!' || this.rune === '+')
  this.isEvent = this.rune === '+'

  this.tasks = [
    ['idle', 'session', 'audio experiment', 'rehearsal', 'draft', 'composition', 'sound design', 'mastering', 'audio release', 'performance' ],
    ['idle', 'screening', 'visual experiment', 'storyboard', 'sketch', 'editing', 'graphic design', 'rendering', 'visual release', 'showcase' ],
    ['idle', 'exploration', 'code experiment', 'maintenance', 'planning', 'prototype', 'interaction design', 'updating', 'software release', 'talk' ]
  ]
  this.task = this.tasks[this.sc - 1] ? this.tasks[this.sc - 1][this.ch] : 'travel'

  this.photo = () => {
    return this
  }

  this.body = () => {
    return this.host ? `
    <div class='entry log ${this.isEvent ? 'event' : ''}'>
      <svg data-goto='${this.host.name}' class='icon'><path transform="scale(0.15) translate(20,20)" d="${this.host ? this.host.glyph() : ''}"></path></svg>
      <div class='head'>
        <div class='details'>${this.term.toLink(this.term, 'topic')} ${this.name && !this.isEvent ? ` — <span class='name' data-goto='${this.name}'>${this.name}</span>` : ''} <span class='time' data-goto='${this.time}'><b>${this.task.toTitleCase()}</b>, ${timeAgo(this.time, 14)}</span></div>
        <div class='bref'>${this.isEvent ? this.name : this.host ? this.host.bref.template(this.host) : ''}</div>
      </div>
      ${this.pict ? `<img src='media/diary/${this.pict}.jpg' data-goto='${this.term}' loading='lazy'/>` : ''}
    </div>` : ''
  }

  this.toText = () => {
    if (this.isEvent && this.name !== '') {
      return `${this.name}`
    }
    if (this.pict && this.name !== '') {
      return `${this.term} ${this.host.parent.name.toTitleCase()} — \"${this.name}\"`
    }
    return `${this.term} ${this.host.parent.name.toTitleCase()} ${this.fh}fh ${this.task}`
  }

  this.toString = () => {
    return this.body()
  }

  // Checks

  if (this.ch >= 8 && (!this.name || !this.isEvent)) { console.warn('Log', `Incomplete event: ${this.time}`) }
  if (this.ch !== 8 && this.name.toLowerCase().indexOf('release') > -1) { console.warn('Log', `Error release event: ${this.time}`) }
  if (this.pict !== null && !this.name) { console.warn('Log', `Missing caption: ${this.time}`) }
  if (this.pict === null && this.rune === '!') { console.warn('Log', `Feature without picture: ${this.time}`) }
  if (['+', '-', '!'].indexOf(this.rune) < 0) { console.warn('Log', `Unknown rune: ${data.code}, on ${this.time}.`, data) }
  if (this.sc > 3 || this.sc === 0 && (this.fh > 0 || this.ch > 0)) { console.warn('Log', `Unknown code: ${data.code}, on ${this.time}.`) }
}

// Term

function Term (name, data) {
  Entry.call(this, name, data)

  this.parent = null // From Ø('map')
  this.children = [] // From Ø('map')
  this.logs = [] // From Ø('map')
  this.diaries = [] // From Ø('map')
  this.span = { from: null, to: null }

  this.data = data
  this.bref = data.BREF ? data.BREF : ''
  this.unde = data.UNDE ? data.UNDE : 'Home'
  this.view = data.VIEW ? data.VIEW.toLowerCase() : 'main'
  this.links = data.LINK ? data.LINK : null
  this.tags = data.TAGS ? data.TAGS.toLowerCase().split(' ') : []
  this.indexes = data.ALTS ? [name].concat(data.ALTS.split(' ')) : [name]
  this.theme = data.LOOK ? data.LOOK.toLowerCase() : 'blanc'
  this.isPortal = this.tags.indexOf('portal') > -1

  this.glyph = () => {
    if (this.data.ICON) { return this.data.ICON }
    if (this.parent.glyph()) { return this.parent.glyph() }
    if (this.portal().glyph()) { return this.portal().glyph() }
    return null
  }

  this.photo = () => {
    for (const id in this.diaries) {
      const diary = this.diaries[id]
      if (diary.featured === true && diary.time.offset <= 0) {
        return this.diaries[id]
      }
    }
    const logs = this.activity()
    for (const id in logs) {
      if (logs[id].pict) {
        return logs[id]
      }
    }
    return null
  }

  this.portal = () => {
    if (this.isPortal) { return this }
    if (this.parent.isPortal) { return this.parent }
    if (this.parent.parent.isPortal) { return this.parent.parent }
    if (this.parent.parent.parent.isPortal) { return this.parent.parent.parent }
    if (this.parent.parent.parent.parent.isPortal) { return this.parent.parent.parent.parent }
    return null
  }

  this._portal = () => {
    const portal = this.portal()
    if (!portal) { return '' }
    return `
    <svg id="glyph"><path transform="scale(0.15)" d="${portal.glyph()}"></path></svg>
    <ul>${portal.children.reduce((acc, child, id) => {
    return `${acc}${`<ul><li>${child.name.toTitleCase().toLink()}</li><ul>${child.children.reduce((acc, child, id) => {
      return `${acc}${`<ul><li class='${child.name === this.name || child.name.toLowerCase() === this.unde.toLowerCase() ? 'selected' : ''}'>${child.name.toTitleCase().toLink()}</li>${child.name === this.name || child.name.toLowerCase() === this.unde.toLowerCase() ? `<ul>${child.children.reduce((acc, child, id) => {
        return `${acc}${`<ul><li class='${child.name === this.name ? 'selected' : ''}'>${child.name.toTitleCase().toLink()}</li></ul>`}`
      }, '')}</ul>` : ''}</ul>`}`
    }, '')}</ul></ul>`}`
  }, '')}</ul>`
  }

  this.activity = () => {
    return sortLogs(this.children.reduce((acc, term) => { return acc.concat(term.logs) }, this.logs))
  }

  this.rating = () => {
    const points = {
      body: this.data.BODY && this.data.BODY.length > 0,
      logs: this.logs.length > 0,
      children: this.children.length > 0,
      photo: this.diaries.length > 0,
      glyph: this.glyph() !== ''
    }
    const score = Object.keys(points).reduce((acc, val) => { return acc + (points[val] ? 1 : 0) }, 0)
    return score / Object.keys(points).length
  }

  this.body = () => {
    return `${runic(this.data.BODY, this)}`
  }

  this._photo = () => {
    return this.photo() ? this.name.toLink(`<img src='media/diary/${this.photo().pict}.jpg' loading='lazy'/>`) : ''
  }

  this._static = () => {
    return `
    <h2 id='${this.name.toUrl()}'>${this.name.toTitleCase()}</h2>
    <h3>${this.bref}</h3>
    ${runic(this.data.BODY.filter((item) => { return item.substr(0, 1) !== 'λ' && item.substr(0, 1) !== '%' && item.substr(0, 1) !== '>' }), this)}
    ${this.links ? '<ul>' + Object.values(this.links).reduce((acc, item) => { return `${acc}<li><a href='${item}'>${item}</a></li>` }, '') + '</ul>' : ''}\n\n`
  }

  this.outgoing = () => {
    const body = [this.data.BREF].concat(this.data.BODY).join('')
    const links = body.split('{(link "').map((item) => { return item.split('"')[0].toUpperCase() })
    links.shift()
    return links.filter((item) => { return item.indexOf('HTTP') < 0 })
  }

  this.toString = (photo = false) => {
    return `<h2>${this.name.toTitleCase()}</h2><h4>${this.bref}</h4>${photo === true ? this._photo() : ''}${this.body()}`
  }

  this.toEntry = () => {
    const h = new Horaire(this.activity())
    return `<div class='entry'>
      <svg data-goto='${this.name}' class="icon"><path transform="scale(0.15) translate(20,20)" d="${this.glyph()}"></path></svg>
      <div class='head'>
        <div class='details'>${this.name.toTitleCase().toLink()}<span class='time'><b>${h.length} logs</b>, updated ${this.span.to.ago()}</span></div>
        <div class='bref'>${new HoraireViz(this.activity()).toString(200, 40)}</div>
      </div>
    </div>`
  }

  // Checks

  if (!this.data.UNDE) { console.warn('Term', `Missing .UNDE, for ${this.name}.`) }
  if (!this.data.BREF) { console.warn('Term', `Missing .BREF, for ${this.name}.`) }
  if (!this.data.BODY) { console.warn('Term', `Missing .BODY, for ${this.name}.`) }
  if (this.data.BREF && this.data.BREF.indexOf('{(link)}') < 0) { console.warn('Term', `Missing self-reference, for ${this.name}.`) }
}

// Yleta

function Yleta (data = {}) {
  Entry.call(this, data.name, data)

  this.unde = 'Lietal'
  this.english = data.english
  this.childspeak = name || data.name.toLowerCase()
  this.type = this.childspeak.substr(0, 2)
  this.key = this.childspeak.substr(0, this.childspeak.length - 2)
  this.indexes = [this.name]
  this.bref = `??`

  this.glyph = () => {
    return `M65,155 L65,155 L155,155 M155,65 L155,65 L155,245 M185,155 L185,155 L245,155 M185,185 L185,185 L185,185`
  }

  this.body = function () {
    return '??'
  }

  this.toString = function () {
    return '??'
  }
}

// List

function List (name, data) {
  Entry.call(this, name, data)

  this.bref = `The ${this.name.toTitleCase().toLink()} word list.`
  this.unde = 'Mirrors'
  this.indexes = [name].concat(Object.keys(data))

  this.body = () => {
    return `<ul>${Object.keys(this.data).reduce((acc, val) => {
      return `${acc}<li><b>${val.toTitleCase()}</b>: ${this.data[val].isUrl() ? this.data[val].toLink() : this.data[val].template(this.data[val])}</li>`
    }, '')}</ul>`
  }

  this.toString = (q) => {
    return `<h3>${name.toTitleCase()}</h3>${this.body()}`
  }
}
