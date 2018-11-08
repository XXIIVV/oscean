'use strict'

function Term (name, data) {
  Entry.call(this, name, data)

  this.parent = null // From Ø('map')
  this.children = [] // From Ø('map')
  this.logs = [] // From Ø('map')
  this.issues = [] // From Ø('map')
  this.diaries = [] // From Ø('map')
  this.span = { from: null, to: null }
  this.featuredLog = null // From Ø('map')

  this.data = data
  this.bref = data.BREF ? data.BREF : ''
  this.unde = data.UNDE ? data.UNDE : 'Home'
  this.view = data.VIEW ? data.VIEW.toLowerCase() : 'main'
  this.links = data.LINK ? data.LINK : {}
  this.tags = data.TAGS ? data.TAGS.toLowerCase().split(' ') : []
  this.indexes = data.ALTS ? [name].concat(data.ALTS.split(' ')) : [name]

  this.is_portal = this.tags.indexOf('portal') > -1

  this.glyph = function () {
    if (this.data.ICON) { return this.data.ICON }
    if (this.parent.glyph()) { return this.parent.glyph() }
    if (this.portal().glyph()) { return this.portal().glyph() }
    return null
  }

  this.portal = function () {
    if (this.is_portal) { return this }
    if (this.parent.is_portal) { return this.parent }
    if (this.parent.parent.is_portal) { return this.parent.parent }
    if (this.parent.parent.parent.is_portal) { return this.parent.parent.parent }
    if (this.parent.parent.parent.parent.is_portal) { return this.parent.parent.parent.parent }
    return null
  }

  this.rating = function () {
    const points = {
      body: this.data.BODY && this.data.BODY.length > 0,
      logs: this.logs.length > 0,
      children: this.children.length > 0,
      photo: this.diaries.length > 0,
      outgoing: this.outgoing && this.outgoing.length > 1,
      incoming: this.incoming && this.incoming.length > 1,
      glyph: this.glyph() !== '',
      issues: this.issues.length === 0,
      links: Object.keys(this.links).length > 0,
      tags: this.tags.length > 0
    }

    const score = Object.keys(points).reduce((acc, val) => { return acc + (points[val] ? 1 : 0) }, 0)
    return score / Object.keys(points).length
  }

  this.hasTag = function (str) {
    const target = str.toLowerCase().replace(/ /g, '_').trim()
    return this.tags.indexOf(target) > -1
  }

  this.sectors = function () {
    const h = new Horaire(this.logs).sectors
    const a = [['audio', h.audio], ['visual', h.visual], ['research', h.research]]

    return sort(a)
  }

  this.released = function () {
    for (const id in this.logs) {
      const log = this.logs[id]
      if (log.time.offset > 0) { continue }
      if (log.ch === 8) { return log }
    }
    return null
  }

  this.find_outgoing = function () {
    const a = []
    const str = this.data.BREF + (this.data.BODY ? this.data.BODY.join('\n') : '')

    let curlies = str.match(/[^{\}]+(?=})/g)

    if (!curlies) { return [] }

    curlies = curlies.filter(el => { return el.indexOf('(') > -1 })
    curlies = curlies.filter(el => { return el.indexOf('//') < 0 }) // Skip external
    curlies = curlies.filter(el => { return el.indexOf('[') < 0 }) // Skip evals

    curlies.forEach(el => {
      const name = el.split('(')[1].replace(')', '')
      if (el.substr(0, 1) !== 'λ') { a.push(name.toUpperCase()) }
    })
    return a
  }

  function sort (array) {
    return array.sort(function (a, b) {
      return a[1] - b[1]
    }).reverse()
  }

  this.body = function () {
    return `${runic(this.data.BODY, curlic, this)}`
  }

  this.toString = function () {
    return `<h2>${this.name.toCapitalCase()}</h2><h4>${this.bref}</h4>${this.body()}`
  }
}
