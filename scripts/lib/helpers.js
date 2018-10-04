'use strict'

String.prototype.replace_all = function (search, replacement) { return `${this}`.split(search).join(replacement) }
String.prototype.capitalize = function () { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() }
String.prototype.to_url = function () { return this.toLowerCase().replace(/ /g, '+').replace(/[^0-9a-z\+\:\-\.\/]/gi, '').trim() }
String.prototype.to_path = function () { return this.toLowerCase().replace(/\+/g, '.').replace(/ /g, '.').replace(/[^0-9a-z\.\-]/gi, '').trim() }
String.prototype.to_entities = function () { return this.replace(/[\u00A0-\u9999<>\&]/gim, function (i) { return `&#${i.charCodeAt(0)}` }) }
String.prototype.to_rss = function () { return this.replace(/\</g, '&lt;').replace(/\>/g, '&gt;') }
String.prototype.to_alpha = function () { return this.replace(/[^a-z ]/gi, '').trim() }
String.prototype.to_alphanum = function () { return this.replace(/[^0-9a-z ]/gi, '') }
String.prototype.count = function (c) { let r = 0; for (let i; i < this.length; i++) if (this[i] === c) r++; return r }
