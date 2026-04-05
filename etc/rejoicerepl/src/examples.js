/* Inspired from https://doc.rust-lang.org/rust-by-example/ */

let examples = {}

examples.hello = `( Welcome to Rejoice, 
	this is a comment )

[this is a bag] tote/bag [programming language]/tote

.Hello!
`

examples.binary = `( A short example to demonstrate the result 
	of some binary logic operations )

not true

	false/[not true]
	true/[not false]

and true true

	true/[and true true]
	false/[and true]
	false/[and]

or true true

	true/[or true true]
	true/[or true]
	false/[or]`

examples.product = `x^2 y^3
@Mul ( x y -- res )
	[Mul z res]/y
@Move ( z -- y)
	[Move y]/z
	Mul/x
@Clean ( y -- )
	Clean/[y res]

.#res`

examples.fizzbuzz = `times^20 f b

@Loop ( times -- )
	[num f b .FizzBuzz\\n Loop]/[times f^3 b^5]
	[num f b .Fizz\\n Loop]/[times f^3]
	[num f b .Buzz\\n Loop]/[times b^5]
	[num f b .#num .\\n Loop]/times
`
examples.colors = `red^2 blue^2 yellow^2
	violet/[red blue]
	green/[blue yellow]
	orange/[red yellow]
	black/[violet green orange]
`


