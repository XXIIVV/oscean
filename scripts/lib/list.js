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

  this.toString = function()
  {
    var html = ""
    for(var id in this.data){
      html += `<ln>{*${id.capitalize()}*}: ${this.data[id]}</ln>`
    }
    return `<list>${html}</list>`.to_markup()
  }

  this.unde = function()
  {
    return this.name;
  }

  this.bref = function()
  {
    return `The {{${this.name.capitalize()}}} word list.`.to_markup()
  }

  this.long = function(tables)
  {
    var html = `<p>The {*${this.name.capitalize()}*} list contains ${Object.keys(this.data).length} words.</p>`
    html += this.toString();

    html += this._lists(tables.glossary);

    return html.to_markup();
  }

  this._lists = function(glossary)
  {
    var html = ""

    html += `<h2>Other lists</h2>`;

    html += `<list class='tidy' style='padding-left:30px'>`
    for(var id in glossary){
      html += `<ln>{{${id.capitalize()}}}, ${glossary[id].to_a().length} words</ln>`
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
}