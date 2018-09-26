'use strict';

function TrackerTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240"

  this.answer = function(q)
  {
    return `${new BalanceViz(q.tables.horaire)}`
  }
}