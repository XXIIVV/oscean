#include <stdio.h>

typedef unsigned char Uint8;
typedef signed char Sint8;
typedef unsigned short Uint16;

typedef struct {
	Uint8 dat[0x100], ptr;
} Stack;

typedef struct Uxn {
	Uint8 ram[0x10000], dev[0x100];
	Stack wst, rst;
} Uxn;

Uxn uxn;

/* I/O */

Uint8
emu_dei(Uint8 addr)
{
	return uxn.dev[addr];
}

void
emu_deo(Uint8 addr, Uint8 value)
{
	uxn.dev[addr] = value;
	switch(addr) {
	case 0x18: fputc(uxn.dev[0x18], stdout), fflush(stdout); return;
	case 0x19: fputc(uxn.dev[0x19], stderr), fflush(stderr); return;
	}
}

/* Unroll */

#define OPC(opc, body) {\
	case 0x00|opc: {int _2=0,_r=0,a,b,c; Stack *s = &uxn.wst; Uint8 *sp = &uxn.wst.ptr; body break;}\
	case 0x20|opc: {int _2=1,_r=0,a,b,c; Stack *s = &uxn.wst; Uint8 *sp = &uxn.wst.ptr; body break;}\
	case 0x40|opc: {int _2=0,_r=1,a,b,c; Stack *s = &uxn.rst; Uint8 *sp = &uxn.rst.ptr; body break;}\
	case 0x60|opc: {int _2=1,_r=1,a,b,c; Stack *s = &uxn.rst; Uint8 *sp = &uxn.rst.ptr; body break;}\
	case 0x80|opc: {int _2=0,_r=0,a,b,c; Stack *s = &uxn.wst; Uint8 kp = uxn.wst.ptr, *sp = &kp; body break;}\
	case 0xa0|opc: {int _2=1,_r=0,a,b,c; Stack *s = &uxn.wst; Uint8 kp = uxn.wst.ptr, *sp = &kp; body break;}\
	case 0xc0|opc: {int _2=0,_r=1,a,b,c; Stack *s = &uxn.rst; Uint8 kp = uxn.rst.ptr, *sp = &kp; body break;}\
	case 0xe0|opc: {int _2=1,_r=1,a,b,c; Stack *s = &uxn.rst; Uint8 kp = uxn.rst.ptr, *sp = &kp; body break;}\
}

/* Microcode */

#define FLP { s = _r ? &uxn.wst : &uxn.rst; }
#define JMI { pc += uxn.ram[pc++] << 8 | uxn.ram[pc++]; }
#define JMP(x) { if(_2) pc = (x); else pc += (Sint8)(x); }
#define POx(o) { if(_2) { PO2(o) } else PO1(o) }
#define PO1(o) { o = s->dat[--*sp]; }
#define PO2(o) { o = s->dat[--*sp] | (s->dat[--*sp] << 8); }
#define PUx(y) { if(_2) { PU2(y) } else PU1(y) }
#define PU1(y) { s->dat[s->ptr++] = (y); }
#define PU2(y) { tt = (y); s->dat[s->ptr++] = tt >> 0x8; s->dat[s->ptr++] = tt; }
#define IMM(x, y) { uxn.x.dat[uxn.x.ptr++] = (y); }
#define DEI(o, p) { if(_2) { o = (emu_dei(p) << 8) | emu_dei(p + 1); } else o = emu_dei(p); }
#define DEO(p, y) { if(_2) { emu_deo(p, y >> 8); emu_deo(p + 1, y); } else emu_deo(p, y); }
#define PEK(o, x, r) { if(_2) { r = (x); o = uxn.ram[r++] << 8 | uxn.ram[r]; } else o = uxn.ram[(x)]; }
#define POK(x, y, r) { if(_2) { r = (x); uxn.ram[r++] = y >> 8; uxn.ram[r] = y; } else uxn.ram[(x)] = (y); }

int
uxn_eval(Uint16 pc)
{
	if(!pc) return 0;
	for(;;) {
		Uint8 t;
		Uint16 tt;
		switch(uxn.ram[pc++]) {
		/* BRK */ case 0x00: return 1;
		/* JCI */ case 0x20: if(uxn.wst.dat[--uxn.wst.ptr]) { JMI break; } pc += 2; break;
		/* JMI */ case 0x40: JMI break;
		/* JSI */ case 0x60: tt = pc + 2; IMM(rst, tt >> 8) IMM(rst, tt) JMI break;
		/* LI2 */ case 0xa0: IMM(wst, uxn.ram[pc++])
		/* LIT */ case 0x80: IMM(wst, uxn.ram[pc++]) break;
		/* L2r */ case 0xe0: IMM(rst, uxn.ram[pc++])
		/* LIr */ case 0xc0: IMM(rst, uxn.ram[pc++]) break;
		/* INC */ OPC(0x01, POx(a) PUx(a + 1))
		/* POP */ OPC(0x02, POx(a))
		/* NIP */ OPC(0x03, POx(a) POx(b) PUx(a))
		/* SWP */ OPC(0x04, POx(a) POx(b) PUx(a) PUx(b))
		/* ROT */ OPC(0x05, POx(a) POx(b) POx(c) PUx(b) PUx(a) PUx(c))
		/* DUP */ OPC(0x06, POx(a) PUx(a) PUx(a))
		/* OVR */ OPC(0x07, POx(a) POx(b) PUx(b) PUx(a) PUx(b))
		/* EQU */ OPC(0x08, POx(a) POx(b) PU1(b == a))
		/* NEQ */ OPC(0x09, POx(a) POx(b) PU1(b != a))
		/* GTH */ OPC(0x0a, POx(a) POx(b) PU1(b > a))
		/* LTH */ OPC(0x0b, POx(a) POx(b) PU1(b < a))
		/* JMP */ OPC(0x0c, POx(a) JMP(a))
		/* JCN */ OPC(0x0d, POx(a) PO1(b) if(b) JMP(a))
		/* JSR */ OPC(0x0e, POx(a) FLP PU2(pc) JMP(a))
		/* STH */ OPC(0x0f, POx(a) FLP PUx(a))
		/* LDZ */ OPC(0x10, PO1(a) PEK(b, a, t) PUx(b))
		/* STZ */ OPC(0x11, PO1(a) POx(b) POK(a, b, t))
		/* LDR */ OPC(0x12, PO1(a) PEK(b, pc + (Sint8)a, tt) PUx(b))
		/* STR */ OPC(0x13, PO1(a) POx(b) POK(pc + (Sint8)a, b, tt))
		/* LDA */ OPC(0x14, PO2(a) PEK(b, a, tt) PUx(b))
		/* STA */ OPC(0x15, PO2(a) POx(b) POK(a, b, tt))
		/* DEI */ OPC(0x16, PO1(a) DEI(b, a) PUx(b))
		/* DEO */ OPC(0x17, PO1(a) POx(b) DEO(a, b))
		/* ADD */ OPC(0x18, POx(a) POx(b) PUx(b + a))
		/* SUB */ OPC(0x19, POx(a) POx(b) PUx(b - a))
		/* MUL */ OPC(0x1a, POx(a) POx(b) PUx(b * a))
		/* DIV */ OPC(0x1b, POx(a) POx(b) PUx(a ? b / a : 0))
		/* AND */ OPC(0x1c, POx(a) POx(b) PUx(b & a))
		/* ORA */ OPC(0x1d, POx(a) POx(b) PUx(b | a))
		/* EOR */ OPC(0x1e, POx(a) POx(b) PUx(b ^ a))
		/* SFT */ OPC(0x1f, PO1(a) POx(b) PUx(b >> (a & 0xf) << (a >> 4)))
		}
	}
}

void
console_input(char c, int type)
{
	uxn.dev[0x12] = c, uxn.dev[0x17] = type;
	uxn_eval(uxn.dev[0x10] << 8 | uxn.dev[0x11]);
}

int
main(int argc, char **argv)
{
	FILE *f;
	int i = 1;
	if(argc < 2) {
		fprintf(stdout, "usage: %s file.rom [args..]\n", argv[0]);
		return 0;
	}
	f = fopen(argv[i++], "rb");
	if(!f) {
		fprintf(stderr, "uxnmin: Error %s\n", argv[1]);
		return 0;
	}
	uxn.dev[0x17] = argc - i;
	fread(&uxn.ram[0x0100], 0xff00, 1, f), fclose(f);
	if(uxn_eval(0x0100) && (uxn.dev[0x10] << 8 | uxn.dev[0x11])) {
		for(; i < argc; i++) {
			char *p = argv[i];
			while(*p) console_input(*p++, 0x2);
			console_input('\n', i == argc - 1 ? 0x4 : 0x3);
		}
		while(!uxn.dev[0x0f]) {
			int c = fgetc(stdin);
			if(c == EOF) {
				console_input(0x00, 0x4);
				break;
			}
			console_input((Uint8)c, 0x1);
		}
	}
	return uxn.dev[0x0f] & 0x7f;
}
