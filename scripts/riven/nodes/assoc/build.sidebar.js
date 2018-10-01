'use strict';

function BuildSidebarNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z"

  function _bref(term)
  {
    return `<h1>${term.bref.to_curlic()}</h1>`
  }

  function _parent(term)
  {
    return `<h2><a data-goto='${term.unde}' href='#${term.unde}'>${term.unde}</a></h2>`
  }

  function _links(term)
  {
    if(!term.links){ return ''; }
    return `
    <ul class='links'>
      ${Object.keys(term.links).reduce((acc,val) => { 
        return `${acc}<li><a href='${term.links[val]}' target='_blank'>${val.toLowerCase()}</a></li>`; 
      },"")}
    </ul>`
  }

  this.answer = function(q)
  {
    if(!q.result){ return "<h1>The {(Nataniev)} Services Desk</h1><h2>{(Home)}</h2>".to_curlic(); }

    return `
    ${_bref(q.result)}
    ${_parent(q.result)}
    ${_links(q.result)}`
  }
}