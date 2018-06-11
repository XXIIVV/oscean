function TypeTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.answer = function(q)
  {
    var target = q.result.type

    if(target == 'index' || target == 'portal'){
      return q.result.long()+this.make_index(q.result)
    }

    if(target == 'diary'){
      return q.result.long()+this.make_diary(q.result)
    }
    if(target == 'home'){
      return this.make_home(q)
    }
    
    return `${q.result.long()}`
  }

  this.make_index = function(term)
  {
    var html = ""

    for(id in term.children){
      var child = term.children[id];
      html += `
      ${child.featured_log ? `<a onclick='Ø("query").bang("${child.name}")'><img src="media/diary/${child.featured_log.photo}.jpg"/></a><hs>— ${child.bref().to_markup()}</hs>` : ''}
      ${child.long()}
      <quote>${!stop ? this.make_index(child,true) : ''}</quote>`
    }
    return html
  }

  this.make_diary = function(term)
  {
    var skip = term.featured_log
    var html = ""
    for(id in term.diaries){
      var log = term.diaries[id]
      if(skip && log.photo == skip.photo){ continue; }
      html += `<img src='media/diary/${log.photo}.jpg'/>`
    }
    return html
  }

  this.make_home = function(q)
  {
    var html = ""
    var projects = {};

    for(id in q.tables.horaire){
      var log = q.tables.horaire[id];
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
}