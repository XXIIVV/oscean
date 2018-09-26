'use strict';

function Runic(lines = [],templater = null)
{
  this.lines = lines;

  const runes = {
    "&":{tag:"p"},
    "?":{tag:"p",class:"note"},
    "-":{tag:"li",wrapper:"ul"},
    "#":{tag:"li",wrapper:"code"},
    "*":{tag:"h3"},
    "+":{tag:"hs"},
    "@":{tag:"quote",fn:quote},
    "|":{tag:"tr",wrapper:"table",fn:table},
    "%":{fn:media},
    ">":{}, 
  }

  function is_runic(l)
  {
    let rune = l.substr(0,1);
    let trail = l.substr(1,1);

    if(trail != " "){ console.warn("Non-Runic",l); return false; }
    if(!runes[rune]){ console.warn(`Non-Runic[${rune}]`,l); return false; }

    return true;
  }

  function stash(acc,l)
  {
    let rune = l.substr(0,1)
    let line = l.substr(2)
    let prev = acc[acc.length-1] ? acc[acc.length-1] : [{rune:rune,a:[]}]

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
    let html = ""
    let wr = runes[stash.rune].wrapper
    for(let id in stash.a){
      let r = runes[stash.rune]
      let txt = r.fn ? r.fn(stash.a[id]) : stash.a[id]
      let htm = templater ? new templater(txt) : txt
      html += r.tag ? `<${r.tag} class='${r.class ? r.class : ''}'>${htm}</${r.tag}>` : `${htm}`
    }
    return wr ? `${acc}<${wr}>${html}</${wr}>` : `${acc}${html}`
  }

  // Templates

  function quote(content)
  {
    let parts = content.split(" | ")
    let text = parts[0].trim()
    let author = parts[1]
    let source = parts[2]
    let link = parts[3]

    return `
      ${text.length > 1 ? `<p class=\'text\'>${text}</p>` : ''}
      ${author ? `<p class='attrib'>${author}${source && link ? `, <a href='${link}'>${source}</a>` : source ? `, <b>${source}</b>` : ''}</p>` : ''}`
  }

  function media(content)
  {
    let service = content.split(" ")[0];
    let id = content.split(" ")[1];

    if(service == "itchio"){ return `<iframe frameborder="0" src="https://itch.io/embed/${id}?link_color=000000" width="600" height="167"></iframe>`; }
    if(service == "bandcamp"){ return `<iframe style="border: 0; width: 600px; height: 274px;" src="https://bandcamp.com/EmbeddedPlayer/album=${id}/size=large/bgcol=ffffff/linkcol=333333/artwork=small/transparent=true/" seamless></iframe>`; }
    if(service == "youtube"){ return `<iframe width="100%" height="380" src="https://www.youtube.com/embed/${id}?rel=0" style="max-width:700px" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`; }
    if(service == "custom"){ return `<iframe src='${id}' style='width:100%;height:350px;'></iframe>`; }
    return `<img src='media/${service}' class='${id}'/>`;
  }

  function table(content)
  {
    return `<td>${content.trim().replace(/ \| /g,"</td><td>")}</td>`
  }

  //

  this.toString = function()
  {
    let lines = this.lines.filter(is_runic);
    return lines.reduce(stash,[]).reduce(_html,"");
  }
}
