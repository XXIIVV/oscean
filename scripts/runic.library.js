'use strict'

/* global lain */

const runicLibrary = {
  '>': { },
  '*': { tag: 'h3' },
  '+': { tag: 'h4' },
  '?': {
    tag: 'div',
    class: 'notice',
    fn: (html, host) => {
      return html.template(host)
    }
  },
  '-': {
    tag: 'li',
    wrapper: 'ul',
    wrapperClass: 'bullet',
    fn: (html, host) => {
      return html.template(host)
    }
  },
  '#': {
    tag: 'li',
    wrapper: 'code',
    fn: (html, host) => {
      return html.template(host)
    }
  },
  '&': {
    tag: 'p',
    fn: (html, host) => {
      return html.template(host)
    }
  },
  ';': {
    fn: (html, host) => {
      console.log(html)
      return ''
    }
  },
  '@': {
    tag: 'div',
    class: 'quote',
    fn: (html, host) => {
      const parts = html.split(' | ')
      const text = parts[0].trim()
      const author = parts[1]
      const source = parts[2]
      const link = parts[3]
      return `
      ${text.length > 1 ? `<p class='text'>${text.template(this.host)}</p>` : ''}
      ${author ? `<p class='attrib'>${author}${source && link ? `, ${link.toLink(source)}` : source ? `, <b>${source}</b>` : ''}</p>` : ''}`
    }
  },
  '|': {
    tag: 'tr',
    wrapper: 'table',
    fn: (html, host) => {
      return `<td>${html.template(host).trim().replace(/ \| /g, '</td><td>')}</td>`
    }
  },
  '%': {
    fn: (html, host) => {
      const parts = html.split(' ')
      const service = parts[0]
      const id = parts[1]
      if (service === 'itchio') { return `<iframe frameborder="0" src="https://itch.io/embed/${id}?link_color=000000" width="600" height="167"></iframe>` }
      if (service === 'bandcamp') { return `<iframe style="border: 0; width: 600px; height: 274px;" src="https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=ffffff/linkcol=333333/artwork=small/transparent=true/" seamless></iframe>` }
      if (service === 'youtube') { return `<iframe width="100%" height="380" src="https://www.youtube.com/embed/${id}?rel=0" style="max-width:700px" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>` }
      if (service === 'custom') { return `<iframe src='${id}' style='width:100%;height:350px;'></iframe>` }
      return `<img src='media/${service}' loading='lazy' class='${id}'/>`
    }
  },
  λ: {
    fn: (html, host) => {
      return `${lain.run(html, host)}`
    }
  }
}
