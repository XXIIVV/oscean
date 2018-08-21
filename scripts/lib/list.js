function List(name,data)
{
  this.name = name;
  this.data = data;

  this.parent = null       // From Ø('map')
  this.children = []       // From Ø('map')
  this.logs = []           // From Ø('map')
  this.issues = []         // From Ø('map')
  this.diaries = []        // From Ø('map')
  this.outgoing = []       // From Ø('map')
  this.incoming = []       // From Ø('map')
  this.latest_log = null   // From Ø('map')
  this.featured_log = null // From Ø('map')

  this.unde = function()
  {
    return "Glossary";
  }

  this.bref = function()
  {
    return `The {{${this.name.capitalize()}}} word list.`.to_markup()
  }

  this.long = function(tables)
  {
    var connections = this.connections(tables);
    var html = connections.length > 0 ? `<p>{*${this.name.capitalize()}*} is part of the {{${connections[0].name.capitalize()}}} collection.</p>` : `<p>{*${this.name.capitalize()}*} contains ${Object.keys(this.data).length} items.</p>`
    html += this.toString();
    html += this._lists(tables.glossary);

    return html.to_markup();
  }

  this._lists = function(glossary)
  {
    var html = ""

    html += `<h2>{{Glossary}}</h2>`;
    html += `<list class='tidy' style='padding-left:30px'>`
    var words = Object.keys(glossary).sort();
    for(var id in words){
      var word = words[id]
      html += `<ln>{{${word.capitalize()}}}, ${glossary[word].to_a().length} items</ln>`.to_markup()
    }
    html += `</list>`

    return html.to_markup();
  }

  this.has_tag = function()
  {
    return false
  }

  this.portal = function()
  {
    return null;
  }

  this.glyph = function()
  {
    return null;
  }

  this.to_a = function()
  {
    return Object.keys(this.data);
  }

  this.connections = function(tables)
  {
    var a = []
    for(id in tables.lexicon){
      var term = tables.lexicon[id];
      if(term.has_tag("list") && term.has_tag(this.name)){
        a.push(term)
      }
    }
    return a;
  }

  this.indexOf = function(target)
  {
    var i = 0;
    for(var id in this.data){
      if(target.toLowerCase() == id.toLowerCase()){
        return parseInt(i)
      }
      i += 1;
    }
    return -1;
  }

  this._from_object = function()
  {
    var html = ''
    for(var id in this.data){
      html += `<ln>{*${id.capitalize()}*}: ${this.data[id]}</ln>`
    }
    return html.to_markup()
  }

  this.toString = function()
  {
    return `<list>${Array.isArray(this.data) ? new Runic(this.data) : this._from_object()}</list>`
  }
}