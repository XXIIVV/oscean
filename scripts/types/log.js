'use strict'

function Log (data = { code: '-400' }) {
  Entry.call(this, data.name, data)

  this.host = null // From Ø('map')

  this.term = data.term ? data.term.toTitleCase() : ''
  this.text = data.text
  this.time = data.date ? new Arvelie(data.date) : null
  this.pict = data.pict ? parseInt(data.pict) : null
  this.bref = `A log added on {${this.time}(Calendar)} to {(${this.term})}.`
  this.indexes = data.name && this.pict ? [data.name, `${this.pict}`, `${this.time}`] : [`${this.time}`]
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
    ['idle', 'screening', 'visual experiment', 'storyboard', 'prototype', 'editing', 'graphic design', 'rendering', 'visual release', 'showcase' ],
    ['idle', 'research', 'code experiment', 'documentation', 'planning', 'maintenance', 'interaction design', 'updating', 'software release', 'talk' ]
  ]
  this.task = this.tasks[this.sc - 1] ? this.tasks[this.sc - 1][this.ch] : 'travel'

  this.photo = function () {
    return parseInt(data.pict)
  }

  this.body = function () {
    return this.host ? `
    <div class='entry log ${this.isEvent ? 'event' : ''}'>
      <svg data-goto='${this.host.name}' class='icon'><path transform="scale(0.15,0.15) translate(20,20)" d="${this.host ? this.host.glyph() : ''}"></path></svg>
      <div class='head'>
        <div class='details'><a class='topic' data-goto='${this.term}' href='${this.term.toUrl()}'>${this.term}</a> ${this.name && !this.isEvent ? ` — <span class='name' data-goto='${this.name}'>${this.name}</span>` : ''} <span class='time' data-goto='${this.time}'>${timeAgo(this.time, 14)}</span></div>
        <div class='bref'>${this.isEvent ? this.name : this.host ? this.host.bref.toCurlic() : ''}</div>
      </div>
      ${this.pict ? `<img src='media/diary/${this.pict}.jpg' data-goto='${this.term}'/>` : ''}
    </div>` : ''
  }

  this.toString = function () {
    return this.body()
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
}
