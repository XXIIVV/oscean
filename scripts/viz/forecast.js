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
      a.push(log);
    }
    return a
  }

  this.draw = function()
  {
    var data = this.parse();
    var future_logs = new Forecast(data,13);
    var past_logs = data.splice(0,14).reverse()

    var cell = 13 * 2

    var html = ""
    // Past
    for(id in past_logs){
      var log = past_logs[id];
      var x = id * (cell+1);
      var y = (cell * 3) * (1-(log.value/10))
      var height = (cell * 3) - y
      html += `<rect class='${log.sector} ${log.time.offset() == -1 ? 'today' : ''}' x='${x}' y='${y}' width='${cell}' height='${height}' rx="2" ry="2"></rect>`
      html += `<text x='${x+13}' y='-10' style='text-anchor:middle'>${log.time.d}</text>`
    }

    // Future
    for(id in future_logs){
      var log = future_logs[id];
      var offset_x = (cell+1) * 14
      var x = (id * (cell+1)) + offset_x;
      var y = (cell * 3) * (1-(log.value/10))
      var height = (cell * 3) - y
      html += `<rect class='${log.sector} val${log.value} future' x='${x}' y='${y}' width='${cell}' height='${height}' rx="2" ry="2"></rect>`
    }

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
      svg.graph.forecast { border-bottom:1.5px solid black; width:730px; padding-top:30px; height:135px; margin-bottom:30px}
      svg.graph.forecast text { stroke:none; fill:#000; font-size:11px; text-anchor: middle; font-family:'archivo_bold' }
      svg.graph.forecast rect { fill:#ccc; stroke:none}
      svg.graph.forecast rect.audio { fill:#72dec2 }
      svg.graph.forecast rect.visual { fill:#51a196 }
      svg.graph.forecast rect.research { fill:#316067 }
      svg.graph.forecast rect.today { animation: blink 2s linear infinite;}
    </style>
    `
  }

  this.toString = function()
  {
    return this.draw()+this.style()
  }
}