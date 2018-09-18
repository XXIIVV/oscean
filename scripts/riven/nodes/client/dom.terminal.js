'use strict';

function TerminalNode(id,rect,...params)
{
  DomNode.call(this,id,rect,"pre");

  this.glyph = "M65,65 L65,65 L245,65 M65,125 L65,125 L245,125 M65,185 L65,185 L245,185 M65,245 L65,245 L245,245 "

  this.bang = function(q)
  {
    if(q.substr(0,1) == "~"){ q = q.replace("~","").trim(); }

    let cmd = q.split(" ")[0]
    let par = q.substr(cmd.length,q.length-cmd.length).trim();

    if(!cmd){ return; }

    this.push(`~ <b>${cmd}${par ? '('+par+')' : ''}</b>`,125);
    this.push(`> ${this.services[cmd] ? this.services[cmd](par).trim() : this.services["unknown"](cmd)}`,250);

    Ø("search").el.value = "~"
  }

  this.push = function(txt,delay = 0)
  {
    setTimeout(() => { this.el.innerHTML = `${txt}\n${this.el.innerHTML}`; },delay)
  }

  // Services

  this.services = 
  {
    help: (q) => 
    {
      return Object.keys(this.services).reduce((acc,val) => { return acc+`— <i>${val}</i> \n`; },'Available commands:\n')
    },

    time: (q) => 
    {
      return `The current local time is <b>${new Date().desamber()} ${new Oneralie()}</b>.`;
    },

    hello: (q) => 
    {
      return `Hi.`;
    },

    dtog: (q) =>
    {
      return `${new Desamber(q).to_gregorian()}`
    },

    gtod: (q) =>
    {
      return !isNaN(new Date(q)) ? `${new Date(q).desamber()}` : "Invalid Date"
    },

    next: (q) => 
    {
      let used = []
      for(let id in Ø("database").cache.horaire){
        let log = Ø("database").cache.horaire[id]
        if(!log.photo){ continue; }
        used.push(log.photo)
      }
      let available = 1
      while(available < 999){
        if(used.indexOf(available) < 0){ return `The next available diary ID is <b>${available}</b>.`; }
        available += 1
      }
      return `There are no available diary IDs under 999.`
    },

    otd: (q) =>
    {
      let today = new Date().desamber();
      let a = []
      for(let id in Ø("database").cache.horaire){
        let log = Ø("database").cache.horaire[id]
        if(log.time.m != today.m || log.time.d != today.d){ continue; }
        a.push(log)
      }
      let html = "On This Day:\n"
      for(let id in a){
        let log = a[id]
        if(!log.term){ continue; }
        html += `— <b>${log.time}</b> ${log.is_event ? '*' : '•'} ${log.term}${log.name ? ' \"'+log.name+'\"' : ''}\n`
      }
      return html;
    },

    unknown: (q) => 
    {
      return `Unknown command <i>${q}</i>, type <i>help</i> to see available commands.`
    }
  }
}