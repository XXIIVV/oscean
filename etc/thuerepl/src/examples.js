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

/*
@|Proquints */

"proquints": `c0000::=~b
c0001::=~d
c0010::=~f
c0011::=~g
c0100::=~h
c0101::=~j
c0110::=~k
c0111::=~l
c1000::=~m
c1001::=~n
c1010::=~p
c1011::=~r
c1100::=~s
c1101::=~t
c1110::=~v
c1111::=~z
v00::=~a
v01::=~i
v10::=~o
v11::=~u
*-::=~-
::=
cvcvc*cvcvc0000110001101110-0110111011001100`,

}