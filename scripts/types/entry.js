'use strict'

function Entry (name, data) {
  this.name = name
  this.data = data
  this.unde = 'Home'
  this.bref = '-'

  this.view = 'main'
  this.theme = 'noir'

  this.indexes = [this.name]
  this.outgoing = [] // From Ø('map')
  this.incoming = [] // From Ø('map')

  this.span = { from: null, to: null }
  this.issues = []
  this.logs = []
  this.diaries = []
  this.events = []
  this.tags = []

  this.activity = function () {
    return []
  }

  this.body = function () {
    return `Unformatted Entry: ${name}`
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

  this.hasTag = function () {
    return false
  }

  this.photo = function () {
    return null
  }

  this.hasTag = function (str) {
    const target = str.toLowerCase().replace(/ /g, '_').trim()
    return this.tags.indexOf(target) > -1
  }

  this.validate = function () {

  }

  this.toString = function () {
    return `<div class='error'>${this.body()}</div>`
  }
}
