function JournalTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.archives = [];

  this.answer = function(q)
  {
    var term = q.result;

    if(term.logs.length < 1){ return `<p>Sorry, there are no logging data for the {{${term.name.capitalize()} project|${term.name}}}.</p>`.to_markup() }

    var horaire = new Horaire(term.logs)
    var html = ''

    html += new ActivityViz(term.logs,{size:{width:700},theme:"pale"});
    // html += new RecentViz(term.logs);

    for(id in term.logs){
      var log = term.logs[id]
      html += log;
    }
    return `
    <p>A total of <b>${term.logs.length} logs</b>, or ${horaire.sum} hours, were recorded to the {{${term.name.capitalize()}}} project.</p>
    <p>The project was {*initiated on ${term.logs[term.logs.length-1].time}*} and the last update was recorded {{${term.logs[0].time.offset_format(new Date().desamber(),true)}|Calendar}}. For additional details on the time tracking process and tools, see the complete {{Horaire documentation|Horaire}}.</p>
    ${html}`.to_markup()
  }
}