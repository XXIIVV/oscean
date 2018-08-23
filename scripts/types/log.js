function Log(data = {code:'-400'})
{
  Entry.call(this,data.name,data);

  this.host  = null; // From Ø('map')

  this.term  = data.term ? data.term.capitalize() : '';
  this.text  = data.text;
  this.time  = data.date ? new Desamber(data.date) : null;
  this.photo = data.pict ? parseInt(data.pict) : null;

  this.rune   = data.code.length == 4 ? data.code.substr(0,1) : "-"
  this.sc     = data.code.length == 4 ? parseInt(data.code.substr(1,1)) : 0
  this.ch     = data.code.length == 4 ? parseInt(data.code.substr(2,1)) : 0
  this.fh     = data.code.length == 4 ? parseInt(data.code.substr(3,1)) : 0

  this.sector      = ["misc","audio","visual","research","misc"][this.sc]
  this.is_featured = this.photo && (this.rune == "!" || this.rune == "+");
  this.is_event    = this.rune == "+" || this.vector >= 8;

  this.tasks = [
    ["idle", "listening" , "experiment" , "rehersal"      , "draft"     , "composition" , "sound design", "mastering" , "release" , "performance" ],
    ["idle", "watching"  , "experiment" , "storyboard"    , "prototype" , "editing"     , "design"      , "rendering" , "release" , "showcase" ],
    ["idle", "research"  , "experiment" , "documentation" , "planning"  , "maintenance" , "tooling"     , "updating"  , "release" , "talk" ]
  ]
  this.task   = this.tasks[this.sc-1] ? this.tasks[this.sc-1][this.ch] : 'travel';
}