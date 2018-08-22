function Runic(lines = [])
{
  this.lines = lines;

  var runes = {
    "&":{tag:"p"},
    "?":{tag:"p",class:"note"},
    "-":{tag:"ln",wrapper:"list"},
    "#":{tag:"ln",wrapper:"code"},
    "*":{tag:"h2"},
    "+":{tag:"hs"},
    "@":{tag:"quote",fn:quote},
    "%":{fn:media},
    ">":{}
  }

  function is_runic(l)
  {
    var rune = l.substr(0,1);
    var trail = l.substr(1,1);

    if(trail != " "){ console.warn("Non-Runic",l); return false; }
    if(!runes[rune]){ console.warn(`Non-Runic[${rune}]`,l); return false; }

    return true;
  }

  function stash(acc,l)
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
      var r = runes[stash.rune]
      var str = r.fn ? r.fn(stash.a[id]) : stash.a[id]
      html += r.tag ? `<${r.tag} class='${r.class ? r.class : ''}'>${str}</${r.tag}>` : `${str}`
    }
    return wr ? `${acc}<${wr}>${html}</${wr}>` : `${acc}${html}`
  }

  // Templates  

  function quote(content)
  {
    var parts = content.split(" | ")
    var text = parts[0].trim()
    var author = parts[1]
    var source = parts[2]
    var link = parts[3]

    return `
      ${text.length > 1 ? `<p class=\'text\'>${text}</p>` : ''}
      ${author ? `<p class='attrib'>${author}${source && link ? `, {{${source}|${link}}}` : source ? `, <b>${source}</b>` : ''}</p>` : ''}`
  }

  function media(content)
  {
    var service = content.split(" ")[0];
    var id = content.split(" ")[1];

    if(service == "itchio"){ return `<iframe frameborder="0" src="https://itch.io/embed/${id}?link_color=000000" width="600" height="167"></iframe>`; }
    if(service == "bandcamp"){ return `<iframe style="border: 0; width: 600px; height: 274px;" src="https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=ffffff/linkcol=333333/artwork=small/transparent=true/" seamless></iframe>`; }
    if(service == "youtube"){ return `<iframe width="100%" height="380" src="https://www.youtube.com/embed/${id}?rel=0" style="max-width:700px" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`; }
    if(service == "custom"){ return `<iframe src='${id}' style='width:100%;height:350px;'></iframe>`; }
    return `<img src='media/${service}' class='${id}'/>`
  }

  // 

  this.toString = function()
  {
    var lines = this.lines.filter(is_runic);
    return lines.reduce(stash,[]).reduce(_html,"");
  }
}
