function IndexTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element

  function _format(name,sources)
  {
    return `<ln>{${name.capitalize()}(${sources[0]})} ${sources[0].toLowerCase() != name.toLowerCase() ? ' — '+sources[0] : ''}</ln>`
  }

  this.answer = function(q)
  {
    console.log(q)
    return "?"
    var entries = this.collect(q);

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