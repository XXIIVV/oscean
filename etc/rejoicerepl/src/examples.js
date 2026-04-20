let examples={}
examples.hello_world=`( Put a marble and five coins in the bag: )

marble coin^5

( Replace a coin with a candy: )

candy/coin

( Trade two coins for a ticket for as long as possible: )

@TicketBooth ( coint -- coin ticket )
	[TicketBooth ticket]/coin^2

( To print the result: )

.Count: .#ticket`
examples.primes=`( Multiplying is the same as adding prime factors.
	The product 10[2 5] and 21[3 7], is the sum of their primes. )

10 21

( Division is the same as subtracting prime factors.
	Multiplying by the fraction 1/3, is the same as dividing by 3.
	And the result is the subtraction of the prime factor 3. )

1/3

( The result is 70[2 5 7]. )`
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

( Put a second marble in the bag )

marble

( Trade a marble for a coin )

coin/marble

( Replace the last marble using its prime factor name )

3/2

( Giveaway the two coins )

[]/coin^2`
examples.tropical=`( In Tropical Arithmetic, the multiplication operation is addition,
	akin to how a product is the addition prime factors.

( × 153 ) [a^1 b^5 c^3]
(    61 )     [b^6 c^1]
(   --- )
(   1b4 )`
examples.product=`( A program to multiply two numbers
	and print the result: )

x^8 y^3
	'res^x/y 

.#res`
examples.quotient=`( A program to divides a number by another
	and print the result: )

x^24 y^3
	'res/x^y 

.#res`
examples.gcd=`( A program to find the GCD of two numbers,
	and print the result: )

x^6 y^15

@Gcd ( x y -- x )
	'z/[x y]
	[y^x x^z]/[x^x z^z]
	[Gcd y]/y

.#x`
examples.fibonacci=`( 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 )

( Print the Fibonacci number: )

n^10
	y '[y^x x^y]/[x^x n]

.#x`
examples.collatz=`( 7: 7, 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 )

n^7

@Collatz ( n -- )
	( print ) .#n .\\s
	x^n 'y/x^2 
	End/[none^y x n]
		[Collatz n^n n^n n^n n]/[y^y n^n x] 
		[Collatz n^y]/[n^n y^y] 
	@End ( -- )`
examples.sierpinski=`y4 y3 y2 y1 y0 width height^31
@Rows ( width height -- )
	( indent ) i^height '.\\s/i
	c^width 
	@Cols ( c -- )
		[]/x^x x^c []/x
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
( print ) .Turns:\\s .#res`
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
