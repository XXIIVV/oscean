function HomeTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {
    var term = q.result
    var logs = q.tables.horaire
    var diaries = this.find_diaries(logs)
    var photo_log = this.find_photo(logs)    

    return {
      title: q.name.capitalize(),
      view:{
        header:{
          photo:photo_log ? `<media style='background-image:url(media/diary/${photo_log.photo}.jpg)'></media>` : '',
          info:{title:photo_log ? `<b>${photo_log.name}</b> —<br />${photo_log.time}` : '',glyph:term.glyph},
          menu:{
            search:q.name,
            activity:`${diaries.length > 1 ? `<a id='diaries' onclick="Ø('query').bang('journal')">${diaries.length} Diaries</a>` : ''}${logs.length > 5 ? `<a id='logs' onclick="Ø('query').bang('${find_last_log(logs).time.year}')">${logs.length} Logs</a>` : ''}`
          }
        },
        core:{
          sidebar:{
            bref:make_bref(q,term,logs)
          },
          content:make_list(logs),
          navi:""
        },
        style:""
      }
    }
  }

  function make_list(logs)
  {
    var html = ""
    var projects = {};

    for(id in logs){
      var log = logs[id];
      if(!log.term){ continue; }
      if(log.time.offset() > 0){ continue; }
      if(!projects[log.term]){ projects[log.term] = {name:log.term,to:log.time.toString(),count:0}}
      projects[log.term].from = log.time.toString();
      projects[log.term].count += 1;
    }

    for(id in projects){
      var project = projects[id];
      if(project.count < 10){ continue; }
      html += `<ln>{{${project.name}}} ${project.from != project.to ? project.from+"—"+project.to : project.from}</ln>`.to_markup();
    }
    return `<list class='tidy'>${html}</list>`;
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