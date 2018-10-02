# Styleguide

## File Order

- Filtering functions.
- Privates.
- Publics(`this.`).
- `.toString()` function.
- One-line Helpers functions.

## Functions

- Names are `snake_case`.
- Linebreak after declaration line.
- If/etc, don't have a linebreak.
- Indentation is 2 spaces.
- Don't use `let`, or `var` types.

```javascript
function find_type(source,target)
{
  return source.filter((val,id) => {
    return val % 2;
  })
}
```

### HTML Templating Functions

- Has the `_` prefix.

```javascript
function _log(log)
{
  return `<ln>${_log.name}</ln>`
}
```

## Notes

```
* Map
& {*Map*} will modify/add properties or run a function onto each object.
# array.{*map*}((value,index,array) => { return value *2; })
* Filter
& {*Filter*} only keeps elements returning true.
# array.{*filter*}((value,index,array) => { return value % 2 === 0; })
* Reduce
& {*Reduce*} takes an array and reduces it into a single value.
# array.{*reduce*}((acc,value,index,array) => { return acc + value; },0)
```
