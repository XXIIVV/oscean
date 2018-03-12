function project_list()
{
  this.html = function()
  {
    var html = "";
    var projects = {};

    for(id in invoke.vessel.horaire.logs){
      var log = invoke.vessel.horaire.logs[id];
      if(!log.term){ continue; }
      if(!projects[log.term]){ projects[log.term] = {name:log.term,to:log.time.toString(),count:0}}
      projects[log.term].from = log.time.toString();
      projects[log.term].count += 1;
    }

    for(id in projects){
      var project = projects[id];
      if(project.count < 10){ continue; }
      html += "<ln><a href='/"+project.name.to_url()+"'>"+project.name+"</a> "+(project.from != project.to ? project.from+"—"+project.to : project.from)+"</ln>";
    }
    return "<list class='tidy'>"+html+"</list>";
  }
}; 

var payload = new project_list();

invoke.vessel.seal("special","home",payload);