
function graph()
{
  Ø("query").create({x:2,y:4},QueryNode)

  Ø("model").mesh({x:6,y:0},[
    Ø("router").create({x:4,y:2},RouterNode),
    Ø("database").create({x:4,y:8},DatabaseNode),
    Ø("db_lexicon").create({x:2,y:14},IndentalNode),
    Ø("db_horaire").create({x:6,y:14},CollectionNode),
  ])

  Ø("assoc").mesh({x:19,y:0},[
    Ø("template").create({x:2,y:2},TemplateNode),
    // Ø("page").create({x:2,y:8},PageTemplate),
    // Ø("search").create({x:5,y:14},SearchTemplate),
    // Ø("index").create({x:8,y:14},IndexTemplate),
    // Ø("home").create({x:2,y:14},HomeTemplate),
    // Ø("recipe").create({x:5,y:8},RecipeTemplate),
    // Ø("ingredient").create({x:8,y:8},IngredientTemplate),
  ])

  // Ø("client").mesh({x:32,y:0},[
  //   // Ø("document").create({x:2,y:2},DocumentNode),
  //   // Ø("view").create({x:2,y:6},DomNode),
  //   // Ø("header").create({x:2,y:11},DomNode),
  //   // Ø("logo").create({x:2,y:16},DomNode,"wr",`<a href='#home' onclick="Ø('query').bang('home')"><img src='media/interface/logo.png'/></a>`),
  //   // Ø("menu").create({x:6,y:16},DomNode,"list"),
  //   // Ø("core").create({x:10,y:11},DomNode),
  //   // Ø("content").create({x:10,y:16},DomNode),
  //   // Ø("related").create({x:14,y:16},DomNode,"list"),
  //   // Ø("footer").create({x:6,y:11},DomNode,"wr",`<a onclick="Ø('query').bang('index')">See All Recipes List</a><br/><a onclick="Ø('query').bang('about')">Grimgrains</a> © 2014—2018<br/><a href='http://100r.co/' target='_blank'>Hundred Rabbits</a>`),
  // ])

  // Model
  Ø("router").syphon("database")
  Ø("database").syphon(["db_lexicon","db_horaire"])

  // Assoc
  // Ø("template").syphon(["recipe","ingredient","page"])
  // Ø("page").syphon(["home","search","index"])

  // Ø("template").connect(["view","document"])
  // Ø("view").bind(["header","core","footer"])
  // Ø("core").bind(["content","related"])
  // Ø("header").bind(["logo","menu"])

  Ø("query").connect("router")
  Ø("router").connect("template")

  Ø("query").bang()
}
