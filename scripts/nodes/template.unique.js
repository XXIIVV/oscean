function UniqueTemplate(id,rect,...params)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.element
  
  this.archives = [];

  this.answer = function(q)
  {
    return `${q.result.long()}${this.load(q)}`
  }

  this.invoke = function(filename)
  {
    if(this.archives[filename]){ this.load(filename); return; }

    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = `scripts/unique/${filename}.js?v=${new Date().desamber()}`;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.seal = function(name,payload = null)
  {
    this.archives[name] = payload;
    Ø('query').bang();
  }

  this.load = function(q)
  {
    var filename = q.result.name.to_url()

    if(!this.archives[filename]){ this.invoke(filename); return `<p>Loading ${filename}..</p>`; }

    return this.archives[filename](q);
  }
}