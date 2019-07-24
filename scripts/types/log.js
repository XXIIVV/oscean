'use strict'

function Log (data = { code: '-400' }) {
  Entry.call(this, data.name, data)

  this.host = null // From Ø('map')

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
  this.isFeatured = this.pict && (this.rune === '!' || this.rune === '+')
  this.isEvent = this.rune === '+'

  this.tasks = [
    ['idle', 'session', 'audio experiment', 'rehersal', 'draft', 'composition', 'sound design', 'mastering', 'audio release', 'performance' ],
    ['idle', 'screening', 'visual experiment', 'storyboard', 'sketch', 'editing', 'graphic design', 'rendering', 'visual release', 'showcase' ],
    ['idle', 'exploration', 'code experiment', 'maintenance', 'prototype', 'planning', 'interaction design', 'updating', 'software release', 'talk' ]
  ]
  this.task = this.tasks[this.sc - 1] ? this.tasks[this.sc - 1][this.ch] : 'travel'

  this.photo = function () {
    return this
  }

  this.body = function () {
    return this.host ? `
    <div class='entry log ${this.isEvent ? 'event' : ''}'>
      <svg data-goto='${this.host.name}' class='icon'><path transform="scale(0.15) translate(20,20)" d="${this.host ? this.host.glyph() : ''}"></path></svg>
      <div class='head'>
        <div class='details'>${this.term.toLink(this.term, 'topic')} ${this.name && !this.isEvent ? ` — <span class='name' data-goto='${this.name}'>${this.name}</span>` : ''} <span class='time' data-goto='${this.time}'>${timeAgo(this.time, 14)}</span></div>
        <div class='bref'>${this.isEvent ? this.name : this.host ? this.host.bref.toHeol(this.host) : ''}</div>
      </div>
      ${this.pict ? `<img src='media/diary/${this.pict}.jpg' data-goto='${this.term}'/>` : ''}
    </div>` : ''
  }

  this.toText = function () {
    if (this.isEvent && this.name !== '') {
      return `${this.name}`
    }
    if (this.pict && this.name !== '') {
      return `${this.term} ${this.host.parent.name.toTitleCase()} — \"${this.name}\"`
    }
    return `${this.term} ${this.host.parent.name.toTitleCase()} ${this.fh}fh ${this.task}`
  }

  this.toString = function () {
    return this.body()
  }

  // Checks

  if (this.pict !== null && !this.name) { console.warn('Log', `Missing caption: ${this.time}`) }
  if (this.pict === null && this.rune === '!') { console.warn('Log', `Feature without picture: ${this.time}`) }
  if (['+', '-', '!'].indexOf(this.rune) < 0) { console.warn('Log', `Unknown rune: ${data.code}, on ${this.time}.`) }
  if (this.sc > 3 || this.sc === 0 && (this.fh > 0 || this.ch > 0)) { console.warn('Log', `Unknown code: ${data.code}, on ${this.time}.`) }
}
