function InvokeNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.builder

  this.archives = {}
  this.cache = null;

  this.receive = function(q)
  {
    if(!q.result || !q.result.has_tag('invoke')){ this.send(q); return; }

    this.cache = q;
    this.invoke(this.cache.result)
  }

  this.invoke = function(target)
  {
    var filename = target.name.to_path();
    var extension = target.has_tag('indental') ? 'ndtl' : 'js'

    if(this.archives[filename]){ this.send(this.cache); return; }

    console.log("Invoking..",filename)

    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = `scripts/invoke/${filename}.${extension}?v=${new Date().desamber()}`;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.seal = function(name,payload,parser)
  {
    console.log("Sealing..",name)
    this.archives[name] = payload;

    if(!parser){
      this.cache.result.dict.LATE = payload(this.cache)  
    }
    else{
      var data = new parser(payload).parse()
      var html = ""
      for(id in data){
        var seg = data[id]
        html += `<h3>${id.capitalize()}</h3>${new Runic(seg,this.cache.tables)}`
      }
      this.cache.result.dict.LATE = html
    }
    this.send(this.cache)
  }
}