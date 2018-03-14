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
          photo:photo_log ? `<media style='background-image:url(media/diary/${photo_log.photo}.jpg)'></media>` : '',
          info:{title:photo_log ? `<b>${photo_log.name}</b> — ${photo_log.time}` : '',glyph:term.glyph},
          menu:{
            search:q.name,
            activity:`${diaries.length > 1 ? `<a id='diaries' onclick="Ø('query').bang('journal')">${diaries.length} Diaries</a>` : ''}${logs.length > 5 ? `<a id='logs' onclick="Ø('query').bang('${logs[0].time.year}')">${logs.length} Logs</a>` : ''}`
          }
        },
        core:{
          sidebar:{
            bref:make_bref(q,term,logs),
            navi:make_navi(term,siblings,children)
          },
          content:this.signal(q.name) ? this.signal(q.name).answer(q) : `${q.result.long()}${make_horaire(logs)}`
        },
        style:""
      }
    }
  }

  function make_horaire(logs)
  {
    var horaire = new Horaire(logs);
    console.log(horaire)
    return `<mini><a onclick='Ø("query").bang("horaire")'><b>${horaire.sum.toFixed(0)}</b>fh</a> <b>${horaire.fh.toFixed(2)}</b>fh <b>${horaire.ch.toFixed(2)}</b>ch</mini>`
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

  function make_navi(term,siblings,children)
  {
    var html = ""
    for(id in siblings){
      var sibling = siblings[id];
      html += `<ln class='sibling'>${sibling.bref()}</ln>`
      if(sibling.name == term.name){
        for(id in children){
          var child = children[id];
          html += `<ln class='child'>${child.bref()}</ln>`
        }
      }
    }
    return html
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
}