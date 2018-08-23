function Term(name,data)
{
  Entry.call(this,name,data);

  this.parent = null       // From Ø('map')
  this.children = []       // From Ø('map')
  this.logs = []           // From Ø('map')
  this.issues = []         // From Ø('map')
  this.diaries = []        // From Ø('map')
  this.outgoing = []       // From Ø('map')
  this.incoming = []       // From Ø('map')
  this.latest_log = null   // From Ø('map')
  this.featured_log = null // From Ø('map')

  this.name = name;

  this.data = data;
  this.bref = data.BREF ? data.BREF : ''
  this.unde = data.UNDE ? data.UNDE : 'Home'
  this.type = data.TYPE ? data.TYPE.toLowerCase() : null;
  this.links = this.data.LINK ? this.data.LINK : [];
  this.tags = this.data.TAGS ? this.data.TAGS.toLowerCase().split(" ") : [];
  this.theme = this.data.LOOK ? this.data.LOOK.toLowerCase() : 'default';

  this.is_portal = this.tags.indexOf("portal") > -1
  
  this.glyph = function()
  {
    if(this.data.ICON){ return this.data.ICON; }
    if(this.parent.glyph()){ return this.parent.glyph(); }
    if(this.portal().glyph()){ return this.portal().glyph(); }
    return null;
  }

  this.portal = function()
  {
    if(this.is_portal){ return this; }
    if(this.parent.is_portal){ return this.parent; }
    if(this.parent.parent.is_portal){ return this.parent.parent; }
    if(this.parent.parent.parent.is_portal){ return this.parent.parent.parent; }
    if(this.parent.parent.parent.parent.is_portal){ return this.parent.parent.parent.parent; }
    return null;
  }

  this.rating = function()
  {
    var h = {points:{}}

    h.points.long = this.data.LONG && this.data.LONG.length > 0
    h.points.logs = this.logs.length > 0
    h.points.children = this.children.length > 0
    h.points.photo = this.diaries.length > 0
    h.points.outgoing = this.outgoing && this.outgoing.length > 1
    h.points.incoming = this.incoming && this.incoming.length > 1
    h.points.glyph = this.glyph() != ""
    h.points.issues = this.issues.length == 0
    h.points.links = Object.keys(this.links).length > 0
    h.points.tags = this.tags.length > 0

    // Score
    var p = 0
    for(id in h.points){ p += h.points[id] ? 1 : 0 }

    h['score'] = (p/Object.keys(h.points).length)
    h['status'] = h['score'] < 0.4 ? 'poor' : h['score'] < 0.7 ? 'fair' : h['score'] < 0.9 ? 'good' : 'perfect'
    return h
  }

  this.has_tag = function(str)
  {
    var target = str.toLowerCase().replace(/ /g,"_").trim()
    return this.tags.indexOf(target) > -1
  }

  this.sectors = function()
  {
    var h = new Horaire(this.logs).sectors;
    var a = [["audio",h.audio],["visual",h.visual],["research",h.research]]

    return sort(a);
  }

  this.released = function()
  {
    for(var id in this.logs){
      var log = this.logs[id];
      if(log.time.offset > 0){ continue; }
      if(log.ch == 8){ return log; }
    }
    return null;
  }

  this.find_outgoing = function()
  {
    var a = []
    var str = this.data.BREF + (this.data.LONG ? this.data.LONG.join("\n") : '');

    var curlies = new Curlic(str).extract()

    if(!curlies){ return []; }

    curlies = curlies.filter(el =>{ return el.indexOf("(") > -1; })
    curlies = curlies.filter(el =>{ return el.indexOf("//") < 0; }) // Skip external
    curlies = curlies.filter(el =>{ return el.indexOf("[") < 0; })  // Skip evals

    curlies.forEach(el=>{
      var name = el.split("(")[1].replace(")","")
      a.push(name.toUpperCase())
    });
    return a;
  }

  function sort(array){
    return array.sort(function(a, b){
      return a[1] - b[1];
    }).reverse();
  }

  this.toString = function()
  {
    return `${new Runic(this.data.LONG,Curlic)}`
  }
}