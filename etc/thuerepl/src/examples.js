/* Inspired from https://doc.rust-lang.org/rust-by-example/ */

let examples = {
/*
@|Hello-World */

"hello": `hello::=bye
::=
hello world`,

/*
@|Add */

"add": `a+b::=aa+
+=?::=
::=
aaa+bbbbb=?`,

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
@|Hexbin */

"hexbin": `>0::=0000>
>1::=0001>
>2::=0010>
>3::=0011>
>4::=0100>
>5::=0101>
>6::=0110>
>7::=0111>
>8::=1000>
>9::=1001>
>a::=1010>
>b::=1011>
>c::=1100>
>d::=1101>
>f::=1110>
>e::=1111>
> ::= >
>.::=
::=
>0c6e 6ecc.`,

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