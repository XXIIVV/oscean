'use strict';

function List(name,data)
{
  Entry.call(this,name,data);

  this.bref  = `The {(${this.name.capitalize()})} word list.`
  this.unde  = 'Glossary'
  this.index = true;

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

  this.find_related = function()
  {
    const a = []
    const terms = Ø("database").cache.lexicon;
    for(const id in terms){
      const term = terms[id];
      if(term.has_tag(this.name)){
        a.push(term);
      }
    }
    return a;
  }

  this._related = function()
  {
    const a = this.find_related();
    return `<p class='note'>The {*${this.name.capitalize()}*} list is part of "{(${a[0].name.capitalize()})}".</p>`.to_curlic()
  }

  this._from_object = function()
  {
    return Object.keys(this.data).reduce((acc,val) => { 
      return `${acc}<li>{*${val.capitalize()}*}: ${this.data[val]}</li>`; 
    },"").to_curlic()
  }

  this.toString = function(q)
  {
    return `<ul>${Array.isArray(this.data) ? new Runic(this.data) : this._from_object()}</ul>${q ? this._related() : ''}`.to_curlic();
  }
}