function ForecastViz(logs,settings = {})
{
  this.logs = logs;
  this.settings = settings;

  this.parse = function(logs = this.logs)
  {
    var a = []
    for(id in logs){
      var log = logs[id];
      if(log.time.offset() > 0){ continue; }
      if(a.length > 14*5){ break; }
      a[a.length] = log
    }
    return a
  }

  this.draw = function()
  {
    var data = this.parse();
    var future_logs = new Forecast(data,13);
    var past_logs = {} ; for(id in data){ past_logs[`${data[id].time}`] = data[id] }

    var cell = 13 * 2

    var html = ""
    // Past
    var d = 13
    while(d >= 0){
      var desamber = new Date().desamber().to_date(-d).desamber()
      var log = past_logs[`${desamber}`];
      if(!log){ d -= 1; continue; }
      var x = (13-d) * (cell+1);
      var y = (cell * 3) * (1-(log.fh/10))
      html += `<rect class='${log.sector} ${d == 0 ? 'today' : ''}' x='${x}' y='${y}' width='${cell}' height='${(cell * 3) - y}' rx="2" ry="2"></rect>`
      html += `<text x='${x+13}' y='-10' style='text-anchor:middle'>${desamber.d}</text>`
      html += log.fh >= 3 ? `<text x='${x+13}' y='70' style='text-anchor:middle; fill:white'>${log.fh}h</text>` : ''
      d -= 1
    }

    // Future
    for(id in future_logs){
      var log = future_logs[id];
      var offset_x = (cell+1) * 14
      var x = (id * (cell+1)) + offset_x;
      var y = (cell * 3) * (1-(log.fh/10))
      var height = (cell * 3) - y
      html += `<rect class='${log.sector} future' x='${x}' y='${y}' width='${cell}' height='${height}' rx="2" ry="2"></rect>`
      html += log.fh >= 3 ? `<text x='${x+13}' y='70' style='text-anchor:middle; fill:white'>${log.fh}h</text>` : ''
    }

    html += `<text x='370' y='0' style='text-anchor:end'>—</text>`
    html += `<text x='385' y='105' style='text-anchor:end'>TODAY</text>`
    html += `<text x='605' y='105' style='text-anchor:end'>FUTURE</text>`
    html += `<text x='160' y='105' style='text-anchor:end'>PAST</text>`

    return `<svg class='graph forecast'>${html}</svg>`
  }

  this.style = function()
  {
    return `
    <style>
      @keyframes blink { 50% { opacity: 0; } }
      svg.graph.forecast { border-bottom:1.5px solid black; width:730px; padding-top:30px; height:125px; margin-bottom:30px}
      svg.graph.forecast text { stroke:none; fill:#000; font-size:11px; text-anchor: middle; font-family:'archivo_bold' }
      svg.graph.forecast rect { fill:#ccc; stroke:none}
      svg.graph.forecast rect.audio { fill:#72dec2 }
      svg.graph.forecast rect.visual { fill:#51a196 }
      svg.graph.forecast rect.research { fill:#316067 }
      svg.graph.forecast rect.today { animation: blink 2s linear infinite;}
    </style>
    `
  }

  this.legend = function()
  {
    return `<p>The {*Forecast Graph*} is a suggestion toward an optimal investment of time, based on {{previous patterns|Journal}} of creative output which yielded the maximal value of {{Focus Hour|Horaire}}.</p>`.to_markup()
  }

  this.toString = function()
  {
    return this.draw()+this.legend()+this.style()
  }
}