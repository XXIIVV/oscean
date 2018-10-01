# Styleguide

* Map
& {*Map*} will modify/add properties or run a function onto each object.
# array.{*map*}((value,index,array) => { return value *2; })
* Filter
& {*Filter*} only keeps elements returning true.
# array.{*filter*}((value,index,array) => { return value % 2 === 0; })
* Reduce
& {*Reduce*} takes an array and reduces it into a single value.
# array.{*reduce*}((acc,value,index,array) => { return acc + value; },0)