function HomeTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {    
    var term = q.result
    var logs = q.tables.horaire
    var photo = this.find_photo(logs)

    return {
      title: q.name.capitalize(),
      view:{
        header:{
          photo:photo ? `<media style='background-image:url(media/diary/${photo}.jpg)'></media>` : ''
        },
        core:{
          sidebar:{
            bref:make_bref(q,term,logs),
            navi:""
          },
          content:`${q.result.long()}`
        }
      }
    }
  }

  function make_diary(logs)
  {
    var html = ""

    for(id in logs){
      var log = logs[id]
      if(!log.photo){ continue; }
      html += `<img src='media/diary/${log.photo}.jpg'/>`
    }
    return html
  }

  function make_bref(q,term,logs)
  { 
    return `
    <h1>${q.result.bref()}</h1>
    <h2>
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
}