function death_view()
{
  this.styles = function()
  {
    return `<style>
    yu.death { margin: 0px auto;width: 575px;background: white;padding: 45px;margin-bottom:45px}
    yu.death cell { background:black; width:10px; height:10px; display:block; float:left; border-radius:10px; margin:0px 1px 1px 0px}
    yu.death cell.past { background:#fff; border:2px solid black; width:6px; height:6px}
    yu.death h1 { font-size: 55px;line-height: 60px;font-family: 'frank_ruhl_light';text-align: center;letter-spacing: -5px;margin-top:30px}
    </style>`;
  }

  this.html = function()
  {
    var html = "";
    var birth = birth = new Date("1986-03-22");;
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
    return `<yu class='death'>${html}<hr /><h1>${((now/end)*100).toString().substr(0,4)}</h1></yu>${this.styles()}`;
  }
}; 

var payload = new death_view();

invoke.vessel.seal("special","death",payload);