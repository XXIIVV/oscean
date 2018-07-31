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
  this.vector = parseInt(this.code.substr(2,1)) > 0 ? parseInt(this.code.substr(2,1)) : 0;
  this.value  = parseInt(this.code.substr(3,1)) > 0 ? parseInt(this.code.substr(3,1)) : 0;
  this.task   = make_task(parseInt(this.code.substr(1,1)),this.vector)
  
  this.photo = this.list.pict ? parseInt(this.list.pict) : null;

  this.is_featured = this.photo && (this.rune == "!" || this.rune == "+");
  this.is_event = this.rune == "+" || this.vector > 9;

  this.host = null; // From Ø('map')

  this.toString = function()
  {
    return `
    <log class='entry ${this.is_event ? 'event' : ''} ${this.sector}'>
      <svg onclick="Ø('query').bang('${this.host.name}')" class='icon'>
        <path transform="scale(0.15,0.15) translate(20,20)" d="${this.host.glyph()}"></path>
      </svg>
      <yu class='head'>
        <a class='topic' onclick="Ø('query').bang('${this.term}')">${this.term}</a>
        <t class='time' onclick="Ø('query').bang('${this.host.name}:Journal')">${this.time.ago()}</t>
      </yu>
      ${this.name ? `<p>${this.name}</p>` : ''}
      ${this.photo ? `<photo style='background-image:url(media/diary/${this.photo}.jpg)' onclick="Ø('query').bang('${this.term}')"></photo>` : ''}
      <yu class='tags'>
        <a class='tag' onclick="Ø('query').bang('${this.host.parent.name}')">${this.host.parent.name.to_path()}</a> <t class="focus">${((this.value+this.vector)/2).toFixed(1)}</t>
      </yu>
    </log>`
  }

  function make_task(sector,vector)
  {
    var collection = [
      ["idle", "listening" , "experiment" , "rehersal"      , "draft"     , "composition" , "sound design", "mastering" , "release" , "performance" ],
      ["idle", "watching"  , "experiment" , "storyboard"    , "prototype" , "editing"     , "design"      , "rendering" , "release" , "showcase" ],
      ["idle", "research"  , "experiment" , "documentation" , "planning"  , "maintenance" , "tooling"     , "updating"  , "release" , "talk" ]
    ]
    return collection[sector-1] && collection[sector-1][vector] ? collection[sector-1][vector] : "travel"
  }
}