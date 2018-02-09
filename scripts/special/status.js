function status_view()
{
  this.style = function()
  {
    return `
    <style>
      td.passed { background:#72dec2}
      td.failed { background:}
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
    return {passed:true,err:"OK"}
  }

  this.test_tree = function(term)
  {
    if(!term.parent){ return {passed:false,err:"Missing parent"}; }
    return {passed:true,err:"OK"}
  }

  this.test_photo = function(term)
  {
    if(!term.diary()){ return {passed:false,err:"Missing diary"}; }
    return {passed:true,err:"OK"}
  }

  this.html = function()
  {
    var html = "";

    for(id in invoke.vessel.lexicon.terms){
      var term = invoke.vessel.lexicon.terms[id];

      var t_length = this.test_length(term);
      var t_tree   = this.test_tree(term);
      var t_photo   = this.test_photo(term);

      html += `
      <tr>
        <th>${term.name}</th>
        <td class='${t_length.passed ? "passed" : "failed"}'>${t_length.err}</td>
        <td class='${t_tree.passed ? "passed" : "failed"}'>${t_tree.err}</td>
        <td class='${t_photo.passed ? "passed" : "failed"}'>${t_photo.err}</td>
      </tr>`
    }

    return `${this.style()}<table class='outline'>${html}</table>`;
  }
}; 

var payload = new status_view();

invoke.vessel.seal("special","status",payload);