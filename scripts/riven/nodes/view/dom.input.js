'use strict'

RIVEN.lib.Input = function InputNode (id, rect, ...params) {
  RIVEN.lib.Dom.call(this, id, rect, ...params)

  this.el = document.createElement('input')
  this.el.id = this.id
  this.isInstalled = false
  this.el.setAttribute('spellcheck', false)

  this.el.addEventListener('keydown', (e) => { this.onInput(e) })
  this.el.addEventListener('focus', () => { this.txt = this.el.value; this.el.value = '' })
  this.el.addEventListener('blur', () => { this.el.value = this.txt ? this.txt : window.location.hash.replace('#', '').trim() })

  this.onInput = function (e) {
    const target = this.el.value.toUrl()
    if (Ø('database').find(target)) {
      this.addClass('known')
    } else {
      this.removeClass('known')
    }
    // Shortcuts
    if (e.key === 'Enter') {
      this.validate(target)
    }
    if (e.key === 'Escape') {
      Ø('terminal').removeClass('active')
    }
  }

  this.validate = function (target) {
    if (target.substr(0, 1) === '~') {
      Ø('terminal').bang(target)
    } else {
      Ø('query').bang(target)
    }
  }

  this.update = function (content) {
    if (typeof content === 'string') {
      this.el.value = content.toTitleCase()
    }
  }
}
