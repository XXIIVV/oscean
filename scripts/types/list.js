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

  this.body = function()
  {
    return `<ul>${Object.keys(this.data).reduce((acc,val) => { 
      return `${acc}<li>{*${val.capitalize()}*}: ${this.data[val]}</li>`; 
    },"")}</ul>`.to_curlic();
  }

  this.toString = function(q)
  {
    return `<h3>${name.capitalize()}</h3>${this.body()}`;
  }
}