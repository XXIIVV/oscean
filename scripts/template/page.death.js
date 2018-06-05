function DeathTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {
    // Secret.
    debug(q.tables.horaire,q.tables.lexicon)

    var term = q.result
    var logs = this.find_logs(q.name,q.tables.horaire)
    var photo_log = this.find_photo(logs)
    var siblings = this.find_siblings(term.unde(),q.tables.lexicon)
    var children = this.find_children(q.name,q.tables.lexicon)

    var html = "";
    var birth = new Date("1986-03-22");
    var now = Date.now();
    var offset = (now - birth)/1000/86400;
    var end = new Date((1986+52)+"-03-22")
    var y = 0;

    while(y < 52){
      var w = 0;
      while(w < 52){
        var day = (w * 7) + (365 * y);
        html += "<cell class='"+(day > offset ? 'past' : 'future')+"'></cell>";
        w += 1;
      }
      html += "<hr />"
      y += 1;
    }

    return `${term.long()}<yu class='death'>${html}</yu>`
  }
  
  this.style = function()
  {
    return `
    yu.death { width: 700px;margin-bottom:45px}
    yu.death cell { background:black; width:12.45px; height:5px; display:block; float:left; border-radius:10px; margin:0px 1px 1px 0px}
    yu.death cell.past { background:#fff; border:2px solid black; width:8.45px; height:1px}
    yu.death h1 { font-size: 55px;line-height: 60px;font-family: 'frank_ruhl_light';text-align: center;letter-spacing: -5px;margin-top:30px}`
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

  // Secret

  function debug(horaire,lexicon)
  {
    var photos = []

    for(id in horaire){
      var log = horaire[id]
      if(log.photo){ photos.push(parseInt(log.photo))}
    }

    console.log(`Next available Id: ${find_available_id(photos)}`)
  }

  function find_available_id(photos)
  {
    var i = 1
    while(i < 999){
      if(photos.indexOf(i) < 0){ return i }
      i += 1
    }
    return i
  }
}








