function dictionaery_view()
{
  this.style = function()
  {
    return `<style>m2 list.dict { columns:4 !important; width:600px} list.dict ln { text-transform:capitalize;}</style>`;
  }
  
  this.html = function()
  {
    var html = "";
  
    var prev_n = "";
    for(id in invoke.vessel.lietal.dict.li_en){
      var en = invoke.vessel.lietal.dict.li_en[id];
      var li = invoke.vessel.lietal.adultspeak(id);
      if(!en){ continue; }
      if(prev_n != id.substr(0,2)){
        html += `<h2 class='book' style='margin-bottom:0px'>${id.substr(0,2)}</h2>`
      }
      html += `<ln><b>${li}</b> ${en.replace("_"," ").toLowerCase()}</ln>`;
      prev_n = id.substr(0,2);
    }

    return `${this.style()}<list class='dict'>${html}</list>`;
  }
};

var payload = new dictionaery_view();

invoke.vessel.seal("special","dictionaery",payload);