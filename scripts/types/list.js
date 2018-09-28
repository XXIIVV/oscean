'use strict';

function List(name,data)
{
  Entry.call(this,name,data);

  this.bref  = `The {(${this.name.capitalize()})} word list.`
  this.unde  = 'Glossary'
  this.index = true;

  this.connections = function(tables)
  {
    const a = []
    for(const id in tables.lexicon){
      const term = tables.lexicon[id];
      if(term.has_tag("list") && term.has_tag(this.name)){
        a.push(term)
      }
    }
    return a;
  }

  this.indexOf = function(target)
  {
    const i = 0;
    for(const id in this.data){
      if(target.toLowerCase() == id.toLowerCase()){
        return parseInt(i)
      }
      i += 1;
    }
    return -1;
  }

  this._from_object = function()
  {
    let html = ''
    for(const id in this.data){
      html += `<li>{*${id.capitalize()}*}: ${this.data[id]}</li>`
    }
    return html.to_curlic()
  }

  this.toString = function()
  {
    return `<ul>${Array.isArray(this.data) ? new Runic(this.data) : this._from_object()}</ul>`.to_curlic();
  }
}