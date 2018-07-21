Ø("invoke").seal("status",(q) => 
{
  var html = ""
  var progress = {sum:0,count:0}
  var ratings = {}

  for(id in q.tables.lexicon){
    var term = q.tables.lexicon[id];
    var rating = term.rating().status
    if(!ratings[rating]){ ratings[rating] = []; }
    ratings[rating].push(term)
  }

  for(rating in ratings){
    html += `<tr><th>${rating} — ${ratings[rating].length}</th></tr>`
    for(id in ratings[rating]){
      var term = ratings[rating][id];
      var r = term.rating()
      var html_rating = ""
      for(i in r.points){
        html_rating += `<td title='${i}'>${r.points[i] ? '•' : ''}</td>`
      }
      progress.sum += r.score
      progress.count += 1
      html_rating += `<td>${term.incoming.length > 1 ? '>'+term.incoming.length : ''}</td><td>${term.outgoing.length > 1 ? term.outgoing.length+'>' : ''}</td>`
      html += `<tr><td>{{${term.name.capitalize()}}}</b></td><td>${r.score}</td>${html_rating}</tr>`.to_markup()
    }
  }
  return `<table class='rating'>${html}</table>`
});
