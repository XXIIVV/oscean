'use strict'

function Issue (data = {}) {
  Entry.call(this, data.name, data)

  this.host = null // From Ø('map')

  this.term = data.term
  this.category = data.category
  this.indexes = [this.category]

  this.sc = data.code.length === 2 ? parseInt(data.code.substr(0, 1)) : 0
  this.ch = data.code.length === 2 ? parseInt(data.code.substr(1, 1)) : 0
  this.sector = ['misc', 'audio', 'visual', 'research', 'misc'][this.sc]

  this.tasks = [
    ['idle', 'listening', 'experiment', 'rehersal', 'draft', 'composition', 'sound design', 'mastering', 'release', 'performance' ],
    ['idle', 'watching', 'experiment', 'storyboard', 'prototype', 'editing', 'design', 'rendering', 'release', 'showcase' ],
    ['idle', 'research', 'experiment', 'documentation', 'planning', 'maintenance', 'tooling', 'updating', 'release', 'talk' ]
  ]
  this.task = this.tasks[this.sc - 1] ? this.tasks[this.sc - 1][this.ch] : 'travel'

  this.body = function () {
    return `${this.name}`
  }

  this.toString = function () {
    return `<div class='entry issue ${this.sector}'><b>${this.category}</b> <i>${this.task}</i> ${this.name}</div>`
  }
}
