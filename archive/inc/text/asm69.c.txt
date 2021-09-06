#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stddef.h>
#include <ctype.h>
#include <stdarg.h>

/* pcc asm6.c -+ -o asm6 */

#define VERSION "1.6"

#define addr firstlabel.value//'$' value
#define NOORIGIN -0x40000000//nice even number so aligning works before origin is defined
#define INITLISTSIZE 128//initial label list size
#define BUFFSIZE 8192//file buffer (inputbuff, outputbuff) size
#define WORDMAX 128     //used with getword()
#define LINEMAX 2048//plenty of room for nested equates
#define MAXPASSES 7//# of tries before giving up
#define IFNESTS 32//max nested IF levels
#define DEFAULTFILLER 0 //default fill value
#define LOCALCHAR '@'

static void* true_ptr = &true_ptr;

enum labeltypes {LABEL,VALUE,EQUATE,MACRO,RESERVED};
//LABEL: known address
//VALUE: defined with '='
//EQUATE: made with EQU
//MACRO: macro (duh)
//RESERVED: reserved word
typedef struct {
    const char *name;       //label name
    // ptrdiff_t so it can hold function pointer on 64-bit machines
    ptrdiff_t value;        //PC (label), value (equate), param count (macro), funcptr (reserved)
    char *line;             //for macro or equate, also used to mark unknown label
    int type;               //labeltypes enum (see above)
    int used;               //for EQU and MACRO recursion check
    int pass;               //when label was last defined
    int scope;              //where visible (0=global, nonzero=local)
    void *link;             //labels that share the same name (local labels) are chained together
} label;

label firstlabel={          //'$' label
    "$",
    0,//value
    (char*)&true_ptr,
    VALUE,//type
    0,//used
    0,//pass
    0,//scope
    0,//link
};

typedef unsigned char byte;
typedef void (*icfn)(label*,char**);

label *findlabel(char*);
void initlabels();
label *newlabel(void);
void getword(char*,char**,int);
int getvalue(char**);
int getoperator(char**);
int eval(char**,int);
label *getreserved(char**);
int getlabel(char*,char**);
void processline(char*,char*,int);
void listline(char*,char*);
void endlist();
void opcode(label*,char**);
void org(label*,char**);
void base(label*,char**);
void pad(label*,char**);
void equ(label*,char**);
void equal(label*,char**);
void nothing(label*,char**);
void include(label*,char**);
void incbin(label*,char**);
void dw(label*,char**);
void db(label*,char**);
void dl(label*,char**);
void dh(label*,char**);
void hex(label*,char**);
void dsw(label*,char**);
void dsb(label*,char**);
void align(label*,char**);
void _if(label*,char**);
void ifdef(label*,char**);
void ifndef(label*,char**);
void elseif(label*,char**);
void _else(label*,char**);
void endif(label*,char**);
void macro(label*,char**);
void endm(label*,char**);
void endr(label*,char**);
void rept(label*,char**);
void _enum(label*,char**);
void ende(label*,char**);
void fillval(label*,char**);
void expandmacro(label*,char**,int,char*);
void expandrept(int,char*);
void make_error(label*,char**);

enum optypes {ACC,IMM,IND,INDX,INDY,ZPX,ZPY,ABSX,ABSY,ZP,ABS,REL,IMP};
int opsize[]={0,1,2,1,1,1,1,2,2,1,2,1,0};
char ophead[]={0,'#','(','(','(',0,0,0,0,0,0,0,0};
char *optail[]={"A","",")",",X)","),Y",",X",",Y",",X",",Y","","","",""};
byte brk2[]={0x00,IMM,0x00,ZP,0x00,IMP,-1};
byte ora[]={0x09,IMM,0x01,INDX,0x11,INDY,0x15,ZPX,0x1d,ABSX,0x19,ABSY,0x05,ZP,0x0d,ABS,-1};
byte asl[]={0x0a,ACC,0x16,ZPX,0x1e,ABSX,0x06,ZP,0x0e,ABS,0x0a,IMP,-1};
byte php[]={0x08,IMP,-1};
byte bpl[]={0x10,REL,-1};
byte clc[]={0x18,IMP,-1};
byte jsr[]={0x20,ABS,-1};
byte and[]={0x29,IMM,0x21,INDX,0x31,INDY,0x35,ZPX,0x3d,ABSX,0x39,ABSY,0x25,ZP,0x2d,ABS,-1};
byte bit[]={0x24,ZP,0x2c,ABS,-1};
byte rol[]={0x2a,ACC,0x36,ZPX,0x3e,ABSX,0x26,ZP,0x2e,ABS,0x2a,IMP,-1};
byte plp[]={0x28,IMP,-1};
byte bmi[]={0x30,REL,-1};
byte sec[]={0x38,IMP,-1};
byte rti[]={0x40,IMP,-1};
byte eor[]={0x49,IMM,0x41,INDX,0x51,INDY,0x55,ZPX,0x5d,ABSX,0x59,ABSY,0x45,ZP,0x4d,ABS,-1};
byte lsr[]={0x4a,ACC,0x56,ZPX,0x5e,ABSX,0x46,ZP,0x4e,ABS,0x4a,IMP,-1};
byte pha[]={0x48,IMP,-1};
byte jmp[]={0x6c,IND,0x4c,ABS,-1};
byte bvc[]={0x50,REL,-1};
byte cli[]={0x58,IMP,-1};
byte rts[]={0x60,IMP,-1};
byte adc[]={0x69,IMM,0x61,INDX,0x71,INDY,0x75,ZPX,0x7d,ABSX,0x79,ABSY,0x65,ZP,0x6d,ABS,-1};
byte ror[]={0x6a,ACC,0x76,ZPX,0x7e,ABSX,0x66,ZP,0x6e,ABS,0x6a,IMP,-1};
byte pla[]={0x68,IMP,-1};
byte bvs[]={0x70,REL,-1};
byte sei[]={0x78,IMP,-1};
byte sta[]={0x81,INDX,0x91,INDY,0x95,ZPX,0x9d,ABSX,0x99,ABSY,0x85,ZP,0x8d,ABS,-1};
byte sty[]={0x94,ZPX,0x84,ZP,0x8c,ABS,-1};
byte stx[]={0x96,ZPY,0x86,ZP,0x8e,ABS,-1};
byte dey[]={0x88,IMP,-1};
byte txa[]={0x8a,IMP,-1};
byte bcc[]={0x90,REL,-1};
byte tya[]={0x98,IMP,-1};
byte txs[]={0x9a,IMP,-1};
byte ldy[]={0xa0,IMM,0xb4,ZPX,0xbc,ABSX,0xa4,ZP,0xac,ABS,-1};
byte lda[]={0xa9,IMM,0xa1,INDX,0xb1,INDY,0xb5,ZPX,0xbd,ABSX,0xb9,ABSY,0xa5,ZP,0xad,ABS,-1};
byte ldx[]={0xa2,IMM,0xb6,ZPY,0xbe,ABSY,0xa6,ZP,0xae,ABS,-1};
byte tay[]={0xa8,IMP,-1};
byte tax[]={0xaa,IMP,-1};
byte bcs[]={0xb0,REL,-1};
byte clv[]={0xb8,IMP,-1};
byte tsx[]={0xba,IMP,-1};
byte cpy[]={0xc0,IMM,0xc4,ZP,0xcc,ABS,-1};
byte cmp[]={0xc9,IMM,0xc1,INDX,0xd1,INDY,0xd5,ZPX,0xdd,ABSX,0xd9,ABSY,0xc5,ZP,0xcd,ABS,-1};
byte dec[]={0xd6,ZPX,0xde,ABSX,0xc6,ZP,0xce,ABS,-1};
byte iny[]={0xc8,IMP,-1};
byte dex[]={0xca,IMP,-1};
byte bne[]={0xd0,REL,-1};
byte cld[]={0xd8,IMP,-1};
byte cpx[]={0xe0,IMM,0xe4,ZP,0xec,ABS,-1};
byte sbc[]={0xe9,IMM,0xe1,INDX,0xf1,INDY,0xf5,ZPX,0xfd,ABSX,0xf9,ABSY,0xe5,ZP,0xed,ABS,-1};
byte inc[]={0xf6,ZPX,0xfe,ABSX,0xe6,ZP,0xee,ABS,-1};
byte inx[]={0xe8,IMP,-1};
byte nop[]={0xea,IMP,-1};
byte beq[]={0xf0,REL,-1};
byte sed[]={0xf8,IMP,-1};
 
void *rsvdlist[]={       //all reserved words
        "BRK",brk2,
        "PHP",php,
        "BPL",bpl,
        "CLC",clc,
        "JSR",jsr,
        "PLP",plp,
        "BMI",bmi,
        "SEC",sec,
        "RTI",rti,
        "PHA",pha,
        "BVC",bvc,
        "CLI",cli,
        "RTS",rts,
        "PLA",pla,
        "BVS",bvs,
        "SEI",sei,
        "DEY",dey,
        "BCC",bcc,
        "TYA",tya,
        "LDY",ldy,
        "TAY",tay,
        "BCS",bcs,
        "CLV",clv,
        "CPY",cpy,
        "INY",iny,
        "BNE",bne,
        "CLD",cld,
        "CPX",cpx,
        "INX",inx,
        "BEQ",beq,
        "SED",sed,
        "ORA",ora,
        "AND",and,
        "EOR",eor,
        "ADC",adc,
        "STA",sta,
        "LDA",lda,
        "CMP",cmp,
        "SBC",sbc,
        "ASL",asl,
        "ROL",rol,
        "LSR",lsr,
        "ROR",ror,
        "TXA",txa,
        "TXS",txs,
        "LDX",ldx,
        "TAX",tax,
        "TSX",tsx,
        "DEX",dex,
        "NOP",nop,
        "BIT",bit,
        "JMP",jmp,
        "STY",sty,
        "STX",stx,
        "DEC",dec,
        "INC",inc,
        0, 0
};

struct {
    char* name;
    void (*func)( label*, char** );
} directives[]={
        "",nothing,
        "IF",_if,
        "ELSEIF",elseif,
        "ELSE",_else,
        "ENDIF",endif,
        "IFDEF",ifdef,
        "IFNDEF",ifndef,
        "=",equal,
        "EQU",equ,
        "ORG",org,
        "BASE",base,
        "PAD",pad,
        "INCLUDE",include,"INCSRC",include,
        "INCBIN",incbin,"BIN",incbin,
        "HEX",hex,
        "WORD",dw,"DW",dw,"DCW",dw,"DC.W",dw,
        "BYTE",db,"DB",db,"DCB",db,"DC.B",db,
        "DSW",dsw,"DS.W",dsw,
        "DSB",dsb,"DS.B",dsb,
        "ALIGN",align,
        "MACRO",macro,
        "REPT",rept,
        "ENDM",endm,
        "ENDR",endr,
        "ENUM",_enum,
        "ENDE",ende,
        "FILLVALUE",fillval,
        "DL",dl,
        "DH",dh,
        "ERROR",make_error,
        0, 0
};

char OutOfRange[]="Value out of range.";
char SeekOutOfRange[]="Seek position out of range.";
char BadIncbinSize[]="INCBIN size is out of range.";
char NotANumber[]="Not a number.";
char UnknownLabel[]="Unknown label.";
char Illegal[]="Illegal instruction.";
char IncompleteExp[]="Incomplete expression.";
char LabelDefined[]="Label already defined.";
char MissingOperand[]="Missing operand.";
char DivZero[]="Divide by zero.";
char BadAddr[]="Can't determine address.";
char NeedName[]="Need a name.";
char CantOpen[]="Can't open file.";
char ExtraENDM[]="ENDM without MACRO.";
char ExtraENDR[]="ENDR without REPT.";
char ExtraENDE[]="ENDE without ENUM.";
char RecurseMACRO[]="Recursive MACRO not allowed.";
char RecurseEQU[]="Recursive EQU not allowed.";
char NoENDIF[]="Missing ENDIF.";
char NoENDM[]="Missing ENDM.";
char NoENDR[]="Missing ENDR.";
char NoENDE[]="Missing ENDE.";
char IfNestLimit[]="Too many nested IFs.";
char undefinedPC[]="PC is undefined (use ORG first)";

char whitesp[]=" \t\r\n:";  //treat ":" like whitespace (for labels)
char whitesp2[]=" \t\r\n\"";    //(used for filename processing)
char tmpstr[LINEMAX];   //all purpose big string

int pass=0;
int scope;//current scope, 0=global
int nextscope;//next nonglobal scope (increment on each new block of localized code)
int lastchance=0;//set on final attempt
int needanotherpass;//still need to take care of some things..
int error=0;//hard error (stop assembly after this pass)
char **makemacro=0;//(during macro creation) where next macro line will go.  1 to skip past macro
char **makerept;//like makemacro.. points to end of string chain
int reptcount=0;//counts rept statements during rept string storage
int iflevel=0;//index into ifdone[],skipline[]
int ifdone[IFNESTS];//nonzero if current IF level has been true
int skipline[IFNESTS];//1 on an IF statement that is false
const char *errmsg;
char *inputfilename=0;
char *outputfilename=0;
char *listfilename=0;
int verboselisting=0;//expand REPT loops in listing
const char *listerr=0;//error message for list file
label *labelhere;//points to the label being defined on the current line (for EQU, =, etc)
FILE *listfile=0;
FILE *outputfile=0;
byte outputbuff[BUFFSIZE];
byte inputbuff[BUFFSIZE];
int outcount;//bytes waiting in outputbuff
label **labellist;  //array of label pointers (list starts from center and grows outward)
int labels;//# of labels in labellist
int maxlabels;//max # of labels labellist can hold
int labelstart;//index of first label
int labelend;//index of last label
label *lastlabel;//last label created
int nooutput=0;//supress output (use with ENUM)
int defaultfiller;//default fill value
int insidemacro=0;//macro/rept is being expanded
int verbose=1;

static void* ptr_from_bool( int b )
{
    if ( b )
        return true_ptr;
    
    return NULL;
}

// Prints printf-style message to stderr, then exits.
// Closes and deletes output file.
static void fatal_error( const char fmt [], ... )
{
    va_list args;
    
    if ( outputfile != NULL ) {
        fclose( outputfile );
        remove( outputfilename );
    }
    
    va_start( args, fmt );
    fprintf( stderr, "\nError: " );
    vfprintf( stderr, fmt, args );
    fprintf( stderr, "\n\n" );
    va_end( args );
    
    exit( EXIT_FAILURE );
}

// Prints printf-style message if verbose mode is enabled.
static void message( const char fmt [], ... )
{
    if ( verbose ) {
        va_list args;
        va_start( args, fmt );
        vprintf( fmt, args );
        va_end( args );
    }
}

// Same as malloc(), but prints error and exits if allocation fails
static char* my_malloc( size_t s )
{
    char* p = malloc( s ? s : 1 );
    if ( p == NULL )
        fatal_error( "out of memory" );
    
    return p;
}

// Same as common strdup(), but prints error and exits if allocation fails
static char* my_strdup(const char *in)
{
    size_t size = strlen( in ) + 1;
    char* out = my_malloc( size );
        memcpy( out, in, size );
    return out;
}

//-------------------------------------------------------
//parsing functions
//-------------------------------------------------------

// ours in all cases.
char *my_strupr(char *string)
{
    char *s;
    
    if (string == NULL) {
        return (char *)NULL;
    }


    for (s = string; *s; ++s) {
        *s = toupper((unsigned char) *s);
    }

    return string;
}

int hexify(int i) {
    if(i>='0' && i<='9') {
        return i-'0';
    } else if(i>='a' && i<='f') {
        return i-('a'-10);
    } else if(i>='A' && i<='F') {
        return i-('A'-10);
    } else {
        errmsg=NotANumber;
        return 0;
    }
}

#define eatwhitespace(str) (*str+=strspn(*str,whitesp))

//find end of str, excluding any chars in whitespace
char *strend(char *str, char *whitespace) {
    char c;
    char *w=whitespace;
    char *end=str+strlen(str);
    while(*w && end!=str) {
        for(w=whitespace, c=end[-1]; *w; w++) {
            if(*w==c) {
                end--;
                break;
            }
        }
    }
    return end;
}

//decode str into a number
//set errmsg on error
char gvline[WORDMAX];
int dependant;//set to nonzero if symbol couldn't be resolved
int getvalue(char **str) {
    char *s,*end;
    int ret,chars,j;
    label *p;

    getword(gvline,str,1);

    s=gvline;
    if(!*s) {
        errmsg=MissingOperand;
        return 0;
    }
    
    ret=chars=0;
    if(*s=='$') {   //hex---------------------
        s++;
        if(!*s) {
            ret=addr;//$ by itself is the PC            
        } else do {
hexi:       j=hexify(*s);
            s++;
            chars++;
            ret=(ret<<4)|j;
        } while(*s);
        if(chars>8)
            errmsg=OutOfRange;
    } else if(*s=='%') {    //binary----------------------
        s++;
    do {
bin:        j=*s;
            s++;
            chars++;
            j-='0';
            if(j>1) {
                errmsg=NotANumber;
            }
            ret=(ret<<1)|j;
        } while(*s);
        if(chars>32)
            errmsg=OutOfRange;
    } else if(*s=='\'') {   //char-----------------
        s++;
        if(*s=='\\') s++;
        ret=*s;
        s++;
        if(*s!='\'')
            errmsg=NotANumber;
    } else if(*s=='"') {    //char 2-----------------
        s++;
        if(*s=='\\') s++;
        ret=*s;
        s++;
        if(*s!='"')
            errmsg=NotANumber;
    } else if(*s>='0' && *s<='9') {//number--------------
        end=s+strlen(s)-1;
        if(strspn(s,"0123456789")==strlen(s))
            ret=atoi(s);
        else if(*end=='b' || *end=='B') {
            *end=0;
            goto bin;
        } else if(*end=='h' || *end=='H') {
            *end=0;
            goto hexi;
        } else
            errmsg=NotANumber;
    } else {    //label---------------
        p=findlabel(gvline);
        if(!p) {//label doesn't exist (yet?)
            needanotherpass=dependant=1;
            if(lastchance) {//only show error once we're certain label will never exist
                errmsg=UnknownLabel;
            }
        } else {
            dependant|=!(*p).line;
            needanotherpass|=!(*p).line;
            if((*p).type==LABEL || (*p).type==VALUE) {
                ret=(*p).value;
            } else if((*p).type==MACRO) {
                errmsg="Can't use macro in expression.";
            } else {//what else is there?
                errmsg=UnknownLabel;
            }
        }
    }
    return ret;
}

char mathy[]="!^&|+-*/%()<>=,";
enum prectypes {WHOLEEXP,ORORP,ANDANDP,ORP,XORP,ANDP,EQCOMPARE,COMPARE,SHIFT,PLUSMINUS,MULDIV,UNARY};//precedence levels
enum operators {NOOP,EQUAL,NOTEQUAL,GREATER,GREATEREQ,LESS,LESSEQ,PLUS,MINUS,MUL,DIV,MOD,AND,XOR,OR,ANDAND,OROR,LEFTSHIFT,RIGHTSHIFT};//all operators
char prec[]={WHOLEEXP,EQCOMPARE,EQCOMPARE,COMPARE,COMPARE,COMPARE,COMPARE,PLUSMINUS,PLUSMINUS,MULDIV,MULDIV,MULDIV,ANDP,XORP,ORP,ANDANDP,ORORP,SHIFT,SHIFT};//precedence of each operator
//get operator from str and advance str
int getoperator(char **str) {
    *str+=strspn(*str,whitesp);     //eatwhitespace
    (*str)++;
    switch(*(*str-1)) {
        case '&':
            if(**str=='&') {
                (*str)++;
                return ANDAND;
            } else
                return AND;
        case '|':
            if(**str=='|') {
                (*str)++;
                return OROR;
            } else
                return OR;
        case '^':
            return XOR;
        case '+':
            return PLUS;
        case '-':
            return MINUS;
        case '*':
            return MUL;
        case '%':
            return MOD;
        case '/':
            return DIV;
        case '=':
            if(**str=='=')
                (*str)++;
            return EQUAL;
        case '>':
            if(**str=='=') {
                (*str)++;
                return GREATEREQ;
            } else if(**str=='>') {
                (*str)++;
                return RIGHTSHIFT;
            } else
                return GREATER;
        case '<':
            if(**str=='=') {
                (*str)++;
                return LESSEQ;
            } else if(**str=='>') {
                (*str)++;
                return NOTEQUAL;
            } else if(**str=='<') {
                (*str)++;
                return LEFTSHIFT;
            } else
                return LESS;
        case '!':
            if(**str=='=') {
                (*str)++;
                return NOTEQUAL;
            }
            //(to default)
        default:
            (*str)--;
            return NOOP;
    }
}

//evaluate expression in str and advance str
int eval(char **str,int precedence) {
    char unary;
    char *s,*s2;
    int ret,val2;
    int op;
    
    s=*str+strspn(*str,whitesp);        //eatwhitespace
    unary=*s;
    switch(unary) {
        case '(':
            s++;
            ret=eval(&s,WHOLEEXP);
            s+=strspn(s,whitesp);       //eatwhitespace
            if(*s==')')
                s++;
            else
                errmsg=IncompleteExp;
            break;
        case '#':
            s++;
            ret=eval(&s,WHOLEEXP);
            break;
        case '~':
            s++;
            ret=~eval(&s,UNARY);
            break;
        case '!':
            s++;
            ret=!eval(&s,UNARY);
            break;
        case '<':
            s++;
            ret=eval(&s,UNARY)&0xff;
            break;
        case '>':
            s++;
            ret=(eval(&s,UNARY)>>8)&0xff;
            break;
        case '+':
        case '-':
            //careful.. might be +-label
            s2=s;
            s++;
            op=dependant;//eval() is reentrant so don't mess up dependant
            val2=needanotherpass;
            dependant=0;
            ret=getvalue(&s2);
            if (errmsg == UnknownLabel)
                errmsg=0;
            if(!dependant || s2==s) {//found something or single + -
                s=s2;
                s2=0;//flag that we got something
                dependant|=op;
            } else {//not a label after all..
                dependant=op;
                needanotherpass=val2;
            }
            if(s2) {//if it wasn't a +-label
                ret=eval(&s,UNARY);
                if(unary=='-') ret=-ret;
            }
            break;
        default:
            ret=getvalue(&s);
    }
    do {
        *str=s;
        op=getoperator(&s);
        if(precedence<prec[op]) {
            val2=eval(&s,prec[op]);
            if(!dependant) switch(op) {
                case AND:
                    ret&=val2;
                    break;
                case ANDAND:
                    ret=ret&&val2;
                    break;
                case OR:
                    ret|=val2;
                    break;
                case OROR:
                    ret=ret||val2;
                    break;
                case XOR:
                    ret^=val2;
                    break;
                case PLUS:
                    ret+=val2;
                    break;
                case MINUS:
                    ret-=val2;
                    break;
                case MUL:
                    ret*=val2;
                    break;
                case DIV:
                    if(!val2) errmsg=DivZero;
                    else ret/=val2;
                    break;
                case MOD:
                    if(!val2) errmsg=DivZero;
                    else ret%=val2;
                    break;
                case EQUAL:
                    ret=(ret==val2);
                    break;
                case NOTEQUAL:
                    ret=(ret!=val2);
                    break;
                case GREATER:
                    ret=ret>val2;
                    break;
                case GREATEREQ:
                    ret=ret>=val2;
                    break;
                case LESS:
                    ret=ret<val2;
                    break;
                case LESSEQ:
                    ret=ret<=val2;
                    break;
                case LEFTSHIFT:
                    ret<<=val2;
                    break;
                case RIGHTSHIFT:
                    ret>>=val2;
                    break;
            } else ret=0;
        }
    } while(precedence<prec[op] && !errmsg);
    return ret;
}

//copy next word from src into dst and advance src
//mcheck=1 to crop mathy stuff (0 for filenames,etc)
void getword(char *dst,char **src,int mcheck) {
    *src+=strspn(*src,whitesp);//eatwhitespace
    strncpy(dst,*src,WORDMAX-1);
    dst[WORDMAX-1]=0;
    strtok(dst,whitesp);//no trailing whitespace
    if(mcheck) strtok(dst,mathy);
    *src+=strlen(dst);
    if(**src==':') (*src)++;//cheesy fix for rept/macro listing
}

//grab string with optional quotes
void getfilename(char *dst, char **next) {
    char *s,*end;
    int len;
    eatwhitespace(next);
    if(**next=='"') { //look for end quote, grab everything inside
        s=*next+1;
        end=strchr(s,'"');
        if(end) {
            len=(int)(end-s);
            memcpy(dst,s,len); dst[len]=0;
            *next=end+1;
        } else { //no end quote.. grab everything minus trailing whitespace
            end=strend(s,whitesp);
            len=(int)(end-s);
            memcpy(dst,s,len); dst[len]=0;
            *next=end;
        }
    } else {
        getword(dst,next,0);
    }
}

//get word in src, advance src, and return reserved label*
label *getreserved(char **src) {
    char dst[WORDMAX];
    char upp[WORDMAX];
    label *p;
    
    *src+=strspn(*src,whitesp);//eatwhitespace
    if(**src=='=') {//special '=' reserved word
        upp[0]='=';
        upp[1]=0;
        (*src)++;
    } else {
        if(**src=='.')//reserved words can start with "."
            (*src)++;
        getword(dst,src,1);
        strcpy(upp,dst);
        my_strupr(upp);
    }

    p=findlabel(upp);//case insensitive reserved word
    if(!p) p=findlabel(dst);//or case sensitive macro
    if(p) {
        if((*p).type==MACRO) {
            if((*p).pass!=pass)
                p=0;
        } else if((*p).type!=RESERVED)
            p=0;
    }
    if(!p) errmsg=Illegal;
    return p;
}

//copy word to dst, advance src
//return true if it looks like a label
int getlabel(char *dst,char **src) {
    char *s;
    char c;
    
    getword(dst,src,1);
    if(*dst=='$'&&!dst[1])//'$' label
        return 1;

    s=dst;//+label, -label
    c=*s;
    if(c=='+' || c=='-') {
        do s++; while(*s==c);
        if(!*s)//just ++.. or --.., no text
            return 1;
    }
    c=*s;
    if(c==LOCALCHAR || c=='_' || (c>='A' && c<='Z') || (c>='a' && c<='z')) {//label can start with these
        return 1;
    } else {
        errmsg=Illegal;//fucked up instruction
        return 0;
    }
}

//Expand all equates from src into dst, and remove comment
//returns a pointer to the comment in src or null.
//CRIPES what a mess...
char *expandline(char *dst,char *src) {
    char *start;
    char *comment=0;
    char c,c2;
    label *p;
    int def_skip=0;
    char upp[WORDMAX];

    do {
        c=*src;
        if(c=='$' || (c>='0' && c<='9')) {//read past numbers (could be mistaken for a symbol, i.e. $BEEF)
            do {
                *dst=c;
                src++;
                dst++;
                c=*src;
            } while((c>='0' && c<='9') || (c>='A' && c<='H') || (c>='a' && c<='h'));
            c=1;//don't terminate yet
        } else if(c=='"' || c=='\'') {//read past quotes
            *dst=c;
            dst++; src++;
            do {
                *dst=c2=*src;
                if(c2=='\\') {
                    dst++; src++;
                    *dst=*src;
                }
                dst++; src++;
            } while(c2 && c2!=c);
            c=c2;
        } else if(c=='_' || c=='.' || c==LOCALCHAR || (c>='A' && c<='Z') || (c>='a' && c<='z')) {//symbol
            start=src;
            do {//scan to end of symbol
                src++;
                c=*src;
            } while(c=='_' || c=='.' || c==LOCALCHAR || (c>='0' && c<='9') || (c>='A' && c<='Z') || (c>='a' && c<='z'));

            *src=0; //terminate @ end of word (temporarily)

            /*
            ghey hack.
            expandline() is called quite early during parsing, so

            FOO equ xxxx
            ifdef FOO
                
              becomes

            FOO equ xxxx
            ifdef xxxx

            rendering IFDEF useless, so we will bypass expansion in this special case.
            I'm avoiding getreserved() because it does searching and other unnecessary crap.
            */
            p=0;
            if(!def_skip) {
                strcpy(upp,start+(*start=='.'));
                my_strupr(upp);
                if(!strcmp(upp,"IFDEF") || !strcmp(upp,"IFNDEF")) {
                    def_skip=1;
                } else {
                    p=findlabel(start);
                }
            }

            if(p) {
                if((*p).type!=EQUATE || (*p).pass!=pass)//equates MUST be defined before being used otherwise they will be expanded in their own definition
                    p=0;//i.e. (label equ whatever) gets translated to (whatever equ whatever)
                else {
                    if((*p).used) {
                        p=0;
                        errmsg=RecurseEQU;
                    }
                }
            }
            if(p) {
                (*p).used=1;
                expandline(dst,(*p).line);
                (*p).used=0;
            } else {
                strcpy(dst,start);
            }
            dst+=strlen(dst);
            *src=c;
        } else {
            if(c==';') {//comment
                c=0;
                comment=src;
            }
            *dst=c;
            dst++;
            src++;
        }
    } while(c);
    return comment;
}

int eatchar(char **str,char c) {
    if(c) {
        *str+=strspn(*str,whitesp);     //eatwhitespace
        if(**str==c) {
            (*str)++;
            return 1;
        } else 
            return 0;
    }
    return 1;
}

//reverse string
void reverse(char *dst,char *src) {
    dst+=strlen(src);
    *dst=0;
    while(*src)
        *(--dst)=*(src++);
}

//===========================================================================================================

//local:
//  false: if label starts with LOCALCHAR, make it local, otherwise it's global
//  true: force label to be local (used for macros)
void addlabel(char *word, int local) {
    char c=*word;
    label *p=findlabel(word);
    if(p && local && !(*p).scope && (*p).type!=VALUE) //if it's global and we're local
        p=0;//pretend we didn't see it (local label overrides global of the same name)
    //global labels advance scope
    if(c!=LOCALCHAR && !local) {
        scope=nextscope++;
    }
    if(!p) {//new label
        labelhere=newlabel();
        if(!(*labelhere).name)//name already set if it's a duplicate
            (*labelhere).name=my_strdup(word);
        (*labelhere).type=LABEL;//assume it's a label.. could mutate into something else later
        (*labelhere).pass=pass;
        (*labelhere).value=addr;
        (*labelhere).line=ptr_from_bool(addr>=0);
        (*labelhere).used=0;
        if(c==LOCALCHAR || local) { //local
            (*labelhere).scope=scope;
        } else {        //global
            (*labelhere).scope=0;
        }
        lastlabel=labelhere;
    } else {//old label
        labelhere=p;
        if((*p).pass==pass && c!='-') {//if this label already encountered
            if((*p).type==VALUE)
                return;
            else
                errmsg=LabelDefined;
        } else {//first time seen on this pass or (-) label
            (*p).pass=pass;
            if((*p).type==LABEL) {
                if((*p).value!=addr && c!='-') {
                    needanotherpass=1;//label position is still moving around
                    if(lastchance)
                        errmsg=BadAddr;
                }
                (*p).value=addr;
                (*p).line=ptr_from_bool(addr>=0);
                if(lastchance && addr<0)
                    errmsg=BadAddr;
            }
        }
    }
}

//initialize label list
void initlabels(void) {
    label *p;
    int i=0;
    
    labels=1;
    labellist=(label**)my_malloc(INITLISTSIZE*sizeof(label*));
    labelstart=INITLISTSIZE/2;
    labelend=labelstart;
    maxlabels=INITLISTSIZE;
    labellist[labelstart]=&firstlabel;//'$' label
    
    //add reserved words to label list
    
    do {//opcodes first
        findlabel(rsvdlist[i]);//must call findlabel before using newlabel
        p=newlabel();
        (*p).name=rsvdlist[i];
        (*p).value=(ptrdiff_t)opcode;
        (*p).line=rsvdlist[i+1];
        (*p).type=RESERVED;
        i+=2;
    } while(rsvdlist[i]);

    i = 0;
    do {//other reserved words now
        findlabel(directives[i].name);
        p=newlabel();
        (*p).name=directives[i].name;
        (*p).value=(ptrdiff_t)directives[i].func;
        (*p).type=RESERVED;
        i++;
    } while(directives[i].name);
    lastlabel=p;
}

//find label with this name
//returns label* if found (and scope/etc is correct), returns NULL if nothing found
//if name wasn't found, findindex points to where name would be inserted (name<labellist[findindex])
//if name was found but with wrong scope/whatever, findcmp=0.
//don't call if list is empty!
int findcmp;        //(these are used by newlabel)
int findindex;      //.
label *findlabel(char *name) {
    int head,tail;
    label *p, *global;

    head=labelstart;
    tail=labelend;
    findindex=labelstart+labels/2;
    do {//assume list isn't empty
        findcmp=strcmp(name,(*(labellist[findindex])).name);
        if(findcmp<0) {
            tail=findindex-1;
            findindex-=(tail-head)/2+1;
        } else if(findcmp>0) {
            head=findindex+1;
            findindex+=(tail-head)/2+1;
        }
    } while(findcmp && (tail-head)>=0);
    if(findcmp) {
        if(findcmp<0)
            findindex++;//position findindex so the label it points to needs to shift right
        return 0;
    }
    p=labellist[findindex];

    //check scope: label only visible if p.scope=(scope or 0)
    global=0;
    if(*name=='+') {//forward labels need special treatment :P
        do {
            if((*p).pass!=pass) {
                if(!(*p).scope)
                    global=p;
                if((*p).scope==scope)
                    return p;
            }
            p=(*p).link;
        } while(p);
    } else {
        do {
            if(!(*p).scope)
                global=p;
            if((*p).scope==scope)
                return p;
            p=(*p).link;
        } while(p);
    }
    return global;  //return global label only if no locals were found
}

//double list capacity
void growlist(void) {
    label **tmp;
    int newhead;
    
    maxlabels<<=1;
    newhead=maxlabels/2-labels/2;
    tmp=(label**)my_malloc(maxlabels*sizeof(label*));
    memcpy(tmp+newhead,labellist+labelstart,labels*sizeof(label*));
    free(labellist);
    labellist=tmp;
    findindex=findindex-labelstart+newhead;
    labelstart=newhead;
    labelend=newhead+labels-1;
}

//make new empty label and add it to list using result from last findlabel
//ONLY use after calling findlabel
label *newlabel(void) {
    label **start,**end;
    label *p;

    p=(label*)my_malloc(sizeof(label));
    (*p).link=0;
    (*p).scope=0;
    (*p).name=0;

    if(!findcmp) {//new label with same name
        (*p).name=(*labellist[findindex]).name;//share old name
        //if(!scope) {//global always goes at the end
        //  (*lastfindlink).link=p;//add to the chain..
        //} else {//insert into the front
            (*p).link=labellist[findindex];
            labellist[findindex]=p;
        //}
        return p;
    }
    if(!labelstart || labelend>=maxlabels-1)//make sure there's room to add
        growlist();

    end=&labellist[findindex];
    if(findindex>(labelstart+labels/2)) {   //shift up
        start=&labellist[labelend];
        for(;start>=end;start--)
            *(start+1)=*start;
        labelend++;
    } else {                //shift down
        end--;
        start=&labellist[labelstart];
        for(;start<=end;start++)
            *(start-1)=*start;
        labelstart--;
    }
    *end=p;
    labels++;
    return p;
}

//==============================================================================================================

void showerror(char *errsrc,int errline) {
    error=1;
    fprintf(stderr,"%s(%i): %s\n",errsrc,errline,errmsg);
    
    if(!listerr)//only list the first error for this line
        listerr=errmsg;
}

//process the open file f
char fileline[LINEMAX];
void processfile(FILE *f, char* name) {
    static int nest=0;
    int nline=0;
    int eof;
    nest++;//count nested include()s
    do {
        nline++;
        eof=!fgets(fileline,LINEMAX,f);         
        if(!eof)
            processline(fileline,name,nline);
    } while(!eof);
    nest--;
    nline--;
    if(!nest) {//if main source file (not included)
        errmsg=0;
        if(iflevel)
            errmsg=NoENDIF;
        if(reptcount)
            errmsg=NoENDR;
        if(makemacro)
            errmsg=NoENDM;
        if(nooutput)
            errmsg=NoENDE;
        if(errmsg)
            showerror(name,nline);
    }
}

//process single line
//src=source line
//errsrc=source file name
//errline=source file line number
void processline(char *src,char *errsrc,int errline) {
    char line[LINEMAX];//expanded line
    char word[WORDMAX];
    char *s,*s2,*comment;
    char *endmac;
    label *p;

    errmsg=0;
    comment=expandline(line,src);
    if(!insidemacro || verboselisting)
        listline(line,comment);

    s=line;
    if(errmsg) {    //expandline error?
        showerror(errsrc,errline);
    } else do {
        if(makemacro) { //we're inside a macro definition
            p=getreserved(&s);
            errmsg=endmac=0;
            if(!p) {//skip over label if there is one, we're looking for "ENDM"
                endmac=s;
                p=getreserved(&s);
            }
            if(p) if((*p).value==(ptrdiff_t)endm) {
                comment=0;
                if(endmac) {
                    endmac[0]='\n';
                    endmac[1]=0;//hide "ENDM" in case of "label: ENDM"
                } else
                    makemacro=0;//don't bother adding the last line
            }
            if(makemacro&&makemacro!=true_ptr) {
                if(comment)
                    strcat(line,comment);       //keep comment for listing
                *makemacro=my_malloc(strlen(line)+sizeof(char*)+1);
                makemacro=(char**)*makemacro;
                *makemacro=0;
                strcpy((char*)&makemacro[1],line);
            }
            if(p) if((*p).value==(ptrdiff_t)endm)
                makemacro=0;
            break;
        }//makemacro
        if(reptcount) {//REPT definition is in progress?
            p=getreserved(&s);
            errmsg=endmac=0;
            if(!p) {
                endmac=s;
                p=getreserved(&s);
            }
            if(p) {
                if((*p).value==(ptrdiff_t)rept) {
                    ++reptcount;//keep track of how many ENDR's are needed to finish
                } else if((*p).value==(ptrdiff_t)endr) {
                    if(!(--reptcount)) {
                        comment=0;
                        if(endmac) {
                            endmac[0]='\n';//hide "ENDR" in case of "label: ENDR"
                            endmac[1]=0;
                        }
                    }
                }
            }
            if(reptcount || endmac) {   //add this line to REPT body
                if(comment)
                    strcat(line,comment);       //keep comment for listing
                *makerept=my_malloc(strlen(line)+sizeof(char*)+1);
                makerept=(char**)*makerept;
                *makerept=0;
                strcpy((char*)&makerept[1],line);
            }
            if(!reptcount) {//end of REPT, expand the whole thing right now
                expandrept(errline,errsrc);
            }
            break;
        }
        labelhere=0;    //for non-label symbol definitions (EQU,=,etc)
        s2=s;
        p=getreserved(&s);
        errmsg=0;
        if(skipline[iflevel]) {//conditional assembly.. no code generation
            if(!p) {    //it was a label... ignore it and move on
                p=getreserved(&s);
                if(!p) break;
            }
            if((*p).value!=(ptrdiff_t)_else && (*p).value!=(ptrdiff_t)elseif && (*p).value!=(ptrdiff_t)endif
            && (*p).value!=(ptrdiff_t)_if && (*p).value!=(ptrdiff_t)ifdef && (*p).value!=(ptrdiff_t)ifndef)
                break;
        }
        if(!p) {//maybe a label?
            if(getlabel(word,&s2)) addlabel(word,insidemacro);
            if(errmsg) goto badlabel;//fucked up label
            p=getreserved(&s);
        }
        if(p) {
            if((*p).type==MACRO)
                expandmacro(p,&s,errline,errsrc);
            else
                ((icfn)(*p).value)(p,&s);
        }
        if(!errmsg) {//check extra garbage
            s+=strspn(s,whitesp);
            if(*s)
                errmsg="Extra characters on line.";
        }
badlabel:
        if(errmsg) {
            showerror(errsrc,errline);
        }
    } while(0);
}

void showhelp(void) {
    puts("");
    puts("asm6 " VERSION "\n");
    puts("Usage:  asm6 [-options] sourcefile [outputfile] [listfile]\n");
    puts("    -?          show this help");
    puts("    -l          create listing");
    puts("    -L          create verbose listing (expand REPT, MACRO)");
    puts("    -d<name>    define symbol");
    puts("    -q          quiet mode (no output unless error)\n");
    puts("See README.TXT for more info.\n");
}

//--------------------------------------------------------------------------------------------

int main(int argc,char **argv) {
    char str[512];
    int i,notoption;
    char *nameptr;
    label *p;
    FILE *f;

    if(argc<2) {
        showhelp();
        return EXIT_FAILURE;
    }
    initlabels();
    notoption=0;
    for(i=1;i<argc;i++) {
        if(*argv[i]=='-' || *argv[i]=='/') {
            switch(argv[i][1]) {
                case 'h':
                case '?':
                    showhelp();
                    return EXIT_FAILURE;
                case 'L':
                    verboselisting=1;
                case 'l':
                    listfilename=true_ptr;
                    break;
                case 'd':
                    if(argv[i][2]) {
                        if(!findlabel(&argv[i][2])) {
                            p=newlabel();
                            (*p).name=my_strdup(&argv[i][2]);
                            (*p).type=VALUE;
                            (*p).value=1;
                            (*p).line=true_ptr;
                            (*p).pass=0;
                        }
                    }
                    break;
                case 'q':
                    verbose = 0;
                    break;
                default:
                    fatal_error("unknown option: %s",argv[i]);
            }
        } else {
            if(notoption==0)
                inputfilename=argv[i];
            else if(notoption==1)
                outputfilename=argv[i];
            else if(notoption==2)
                listfilename=argv[i];
            else
                fatal_error("unused argument: %s",argv[i]);
            notoption++;
        }
    }
    if(!inputfilename) 
        fatal_error("No source file specified.");
    
    strcpy(str,inputfilename);
    nameptr=strrchr(str,'.');//nameptr='.' ptr
    if(nameptr) if(strchr(nameptr,'\\')) nameptr=0;//watch out for "dirname.ext\listfile"
    if(!nameptr) nameptr=str+strlen(str);//nameptr=inputfile extension
    if(!outputfilename) {
        strcpy(nameptr,".bin");
        outputfilename=my_strdup(str);
    }

    if(listfilename==true_ptr) {    //if listfile was wanted but no name was specified, use srcfile.LST
        strcpy(nameptr,".lst");
        listfilename=my_strdup(str);
    }

    f=fopen(inputfilename,"rb");    //if srcfile won't open, try some default extensions
    if(!f) {
        strcpy(nameptr,".asm");
        f=fopen(str,"rb");
        if(!f) {
            strcpy(nameptr,".s");
            f=fopen(str,"rb");
        }
        if(f) inputfilename=my_strdup(str);
    }
    if(f) fclose(f);

    //main assembly loop:
    p=0;
    do {
        pass++;
        if(pass==MAXPASSES || (p==lastlabel))
            lastchance=1;//give up on too many tries or no progress made
        if(lastchance)
            message("last try..\n");
        else
            message("pass %i..\n",pass);
        needanotherpass=0;
        skipline[0]=0;
        scope=1;        
        nextscope=2;
        defaultfiller=DEFAULTFILLER;    //reset filler value
        addr=NOORIGIN;//undefine origin
        p=lastlabel;
        nameptr=inputfilename;
        include(0,&nameptr);        //start assembling srcfile
        if(errmsg)
        {
            //todo - shouldn't this set error?
            fputs(errmsg, stderr);//bad inputfile??
        }
    } while(!error && !lastchance && needanotherpass);//while no hard errors, not final try, and labels are still unresolved
    
    if(outputfile) {
        // Be sure last of output file is written properly
        int result;
        if ( fwrite(outputbuff,1,outcount,outputfile) < (size_t)outcount || fflush( outputfile ) )
            fatal_error( "Write error." );
        
        i=ftell(outputfile);
        
        result = fclose(outputfile);
        outputfile = NULL; // prevent fatal_error() from trying to close file again
        if ( result )
            fatal_error( "Write error." );
        
        if(!error) {
            message("%s written (%i bytes).\n",outputfilename,i);
        } else
            remove(outputfilename);
    } else {
        if(!error)
            fputs("nothing to do!", stderr);
        error = 1;
    }
    if(listfile)
        listline(0,0);
    return error ? EXIT_FAILURE : 0;
}

#define LISTMAX 8//number of output bytes to show in listing
byte listbuff[LISTMAX];
int listcount;
void output(byte *p,int size) {
    static int oldpass=0;
/*  static int noentry=0;
    if(addr<0) {
        if(!noentry) {//do this only once
            noentry++;
            if(lastchance) errmsg=NoOrigin;//"Origin undefined."
        }
        return;
    }*/
    addr+=size;

    if(nooutput)
        return;
    if(oldpass!=pass) {
        oldpass=pass;
        if(outputfile) fclose(outputfile);
        outputfile=fopen(outputfilename,"wb");
        outcount=0;
        if(!outputfile) {
            errmsg="Can't create output file.";
            return;
        }
    }
    if(!outputfile) return;
    while(size--) {
        if(listfile && listcount<LISTMAX)
            listbuff[listcount]=*p;
        listcount++;
        outputbuff[outcount++]=*p;
        p++;
        if(outcount>=BUFFSIZE) {
            if(fwrite(outputbuff,1,BUFFSIZE,outputfile)<BUFFSIZE)
                errmsg="Write error.";
            outcount=0;
        }
    }
}

/* Outputs integer as little-endian. See readme.txt for proper usage. */
static void output_le( int n, int size )
{
    byte b [2];
    b [0] = n;
    b [1] = n >> 8;
    output( b, size );
}

//end listing when src=0
char srcbuff[LINEMAX];
void listline(char *src,char *comment) {
    static int oldpass=0;
    int i;
    if(!listfilename)
        return;
    if(oldpass!=pass) {//new pass = new listfile
        oldpass=pass;
        if(listfile) fclose(listfile);
        listfile=fopen(listfilename,"w");
        if(!listfile) {
            listfilename=0;//stop trying
            // todo - if user wants a listing, this SHOULD be an error, otherwise
            // he might still have old listing and think it's the current one.
            // For example, he might have had it open in a text editor, preventing its
            // creation here.
            fputs("Can't create list file.", stderr);//not critical, just give a warning
            return;
        }
    } else {//finish previous line
        for(i=0;i<listcount && i<LISTMAX;i++)
            fprintf(listfile," %02X",(int)listbuff[i]);
        for(;i<LISTMAX;i++)
            fprintf(listfile,"   ");
        fputs(listcount>LISTMAX?".. ":"   ",listfile);
        fputs(srcbuff,listfile);
        if(listerr) {
            fprintf(listfile,"*** %s\n",listerr);
            listerr=0;
        }
    }
    listcount=0;
    if(src) {
        if(addr<0)
            fprintf(listfile,"     ");
        else
            fprintf(listfile,"%05X",(int)addr);
        strcpy(srcbuff,src);//make a copy of the original source line
        if(comment) strcat(srcbuff,comment);
    } else {
        fclose(listfile);
        message("%s written.\n",listfilename);
    }
}
//------------------------------------------------------
//directive(label *id, char **next)
//
//  id=reserved word
//  **next=source line (ptr gets moved past directive on exit)
//------------------------------------------------------
void equ(label *id, char **next) {
    char str[LINEMAX];
    char *s=*next;
    if(!labelhere)
        errmsg=NeedName;//EQU without a name
    else {
        if((*labelhere).type==LABEL) {//new EQU.. good
            reverse(str,s+strspn(s,whitesp));       //eat whitesp off both ends
            reverse(s,str+strspn(str,whitesp));
            if(*s) {
                (*labelhere).line=my_strdup(s);
                (*labelhere).type=EQUATE;
            } else {
                errmsg=IncompleteExp;
            }
        } else if((*labelhere).type!=EQUATE) {
            errmsg=LabelDefined;
        }
        *s=0;//end line
    }
}

void equal(label *id,char **next) {
    if(!labelhere)              //labelhere=index+1
        errmsg=NeedName;        //(=) without a name
    else {
        (*labelhere).type=VALUE;
        dependant=0;
        (*labelhere).value=eval(next,WHOLEEXP);
        (*labelhere).line=ptr_from_bool(!dependant);
    }
}

void base(label *id, char **next) {    
    int val;
    dependant=0;
    val=eval(next,WHOLEEXP);
    if(!dependant && !errmsg)
        addr=val;
    else
        addr=NOORIGIN;//undefine origin
}

//nothing to do (empty line)
void nothing(label *id, char **next) {
}

void include(label *id,char **next) {
    char *np;
    FILE *f;

    np=*next;
    reverse(tmpstr,np+strspn(np,whitesp2));     //eat whitesp off both ends
    reverse(np,tmpstr+strspn(tmpstr,whitesp2));
    f=fopen(np,"r+");   //read as text, the + makes recursion not possible
    if(!f) {
        errmsg=CantOpen;
        error=1;
    } else {
        processfile(f,np);
        fclose(f);
        errmsg=0;//let main() know file was ok
    }
    *next=np+strlen(np);//need to play safe because this could be the main srcfile
}

void incbin(label *id,char **next) {
    int filesize, seekpos, bytesleft, i;
    FILE *f=0;

    do {
    //file open:
        getfilename(tmpstr,next);
        if(!(f=fopen(tmpstr,"rb"))) {
            errmsg=CantOpen;
            break;
        }
        fseek(f,0,SEEK_END);
        filesize=ftell(f);
    //file seek:
        seekpos=0;
        if(eatchar(next,','))
            seekpos=eval(next,WHOLEEXP);
        if(!errmsg && !dependant) if(seekpos<0 || seekpos>filesize)
            errmsg=SeekOutOfRange;
        if(errmsg) break;
        fseek(f,seekpos,SEEK_SET);
    //get size:
        if(eatchar(next,',')) {
            bytesleft=eval(next,WHOLEEXP);
            if(!errmsg && !dependant) if(bytesleft<0 || bytesleft>(filesize-seekpos))
                errmsg=BadIncbinSize;
            if(errmsg) break;
        } else {
            bytesleft=filesize-seekpos;
        }
    //read file:
        while(bytesleft) {
            if(bytesleft>BUFFSIZE) i=BUFFSIZE;
            else i=bytesleft;
            fread(inputbuff,1,i,f);
            output(inputbuff,i);
            bytesleft-=i;
        }
    } while(0);
    if(f) fclose(f);
}

void hex(label *id,char **next) {
    char buff[LINEMAX];
    char *src;
    int dst;
    char c1,c2;
    getword(buff,next,0);
    if(!*buff) errmsg=MissingOperand;
    else do {
        src=buff;
        dst=0;
        do {
            c1=hexify(*src);
            src++;
            if(*src) {
                c2=hexify(*src);
                src++;
            } else {//deal with odd number of chars
                c2=c1;
                c1=0;
            }
            buff[dst++]=(c1<<4)+c2;
        } while(*src);
        output((byte*)buff,dst);
        getword(buff,next,0);
    } while(*buff);
}

void dw(label *id, char **next) {
    int val;
    do {
        val=eval(next,WHOLEEXP);
        if(!errmsg) {
            if(val>65535 || val<-65536)
                errmsg=OutOfRange;
            else
                output_le(val,2);
        }
    } while(!errmsg && eatchar(next,','));
}

void dl(label *id, char **next) {
    byte val;
    do {
        val=eval(next,WHOLEEXP) & 0xff;
        if(!errmsg)
            output(&val,1);
    } while(!errmsg && eatchar(next,','));
}

void dh(label *id, char **next) {
    byte val;
    do {
        val=eval(next,WHOLEEXP)>>8;
        if(!errmsg)
            output(&val,1);
    } while(!errmsg && eatchar(next,','));
}

void db(label *id,char **next) {
    int val,val2;
    byte *s,*start;
    char c,quote;

    do {
        *next+=strspn(*next,whitesp);       //eatwhitespace
        quote=**next;
        if(quote=='"' || quote=='\'') { //string
            s=start=(byte*)*next+1;
            do {
                c=*s;
                s++;
                if(!c) errmsg=IncompleteExp;
                if(c=='\\') s++;
            } while(!errmsg && c!=quote);
            if(errmsg) continue;
            s--;    //point to the "
            *s='0';
            *next=(char*)s;
            val2=eval(next,WHOLEEXP);
            if(errmsg) continue;
            while(start!=s) {
                if(*start=='\\')
                    start++;
                val=*start+val2;
                start++;
                output_le(val,1);
            }
        } else {
            val=eval(next,WHOLEEXP);
            if(!errmsg) {
                if(val>255 || val<-128)
                    errmsg=OutOfRange;
                else
                    output_le(val,1);
            }
        }
    } while(!errmsg && eatchar(next,','));
}

void dsw(label *id,char **next) {
    int count,val=defaultfiller;
    dependant=0;
    count=eval(next,WHOLEEXP);
    if(dependant || (count<0 && needanotherpass))//unknown count! don't do anything
        count=0;
    if(eatchar(next,','))
        val=eval(next,WHOLEEXP);
    if(!errmsg && !dependant) if(val>65535 || val<-32768 || count<0)
        errmsg=OutOfRange;
    if(errmsg) return;
    while(count--)
         output_le(val,2);
}

void filler(int count,char **next) {
    int val=defaultfiller;
    if(dependant || (count<0 && needanotherpass)) //unknown count! don't do anything
        count=0;
    if(eatchar(next,','))
        val=eval(next,WHOLEEXP);
    if(!errmsg && !dependant) if(val>255 || val<-128 || count<0 || count>0x100000)
        errmsg=OutOfRange;
    if(errmsg) return;
    while(count--)//!#@$
         output_le(val,1);
}

void dsb(label *id,char **next) {
    int count;
    dependant=0;
    count=eval(next,WHOLEEXP);
    filler(count,next);
}

void align(label *id,char **next) {
    int count;
    dependant=0;
    count=eval(next,WHOLEEXP);
    if(count>=0) {
        if((unsigned int)addr%count) count-=(unsigned int)addr%count;
        else count=0;
    } else count=0;
    filler(count,next);
}

void pad(label *id, char **next) {
    int count;
    if(addr<0) {
        errmsg=undefinedPC;
    } else {
        dependant=0;
        count=eval(next,WHOLEEXP)-addr;
        filler(count,next);
    }
}

void org(label *id, char **next) {
    if(addr<0) base(id,next);   //this is the first ORG; PC hasn't been set yet
    else pad(id,next);
}

void opcode(label *id, char **next) {
    char *s,*s2;
    int type,val = 0;
    byte *op;
    int oldstate=needanotherpass;
    int forceRel = 0;
        
    for(op=(byte*)(*id).line;*op!=0xff;op+=2) {//loop through all addressing modes for this instruction
        needanotherpass=oldstate;
        strcpy(tmpstr,*next);
        dependant=0;
        errmsg=0;
        type=op[1];
        s=tmpstr;
        if(type!=IMP && type!=ACC) {//get operand
            if(!eatchar(&s,ophead[type])) continue;
            val=eval(&s,WHOLEEXP);
            if(type==REL) {
                if(!dependant) {
                    val-=addr+2;
                    if(val>127 || val<-128) {
                        needanotherpass=1;//give labels time to sort themselves out..
                        if(lastchance)
                        {
                            errmsg="Branch out of range.";
                            forceRel = 1;
                        }
                    }
                }
            } else {
                if(opsize[type]==1) {
                    if(!dependant) {
                        if(val>255 || val<-128)
                            errmsg=OutOfRange;
                    } else {
                        if(type!=IMM)
                            continue;//default to non-ZP instruction
                    }
                } else {//opsize[type]==2
                    if((val<0 || val>0xffff) && !dependant)
                        errmsg=OutOfRange;
                }
            }
            if(errmsg && !dependant && !forceRel) continue;
        }

        my_strupr(s);
        s2=optail[type];
        while(*s2) {        //opcode tail should match input:
            if(!eatchar(&s,*s2))
                break;
            s2++;
        }
        s+=strspn(s,whitesp);
        if(*s || *s2) continue;

        if(addr>0xffff)
            errmsg="PC out of range.";
        output(op,1);
        output_le(val,opsize[type]);
        *next+=s-tmpstr;
        return;
    }
    if(!errmsg)
        errmsg=Illegal;
}

void _if(label *id,char **next) {
    int val;
    if(iflevel>=IFNESTS-1)
        errmsg=IfNestLimit;
    else
        iflevel++;
    dependant=0;
    val=eval(next,WHOLEEXP);
    if(dependant || errmsg) {//don't process yet
        ifdone[iflevel]=1;
        skipline[iflevel]=1;
    } else {
        skipline[iflevel]=!val || skipline[iflevel-1];
        ifdone[iflevel]=!skipline[iflevel];
    }
}

void ifdef(label *id,char **next) {
    char s[WORDMAX];
    if(iflevel>=IFNESTS-1)
        errmsg=IfNestLimit;
    else
        iflevel++;
    getlabel(s,next);
    skipline[iflevel]=!(ptrdiff_t)findlabel(s) || skipline[iflevel-1];
    ifdone[iflevel]=!skipline[iflevel];
}

void ifndef(label *id,char **next) {
    char s[WORDMAX];
    if(iflevel>=IFNESTS-1)
        errmsg=IfNestLimit;
    else
        iflevel++;
    getlabel(s,next);
    skipline[iflevel]=(ptrdiff_t)findlabel(s) || skipline[iflevel-1];
    ifdone[iflevel]=!skipline[iflevel];
}

void elseif(label *id,char **next) {
    int val;
    if(iflevel) {
        dependant=0;
        val=eval(next,WHOLEEXP);
        if(!ifdone[iflevel]) {//no previous true statements
            if(dependant || errmsg) {//don't process yet
                ifdone[iflevel]=1;
                skipline[iflevel]=1;
            } else {
                skipline[iflevel]=!val || skipline[iflevel-1];
                ifdone[iflevel]=!skipline[iflevel];
            }
        } else {
            skipline[iflevel]=1;
        }
    } else
        errmsg="ELSEIF without IF.";
}

void _else(label *id,char **next) {
    if(iflevel)
        skipline[iflevel]=ifdone[iflevel] || skipline[iflevel-1];
    else
        errmsg="ELSE without IF.";
}

void endif(label *id,char **next) {
    if(iflevel) --iflevel;
    else errmsg="ENDIF without IF.";
}

void endm(label *id, char **next) {//ENDM is handled during macro definition (see processline)
    errmsg=ExtraENDM;
}
void endr(label *id, char **next) {//ENDR is handled during macro definition (see processline)
    errmsg=ExtraENDR;
}

void macro(label *id, char **next) {
    char *src;
    char word[WORDMAX];
    int params;
    
    labelhere=0;
    if(getlabel(word,next))
        addlabel(word,0);
    else
        errmsg=NeedName;

    makemacro=true_ptr;//flag for processline to skip to ENDM
    if(errmsg) {//no valid macro name
        return;
    } else if((*labelhere).type==LABEL) {//new macro
        (*labelhere).type=MACRO;
        (*labelhere).line=0;
        makemacro=&(*labelhere).line;
                                        //build param list
        params=0;
        src=*next;
        while(getlabel(word,&src)) {//don't affect **next directly, make sure it's a good name first
            *next=src;
            *makemacro=my_malloc(strlen(word)+sizeof(char*)+1);
            makemacro=(char**)*makemacro;
            strcpy((char*)&makemacro[1],word);
            ++params;
            eatchar(&src,',');
        }
        errmsg=0;//remove getlabel's errmsg
        (*labelhere).value=params;//set param count
        *makemacro=0;
    } else if((*labelhere).type!=MACRO) {
        errmsg=LabelDefined;
    } else {//macro was defined on a previous pass.. skip past params
        **next=0;
    }
}

//errline=source file line number
//errsrc=source file name
void expandmacro(label *id,char **next,int errline,char *errsrc) {
    //char argname[8];
    char macroerr[WORDMAX*2];//this should be enough, i hope..
    char **line;
    int linecount=0;
    int oldscope;
    int arg, args;
    char c,c2,*s,*s2,*s3;
    
    if((*id).used) {
        errmsg=RecurseMACRO;
        return;
    }

    oldscope=scope;//watch those nested macros..
    scope=nextscope++;
    insidemacro++;
    (*id).used=1;
    sprintf(macroerr,"%s(%i):%s",errsrc,errline,(*id).name);
    line=(char**)((*id).line);

    //define macro params
    s=*next;
    args=(*id).value;   //(named args)
    arg=0;
    do {
        s+=strspn(s,whitesp);//eatwhitespace    s=param start
        s2=s; //s2=param end
        s3=strpbrk(s2,",'\""); //stop at param end or string definition
        if(!s3) s3=strchr(s2,0);
        c=*s3;
        if(c=='"' || c=='\'') {//go to end of string
            s3++;
            do {
                c2=*s3;
                s3++;
                if(c2=='\\') s3++;
            } while(c2 && c2!=c);
            if(!c2) s3--;//oops..too far
            c=*s3;
        }
        s2=s3;
        *s2=0;          
        if(*s) {//arg not empty
        //  sprintf(argname,"\\%i",arg);        //make indexed arg
        //  addlabel(argname,1);
        //  equ(0,&s);
            if(arg<args) {              //make named arg
                addlabel((char*)&line[1],1);
                equ(0,&s);
                line=(char**)*line; //next arg name
            }
            arg++;
        }
        *s2=c;
        s=s2;
    } while(eatchar(&s,','));
    *next=s;

    //make "\?" arg
    //{..}

    while(arg++ < args) //skip any unused arg names
        line=(char**)*line;

    while(line) {
        linecount++;
        processline((char*)&line[1],macroerr,linecount);        
        line=(char**)*line;
    }
    errmsg=0;
    scope=oldscope;
    insidemacro--;
    (*id).used=0;
}

int rept_loops;
char *repttext;//rept chain begins here
void rept(label *id, char **next) {
    dependant=0;
    rept_loops=eval(next,WHOLEEXP);
    if(dependant || errmsg || rept_loops<0)
        rept_loops=0;
    makerept=&repttext;
    repttext=0;
    reptcount++;//tell processline to start storing up rept lines
}

void expandrept(int errline,char *errsrc) {
    char macroerr[WORDMAX*2];//source to show in listing (this should be enough, i hope?)
    char **start,**line;
    int linecount;
    int i,oldscope;

    start=(char**)repttext;//first rept data
    oldscope=scope;
    insidemacro++;
    for(i=rept_loops;i;--i) {
        linecount=0;
        scope=nextscope++;
        sprintf(macroerr,"%s(%i):REPT",errsrc,errline);
        line=start;
        while(line) {
            linecount++;
            processline((char*)&line[1],macroerr,linecount);
            line=(char**)*line;
        }
    }
    while(start) {//delete everything
        line=(char**)*start;
        free(start);
        start=line;
    }
    errmsg=0;
    scope=oldscope;
    insidemacro--;
}

int enum_saveaddr;
void _enum(label *id, char **next) {       
    int val=0;
    dependant=0;
    val=eval(next,WHOLEEXP);
//  if(!dependant && !errmsg) {
//  }
    if(!nooutput)
        enum_saveaddr=addr;
    addr=val;
    nooutput=1;
}

void ende(label *id, char **next) {
    if(nooutput) {
        addr=enum_saveaddr;
        nooutput=0;
    } else {
        errmsg=ExtraENDE;
    }
}

void fillval(label *id,char **next) {
    dependant=0;
    defaultfiller=eval(next,WHOLEEXP);
}

void make_error(label *id,char **next) {
    char *s=*next;
    reverse(tmpstr,s+strspn(s,whitesp2));       //eat whitesp, quotes off both ends
    reverse(s,tmpstr+strspn(tmpstr,whitesp2));
    errmsg=s;
    error=1;
    *next=s+strlen(s);
}
