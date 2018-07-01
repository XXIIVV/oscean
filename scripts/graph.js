function graph()
{
  Ø("query").create({x:2,y:4},QueryNode)

  Ø("model").mesh({x:6,y:0},[
    Ø("router").create({x:4,y:2},RouterNode),
    Ø("database").create({x:4,y:8},DatabaseNode),
    Ø("lexicon").create({x:2,y:14},TableNode,Indental,Term),
    Ø("horaire").create({x:6,y:14},TableNode,Tablatal,Log),
    Ø("map").create({x:8,y:2},MapNode),
  ])

  Ø("assoc").mesh({x:19,y:0},[
    Ø("build").create({x:6,y:2},BuildNode),
    Ø("build_navi").create({x:2,y:8},BuildNaviNode),
    Ø("build_sidebar").create({x:6,y:8},BuildSidebarNode),
    Ø("build_content").create({x:10,y:8},BuildContentNode),
      Ø("missing").create({x:2,y:14},MissingTemplate),
      Ø("default").create({x:6,y:14},DefaultTemplate),
      Ø("special").create({x:14,y:14},SpecialTemplate),
      Ø("unique").create({x:18,y:14},UniqueTemplate),
      Ø("type").create({x:10,y:14},TypeTemplate),
  ])

  Ø("client").mesh({x:42,y:0},[
    Ø("view").create({x:2,y:2},DocumentNode),
    Ø("style").create({x:6,y:8},DomNode,"style"),
    Ø("header").create({x:2,y:8},DomNode),
      Ø("photo").create({x:2,y:14},DomPhotoNode,"photo"),
      Ø("logo").create({x:10,y:14},DomNode,"yu",`<a onclick="Ø('query').bang('home')"></a>`),
      Ø("menu").create({x:6,y:14},DomNode),
        Ø("search").create({x:2,y:20},InputNode),
        Ø("activity").create({x:6,y:20},DomNode),
      Ø("info").create({x:14,y:14},DomNode),
        Ø("glyph").create({x:14,y:20},PathNode),
        Ø("title").create({x:10,y:20},DomNode),
    Ø("core").create({x:18,y:8},DomNode),
      Ø("content").create({x:18,y:14},DomNode),
      Ø("sidebar").create({x:22,y:14},DomNode),
        Ø("bref").create({x:18,y:20},DomNode),
        Ø("icon").create({x:22,y:20},DomNode),
      Ø("navi").create({x:26,y:14},DomNode,"list"),
    Ø("footer").create({x:30,y:8},DomNode),
      Ø("credits").create({x:34,y:14},DomNode,"yu",`
        <a target='_blank' href="https://twitter.com/neauoire" class="icon twitter external"></a>
        <a target='_blank' href="https://github.com/neauoire" class="icon github external"></a>
        <a target='_blank' href="http://webring.xxiivv.com/#random" class="icon rotonde"></a>
        <a onclick="Ø('query').bang('devine lu linvega')">Devine Lu Linvega</a> © 06I04—${new Date().desamber()}
        <center><a onclick="Ø('query').bang('About')">BY-NC-SA 4.0</a> <t style="color:#ccc"'>${new Clock()}</t></center>
        <a target='_blank' href="http://100r.co" class="icon hundredrabbits"></a>
        <hr>
      `),
  ])

  // Operation
  Ø("runic").mesh({x:6,y:21},[
    Ø("operation").create({x:10,y:2},OperationNode),
    Ø("li_en").create({x:2,y:9},LietalNode),
    Ø("en_li").create({x:6,y:9},LietalNode),
    Ø("deconstruct").create({x:10,y:9},LietalNode),
    Ø("clock").create({x:14,y:9},ClockNode),
    Ø("desamber").create({x:18,y:9},DesamberNode),
    Ø("dictionaery").create({x:6,y:16},TableNode,Tablatal),
  ])

  // Model
  Ø("query").connect("router")
  Ø("router").connect("map")
  Ø("map").connect("build")

  // Assoc
  Ø("build").syphon(["build_navi","build_content","build_sidebar"])
  Ø("build_content").syphon(["missing","default","type","special","unique"])
  Ø("build").connect(["view"])

  // Dom
  Ø("header").bind(["logo","photo","menu","info"])
  Ø("info").bind(["glyph","title"])
  Ø("menu").bind(["search","activity"])
  Ø("view").bind(["header","core","footer","style"])
  Ø("core").bind(["sidebar","content","navi"])
  Ø("sidebar").bind(["bref","icon"])
  Ø("footer").bind(["credits"])

  // Operations
  Ø("en_li").syphon("dictionaery")
  Ø("li_en").syphon("dictionaery")
  Ø("deconstruct").syphon("dictionaery")
  Ø("router").syphon("database")
  Ø("database").syphon(["lexicon","horaire"])
  Ø("operation").syphon(["li_en","en_li","clock","desamber","deconstruct"])

  Ø("query").bang()
}
