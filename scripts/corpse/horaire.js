function Horaire(list)
{
  this.list = list;

  this.find = function(key,value)
  {
    var a = this.list.find(key,value);
    var array = [];
    for(id in a){
      array.push(new Log(a[id]))
    }
    return array;
  }
}

invoke.vessel.seal("corpse","horaire");