'use strict'

function List (name, data) {
  Entry.call(this, name, data)

  this.bref = `The ${this.name.toTitleCase().toLink()} word list.`
  this.unde = 'Mirrors'
  this.indexes = [name].concat(Object.keys(data))

  this.body = () => {
    return `<ul>${Object.keys(this.data).reduce((acc, val) => {
      return `${acc}<li><b>${val.toTitleCase()}</b>: ${this.data[val].isUrl() ? this.data[val].toLink() : this.data[val].template(this.data[val])}</li>`
    }, '')}</ul>`
  }

  this.toString = (q) => {
    return `<h3>${name.toTitleCase()}</h3>${this.body()}`
  }
}
