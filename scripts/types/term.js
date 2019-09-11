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
  this.bref = data.BREF ? data.BREF.template(this) : ''
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
