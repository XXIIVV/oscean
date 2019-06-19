'use strict'

RIVEN.lib.Photo = function PhotoNode (id, rect, ...params) {
  RIVEN.lib.Dom.call(this, id, rect)

  this.media = document.createElement('media')
  this.glyph = 'M60,90 L60,90 L60,60 L90,60 M210,60 L210,60 L240,60 L240,90 M240,210 L240,210 L240,240 L210,240 M90,240 L90,240 L60,240 L60,210 '

  this.install = function (elements) {
    this.isInstalled = true
    this.el.appendChild(this.media)

    for (const id in elements) {
      this.el.appendChild(elements[id])
    }
  }

  this.update = function (content) {
    if (content > 0) {
      isDark(`media/diary/${content}.jpg`, this.update_header)
      this.media.style.backgroundImage = `url(media/diary/${content}.jpg)`
      this.el.className = ''
    } else {
      this.el.className = 'empty'
      Ø('header').el.className = 'no_photo'
    }
  }

  this.update_header = function (v = true) {
    Ø('header').el.className = v ? 'dark' : 'light'
  }

  function diff (data, width, height) {
    let fuzzy = -0.4
    let r, g, b, max_rgb
    let light = 0; let dark = 0
    for (let x = 0, len = data.length; x < len; x += 4) {
      r = data[x]
      g = data[x + 1]
      b = data[x + 2]
      max_rgb = Math.max(Math.max(r, g), b)
      if (max_rgb < 128) { dark++ } else { light++ }
    }
    let dl_diff = ((light - dark) / (width * height))
    return dl_diff + fuzzy < 0
  }

  function isDark (imageSrc, callback, w = 200, h = 200) {
    const fuzzy = -0.4
    const img = document.createElement('img')
    img.src = imageSrc
    img.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(this, 0, 0, canvas.width, canvas.height)
      try {
        callback(diff(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height))
      } catch (err) { console.warn('Could not get photo data'); callback() }
    }
  }
}
