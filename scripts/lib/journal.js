function Journal(logs = [])
{
  this.logs = logs;

  this.term = null;
  this.sector = null;

  this.push = function(log)
  {
    if(!log.host){ return; }
    this.logs.push(log)
  }

  this.update = function()
  {
    this.term = this.logs[0].term;
    this.sector = this.logs[0].sector;
    this.time = this.logs[0].time;
    this.photo = null;
    this.horaire = new Horaire(this.logs);
  }

  // Fragments

  this._glyph = function()
  {
    return `
    <svg onclick="Ø('query').bang('${this.term}')" class='icon'><path transform="scale(0.15,0.15) translate(20,20)" d="${this.logs[0].host.glyph()}"></path></svg>`
  }

  this._head = function()
  {
    return `
    <yu class='head'>
      <a class='topic' onclick="Ø('query').bang('${this.term}')">${this.term}</a>
      <t class='time' onclick="Ø('query').bang('${this.term}:Journal')">${this.time.ago()}${this.logs.length > 1 ? `, from ${this.logs[0].time} to ${this.logs[this.logs.length-1].time}` : ''}</t>
    </yu>`
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

  this._issues = function()
  {
    var html = ''
    var issues = this.logs[0].host.issues;

    for(id in issues){
      var issue = issues[id]
      html += `${issue}`
    }
    return html
  }

  this._tags = function()
  {
    var html = ''
    html += this.logs[0].host && this.logs[0].host.parent ? `<a class='tag' onclick="Ø('query').bang('${this.logs[0].host.parent.name.capitalize()}')">${this.logs[0].host.parent.name.to_path()}</a> ` : ''
    for(id in this.horaire.tasks){
      html += `<a class='tag' onclick="Ø('query').bang('${id}')">${id}</a> `
    }
    return `<yu class='tags'>${html}<t class="focus">${this.horaire.sum}</t></yu>`
  }

  this.toString = function()
  {
    if(this.logs.length < 1){ return ''; }

    this.update();

    var html = ""

    html += this._glyph()
    html += this._head()
    html += this._photo()
    html += this._issues()
    html += this._tags()

    return `<log class='entry ${this.sector}'>${html}</log>`
  }
}