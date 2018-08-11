function TimelineViz(terms)
{
  this.terms = terms

  var cell = 13;

  this.position = function(time, years = 10)
  {
    var ratio = 1+(time.offset/(365*years)); // Over the last 10 years
    var width = 720;
    var x = clamp(ratio * width,0,width)

    return step(x,cell+1)+(cell/2);
  }

  this._event = function(log,y)
  {
    var x = this.position(log.time);

    return `<rect class="visual " x="${x-(cell/2)}" y="${y-(cell/2)}" width="13" height="13" rx="2" ry="2"></rect>`
  }

  this._project = function(id,term)
  {
    var html = ""

    // Background
    var y = (id * (cell+1))+(cell/2)
    html += `<line x1='${cell/2}' y1='${y}' x2='${735 - (cell)}' y2='${y}' />`

    // Lifetime
    var span = {from:term.logs[term.logs.length-1],to:term.logs[0]}
    var lifetime = {from:this.position(span.from.time),to:this.position(span.to.time)}
    html += `<line x1='${lifetime.from}' y1='${y}' x2='${lifetime.to}' y2='${y}' style='stroke:red' />`

    html += this._event(span.from,y);
    html += this._event(span.to,y);

    for(i in term.logs){
      var log = term.logs[i];
      if(!log.is_event){ continue; }
      html += this._event(log,y);
    }

    html += `<text x='0' y='${y}' style='text-anchor:start;fill:white;stroke:none; font-size:11px'>${term.name}</text>`

    return html;
  }

  this.draw = function()
  {
    var html = ""

    var cell = parseInt(700/52);

    var unsorted = []

    for(id in this.terms){
      var term = this.terms[id]
      if(term.logs.length < 10){ continue; }
      unsorted.push([id,term.logs[0].time.offset])
    }

    var sorted = sort(unsorted)


    var i = 0;
    for(id in sorted){
      var name = sorted[id][0]
      html += this._project(i,this.terms[name]);
      i += 1;
    }


    // html += `<rect class="visual " x="714" y="0" width="13" height="13" rx="2" ry="2" title="18P06" onclick="Ø('query').bang('Dotgrid')"></rect>`
    // html += `<rect class="visual " x="0" y="0" width="13" height="13" rx="2" ry="2" title="17P14" onclick="Ø('query').bang('Marabu')"></rect>` 

    return `<svg class='graph timeline' style='height:${(sorted.length * cell)+(cell*10)}px; width:730px'>${html}</svg>`
  }

  this.style = function()
  {
    return `
    <style>
      svg.graph.timeline { margin-bottom:30px}
      svg.graph.timeline line { stroke-width:2; stroke:#333 }
      svg.graph.timeline rect { stroke:none; fill:red }
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