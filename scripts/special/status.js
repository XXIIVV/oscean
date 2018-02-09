function status_view()
{
  this.style = function()
  {
    return `
    <style>
      td.passed,th.passed { background:#72dec2}
      td.failed,th.failed { }
    </style>`
  }

  this.test_length = function(term)
  {
    if(!term.bref){ return {passed:false,err:"Missing bref"}; }
    if(term.bref.length < 30){ return {passed:false,err:`Bref is too small(${term.bref.length})`}; }
    if(term.bref.length > 200){ return {passed:false,err:`Bref is too long(${term.bref.length})`}; }

    if(!term.dict.long){ return {passed:false,err:`Long is missing`}; }
    if(term.dict.long.length < 2){ return {passed:false,err:`Long is too short(${term.dict.long.length})`}; }
    if(term.dict.long.length > 10){ return {passed:false,err:`Long is too long(${term.dict.long.length})`}; }
    return {passed:true,err:`OK(${term.bref.length}:${term.dict.long.length})`}
  }

  this.test_tree = function(term)
  {
    if(!term.parent){ return {passed:false,err:"Missing parent"}; }
    return {passed:true,err:`OK(${term.parent.name})`}
  }

  this.test_photo = function(term)
  {
    if(!term.diary()){ return {passed:false,err:"Missing diary"}; }
    return {passed:true,err:`OK(${term.diary().photo})`}
  }

  this.test_activity = function(term)
  {
    if(term.logs.length === 0){ return {passed:false,err:"Inactive"}; }
    if(term.logs[0].time.offset() < -365){ return {passed:false,err:`Outdated(${term.logs[0].time.offset() * -1} days ago)`}; }
    return {passed:true,err:`OK(${term.logs.length}:${term.logs[0].time.offset()})`}
  }

  this.html = function()
  {
    var html = "";
  
    var scores = {length:0,tree:0,photo:0,activity:0,passing:0,count:0};
    for(id in invoke.vessel.lexicon.terms){
      var term = invoke.vessel.lexicon.terms[id];

      var t_length = this.test_length(term);
      var t_tree   = this.test_tree(term);
      var t_photo   = this.test_photo(term);
      var t_activity   = this.test_activity(term);
      
      scores.length += t_length.passed ? 1 : 0;
      scores.tree += t_tree.passed ? 1 : 0;
      scores.photo += t_photo.passed ? 1 : 0;
      scores.activity += t_activity.passed ? 1 : 0;
      scores.passing += t_length.passed && t_tree.passed && t_photo.passed && t_activity.passed ? 1 : 0;
      scores.count += 1;
      
      html += `
      <tr>
        <th class='${t_length.passed && t_tree.passed && t_photo.passed && t_activity.passed ? "passed" : "failed"}'><a href='${term.name.to_url()}'>${term.name}</a></th>
        <td class='${t_length.passed ? "passed" : "failed"}'>${t_length.err}</td>
        <td class='${t_tree.passed ? "passed" : "failed"}'>${t_tree.err}</td>
        <td class='${t_photo.passed ? "passed" : "failed"}'>${t_photo.err}</td>
        <td class='${t_activity.passed ? "passed" : "failed"}'>${t_activity.err}</td>
      </tr>`
    }
    
      html += `
      <tr>
        <th>${((scores.passing/scores.count)*100).toFixed(2)}%</th>
        <th>${((scores.length/scores.count)*100).toFixed(2)}%</th>
        <th>${((scores.tree/scores.count)*100).toFixed(2)}%</th>
        <th>${((scores.photo/scores.count)*100).toFixed(2)}%</th>
        <th>${((scores.activity/scores.count)*100).toFixed(2)}%</th>
      </tr>`

    return `${this.style()}<table class='outline'>${html}</table>`;
  }
};

var payload = new status_view();

invoke.vessel.seal("special","status",payload);