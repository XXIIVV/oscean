function TrackerTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.archives = [];

  this.make_list = function(q)
  {
    var html = ""
    for(id in q.result.issues){
      var issue = q.result.issues[id]
      html += `<ln>${issue.to_markup()}</ln>`
    }
    return `<list class='bold'>${html}</list>`
  }

  this.answer = function(q)
  {
    var html = ""

    html += `<p>Currently under development, look at the {{Journal}} and {{Calendar}} in the meantime.</p>`.to_markup()

    return html
  }
}