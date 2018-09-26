'use strict';

function IndexTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240"

  function _format(name,entry)
  {
    return `<li>{${name.capitalize()}(${name.to_alphanum()})} ${entry.host ? ' — '+entry.host.name.capitalize() : ''}</li>`
  }

  this.answer = function(q)
  {
    let entries = Ø('database').index
    let sortable = Object.keys(entries).sort();

    let prev = ""
    let html = ""
    for(let id in sortable){
      let entry = sortable[id];
      let lead = entry.substr(0,1)
      if(parseInt(lead) > 0){ continue; }
      if(!entry.to_alpha()){ continue; }
      if(!entries[entry].index){ continue; }
      if(prev != lead){
        html += `<li class='head'>${lead}</li>`
      }
      html += _format(entry,entries[entry]);
      prev = lead
    }
    return `<p>The {*Wiki*} contains ${sortable.length} entries.</p><ul>${html}</ul>`.to_curlic()
  }
}