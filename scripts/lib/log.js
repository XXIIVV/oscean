function Log(list)
{
  this.list = list;
  this.term = this.list.term;
  this.name = this.list.name;
  this.text = this.list.text;
  this.time = this.list.date ? new Desamber(this.list.date) : null;

  this.code = this.list.code;
  this.rune = this.code.substr(0,1);
  this.sector = ["misc","audio","visual","research","misc"][parseInt(this.code.substr(1,1))]
  this.value  = parseInt(this.code.substr(2,1)) > 0 ? parseInt(this.code.substr(2,1)) : 0;
  this.vector = parseInt(this.code.substr(3,1)) > 0 ? parseInt(this.code.substr(3,1)) : 0;
  this.task   = make_task(parseInt(this.code.substr(1,1)),this.vector)
  
  this.photo = this.list.pict ? parseInt(this.list.pict) : null;

  this.is_featured = this.photo && (this.rune == "!" || this.rune == "+");
  this.is_event = this.rune == "+" || this.vector > 9;

  this.toString = function()
  {
    return `
    <log class='${this.sector} ${this.is_event > 0 ? 'event' : ''} ${this.time.offset() == 0 ? 'today' : ''}' title='${this.term} ${this.task} +${this.value}${this.vector}'>
      <t class='flag date'>${this.time}</t>
      <t class='term'>{{${this.term}}}</t> 
      <t class='task'>${this.task.capitalize()}</t>
      <t class="action">${this.name ? '— Added a new diary \"<b>'+this.name+'</b>\"' : this.photo > 0 ? 'Added <b>untitled media #'+this.photo+'</b>' : ''}</t>
      ${this.time.offset() >= 0 ? '<t class="offset">'+this.time.offset_format()+'</t> ' : ''}
      ${this.value > 0 && this.vector > 0 ? `<t class='flag value'>+${((this.value+this.vector)/2).toFixed(1)}h</t>` : ''}
    </log>`.to_markup()
  }

  function make_task(sector,vector)
  {
    var collection = [
      ["idle", "listening" , "experiment" , "rehersal"      , "draft"     , "composition" , "sound design", "mastering" , "release" , "performance" ],
      ["idle", "watching"  , "experiment" , "storyboard"    , "prototype" , "editing"     , "design"      , "rendering" , "release" , "showcase" ],
      ["idle", "research"  , "experiment" , "documentation" , "planning"  , "maintenance" , "tooling" , "updating"  , "release" , "talk" ]
    ]
    return collection[sector-1] && collection[sector-1][vector] ? collection[sector-1][vector] : "travel"
  }
}