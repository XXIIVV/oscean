function DiaryTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {    
    var term = q.result
    var logs = find_logs(q.name,q.tables.horaire)
    return {
      title: q.name.capitalize(),
      view:{
        core:{
          sidebar:{
            bref: `
            <h1>${q.result.bref()}</h1>
            <h2>
              <a onclick="Ø('query').bang('${term.unde()}')">${term.unde()}</a><br />
              ${make_activity(logs)}
              ${make_links(term.links)}
            </h2>`
          },
          content:`${q.result.long()}`
        }
      }
    }
  }

  function make_links(links)
  {
    var html = ""
    for(id in links)
    {
      html += `<a href='${links[id]}' target='_blank'>${id}</a>`
    }
    return `<yu class='links'>${html}</yu>`
  }

  function make_activity(logs)
  {
    return `${logs[logs.length-1].time}—${logs[0].time}`
  }

  function find_logs(name,logs)
  {
    var a = []
    for(id in logs){
      var log = logs[id];
      if(log.term.toUpperCase() == name){ a.push(log) }
    }
    return a
  }
}