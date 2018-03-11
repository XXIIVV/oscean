function HomeTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.answer = function(q)
  {    
    var term = q.result
    var logs = q.tables.horaire
    var photo_log = this.find_photo(logs)

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
            navi:""
          },
          content:make_list(logs)
        }
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
}