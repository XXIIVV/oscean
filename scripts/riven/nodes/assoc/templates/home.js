function HomeTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240"
  
  this.answer = function(q)
  {
    let html = ""
    let projects = {};

    for(let id in q.tables.horaire){
      let log = q.tables.horaire[id];
      if(!log.term){ continue; }
      if(log.time.offset > 0){ continue; }
      if(!projects[log.term]){ projects[log.term] = {name:log.term,to:log.time.toString(),count:0}}
      projects[log.term].from = log.time.toString();
      projects[log.term].count += 1;
    }

    for(let id in projects){
      let project = projects[id];
      if(project.count < 10){ continue; }
      html += `<ln>{(${project.name.capitalize()})} ${project.from != project.to ? project.from+"—"+project.to : project.from}</ln>`
    }
    return `<list class='tidy'>${html}</list>`.to_curlic();;
  }
}