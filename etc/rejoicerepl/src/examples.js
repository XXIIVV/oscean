let examples = {}

examples.hello = `( Welcome to Rejoice, a multiset playground. )

( Put a marble and five coins in the bag: )
marble coin^5

( Replace a coin with a candy: )
candy/coin

( Trade two coins for a ticket for as long as possible: )
@TicketBooth
	[TicketBooth ticket]/coin^2

( To print the result: )
.Count: .#ticket
`

examples.primes = `( Multiplying is the same as adding prime factors.
	The product 10[2 5] and 21[3 7], is the sum of their primes. )

10 21

( Inversely, Division is the same as subtracting prime factors. 
	Multiplying by the fraction 1/35[3 5], is the same as dividing by 35. )

1/35
`

examples.fractions = `( A whole number, equal to 7/1: )  7

( A proper fraction, less than 1: ) 3/7

( An improper fraction, greater than 1: ) 5/2

( An unreduced fraction, a factor is present on both sides ): [5 3]/[2 3]

( The previous fraction, reduced: ) 5/2
`

examples.postfix = `( .. )
`
examples.tropical = `( In Tropical Arithmetic, the multiplication operation is addition, 
	akin to how a product is the addition prime factors.

 × 153
    61
   ---
   1b4 )

[a b^5 c^3] [b^6 c]
`

examples.binary = `( An example to demonstrate the result 
	of some binary logic operations )

not true
	.false/[not true]
	.true/[not false]

and true true
	.true/[and true true]
	.false/[and true]
	.false/[and]

or true true
	.true/[or true true]
	.true/[or true]
	.false/[or]`

examples.product = `( A program to multiply two numbers 
	and print the result: )

x^2 y^3
@Mul ( x y -- res )
	[Mul z res]/y
@Move ( z -- y)
	[Move y]/z
	Mul/x
@Clean ( y -- )
	Clean/[y res]

.#res
`

examples.fizzbuzz = `( Prints numbers from 1 to 100, 
	replacing multiples of 3 with Fizz,
	multiples of 5 with Buzz, 
	and multiples of both with FizzBuzz )

times^100 f b

@Loop ( times f b -- num f b )
	[num f b .FizzBuzz\n Loop]/[times f^3 b^5]
	[num f b .Fizz\n Loop]/[times f^3]
	[num f b .Buzz\n Loop]/[times b^5]
	[num f b .#num .\n Loop]/times
`
examples.colors = `red^2 blue^2 yellow^2
	violet/[red blue]
	green/[blue yellow]
	orange/[red yellow]
	black/[violet green orange]
`


