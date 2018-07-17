function IndexTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.answer = function(q)
  {
    var term = q.result;
    var html = `${term.long(q.tables)}`

    for(id in term.children){
      var child = term.children[id];
      html += `
      ${child.featured_log ? `<a onclick='Ø("query").bang("${child.name}")'><img src="media/diary/${child.featured_log.photo}.jpg"/></a><hs>— ${child.bref().to_markup()}</hs>` : `<h2>${child.name.capitalize()}</h2><hs>${child.bref()}</hs>`.to_markup()}
      ${child.long(q.tables)}
      <quote>${!stop ? this.make_index(child,true) : ''}</quote>`
    }
    return html
  }
}