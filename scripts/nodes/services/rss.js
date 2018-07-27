function RssNode(id,rect)
{
  Node.call(this,id,rect);

  this.glyph = NODE_GLYPHS.builder

  this.receive = function(q)
  {
    console.log('Generating Rss');

    var logs = Ø('router').cache.tables.horaire;

    var selection = []
    for(id in logs){
      var log = logs[id];
      if(selection.length >= 30){ break; }
      if(log.time.offset() > 0){ continue; }
      if(!log.photo){ continue; }
      selection.push(log);
    }

    var html = this.render(selection)
    var win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=640,height=480,top="+(screen.height-200)+",left="+(screen.width-640));
    win.document.body.innerHTML = `<pre>${html.to_entities()}</pre>`;

    console.log('Generating Rss<done>',);
  }


  this.items = function(logs)
  {
    var html = ""
    for(id in logs){
      var log = logs[id];
      html += `
  <item>
    <title>${log.name}</title>
    <link>http://wiki.xxiivv.com/${log.term.to_url()}</link>
    <pubDate>${log.time.to_date().to_rss()}</pubDate>
    <description>
      &lt;img src="https://wiki.xxiivv.com/media/diary/${log.photo}.jpg"/&gt;
      &lt;br/&gt;
      ${log.host.dict.BREF ? log.host.dict.BREF.to_markup(true).to_rss() : ''}
    </description>
  </item>
`
    }
    return html;
  }

  this.render = function(logs)
  {
    return `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>XXIIVV — Journal</title>
  <link>https://wiki.xxiivv.com/</link>
  <description>Devine Lu Linvega's Journal</description>
  <generator>https://wiki.xxiivv.com/Riven</generator>
  <author>
    <name>Devine Lu Linvega</name>
  </author>
  ${this.items(logs)}
</channel>

</rss>`
  }
}