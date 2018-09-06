'use strict';

function BuildSidebarNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z"

  this.cache = null;

  this.answer = function(q)
  {
    if(!q.result){
      return "<h1>The {(Nataniev)} Services Desk</h1><h2>{(Home)}</h2>".to_curlic()
    }

    let html = ""
    
    for(let id in q.result.links){
      html += `<a href='${q.result.links[id]}' target='_blank'>${id}</a>`
    }

    return `<h1>${q.result.bref.to_curlic()}</h1>
    <h2>
      <a data-goto='${q.result.unde}' href='#${q.result.unde}'>${q.result.unde}</a><br />
      ${q.result.span.from && q.result.span.to ? q.result.span.from+'—'+q.result.span.to : ''}
      <div class='links'>${html}</div>
    </h2>`
  }
}