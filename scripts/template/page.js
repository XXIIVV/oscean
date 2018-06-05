function PageTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {
    if(!q.result){
      return this.signal("missing").answer(q)
    }
    var term = q.result
    var logs = this.find_logs(q.name,q.tables.horaire)
    var diaries = this.find_diaries(logs)
    var photo_log = this.find_photo(logs)
    var siblings = this.find_siblings(term.unde(),q.tables.lexicon)
    var children = this.find_children(q.name,q.tables.lexicon)

    return  {
      title: q.name.capitalize(),
      view:{
        header:{
          photo:photo_log ? photo_log.photo : null,
          info:{title:photo_log ? `<b>${photo_log.name}</b> —<br />${photo_log.time}` : '',glyph:term.glyph},
          menu:{
            search:q.name,
            activity:`${diaries.length > 1 ? `<a id='diaries' onclick="Ø('query').bang('journal')">${diaries.length} Diaries</a>` : ''}${logs.length > 5 ? `<a id='logs' onclick="Ø('query').bang('${find_last_log(logs).time.year}')">${logs.length} Logs</a>` : ''}`
          }
        },
        core:{
          sidebar:{
            bref:make_bref(q,term,logs),
          },
          content:this.signal(q.name) ? this.signal(q.name).answer(q) : `${q.result.long()}${this.make_horaire(logs)}`,
          navi:this.make_navi(term,q.tables.lexicon)
        },
        style:this.signal(q.name) ? this.signal(q.name).style(q) : ``,
      }
    }
  }

  function make_bref(q,term,logs)
  {
    return `
    <h1>${q.result.bref()}</h1>
    <h2>
      <a onclick="Ø('query').bang('${term.unde()}')">${term.unde()}</a><br />
      ${make_activity(logs)}
      ${make_links(term.links)}
    </h2>`
  }

  function make_links(links)
  {
    var html = ""
    for(id in links){
      html += `<a href='${links[id]}' target='_blank'>${id}</a>`
    }
    return `<yu class='links'>${html}</yu>`
  }

  function make_activity(logs)
  {
    if(logs.length < 10){ return "" }
    return `${logs[logs.length-1].time}—${logs[0].time}`
  }

  function find_last_log(logs)
  {
    var target = logs[0]
    for(id in logs){
      var log = logs[id];
      if(log.time.offset() > 0){ continue; }
      target = log;
      break;
    }
    return target
  }
}