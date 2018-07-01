Ø("unique").seal("status",(q) => 
{
  var html = ""
  var progress = {sum:0,count:0}
  for(id in q.tables.lexicon){
    var term = q.tables.lexicon[id];
    var rating = term.rating()
    var html_rating = ""
    for(id in rating.points){
      html_rating += `<td title='${id}'>${rating.points[id] ? '•' : ''}</td>`
    }
    progress.sum += rating.score
    progress.count += 1
    html_rating += `<td>${term.incoming.length > 1 ? '>'+term.incoming.length : ''}</td><td>${term.outgoing.length > 1 ? term.outgoing.length+'>' : ''}</td>`
    html_rating += `<td>${rating.status}</td>`
    html += `<tr><td>{{${term.name.capitalize()}}}</b></td>${html_rating}</tr>`.to_markup()
  }
  return `<table class='rating'>${html}</table><p>The current progress of the Nataniev improvement project, currently affecting ${progress.count} projects, is of <b>${((progress.sum/progress.count)*100).toFixed(2)}%</b>.</p>`
});
