/*******************************************************************************
* A minimal Forth compiler in C
* By Leif Bruder <leifbruder@gmail.com>
* Release 2014-04-04
* Modified by Devine Lu Linvega for Plan9 ARM
* Patch 2020-10-06
*
* Based on Richard W.M. Jones' excellent Jonesforth sources/tutorial
*
* PUBLIC DOMAIN
*
* I, the copyright holder of this work, hereby release it into the public
* domain. This applies worldwide. In case this is not legally possible, I grant
* any entity the right to use this work for any purpose, without any conditions,
* unless such conditions are required by law.
*******************************************************************************/

/* Only a single include here; I'll define everything on the fly to keep
* dependencies as low as possible. In this file, the only C standard functions
* used are getchar, putchar and the EOF value. */
#include <stdio.h>

/* Base cell data types. Use short/long on most systems for 16 bit cells. */
/* Experiment here if necessary. */
#define CELL_BASE_TYPE short
#define DOUBLE_CELL_BASE_TYPE long

/* Basic memory configuration */
#define MEM_SIZE 65536 /* main memory size in bytes */
#define STACK_SIZE 192 /* cells reserved for the stack */
#define RSTACK_SIZE 64 /* cells reserved for the return stack */
#define INPUT_LINE_SIZE 32 /* bytes reserved for the WORD buffer */

/******************************************************************************/

/* Our basic data types */
typedef CELL_BASE_TYPE scell;
typedef DOUBLE_CELL_BASE_TYPE dscell;
typedef unsigned CELL_BASE_TYPE cell;
typedef unsigned DOUBLE_CELL_BASE_TYPE dcell;
typedef unsigned char byte;
#define CELL_SIZE sizeof(cell)
#define DCELL_SIZE sizeof(dcell)

/* A few constants that describe the memory layout of this implementation */
#define LATEST_POSITION INPUT_LINE_SIZE
#define HERE_POSITION (LATEST_POSITION + CELL_SIZE)
#define BASE_POSITION (HERE_POSITION + CELL_SIZE)
#define STATE_POSITION (BASE_POSITION + CELL_SIZE)
#define STACK_POSITION (STATE_POSITION + CELL_SIZE)
#define RSTACK_POSITION (STACK_POSITION + STACK_SIZE * CELL_SIZE)
#define HERE_START (RSTACK_POSITION + RSTACK_SIZE * CELL_SIZE)
#define MAX_BUILTIN_ID 71

/* Flags and masks for the dictionary */
#define FLAG_IMMEDIATE 0x80
#define FLAG_HIDDEN 0x40
#define MASK_NAMELENGTH 0x1F

/* This is the main memory to be used by this Forth. There will be no malloc
* in this file. */
byte memory[MEM_SIZE];

/* Pointers to Forth variables stored inside the main memory array */
cell* latest;
cell* here;
cell* base;
cell* state;
cell* sp;
cell* stack;
cell* rsp;
cell* rstack;

/* A few helper variables for the compiler */
int exitReq;
int errorFlag;
cell next;
cell lastIp;
cell quit_address;
cell commandAddress;
cell maxBuiltinAddress;

/* The TIB, stored outside the main memory array for now */
char lineBuffer[128];
int charsInLineBuffer = 0;
int positionInLineBuffer = 0;

/* A basic setup for defining builtins. This Forth uses impossibly low
* adresses as IDs for the builtins so we can define builtins as
* standard C functions. Slower but easier to port. */
#define BUILTIN(id, name, c_name, flags)   \
	const int c_name##_id = id;        \
	const char* c_name##_name = name;  \
	const byte c_name##_flags = flags; \
	void c_name(void)
#define ADD_BUILTIN(c_name) addBuiltin(c_name##_id, c_name##_name, c_name##_flags, c_name)
typedef void (*builtin)(void);
builtin builtins[MAX_BUILTIN_ID] = {0};

/* This is our initialization script containing all the words we define in
* Forth for convenience. Focus is on simplicity, not speed. Partly copied from
* Jonesforth (see top of file). */
char* initscript_pos;
const char* initScript =
    ": DECIMAL 10 BASE ! ;\n"
    ": HEX 16 BASE ! ;\n"
    ": OCTAL 8 BASE ! ;\n"
    ": 2DUP OVER OVER ;\n"
    ": 2DROP DROP DROP ;\n"
    ": NIP SWAP DROP ;\n"
    ": 2NIP 2SWAP 2DROP ;\n"
    ": TUCK SWAP OVER ;\n"
    ": / /MOD NIP ;\n"
    ": MOD /MOD DROP ;\n"
    ": BL 32 ;\n"
    ": CR 10 EMIT ;\n"
    ": SPACE BL EMIT ;\n"
    ": NEGATE 0 SWAP - ;\n"
    ": DNEGATE 0. 2SWAP D- ;\n"
    ": CELLS CELL * ;\n"
    ": ALLOT HERE @ + HERE ! ;\n"
    ": TRUE -1 ;\n"
    ": FALSE 0 ;\n"
    ": 0= 0 = ;\n"
    ": 0< 0 < ;\n"
    ": 0> 0 > ;\n"
    ": <> = 0= ;\n"
    ": <= > 0= ;\n"
    ": >= < 0= ;\n"
    ": 0<= 0 <= ;\n"
    ": 0>= 0 >= ;\n"
    ": 1+ 1 + ;\n"
    ": 1- 1 - ;\n"
    ": 2+ 2 + ;\n"
    ": 2- 2 - ;\n"
    ": 2/ 2 / ;\n"
    ": 2* 2 * ;\n"
    ": D2/ 2. D/ ;\n"
    ": +! DUP @ ROT + SWAP ! ;\n"
    ": [COMPILE] WORD FIND >CFA , ; IMMEDIATE\n"
    ": [CHAR] key ' LIT , , ; IMMEDIATE\n"
    ": RECURSE LATEST @ >CFA , ; IMMEDIATE\n"
    ": DOCOL 0 ;\n"
    ": CONSTANT CREATE DOCOL , ' LIT , , ' EXIT , ;\n"
    ": 2CONSTANT SWAP CREATE DOCOL , ' LIT , , ' LIT , , ' EXIT , ;\n"
    ": VARIABLE HERE @ CELL ALLOT CREATE DOCOL , ' LIT , , ' EXIT , ;\n" /* TODO: Allot AFTER the code, not before */
    ": 2VARIABLE HERE @ 2 CELLS ALLOT CREATE DOCOL , ' LIT , , ' EXIT , ;\n" /* TODO: Allot AFTER the code, not before */
    ": IF ' 0BRANCH , HERE @ 0 , ; IMMEDIATE\n"
    ": THEN DUP HERE @ SWAP - SWAP ! ; IMMEDIATE\n"
    ": ELSE ' BRANCH , HERE @ 0 , SWAP DUP HERE @ SWAP - SWAP ! ; IMMEDIATE\n"
    ": BEGIN HERE @ ; IMMEDIATE\n"
    ": UNTIL ' 0BRANCH , HERE @ - , ; IMMEDIATE\n"
    ": AGAIN ' BRANCH , HERE @ - , ; IMMEDIATE\n"
    ": WHILE ' 0BRANCH , HERE @ 0 , ; IMMEDIATE\n"
    ": REPEAT ' BRANCH , SWAP HERE @ - , DUP HERE @ SWAP - SWAP ! ; IMMEDIATE\n"
    ": UNLESS ' 0= , [COMPILE] IF ; IMMEDIATE\n"
    ": DO HERE @ ' SWAP , ' >R , ' >R , ; IMMEDIATE\n"
    ": LOOP ' R> , ' R> , ' SWAP , ' 1+ , ' 2DUP , ' = , ' 0BRANCH , HERE @ - , ' 2DROP , ; IMMEDIATE\n"
    ": +LOOP ' R> , ' R> , ' SWAP , ' ROT , ' + , ' 2DUP , ' <= , ' 0BRANCH , HERE @ - , ' 2DROP , ; IMMEDIATE\n"
    ": I ' R@ , ; IMMEDIATE\n"
    ": SPACES DUP 0> IF 0 DO SPACE LOOP ELSE DROP THEN ;\n"
    ": ABS DUP 0< IF NEGATE THEN ;\n"
    ": DABS 2DUP 0. D< IF DNEGATE THEN ;\n"
    ": .DIGIT DUP 9 > IF 55 ELSE 48 THEN + EMIT ;\n"
    ": .SIGN DUP 0< IF 45 EMIT NEGATE THEN ;\n" /* BUG: 10000000000... will be shown wrong */
    ": .POS BASE @ /MOD ?DUP IF RECURSE THEN .DIGIT ;\n"
    ": . .SIGN DUP IF .POS ELSE .DIGIT THEN ;\n"
    ": COUNTPOS SWAP 1 + SWAP BASE @ / ?DUP IF RECURSE THEN ;\n"
    ": DIGITS DUP 0< IF 1 ELSE 0 THEN SWAP COUNTPOS ;\n"
    ": .R OVER DIGITS - SPACES . ;\n"
    ": . . SPACE ;\n"
    ": ? @ . ;\n"
    ": .S DSP@ BEGIN DUP S0@ > WHILE DUP ? CELL - REPEAT DROP ;\n"
    ": TYPE 0 DO DUP C@ EMIT 1 + LOOP DROP ;\n"
    ": ALIGN BEGIN HERE @ CELL MOD WHILE 0 C, REPEAT ;\n"
    ": s\" ' LITSTRING , HERE @ 0 , BEGIN KEY DUP 34 <> WHILE C, REPEAT DROP DUP HERE @ SWAP - CELL - SWAP ! ALIGN ; IMMEDIATE\n"
    ": .\" [COMPILE] s\" ' TYPE , ; IMMEDIATE\n"
    ": ( BEGIN KEY [CHAR] ) = UNTIL ; IMMEDIATE\n"
    ": COUNT DUP 1+ SWAP C@ ;\n"
    ": MIN 2DUP < IF DROP ELSE NIP THEN ;\n"
    ": MAX 2DUP > IF DROP ELSE NIP THEN ;\n"
    ": D0= OR 0= ;\n"
    ": DMIN 2OVER 2OVER D< IF 2DROP ELSE 2NIP THEN ;\n"
    ": DMAX 2OVER 2OVER D> IF 2DROP ELSE 2NIP THEN ;\n";

/******************************************************************************/

/* The primary data output function. This is the place to change if you want
* to e.g. output data on a microcontroller via a serial interface. */
void
putkey(char c)
{
	putchar(c);
}

/* The primary data input function. This is where you place the code to e.g.
* read from a serial line. */
int
llkey(void)
{
	if(*initscript_pos)
		return *(initscript_pos++);
	return getchar();
}

/* Anything waiting in the keyboard buffer? */
int
keyWaiting(void)
{
	return positionInLineBuffer < charsInLineBuffer ? -1 : 0;
}

/* Line buffered character input. We're duplicating the functionality of the
* stdio library here to make the code easier to port to other input sources */
int
getkey(void)
{
	int c;

	if(keyWaiting())
		return lineBuffer[positionInLineBuffer++];

	charsInLineBuffer = 0;
	while((c = llkey()) != EOF) {
		if(charsInLineBuffer == sizeof(lineBuffer))
			break;
		lineBuffer[charsInLineBuffer++] = c;
		if(c == '\n')
			break;
	}

	positionInLineBuffer = 1;
	return lineBuffer[0];
}

/* C string output */
void
tell(const char* str)
{
	while(*str)
		putkey(*str++);
}

/* The basic (data) stack operations */

cell
pop(void)
{
	if(*sp == 1) {
		tell("? Stack underflow\n");
		errorFlag = 1;
		return 0;
	}
	return stack[--(*sp)];
}

cell
tos(void)
{
	if(*sp == 1) {
		tell("? Stack underflow\n");
		errorFlag = 1;
		return 0;
	}
	return stack[(*sp) - 1];
}

void
push(cell data)
{
	if(*sp >= STACK_SIZE) {
		tell("? Stack overflow\n");
		errorFlag = 1;
		return;
	}
	stack[(*sp)++] = data;
}

dcell
dpop(void)
{
	cell tmp[2];
	tmp[1] = pop();
	tmp[0] = pop();
	return *((dcell*)tmp);
}

void
dpush(dcell data)
{
	cell tmp[2];
	*((dcell*)tmp) = data;
	push(tmp[0]);
	push(tmp[1]);
}

/* The basic return stack operations */

cell
rpop(void)
{
	if(*rsp == 1) {
		tell("? RStack underflow\n");
		errorFlag = 1;
		return 0;
	}
	return rstack[--(*rsp)];
}

void
rpush(cell data)
{
	if(*rsp >= RSTACK_SIZE) {
		tell("? RStack overflow\n");
		errorFlag = 1;
		return;
	}
	rstack[(*rsp)++] = data;
}

/* Secure memory access */

cell
readMem(cell address)
{
	if(address > MEM_SIZE) {
		tell("Internal error in readMem: Invalid addres\n");
		errorFlag = 1;
		return 0;
	}
	return *((cell*)(memory + address));
}

void
writeMem(cell address, cell value)
{
	if(address > MEM_SIZE) {
		tell("Internal error in writeMem: Invalid address\n");
		errorFlag = 1;
		return;
	}
	*((cell*)(memory + address)) = value;
}

/* Reading a word into the input line buffer */
byte
readWord(void)
{
	char* line = (char*)memory;
	byte len = 0;
	int c;

	while((c = getkey()) != EOF) {
		if(c == ' ')
			continue;
		if(c == '\n')
			continue;
		if(c != '\\')
			break;

		while((c = getkey()) != EOF)
			if(c == '\n')
				break;
	}

	while(c != ' ' && c != '\n' && c != EOF) {
		if(len >= (INPUT_LINE_SIZE - 1))
			break;
		line[++len] = c;
		c = getkey();
	}
	line[0] = len;
	return len;
}

/* toupper() clone so we don't have to pull in ctype.h */
char
up(char c)
{
	return (c >= 'a' && c <= 'z') ? c - 'a' + 'A' : c;
}

/* Dictionary lookup */
cell
findWord(cell address, cell len)
{
	cell ret = *latest;
	char* name = (char*)&memory[address];
	cell i;
	int found;

	for(ret = *latest; ret; ret = readMem(ret)) {
		if((memory[ret + CELL_SIZE] & MASK_NAMELENGTH) != len)
			continue;
		if(memory[ret + CELL_SIZE] & FLAG_HIDDEN)
			continue;

		found = 1;
		for(i = 0; i < len; i++) {
			if(up(memory[ret + i + 1 + CELL_SIZE]) != up(name[i])) {
				found = 0;
				break;
			}
		}
		if(found)
			break;
	}
	return ret;
}

/* Basic number parsing, base <= 36 only atm */
void
parseNumber(byte* word, cell len, dcell* number, cell* notRead, byte* isDouble)
{
	int negative = 0;
	cell i;
	char c;
	cell current;

	*number = 0;
	*isDouble = 0;

	if(len == 0) {
		*notRead = 0;
		return;
	}

	if(word[0] == '-') {
		negative = 1;
		len--;
		word++;
	} else if(word[0] == '+') {
		len--;
		word++;
	}

	for(i = 0; i < len; i++) {
		c = *word;
		word++;
		if(c == '.') {
			*isDouble = 1;
			continue;
		} else if(c >= '0' && c <= '9')
			current = c - '0';
		else if(c >= 'A' && c <= 'Z')
			current = 10 + c - 'A';
		else if(c >= 'a' && c <= 'z')
			current = 10 + c - 'a';
		else
			break;

		if(current >= *base)
			break;

		*number = *number * *base + current;
	}

	*notRead = len - i;
	if(negative)
		*number = (-((scell)*number));
}

/*******************************************************************************
*
* Builtin definitions
*
*******************************************************************************/

BUILTIN(0, "RUNDOCOL", docol, 0)
{
	rpush(lastIp);
	next = commandAddress + CELL_SIZE;
}

/* The first few builtins are very simple, not need to waste vertical space here */
BUILTIN(1, "CELL", doCellSize, 0)
{
	push(CELL_SIZE);
}
BUILTIN(2, "@", memRead, 0)
{
	push(readMem(pop()));
}
BUILTIN(3, "C@", memReadByte, 0)
{
	push(memory[pop()]);
}
BUILTIN(4, "KEY", key, 0)
{
	push(getkey());
}
BUILTIN(5, "EMIT", emit, 0)
{
	putkey(pop() & 255);
}
BUILTIN(6, "DROP", drop, 0)
{
	pop();
}
BUILTIN(7, "EXIT", doExit, 0)
{
	next = rpop();
}
BUILTIN(8, "BYE", bye, 0)
{
	exitReq = 1;
}
BUILTIN(9, "LATEST", doLatest, 0)
{
	push(LATEST_POSITION);
}
BUILTIN(10, "HERE", doHere, 0)
{
	push(HERE_POSITION);
}
BUILTIN(11, "BASE", doBase, 0)
{
	push(BASE_POSITION);
}
BUILTIN(12, "STATE", doState, 0)
{
	push(STATE_POSITION);
}
BUILTIN(13, "[", gotoInterpreter, FLAG_IMMEDIATE)
{
	*state = 0;
}
BUILTIN(14, "]", gotoCompiler, 0)
{
	*state = 1;
}
BUILTIN(15, "HIDE", hide, 0)
{
	memory[*latest + CELL_SIZE] ^= FLAG_HIDDEN;
}
BUILTIN(16, "R>", rtos, 0)
{
	push(rpop());
}
BUILTIN(17, ">R", stor, 0)
{
	rpush(pop());
}
BUILTIN(18, "KEY?", key_p, 0)
{
	push(keyWaiting());
}
BUILTIN(19, "BRANCH", branch, 0)
{
	next += readMem(next);
}
BUILTIN(20, "0BRANCH", zbranch, 0)
{
	next += pop() ? CELL_SIZE : readMem(next);
}
BUILTIN(21, "IMMEDIATE", toggleImmediate, FLAG_IMMEDIATE)
{
	memory[*latest + CELL_SIZE] ^= FLAG_IMMEDIATE;
}
BUILTIN(22, "FREE", doFree, 0)
{
	push(MEM_SIZE - *here);
}
BUILTIN(23, "S0@", s0_r, 0)
{
	push(STACK_POSITION + CELL_SIZE);
}
BUILTIN(24, "DSP@", dsp_r, 0)
{
	push(STACK_POSITION + *sp * CELL_SIZE);
}
BUILTIN(25, "NOT", not, 0)
{
	push(~pop());
}
BUILTIN(26, "DUP", dup, 0)
{
	push(tos());
}

BUILTIN(27, "!", memWrite, 0)
{
	cell address = pop();
	cell value = pop();
	writeMem(address, value);
}

BUILTIN(28, "C!", memWriteByte, 0)
{
	cell address = pop();
	cell value = pop();
	memory[address] = value & 255;
}

BUILTIN(29, "SWAP", swap, 0)
{
	cell a = pop();
	cell b = pop();
	push(a);
	push(b);
}

BUILTIN(30, "OVER", over, 0)
{
	cell a = pop();
	cell b = tos();
	push(a);
	push(b);
}

BUILTIN(31, ",", comma, 0)
{
	push(*here);
	memWrite();
	*here += CELL_SIZE;
}

BUILTIN(32, "C,", commaByte, 0)
{
	push(*here);
	memWriteByte();
	*here += sizeof(byte);
}

BUILTIN(33, "WORD", word, 0)
{
	byte len = readWord();
	push(1);
	push(len);
}

BUILTIN(34, "FIND", find, 0)
{
	cell len = pop();
	cell address = pop();
	cell ret = findWord(address, len);
	push(ret);
}

cell
getCfa(cell address)
{
	byte len = (memory[address + CELL_SIZE] & MASK_NAMELENGTH) + 1;
	while((len & (CELL_SIZE - 1)) != 0)
		len++;
	return address + CELL_SIZE + len;
}

BUILTIN(35, ">CFA", cfa, 0)
{
	cell address = pop();
	cell ret = getCfa(address);
	if(ret < maxBuiltinAddress)
		push(readMem(ret));
	else
		push(ret);
}

BUILTIN(36, "NUMBER", number, 0)
{
	dcell num;
	cell notRead;
	byte isDouble;
	cell len = pop();
	byte* address = &memory[pop()];
	parseNumber(address, len, &num, &notRead, &isDouble);
	if(isDouble)
		dpush(num);
	else
		push((cell)num);
	push(notRead);
}

BUILTIN(37, "LIT", lit, 0)
{
	push(readMem(next));
	next += CELL_SIZE;
}

/* Outer and inner interpreter, TODO split up */
BUILTIN(38, "QUIT", quit, 0)
{
	cell address;
	dcell number;
	cell notRead;
	cell command;
	int i;
	byte isDouble;
	cell tmp[2];

	int immediate;

	for(exitReq = 0; exitReq == 0;) {
		lastIp = next = quit_address;
		errorFlag = 0;

		word();
		find();

		address = pop();
		if(address) {
			immediate = (memory[address + CELL_SIZE] & FLAG_IMMEDIATE);
			commandAddress = getCfa(address);
			command = readMem(commandAddress);
			if(*state && !immediate) {
				if(command < MAX_BUILTIN_ID && command != docol_id)
					push(command);
				else
					push(commandAddress);
				comma();
			} else {
				while(!errorFlag && !exitReq) {
					if(command == quit_id)
						break;
					else if(command < MAX_BUILTIN_ID)
						builtins[command]();
					else {
						lastIp = next;
						next = command;
					}

					commandAddress = next;
					command = readMem(commandAddress);
					next += CELL_SIZE;
				}
			}
		} else {
			parseNumber(&memory[1], memory[0], &number, &notRead, &isDouble);
			if(notRead) {
				tell("Unknown word: ");
				for(i = 0; i < memory[0]; i++)
					putkey(memory[i + 1]);
				putkey('\n');

				*sp = *rsp = 1;
				continue;
			} else {
				if(*state) {
					*((dcell*)tmp) = number;
					push(lit_id);
					comma();

					if(isDouble) {
						push(tmp[0]);
						comma();
						push(lit_id);
						comma();
						push(tmp[1]);
						comma();
					} else {
						push((cell)number);
						comma();
					}
				} else {
					if(isDouble)
						dpush(number);
					else
						push((cell)number);
				}
			}
		}

		if(errorFlag)
			*sp = *rsp = 1;
		else if(!keyWaiting() && !(*initscript_pos))
			tell(" OK\n");
	}
}

BUILTIN(39, "+", plus, 0)
{
	scell n1 = pop();
	scell n2 = pop();
	push(n1 + n2);
}

BUILTIN(40, "-", minus, 0)
{
	scell n1 = pop();
	scell n2 = pop();
	push(n2 - n1);
}

BUILTIN(41, "*", mul, 0)
{
	scell n1 = pop();
	scell n2 = pop();
	push(n1 * n2);
}

BUILTIN(42, "/MOD", divmod, 0)
{
	scell n1 = pop();
	scell n2 = pop();
	push(n2 % n1);
	push(n2 / n1);
}

BUILTIN(43, "ROT", rot, 0)
{
	cell a = pop();
	cell b = pop();
	cell c = pop();
	push(b);
	push(a);
	push(c);
}

void createWord(const char* name, byte len, byte flags);
BUILTIN(44, "CREATE", doCreate, 0)
{
	byte len;
	cell address;
	word();
	len = pop() & 255;
	address = pop();
	createWord((char*)&memory[address], len, 0);
}

BUILTIN(45, ":", colon, 0)
{
	doCreate();
	push(docol_id);
	comma();
	hide();
	*state = 1;
}

BUILTIN(46, ";", semicolon, FLAG_IMMEDIATE)
{
	push(doExit_id);
	comma();
	hide();
	*state = 0;
}

BUILTIN(47, "R@", rget, 0)
{
	cell tmp = rpop();
	rpush(tmp);
	push(tmp);
}

BUILTIN(48, "J", doJ, 0)
{
	cell tmp1 = rpop();
	cell tmp2 = rpop();
	cell tmp3 = rpop();
	rpush(tmp3);
	rpush(tmp2);
	rpush(tmp1);
	push(tmp3);
}

BUILTIN(49, "'", tick, FLAG_IMMEDIATE)
{
	word();
	find();
	cfa();

	if(*state) {
		push(lit_id);
		comma();
		comma();
	}
}

BUILTIN(50, "=", equals, 0)
{
	cell a1 = pop();
	cell a2 = pop();
	push(a2 == a1 ? -1 : 0);
}

BUILTIN(51, "<", smaller, 0)
{
	scell a1 = pop();
	scell a2 = pop();
	push(a2 < a1 ? -1 : 0);
}

BUILTIN(52, ">", larger, 0)
{
	scell a1 = pop();
	scell a2 = pop();
	push(a2 > a1 ? -1 : 0);
}

BUILTIN(53, "AND", doAnd, 0)
{
	cell a1 = pop();
	cell a2 = pop();
	push(a2 & a1);
}

BUILTIN(54, "OR", doOr, 0)
{
	cell a1 = pop();
	cell a2 = pop();
	push(a2 | a1);
}

BUILTIN(55, "?DUP", p_dup, 0)
{
	cell a = tos();
	if(a)
		push(a);
}

BUILTIN(56, "LITSTRING", litstring, 0)
{
	cell length = readMem(next);
	next += CELL_SIZE;
	push(next);
	push(length);
	next += length;
	while(next & (CELL_SIZE - 1))
		next++;
}

BUILTIN(57, "XOR", xor, 0)
{
	cell a = pop();
	cell b = pop();
	push(a ^ b);
}

BUILTIN(58, "*/", timesDivide, 0)
{
	cell n3 = pop();
	dcell n2 = pop();
	dcell n1 = pop();
	dcell r = (n1 * n2) / n3;
	push((cell)r);
	if((cell)r != r) {
		tell("Arithmetic overflow\n");
		errorFlag = 1;
	}
}

BUILTIN(59, "*/MOD", timesDivideMod, 0)
{
	cell n3 = pop();
	dcell n2 = pop();
	dcell n1 = pop();
	dcell r = (n1 * n2) / n3;
	dcell m = (n1 * n2) % n3;
	push((cell)m);
	push((cell)r);
	if((cell)r != r) {
		tell("Arithmetic overflow\n");
		errorFlag = 1;
	}
}

BUILTIN(60, "D=", dequals, 0)
{
	dcell a1 = dpop();
	dcell a2 = dpop();
	push(a2 == a1 ? -1 : 0);
}

BUILTIN(61, "D<", dsmaller, 0)
{
	dscell a1 = dpop();
	dscell a2 = dpop();
	push(a2 < a1 ? -1 : 0);
}

BUILTIN(62, "D>", dlarger, 0)
{
	dscell a1 = dpop();
	dscell a2 = dpop();
	push(a2 > a1 ? -1 : 0);
}

BUILTIN(63, "DU<", dusmaller, 0)
{
	dcell a1 = dpop();
	dcell a2 = dpop();
	push(a2 < a1 ? -1 : 0);
}

BUILTIN(64, "D+", dplus, 0)
{
	dscell n1 = dpop();
	dscell n2 = dpop();
	dpush(n1 + n2);
}

BUILTIN(65, "D-", dminus, 0)
{
	dscell n1 = dpop();
	dscell n2 = dpop();
	dpush(n2 - n1);
}

BUILTIN(66, "D*", dmul, 0)
{
	dscell n1 = dpop();
	dscell n2 = dpop();
	dpush(n1 * n2);
}

BUILTIN(67, "D/", ddiv, 0)
{
	dscell n1 = dpop();
	dscell n2 = dpop();
	dpush(n2 / n1);
}

BUILTIN(68, "2SWAP", dswap, 0)
{
	dcell a = dpop();
	dcell b = dpop();
	dpush(a);
	dpush(b);
}

BUILTIN(69, "2OVER", dover, 0)
{
	dcell a = dpop();
	dcell b = dpop();
	dpush(b);
	dpush(a);
	dpush(b);
}

BUILTIN(70, "2ROT", drot, 0)
{
	dcell a = dpop();
	dcell b = dpop();
	dcell c = dpop();
	dpush(b);
	dpush(a);
	dpush(c);
}

/*******************************************************************************
*
* Loose ends
*
*******************************************************************************/

/* Create a word in the dictionary */
void
createWord(const char* name, byte len, byte flags)
{
	cell newLatest = *here;
	push(*latest);
	comma();
	push(len | flags);
	commaByte();
	while(len--) {
		push(*name);
		commaByte();
		name++;
	}
	while(*here & (CELL_SIZE - 1)) {
		push(0);
		commaByte();
	}
	*latest = newLatest;
}

/* A simple strlen clone so we don't have to pull in string.h */
byte
slen(const char* str)
{
	byte ret = 0;
	while(*str++)
		ret++;
	return ret;
}

/* Add a builtin to the dictionary */
void
addBuiltin(cell code, const char* name, const byte flags, builtin f)
{
	if(errorFlag)
		return;

	if(code >= MAX_BUILTIN_ID) {
		tell("Error adding builtin ");
		tell(name);
		tell(": Out of builtin IDs\n");
		errorFlag = 1;
		return;
	}

	if(builtins[code] != 0) {
		tell("Error adding builtin ");
		tell(name);
		tell(": ID given twice\n");
		errorFlag = 1;
		return;
	}

	builtins[code] = f;
	createWord(name, slen(name), flags);
	push(code);
	comma();
	push(doExit_id);
	comma();
}

/* Program setup and jump to outer interpreter */
int
main()
{
	errorFlag = 0;

	if(DCELL_SIZE != 2 * CELL_SIZE) {
		tell("Configuration error: DCELL_SIZE != 2*CELL_SIZE\n");
		return 1;
	}

	state = (cell*)&memory[STATE_POSITION];
	base = (cell*)&memory[BASE_POSITION];
	latest = (cell*)&memory[LATEST_POSITION];
	here = (cell*)&memory[HERE_POSITION];
	sp = (cell*)&memory[STACK_POSITION];
	stack = (cell*)&memory[STACK_POSITION + CELL_SIZE];
	rsp = (cell*)&memory[RSTACK_POSITION];
	rstack = (cell*)&memory[RSTACK_POSITION + CELL_SIZE];

	*sp = *rsp = 1;
	*state = 0;
	*base = 10;
	*latest = 0;
	*here = HERE_START;

	ADD_BUILTIN(docol);
	ADD_BUILTIN(doCellSize);
	ADD_BUILTIN(memRead);
	ADD_BUILTIN(memWrite);
	ADD_BUILTIN(memReadByte);
	ADD_BUILTIN(memWriteByte);
	ADD_BUILTIN(key);
	ADD_BUILTIN(emit);
	ADD_BUILTIN(swap);
	ADD_BUILTIN(dup);
	ADD_BUILTIN(drop);
	ADD_BUILTIN(over);
	ADD_BUILTIN(comma);
	ADD_BUILTIN(commaByte);
	ADD_BUILTIN(word);
	ADD_BUILTIN(find);
	ADD_BUILTIN(cfa);
	ADD_BUILTIN(doExit);
	ADD_BUILTIN(quit);
	quit_address = getCfa(*latest);
	ADD_BUILTIN(number);
	ADD_BUILTIN(bye);
	ADD_BUILTIN(doLatest);
	ADD_BUILTIN(doHere);
	ADD_BUILTIN(doBase);
	ADD_BUILTIN(doState);
	ADD_BUILTIN(plus);
	ADD_BUILTIN(minus);
	ADD_BUILTIN(mul);
	ADD_BUILTIN(divmod);
	ADD_BUILTIN(rot);
	ADD_BUILTIN(gotoInterpreter);
	ADD_BUILTIN(gotoCompiler);
	ADD_BUILTIN(doCreate);
	ADD_BUILTIN(hide);
	ADD_BUILTIN(lit);
	ADD_BUILTIN(colon);
	ADD_BUILTIN(semicolon);
	ADD_BUILTIN(rtos);
	ADD_BUILTIN(stor);
	ADD_BUILTIN(rget);
	ADD_BUILTIN(doJ);
	ADD_BUILTIN(tick);
	ADD_BUILTIN(key_p);
	ADD_BUILTIN(equals);
	ADD_BUILTIN(smaller);
	ADD_BUILTIN(larger);
	ADD_BUILTIN(doAnd);
	ADD_BUILTIN(doOr);
	ADD_BUILTIN(branch);
	ADD_BUILTIN(zbranch);
	ADD_BUILTIN(toggleImmediate);
	ADD_BUILTIN(doFree);
	ADD_BUILTIN(p_dup);
	ADD_BUILTIN(s0_r);
	ADD_BUILTIN(dsp_r);
	ADD_BUILTIN(litstring);
	ADD_BUILTIN(not );
	ADD_BUILTIN(xor);
	ADD_BUILTIN(timesDivide);
	ADD_BUILTIN(timesDivideMod);
	ADD_BUILTIN(dequals);
	ADD_BUILTIN(dsmaller);
	ADD_BUILTIN(dlarger);
	ADD_BUILTIN(dusmaller);
	ADD_BUILTIN(dplus);
	ADD_BUILTIN(dminus);
	ADD_BUILTIN(dmul);
	ADD_BUILTIN(ddiv);
	ADD_BUILTIN(dswap);
	ADD_BUILTIN(dover);
	ADD_BUILTIN(drot);

	maxBuiltinAddress = (*here) - 1;

	if(errorFlag)
		return 1;

	initscript_pos = (char*)initScript;
	quit();
	return 0;
}