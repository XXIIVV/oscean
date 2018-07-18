function DiaryTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.answer = function(q)
  {
    var term = q.result;
    var skip = term.featured_log
    var html = term.long(q.tables)

    for(id in term.diaries){
      var log = term.diaries[id]
      if(skip && log.photo == skip.photo){ continue; }
      html += `<img src='media/diary/${log.photo}.jpg'/>`
    }

    html += this.make_horaire(term.logs)
    return html
  }
  
  this.make_horaire = function(logs)
  {
    var horaire = new Horaire(logs);
    return horaire.sum > 30 ? `<mini class='horaire'>{{<b>${horaire.sum.toFixed(0)}</b>+|Horaire}} <b>${horaire.fh.toFixed(2)}</b>HDf <b>${horaire.ch.toFixed(2)}</b>HDc<hr/></mini>`.to_markup() : `<mini class='horaire'><hr/></mini>`.to_markup()
  }
}