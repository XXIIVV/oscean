function SpecialTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.archives = [];

  this.answer = function(q)
  {
    return `${q.result.long()}${this.load(q.result.name.to_url())}`
  }

  this.invoke = function(filename)
  {
    if(this.archives[filename]){ this.load(filename); return; }

    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = `scripts/special/${filename}.tome?v=${new Date().desamber()}`;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.seal = function(name,payload = null)
  {
    this.archives[name] = payload;
    Ø('query').bang();
  }

  this.load = function(filename)
  {
    if(!this.archives[filename]){ this.invoke(filename); return `<p>Loading ${filename}..</p>`; }

    var data = new Indental(this.archives[filename]).parse()
    var html = ""
    for(id in data){
      var seg = data[id]
      html += `<h3>${id.capitalize()}</h3>${new Runic(seg)}`
    }
    return html;
  }
}