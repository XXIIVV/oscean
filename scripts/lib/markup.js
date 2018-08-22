function Markup(text,force_external = false)
{
  this.text = text;
  this.force_external = force_external;

  this.convert = function(part,force_external = false)
  {
    var key = `${part}`.substr(0,1);
    var val = part.replace(key,"").trim()
    
    switch(key){
      case "$": return this.operation(val); 
      case "/": return this.eval(val);
      default: return this.link(part,force_external);
    }
  }

  this.operation = function(part)
  {
    return `${Ø("operation").request(part)}`
  }

  this.eval = function(part)
  {
    return `${eval(part)}`;
  }

  this.link = function(part,force_external = false)
  {
    var target = part.indexOf("|") > -1 ? part.split("|")[1] : part;
    var name = part.indexOf("|") > -1 ? part.split("|")[0] : part;
    var external = (target.indexOf("https:") > -1 || target.indexOf("http:") > -1 || target.indexOf("dat:") > -1);
    return external || force_external ? `<a href='${!external && force_external ? 'https://wiki.xxiivv.com/':''}${force_external ? target.to_url() : target}' class='external' target='_blank'>${name}</a>` : `<a class='local' href='#${target.to_url()}' title='${target}' onclick="Ø('query').bang('${target}')">${name}</a>`
  }

  this.toString = function()
  {
    // Partial braces
    text = text.replace(/{_/g,"<i>").replace(/_}/g,"</i>").replace(/{\*/g,"<b>").replace(/\*}/g,"</b>").replace(/{\#/g,"<code class='inline'>").replace(/\#}/g,"</code>")
    // Full Braces
    var parts = uniq(text.match(/[^{{\}}]+(?=})/g));
    for(id in parts){
      text = text.replace_all(`{{${parts[id]}}}`,this.convert(parts[id],force_external))
    }
    return text;
  }

  function uniq(a){ return a ? a.reduce((x,y) => { if(x.indexOf(y) < 0 ) x[x.length] = y; return x; },[]) : []; }
}

String.prototype.replace_all = function(search, replacement){ return `${this}`.split(search).join(replacement); };
String.prototype.capitalize = function(){ return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase(); }
String.prototype.to_markup = function(force_external){ return `${new Markup(this,force_external)}`; }
String.prototype.to_url = function(){ return this.toLowerCase().replace(/ /g,"+").replace(/[^0-9a-z\+\:\-\.\/]/gi,"").trim(); }
String.prototype.to_path = function(){ return this.toLowerCase().replace(/\+/g,".").replace(/ /g,".").replace(/[^0-9a-z\.\-]/gi,"").trim(); }
String.prototype.to_entities = function(){ return this.replace(/[\u00A0-\u9999<>\&]/gim, function(i) { return `&#${i.charCodeAt(0)}`; }); }
String.prototype.to_rss = function(){ return this.replace(/\</g,"&lt;").replace(/\>/g,"&gt;") }
