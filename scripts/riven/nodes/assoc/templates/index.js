function IndexTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element

  function _format(name,entry)
  {
    return `<ln>{${name.capitalize()}(${name.to_alphanum()})} ${entry.host ? ' — '+entry.host.name.capitalize() : ''}</ln>`
  }

  this.answer = function(q)
  {
    var entries = Ø('database').index
    var sortable = Object.keys(entries).sort();

    var prev = ""
    var html = ""
    for(id in sortable){
      var entry = sortable[id];
      var lead = entry.substr(0,1)
      if(parseInt(lead) > 0){ continue; }
      if(!entry.to_alpha()){ continue; }
      if(prev != lead){
        html += `<ln class='head'>${lead}</ln>`
      }
      html += _format(entry,entries[entry]);
      prev = lead
    }
    return `<p>The {*Wiki*} contains ${sortable.length} searchable terms.</p><list class='tidy'>${html}</list>`.to_curlic()
  }
}