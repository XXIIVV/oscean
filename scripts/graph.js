'use strict';

function graph()
{
  Ø("query").create({x:2,y:2},QueryNode)
  Ø("keyboard").create({x:2,y:6},KeyboardNode)
  Ø("mouse").create({x:2,y:10},MouseNode)

  Ø("services").mesh({x:6,y:21},[
    Ø("rss").create({x:2,y:2},RssNode)
  ])

  Ø("model").mesh({x:6,y:0},[
    Ø("router").create({x:5,y:2},RouterNode),
    Ø("database").create({x:8,y:8},DatabaseNode),
      Ø("dictionaery").create({x:2,y:14},TableNode,Tablatal,Aeth),
      Ø("lexicon").create({x:5,y:14},TableNode,Indental,Term),
      Ø("horaire").create({x:8,y:14},TableNode,Tablatal,Log),
      Ø("issues").create({x:11,y:14},TableNode,Tablatal,Issue),
      Ø("glossary").create({x:14,y:14},TableNode,Indental,List),
    Ø("map").create({x:11,y:8},MapNode),
  ])

  Ø("assoc").mesh({x:25,y:0},[
    Ø("build").create({x:5,y:2},BuildNode),
    Ø("_navi").create({x:2,y:8},BuildNaviNode),
    Ø("_sidebar").create({x:5,y:8},BuildSidebarNode),
    Ø("_content").create({x:8,y:8},BuildContentNode),
      Ø("missing").create({x:2,y:20},MissingTemplate),
      Ø("index").create({x:5,y:20},IndexTemplate),
      Ø("default").create({x:2,y:14},DefaultTemplate),
      Ø("home").create({x:5,y:14},HomeTemplate),
      Ø("journal").create({x:8,y:14},JournalTemplate),
      Ø("tracker").create({x:11,y:14},TrackerTemplate),
      Ø("calendar").create({x:14,y:14},CalendarTemplate),
  ])

  Ø("client").mesh({x:44,y:0},[
    Ø("view").create({x:2,y:2},DocumentNode),
    Ø("style").create({x:5,y:8},DomNode,"style"),
    Ø("terminal").create({x:8,y:8},TerminalNode),
    Ø("header").create({x:2,y:8},DomNode),
      Ø("photo").create({x:2,y:14},PhotoNode,"photo"),
      Ø("logo").create({x:8,y:14},DomNode,"div",`<a data-goto='home' href='#home'></a>`),
      Ø("menu").create({x:5,y:14},DomNode),
        Ø("search").create({x:2,y:20},InputNode),
        Ø("activity").create({x:5,y:20},DomNode),
      Ø("info").create({x:11,y:14},DomNode),
        Ø("glyph").create({x:11,y:20},PathNode),
        Ø("title").create({x:8,y:20},DomNode),
    Ø("core").create({x:14,y:8},DomNode),
      Ø("content").create({x:14,y:14},DomNode),
      Ø("sidebar").create({x:17,y:14},DomNode),
        Ø("bref").create({x:14,y:20},DomNode),
        Ø("icon").create({x:17,y:20},DomNode),
      Ø("navi").create({x:20,y:14},DomNode,"ul"),
    Ø("footer").create({x:23,y:8},DomNode),
      Ø("credits").create({x:23,y:14},DomNode,"div",`
        <a target='_blank' href="https://twitter.com/neauoire" class="icon twitter external"></a>
        <a target='_blank' href="https://github.com/neauoire" class="icon github external"></a>
        <a target='_blank' href="http://webring.xxiivv.com/#random" class="icon rotonde"></a>
        <a target='_blank' href="https://creativecommons.org/licenses/by-nc-sa/4.0/" class="icon cc"></a>
        <a data-goto='devine lu linvega' href='#devine+lu+linvega'>Devine Lu Linvega</a> © 06I04—${new Date().desamber()}
        <center><a data-goto='About' href='#About'>BY-NC-SA 4.0</a> <t style="color:#ccc"'>${new Oneralie()}</t></center>
        <a target='_blank' href="http://100r.co" class="icon hundredrabbits"></a><hr>
      `),
  ])

  // Model
  Ø("router").syphon("database")
  Ø("database").syphon(["dictionaery","issues","horaire","glossary","lexicon"])
  Ø("query").connect("router")
  Ø("database").connect("map")
  Ø("router").connect("build")

  // Assoc
  Ø("build").syphon(["_navi","_content","_sidebar"])
  Ø("_content").syphon(["default","journal","tracker","home","calendar"])
  Ø("build").connect(["view"])
  Ø("default").syphon(["missing","index"])

  // Dom
  Ø("header").bind(["logo","photo","menu","info"])
  Ø("info").bind(["glyph","title"])
  Ø("menu").bind(["search","activity"])
  Ø("view").bind(["header","core","footer","terminal","style"])
  Ø("core").bind(["sidebar","content","navi"])
  Ø("sidebar").bind(["bref","icon"])
  Ø("footer").bind(["credits"])

  // Start
  Ø("query").bang()
}