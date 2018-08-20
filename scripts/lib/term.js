function Term(name,dict)
{
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

  this.dict = dict;
  this.type = dict.TYPE ? dict.TYPE.toLowerCase() : null;
  this.links = this.dict.LINK ? this.dict.LINK : [];
  this.tags = this.dict.TAGS ? this.dict.TAGS.toLowerCase().split(" ") : [];
  this.theme = this.dict.LOOK ? this.dict.LOOK.toLowerCase() : 'default';

  this.is_portal = this.tags.indexOf("portal") > -1
  
  this.unde = function()
  {
    return this.dict.UNDE ? this.dict.UNDE : "Home"
  }

  this.bref = function()
  {
    return this.dict && this.dict.BREF ? this.dict.BREF.to_markup() : ''
  }

  this.long = function(tables)
  {
    return new Runic(this.dict.LONG,tables).parse() + (this.dict.LATE ? this.dict.LATE : '')
  }

  this.glyph = function()
  {
    if(this.dict.ICON){ return this.dict.ICON; }
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

    h.points.long = this.dict.LONG && this.dict.LONG.length > 0
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
    var str = this.dict.BREF + (this.dict.LONG ? this.dict.LONG.join("\n") : '');
    var parts = str.split("{{")
    for(id in parts){
      var part = parts[id];
      if(part.indexOf("}}") == -1){ continue; }
      var content = part.split("}}")[0];
      if(content.substr(0,1) == "$"){ continue; }
      if(content.substr(0,1) == "/"){ continue; }
      var target = content.indexOf("|") > -1 ? content.split("|")[1] : content;
      var name = content.indexOf("|") > -1 ? content.split("|")[0] : content;
      if(target.indexOf("//") > -1){ continue; }
      a.push(target.toUpperCase())
    }
    return a;
  }

  function sort(array){
    return array.sort(function(a, b){
      return a[1] - b[1];
    }).reverse();
  }
}