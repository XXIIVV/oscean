function DefaultTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.answer = function(q)
  {
    if(!q.result){ return this.signal('missing').answer(q) }

    var html = ""

    html += q.result.long(q.tables);
    html += q.result.has_tag("diary") ? this._diary(q) : ''
    html += q.result.has_tag("index") ? this._index(q) : ''
    html += q.result.has_tag("list") ? this._list(q) : ''

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
      ${child.featured_log ? `<a onclick='Ø("query").bang("${child.name}")'><img src="media/diary/${child.featured_log.photo}.jpg"/></a><hs>${child.bref().to_markup()}</hs>` : `<h2>${child.name.capitalize()}</h2><hs>${child.bref()}</hs>`.to_markup()}
      ${child.long(q.tables)}`
    }
    return html
  }

  this._list = function(q)
  {
    var html = q.tables.glossary[q.result.name] ? `${q.tables.glossary[q.result.name]}` : ''

    for(var id in q.result.tags){
      var tag = q.result.tags[id].toUpperCase();
      html += q.tables.glossary[tag] ? `<h3>${tag.capitalize()}</h3>${q.tables.glossary[tag]}` : ''
    }

    return html;
  }
}