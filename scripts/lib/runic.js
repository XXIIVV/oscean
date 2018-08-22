function Runic(lines)
{
  this.lines = lines;

  var runes = {
    "&":{tag:"p"},
    "-":{tag:"ln",wrapper:"list"},
    "#":{tag:"ln",wrapper:"code"},
    "*":{tag:"h2"},
    "+":{tag:"hs"},
    ">":{}
  }

  function is_runic(line,runes)
  {
    var rune = line.substr(0,1);
    var trail = line.substr(1,1);

    if(trail != " "){ return false; }
    if(!runes[rune]){ return false; }

    return true;
  }

  function stash(acc,l = "")
  {
    var rune = l.substr(0,1)
    var line = l.substr(2).trim()
    var prev = acc[acc.length-1] ? acc[acc.length-1] : [{rune:rune,a:[]}]

    if(prev.rune == rune){
      prev.a.push(line)
    }
    else{
      acc.push({rune:rune,a:[line]})
    }

    return acc
  }

  function _html(acc,stash)
  {
    var html = ""
    var wr = runes[stash.rune].wrapper
    for(var id in stash.a){
      var tag = runes[stash.rune].tag;
      html += tag ? `<${tag}>${stash.a[id]}</${tag}>` : `${stash.a[id]}`
    }
    return wr ? `${acc}<${wr}>${html}</${wr}>` : `${acc}${html}`
  }

  this.toString = function()
  {
    this.lines.filter(is_runic)
    return this.lines.reduce(stash,[]).reduce(_html,"");
  }
}
