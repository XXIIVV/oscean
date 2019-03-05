'use strict'

function Issue (name, data = {}) {
  Entry.call(this, name, data)

  this.host = null // From Ø('map')

  this.name = name
  this.projects = data
  this.indexes = []
  this.theme = 'noir'

  this.unwrap = function () {
    const a = []
    for (const id in this.projects) {
      a.push(new Issue(id, this.projects[id]))
    }
    return a
  }

  this.body = function () {
    if (!this.host) { return '' }
    return `
    <div class='entry issue'>
      <svg data-goto='${this.host.name}' class='icon'><path transform="scale(0.15,0.15) translate(20,20)" d="${this.host ? this.host.glyph() : ''}"></path></svg>
      <div class='head'>
        <div class='details'>${this.host.name.toLink(this.host.name.toTitleCase(), 'topic')} ${this.name ? ` — <span class='name' data-goto='${this.name}'>${this.name.toTitleCase()}</span>` : ''} <span class='time' data-goto='${this.host.name}:Journal'>${this.projects.length} Tasks</span></div>
        <div class='bref'>${this.isEvent ? this.name : this.host ? this.host.bref.toHeol(this.host) : ''}</div>
      </div>
      <ul>
        ${this.projects.reduce((acc, task) => { return `${acc}<li>${task}</li>` }, '')}
      </ul>
    </div>`
  }

  this.toString = function () {
    return this.body()
  }
}
