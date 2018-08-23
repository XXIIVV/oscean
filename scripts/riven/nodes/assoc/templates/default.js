function DefaultTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.answer = function(q)
  {
    if(q.target.toLowerCase() == "index"){ return this.signal('index').answer(q) }
    if(!q.result){ return this.signal('missing').answer(q) }

    var html = `${q.result}`

    html += q.result.has_tag("children") ? this._children(q) : ''
    html += q.result.has_tag("diary") || q.params == "diary" ? this._diary(q) : ''
    html += q.result.has_tag("index") ? this._index(q) : ''
    html += q.result.has_tag("list") ? this._list(q) : ''
    html += q.result.has_tag("glossary") ? this._glossary(q) : ''

    return html
  }

  this._diary = function(q)
  {
    var html = ""
    var term = q.result;
    var skip = term.featured_log

    for(id in term.diaries){
      var log = term.diaries[id]
      if(skip && log.photo == skip.photo){ continue; }
      html += `<img src='media/diary/${log.photo}.jpg'/>`
    }

    return html
  }

  this._index = function(q)
  {
    var html = ""
    var term = q.result;

    for(id in term.children){
      var child = term.children[id];
      html += `
      <h2>${child.name.capitalize()}</h2>
      <hs>${child.bref.to_curlic()}</hs>
      ${child.featured_log ? `<a onclick='Ø("query").bang("${child.name}")'><img src="media/diary/${child.featured_log.photo}.jpg"/></a>` : ''}
      ${child}`
    }
    return html
  }

  this._list = function(q)
  {
    var target = q.result.name.toUpperCase();
    var html = q.tables.glossary[target] ? `${q.tables.glossary[target]}` : ''

    for(var id in q.result.tags){
      var tag = q.result.tags[id].toUpperCase().replace(/_/g,' ').trim();
      html += q.tables.glossary[tag] ? `<h3>{(${tag.capitalize()})}</h3>${q.tables.glossary[tag]}`.to_curlic() : ''
    }

    return html;
  }

  this._glossary = function(q)
  {
    var html = ""
    var words = Object.keys(q.tables.glossary).sort();
    for(var id in words){
      var name = words[id]
      var word = q.tables.glossary[name]
      var children = Object.keys(word.data)
      html += `<ln>{(${name.capitalize()})} — ${children.length} items</ln>`
    }
    return `<h2>{(Glossary)}</h2><list class='tidy' style='padding-left:30px'>${html}</list>`.to_curlic()
  }

  this._children = function(q)
  {
    var html = ""

    for(id in q.result.children){
      var term = q.result.children[id]
      html += `<ln>{(${term.name.capitalize()})}: ${term.bref}</ln>`
    }
    return `<list>${html}</list>`.to_curlic();
  }
}