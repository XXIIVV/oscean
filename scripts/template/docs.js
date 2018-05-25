function DocsTemplate(id,rect,...params)
{
  TemplateNode.call(this,id,rect);

  this.glyph = NODE_GLYPHS.template
  
  this.archives = [];

  this.answer = function(q)
  {    
    var term = q.result
    var logs = this.find_logs(q.name,q.tables.horaire)
    var diaries = this.find_diaries(logs)
    var photo_log = this.find_photo(logs)
    var siblings = this.find_siblings(term.unde(),q.tables.lexicon)
    var children = this.find_children(q.name,q.tables.lexicon)

    var filename = term.name.to_url();

    this.invoke(filename);

    return {
      title: q.name.capitalize(),
      view:{
        header:{
          photo:photo_log ? `<media style='background-image:url(media/diary/${photo_log.photo}.jpg)'></media>` : '',
          info:{title:photo_log ? `<b>${photo_log.name}</b> —<br />${photo_log.time}` : '',glyph:term.glyph},
          menu:{
            search:q.name,
            activity:`${diaries.length > 1 ? `<a id='diaries' onclick="Ø('query').bang('journal')">${diaries.length} Diaries</a>` : ''}${logs.length > 5 ? `<a id='logs' onclick="Ø('query').bang('${logs[0].time.year}')">${logs.length} Logs</a>` : ''}`
          }
        },
        core:{
          sidebar:{
            bref:make_bref(q,term,logs)
          },
          content: q.result.long()+this.load(filename),
          navi:this.make_navi(term,q.tables.lexicon)
        },
        style:""
      }
    }
  }

  this.invoke = function(filename)
  {
    if(this.archives[filename]){ this.load(filename); return; }

    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = `scripts/docs/${filename}.tome?v=${new Date().desamber()}`;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  this.seal = function(name,payload = null)
  {
    this.archives[name] = payload;
    Ø('content').update(this.load(name))
  }

  this.load = function(key)
  {
    if(!this.archives[key]){ return `<p>Failed to load ${key}.</p>`; }

    var data = new Indental(this.archives[key]).parse()
    var html = ""
    for(id in data){
      var seg = data[id]
      html += `<h3>${id.capitalize()}</h3>${new Runic(seg)}`
    }
    return html;
  }

  function make_bref(q,term,logs)
  {
    return `
    <h1>${q.result.bref()}</h1>
    <h2>
      <a onclick="Ø('query').bang('${term.unde()}')">${term.unde()}</a><br />
      <yu class='links'><a href='https://github.com/XXIIVV/Oscean/edit/master/scripts/docs/${term.name.to_url()}.tome' target='_blank'>Edit Docs</a></yu>
    </h2>`
  }
}