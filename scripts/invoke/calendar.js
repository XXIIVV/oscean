Ø("invoke").seal("calendar",(q) => 
{
  // Service
  function find_available(q)
  {
    var used = []
    for(id in q.tables.horaire){
      var log = q.tables.horaire[id]
      if(!log.photo){ continue; }
      used.push(log.photo)
    }
    var available = 1
    while(available < 999){
      if(used.indexOf(available) < 0){ console.log(`Next Available:${available}`); break; }
      available += 1
    }
  }

  function on_this_day(q)
  {
    var today = new Date().desamber();
    var a = []
    for(id in q.tables.horaire){
      var log = q.tables.horaire[id]
      if(!log.is_event){ continue; }
      if(!log.name){ continue; }
      if(log.time.offset() >= 0){ continue; }
      if(log.time.doty != today.doty){ continue; }
      a.push(log)
    }

    var html = "";

    if(a.length > 0){
      html += "<code>"
      for(id in a){
        var log = a[id];
        html += `<comment>${today.y - log.time.y}y ago today</comment> ${log.name}\n`
      }
      html += "</code>"
    }
    return html;
  }

  function echo_events(q)
  {
    var html = "";
    var prev_y = 0;
    for(var id in q.tables.horaire){
      var log = q.tables.horaire[id];
      if(!log.is_event){ continue; }
      if(log.time.y != prev_y){ html += `<ln class='head'>20${log.time.y}</ln>`; prev_y = log.time.y; }
      html += `<ln style='${log.time.offset() > 0 ? 'color:#aaa' : ''}'>{{${log.name ? log.name : log.term+' '+log.task.capitalize()}|${log.term}}}</a> <t title='${log.time}'>${log.time.offset_format()}</t></ln>`.to_markup()
    }
    return `<list class='tidy' style='max-width:calc(100% - 15px)'>${html}</list>`;
  }

  var html = "";


  var data = {code: '-380'}
  console.log(new Log(data).task)
  find_available(q)

  html += echo_events(q)
  html += on_this_day(q)

  return html
});