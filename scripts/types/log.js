function Log(list)
{
  this.list = list;
  this.term = this.list.term;
  this.name = this.list.name;
  this.text = this.list.text;
  this.time = new Desamber(this.list.date);

  this.code = this.list.code;
  this.rune = this.code.substr(0,1);
  this.sector = ["misc","audio","visual","research"][parseInt(this.code.substr(1,1))]
  this.value  = parseInt(this.code.substr(2,1)) > 0 ? parseInt(this.code.substr(2,1)) : 0;
  this.vector = parseInt(this.code.substr(3,1)) > 0 ? parseInt(this.code.substr(3,1)) : 0;
  this.task   = make_task(parseInt(this.code.substr(1,1)),this.vector)
  
  this.photo = this.list.pict ? parseInt(this.list.pict) : null;

  this.is_featured = this.photo && (this.rune == "!" || this.rune == "+");
  this.is_event = this.rune == "+" || this.vector > 9;

  this.toString = function()
  {
    return `
    <log class='${this.sector} ${this.is_event > 0 ? 'event' : ''}'>
      <t class='date'>${this.time}</t>
      <t class='term'>${this.term}</t> 
      <t class='task'>${this.task.capitalize()}</t> 
      <t class="action">${this.name ? 'Added a new diary entry \"<b>'+this.name+'</b>\".' : this.photo > 0 ? 'Added an untitled media(#'+this.photo+').' : 'Logged <b>'+this.value+'h of '+this.task+'</b>.'}</t>
    </log>`
  }

  function make_task(sector,vector)
  {
    if(sector == 1){
      switch(vector) {
        case 1:return "experiment"; break;
        case 2:return "writing"; break;
        case 3:return "rehersal"; break;
        case 4:return "draft"; break;
        case 5:return "composition"; break;
        case 6:return "mastering"; break;
        case 7:return "mastering"; break;
        case 8: return "release"; break;
        case 9: return "performance"; break;
        default: return "audio"
      }
    }
    if(sector == 2){
      switch(vector) {
        case 1:return "concept"; break;
        case 2:return "sketch"; break;
        case 3:return "layout"; break;
        case 4:return "prototype"; break;
        case 5:return "draft"; break;
        case 6:return "design"; break;
        case 7:return "render"; break;
        case 8: return "release"; break;
        case 9: return "showcase"; break;
        default: return "visual"
      }
    }
    if(sector == 3){
      switch(vector) {
        case 1:return "maintenance"; break;
        case 2:return "planning"; break;
        case 3:return "documentation"; break;
        case 4:return "tools"; break;
        case 5:return "writing"; break;
        case 6:return "framework"; break;
        case 7:return "update"; break;
        case 8: return "release"; break;
        case 9: return "presentation"; break;
        default: return "research"
      }
    }
    if(sector == 4){
      switch(vector) {
        case 1:return "--"; break;
        case 2:return "--"; break;
        case 3:return "--"; break;
        case 4:return "--"; break;
        case 5:return "--"; break;
        case 6:return "--"; break;
        case 7:return "--"; break;
        case 8: return "--"; break;
        case 9: return "travel"; break;
        default: return "research"
      }
    }
    return "misc"
  }
}