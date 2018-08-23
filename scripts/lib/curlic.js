function Curlic(text = "",force_external = false)
{
  this.text = text;

  var runes = {
    "*":{tag:"b"},
    "_":{tag:"i"},
    "#":{tag:"code"},
    "$":{tag:"t",fn:eval},
  }

  function wrap(s,c,r)
  {
    s = s.replace(c,'').replace(c,'');

    if(r.fn){
      s = s.replace(s,r.fn(s));
    }

    return `<${r.tag}>${s}</${r.tag}>`
  }

  function link(s,t)
  {
    var target = t.replace("(","").replace(")","")
    var external = target.indexOf("//") > -1
    var name = s.replace(`(${target})`,"")
    var href = this.force_external ? 'https://wiki.xxiivv.com/'+target.url() : !external ? `#${target.to_url()}` : target
    var click = `Ø('query').bang('${target}')`
    var view = this.force_external || external ? '_blank' : '_self'
    var className = external ? 'external' : 'local'

    return `<a href='${href}' title='${target}' onclick="${click}" class='${className}' target='${view}'>${name ? name : target}</a>`
  }

  function parse(s)
  {
    // Wrap
    for(var ch in runes){
      var rune = runes[ch];
      if(s.count(ch) < 2){ continue; }
      s = wrap(s,ch,rune)
    }

    // Link
    if(s.match(/\(.*\)/g)){
      s = link(s,s.match(/\(.*\)/g)[0])
    }
    
    return s
  }

  this.extract = function()
  {
    return this.text.match(/[^{\}]+(?=})/g);
  }

  this.toString = function()
  {
    var matches = this.extract();
    if(!matches){ return `${i}`; }

    matches.forEach(el => {
      this.text = this.text.replace(`{${el}}`,parse(el))
    })
    return this.text
  }
}

String.prototype.replace_all = function(search, replacement){ return `${this}`.split(search).join(replacement); };
String.prototype.capitalize = function(){ return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase(); }
String.prototype.to_curlic = function(force_external){ return `${new Curlic(this,force_external)}`; }
String.prototype.to_url = function(){ return this.toLowerCase().replace(/ /g,"+").replace(/[^0-9a-z\+\:\-\.\/]/gi,"").trim(); }
String.prototype.to_path = function(){ return this.toLowerCase().replace(/\+/g,".").replace(/ /g,".").replace(/[^0-9a-z\.\-]/gi,"").trim(); }
String.prototype.to_entities = function(){ return this.replace(/[\u00A0-\u9999<>\&]/gim, function(i) { return `&#${i.charCodeAt(0)}`; }); }
String.prototype.to_rss = function(){ return this.replace(/\</g,"&lt;").replace(/\>/g,"&gt;") }
String.prototype.count=function(c) { var r = 0, i = 0; for(i;i<this.length;i++)if(this[i]==c) r++; return r; }
