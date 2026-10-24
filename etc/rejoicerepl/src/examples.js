let examples={}
examples.hello_world=`( The forge contains 3 ingots of lead )
lead^3

( Add mercury and sulfur )
mercury sulfur

( Double the amount of ingots, add the philosopher's stone )
lead^lead stone

( The philosopher stone turns six ingots into gold )
'gold/[stone lead^6 mercury sulfur]->Success

@Failure =>"It didn't work!" ->End
@Success =>"It's gold!"

@End`
examples.fractions=`( A whole number, equal to 7/1 )
7

( A proper fraction, less than 1 )
3/7

( An improper fraction, greater than 1 )
[3 5]/3

( An unreduced fraction, a factor is present on both sides )
3/[5 3]

( The previous fraction, reduced )
11/3
`
examples.primes=`( Check if number n, is prime )

n^23 =>"{n}"

i^2 pow^4

@Loop ( n i -- n i )     
	( lteq=pow<=n ) t^n lteq/t^pow []/[t^t pow^pow]
	( lteq..Prime ) /lteq->Lteq =>" is prime" ->End @Lteq
	( rem=n%i )     t^n '[]/t^i rem/t []/t^t
	[i pow^i pow^i pow]/rem->Loop

=>" is not prime" @End`
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
		( pad ) res^100/res^100->Skip-c =>" " @Skip-c
		( pad ) res^10/res^10->         =>" " @Skip-d
		( res ) /res^res=>{res}
		/x^12 =>" " x/x->Row
	/y^12 =>"\\n" y/y->Col`
examples.gcd=`( A program to find the GCD of two numbers,
	and print the result )

x^6 y^15

=>"The GDC of {x} and {y} is "

@Gcd ( x y -- x )
	'z/[x y]
	[y^x x^z]/[x^x z^z]
	y/y->Gcd

=>{x}`
examples.sort=`( Sort numbers in a list from largest to smallest )

( a list ) a^12 b^34 c^56 d^78 e^91 f^23

@Loop ( -- )
	[true b^a]/b^a [a^b b^a]/[true a^a b^b]->Loop
	[true c^b]/c^b [b^c c^b]/[true b^b c^c]->Loop
	[true d^c]/d^c [c^d d^c]/[true c^c d^d]->Loop
	[true e^d]/e^d [d^e e^d]/[true d^d e^e]->Loop
	[true f^e]/f^e [e^f f^e]/[true e^e f^f]->Loop

( Print them: )

=>"{a} {b} {c} {d} {e} {f}"`
examples.search=`( Search for a number in a list )

( a list ) a^12 b^34 c^56 d^78 e^91 f^23
( target ) target^78

	/[a^target target^a]->Found i
	/[b^target target^b]->Found i
	/[c^target target^c]->Found i
	/[d^target target^d]->Found i
	/[e^target target^e]->Found i
	/[f^target target^f]->Found i
	=>"Not found.\\n" ->End

@Found ( i -- )
	=>"Found at index: {i}\\n" @End`
examples.fizzbuzz=`( Prints numbers from 1 to 100,
	replacing multiples of 3 with Fizz,
	multiples of 5 with Buzz,
	and multiples of both with FizzBuzz )

[times^100 n f b]

@Loop ( times -- n f b )
	[n f b]/[times f^3 b^5]->Loop=>"FizzBuzz\\n"
	[n f b]/[times f^3]->Loop=>"Fizz\\n"
	[n f b]/[times b^5]->Loop=>"Buzz\\n"
	[n f b]/times->Loop=>"{n}\\n"`
examples.fibonacci=`( Print the Fibonacci sequence: 
	0, 1, 1, 2, 3, 5, 8, 13, 21, 34 )

n^10 y

	'[y^x x^y]/[x^x n]=>"{x} "`
examples.factorial=`( Print the Factorial number n )

n^5 y^n /y

@Factorial ( n y -- n ) 
	'[r^y y]/[y n]
	n^r/[y r^r]->Factorial

=>{n}`
examples.collatz=`( Print the Collatz sequence for n^7: 
	7, 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1 )

n^7

@Collatz ( n -- )
	x^n=>"{n} " 'y/x^2 
	/[none^y x n]->End
		[n^n n^n n^n n]/[y^y n^n x]->Collatz
		n^y/[n^n y^y]->Collatz

@End ( -- )`
examples.sierpinski=`( Draw the Sierpiński Triangle )

y4 y3 y2 y1 y0 width height^31

@Rows ( width height -- )
	c^width ." "^height
	@Cols ( c -- )
		x^c/x^x []/x
		[.\\s\\s y4]/[c y4 x^16]->Cols []/x^16
		[.\\s\\s y3]/[c y3 x^8]->Cols []/x^8
		[.\\s\\s y2]/[c y2 x^4]->Cols []/x^4
		[.\\s\\s y1]/[c y1 x^2]->Cols []/x^2
		[.\\s\\s y0]/[c y0 x]->Cols 
		[.\\s*]/c->Cols
	[width .\\n]/[height y0]->Rows
	[width .\\n y0]/[height y1]->Rows
	[width .\\n y1 y0]/[height y2]->Rows
	[width .\\n y2 y1 y0]/[height y3]->Rows
	[width .\\n y3 y2 y1 y0]/[height y4]->Rows
`
examples.stack_machine=`( Operate a 3-cells stack machine )

n^56 ( 56 )       [b^a a^n c^b]/[a^a b^b c^c n^n]
n^34 ( 34 56 )    [b^a a^n c^b]/[a^a b^b c^c n^n]
n^12 ( 12 34 56 ) [b^a a^n c^b]/[a^a b^b c^c n^n]

( swp 34 12 56 )  [a^b b^a]/[a^a b^b]
( rot 56 34 12 )  [a^c b^a c^b]/[a^a b^b c^c]
( pop 34 12 )     [a^b b^c]/[a^a b^b c^c]
( dup 34 34 12 )  [a^a b^a c^b]/[a^a b^b c^c]
( add 68 12 )     [a^b b^c]/[b^b c^c]
( sub 56 )        []/[a^b b^b c^c]
( put )           [a^b b^c]/[a^a b^b c^c]=>{a}`
examples.roman_addition=`( 1742 ) [ M   D   C^2     X^4     I^2 ]
( 674  ) [     D   C   L   X^2     I^4 ]

( Add numbers )

V/I^5
X/V^2
L/X^5
C/L^2
D/C^5
M/D^2

( Convert to decimal )

'n/I
'n^5/V
'n^10/X
'n^50/L
'n^100/C
'n^500/D
'n^1000/M

`
examples.binary_logic=`( Put a logic gate and binary states in the bag )

or true false

( not ) 
false/[not true] 
true/[not false]

( and )
true/[and true^2]
false/[and true false]
false/[and false^2]

( or )
true/[or false true]
true/[or true^2]
false/[or false^2]
`
examples.binary_print=`( Put a decimal number in the bag )

d^92

( Decimal to Binary )

'b7/d^128 'b6/d^64 'b5/d^32 'b4/d^16
'b3/d^8   'b2/d^4  'b1/d^2  'b0/d

( Print 8 bits )

=>"{b7}{b6}{b5}{b4} {b3}{b2}{b1}{b0}"`
examples.binary_adder=`( Put two binary numbers in the bag
  Bit   b7 b6 b5 b4 b3 b2 b1 b0 )

( 73  )    b6       b3       b0
( 124 )    b6 b5 b4 b3 b2

( Adder with Carry )

b1/[b0^2] b2/[b1^2] b3/[b2^2] b4/[b3^2]
b5/[b4^2] b6/[b5^2] b7/[b6^2] 

( Binary to Decimal )

d^128/b7 d^64/b6 d^32/b5 d^16/b4
d^8/b3   d^4/b2  d^2/b1  d/b0
`
examples.ternary_logic=`( Put a logic gate and balanced ternary states in the bag )

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
bt+/[or bt+^2]   bt0/[or bt0 bt+] bt-/[or bt- bt+]
`
examples.ternary_print=`( Put a decimal number in the bag )

d^92

( Decimal to Unsigned Ternary )

'b5/d^243 'b4/d^81 'b3/d^27   
'b2/d^9   'b1/d^3  'b0/d

( Print 6 trits )

=>"{b5}{b4}{b3} {b2}{b1}{b0}"`
examples.ternary_adder=`( Put two ternary numbers in the bag )

( 73  )    t3^2 t2^2      t0
( 124 ) t4 t3   t2   t1^2 t0

( Adder with Carry )

t1/[t0^3] t2/[t1^3] t3/[t2^3]
t4/[t3^3] t5/[t4^3] t6/[t5^3]

( Ternary to Decimal )

'd^243/t5 'd^81/t4 'd^27/t3 
'd^9/t2   'd^3/t1  'd/t0
`
examples.decimal_print=`( Print the result of a division with decimal points )

n^10 d^6

( *100  ) 'x^100/n
( /d    ) 'd1/x^d []/d^d
( /100  ) 'int/d1^100
( /10   ) 'd0/d1^10
( print ) =>"{int}.{d0}{d1}"`
examples.hexadecimal_print=`( Put a decimal number in the bag )

d^92

( Decimal to Nibbles )

     'n^8/d^128 'n^4/d^64 'n^2/d^32 'n/d^16 task ->PrintNibble
@Low 'n^8/d^8   'n^4/d^4  'n^2/d^2  'n/d

( Nibble to Hexadecimal )

@PrintNibble ( n -- )
	/n^15->Next=>f /n^14->Next=>e /n^13->Next=>d /n^12->Next=>c
	/n^11->Next=>b /n^10->Next=>a /n^9->Next=>9  /n^8->Next=>8
	/n^7->Next=>7  /n^6->Next=>6  /n^5->Next=>5  /n^4->Next=>4
	/n^3->Next=>3  /n^2->Next=>2  /n->Next=>1    ->Next=>0

@Next ( task -- )
	/task->Low`
examples.heptavintimal_print=`( Put a decimal number in the bag )

d^128

( Decimal to Tribbles )

     't^9/d^243 't^3/d^81 't/d^27 task ->PrintTribble
@Low 't^9/d^9   't^3/d^3  't/d

( Tribble to Heptavintimal )

@PrintTribble ( t -- )
	.z/t^26->Next .y/t^25->Next .x/t^24->Next
	.w/t^23->Next .v/t^22->Next .u/t^21->Next
	.t/t^20->Next .s/t^19->Next .r/t^18->Next
	.q/t^17->Next .p/t^16->Next .o/t^15->Next
	.n/t^14->Next .m/t^13->Next .l/t^12->Next
	.k/t^11->Next .j/t^10->Next .i/t^9->Next
	.h/t^8->Next  .g/t^7->Next  .f/t^6->Next
	.e/t^5->Next  .d/t^4->Next  .c/t^3->Next
	.b/t^2->Next  .a/t->Next    .0->Next

@Next ( task -- )
	/task->Low
`
examples.toffoli=`( The Toffoli gate is a reversible CNOT gate with
	two control bits[a,b] and one target bit[c] )

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
	toffoli/t
`
examples.proquints=`( Print the proquint spelling of 16-bits )

( high byte ) byte1^128
( low byte  ) byte2^30

tasks^4

    c^8/byte1^128 c^4/byte1^64 c^2/byte1^32  c/byte1^16 ->Con
@v0 v^2/byte1^8   v/byte1^4                             ->Vow
@c1 c^8/byte1^2   c^4/byte1    c^2/byte2^128 c/byte2^64 ->Con
@v1 v^2/byte2^32  v/byte2^16                            ->Vow
@c2 c^8/byte2^8   c^4/byte2^4  c^2/byte2^2   c/byte2    ->Con

@Con ( c -- )
	/c^15->Next=>z /c^14->Next=>v /c^13->Next=>t /c^12->Next=>s
	/c^11->Next=>r /c^10->Next=>p /c^9->Next=>n  /c^8->Next=>m
	/c^7->Next=>l  /c^6->Next=>k  /c^5->Next=>j  /c^4->Next=>h
	/c^3->Next=>g  /c^2->Next=>f  /c->Next=>d    /[]->Next=>b

@Vow ( v -- )
	/v^3->Next=>u  /v^2->Next=>o  /v->Next=>i    /[]->Next=>a

@Next ( dest -- )
	tasks^3/tasks^4->v0 tasks^2/tasks^3->c1
	tasks^1/tasks^2->v1 /tasks->c2
	
`
examples.spirograph=`( Calculate the number of turns of two spirograph cogs )

( inner cog: ) x^40
( outer cog  ) a^96

( a -> y,y2 ) [y^a y2^a]/a^a

@Gcd ( x y -- x )
	'z/[x y]
	[y^x x^z]/[x^x z^z]
	y/y->Gcd

( y2/x  ) 'res/y2^x
( print ) =>"Turns: {res}"`
examples.wdr_computer=`( The Know-how Computer is an educational model of a computer
	consisting of a pen, paper, and matches.
  Let's pretend that we're a register machine pretending
	to be moving matches in and out of a bag. )

r2^5

@l1 ( jmp 4 ) ->l4
@l2 ( inc 1 ) r1
@l3 ( dec 2 ) []/r2
@l4 ( isz 2 ) r2/r2->l5 ->l6
@l5 ( jmp 2 ) ->l2
@l6 ( stp )`
examples.pounds_to_kilograms=`( Convert pounds to kilograms )

( libra pondo: ) lb^165

'd1^45/lb
'dc/d1^100
'd0/d1^10

=>"{dc}.{d0}{d1}kg"`
examples.fahrenheit_to_celsius=`( Convert Fahrenheit to Celsius )

( degrees: ) f^55

[]/f^32 't^50/f 'c/t^9
'c-hd/c^10

=>"{c-hd}.{c}°C"`
examples.gaud=`( Salv ad Gaud, lud de symbol et sac. )

( Inser un calcul et quinq num in sac: )
calcul num^5

( Consum un num, inser un belar: )
belar/num

( Consum du num pro teser dum posibil.. )
@Teserar ( num -- teser )
    teser/num^2->Teserar

( Ad fin, imprim computat. )
=>{teser}`
examples.fractran=`( This is a Fractran program )

[apple^2 orange]         ( This is the state of the accumulator. )

@Loop                    ( This is a label. )
  banana/orange^3->Loop  ( This trades 3 oranges for 1 banana. )
  orange/apple->Loop     ( Each fraction must return to the "Loop" label. )
  []/banana->Loop        ( Remove the banana. )

( When no fractions can be applied,
  the Fractran program ends. )`
examples.five_philosophers=`( Five philosophers, five forks.
  Eating takes both forks in one atomic step. )

f1 f2 f3 f4 f5
h1 h2 h3 h4 h5

@Dine
	e1/[h1 f1 f2]->Dine=>"1 eats\\n"
	e2/[h2 f2 f3]->Dine=>"2 eats\\n"
	e3/[h3 f3 f4]->Dine=>"3 eats\\n"
	e4/[h4 f4 f5]->Dine=>"4 eats\\n"
	e5/[h5 f5 f1]->Dine=>"5 eats\\n"
	[f1 f2]/e1->Dine=>"1 done\\n"
	[f2 f3]/e2->Dine=>"2 done\\n"
	[f3 f4]/e3->Dine=>"3 done\\n"
	[f4 f5]/e4->Dine=>"4 done\\n"
	[f5 f1]/e5->Dine=>"5 done\\n"
`
