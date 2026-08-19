#include <stdio.h>

typedef signed char Sint8;
typedef unsigned char Uint8;
typedef unsigned short Uint16;

static unsigned int console_vector;
static Uint8 ram[0x10000], dev[0x100], ptr[2], stk[2][0x100];

static Uint8
emu_dei(Uint8 port)
{
	return dev[port];
}

static void
emu_deo(Uint8 port, Uint8 value)
{
	dev[port] = value;
	switch(port) {
	case 0x11: console_vector = dev[0x10] << 8 | value; return;
	case 0x18: fputc(value, stdout); return;
	case 0x19: fputc(value, stderr); return;
	}
}

#define imm a = ram[pc++] << 8, a |= ram[(Uint16)(pc++)];
#define mov pc = d ? (Uint16)a : pc + (Sint8)a;
#define dec(m) stk[m][--ptr[m]]
#define inc(m) stk[m][ptr[m]++]
#define pox(o,m) o = dec(r); if(m) o |= dec(r) << 8;
#define pux(i,m,s) if(m) c = (i), inc(s) = c >> 8, inc(s) = c; else inc(s) = i;
#define got(o) if(d) o[1] = dec(r); o[0] = dec(r);
#define put(i,s) inc(s) = i[0]; if(d) inc(s) = i[1];
#define pok(o,v,m) ram[o] = v[0]; if(d) ram[(o + 1) & m] = v[1];
#define pek(i,v,m) v[0] = ram[i]; if(d) v[1] = ram[(i + 1) & m]; put(v,r)

#define OPC(opc,A,B) {\
	case 0x00|opc: {Uint8 d=0,r=0;A B} break;\
	case 0x20|opc: {Uint8 d=1,r=0;A B} break;\
	case 0x40|opc: {Uint8 d=0,r=1;A B} break;\
	case 0x60|opc: {Uint8 d=1,r=1;A B} break;\
	case 0x80|opc: {Uint8 d=0,r=0,k=ptr[0];A ptr[0]=k;B} break;\
	case 0xa0|opc: {Uint8 d=1,r=0,k=ptr[0];A ptr[0]=k;B} break;\
	case 0xc0|opc: {Uint8 d=0,r=1,k=ptr[1];A ptr[1]=k;B} break;\
	case 0xe0|opc: {Uint8 d=1,r=1,k=ptr[1];A ptr[1]=k;B} break;}

static unsigned int
uxn_eval(Uint16 pc)
{
	Uint16 a, b, c, x[2], y[2], z[2];
	for(;;)
	switch(ram[pc++]) {
	/* BRK */ case 0x00: return 1;
	/* JCI */ case 0x20: if(dec(0)) { imm pc += a; } else pc += 2; break;
	/* JMI */ case 0x40: imm pc += a; break;
	/* JSI */ case 0x60: imm pux(pc, 1, 1) pc += a; break;
	/* LI2 */ case 0xa0: inc(0) = ram[pc++]; /* fall-through */
	/* LIT */ case 0x80: inc(0) = ram[pc++]; break;
	/* L2r */ case 0xe0: inc(1) = ram[pc++]; /* fall-through */
	/* LIr */ case 0xc0: inc(1) = ram[pc++]; break;
	/* INC */ OPC(0x01,pox(a,d),pux(a + 1,d,r))
	/* POP */ OPC(0x02,ptr[r] -= 1 + d;,{})
	/* NIP */ OPC(0x03,got(x) ptr[r] -= 1 + d;,put(x,r))
	/* SWP */ OPC(0x04,got(x) got(y),put(x,r) put(y,r))
	/* ROT */ OPC(0x05,got(x) got(y) got(z),put(y,r) put(x,r) put(z,r))
	/* DUP */ OPC(0x06,got(x),put(x,r) put(x,r))
	/* OVR */ OPC(0x07,got(x) got(y),put(y,r) put(x,r) put(y,r))
	/* EQU */ OPC(0x08,pox(a,d) pox(b,d),pux(b == a,0,r))
	/* NEQ */ OPC(0x09,pox(a,d) pox(b,d),pux(b != a,0,r))
	/* GTH */ OPC(0x0a,pox(a,d) pox(b,d),pux(b > a,0,r))
	/* LTH */ OPC(0x0b,pox(a,d) pox(b,d),pux(b < a,0,r))
	/* JMP */ OPC(0x0c,pox(a,d),mov)
	/* JCN */ OPC(0x0d,pox(a,d) pox(b,0),if(b) mov)
	/* JSR */ OPC(0x0e,pox(a,d),pux(pc,1,!r) mov)
	/* STH */ OPC(0x0f,got(x),put(x,!r))
	/* LDZ */ OPC(0x10,pox(a,0),pek(a, x, 0xff))
	/* STZ */ OPC(0x11,pox(a,0) got(y),pok(a, y, 0xff))
	/* LDR */ OPC(0x12,pox(a,0),pek(pc + (Sint8)a, x, 0xffff))
	/* STR */ OPC(0x13,pox(a,0) got(y),pok(pc + (Sint8)a, y, 0xffff))
	/* LDA */ OPC(0x14,pox(a,1),pek(a, x, 0xffff))
	/* STA */ OPC(0x15,pox(a,1) got(y),pok(a, y, 0xffff))
	/* DEI */ OPC(0x16,pox(a,0),x[0] = emu_dei(a); if(d) x[1] = dev[(a + 1) & 0xff]; put(x,r))
	/* DEO */ OPC(0x17,pox(a,0) got(y),if(d) dev[a] = y[0]; emu_deo(a + d, y[d]);)
	/* ADD */ OPC(0x18,pox(a,d) pox(b,d),pux(b + a, d,r))
	/* SUB */ OPC(0x19,pox(a,d) pox(b,d),pux(b - a, d,r))
	/* MUL */ OPC(0x1a,pox(a,d) pox(b,d),pux(b * a, d,r))
	/* DIV */ OPC(0x1b,pox(a,d) pox(b,d),pux(a ? b / a : 0, d,r))
	/* AND */ OPC(0x1c,pox(a,d) pox(b,d),pux(b & a, d,r))
	/* ORA */ OPC(0x1d,pox(a,d) pox(b,d),pux(b | a, d,r))
	/* EOR */ OPC(0x1e,pox(a,d) pox(b,d),pux(b ^ a, d,r))
	/* SFT */ OPC(0x1f,pox(a,0) pox(b,d),pux(b >> (a & 0xf) << (a >> 4), d,r))
	} return 0;
}

static void
console_input(int c, unsigned int type)
{
	dev[0x12] = c, dev[0x17] = type;
	if(console_vector)
		uxn_eval(console_vector);
}

int
main(int argc, char **argv)
{
	FILE *f;
	if(argc < 2)
		return fprintf(stdout, "usage: %s file.rom [args..]\n", argv[0]);
	else if(!(f = fopen(argv[1], "rb")))
		return fprintf(stderr, "%s: %s not found.\n", argv[0], argv[1]);
	fread(&ram[0x100], 0xff00, 1, f), fclose(f);
	dev[0x17] = argc > 2;
	if(uxn_eval(0x100) && console_vector) {
		int i = 2;
		for(; i < argc; i++) {
			char c, *p = argv[i];
			while(!dev[0x0f] && (c = *p++))
				console_input(c, 2);
			console_input('\n', 3 + (i == argc - 1));
		}
		while(!dev[0x0f]) {
			int c = fgetc(stdin);
			if(c == EOF) break;
			console_input(c, 1);
		}
		console_input('\n', 4);
	}
	return dev[0x0f] & 0x7f;
}
