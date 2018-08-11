function TrackerTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element

  this.answer = function(q)
  {
    var logs = q.target == "tracker" ? q.tables.horaire : q.result.logs;

    var html = ""

    html += `${new TimelineViz(q.tables.lexicon)}`;
    html += `<p>Currently under development, look at the {{Journal}} and {{Calendar}} in the meantime.</p>`.to_markup()

    return html
  }
}