let examples={}
examples.hello_world=`kingdom, no knight.::=A kingdom was lost, all for the want of a nail.
no horse::=no knight
no shoe::=no horse
no nail::=no shoe
::=
kingdom, no nail.`
examples.sum=`a+b::=aa+
+=?::=
::=
aaa+bbbbb=?`
examples.roll_dice=`%text,::=~You rolled: 
%dice::=~1.
%dice::=~2.
%dice::=~3.
%dice::=~4.
%dice::=~5.
%dice::=~6.
::=
%%text,dice`
examples.hexadecimal_print=`>0::=0000>
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
>0c6e 6ecc.`
examples.proquints=`c0000::=~b
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
cvcvc*cvcvc0000110001101110-0110111011001100`
examples.sierpinski_triangle=`#::=
X::=~_
Y::=~*
Z::=~\\n
_.::=._X
_*::=*_Y
._|::=.Z-|
*_|::=Z
..-::=.-.
**-::=*-.
*.-::=*-*
.*-::=.-*
@.-::=@_.
@*-::=@_*
::=
@_*...............................|`
