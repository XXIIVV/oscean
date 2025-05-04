/* Inspired from https://doc.rust-lang.org/rust-by-example/ */

let examples = {
/*
@|0.Hello-World */

"0_tal": `( This is a comment, and is ignored by the assembler.
  Click the Run button to evaluate the program.
  Select the next example with the dropdown. )

;text                   ( Push text pointer )

@while                  ( Create while label )

    LDAk DUP ?{         ( Load byte at address, jump if not null )
        POP POP2 BRK }  ( When null, pop text pointer, halt )
    #18 DEO             ( Send byte to Console/write port )
    INC2 !while         ( Incr text pointer, jump to label )

@text                   ( Create text label )

    "Hello 20 "World! 00`,

/*
@|1.Stack */

"1_tal": `( The Uxn virtual machine has a working stack of 256 bytes.
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
#10 #02 DIV  ( 10 / 02 = 08 )`,

/*
@|2.Literals */

"2_tal": `( A literal is a number to be pushed to the stack,
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
LIT2 "i 18 DEO  ( Push the letter i, send to Console/write )`,

/*
@|3.Functions */

"3_tal": `( Function labels are followed by a comment that explains
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
  JMP2r`,

/*
@|4.Variables */

"4_tal": `( The program location can be moved to create labels of different values,
  but must always be returned to 100, which is where all Uxn programs begin. )

|000               ( Move program location to Zero-page )

    @zep8 $1       ( Allocate a byte of space )
    @zep16 $2      ( Allocate a short of space )

|100               ( Move program location to Reset )

#12 .zep8 STZ      ( Set "zep8" to 12 )
.zep8 LDZ          ( Get byte in zero-page variable "zep8" )

#3456 .zep16 STZ2  ( Set zero-page variable "zep16" to 3456 )
.zep16 LDZ2        ( Get short in zero-page variable "zep16" )
`,

/*
@|5.If/Else */

"5_tal": `( Immediate conditional jumps in Uxntal is done
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
#08 #04 LTH ,&b JCN INC &b     ( 83 )
`,

/*
@|6.Loop */

"6_tal": `( Basic loops are done by pushing a limit and an iterator
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
  JMP2r`,

/*
@|7.Enums&Structs */

"7_tal": `( Programs can utilize up to ff00 of memory,
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
@|8.Macro */

"8_tal": `( A macro is an inline function, but it must be created before. )

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
@buzz 20 "buzz 00`}