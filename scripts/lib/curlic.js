function Curlic(text = "",origin = null)
{
  this.text = `${text}`;
  this.origin = origin;

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
    this.origin = null

    var target = t.replace("(","").replace(")","")
    var external = target.indexOf("//") > -1 || this.origin
    var name = s.replace(`(${target})`,"")
    var location = target.toLowerCase().replace(/ /g,"+").replace(/[^0-9a-z\+\:\-\.\/]/gi,"").trim();

    if(external){
      return `<a href='${target}' target='_blank' class='external'>${name ? name : target}</a>`
    }
    else{
      return `<a href='#${location}' onclick="${!external && Ø ? `Ø('query').bang('${target}')` : ''}">${name ? name : target}</a>`
    }
  }

  function evaluate(s,t)
  {
    try{
      return `${eval(t.substr(1,t.length-2))}`  
    }
    catch(err){
      console.warn("Cannot eval",t); return t
    }
  }

  function parse(s)
  {
    // Eval
    if(s.match(/\[.*\]/g)){
      s = evaluate(s,s.match(/\[.*\]/g)[0])
    }

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

    if(!matches){ return this.text; }

    matches.forEach(el => {
      this.text = this.text.replace(`{${el}}`,parse(el))
    })
    return this.text
  }
}

String.prototype.to_curlic = function(origin){ return `${new Curlic(this,origin)}`; }
