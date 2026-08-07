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
  DUP num/<print>    ( Run function to print number )
  INC GTHk ?loop     ( Loop while limit is larger than iterator )
POP2                 ( Pop limit and iterator )
BRK                  ( Halt. )

@num/<print> ( int -- )
  LIT "0 ADD         ( Add number to ascii character 0 )
  #18 DEO            ( Send to Console/write )
  JMP2r
`
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
@while
	DUP DUP #0a DIV EMIT #0a MOD EMIT
	DUP #03 MOD ?{ ;fizz str/<print> }
	DUP #05 MOD ?{ ;buzz str/<print> }
	#0a18 DEO INC NEQk ?while
POP2 BRK

@str/<print> ( str* -- )
	LDAk DUP ?{ POP POP2 JMP2r }
	#18 DEO
	INC2 !/<print>

@fizz 20 "fizz 00
@buzz 20 "buzz 00
`
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
	#0800
	&>l
		( | Print each step )
		#01 .System/debug DEO
		INC GTHk ?&>l
	( | Push the depth of the stack )
	.System/wst DEI BRK

`
examples.reverse_string=`( Reverse a string and print it )

	str/flip
	str/<print>
	BRK

@str/flip ( -- str* )
	[ LIT2r =&buf ] DUP2kr
	( sentinel ) #ff
	&>get
		LDAkr STHr DUP ?{
			POP POP2r
			&>put
				INCk ?{ POP POP2r STH2r JMP2r }
				STH2kr STA
				INC2r !/>put }
		INC2r !/>get
		
@str/<print> ( str* -- )
	LDAk DUP ?{ POP POP2 JMP2r }
	#18 DEO
	INC2 !/<print>

@str/buf "wonderland 00
`
examples.fibonacci=`( 54K . Fibonacci Short
| 0x00, 0x01, 0x01, 0x02, 0x03, 0x05, 0x08, 0x0d, 0x15, 0x22 )

#0009 u16/fib BRK

@u16/fib ( num* -- numfib* )
	#0001 GTH2k ?{ POP2 JMP2r }
	SUB2k /fib STH2
	INC2 SUB2 /fib STH2r ADD2 JMP2r
`
examples.print_date=`( 54K . Print date as.. Day, 1 Jan 2026 )

|c0 @DateTime/year $2 &month $1 &day $1 &hour $1 &minute $1 &second $1 &dotw $1 &doty $2

|100

@on-reset ( -> )
	[ LIT2 00 -DateTime/dotw ] DEI #20 SFT ;dict/days ADD2 str/<print>
	[ LIT2 ", 18 ] DEO
	#2018 DEO
	[ LIT2 00 -DateTime/day ] DEI dec/<print>
	#2018 DEO
	[ LIT2 00 -DateTime/month ] DEI #20 SFT ;dict/months ADD2 str/<print>
	#2018 DEO
	.DateTime/year DEI2 dec/<print>
	#0a18 DEO
	BRK

@str/<print> ( str* -- )
	LDAk DUP ?{ POP POP2 JMP2r }
	#18 DEO
	INC2 !/<print>

@dec/<print> ( short* -- )
	#2710 [ LIT2r 00fb ]
	&>w
		DIV2k #000a DIV2k MUL2 SUB2 SWPr EQUk OVR STHkr EQU AND ?{ 
			DUP LIT "0 ADD #18 DEO
			INCr }
		POP2 #000a DIV2 SWPr INCr STHkr ?&>w
	POP2r POP2 POP2 JMP2r

@dict/months [
	"Jan $1 "Feb $1 "Mar $1 "Apr $1
	"May $1 "Jun $1 "Jul $1 "Aug $1
	"Sep $1 "Oct $1 "Nov $1 "Dec $1 ]
	&days [
	"Sun $1 "Mon $1 "Tue $1 "Wed $1
	"Thu $1 "Fri $1 "Sat $1 ]
`
examples.print_time=`( 54K . Print time as.. hh:mm:ss )

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
	JMP2r
`
examples.print_arvelie=`( 54K . Arvelie Date )

|c0 @DateTime/year $2 &month $1 &day $1 &hour $1 &minute $1 &second $1 &dotw $1 &doty $2

|100

@on-reset ( -> )
	.DateTime/doty DEI2 .DateTime/year DEI2 arvelie/<print>
	BRK

@arvelie/<print> ( doty* year* -- )
	#07d6 SUB2 NIP
	( y ) u8/<print-dec>
	( m ) DUP2 #000e DIV2 NIP #11 ADD DUP #2a GTH #30 MUL SUB u8/<print-digit>
	( d ) #000e DIV2k MUL2 SUB2 NIP
	( >> )

@u8/<print-dec> ( byte -- )
	DUP #0a DIV u8/<print-digit>
	#0a DIVk MUL SUB
	( >> )

@u8/<print-digit> ( num -- )
	[ LIT "0 ] ADD #18 DEO
	JMP2r
`
examples.fizzbuzz=`( 54K . Fizzbuzz
| Fizz when divisible by 3
| Buzz when divisible by 5
| FizzBuzz when divisible by 15
| Otherwise, a number )

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
	POP2 BRK
`
examples.double_trans=`( 54K . Double Transposition Encoder )

@dt/on-reset ( -> )
	;&key1 t1/<set-key>
	;&key2 t2/<set-key>
	;&msg t1/<set-buf>
	t1/<extend>
	t1/<encode>
	t2/<extend>
	t2/<encode>
	BRK

	&key1 "malignant 00
	&key2 "rabbit 00
	&msg "green_hands_at_dawn 00

(
@|t1 )

@t1/<set-key> ( key* -- )
	DUP2 str/<print-ln>
	&>wsk
		LDAk DUP ?{
			POP POP2 ;&key str/make-key !str/<print-ln> }
		[ LIT2 &kptr =&key ] INC2k ,&kptr STR2
		STA
		INC2 !/>wsk

@t1/<set-buf> ( str* -- )
	&>wsb
		LDAk DUP ?{ POP POP2 JMP2r }
		/<push>
		INC2 !/>wsb

@t1/get-buflen ( -- length* )
	,&ptr LDR2 ;&buf SUB2 JMP2r

@t1/get-keylen ( -- length* )
	,&kptr LDR2 ;&key SUB2 JMP2r

@t1/<push> ( c -- )
	[ LIT2 &ptr =&buf ] INC2k ,&ptr STR2
	STA
	JMP2r

@t1/<extend> ( -- )
	( rows ) /get-buflen STH2k /get-keylen STH2k DIV2 INC2 DUP2 ,&rows STR2
	( rows * keylen max ) STH2r MUL2 STH2r SUB2 SUB
	&>le
		DUP ?{ POP JMP2r }
		( fill ) LIT "_ /<push>
		INC !/>le

@t1/<encode> ( -- )
	/get-buflen #0000
	&>l
		DUP2
		( y ) DUP2 [ LIT2 &rows $2 ] STH2k DIV2k MUL2 SUB2
		( x ) SWP2 STH2r DIV2 ;&key SWP2 str/get-x SWP2 /get-keylen [ LIT2r =&buf ] MUL2 ADD2 STH2r ADD2 LDA t2/<push>
		INC2 GTH2k ?/>l
	POP2 POP2 JMP2r

(
@|t2 )

@t2/<set-key> ( key* -- )
	DUP2 str/<print-ln>
	&>wsk
		LDAk DUP ?{
			POP POP2 ;&key str/make-key !str/<print-ln> }
		[ LIT2 &kptr =&key ] INC2k ,&kptr STR2
		STA
		INC2 !/>wsk

@t2/<push> ( c -- )
	[ LIT2 &ptr =&buf ] INC2k ,&ptr STR2
	STA
	JMP2r

@t2/get-buflen ( -- length* )
	,&ptr LDR2 ;&buf SUB2 JMP2r

@t2/get-keylen ( -- length* )
	,&kptr LDR2 ;&key SUB2 JMP2r

@t2/<extend> ( -- )
	( rows ) /get-buflen STH2k /get-keylen STH2k DIV2 INC2 DUP2 ,&rows STR2
	( rows * keylen max ) STH2r MUL2 STH2r SUB2 SUB
	&>le
		DUP ?{ POP JMP2r }
		( fill ) LIT "_ /<push>
		INC !/>le

@t2/<encode> ( -- )
	;&buf str/<print-ln>
	/get-buflen #0000
	&>l
		DUP2
		( y ) DUP2 [ LIT2 &rows $2 ] STH2k DIV2k MUL2 SUB2
		( x ) SWP2 STH2r DIV2 ;&key SWP2 str/get-x SWP2 /get-keylen [ LIT2r =&buf ] MUL2 ADD2 STH2r ADD2 LDA
		( print ) #18 DEO
		INC2 GTH2k ?/>l
	POP2 POP2 #0a18 DEO
	JMP2r

(
@|Stdlib )

@str/get-x ( buf* id* -- x* )
	LIT "1 ADD STH
	POP DUP2
	&>wg
		LDAk STHkr EQU ?{ INC2 LDAk ?/>wg }
	SWP2 SUB2 POPr JMP2r

@str/make-key ( buf* -- buf* )
	STH2
	[ LIT2 "1 _&id ] STR
	LIT2 "za
	&>l
		DUP ,&t STR
		STH2kr
		&>w
			LDAk [ LIT &t $1 ] NEQ ?{
				DUP2 [ LIT &id "1 ] INCk ,&id STR
				ROT ROT STA }
			INC2 LDAk ?/>w
		POP2 INC GTHk ?/>l
	POP2 STH2r JMP2r

@str/<print-ln> ( str* -- )
	/<print>
	#0a18 DEO
	JMP2r

@str/<print> ( str* -- )
	LDAk DUP ?{ POP POP2 JMP2r }
	#18 DEO
	INC2 !/<print>

@t1/key $10

@t1/buf $100

@t2/key $10

@t2/buf

`
examples.subleq=`( 54K . -leq )

@subleq/on-reset ( -> )
	( | Load rom into zero-page )
	#00
	&>l
		DUP #00 OVR ;&rom ADD2 LDA2 ROT STZ2
		INC INC DUP ?&>l
	POP
	( | Eval until hitting Q line )
	[ LIT2 -&Q 00 ]
	&>w
		/step NEQk ?&>w
	POP2
	( | Load cell w )
	.&w LDZ BRK

@subleq/step ( ptr -- ptr )
	( a b . b ) LDZ2k STHk LDZ SWP LDZ SUB
	( [b]=b-a ) DUP STHr STZ
	DUP ?{
		POP &apply INC INC LDZ JMP2r }
	#80 AND ?&apply
	#03 ADD JMP2r

|0200
	( | Add a + b, and move result in w )
	@subleq/rom [4
	&0 -&0 -&0 -/1
	&1 -&a -&0 -/2
	&2 -&0 -&b -/3
	&3 -&w -&w -/4
	&4 -&a -&0 -/5
	&5 -&0 -&w -/6
	&6 -&0 -&0 -/Q ]
	&a 12
	&b 34
	&w 00 &Q

`
examples.bf_interpreter=`( 54K . Brainfuck Interpreter )

@brainfuck/on-reset ( -> )
	;rom [ LIT2r =rom/end ]
	&>while
		LDAk [ LIT "+ ] NEQ ?{ LDAkr STHr INC STH2kr STA }
		LDAk [ LIT "- ] NEQ ?{ LDAkr STHr #01 SUB STH2kr STA }
		LDAk [ LIT "> ] NEQ ?{ INC2r }
		LDAk [ LIT "< ] NEQ ?{ [ LIT2r 0001 ] SUB2r }
		LDAk [ LIT ". ] NEQ ?{ LDAkr [ LITr 18 ] DEOr }
		LDAk [ LIT "[ ] NEQ ?{ LDAkr STHr goto-next }
		LDAk [ LIT "] ] NEQ ?{ LDAkr STHr goto-back }
		INC2 LDAk ?&>while
	POP2 POP2r BRK

@goto-next ( prg* byte . mem* -- )
	?{ JMP2r }
	[ LITr 00 ] INC2
	&>loop
		LDAk [ LIT "[ ] NEQ ?{ INCr }
		LDAk [ LIT "] ] NEQ ?{ STHkr ?{ POPr JMP2r }
			[ LITr 01 ] SUBr }
		INC2 !&>loop

@goto-back ( prg* byte . mem* -- )
	?{ JMP2r }
	[ LITr 00 ] #0001 SUB2
	&>loop
		LDAk [ LIT "] ] NEQ ?{ INCr }
		LDAk [ LIT "[ ] NEQ ?{ STHkr ?{ POPr JMP2r }
			[ LITr 01 ] SUBr }
		#0001 SUB2 !&>loop

@rom [1
	">++++++++[<+++++++++>-]<.>++++
	"[<+++++++>-]<+.+++++++..+++.>>
	"++++++[<+++++++>-]<++.--------
	"----.>++++++[<+++++++++>-]<+.<
	".+++.------.--------.>>>++++[<
	"++++++++>-]<+. ] 00 &end

`
examples.bf_compiler=`( 54K . Brainfuck Compiler )

@compiler/on-reset ( -> )
	;&input
	&>w
		LDAk ?{
			POP2 ;&ptr LDA2 ;&buf mem/<print>
			BRK }
		/<push-line>
		INC2 !/>w

@compiler/<push-line> ( addr* -- next* )
	LDAk LIT "> EQU ?pointer/<inc>
	LDAk LIT "< EQU ?pointer/<dec>
	LDAk LIT "+ EQU ?/<push-inc>
	LDAk LIT "- EQU ?/<push-dec>
	LDAk LIT "[ EQU ?/<push-jca>
	LDAk LIT "] EQU ?/<push-jcb>
	LDAk LIT ". EQU ?/<push-out>
	JMP2r

@compiler/<push-out> ( addr* -- next* )
	( LIT2 hb lb LDA ) /<push-litptrlda>
	( LIT 18 ) #18 /<push-lit>
	( DEO ) [ LIT DEO ] !/<push>

@compiler/<push-jca> ( addr* -- next* )
	( Record bracket position ) ;&ptr LDA2 stack/<push>
	( LIT2 hb lb LDA ) /<push-litptrlda>
	( LIT 00 ) #00 /<push-lit>
	( EQU ) [ LIT EQU ] /<push>
	( LIT2 xx xx ) #eeee /<push-lit2>
	( JCN2 ) [ LIT JCN2 ] !/<push>

@compiler/<push-jcb> ( addr* -- next* )
	( Before opening bracket ) stack/pop
	( Beyond closing bracket ) ;&ptr LDA2 #0008 ADD2 #7f00 SUB2
	( Punch hole in jca ) OVR2 #0008 ADD2 STA2
	( LIT2 hb lb LDA ) /<push-litptrlda>
	( LIT2 xx xx ) #7f00 SUB2 /<push-lit2>
	( JCN2 ) [ LIT JCN2 ] !/<push>

@compiler/<push-inc> ( addr* -- next* )
	[ LIT2 ADDr "+ ] !/<push-mod>

@compiler/<push-dec> ( addr* -- next* )
	[ LIT2 SUBr "- ]
	( >> )

@compiler/<push-mod> ( addr* -- next* )
	,&c STR
	,&o STR
	LIT2r 0000
	&>wm
		LDAk [ LIT &c "+ ] EQU ?{
			#0001 SUB2
			( LIT2 hb lb LDA ) /<push-litptrlda>
			[ &o ADDr ] STHr
			( LIT u8 ) /<push-lit>
			( ADD ) [ LIT ADD ] /<push>
			( LIT2 hb lb ) /<push-litptr>
			( STA ) [ LIT STA ] !/<push> }
		INC2 INCr !/>wm

@compiler/<push-lit> ( u8 -- )
	[ LIT LIT ] SWP !/<push2>

@compiler/<push-litptrlda> ( -- )
	( LIT2 hb lb ) /<push-litptr>
	( LDA ) [ LIT LDA ] !/<push>

@compiler/<push-litptr> ( -- )
	( LIT2 hb lb ) pointer/get
	( >> )

@compiler/<push-lit2> ( u16* -- )
	( LIT2 ) [ LIT LIT2 ] /<push>
	( >> )

@compiler/<push2> ( hb lb )
	( hb lb ) SWP /<push>
	( >> )

@compiler/<push> ( u8 -- )
	( u8 ) [ LIT2 &ptr =&buf ] INC2k ,&ptr STR2
	STA
	JMP2r

(
@|Stack )

@stack/<push> ( addr* -- )
	[ LIT2 &ptr =&buf ] INC2k INC2 ,&ptr STR2
	STA2
	JMP2r

@stack/pop ( -- addr* )
	,&ptr LDR2 #0002 SUB2 DUP2 ,&ptr STR2
	LDA2 JMP2r

(
@|Pointer )

@pointer/get ( -- addr* )
	,&ptr LDR2 JMP2r

@pointer/<dec> ( -- )
	/get #0001 SUB2 !/<set>

@pointer/<inc> ( -- )
	[ LIT2 &ptr 8000 ] INC2
	( >> )

@pointer/<set> ( addr* -- )
	,&ptr STR2
	JMP2r

(
@|Stdlib )

@mem/<print> ( to* from* -- )
	[ LIT2r 0701 ]
	&>l
		LDA2k u16/<print>
		#2018 DEO
		ANDkr STHr ?{ #0a18 DEO }
		INC2 INC2 INCr GTH2k ?&>l
	POP2 POP2 POP2r JMP2r

@u16/<print> ( short* -- )
	SWP u8/<print>
	( >> )

@u8/<print> ( byte -- )
	DUP #04 SFT /<print-nibble>
	( >> )
	&<print-nibble> ( byte -- )
	#0f AND DUP #09 GTH #27 MUL ADD
	( ascii ) [ LIT "0 ] ADD #18 DEO
	JMP2r

@compiler/input [1
	">++++++++[<+++++++++>-]<.>++++
	"[<+++++++>-]<+.+++++++..+++.>>
	"++++++[<+++++++>-]<++.--------
	"----.>++++++[<+++++++++>-]<+.<
	".+++.------.--------.>>>++++[<
	"++++++++>-]<+. ] 00

@stack/buf $200
|8000 @compiler/buf

`
examples.sierpinski=`( 54K . Sierpiński Triangle )

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
	POP POP2r POP2r BRK
`
examples.mandelbrot=`( 54K . Mandelbrot Fractal )

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
	( i ) #00ff ROT ADD ;&lut ADD2 LDA #18 DEO
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

	&lut "Q80XCTI1l!i;:"^',. 20
`
