let examples={}
examples.hello_world=`( The forge contains 3 ingots of lead )
lead^3

( Double the amount of ingots, add the philosopher's stone )
lead^lead stone

( The philosopher stone turns four ingots into gold )
'gold/[stone lead^4]

( Inspect the result )
take ."It's " [True Fool]/[take gold]

@Fool  .pyrite.. End
@True  .gold! @End`
examples.primes=`( Check if number n, is prime: )

n^29 

i^2 pow^4

@Loop ( n i -- n i )     
	( lteq=pow<=n ) t^n lteq/t^pow []/[t^t pow^pow]
	( lteq..Prime ) Lteq/lteq .Prime End @Lteq
	( rem=n%i )     t^n '[]/t^i rem/t []/t^t
	[Loop i pow^i pow^i pow]/rem

."Not Prime" @End`
examples.fractions=`( A whole number, equal to 7/1: )
7

( A proper fraction, less than 1: )
3/7

( An improper fraction, greater than 1: )
5/2

( An unreduced fraction, a factor is present on both sides: )
[5 3]/[2 3]

( The previous fraction, reduced: )
5/2`
examples.multisets=`( Put a marble in the bag )

marble

( Put three more marbles in the bag )

marble^3

( Trade each marble for a coin )

'coin/marble

( Discard two coins )

[]/coin^2`
examples.product=`( Generate the multiplication table up to 12x12 )

@Col ( -- )
	y
	@Row ( y -- y )
		x
		( x y2 mul ) y2^y '[res^x]/y2
		( pad ) [Skip-c res^100]/res^100 .\\s @Skip-c
		( pad ) [Skip-d res^10]/res^10   .\\s @Skip-d
		( res ) .#res/res^res
		[]/x^12 [Row x .\\s]/x
	[]/y^12 [Col y .\\n]/y
`
examples.gcd=`( A program to find the GCD of two numbers,
	and print the result: )

x^6 y^15

@Gcd ( x y -- x )
	'z/[x y]
	[y^x x^z]/[x^x z^z]
	[Gcd y]/y

.#x`
examples.random=`( flip a coin )

[Head Tail]

@Head .Head End
@Tail .Tail @End
`
examples.sort=`( Sort numbers in a list from largest to smallest: )

( a list ) a^12 b^34 c^56 d^78 e^91 f^23

@Loop ( -- )
	[true b^a]/b^a [Loop a^b b^a]/[true a^a b^b]
	[true c^b]/c^b [Loop b^c c^b]/[true b^b c^c]
	[true d^c]/d^c [Loop c^d d^c]/[true c^c d^d]
	[true e^d]/e^d [Loop d^e e^d]/[true d^d e^e]
	[true f^e]/f^e [Loop e^f f^e]/[true e^e f^f]

( Print them: )

.#a .\\s .#b .\\s .#c .\\s .#d .\\s .#e .\\s .#f`
examples.search=`( Search for a number in a list: )

( a list ) a^12 b^34 c^56 d^78 e^91 f^23
( target ) target^78

@Loop ( target -- target )
	Found/[a^target target^a] i
	Found/[b^target target^b] i
	Found/[c^target target^c] i
	Found/[d^target target^d] i
	Found/[e^target target^e] i
	Found/[f^target target^f] i
	."Not found."\\n End
@Found ( i -- )
	."Found at index: " .#i .\\n @End`
examples.fibonacci=`( Print the Fibonacci sequence: 
	0, 1, 1, 2, 3, 5, 8, 13, 21, 34 )

n^10 y ( n y -- x y )
	'[y^x x^y .#x .\\s]/[x^x n]`
examples.collatz=`( Print the Collatz sequence for n^7: 
	7, 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 )

n^7

@Collatz ( n -- )
	( print ) .#n .\\s
	x^n 'y/x^2 
	End/[none^y x n]
		[Collatz n^n n^n n^n n]/[y^y n^n x] 
		[Collatz n^y]/[n^n y^y] @End`
examples.sierpinski=`y4 y3 y2 y1 y0 width height^31
@Rows ( width height -- )
	[c^width i^height] '.\\s/i
	@Cols ( c -- )
		x^c/x^x []/x
		[Cols .\\s\\s y4]/[c y4 x^16] []/x^16
		[Cols .\\s\\s y3]/[c y3 x^8] []/x^8
		[Cols .\\s\\s y2]/[c y2 x^4] []/x^4
		[Cols .\\s\\s y1]/[c y1 x^2] []/x^2
		[Cols .\\s\\s y0]/[c y0 x] 
		[Cols .\\s*]/c
	[Rows width .\\n]/[height y0]
	[Rows width .\\n y0]/[height y1]
	[Rows width .\\n y1 y0]/[height y2]
	[Rows width .\\n y2 y1 y0]/[height y3]
	[Rows width .\\n y3 y2 y1 y0]/[height y4]`
examples.stack_machine=`( 3-items Stack Primitives: )

n^56 ( 56 )       [b^a a^n c^b]/[a^a b^b c^c n^n]
n^34 ( 34 56 )    [b^a a^n c^b]/[a^a b^b c^c n^n]
n^12 ( 12 34 56 ) [b^a a^n c^b]/[a^a b^b c^c n^n]

( swp 34 12 56 )  [a^b b^a]/[a^a b^b]
( rot 56 34 12 )  [a^c b^a c^b]/[a^a b^b c^c]
( pop 34 12 )     [a^b b^c]/[a^a b^b c^c]
( dup 34 34 12 )  [a^a b^a c^b]/[a^a b^b c^c]
( add 68 12 )     [a^b b^c]/[b^b c^c]
( sub 56 )        []/[a^b b^b c^c]
( put )           [.#a a^b b^c]/[a^a b^b c^c]`
examples.binary_logic=`( Put a logic gate and binary states in the bag: )

or true false

( not ) false/[not true] true/[not false]

( and )
true/[and true^2]
false/[and true false]
false/[and false^2]

( or )
true/[or false true]
true/[or true^2]
false/[or false^2]`
examples.binary_print=`( Input a decimal number: )

d^92

( Decimal to Binary )

'b7/d^128 'b6/d^64 'b5/d^32 'b4/d^16
'b3/d^8   'b2/d^4  'b1/d^2  'b0/d

( Print 8 bits )

.#b7 .#b6 .#b5 .#b4 .\\s
.#b3 .#b2 .#b1 .#b0`
examples.binary_adder=`( Put two binary numbers in the bag:
  Bit   b7 b6 b5 b4 b3 b2 b1 b0 )

( 73  )    b6       b3       b0
( 124 )    b6 b5 b4 b3 b2

( Adder with Carry )

b1/[b0^2] b2/[b1^2] b3/[b2^2] b4/[b3^2]
b5/[b4^2] b6/[b5^2] b7/[b6^2] 

( Binary to Decimal )

d^128/b7 d^64/b6 d^32/b5 d^16/b4
d^8/b3   d^4/b2  d^2/b1  d/b0`
examples.ternary_logic=`( Put a logic gate and balanced ternary states in the bag: )

or bt0 bt-

( E, neg ) bt-/[e bt+] bt0/[e bt0] bt+/[e bt-] 
( G, inc ) bt-/[e bt+] bt+/[e bt0] bt0/[e bt-] 
( K, dec ) bt0/[e bt+] bt-/[e bt0] bt+/[e bt-]
( O      ) bt0/[e bt+] bt-/[e bt0] bt+/[e bt-] 
( U, id  ) bt+/[e bt+] bt0/[e bt0] bt-/[e bt-] 

( and )
bt-/[and bt+ bt-] bt-/[and bt0 bt-] bt-/[and bt-^2]
bt0/[and bt+ bt0] bt0/[and bt0^2]   bt0/[and bt- bt0]
bt+/[and bt+^2]   bt+/[and bt0 bt+] bt+/[and bt- bt+]

( or )
bt+/[or bt+ bt-] bt0/[or bt0 bt-] bt-/[or bt-^2]
bt+/[or bt+ bt0] bt0/[or bt0^2]   bt-/[or bt- bt0]
bt+/[or bt+^2]   bt0/[or bt0 bt+] bt-/[or bt- bt+]`
examples.ternary_print=`( Input a decimal number: )

d^92

( Decimal to Unsigned Ternary )

'b5/d^243 'b4/d^81 'b3/d^27   
'b2/d^9   'b1/d^3  'b0/d

( Print 6 trits )

.#b5 .#b4 .#b3 .\\s
.#b2 .#b1 .#b0`
examples.ternary_adder=`( Put two ternary numbers in the bag: )

( 73  )    t3^2 t2^2      t0
( 124 ) t4 t3   t2   t1^2 t0

( Adder with Carry )

t1/[t0^3] t2/[t1^3] t3/[t2^3]
t4/[t3^3] t5/[t4^3] t6/[t5^3]

( Ternary to Decimal )

'd^243/t5 'd^81/t4 'd^27/t3 
'd^9/t2   'd^3/t1  'd/t0`
examples.decimal_print=`( Print the result of a division with decimal points: )

n^10 d^6

( *100  ) 'x^100/n
( /d    ) 'd1/x^d []/d^d
( /100  ) 'int/d1^100
( /10   ) 'd0/d1^10
( print ) .#int .. .#d0 .#d1`
examples.hexadecimal_print=`( Input a decimal number: )

d^92

( Decimal to Nibbles )

     'n^8/d^128 'n^4/d^64 'n^2/d^32 'n/d^16 task PrintNibble
@Low 'n^8/d^8   'n^4/d^4  'n^2/d^2  'n/d

( Nibble to Hexadecimal )

@PrintNibble ( n -- )
	[Next .f]/n^15 [Next .e]/n^14 [Next .d]/n^13 [Next .c]/n^12 
	[Next .b]/n^11 [Next .a]/n^10 [Next .9]/n^9  [Next .8]/n^8
	[Next .7]/n^7  [Next .6]/n^6  [Next .5]/n^5  [Next .4]/n^4
	[Next .3]/n^3  [Next .2]/n^2  [Next .1]/n    .0

@Next ( task -- )
	Low/task`
examples.heptavintimal_print=`( Input a decimal number: )

d^128

( Decimal to Tribbles )

     't^9/d^243 't^3/d^81 't/d^27 task PrintTribble
@Low 't^9/d^9   't^3/d^3  't/d

( Tribble to Heptavintimal )

@PrintTribble ( t -- )
	[Next .z]/t^26 [Next .y]/t^25 [Next .x]/t^24
	[Next .w]/t^23 [Next .v]/t^22 [Next .u]/t^21
	[Next .t]/t^20 [Next .s]/t^19 [Next .r]/t^18
	[Next .q]/t^17 [Next .p]/t^16 [Next .o]/t^15
	[Next .n]/t^14 [Next .m]/t^13 [Next .l]/t^12
	[Next .k]/t^11 [Next .j]/t^10 [Next .i]/t^9
	[Next .h]/t^8  [Next .g]/t^7  [Next .f]/t^6
	[Next .e]/t^5  [Next .d]/t^4  [Next .c]/t^3
	[Next .b]/t^2  [Next .a]/t    .0

@Next ( task -- )
	Low/task`
examples.toffoli=`( The Toffoli gate is a reversible CNOT gate with
	two control bits[a,b] and one target bit[c]: )

toffoli a b c

( a & b: flip c )
	[t a b]/[toffoli a b c]
	[t a b c]/[toffoli a b]
( a: pass through )
	[t a c]/[toffoli a c]
	[t a]/[toffoli a]
( b: pass through )
	[t b c]/[toffoli b c]
	[t b]/[toffoli b]
( c: cleanup )
	[t c]/[toffoli c]
	t/toffoli

( reverse )
	[toffoli a b]/[t a b c]
	[toffoli a b c]/[t a b]
	[toffoli a c]/[t a c]
	[toffoli a]/[t a]
	[toffoli b c]/[t b c]
	[toffoli b]/[t b]
	[toffoli c]/[t c]
	toffoli/t`
examples.spirograph=`( inner cog: ) x^40
( outer cog  ) a^96

( a -> y,y2 ) [y^a y2^a]/a^a

@Gcd ( x y -- x )
	'z/[x y]
	[y^x x^z]/[x^x z^z]
	[Gcd y]/y

( y2/x  ) 'res/y2^x
( print ) ."Turns: " .#res`
examples.wdr_computer=`( The Know-how Computer is an educational model of a computer
	consisting of a pen, paper, and matches.
  Let's pretend that we're a register machine pretending
	to be moving matches in and out of a bag. )

r2^5

@l1 ( jmp 4 ) l4
@l2 ( inc 1 ) r1
@l3 ( dec 2 ) []/r2
@l4 ( isz 2 ) [l5 r2]/r2 l6
@l5 ( jmp 2 ) l2
@l6 ( stp )`
examples.gaude=`( Salve ad Gaude, ludo de symbolo et sacco. )

( Insere 1 calculo et 5 nummo in sacco: )
calculo nummo^5

( Consume 1 nummo, inse 1 bellaria: )
bellaria/nummo

( Consume 2 nummo pro tessera, quam diu possibile: )
@Tesserarum ( nummo -- tessera )
    [Tesserarum tessera]/nummo^2

( Ad fine, imprime resultato: )
.Computus: .#tessera`
