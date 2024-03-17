let examples = {

"hello_tal": `|10 @Console &vector $2 &read $1 &pad $5 &write $1 &error $1

|100

@on-reset ( -> )
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
`,
"shortcircuit_tal": ` ( Print called routines and result of short-circuit and/or. )
|66 @F   |74 @T

|100
	( x ?{ JMP2r } y ?{ JMP2r } body )
	;d-&&/ff <pstr>  <f-&&-f> <cr>
	;d-&&/ft <pstr>  <f-&&-t> <cr>
	;d-&&/tf <pstr>  <t-&&-f> <cr>
	;d-&&/tt <pstr>  <t-&&-t> <cr>
	<cr>
	( x ?{ y ?{ JMP2r } } body )
	;d-||/ff <pstr>  <f-||-f> <cr>
	;d-||/ft <pstr>  <f-||-t> <cr>
	;d-||/tf <pstr>  <t-||-f> <cr>
	;d-||/tt <pstr>  <t-||-t> <cr>
BRK

@<f-&&-f> ( -- ) .F x ?{ !<f> } .F y ?{ !<f> } !<t>
@<f-&&-t> ( -- ) .F x ?{ !<f> } .T y ?{ !<f> } !<t>
@<t-&&-f> ( -- ) .T x ?{ !<f> } .F y ?{ !<f> } !<t>
@<t-&&-t> ( -- ) .T x ?{ !<f> } .T y ?{ !<f> } !<t>

@<f-||-f> ( -- ) .F x ?{ .F y ?{ !<f> } } !<t>
@<f-||-t> ( -- ) .F x ?{ .T y ?{ !<f> } } !<t>
@<t-||-f> ( -- ) .T x ?{ .F y ?{ !<f> } } !<t>
@<t-||-t> ( -- ) .T x ?{ .T y ?{ !<f> } } !<t>

@x ( ? -- ? ) ;sx !<pstr>
@y ( ? -- ? ) ;sy !<pstr>
@<f> ( -- ) .F !<emit>
@<t> ( -- ) .T !<emit>

@<cr> ( -- ) #0a ( >> )
@<emit> ( char -- ) #18 DEO JMP2r
@<pstr> ( str* -- ) LDAk <emit> INC2 LDAk ?<pstr> POP2 JMP2r

( data )
@sx "(x) $1
@sy "(y) $1

@d-&&
	&ff "f 20 "&& 20 "f 20 "= 20 $1
	&ft "f 20 "&& 20 "t 20 "= 20 $1
	&tf "t 20 "&& 20 "f 20 "= 20 $1
	&tt "t 20 "&& 20 "t 20 "= 20 $1

@d-||
	&ff "f 20 "|| 20 "f 20 "= 20 $1
	&ft "f 20 "|| 20 "t 20 "= 20 $1
	&tf "t 20 "|| 20 "f 20 "= 20 $1
	&tt "t 20 "|| 20 "t 20 "= 20 $1
`}
