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
  Select the next example with the dropdown. )

;text                 ( Push text pointer ) 

@while                ( Create while label )

    LDAk DUP ?{       ( Load byte at address, jump if not null ) 
        POP2 BRK }    ( When null, pop text pointer, halt ) 
    #18 DEO           ( Send byte to Console/write port )
    INC2 !while       ( Incr text pointer, jump to label )

@text                 ( Create text label )

	"Hello 20 "World! 00`,

/* 
@|1.Stack */

"1_tal": `( The Uxn virtual machine has two stacks of 256 bytes.
  A byte is a value between the hexadecimal numbers 00 and ff. )

#0a          ( Push 0a byte to the stack )
#0b          ( Push 0b byte to the stack )
SWP          ( Swap them, so 0a is on top )
NIP POP      ( Nip the 0b byte, pop the 0a byte )

( There are four arithmetic operators.
  Postfix arithmetic has no precedence rules,
  operations are applied in the order. )

#02 #10 ADD  ( 02 + 10 = 12 )
#04 #08 SUB  ( 04 - 08 = fc )
#08 #04 MUL  ( 08 * 04 = 20 )
#10 #02 DIV  ( 10 / 02 = 08 )`,

/* 
@|2.Literals */

"2_tal": `( A literal is a number to be pushed to the stack,
  Uxntal supports various ways of creating literal bytes. )

    80 01  ( A number will be interpreted as an opcode )
   LIT 01  ( 80 is the numerical value of the LIT opcode )
      #01  ( This is a shorthand for a literal byte )

( A literal short is a literal number made of two bytes. )

  a0 1234  ( A number will be interpreted as an opcode )
LIT2 1234  ( a0 is the numerical value of the LIT2 opcode )
    #1234  ( This is the shorthand for a literal short )

( ASCII characters can also be made into literal bytes. )

LIT "H #18 DEO ( Push the letter H, send to Console/write )
LIT "i #18 DEO ( Push the letter i, send to Console/write )`,

/* 
@|3.Enums&Structs */

"3_tal": `( Programs can utilize up to ff00 of memory,
  the program location is where the program data is written in memory. )

|1234 ( Move program location to 1234 )
$10   ( Move program location by 10, to 1244 )

( Scope in a program is created with a @label, 
  members to this scope is created with &sublabels.  )

|0  @enum &a $1 &b $1 &c   ( Enum with fields a=0, b=1, c=2 )
|10 @struct &a $8 &b $2 &c ( Struct with fields a=10, b=18, c=1a )
|200 @const                ( Const with a value of 200 )

( By default, the program location begins at 100, 
  but if the location has moved, it must be set back.
  Every Uxn program begins at 100. )

|100 .struct/b BRK`,

/* 
@|4.Variables */

"4_tal": `|000              ( Move program location to Zero-page )
	@zep8 $1        ( Allocate a byte of space )
	@zep16 $2       ( Allocate a short of space )

|100              ( Move program location to Reset )
#12 .zep8 STZ     ( Set zero-page variable "zep8" to 12 )
#3456 .zep16 STZ2 ( Set zero-page variable "zep16" to 3456 )
.zep8 LDZ         ( Get byte in zero-page variable "zep8" )
.zep16 LDZ2       ( Get short in zero-page variable "zep16" )
#12 ;abs8 STA     ( Set 12 to the distant variable "abs8" )
#3456 ;abs16 STA2 ( Set 3456 to the distant variable "abs16" )
;abs8 LDA         ( Get the byte stored in distant variable "abs8" )
;abs16 LDA2       ( Get the short stored in distant variable "abs16" )
BRK 

|8000             ( Move program location to 8000 )
	@abs8 $1
	@abs16 $2 `,

/* 
@|5.Functions */

"5_tal": `( In Uxntal programs everything is a function 
  doing some kind of transformation on stacks. )

#12 double  ( Apply the "double" function  )
;promote    ( Push a pointer to the "promote function" )
JSR2        ( Call the pointer and apply )

BRK         ( Halt )

@promote ( byte -- short* )
	#00 SWP JMP2r 

@double ( value -- res )
	DUP ADD JMP2r`,

/* 
@|6.If/Else */

"6_tal": `( Immediate conditional jumps in Uxntal is done 
  by checking if the top of the stack is not zero. )

#05 
#08 NEQ ?{              ( Jump to closing curly if top of stack is not zero )
	;equ-str print BRK    ( if )
} 
;neq-str print BRK      ( else )

@print ( str* -- )
	LDAk DUP ?{ POP2 POP2 JMP2r }
	#18 DEO INC2 !print

@equ-str "Is 20 "8. 00
@neq-str "Is 20 "not 20 "8. 00
`,

/* 
@|7.Loop */

"7_tal": `( Loops are done by pushing boundaries 
and comparing the bounds against the iterator )

#08 #00              ( Push limit and iterator )
&loop
  DUP emit-num       ( Emit number )
  INC GTHk ?&loop    ( Continue while limit is larger than iterator)
POP2                 ( )

BRK

@emit-num ( int -- )
  LIT "0 ADD #18 DEO ( convert number to ascii value )
  JMP2r`,

/* 
@|8.While */

"8_tal": `#64 #01
&while
	DUP print-dec
	DUP #03 DIVk MUL SUB ?{ ;fizz print-str }
	DUP #05 DIVk MUL SUB ?{ ;buzz print-str }
	#0a18 DEO
	INC NEQk ?&while
POP2 BRK

@print-str ( str* -- )
	LDAk DUP ?{ POP POP2 JMP2r }
	#18 DEO INC2 !print-str

@print-dec ( num -- )
	DUP #0a DIV emit-dec
	#0a DIVk MUL SUB ( .. )

@emit-dec ( num -- )
	LIT "0 ADD #18 DEO JMP2r

@fizz 20 "fizz 00
@buzz 20 "buzz 00`}