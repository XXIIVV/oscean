function BuildSidebarNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.builder

  this.cache = null;

  this.answer = function(q)
  {
    if(!q.result){
      return "?"
    }
    var html = ""
    for(id in q.result.links){
      html += `<a href='${q.result.links[id]}' target='_blank'>${id}</a>`
    }

    return `<h1>${q.result.bref()}</h1>
    <h2>
      <a onclick="Ø('query').bang('${q.result.unde()}')">${q.result.unde()}</a><br />
      ${q.result.logs.length >= 10 ? q.result.logs[q.result.logs.length-1].time+'—'+q.result.logs[0].time : ''}
      <yu class='links'>${html}</yu>
    </h2>`
  }
}