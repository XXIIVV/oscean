/* Inspired from https://doc.rust-lang.org/rust-by-example/ */

let examples = {

"hello_tal": `|18 @Console/write

|100 @on-reset ( -> )
	;my-string print-text
	BRK

@print-text ( str* -- )
	&while
		LDAk .Console/write DEO
		INC2 LDAk ?&while
	POP2
	JMP2r

@my-string
	"Hello 20 "World! 00`,

/* 
@|0.Hello-World */

"0_tal": `( This is a comment, and is ignored by the assembler. 
  Click the Run button to evaluate the program.
  Select the next example with the dropdown. 

  The following line moves the program address to 0x0100,
  which is where all programs begin. )

;text                 ( Push text pointer ) 
&while
    LDAk DUP ?{       ( Load byte at address, jump if not null ) 
        POP2 BRK }    ( When null, pop pointer, halt ) 
    #18 DEO           ( Send byte to Console/write port )
    INC2 !&while      ( Incr text pointer and loop )

@text "Hello 20 "World! 00`,

/* 
@|1.Stack */

"1_tal": `( The Uxn virtual machine has two stacks of 256 bytes.
  A byte is a value between the hexadecimal numbers 00 and ff. )

#0a          ( Push a byte to the stack )
#0b          ( Push a second byte to the stack )
SWP          ( Swap their position, so 0a is on top )
NIP POP      ( Nip the 0b byte, pop the 0a byte )

( There are four arithmetic operators.
  Postfix arithmetic has no precedence rules,
  operations are applied in the order. )

#02 #10 ADD  ( 02 + 10 = 12 )
#04 #08 SUB  ( 04 - 05 = fc )
#08 #04 MUL  ( 08 * 04 = 20 )
#10 #02 DIV  ( 10 / 02 = 08 )

BRK  ( Halt )`,

/* 
@|2.Literals */

"2_tal": `( A literal is a number to be pushed to the stack,
  Uxntal supports various ways of creating literal numbers. )

80  01    ( A number will be interpreted as an opcode )
LIT 01    ( 80 is the numerical value of the LIT opcode )
   #01    ( This is a shorthand to write literal bytes )

.label    ( The . prefix is a zero-page reference to a label  )
,label    ( The , prefix is a relative byte reference to a label )

( Literals can also be made of two bytes, called a short. )

#1234     ( The # prefix can also be a short )
;label    ( The ; prefix is an absolute short reference to a label )

BRK @label`,

"loop_tal": `( Print the alphabet in lines of 8 characters )

|10 @Console &vector $2 &read $1 &pad $5 &write $1 &error $1
|0a @cr

|100

@on-reset ( -> )
	#1a00
	&loop ( -- )
		DUP #07 AND ?{ .cr .Console/write DEO }
		DUP [ LIT "a ] ADD .Console/write DEO
		INC GTHk ?&loop
	POP2 BRK`,

"ifelse_tal": `( Print foo if true, else bar )

|10 @Console &vector $2 &read $1 &pad $5 &write $1 &error $1
|100

@on-reset ( -> )
	#0a #0a EQU 
	?{ ;false print BRK }
	;true print BRK

@print ( value str* -- )
	LDAk .Console/write DEO
	INC2 LDAk ?print
	POP2 JMP2r

@true "foo 00 @false "bar 00`,

"cond_tal": `( Print the character types of a string )

|10 @Console &vector $2 &read $1 &pad $5 &write $1 &error $1
|0a @cr |20 @space

|100

@on-reset ( -> )
	;Dict/my-string
	&while ( -- )
		LDAk print-type
		INC2 LDAk ?&while
	POP2 BRK

@print-type ( char -- )
	DUP [ LIT "a ] SUB #19 GTH ?{ POP ;Dict/lc !&line }
	DUP [ LIT "A ] SUB #19 GTH ?{ POP ;Dict/uc !&line }
	DUP [ LIT "0 ] SUB #09 GTH ?{ POP ;Dict/num !&line }
	.space NEQ ?{ ;Dict/ws !&line }
	;Dict/other
	( >> )

&line ( str* -- )
	LDAk .Console/write DEO
	INC2 LDAk ?&line
	POP2 JMP2r

@Dict
	&my-string "Big 20 "Shiny 20 "Tunes 20 "1996. 00
	&lc "Lowercase -cr 00 &uc "Uppercase -cr 00
	&num "Number -cr 00 &ws "Space -cr 00
	&other "Other -cr 00`,

"lambda_tal": `( Double values in an array )

|10 @Console &vector $2 &read $1 &pad $5 &write $1 &error $1
|100

@on-reset ( -> )
	;array
	( double values ) 
	{ STH2k LDAk DUP ADD STH2r STA JMP2r } STH2r each
	;print-num each
	POP2 BRK

@print-num ( addr* -- addr* )
	LDAk [ LIT "0 ] ADD .Console/write DEO
	JMP2r

@each ( array* fn* -- array* )
	,&fn STR2
	DUP2 LDA2k SWP2 INC2 INC2
	&w ( -- )
		[ LIT2 &fn $2 ] JSR2
		INC2 GTH2k ?&w
	POP2 POP2 JMP2r

@array ={ 01 02 03 04 }`,

"fizzbuzz_tal": `( For multiples of 3 print Fizz, of 5 Buzz, for both FizzBuzz, otherwise a number )

|10 @Console &vector $2 &read $1 &pad $5 &write $1 &error $1
|0a @cr

|100

@on-reset ( -> )
	#6400
	&loop ( -- )
		DUP #0f DIVk MUL SUB ?{
			;Dict/fizz print-str ;Dict/buzz print-line !&resume }
		DUP #03 DIVk MUL SUB ?{
			;Dict/fizz print-line !&resume }
		DUP #05 DIVk MUL SUB ?{
			;Dict/buzz print-line !&resume }
		DUP print-dec print-cr
		&resume INC GTHk ?&loop
	POP2 BRK

@print-dec ( num -- )
	( x0 ) DUP #0a DIV print-num
	( 0x ) #0a DIVk MUL SUB
	( >> )

@print-num ( num -- )
	#30 ADD .Console/write DEO
	JMP2r

@print-line ( addr* -- )
	print-str

@print-cr ( -- )
	[ LIT2 -cr -Console/write ] DEO
	JMP2r

@print-str ( addr* -- )
	LDAk .Console/write DEO
	INC2 LDAk ?print-str
	POP2 JMP2r

@Dict ( strings )
	&fizz "Fizz $1 &buzz "Buzz $1
`}