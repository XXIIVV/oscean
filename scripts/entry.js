'use strict'

/* global Arvelie */
/* global Horaire */

function Entry (name, data) {
  this.name = name
  this.data = data
  this.unde = 'Home'
  this.bref = null
  this.view = 'main'
  this.theme = 'noir'

  this.indexes = [this.name]

  this.links = {}
  this.logs = []
  this.children = []
  this.tags = []

  this.glyph = () => {
    return 'M150,60 A90,90 0 0,1 240,150 A-90,90 0 0,1 150,240 A-90,-90 0 0,1 60,150 A90,-90 0 0,1 150,60 Z'
  }

  this.activity = function () {
    return []
  }

  this.portal = function () {
    return null
  }

  this.photo = function () {
    return null
  }

  this.templates = {
    icon: () => {
      return `<svg data-goto='${this.host.name}' class='icon'><path transform="scale(0.15) translate(20,20)" d="${this.host.glyph()}"></path></svg>`
    },
    photo: () => {
      const headerlog = this.host.photo()
      const photolog = this.photo()
      return `${photolog && photolog.pict !== headerlog.pict ? this.name.toLink(`<img src='media/diary/${photolog.pict}.jpg' title='${photolog.name}' loading='lazy'/>`) : ''}`
    },
    gallery: () => {
      const photolog = this.photo()
      return `${photolog ? this.name.toLink(`<img src='media/diary/${photolog.pict}.jpg' title='${photolog.name}' loading='lazy'/>`) : ''}<h2>${this.name.toTitleCase()}</h2><p>${this.bref.template(this)}</p>`.template(this)
    },
    list: () => {
      return `<li>${this.host.bref}</li>`.template(this)
    },
    index: () => {
      return `<h3>${this.name.toTitleCase()}</h3><h4>${this.bref.template(this)}</h4><ul class='bullet'>${this.children.reduce((acc, term) => { return `${acc}<li>${term.bref.template(term)}</li>` }, '')}</ul>`
    },
    full: () => {
      return this.toString(true).template(this)
    },
    span: () => {
      const span = this.span()
      return this.logs.length > 10 && span.from && span.to ? `<li>${this.name.toTitleCase().toLink()} ${span.from}—${span.to}</li>` : ''
    },
    date: (id, arr) => {
      return `${arr[id - 1] && this.time.y !== arr[id - 1].time.y ? `<li class='head'>20${this.time.y}</li>` : ''}<li style='${this.time.offset > 0 ? 'color:#aaa' : ''}'>${this.term.toLink(this.name)} <span title='${this.time}'>${this.time.offset > -99 ? timeAgo(this.time.offset, 60) : this.time}</span></li>`
    }
  }

  this.body = () => {
    return 'Unformatted entry.'
  }

  this.toString = function () {
    return `<div class='error'>${this.body()}</div>`
  }
}

// Log

function Log (data = { code: '-400' }) {
  Entry.call(this, data.name, data)

  this.term = data.term.toTitleCase()
  this.time = data.date ? new Arvelie(data.date) : null
  this.pict = data.pict ? data.pict : null
  this.bref = `A log added on ${this.time} to ${this.term.toLink()}.`
  this.indexes = data.name && this.pict ? [data.name, `${this.pict}`, `${this.time}`] : []
  this.theme = 'noir'

  // Map
  this.host = null

  this.rune = data.code.length > 0 ? data.code.substr(0, 1) : '-'
  this.sc = data.code.length > 1 ? parseInt(data.code.substr(1, 1)) : 0
  this.ch = data.code.length > 2 ? parseInt(data.code.substr(2, 1)) : 0
  this.fh = data.code.length > 3 ? parseInt(data.code.substr(3, 1)) : 0

  this.sector = ['misc', 'audio', 'visual', 'research'][this.sc]
  this.featured = this.pict && (this.rune === '!' || this.rune === '+')
  this.isEvent = this.rune === '+'

  this.photo = () => {
    return this
  }

  this.task = () => {
    const tasks = [
      ['idle', 'session', 'audio experiment', 'rehearsal', 'draft', 'composition', 'sound design', 'mastering', 'audio release', 'performance'],
      ['idle', 'screening', 'visual experiment', 'storyboard', 'sketch', 'editing', 'graphic design', 'rendering', 'visual release', 'showcase'],
      ['idle', 'documentation', 'code experiment', 'planning', 'maintenance', 'prototype', 'interaction design', 'updating', 'software release', 'talk']
    ]
    return tasks[this.sc - 1] ? tasks[this.sc - 1][this.ch] : 'travel'
  }

  this.body = () => {
    return this.host ? `
    <div class='entry log ${this.isEvent ? 'event' : ''}'>
      ${this.templates.icon()}
      <div class='head'>
        <div class='details'>${this.term.toLink(this.term, 'topic')} ${this.name && !this.isEvent ? ` — <span class='name' data-goto='${this.name}'>${this.name}</span>` : ''} <span class='time' data-goto='${this.time}'><b>${this.task().toTitleCase()}</b>, ${timeAgo(this.time.offset, 14)}</span></div>
        <div class='bref'>${this.isEvent ? this.name : this.host ? this.host.bref.template(this.host) : ''}</div>
      </div>
      ${this.pict ? `<img src='media/diary/${this.pict}.jpg' data-goto='${this.term}' loading='lazy'/>` : ''}
    </div>` : ''
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
  if (this.sc > 3) { console.warn('Log', `Unknown code: ${data.code}, on ${this.time}.`) }
  if (this.sc === 0 && (this.fh > 0 || this.ch > 0)) { console.warn('Log', `Empty code: ${data.code}, on ${this.time}.`) }
  if (!this.data.term) { console.warn('Log', `Missing term from lexicon, on ${time.time}.`) }
}

// Term

function Term (name, data) {
  Entry.call(this, name, data)

  this.data = data
  this.bref = data.BREF ? data.BREF : ''
  this.unde = data.UNDE ? data.UNDE : 'Home'
  this.view = data.VIEW ? data.VIEW.toLowerCase() : 'main'
  this.links = data.LINK ? data.LINK : {}
  this.tags = data.TAGS ? data.TAGS.toLowerCase().split(' ') : []
  this.indexes = data.ALTS ? [name].concat(data.ALTS.split(' ')) : [name]
  this.theme = data.LOOK ? data.LOOK.toLowerCase() : 'blanc'
  this.isPortal = this.tags.indexOf('portal') > -1

  // Map
  this.host = this
  this.parent = null
  this.children = []
  this.logs = []

  this.glyph = () => {
    if (this.data.ICON) { return this.data.ICON }
    if (this.parent.glyph()) { return this.parent.glyph() }
    if (this.portal().glyph()) { return this.portal().glyph() }
    return null
  }

  this.diaries = () => {
    return this.logs.filter(__onlyDiaries)
  }

  this.events = () => {
    return this.logs.filter(__onlyEvents)
  }

  this.activity = () => {
    return sortLogs(this.children.reduce((acc, term) => {
      return acc.concat(term.logs)
    }, this.logs))
  }

  this.span = () => {
    const h = { from: null, to: null }
    for (const log of this.logs) {
      if (!h.from || log.time.offset < h.from.offset) {
        h.from = log.time
      }
      if (!h.to || log.time.to > h.from.to) {
        h.to = log.time
      }
    }
    return h
  }

  this.photo = () => {
    const diaries = this.diaries()
    for (const id in diaries) {
      const diary = diaries[id]
      if (diary.featured === true && diary.time.offset <= 0) {
        return diaries[id]
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

  this.body = () => {
    return `${runic.run(this.data.BODY, this)}`
  }

  this.toEntry = () => {
    const h = new Horaire(this.activity())
    const links = (this.links.SOURCES ? `<a href='${this.links.SOURCES}'>Sources</a>` : '<a class=\'inactive\'>no sources</a>')

    return `<div class='entry'>
      ${this.templates.icon()}
      <div class='head'>
        <div class='details'>
          ${this.name.toTitleCase().toLink()}
          <span class='time'><b>${h.length} logs</b>, updated ${this.span().to.ago()}</span>
          <span class='links'>
            ${(this.links.SOURCES ? `<a class='bg_audio' target='_blank' href='${this.links.SOURCES}'>Sources</a>` : '<a class=\'bg_misc\'>no sources</a>')}
            ${(this.links.BUILDS ? `<a class='bg_visual' target='_blank' href='${this.links.BUILDS}'>Builds</a>` : '<a class=\'bg_misc\'>no builds</a>')}
            ${(this.links.LIVE ? `<a class='bg_research' target='_blank' href='${this.links.LIVE}'>Live</a>` : '<a class=\'bg_misc\'>no live</a>')}
          </span>
        </div>
        <div class='bref'>${new HoraireViz(this.activity()).toString(200, 40)}</div>
      </div>
    </div>`
  }

  this.toString = (photo = false) => {
    return `<h2>${this.name.toTitleCase()}</h2><h4>${this.bref.template(this)}</h4>${photo === true ? this.templates.photo() : ''}${this.body()}`
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
  this.childspeak = data.name.toLowerCase()
  this.type = this.childspeak.substr(0, 2)
  this.key = this.childspeak.substr(0, this.childspeak.length - 2)
  this.indexes = [this.name]
  this.bref = '??'

  this.glyph = () => {
    return 'M65,155 L65,155 L155,155 M155,65 L155,65 L155,245 M185,155 L185,155 L245,155 M185,185 L185,185 L185,185'
  }

  this.body = function () {
    return `${data.name} is a Lietal word.`
  }

  this.toString = function () {
    return `<p>${this.body()}</p>`
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
