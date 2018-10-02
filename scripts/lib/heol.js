"use strict";

function Heol(input,tables,host)
{
  const lib =
  {
    match: function(source,items)
    {
      const a = []
      for(const id in items){
        const name = items[id].toUpperCase();
        if(!source[name]){ continue; }
        a.push(source[name])
      }
      return a;
    },
    table: function(source)
    {
      return tables[source];
    },
    keys: function(h)
    {
      return Object.keys(h)
    },
    find: function(source,target,sub)
    {
      return source[target.toUpperCase()] ? source[target.toUpperCase()][children] : [];
    },
    echo: function(items)
    {
      return items.reduce((acc,val) => {
        return `${acc}${val}`;
      },"")
    },
    wrap: function(item,tag,cl)
    {
      return `<${tag} class='${cl ? cl : ''}'>${item}</${tag}>`
    },

    // Templaters

    template: function(items,t,p)
    {
      return items.map((val) => {
        return `${t(val,p)}`;
      })
    },
    INDEX: function(item)
    {
      return `<h3>{(${item.name.capitalize()})}</h3><p>${item.bref}</p><ul class='bullet'>${item.children.reduce((acc,term) => {
        return `${acc}<li>${term.bref}</li>`;
      },"")}</ul>`;
    },
    LINK: function(item)
    {
      return `{(${item.capitalize()})}`;
    },
    TITLE: function(item)
    {
      return `<h2>${item.name.capitalize()}</h2><h4>${item.bref}</h4>`;
    },
    PHOTO: function(item)
    {
      return host.featured_log && host.featured_log.photo != item.photo ? `<img src="media/diary/${item.photo}.jpg"/>` : '';
    },
    GALLERY: function(item)
    {
      return `${item.featured_log ? `<a data-goto='${item.name}'><img src="media/diary/${item.featured_log.photo}.jpg"/></a>` : ''}<h2>${item.name.capitalize()}</h2><h4>${item.bref}</h4>`;
    }
  }

  Lisp.call(this,input,lib)
}