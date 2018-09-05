'use strict';

function DefaultTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240"
  
  this.answer = function(q)
  {
    if(q.target == "index"){ return this.signal('index').answer(q) }
    if(!q.result){ return this.signal('missing').answer(q) }

    let html = `${q.result}`

    html += q.result.has_tag("children") ? this._children(q) : ''
    html += q.result.has_tag("diary") || q.params == "diary" ? this._diary(q) : ''
    html += q.result.has_tag("index") ? this._index(q) : ''
    html += q.result.has_tag("list") ? this._list(q) : ''
    html += q.result.has_tag("glossary") ? this._glossary(q) : ''

    return html
  }

  this._diary = function(q)
  {
    let html = ""
    let term = q.result;
    let skip = term.featured_log

    for(let id in term.diaries){
      let log = term.diaries[id]
      if(skip && log.photo == skip.photo){ continue; }
      html += `<img src='media/diary/${log.photo}.jpg'/>`
    }

    return html
  }

  this._index = function(q)
  {
    let html = ""
    let term = q.result;

    for(let id in term.children){
      let child = term.children[id];
      html += `
      <h2>${child.name.capitalize()}</h2>
      <hs>${child.bref.to_curlic()}</hs>
      ${child.featured_log ? `<a data-goto='${child.name}'><img src="media/diary/${child.featured_log.photo}.jpg"/></a>` : ''}
      ${child}`
    }
    return html
  }

  this._list = function(q)
  {
    let target = q.result.name.toUpperCase();
    let html = q.tables.glossary[target] ? `${q.tables.glossary[target]}` : ''

    for(let id in q.result.tags){
      let tag = q.result.tags[id].toUpperCase().replace(/_/g,' ').trim();
      html += q.tables.glossary[tag] ? `<h3>{(${tag.capitalize()})}</h3>${q.tables.glossary[tag]}`.to_curlic() : ''
    }

    return html;
  }

  this._glossary = function(q)
  {
    let html = ""
    let words = Object.keys(q.tables.glossary).sort();
    for(let id in words){
      let name = words[id]
      let word = q.tables.glossary[name]
      let children = Object.keys(word.data)
      html += `<ln>{(${name.capitalize()})} — ${children.length} items</ln>`
    }
    return `<h2>{(Glossary)}</h2><list class='tidy' style='padding-left:30px'>${html}</list>`.to_curlic()
  }

  this._children = function(q)
  {
    let html = ""

    for(let id in q.result.children){
      let term = q.result.children[id]
      html += `<ln>{(${term.name.capitalize()})}: ${term.bref}</ln>`
    }
    return `<list>${html}</list>`.to_curlic();
  }
}