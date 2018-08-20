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
    var html = `<p>The {*${this.name.capitalize()}*} list contains ${Object.keys(this.data).length} items.</p>`
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
      html += `<ln>{{${word.capitalize()}}}, ${glossary[word].to_a().length} words</ln>`.to_markup()
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

  this._from_array = function()
  {
    var html = ''
    for(var id in this.data){
      html += `<ln>${this.data[id]}</ln>`
    }
    return html.to_markup()
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
    return `<list>${Array.isArray(this.data) ? this._from_array() : this._from_object()}</list>`
  }
}