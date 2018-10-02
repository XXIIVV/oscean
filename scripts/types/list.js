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

  this._from_object = function()
  {
    return Object.keys(this.data).reduce((acc,val) => { 
      return `${acc}<li>{*${val.capitalize()}*}: ${this.data[val]}</li>`; 
    },"").to_curlic()
  }

  this.body = function()
  {
    return `<ul>${Array.isArray(this.data) ? new Runic(this.data,Curlic,this) : this._from_object()}</ul>`;
  }

  this.toString = function(q)
  {
    return `<h3>${name.capitalize()}</h3>`.to_curlic();
  }
}