function Term(name,dict)
{
  this.name = name;

  this.dict = dict;
  this.type = dict.TYPE ? dict.TYPE.toLowerCase() : null;
  this.links = this.dict.LINK ? this.dict.LINK : [];
  this.tags = this.dict.TAGS ? this.dict.TAGS.toLowerCase().split(" ") : [];

  this.parent = null       // Assigned in Map
  this.children = []       // Assigned in Map
  this.logs = []           // Assigned in Map
  this.issues = []         // Assigned in Map
  this.diaries = []        // Assigned in Map
  this.outgoing = []       // Assigned in Map
  this.incoming = []       // Assigned in Map
  this.latest_log = null   // Assigned in Map
  this.featured_log = null // Assigned in Map

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

    // Score
    var p = 0
    for(id in h.points){
      p += h.points[id] ? 1 : 0
    }

    h['score'] = (p/Object.keys(h.points).length).toFixed(2)
    h['status'] = h['score'] < 0.4 ? 'poor' : h['score'] < 0.7 ? 'fair' : h['score'] < 0.9 ? 'good' : 'perfect'
    return h
  }

  this.has_tag = function(target)
  {
    return this.tags.indexOf(target.toLowerCase()) > -1
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
}