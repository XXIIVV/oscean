'use strict'

function List (name, data) {
  Entry.call(this, name, data)

  this.bref = `The {(${this.name.capitalize()})} word list.`
  this.unde = 'Glossary'
  this.indexes = [name].concat(Object.keys(data))

  this.body = function () {
    return `<ul>${Object.keys(this.data).reduce((acc, val) => {
      return `${acc}<li>{*${val.capitalize()}*}: ${this.data[val]}</li>`
    }, '')}</ul>`.to_curlic()
  }

  this.toString = function (q) {
    return `<h3>${name.capitalize()}</h3>${this.body()}`
  }
}
