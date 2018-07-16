function SpecialTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.archives = [];

  this.answer = function(q)
  {
    var term = q.result;
    return `${term.long(q.tables)}${this.load(term.name.to_url(),q.tables)}`
  }

  this.invoke = function(filename)
  {
    if(this.archives[filename.to_path()]){ this.load(filename); return; }

    console.log(filename)
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = `scripts/special/${filename.to_path()}.ndtl?v=${new Date().desamber()}`;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.seal = function(name,payload = null)
  {
    this.archives[name.to_path()] = payload;
    Ø('query').bang();
  }

  this.load = function(filename,tables)
  {
    if(!this.archives[filename.to_path()]){ this.invoke(filename); return `<p>Loading <b>/${filename.replace(/\+/g,' ')}</b>, please wait..</p>`; }

    var data = new Indental(this.archives[filename.to_path()]).parse()
    var html = ""
    for(id in data){
      var seg = data[id]
      html += `<h3>${id.capitalize()}</h3>${new Runic(seg,tables)}`
    }
    return html;
  }
}