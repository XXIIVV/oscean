function DefaultTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.answer = function(q)
  {
    return `${q.result.long(q.tables)}${this.make_horaire(q.result.logs)}`
  }

  this.make_horaire = function(logs)
  {
    var horaire = new Horaire(logs);
    return horaire.sum > 30 ? `<mini class='horaire'>{{<b>${horaire.sum.toFixed(0)}</b>+|Horaire}} <b>${horaire.fh.toFixed(2)}</b>HDf <b>${horaire.ch.toFixed(2)}</b>HDc<hr/></mini>`.to_markup() : `<mini class='horaire'><hr/></mini>`.to_markup()
  }
}