function PageTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {    
    var term = q.result
    var logs = this.find_logs(q.name,q.tables.horaire)
    var photo_log = this.find_photo(logs)
    var siblings = this.find_siblings(term.unde(),q.tables.lexicon)
    var children = this.find_children(q.name,q.tables.lexicon)

    return {
      title: q.name.capitalize(),
      view:{
        header:{
          photo:photo_log ? `<media style='background-image:url(media/diary/${photo_log.photo}.jpg)'></media>` : '',
          info:photo_log ? `<b>${photo_log.name}</b> — ${photo_log.time}` : '',
        },
        core:{
          sidebar:{
            bref:make_bref(q,term,logs),
            navi:make_navi(term,siblings,children)
          },
          content:`${q.result.long()}`
        }
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