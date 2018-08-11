function LifelineViz(terms)
{
  this.terms = terms

  var cell = 13;
  var width = 600;
  var padding = (cell+1) * 8;

  this.position = function(time, years = 10)
  {
    var ratio = 1+(time.offset/(365*years)); // Over the last 10 years
    return step(clamp(ratio * width,0,width),cell+1) + (cell/2) + padding;
  }

  this._project = function(id,term)
  {
    var html = ""

    var logs = []
    var span = {from:null,to:null,release:term.released()};
    var sector = term.sectors()[0][0];
    var y = (id * (cell+1))+(cell/2)

    // Clickable
    html += `<rect x='0' y='${y}' width='${width+padding+cell}' height='${cell}' style='fill:black; stroke:none' onclick="Ø('query').bang('${term.name}')"/>`

    for(var id in term.logs){
      var log = term.logs[id];
      if(log.offset > 0){ continue; }
      logs[logs.length] = log;
    }

    span.from = logs[logs.length-1]
    span.to = logs[0]

    // Background
    html += `<line x1='${(cell/2)+padding}' y1='${y}' x2='${this.position({offset:0})}' y2='${y}' class='bg' />`

    if(span.release){
      var development = {w:this.position(span.release.time) - this.position(span.from.time) - 1,x:this.position(span.from.time)-(cell/2)}
      var release = {w:this.position(span.to.time) - this.position(span.release.time) - 1,x:this.position(span.release.time)-(cell/2)}
      var maintenance = {w:width - this.position(span.to.time) + padding + (cell*1.5),x:this.position(span.to.time)-(cell/2)}

      html += `<rect class='development' x='${development.x}' y='${y-(cell/2)}' width='${clamp(development.w,cell,width)}' height='${cell}' rx="2" ry="2" />`
      html += `<rect class='release' x='${release.x}' y='${y-(cell/2)}' width='${clamp(release.w,cell,width)}' height='${cell}' rx="2" ry="2" />`
      
      if(maintenance.x == release.x){
        maintenance.x += cell+1;
        maintenance.w -= cell+1;
      }
      html += `<rect class='maintenance' x='${maintenance.x}' y='${y-(cell/2)}' width='${clamp(maintenance.w,cell,width)}' height='${cell}' rx="2" ry="2" />`
    }
    else{
      var w = this.position(span.to.time) - this.position(span.from.time) - 1
      html += `<rect class='unreleased' x='${this.position(span.from.time)-(cell/2)}' y='${y-(cell/2)}' width='${clamp(w,cell,width)}' height='${cell}' rx="2" ry="2" />`
    }

    html += `<text class='${!span.release ? 'unreleased' : ''}' x='0' y='${y+(cell*0.3)}' style='text-anchor:start;fill:white;stroke:none; font-size:11px'>${term.name.capitalize()}</text>`

    return `<g style='width:${width}; height:${cell}'>${html}</g>`;
  }

  this.draw = function()
  {
    var html = ""
    var unsorted = []

    for(var id in this.terms){
      var term = this.terms[id]
      if(term.logs.length < 10){ continue; }
      unsorted.push([id,term.logs[0].time.offset]) // 
    }

    var sorted = sort(unsorted)

    var i = 0;
    for(var id in sorted){
      var name = sorted[id][0]
      html += this._project(i,this.terms[name]);
      i += 1;
    }

    var h = (sorted.length * cell)+(cell*10);

    html += `
    <text class='bold' x='0' y='-15'>Projects</text>
    <text class='bold' x='${padding+(cell/2)}' y='-15'>10 Years ago</text>
    <text class='right bold' x='${width+padding+cell}' y='-15'>Today</text>
    <rect class="development" x="${padding}" y="${h-(cell*2)-cell}" width="${cell}" height="${cell}" rx="2" ry="2" title="17O11"></rect>
    <text x='${padding+(cell*2)}' y='${h-(cell*1.25)-cell}' class='bold'>Development</text>
    <rect class="release" x="${padding+(cell*9)}" y="${h-(cell*2)-cell}" width="${cell}" height="${cell}" rx="2" ry="2" title="17O11"></rect>
    <text x='${padding+(cell*2)+(cell*9)}' y='${h-(cell*1.25)-cell}' class='bold'>Release</text>
    <rect class="maintenance" x="${padding+(cell*18)}" y="${h-(cell*2)-cell}" width="${cell}" height="${cell}" rx="2" ry="2" title="17O11"></rect>
    <text x='${padding+(cell*2)+(cell*18)}' y='${h-(cell*1.25)-cell}' class='bold'>Maintenance</text>
    <rect class="unreleased" x="${padding+(cell*27)}" y="${h-(cell*2)-cell}" width="${cell}" height="${cell}" rx="2" ry="2" title="17O11"></rect>
    <text x='${padding+(cell*2)+(cell*27)}' y='${h-(cell*1.25)-cell}' class='bold'>Unreleased</text>`

    return `<svg class='graph timeline' style='height:${h}px; width:728px'>${html}</svg>`
  }

  this.style = function()
  {
    return `
    <style>
      svg.graph.timeline { margin-bottom:30px; padding-top:30px}
      svg.graph.timeline line { stroke-width:1.5; stroke:#fff }
      svg.graph.timeline line.bg { stroke-width:1.5; stroke:#333 }
      svg.graph.timeline rect { stroke:none }
      svg.graph.timeline rect.development { fill:#72dec2 }
      svg.graph.timeline rect.release { fill:#51a196 }
      svg.graph.timeline rect.maintenance { fill:#316067 }
      svg.graph.timeline rect.unreleased { fill:#333 }
      svg.graph.timeline text { font-family:'archivo_medium'; stroke:none; fill:white; font-size:11px;text-anchor:start }
      svg.graph.timeline text.unreleased { fill:#999 !important}
      svg.graph.timeline text.right { text-anchor:end}
      svg.graph.timeline text.bold { font-family:'archivo_bold'}
      svg.graph.timeline g { cursor:pointer}
      svg.graph.timeline g:hover text { fill:#72dec2 !important}
    </style>
    `
  }

  this.toString = function()
  {
    return this.draw()+this.style()
  }

  function sort(array){
    return array.sort(function(a, b){
      return a[1] - b[1];
    }).reverse();
  }

  function clamp(v, min, max){ return v < min ? min : v > max ? max : v; }
  function step(v,s){ return Math.round(v/s) * s; }
}