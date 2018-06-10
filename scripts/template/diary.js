function DiaryTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {
    var logs = this.find_logs(q.name,q.tables.horaire)
    var skip = this.find_photo(logs)
    var html = ""
    for(id in logs){
      var log = logs[id]
      if(!log.photo || skip && log.photo == skip.photo){ continue; }
      html += `<img src='media/diary/${log.photo}.jpg'/>`
    }
    return `${q.result.long()}${html}${this.make_horaire(logs)}`
  }
}