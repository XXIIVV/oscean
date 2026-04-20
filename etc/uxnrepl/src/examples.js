let examples={}
examples.hello_world=`( This is a comment, and is ignored by the assembler.
  Click the Run button to evaluate the program.
  Select the next example with the dropdown. )

;text                   ( Push text pointer )

@while                  ( Create while label )

    LDAk DUP ?{         ( Load byte at address, jump if not null )
        POP POP2 BRK }  ( When null, pop text pointer, halt )
    #18 DEO             ( Send byte to Console/write port )
    INC2 !while         ( Incr text pointer, jump to label )

@text                   ( Create text label )

    "Hello 20 "World! 00`
examples.stack=`( The Uxn virtual machine has a working stack of 256 bytes.
  A byte is a value between the hexadecimal numbers 00 and ff. )

#0a          ( Push 0a byte to the stack )
#0b          ( Push 0b byte to the stack )
SWP          ( Swap them, so 0a is on top )
NIP POP      ( Nip the 0b byte, pop the 0a byte )

( Postfix arithmetic has no precedence rules,
  operations are simply applied in the order they are called. )

#02 #10 ADD  ( 02 + 10 = 12 )
#04 #08 SUB  ( 04 - 08 = fc )
#08 #04 MUL  ( 08 * 04 = 20 )
#10 #02 DIV  ( 10 / 02 = 08 )`
examples.numbers=`( A literal is a number to be pushed to the stack,
  Uxntal supports various ways of creating literal bytes. )

    80 12  ( A number will be interpreted as an opcode )
   LIT 12  ( 80 is the numerical value of the LIT opcode )
      #12  ( This is a shorthand for a literal byte )

( A literal short is a literal number made of two bytes. )

  a0 1234  ( A number will be interpreted as an opcode )
LIT2 1234  ( a0 is the numerical value of the LIT2 opcode )
    #1234  ( This is the shorthand for a literal short )

( ASCII characters can also be made into literal bytes. )

LIT "H #18 DEO  ( Push the letter H, send to Console/write )
LIT2 "i 18 DEO  ( Push the letter i, send to Console/write )`
examples.functions=`( Function labels are followed by a comment that explains
  the expected transformation, in the format: before -- after )

#12 double  ( Apply the "double" function on the number 12 )
;promote    ( Push a pointer to the "promote" function )
JSR2        ( Call the pointer to apply the "promote" function )
BRK         ( Halt program with a BRK )

@promote ( byte -- short* )
  #00 SWP   ( Body of the function )
  JMP2r     ( Return by jumping to address in return stack )

@double ( value -- res )
  DUP ADD
  JMP2r`
examples.variables=`( The program location can be moved to create labels of different values,
  but must always be returned to 100, which is where all Uxn programs begin. )

|000               ( Move program location to Zero-page )

    @zep8 $1       ( Allocate a byte of space )
    @zep16 $2      ( Allocate a short of space )

|100               ( Move program location to Reset )

#12 .zep8 STZ      ( Set "zep8" to 12 )
.zep8 LDZ          ( Get byte in zero-page variable "zep8" )

#3456 .zep16 STZ2  ( Set zero-page variable "zep16" to 3456 )
.zep16 LDZ2        ( Get short in zero-page variable "zep16" )`
examples.if_else=`( Immediate conditional jumps in Uxntal is done
  by checking if the top of the stack is not zero. )

#80           ( Push a value on stack )
#01 ?{ INC }  ( 80 )
#00 ?{ INC }  ( 81 )

( Each logic opcode EQU, NEQ, GTH, LTH will push
  a non-zero byte when true. There are many ways
  to do a conditional jump: )

#08 #04 EQU ?label INC @label  ( 81 )
#08 #04 NEQ ?&a INC &a         ( 82 )
#08 #04 GTH ?{ INC }           ( 83 )
#08 #04 LTH ,&b JCN INC &b     ( 83 )`
examples.loops=`( Basic loops are done by pushing a limit and an iterator
  and comparing the bounds against the iterator each cycle )

#08                  ( Push limit )
#00                  ( Push iterator )
@loop
  DUP print-num      ( Run function to print number )
  INC GTHk ?loop     ( Loop while limit is larger than iterator )
POP2                 ( Pop limit and iterator )
BRK                  ( Halt. )

@print-num ( int -- )
  LIT "0 ADD         ( Add number to ascii character 0 )
  #18 DEO            ( Send to Console/write )
  JMP2r`
examples.enums=`( Programs can utilize up to ff00 of memory,
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

|100 .struct/b`
examples.macros=`( A macro is an inline function, but it must be created before. )

%MOD ( num div -- res ) { DIVk MUL SUB }
%EMIT ( num ) { LIT "0 ADD #18 DEO }

#64 #01
&while
    DUP DUP #0a DIV EMIT #0a MOD EMIT
    DUP #03 MOD ?{ ;fizz print-str }
    DUP #05 MOD ?{ ;buzz print-str }
    #0a18 DEO INC NEQk ?&while
POP2 BRK

@print-str ( str* -- )
    LDAk DUP ?{ POP POP2 JMP2r } #18 DEO INC2 !print-str

@fizz 20 "fizz 00
@buzz 20 "buzz 00`
examples.objects=`( Uxntal objects are statically allocated data-structures
  with methods accessible via sublabels. )

@on-reset ( -> )
  ;dict/a obj/set
  ;dict/b obj/join
  obj/emit
  BRK

@obj/set ( -- )
  ;&buf ,&ptr STR2
  ( >> )

@obj/join ( str* -- )
  &>w
    LDAk DUP ?{ POP POP2 JMP2r }
    /push INC2 !&>w

@obj/emit ( -- )
  ,&ptr LDR2 ;&buf
  &>l
    NEQ2k ?{ POP2 POP2 JMP2r }
    LDAk #18 DEO INC2 !&>l

@obj/push ( c -- )
  #00 [ LIT2 &ptr =&buf ]
  DUP2 ;&cap NEQ2 ?{ ( handle overflow ) }
  INC2k ,&ptr STR2
	STA2 JMP2r

@dict/a "foo $1
  &b "bar $1

@obj/buf $40 &cap`
examples.debugging=`( The stack states can be printed at any point during
  evaluation using the System/debug port. The depth of each stack
  can be polled for error handling. )

|00 @System $4 &wst $1 &rst $1 $8 &debug $1 &state $1
|18 @Console/write

|100

@on-reset ( -> )
    #1234
    #01 .System/debug DEO
   .System/wst DEI #02 NEQ ?{       ( Check that working-stack depth is 2 )
        LIT2 "1 -Console/write DEO  ( Print success )
        BRK
    }
     LIT2 "0 -Console/write DEO     ( Print failure )`
examples.fibonacci=`( 0x00, 0x01, 0x01, 0x02, 0x03, 0x05, 0x08, 0x0d, 0x15, 0x22 )

#0009 fibo BRK

@fibo ( num* -- numfib* )
	#0001 GTH2k ?{ POP2 JMP2r }
	SUB2k fibo STH2
	INC2 SUB2 fibo STH2r ADD2 JMP2r`
examples.print_time=`( Print the time in the hh:mm:ss format )

|c0 @DateTime/year $2 &month $1 &day $1 &hour $1 &minute $1 &second $1

|100

@on-reset ( -> )
	.DateTime/hour DEI u8/<print-dec>
	LIT2 ": 18 DEO
	.DateTime/minute DEI u8/<print-dec>
	LIT2 ": 18 DEO
	.DateTime/second DEI u8/<print-dec>
	#0a18 DEO
	BRK

@u8/<print-dec> ( u8 -- )
	DUP #0a DIV /<print-digit>
	#0a DIVk MUL SUB
	( >> )

@u8/<print-digit> ( d -- )
	LIT "0 ADD #18 DEO
	JMP2r`
examples.fizzbuzz=`( Print the fizzbuzz sequence )

#6501

@fizzbuzz ( n i -- )
	#00 OVR #03 DIVk MUL SUB ?{
		INC LIT2 "F 18 DEO
		LIT2 "i 18 DEO
		LIT2 "z 18 DEOk DEO }
	OVR #05 DIVk MUL SUB ?{
		INC LIT2 "B 18 DEO
		LIT2 "u 18 DEO
		LIT2 "z 18 DEOk DEO }
	?{
		DUP #0a DIVk DUP #30 ADD #18 DEO
		MUL SUB #30 ADD #18 DEO }
	#0a18 DEO
	INC GTHk ?fizzbuzz
	POP2 BRK`
examples.sierpinski=`( Draw the Sierpiński triangle )

@sierpinski ( -> )
	( mask ) [ LIT2r 0a18 ] [ LIT2r 2018 ] 
	( size ) [ LIT2 &size 1001 ] SUB
	&>ver ( -- )
		DUP INCk
		&>pad ( length -- )
			DEOkr
			#01 SUB DUP ?&>pad
		&>fill ( length i -- )
			ANDk DUP2r ?{ POP2r ORA2kr } DEOr DEOkr
			INC ADDk ,&size LDR LTH ?&>fill
		POP2 OVR2r DEOr
		#01 SUB INCk ?&>ver
	POP POP2r POP2r BRK`
examples.mandelbrot=`( Draw the mandelbrot fractal )

|0020 @W
|0016 @H
|0003 @Z
|00e0 @A/x
|00c0 &y
|0090 @B/x
|0060 &y
|0006 @bits
|fc00 &mask
|0100 @LIMIT
|0013 @MAXITER

|100

@on-reset ( -> )
	mandelbrot/<draw>
	BRK

%mandelbrot/<emit> ( i2 i -- ) {
	( i ) #01 SUB #00 SWP ;&lut ADD2 LDA #18 DEO
	( i2 ) POP }

%mandelbrot/<lb> ( -- ) {
	#0a18 DEO }

@mandelbrot/<draw> ( -- )
	[ LIT2 -H -Z ] MUL ,&h/z STR
	[ LIT2 -W -Z ] MUL ,&w/z STR
	[ LIT2 -A/y -Z ] DIV ,&y/z STR
	[ LIT2 -A/x -Z ] DIV ,&x/z STR
	( | render )
	[ LIT2 &h/z $1 00 ]
	&>y
		( y ) #00 OVR [ LIT2 00 &y/z $1 ] MUL2 ;H DIV2 ;B/y SUB2 ,&y0 STR2
		[ LIT2 &w/z $1 00 ]
		&>x
			( x ) #00 OVR [ LIT2 00 &x/z $1 ] MUL2 ;W DIV2 ;B/x SUB2 ,&x0 STR2
			( -- . x* y* ) [ LIT2r 0000 ] DUP2r
			( i 0 ) [ LIT2 -MAXITER 00 ]
			&>i
				( . x* y* y* x* ) SWP2kr
				( x sqr ) DUP2r MUL2r STH2r /sign
				( y sqr ) DUP2r MUL2r STH2r /sign
				( test ) ADD2k ;LIMIT GTH2 ?&break
				MUL2r STH2r /sign #10 SFT2 [ LIT2 &y0 $2 ] ADD2 STH2
				SUB2 STH2
				[ LIT2r &x0 $2 ] ADD2r SWP2r
				( .. ) INC GTHk ?&>i
			!{
			&break POP2 POP2 }
		/<emit>
		( . x* y* -- ) POP2r POP2r
		( .. ) INC GTHk ?&>x
	POP2 /<lb>
	INC GTHk ?&>y
	POP2 JMP2r

@mandelbrot/sign ( x* -- res* )
	.bits SFT2 OVR #02 AND ?{ JMP2r }
	;bits/mask ORA2 JMP2r

	&lut "Q80XCTI1l!i;:"^',. 20`
