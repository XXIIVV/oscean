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
    var click = !external ? `Ø('query').bang('${target}')` : ''
    var view = this.force_external || external ? '_blank' : '_self'
    var className = external ? 'external' : 'local'

    return `<a href='${href}' title='${target}' onclick="${click}" class='${className}' target='${view}'>${name ? name : target}</a>`
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
    if(!matches){ return `${i}`; }

    matches.forEach(el => {
      this.text = this.text.replace(`{${el}}`,parse(el))
    })
    return this.text
  }
}

String.prototype.to_curlic = function(force_external){ return `${new Curlic(this,force_external)}`; }
