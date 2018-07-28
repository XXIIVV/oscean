Ø("invoke").seal("tracker",(q) => 
{
  var html = ""
  var count = {sum:0,projects:0}

  for(id in q.tables.lexicon){
    var term = q.tables.lexicon[id];
    if(term.issues.length < 1){ continue; }
    count.sum += term.issues.length
    count.projects += 1
  }

  html += `<p>There is a total of {*${count.sum} active issues*} in {*${count.projects} projects*}.</p>`.to_markup()

  for(id in q.tables.lexicon){
    var term = q.tables.lexicon[id];
    if(term.issues.length < 1){ continue; }
    html += `<h2>${term.name.capitalize()}</h2>`
    html += `<hs>See {{${term.issues.length} Issue${term.issues.length > 1 ? 's' : ''}|${term.name}:tracker}} in the ${term.name.capitalize()} tracker.</hs>`.to_markup()
    html += `<list class='bold'>`
    for(i in term.issues){
      var issue = term.issues[i]
      html += `<ln>${issue.to_markup()}</ln>`
    }
    html += `</list>`
  }
  return html
});
