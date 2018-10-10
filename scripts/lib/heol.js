'use strict'

function Heol (input, tables, host) {
  const lib = {
    match: function (source, items) {
      const filtered = items.filter((val) => { return source[val.toUpperCase()] })
      return filtered.map((val) => { return source[val.toUpperCase()] })
    },
    table: function (source) {
      return tables[source]
    },
    keys: function (h) {
      return Object.keys(h)
    },
    values: function (h) {
      return Object.values(h)
    },
    uniq: function (items) {
      return items.filter((value, index, self) => {
        return self.indexOf(value) === index
      })
    },
    attribute: function (a, name) {
      return a.map((val) => { return val[name] })
    },
    find: function (source, target) {
      return source[target.toUpperCase()] ? source[target.toUpperCase()] : ''
    },
    echo: function (items) {
      return items.reduce((acc, val) => {
        return `${acc}${val}`
      }, '')
    },
    wrap: function (item, tag, cl) {
      return `<${tag} class='${cl || ''}'>${item}</${tag}>`
    },
    // will modify properties or run a function onto each object.
    map: function (arr, fn) {
      return arr.map((val, id, arr) => fn)
    },
    // will only keeps elements returning true.
    filter: function (arr, fn) {
      return arr.map((val, id, arr) => fn)
    },
    // will reduce it into a single value.
    reduce: function (arr, fn, acc) {
      return arr.reduce((acc, val, id, arr) => fn, acc)
    },
    // Templaters
    template: function (items, t, p) {
      return items.map((val) => {
        return `${t(val, p)}`
      })
    },
    INDEX: function (item) {
      return `<h3>{(${item.name.capitalize()})}</h3><p>${item.bref}</p><ul class='bullet'>${item.children.reduce((acc, term) => {
        return `${acc}<li>${term.bref}</li>`
      }, '')}</ul>`
    },
    LINK: function (item) {
      return `{(${item.capitalize()})}`
    },
    TITLE: function (item) {
      return `<h2>${item.name.capitalize()}</h2><h4>${item.bref}</h4>`
    },
    PHOTO: function (item) {
      return host.featuredLog && host.featuredLog.photo !== item.photo ? `<img src="media/diary/${item.photo}.jpg"/>` : ''
    },
    GALLERY: function (item) {
      return `${item.featuredLog ? `<a data-goto='${item.name}'><img src="media/diary/${item.featuredLog.photo}.jpg"/></a>` : ''}<h2>${item.name.capitalize()}</h2><h4>${item.bref}</h4>`
    },
    SPAN: function (item) {
      return item.logs.length > 10 && item.span.from && item.span.to ? `<li>{(${item.name.capitalize()})} ${item.span.from}—${item.span.to}</li>`.to_curlic() : ''
    },

    log: function (item) {
      console.log(item)
      return 'hey'
    }
  }

  Lisp.call(this, input, lib, tables, host)
}
