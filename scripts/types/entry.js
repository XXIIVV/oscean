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
  this.issues = []
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
    return this.bref ? `<p>${this.bref}</p>`.template() : `<p>The term {(bold "${name}")} could not be found.</p>`.template(this)
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

  this.hasTag = function () {
    return false
  }

  this.photo = function () {
    return null
  }

  this.horaire = () => {
    const h = new Horaire(this.activity())
    const v = new HoraireViz(this.activity())
    return this.span.to ? `<div class='horaire'><span><b class='bg_${h.sector}'>${'horaire'.toLink(h.ph.toFixed(2), 'horaire')}</b> ${this.name.toTitleCase().toLink()} <span class='date'>Updated ${this.span.to ? this.span.to.ago() : ''}</span></span> ${v}</div>` : ''
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
