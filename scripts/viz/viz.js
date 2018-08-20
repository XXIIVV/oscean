function Viz()
{
  var cell = 13;

  this.slice = function(logs,from,to)
  {
    var a = []
    for(var id in logs){
      var log = logs[id];
      if(log.time.offset < from){ continue; }
      if(log.time.offset > to){ continue; }
      a.push(log)
    }
    return a
  }

  this.legend = function(logs)
  {
    var html = ""

    var y = 115

    // Top
    html += `
    <text x='${2}' y='${-15}' style='text-anchor:start'>${logs[logs.length-1].time.ago().capitalize()}</text>
    <text x='${730}' y='${-15}' style='text-anchor:end'>${logs[0].time.ago().capitalize()}</text>`

    // Below
    var horaire = new Horaire(logs);
    html += `
    <rect class="audio" x="${cell*0}" y="${y}" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell+1)*2}' y='${y+10}' style='text-anchor:start'>Audio ${(horaire.sectors.audio*10).toFixed(1)}%</text>
    <rect class="visual" x="${(cell+1)*8}" y="${y}" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell+1)*10}' y='${y+10}' style='text-anchor:start'>Visual ${(horaire.sectors.visual*10).toFixed(1)}%</text>
    <rect class="research" x="${(cell+1)*16}" y="${y}" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell+1)*18}' y='${y+10}' style='text-anchor:start'>Research ${(horaire.sectors.research*10).toFixed(1)}%</text>
    <text x='725' y='${y+10}' style='text-anchor:end'>${horaire.sum.toFixed(0)} Hours</text>`

    return html
  }

  this.style = function()
  {
    return `
    <style>
    @keyframes blink { 50% { opacity: 0; } }
    svg.viz { border-bottom: 1.5px solid #333;display: block;padding: 30px 0px;margin-bottom: 30px; max-width:730px; height:115px; width:100%;}
    svg.viz text { stroke:none; fill:#fff; font-size:11px; text-anchor: start; font-family:'archivo_bold'; fill:#000; text-transform:capitalize }
    svg.viz rect { stroke:none }
    svg.viz rect:hover { fill:#a1a1a1 !important; cursor:pointer}
    svg.viz rect.audio { fill:#72dec2 }
    svg.viz rect.missing { fill:#ddd }
    svg.viz rect.visual { fill:#51a196 }
    svg.viz rect.research { fill:#316067 }
    svg.viz rect.misc { fill:#000 !important }
    svg.viz rect.today { animation: blink 1s linear infinite;}
    svg.viz circle.photo { fill:white; stroke:none }
    svg.viz circle.event { fill:none; stroke:white; stroke-width:1.5px }
    svg.viz path { stroke-linecap:butt; stroke-dasharray:1,1; fill:none;stroke:#333;stroke-width:13px }

    #view.noir svg.viz text { fill:white}
    #view.noir svg.viz rect.missing { fill:#333 }
    #view.noir svg.viz circle.photo { fill:white; stroke:none }
    #view.noir svg.viz circle.event { fill:none; stroke:white; stroke-width:1.5px }
    </style>
    `
  }

  this.toString = function()
  {
    if(this.logs.length < 1){ return '<p>Not enough data to display the infographic.</p>'; }

    return this.draw()+this.style()
  }
}