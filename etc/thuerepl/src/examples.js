/* Inspired from https://doc.rust-lang.org/rust-by-example/ */

let examples = {
/*
@|Hello-World */

"hello": `hello::=bye
::=
hello world`,

/*
@|Add */

"add": `a+b::=+bb
(+::=(
::=
(aaa+bbbbb)`,

/*
@|Roll */

"roll": `<roll>::=1
<roll>::=2
<roll>::=3
<roll>::=4
<roll>::=5
<roll>::=6
::=
You rolled <roll>.`,

}