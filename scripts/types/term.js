'use strict'

function Term (name, data) {
  Entry.call(this, name, data)

  this.parent = null // From Ø('map')
  this.children = [] // From Ø('map')
  this.logs = [] // From Ø('map')
  this.issues = [] // From Ø('map')
  this.diaries = [] // From Ø('map')
  this.span = { from: null, to: null }

  this.data = data
  this.bref = data.BREF ? data.BREF : ''
  this.unde = data.UNDE ? data.UNDE : 'Home'
  this.view = data.VIEW ? data.VIEW.toLowerCase() : 'main'
  this.theme = data.LOOK ? data.LOOK : null
  this.links = data.LINK ? data.LINK : null
  this.tags = data.TAGS ? data.TAGS.toLowerCase().split(' ') : []
  this.indexes = data.ALTS ? [name].concat(data.ALTS.split(' ')) : [name]
  this.theme = data.LOOK ? data.LOOK.toLowerCase() : 'blanc'
  this.isPortal = this.tags.indexOf('portal') > -1

  this.glyph = function () {
    if (this.data.ICON) { return this.data.ICON }
    if (this.parent.glyph()) { return this.parent.glyph() }
    if (this.portal().glyph()) { return this.portal().glyph() }
    return null
  }

  this.photo = function () {
    const diaries = name === 'HOME' ? Ø('horaire').cache : this.diaries
    for (const id in diaries) {
      const diary = diaries[id]
      if (diary.isFeatured === true && diary.time.offset <= 0) {
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

  this.portal = function () {
    if (this.isPortal) { return this }
    if (this.parent.isPortal) { return this.parent }
    if (this.parent.parent.isPortal) { return this.parent.parent }
    if (this.parent.parent.parent.isPortal) { return this.parent.parent.parent }
    if (this.parent.parent.parent.parent.isPortal) { return this.parent.parent.parent.parent }
    return null
  }

  this.activity = function () {
    return sortLogs(this.children.reduce((acc, term) => { return acc.concat(term.logs) }, this.logs))
  }

  this.rating = function () {
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

  this._photo = function () {
    return this.photo() ? this.name.toLink(`<img src="media/diary/${this.photo().pict}.jpg"/>`) : ''
  }

  this.outgoing = function () {
    const body = [this.data.BREF].concat(this.data.BODY).join('')
    const links = body.split('{(link "').map((item) => { return item.split('"')[0].toUpperCase() })
    links.shift()
    return links.filter((item) => { return item.indexOf('HTTP') < 0 })
  }

  this.toString = function (photo = false) {
    return `<h2>${this.name.toTitleCase()}</h2><h4>${this.bref}</h4>${photo === true ? this._photo() : ''}${this.body()}`
  }

  // Checks

  if (!this.data.UNDE) { console.warn('Term', `Missing .UNDE, for ${this.name}.`) }
  if (!this.data.BREF) { console.warn('Term', `Missing .BREF, for ${this.name}.`) }
  if (!this.data.BODY) { console.warn('Term', `Missing .BODY, for ${this.name}.`) }
  if (this.data.BREF && this.data.BREF.indexOf('{(link)}') < 0) { console.warn('Term', `Missing self-reference, for ${this.name}.`) }
}
