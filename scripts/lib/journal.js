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
    this.glyph = this.logs[0].host ? this.logs[0].host.glyph() : '';
    this.time = this.logs[0].time;
    this.photo = null;
    this.horaire = new Horaire(this.logs);
  }

  this.toString = function()
  {
    if(this.logs.length < 1){ return ''; }
    this.update();

    var html = ""
    // Glyph

    html += `
    <svg onclick="Ø('query').bang('${this.term}')" class='icon'>
      <path transform="scale(0.15,0.15) translate(20,20)" d="${this.glyph}"></path>
    </svg>`

    html += `
    <yu class='head'>
      <a class='topic' onclick="Ø('query').bang('${this.term}')">${this.term}</a>
      <t class='time' onclick="Ø('query').bang('${this.name}:Journal')">${this.time.ago()}${this.logs.length > 1 ? `, from ${this.logs[0].time} to ${this.logs[this.logs.length-1].time}` : ''}</t>
    </yu>`

    // Diaries
    for(id in this.logs){
      var log = this.logs[id];
      if(!log.name){ continue; }
      if(!log.photo){ continue; }
      html += `<p>${log.name}</p><photo style='background-image:url(media/diary/${log.photo}.jpg)' onclick="Ø('query').bang('${log.term}')"></photo>`
      break;
    }

    // Tags
    html += `<yu class='tags'>`
    for(id in this.horaire.tasks){
      html += `<a class='tag' onclick="Ø('query').bang('${id}')">${id}</a> `
    }
    html += `<t class="focus">${this.horaire.sum}</t></yu>`

    return `<log class='entry ${this.sector}'>${html}</log>`
  }
}