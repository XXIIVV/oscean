function MAKE_DEATH(q)
{
  var html = "";
  var birth = new Date("1986-03-22");
  var now = Date.now();
  var offset = (now - birth)/1000/86400;
  var end = new Date((1986+52)+"-03-22")
  var y = 0;

  while(y < 52){
    var w = 0;
    while(w < 52){
      var day = (w * 7) + (365 * y);
      html += "<cell class='"+(day > offset ? 'past' : 'future')+"'></cell>";
      w += 1;
    }
    html += "<hr />"
    y += 1;
  }

  html += `
  <style>
    yu.death { width: 700px;margin-bottom:45px}
    yu.death cell { background:black; width:12.45px; height:5px; display:block; float:left; border-radius:10px; margin:0px 1px 1px 0px}
    yu.death cell.past { background:#fff; border:2px solid black; width:8.45px; height:1px}
    yu.death h1 { font-size: 55px;line-height: 60px;font-family: 'frank_ruhl_light';text-align: center;letter-spacing: -5px;margin-top:30px}
  </style>
  `

  return `<yu class='death'>${html}</yu>`
}

Ø("unique").seal("death",MAKE_DEATH);

function debug(horaire,lexicon)
{
  var photos = []

  for(id in horaire){
    var log = horaire[id]
    if(log.photo){ photos.push(parseInt(log.photo))}
  }

  console.log(`Next available Id: ${find_available_id(photos)}`)
}

function find_available_id(photos)
{
  var i = 1
  while(i < 999){
    if(photos.indexOf(i) < 0){ return i }
    i += 1
  }
  return i
}






