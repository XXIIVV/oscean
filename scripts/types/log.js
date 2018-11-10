'use strict'

function Log (data = { code: '-400' }) {
  Entry.call(this, data.name, data)

  this.host = null // From Ø('map')

  this.term = data.term ? data.term.toCapitalCase() : ''
  this.text = data.text
  this.time = data.date ? new Desamber(data.date) : null
  this.photo = data.pict ? parseInt(data.pict) : null
  this.bref = `A log added on {${this.time}(Calendar)} to {(${this.term})}.`
  this.indexes = data.name && this.photo ? [data.name, `${this.photo}`] : []

  this.rune = data.code.length === 4 ? data.code.substr(0, 1) : '-'
  this.sc = data.code.length === 4 ? parseInt(data.code.substr(1, 1)) : 0
  this.ch = data.code.length === 4 ? parseInt(data.code.substr(2, 1)) : 0
  this.fh = data.code.length === 4 ? parseInt(data.code.substr(3, 1)) : 0

  this.sector = ['misc', 'audio', 'visual', 'research', 'misc'][this.sc]
  this.isFeatured = this.photo && (this.rune === '!' || this.rune === '+')
  this.isEvent = this.rune === '+' || this.vector >= 8

  this.tasks = [
    ['idle', 'listening', 'experiment', 'rehersal', 'draft', 'composition', 'sound design', 'mastering', 'release', 'performance' ],
    ['idle', 'watching', 'experiment', 'storyboard', 'prototype', 'editing', 'design', 'rendering', 'release', 'showcase' ],
    ['idle', 'research', 'experiment', 'documentation', 'planning', 'maintenance', 'tooling', 'updating', 'release', 'talk' ]
  ]
  this.task = this.tasks[this.sc - 1] ? this.tasks[this.sc - 1][this.ch] : 'travel'

  this.body = function () {
    return `
    <div class='entry log ${this.isEvent ? 'event' : ''}'>
      <svg data-goto='${this.term}' class='icon'><path transform="scale(0.15,0.15) translate(20,20)" d="${this.host ? this.host.glyph() : ''}"></path></svg>
      <div class='head'>
        <div class='details'><a class='topic' data-goto='${this.term}' href='${this.term.toUrl()}'>${this.term}</a> ${this.name && !this.isEvent ? ` — <span class='name' data-goto='${this.name}'>${this.name}</span>` : ''} <span class='time' data-goto='${this.term}:Journal'>${timeAgo(this.time, 14)}</span></div>
        <div class='bref'>${this.isEvent ? this.name : this.host ? this.host.bref.toCurlic() : ''}</div>
      </div>
      ${this.photo ? `<img src='media/diary/${this.photo}.jpg' data-goto='${this.term}'/>` : ''}
    </div>`
  }

  this.toString = function () {
    return this.body()
  }
}
