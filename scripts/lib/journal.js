function Journal(logs = [])
{
  this.logs = logs;

  this.term = null;
  this.sector = null;

  this.push = function(log)
  {
    if(!log.host){ return; }

    if(log.term){ this.term = log.term }
    if(log.sector){ this.sector = log.sector }
    if(log.time && !this.time){ this.time = log.time }

    this.logs[logs.length] = log
  }

  // Fragments

  this._glyph = function()
  {
    return `<svg onclick="Ø('query').bang('${this.term}')" class='icon'><path transform="scale(0.15,0.15) translate(20,20)" d="${this.logs[0].host.glyph()}"></path></svg>`
  }

  this._head = function()
  {
    return `
    <div class='head'>
      <a class='topic' onclick="Ø('query').bang('${this.term}')">${this.term}</a>
      <t class='time' onclick="Ø('query').bang('${this.term}:Journal')">${this.logs[0].time.ago()}${this.logs.length > 1 ? `, from ${this.logs[0].time} to ${this.logs[this.logs.length-1].time}` : ''}</t>
    </div>`
  }

  this._photo = function()
  {
    var diary = null;
    for(id in this.logs){
      var log = this.logs[id];
      if(!log.name){ continue; }
      if(!log.photo){ continue; }
      return `<p>${log.name}</p><photo style='background-image:url(media/diary/${log.photo}.jpg)' onclick="Ø('query').bang('${log.term}')"></photo>`
    }
    return ''
  }

  this._bref = function()
  {
    if(!this.logs[0].host){ return ''; }

    return `<p class='bref'>${this.logs[0].host.bref()}</p>`
  }

  this._tags = function()
  {
    var html = ''
    html += this.logs[0].host && this.logs[0].host.parent ? `<a class='tag' onclick="Ø('query').bang('${this.logs[0].host.parent.name.capitalize()}')">${this.logs[0].host.parent.name.to_path()}</a> ` : ''

    var horaire = new Horaire(this.logs);

    for(id in horaire.tasks){
      html += `<a class='tag' onclick="Ø('query').bang('${id}')">${id}</a> `
    }
    return `<div class='tags'>${html}<t class="focus">${horaire.sum}</t></div>`
  }

  this.toString = function()
  {
    if(this.logs.length < 1){ return ''; }

    var html = ""

    html += this._glyph()
    html += this._head()
    html += this._photo()
    html += this._bref()
    html += this._tags()

    return `<log class='entry ${this.sector}'>${html}</log>`
  }
}