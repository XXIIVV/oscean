function ActivityViz(logs)
{
  this.logs = []

  // Only keep the last 365 days
  for(id in logs){
    var log = logs[id]
    var offset = log.time.offset();
    if(offset > 0){ continue; }
    if(offset < -365 * 10){ continue; }
    this.logs[this.logs.length] = log;
  }

  this.parse = function(logs = this.logs)
  {
    var h = {}
    var i = 0
    for(id in logs){
      var log = logs[id];
      var offset = log.time.offset();
      if(offset > 0){ continue; }
      if(offset < -364){ break; }
      h[log.time.offset()] = log;
    }
    return h
  }

  this.draw = function()
  {
    var data = this.parse();

    var html = ""
    var week = 0
    var height = cell*2
    var cell = parseInt(700/52)
    while(week < 52){
      var x = parseInt(week * (cell+1))
      var day = 0
      html += week % 2 == 0 ? `<text x='${x+(cell/2)}' y='-15'>${new Date().desamber().to_offset(-(365 - (week*7))).m}</text>` : ''
      while(day < 7){
        var y = parseInt(day * (cell+1))
        var offset = (365 - (week*7)-(day+1)) * -1
        var log = data[offset+1]
        html += log && log.sector ? `<rect class='${log.sector} ${log.time.offset() == 0 ? 'today' : ''}' x='${x}' y='${y}' width='${cell}' height='${cell}' rx="2" ry="2" title='${log.time}' onclick="Ø('query').bang('${log.term}')"></rect>` : `<rect class='missing ${day == 6 && week == 51 ? 'today' : ''}' x='${x}' y='${y}' width='${cell}' height='${cell}' rx="2" ry="2"></rect>`
        html += log && log.photo ? `<circle cx='${x+(cell/2)}' cy='${y+(cell/2)}' r='2.5' class='photo'></circle>` : ''
        html += log && log.is_event ? `<circle cx='${x+(cell/2)}' cy='${y+(cell/2)}' r='2' class='event'></circle>` : ''
        day += 1
      }
      week += 1
    }

    var recent = new Horaire(this.logs);

    var y = 115
    html += `
    <rect class="audio" x="${cell*0}" y="${y}" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell+1)*2}' y='${y+10}' style='text-anchor:start'>Audio ${(recent.sectors.audio*10).toFixed(1)}%</text>
    <rect class="visual" x="${(cell+1)*8}" y="${y}" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell+1)*10}' y='${y+10}' style='text-anchor:start'>Visual ${(recent.sectors.visual*10).toFixed(1)}%</text>
    <rect class="research" x="${(cell+1)*16}" y="${y}" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell+1)*18}' y='${y+10}' style='text-anchor:start'>Research ${(recent.sectors.research*10).toFixed(1)}%</text>
    <text x='725' y='${y+10}' style='text-anchor:end'>${recent.sum.toFixed(0)} Hours</text>`

    return `<svg class='graph activity' style='max-width:730px; height:${y}px; width:100%;'>${html}</svg>`
  }

  this.style = function()
  {
    return `
    <style>
    @keyframes blink { 50% { opacity: 0; } }
    svg.graph.activity { border-bottom: 1.5px solid #333;display: block;padding: 30px 0px;margin-bottom: 30px}
    svg.graph.activity text { stroke:none; fill:#fff; font-size:11px; text-anchor: middle; font-family:'archivo_bold'; fill:#000; text-transform:capitalize }
    svg.graph.activity rect { stroke:none }
    svg.graph.activity rect:hover { fill:#a1a1a1 !important; cursor:pointer}
    svg.graph.activity rect.audio { fill:#72dec2 }
    svg.graph.activity rect.missing { fill:#ddd }
    svg.graph.activity rect.visual { fill:#51a196 }
    svg.graph.activity rect.research { fill:#316067 }
    svg.graph.activity rect.misc { fill:#000 !important }
    svg.graph.activity rect.today { animation: blink 1s linear infinite;}
    svg.graph.activity circle.photo { fill:white; stroke:none }
    svg.graph.activity circle.event { fill:none; stroke:white; stroke-width:1.5px }
    svg.graph.activity path { stroke-linecap:butt; stroke-dasharray:1,1; fill:none;stroke:#333;stroke-width:13px }

    #view.noir svg.graph.activity text { fill:white}
    #view.noir svg.graph.activity rect.missing { fill:#333 }
    #view.noir svg.graph.activity circle.photo { fill:white; stroke:none }
    #view.noir svg.graph.activity circle.event { fill:none; stroke:white; stroke-width:1.5px }
    </style>
    `
  }

  this.toString = function()
  {
    return this.draw()+this.style()
  }
}