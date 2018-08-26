function Curlic(text = "",origin = null)
{
  this.text = `${text}`;
  this.origin = origin;

  const runes = {
    "*":{tag:"b"},
    "_":{tag:"i"},
    "#":{tag:"code"},
    "$":{tag:"span",fn:eval},
  }

  function wrap(s,c,r)
  {
    s = s.replace(c,'').replace(c,'');
    return `<${r.tag}>${r.fn ? s.replace(s,r.fn(s)) : s}</${r.tag}>`
  }

  function link(s,t)
  {
    let target = t.replace("(","").replace(")","")
    let external = target.indexOf("//") > -1 || this.origin
    let name = s.replace(`(${target})`,"")
    let location = target.toLowerCase().replace(/ /g,"+").replace(/[^0-9a-z\+\:\-\.\/]/gi,"").trim();
    return `<a href='${external ? target : '#'+location}' target='${external ? '_blank' : '_self'}' class='${external ? 'external' : 'local'}' data-goto='${target}'>${name ? name : target}</a>`
  }

  function evaluate(s,t)
  {
    try{
      return `${eval(t.substr(1,t.length-2))}`  
    }
    catch(err){ console.warn(`Cannot eval:${t}`,err); return t; }
  }

  function parse(s)
  {
    // Eval
    if(s.match(/\[.*\]/g)){
      let t = s.match(/\[.*\]/g)[0]
      s = s.replace(`${t}`,evaluate(s,t))
    }
    // Wrap
    for(let ch in runes){
      let rune = runes[ch];
      if(s.indexOf(ch) != 0){ continue; }
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
    let matches = this.extract();

    if(!matches){ return this.text; }
    
    matches.forEach(el => {
      this.text = this.text.replace(`{${el}}`,parse(el))
    })
    return this.text
  }
}

String.prototype.to_curlic = function(origin){ return `${new Curlic(this,origin)}`; }
