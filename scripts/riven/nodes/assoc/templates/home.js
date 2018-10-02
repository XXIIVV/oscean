'use strict';

function HomeTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = "M60,60 L60,60 L240,60 L240,240 L60,240 Z M240,150 L240,150 L150,150 L150,240"
  
  function make_projects(logs)
  {
    const h = {}
    for(const id in logs){
      const log = logs[id];
      if(!log.term){ continue; }
      if(log.time.offset > 0){ continue; }
      if(!h[log.term]){ h[log.term] = {name:log.term,to:log.time.toString(),count:0}}
      h[log.term].from = log.time.toString();
      h[log.term].count += 1;
    }
    return h;
  }

  this.answer = function(q)
  {
    const projects = make_projects(q.tables.horaire);
    return `<ul class='tidy col3'>${Object.keys(projects).reduce((acc,val) => { 
      return projects[val].count > 10 ? `${acc}<li>{(${val.capitalize()})} ${new Desamber(projects[val].from).toString(true)}—${new Desamber(projects[val].to).toString(true)}</li>` : acc},"")
    }</ul>`.to_curlic();
  }
}