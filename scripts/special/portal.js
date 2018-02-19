function portal_view()
{
  this.html = function()
  {
    var html = "";

    var list = [];
    for(id in invoke.vessel.lexicon.terms){
      var term = invoke.vessel.lexicon.terms[id];
      list.push(term.name)
    }

    list.sort();

    var prev_n = "";
    for(id in list){
      var name = list[id];
      if(parseInt(name) > 0){ continue; }
      if(prev_n != name.substr(0,1)){
        html += `<h2 class='book' style='margin-bottom:0px'>${name.substr(0,1)}</h2>`
      }
      html += `<ln style='margin-bottom:10px'>${invoke.vessel.lexicon.find(name).bref}</ln>`;
      prev_n = name.substr(0,1);
    }

    return `<list class='tidy'>${html}</list>`;
  }
}; 

var payload = new portal_view();

invoke.vessel.seal("special","portal",payload);