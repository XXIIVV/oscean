function TypeTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.answer = function(q)
  {
    var target = q.result.type
    var template = q.params

    // Template URLs

    if(template == 'diary' && q.result.diaries.length > 1){
      return this.make_diary(q.result)
    }
    else if(template == 'horaire' && q.result.logs.length > 1){
      return this.make_logs(q.result)
    }
    else if(template){
      return `<p>Sorry, there is no <b>:${template}</b> template for {{${q.result.name.capitalize()}}}.</p>`.to_markup()
    }

    // Special(Home)

    if(target.indexOf('home') > -1){
      return this.make_home(q)
    }

    // Default

    var html = q.result.long(q.tables)

    if(target.indexOf('diary') > -1){
      html += this.make_diary(q.result)
    }
    if(target.indexOf('index') > -1){
      html += this.make_index(q.result,q.tables)
    }
    
    var horaire = new Horaire(q.result.logs);
    html += horaire.sum > 30 ? `<mini class='horaire'>{{<b>${horaire.sum.toFixed(0)}</b>+|${q.result.name}:horaire}} <b>${horaire.fh.toFixed(2)}</b>HDf <b>${horaire.ch.toFixed(2)}</b>HDc<hr/></mini>`.to_markup() : ''

    return html
  }

  this.make_index = function(term,tables)
  {
    var html = ""

    for(id in term.children){
      var child = term.children[id];
      html += `
      ${child.featured_log ? `<a onclick='Ø("query").bang("${child.name}")'><img src="media/diary/${child.featured_log.photo}.jpg"/></a><hs>— ${child.bref().to_markup()}</hs>` : `<h2>${child.name}</h2><hs>— ${child.bref()}</hs>`.to_markup()}
      ${child.long(tables)}
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

  this.make_logs = function(term)
  {
    var horaire = new Horaire(term.logs)
    var html = ''
    for(id in term.logs){
      var log = term.logs[id]
      html += log;
    }
    return `
    <p>Recorded <b>${term.logs.length} logs</b>, or ${horaire.sum} hours, between ${term.logs[term.logs.length-1].time} and ${term.logs[0].time}. Last update was recorded ${term.logs[0].time.offset() * -1} days ago.</p>
    <p>For additional details on the time tracking process and tools, see the complete {{Horaire documentation|Horaire}}.</p>
    <p>Return to the {{${term.name.capitalize()} page|${term.name}}}.</p>
    ${html}`.to_markup()
  }
}