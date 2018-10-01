'use strict';

function DefaultTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240"
  
  this.answer = function(q)
  {
    if(q.target == "index"){ return this.signal('index').answer(q) }
    if(!q.result){ return this.signal('missing').answer(q) }

    let html = `${q.result.toString(q)}`

    html += q.result.has_tag("children") ? this._children(q.result) : ''
    html += q.result.has_tag("children_children") ? this._children_children(q.result) : ''
    html += q.result.has_tag("diary") || q.params == "diary" ? this._diary(q) : ''
    html += q.result.has_tag("index") ? this._index(q) : ''
    html += q.result.has_tag("list") ? this._list(q) : ''
    html += q.result.has_tag("glossary") ? this._glossary(q) : ''

    return html
  }

  this._diary = function(q)
  {
    let html = ""
    const term = q.result;
    const skip = term.featured_log

    for(const id in term.diaries){
      const log = term.diaries[id]
      if(skip && log.photo == skip.photo){ continue; }
      html += `<img src='media/diary/${log.photo}.jpg'/>`
    }

    return html
  }

  this._index = function(q)
  {
    let html = ""
    const term = q.result;

    for(const id in term.children){
      const child = term.children[id];
      html += `
      <h2>${child.name.capitalize()}</h2>
      <h4>${child.bref.to_curlic()}</h4>
      ${child.featured_log ? `<a data-goto='${child.name}'><img src="media/diary/${child.featured_log.photo}.jpg"/></a>` : ''}
      ${child}`
    }
    return html
  }

  this._list = function(q)
  {
    const target = q.result.name.toUpperCase();
    let html = q.tables.glossary[target] ? `${q.tables.glossary[target]}` : ''

    for(const id in q.result.tags){
      const tag = q.result.tags[id].toUpperCase().replace(/_/g,' ').trim();
      html += q.tables.glossary[tag] ? `<h3>{(${tag.capitalize()})}</h3>${q.tables.glossary[tag]}`.to_curlic() : ''
    }

    return html;
  }

  this._glossary = function(q)
  {
    let html = ""
    const words = Object.keys(q.tables.glossary).sort();
    for(const id in words){
      const name = words[id]
      const word = q.tables.glossary[name]
      const children = Object.keys(word.data)
      html += `<li>{(${name.capitalize()})} — ${children.length} items</li>`
    }
    return `<h2>{(Glossary)}</h2><ul class='tidy' style='padding-left:30px'>${html}</ul>`.to_curlic()
  }

  this._children = function(a)
  {
    let html = ""

    for(const id in a.children){
      const term = a.children[id]
      html += `<li>${term.bref}</li>`
    }
    return `<ul class='bullet'>${html}</ul>`.to_curlic();
  }

  this._children_children = function(q)
  {
    let html = ""

    for(const id in q.children){
      const term = q.children[id]
      html += `<h3>{(${term.name.capitalize()})}</h3>`
      html += `<p>${term.bref}</p>`
      html += this._children(term)
    }
    return `<ul>${html}</ul>`.to_curlic();
  }
}