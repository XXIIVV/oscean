function graph()
{
  Ø("query").create({x:2,y:4},QueryNode)

  Ø("model").mesh({x:6,y:0},[
    Ø("router").create({x:4,y:2},RouterNode),
    Ø("database").create({x:4,y:9},DatabaseNode),
    Ø("lexicon").create({x:2,y:16},IndentalNode,Term),
    Ø("horaire").create({x:6,y:16},CollectionNode,Log)
  ])

  Ø("assoc").mesh({x:16,y:0},[
    Ø("template").create({x:11,y:2},TemplateNode),
      Ø("home").create({x:20,y:11},HomeTemplate),
    Ø("page").create({x:5,y:11},PageTemplate),
      Ø("missing").create({x:2,y:16},MissingTemplate),
      Ø("journal").create({x:5,y:16},JournalTemplate),
      Ø("death").create({x:8,y:16},DeathTemplate),
    Ø("diary").create({x:2,y:11},DiaryTemplate),
    Ø("portal").create({x:8,y:11},PortalTemplate),
    Ø("index").create({x:14,y:11},IndexTemplate),
    Ø("docs").create({x:11,y:16},DocsTemplate),
      Ø("lietal").create({x:11,y:25},IndentalNode),
      Ø("directory").create({x:8,y:25},IndentalNode),
      Ø("epistemology").create({x:5,y:25},IndentalNode),
      Ø("glossary").create({x:14,y:25},IndentalNode),
      Ø("japanese").create({x:2,y:25},IndentalNode),
      Ø("russian").create({x:17,y:25},IndentalNode),
      Ø("tiers").create({x:20,y:25},IndentalNode),
    Ø("calendar").create({x:17,y:11},CalendarTemplate),
  ])

  Ø("client").mesh({x:40,y:0},[
    Ø("document").create({x:2,y:2},DocumentNode),
    Ø("view").create({x:2,y:6},DomNode),
    Ø("style").create({x:10,y:11},DomNode,"style"),
    Ø("header").create({x:2,y:11},DomNode),
      Ø("photo").create({x:2,y:16},DomNode,"photo"),
      Ø("logo").create({x:10,y:16},DomNode,"yu",`<a onclick="Ø('query').bang('home')"></a>`),
      Ø("menu").create({x:6,y:16},DomNode),
        Ø("search").create({x:2,y:21},InputNode),
        Ø("activity").create({x:6,y:21},DomNode),
      Ø("info").create({x:14,y:16},DomNode),
        Ø("glyph").create({x:14,y:21},PathNode),
        Ø("title").create({x:10,y:21},DomNode),
    Ø("core").create({x:18,y:11},DomNode),
      Ø("content").create({x:18,y:16},DomNode),
      Ø("sidebar").create({x:22,y:16},DomNode),
        Ø("bref").create({x:18,y:21},DomNode),
        Ø("icon").create({x:22,y:21},DomNode),
      Ø("navi").create({x:26,y:16},DomNode,"list"),
    Ø("footer").create({x:6,y:11},DomNode,"yu",`
      <wr>
    <a href="https://twitter.com/neauoire" class="icon twitter external"></a><a href="https://github.com/neauoire" class="icon github external"></a><a href="Rotonde" class="icon rotonde"></a>
    <yu id="clock" onclick='Ø("query").bang("Clock")'>${new Clock().svg(35,35)}</yu><a onclick="Ø('query').bang('devine lu linvega')">Devine Lu Linvega</a> © 06I04—${new Date().desamber()}<br>BY-NC-SA 4.0 <t style="color:#ccc"'>${new Clock()}</t><hr></wr>`),
  ])

  // Operation

  Ø("runic").mesh({x:16,y:32},[
    Ø("operation").create({x:5,y:2},OperationNode),
    Ø("en_li").create({x:5,y:9},LietalNode),
    Ø("li_en").create({x:2,y:9},LietalNode),
    Ø("clock").create({x:11,y:9},ClockNode),
    Ø("desamber").create({x:14,y:9},DesamberNode),
    Ø("dictionaery").create({x:5,y:16},CollectionNode),
    Ø("deconstruct").create({x:8,y:9},LietalNode),
  ])

  // Model
  Ø("en_li").syphon("dictionaery")
  Ø("li_en").syphon("dictionaery")
  Ø("deconstruct").syphon("dictionaery")
  Ø("router").syphon("database")
  Ø("database").syphon(["lexicon","horaire"])

  // Assoc
  Ø("template").syphon(["page","diary","portal","index","docs","calendar","home"])
  Ø("docs").syphon(["lietal","directory","glossary","epistemology","tiers","russian","japanese"])
  Ø("page").syphon(["missing","death","journal"])

  Ø("template").connect(["view","document"])
  Ø("header").bind(["logo","photo","menu","info"])
  Ø("info").bind(["glyph","title"])
  Ø("menu").bind(["search","activity"])
  Ø("view").bind(["header","core","footer","style"])
  Ø("core").bind(["sidebar","content","navi"])
  Ø("sidebar").bind(["bref","icon",])

  Ø("query").connect("router")
  Ø("router").connect("template")

  // Operations
  Ø("operation").syphon(["li_en","en_li","clock","desamber","deconstruct"])

  Ø("query").bang()
}
