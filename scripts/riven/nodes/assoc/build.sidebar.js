'use strict';

function BuildSidebarNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z"

  this.cache = null;

  this.answer = function(q)
  {
    if(!q.result){ return "<h1>The {(Nataniev)} Services Desk</h1><h2>{(Home)}</h2>".to_curlic(); }

    let html = ""
    
    for(const id in q.result.links){
      html += `<li><a href='${q.result.links[id]}' target='_blank'>${id.toLowerCase()}</a></li>`
    }

    return `<h1>${q.result.bref.to_curlic()}</h1>
    <h2><a data-goto='${q.result.unde}' href='#${q.result.unde}'>${q.result.unde}</a></h2>
    <ul class='links'>${html}</ul>`
  }
}