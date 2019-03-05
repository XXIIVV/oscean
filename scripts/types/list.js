'use strict'

function List (name, data) {
  Entry.call(this, name, data)

  this.bref = `The ${this.name.toTitleCase().toLink()} word list.`
  this.unde = 'Mirrors'
  this.indexes = [name].concat(Object.keys(data))

  this.body = function () {
    return `<ul>${Object.keys(this.data).reduce((acc, val) => {
      return `${acc}<li><b>${val.toTitleCase()}</b>: ${this.data[val].toHeol(this.data[val])}</li>`
    }, '')}</ul>`
  }

  this.toString = function (q) {
    return `<h3>${name.toTitleCase()}</h3>${this.body()}`
  }
}
