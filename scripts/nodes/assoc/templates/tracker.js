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

    html += `<p>Under development..</p>`
    // html += `<p>There are currently {*${q.result.issues.length} known issue${q.result.issues.length > 1 ? 's' : ''}*} associated to /{{${q.result.name.capitalize()}}}.</p>`.to_markup()
    // html += q.result.logs.length > 0 ? `<p>The last update to the {{${q.result.name.capitalize()}}} project was made {{${q.result.latest_log.time.ago()}|${q.result.name}:journal}}. To see a list of {*all active issues*}, see the {{Project Tracker|tracker}}. </p>`.to_markup() : ''
    // html += this.make_list(q)

    return html
  }
}