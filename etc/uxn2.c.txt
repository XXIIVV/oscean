#define _XOPEN_SOURCE 500
#include <SDL.h>

#if defined(_WIN32) && defined(_WIN32_WINNT) && _WIN32_WINNT > 0x0602
#include <processthreadsapi.h>
#elif defined(_WIN32)
#include <windows.h>
#endif

#ifndef __plan9__
#define USED(x) (void)(x)
#endif

/*
Copyright (c) 2021-2025 Devine Lu Linvega, Andrew Alderwick

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE.

cc -I/usr/include/SDL2 -DNDEBUG -O2 -g0 -s -lSDL2 src/uxn2.c -o bin/uxn2
	$(sdl2-config --cflags --libs)
*/

/* clang-format off */

#define BANKS 0x10
#define BANKS_CAP BANKS * 0x10000
#define WIDTH (64 * 8)
#define HEIGHT (40 * 8)
#define TWOS(v) (v & 0x8000 ? (int)v - 0x10000 : (int)v)
#define PEEK2(d) (*(d) << 8 | (d)[1])
#define POKE2(d, v) { *(d) = (v) >> 8; (d)[1] = (v); }
#define CLAMP(v, a, b) { if(v < a) v = a; else if(v >= b) v = b; }

/*
@|Uxn --------------------------------------------------------------- */

#define NEXT if(--cycles) goto step; else return 0;

#define OPC(opc, A, B) {\
	case 0x00|opc: {const int _2=0,_r=0;A B;} NEXT\
	case 0x20|opc: {const int _2=1,_r=0;A B;} NEXT\
	case 0x40|opc: {const int _2=0,_r=1;A B;} NEXT\
	case 0x60|opc: {const int _2=1,_r=1;A B;} NEXT\
	case 0x80|opc: {const int _2=0,_r=0;int k=ptr[0];A ptr[0]=k;B;} NEXT\
	case 0xa0|opc: {const int _2=1,_r=0;int k=ptr[0];A ptr[0]=k;B;} NEXT\
	case 0xc0|opc: {const int _2=0,_r=1;int k=ptr[1];A ptr[1]=k;B;} NEXT\
	case 0xe0|opc: {const int _2=1,_r=1;int k=ptr[1];A ptr[1]=k;B;} NEXT\
}

#define REM ptr[_r] -= 1 + _2;
#define DEC(m) stk[m][--ptr[m]]
#define INC(m) stk[m][ptr[m]++]
#define IMM(r) { r = ram[pc++] << 8, r |= ram[pc++]; }
#define MOV(x) { if(_2) pc = x; else pc += (signed char)x; }
#define PO1(o) o = DEC(_r);
#define PO2(o) { o = DEC(_r), o |= DEC(_r) << 8; }
#define POx(o) if(_2) PO2(o) else PO1(o)
#define GOT(o) if(_2) PO1(o[1]) PO1(o[0])
#define DEO(o,r) emu_deo(o, r[0]); if(_2) emu_deo(o + 1, r[1]);
#define POK(o,r,m) ram[o] = r[0]; if(_2) ram[(o + 1) & m] = r[1];
#define RP1(i) INC(!_r) = i;
#define PU1(i) INC(_r) = i;
#define PUx(i) if(_2) { c = (i); PU1(c >> 8) PU1(c) } else PU1(i)
#define PUT(i) PU1(i[0]) if(_2) PU1(i[1])
#define DEI(i,r) r[0] = emu_dei(i); if(_2) r[1] = emu_dei(i + 1); PUT(r)
#define PEK(i,r,m) r[0] = ram[i]; if(_2) r[1] = ram[(i + 1) & m]; PUT(r)

Uint8 *ram, dev[0x100], ptr[2], stk[2][0x100], emu_dei(const Uint8 port);
void emu_deo(const Uint8 port, const Uint8 value);

unsigned int
uxn_eval(Uint16 pc)
{
	unsigned int a, b, c, x[2], y[2], z[2], cycles = 0x80000000;
step:
	switch(ram[pc++]) {
	/* BRK */ case 0x00: return 1;
	/* JCI */ case 0x20: if(DEC(0)) { IMM(c) pc += c; } else pc += 2; NEXT
	/* JMI */ case 0x40: IMM(c) pc += c; NEXT
	/* JSI */ case 0x60: IMM(c) INC(1) = pc >> 8, INC(1) = pc, pc += c; NEXT
	/* LI2 */ case 0xa0: INC(0) = ram[pc++]; /* fall-through */
	/* LIT */ case 0x80: INC(0) = ram[pc++]; NEXT
	/* L2r */ case 0xe0: INC(1) = ram[pc++]; /* fall-through */
	/* LIr */ case 0xc0: INC(1) = ram[pc++]; NEXT
	/* INC */ OPC(0x01,POx(a),PUx(a + 1))
	/* POP */ OPC(0x02,REM,{})
	/* NIP */ OPC(0x03,GOT(x) REM,PUT(x))
	/* SWP */ OPC(0x04,GOT(x) GOT(y),PUT(x) PUT(y))
	/* ROT */ OPC(0x05,GOT(x) GOT(y) GOT(z),PUT(y) PUT(x) PUT(z))
	/* DUP */ OPC(0x06,GOT(x),PUT(x) PUT(x))
	/* OVR */ OPC(0x07,GOT(x) GOT(y),PUT(y) PUT(x) PUT(y))
	/* EQU */ OPC(0x08,POx(a) POx(b),PU1(b == a))
	/* NEQ */ OPC(0x09,POx(a) POx(b),PU1(b != a))
	/* GTH */ OPC(0x0a,POx(a) POx(b),PU1(b > a))
	/* LTH */ OPC(0x0b,POx(a) POx(b),PU1(b < a))
	/* JMP */ OPC(0x0c,POx(a),MOV(a))
	/* JCN */ OPC(0x0d,POx(a) PO1(b),if(b) MOV(a))
	/* JSR */ OPC(0x0e,POx(a),RP1(pc >> 8) RP1(pc) MOV(a))
	/* STH */ OPC(0x0f,GOT(x),RP1(x[0]) if(_2) RP1(x[1]))
	/* LDZ */ OPC(0x10,PO1(a),PEK(a, x, 0xff))
	/* STZ */ OPC(0x11,PO1(a) GOT(y),POK(a, y, 0xff))
	/* LDR */ OPC(0x12,PO1(a),PEK(pc + (signed char)a, x, 0xffff))
	/* STR */ OPC(0x13,PO1(a) GOT(y),POK(pc + (signed char)a, y, 0xffff))
	/* LDA */ OPC(0x14,PO2(a),PEK(a, x, 0xffff))
	/* STA */ OPC(0x15,PO2(a) GOT(y),POK(a, y, 0xffff))
	/* DEI */ OPC(0x16,PO1(a),DEI(a, x))
	/* DEO */ OPC(0x17,PO1(a) GOT(y),DEO(a, y))
	/* ADD */ OPC(0x18,POx(a) POx(b),PUx(b + a))
	/* SUB */ OPC(0x19,POx(a) POx(b),PUx(b - a))
	/* MUL */ OPC(0x1a,POx(a) POx(b),PUx(b * a))
	/* DIV */ OPC(0x1b,POx(a) POx(b),PUx(a ? b / a : 0))
	/* AND */ OPC(0x1c,POx(a) POx(b),PUx(b & a))
	/* ORA */ OPC(0x1d,POx(a) POx(b),PUx(b | a))
	/* EOR */ OPC(0x1e,POx(a) POx(b),PUx(b ^ a))
	/* SFT */ OPC(0x1f,PO1(a) POx(b),PUx(b >> (a & 0xf) << (a >> 4)))
	}
	return 0;
}

/* clang-format on */

/*
@|System ------------------------------------------------------------ */

static char *system_boot_path;

static void
system_print(char *name, int r)
{
	Uint8 i;
	fprintf(stderr, "%s%c", name, ptr[r] - 8 ? ' ' : '|');
	for(i = ptr[r] - 8; i != ptr[r]; i++)
		fprintf(stderr, "%02x%c", stk[r][i], i == 0xff ? '|' : ' ');
	fprintf(stderr, "<%02x\n", ptr[r]);
}

static unsigned int
system_load(const char *rom_path)
{
	FILE *f = fopen(rom_path, "rb");
	if(f) {
		unsigned int i = 0, l = fread(ram + 0x100, 0x10000 - 0x100, 1, f);
		while(l && ++i < BANKS)
			l = fread(ram + i * 0x10000, 0x10000, 1, f);
		fclose(f);
	}
	return !!f;
}

static unsigned int
system_boot(char *rom_path, const unsigned int has_args)
{
	ram = (Uint8 *)calloc(BANKS_CAP, sizeof(Uint8));
	system_boot_path = rom_path;
	dev[0x17] = has_args;
	return ram && system_load(rom_path);
}

static unsigned int
system_reboot(const unsigned int soft)
{
	memset(dev, 0, 0x100);
	memset(stk[0], 0, 0x100);
	memset(stk[1], 0, 0x100);
	if(soft)
		memset(ram + 0x100, 0, 0xff00);
	else
		memset(ram, 0, 0x10000);
	ptr[0] = ptr[1] = 0;
	return system_load(system_boot_path);
}

static void
system_expansion(const Uint16 exp)
{
	Uint8 *aptr = ram + exp;
	Uint16 length = PEEK2(aptr + 1), limit;
	unsigned int bank = PEEK2(aptr + 3) * 0x10000;
	unsigned int addr = PEEK2(aptr + 5);
	if(ram[exp] == 0x0) {
		unsigned int dst_value = ram[exp + 7];
		if(bank < BANKS_CAP)
			memset(ram + bank + addr, dst_value, length);
	} else if(ram[exp] == 0x1) {
		unsigned int dst_bank = PEEK2(aptr + 7) * 0x10000;
		unsigned int dst_addr = PEEK2(aptr + 9);
		Uint16 a = addr, c = dst_addr;
		if(bank < BANKS_CAP && dst_bank < BANKS_CAP)
			for(limit = a + length; a != limit; c++, a++)
				ram[dst_bank + c] = ram[bank + a];
	} else if(ram[exp] == 0x2) {
		unsigned int dst_bank = PEEK2(aptr + 7) * 0x10000;
		unsigned int dst_addr = PEEK2(aptr + 9);
		Uint16 a = addr + length - 1, c = dst_addr + length - 1;
		if(bank < BANKS_CAP && dst_bank < BANKS_CAP)
			for(limit = addr - 1; a != limit; a--, c--)
				ram[dst_bank + c] = ram[bank + a];
	} else
		fprintf(stderr, "Unknown command: %s\n", &ram[exp]);
}

/*
@|Console ----------------------------------------------------------- */

#define CONSOLE_STD 0x1
#define CONSOLE_ARG 0x2
#define CONSOLE_EOA 0x3
#define CONSOLE_END 0x4

static int console_vector;

static unsigned int
console_input(int c, unsigned int type)
{
	if(c == EOF) c = 0, type = CONSOLE_END;
	dev[0x12] = c, dev[0x17] = type;
	if(console_vector) uxn_eval(console_vector);
	return type != CONSOLE_END;
}

/*
@|Screen ------------------------------------------------------------ */

#define screen_zoom 1
static int emu_zoom = 1;

static Uint8 *screen_layers;
static int screen_width, screen_height, screen_wmar2, screen_hmar2;
static int screen_reqsize, screen_reqdraw;
static int screen_x1, screen_y1, screen_x2, screen_y2;
static int screen_vector, *screen_pixels, screen_palette[16];
static int rX, rY, rA, rMX, rMY, rMA, rML, rDX, rDY;

void emu_redraw(void), emu_resize(void);

static const Uint8 blending[16][2][4] = {
	{{0, 0, 1, 2}, {0, 0, 4, 8}},
	{{0, 1, 2, 3}, {0, 4, 8, 12}},
	{{0, 2, 3, 1}, {0, 8, 12, 4}},
	{{0, 3, 1, 2}, {0, 12, 4, 8}},
	{{1, 0, 1, 2}, {4, 0, 4, 8}},
	{{0, 1, 2, 3}, {0, 4, 8, 12}},
	{{1, 2, 3, 1}, {4, 8, 12, 4}},
	{{1, 3, 1, 2}, {4, 12, 4, 8}},
	{{2, 0, 1, 2}, {8, 0, 4, 8}},
	{{2, 1, 2, 3}, {8, 4, 8, 12}},
	{{0, 2, 3, 1}, {0, 8, 12, 4}},
	{{2, 3, 1, 2}, {8, 12, 4, 8}},
	{{3, 0, 1, 2}, {12, 0, 4, 8}},
	{{3, 1, 2, 3}, {12, 4, 8, 12}},
	{{3, 2, 3, 1}, {12, 8, 12, 4}},
	{{0, 3, 1, 2}, {0, 12, 4, 8}}};

static void
screen_change(const int x1, const int y1, const int x2, const int y2)
{
	if(x1 < screen_x1) screen_x1 = x1;
	if(y1 < screen_y1) screen_y1 = y1;
	if(x2 > screen_x2) screen_x2 = x2;
	if(y2 > screen_y2) screen_y2 = y2;
}

static void
screen_colorize(void)
{
	unsigned int i, shift, colors[4];
	for(i = 0, shift = 4; i < 4; ++i, shift ^= 4) {
		Uint8
			r = dev[0x8 + i / 2] >> shift & 0xf,
			g = dev[0xa + i / 2] >> shift & 0xf,
			b = dev[0xc + i / 2] >> shift & 0xf;
		colors[i] = 0x0f000000 | r << 16 | g << 8 | b;
		colors[i] |= colors[i] << 4;
	}
	for(i = 0; i < 16; i++)
		screen_palette[i] = colors[i >> 2 ? i >> 2 : i & 3];
	screen_reqdraw = 1;
}

static void
screen_resize(int width, int height)
{
	if(width != screen_width || height != screen_height) {
		int length;
		screen_width = width, screen_wmar2 = width + 0x10;
		screen_height = height, screen_hmar2 = height + 0x10;
		length = screen_wmar2 * screen_hmar2;
		screen_layers = realloc(screen_layers, length);
		memset(screen_layers, 0, length);
		screen_reqsize = screen_reqdraw = 1;
	}
}

static void
screen_redraw(void)
{
	int x, y;
	if(screen_zoom == 1) {
		int colmar = (screen_y1 + 8) * screen_wmar2;
		int *dst = &screen_pixels[screen_y1 * screen_width + screen_x1];
		for(y = screen_y1; y < screen_y2; y++, dst += screen_width, colmar += screen_wmar2) {
			int i = (screen_x1 + 8) + colmar;
			int *a = dst, *b = a + (screen_x2 - screen_x1);
			while(a < b)
				*a++ = screen_palette[screen_layers[i++]];
		}
	} else {
		int i, k, l;
		for(y = screen_y1; y < screen_y2; y++) {
			const int ys = y * screen_zoom;
			for(x = screen_x1, i = (x + 8) + (y + 8) * screen_wmar2; x < screen_x2; x++, i++) {
				const int c = screen_palette[screen_layers[i]];
				for(k = 0; k < screen_zoom; k++) {
					const int oo = (ys + k) * screen_width * screen_zoom + x * screen_zoom;
					for(l = 0; l < screen_zoom; l++)
						screen_pixels[oo + l] = c;
				}
			}
		}
	}
	emu_redraw();
	screen_x1 = screen_y1 = screen_x2 = screen_y2 = screen_reqdraw = 0;
}

static void
screen_update(void)
{
	if(screen_vector)
		uxn_eval(screen_vector);
	if(screen_reqsize) {
		screen_pixels = realloc(screen_pixels, screen_width * screen_height * sizeof(unsigned int) * screen_zoom * screen_zoom);
		screen_reqsize = 0;
		emu_resize();
	}
	if(screen_reqdraw) {
		screen_x1 = screen_y1 = 0;
		screen_x2 = screen_width;
		screen_y2 = screen_height;
		screen_redraw();
	} else if(screen_x2 > screen_x1 && screen_y2 > screen_y1) {
		CLAMP(screen_x1, 0, screen_width);
		CLAMP(screen_y1, 0, screen_height);
		CLAMP(screen_x2, 0, screen_width);
		CLAMP(screen_y2, 0, screen_height);
		screen_redraw();
	}
}

static void
screen_draw_pixel(void)
{
	int layer_mask, color, px;
	const int ctrl = dev[0x2e];
	const int len = screen_wmar2;
	if(ctrl & 0x40)
		layer_mask = 0x3, color = (ctrl & 0x3) << 2;
	else
		layer_mask = 0xc, color = ctrl & 0x3;
	/* fill mode */
	if(ctrl & 0x80) {
		int x1, y1, x2, y2, ay, by;
		if(ctrl & 0x10)
			x1 = 0, x2 = rX;
		else
			x1 = rX, x2 = screen_width;
		if(ctrl & 0x20)
			y1 = 0, y2 = rY;
		else
			y1 = rY, y2 = screen_height;
		screen_reqdraw = 1;
		x1 = x1 + 8, y1 = y1 + 8;
		const int hor = (x2 + 8) - x1, ver = (y2 + 8) - y1;
		for(ay = y1 * len, by = ay + ver * len; ay < by; ay += len) {
			Uint8 *dst = &screen_layers[ay + x1];
			for(px = 0; px < hor; px++)
				dst[px] = (dst[px] & layer_mask) | color;
		}
	}
	/* pixel mode */
	else {
		const unsigned int x = rX, y = rY;
		if(x < screen_width && y < screen_height) {
			Uint8 *dst = &screen_layers[(x + 8) + (y + 8) * len];
			*dst = (*dst & layer_mask) | color;
		}
		screen_reqdraw = 1;
		if(rMX) rX++;
		if(rMY) rY++;
	}
}

/* clang-format off */

#define PUT_PIXEL(n, op) if(op | color) dst[n] = (dst[n] & layer_mask) | table[color]; 
#define GET_COLOR(depth) const int color = depth ? (((ch1 >> qx) & 1) | ((ch2 >> qx) & 2)) : (ch1 >> qx) & 1; 

#define PUT_PIXELS(n,op,depth,c1,c2) {\
	int qx = qfx; const int ch1 = c1, ch2 = c2;\
	{GET_COLOR(depth) PUT_PIXEL(0, op); qx -= fx; }\
	{GET_COLOR(depth) PUT_PIXEL(1, op); qx -= fx; }\
	{GET_COLOR(depth) PUT_PIXEL(2, op); qx -= fx; }\
	{GET_COLOR(depth) PUT_PIXEL(3, op); qx -= fx; }\
	{GET_COLOR(depth) PUT_PIXEL(4, op); qx -= fx; }\
	{GET_COLOR(depth) PUT_PIXEL(5, op); qx -= fx; }\
	{GET_COLOR(depth) PUT_PIXEL(6, op); qx -= fx; }\
	{GET_COLOR(depth) PUT_PIXEL(7, op); qx -= fx; }\
}

/* clang-format on */

static void
screen_draw_sprite(void)
{
	int i, x = rX, y = rY, layer_mask;
	int fx, fy, qfx, qfy, dxy, dyx, row;
	const Uint8 *table;
	const int ctrl = dev[0x2f];
	const int blend = ctrl & 0xf;
	const int opaque = blend % 5;
	if(ctrl & 0x10)
		fx = -1, qfx = 0, dyx = -rDY;
	else
		fx = 1, qfx = 7, dyx = rDY;
	if(ctrl & 0x20)
		fy = -1, qfy = 7, dxy = -rDX;
	else
		fy = 1, qfy = 0, dxy = rDX;
	if(ctrl & 0x40)
		layer_mask = 0x3, table = blending[blend][1];
	else
		layer_mask = 0xc, table = blending[blend][0];
	if(ctrl & 0x80) {
		const int addr_incr = rMA << 2;
		for(i = 0; i <= rML; i++, x += dyx, y += dxy, rA += addr_incr) {
			const Uint16 xmar2 = x + 16, ymar2 = y + 16, xmar = x + 8, ymar = y + 8;
			if(xmar2 == xmar + 8 && ymar2 == ymar + 8 && xmar2 < screen_wmar2 && ymar2 < screen_hmar2) {
				Uint8 *dst = &screen_layers[xmar + ymar * screen_wmar2];
				const Uint8 *sch1 = &ram[rA + qfy], *sch2 = sch1 + 8;
				if(opaque)
					for(row = 0; row < 8; row++, dst += screen_wmar2, sch1 += fy, sch2 += fy)
						PUT_PIXELS(n, 1, 1, *sch1, *sch2 << 1)
				else
					for(row = 0; row < 8; row++, dst += screen_wmar2, sch1 += fy, sch2 += fy)
						PUT_PIXELS(n, 0, 1, *sch1, *sch2 << 1)
			}
		}
	} else {
		const int addr_incr = rMA << 1;
		for(i = 0; i <= rML; i++, x += dyx, y += dxy, rA += addr_incr) {
			const Uint16 xmar2 = x + 16, ymar2 = y + 16, xmar = x + 8, ymar = y + 8;
			if(xmar2 == xmar + 8 && ymar2 == ymar + 8 && xmar2 < screen_wmar2 && ymar2 < screen_hmar2) {
				Uint8 *dst = &screen_layers[xmar + ymar * screen_wmar2];
				const Uint8 *sch1 = &ram[rA + qfy];
				if(opaque)
					for(row = 0; row < 8; row++, dst += screen_wmar2, sch1 += fy)
						PUT_PIXELS(n, 1, 0, *sch1, 0)
				else
					for(row = 0; row < 8; row++, dst += screen_wmar2, sch1 += fy)
						PUT_PIXELS(n, 0, 0, *sch1, 0)
			}
		}
	}
	if(!screen_reqdraw) {
		int x1, x2, y1, y2;
		if(fx < 0)
			x1 = x, x2 = rX;
		else
			x1 = rX, x2 = x;
		if(fy < 0)
			y1 = y, y2 = rY;
		else
			y1 = rY, y2 = y;
		screen_change(x1 - 8, y1 - 8, x2 + 8, y2 + 8);
	}
	if(rMX) rX += rDX * fx;
	if(rMY) rY += rDY * fy;
}

/*
@|Audio ------------------------------------------------------------- */

#define SAMPLE_FREQUENCY 44100
#define POLYPHONY 4
#define NOTE_PERIOD (SAMPLE_FREQUENCY * 0x4000 / 11025)
#define ADSR_STEP (SAMPLE_FREQUENCY / 0xf)

static SDL_AudioDeviceID audio_id;

Uint8 audio_get_vu(int instance);
Uint16 audio_get_position(int instance);

typedef struct {
	Uint8 *addr;
	Uint32 count, advance, period, age, a, d, s, r;
	Uint16 i, len;
	Sint8 volume[2];
	Uint8 pitch, repeat;
} UxnAudio;

/* clang-format off */

static Uint32 advances[12] = {
	0x80000, 0x879c8, 0x8facd, 0x9837f, 0xa1451, 0xaadc1,
	0xb504f, 0xbfc88, 0xcb2ff, 0xd7450, 0xe411f, 0xf1a1c
};

static UxnAudio uxn_audio[POLYPHONY];

/* clang-format on */

static Uint32 audio0_event;
int audio_render(int instance, Sint16 *sample, Sint16 *end);

static void
audio_callback(void *u, Uint8 *stream, int len)
{
	int instance, running = 0;
	Sint16 *samples = (Sint16 *)stream;
	USED(u);
	SDL_memset(stream, 0, len);
	for(instance = 0; instance < POLYPHONY; instance++)
		running += audio_render(instance, samples, samples + len / 2);
	if(!running)
		SDL_PauseAudioDevice(audio_id, 1);
}

static void
audio_finished_handler(int instance)
{
	SDL_Event event;
	event.type = audio0_event + instance;
	SDL_PushEvent(&event);
}

static Sint32
envelope(UxnAudio *c, Uint32 age)
{
	if(!c->r) return 0x0888;
	if(age < c->a) return 0x0888 * age / c->a;
	if(age < c->d) return 0x0444 * (2 * c->d - c->a - age) / (c->d - c->a);
	if(age < c->s) return 0x0444;
	if(age < c->r) return 0x0444 * (c->r - age) / (c->r - c->s);
	c->advance = 0;
	return 0x0000;
}

int
audio_render(int instance, Sint16 *sample, Sint16 *end)
{
	UxnAudio *c = &uxn_audio[instance];
	Sint32 s;
	if(!c->advance || !c->period) return 0;
	while(sample < end) {
		c->count += c->advance;
		c->i += c->count / c->period;
		c->count %= c->period;
		if(c->i >= c->len) {
			if(!c->repeat) {
				c->advance = 0;
				break;
			}
			c->i %= c->len;
		}
		s = (Sint8)(c->addr[c->i] + 0x80) * envelope(c, c->age++);
		*sample++ += s * c->volume[0] / 0x180;
		*sample++ += s * c->volume[1] / 0x180;
	}
	if(!c->advance) audio_finished_handler(instance);
	return 1;
}

static void
audio_start(int instance, Uint8 *d)
{
	UxnAudio *c = &uxn_audio[instance];
	Uint8 pitch = d[0xf] & 0x7f;
	Uint16 addr = PEEK2(d + 0xc);
	Uint16 adsr = PEEK2(d + 0x8);
	c->len = PEEK2(d + 0xa);
	if(c->len > 0x10000 - addr)
		c->len = 0x10000 - addr;
	c->addr = &ram[addr];
	c->volume[0] = d[0xe] >> 4;
	c->volume[1] = d[0xe] & 0xf;
	c->repeat = !(d[0xf] & 0x80);
	if(pitch < 108 && c->len)
		c->advance = advances[pitch % 12] >> (8 - pitch / 12);
	else {
		c->advance = 0;
		return;
	}
	c->a = ADSR_STEP * (adsr >> 12);
	c->d = ADSR_STEP * (adsr >> 8 & 0xf) + c->a;
	c->s = ADSR_STEP * (adsr >> 4 & 0xf) + c->d;
	c->r = ADSR_STEP * (adsr >> 0 & 0xf) + c->s;
	c->age = 0;
	c->i = 0;
	if(c->len <= 0x100) /* single cycle mode */
		c->period = NOTE_PERIOD * 337 / 2 / c->len;
	else /* sample repeat mode */
		c->period = NOTE_PERIOD;
}

static void
audio_play(int instance, Uint8 *d)
{
	SDL_LockAudioDevice(audio_id);
	audio_start(instance, d);
	SDL_UnlockAudioDevice(audio_id);
	SDL_PauseAudioDevice(audio_id, 0);
}

Uint8
audio_get_vu(int instance)
{
	int i;
	UxnAudio *c = &uxn_audio[instance];
	Sint32 sum[2] = {0, 0};
	if(!c->advance || !c->period) return 0;
	for(i = 0; i < 2; i++) {
		if(!c->volume[i]) continue;
		sum[i] = 1 + envelope(c, c->age) * c->volume[i] / 0x800;
		if(sum[i] > 0xf) sum[i] = 0xf;
	}
	return (sum[0] << 4) | sum[1];
}

Uint16
audio_get_position(int instance)
{
	return uxn_audio[instance].i;
}

/*
@|Controller -------------------------------------------------------- */

static unsigned int controller_vector;

static void
controller_down(Uint8 mask)
{
	if(mask) {
		dev[0x82] |= mask;
		if(controller_vector) uxn_eval(controller_vector);
	}
}

static void
controller_up(Uint8 mask)
{
	if(mask) {
		dev[0x82] &= (~mask);
		if(controller_vector) uxn_eval(controller_vector);
	}
}

static void
controller_key(Uint8 key)
{
	if(key) {
		dev[0x83] = key;
		if(controller_vector) uxn_eval(controller_vector);
		dev[0x83] = 0;
	}
}

/*
@|Mouse ------------------------------------------------------------- */

static unsigned int mouse_vector;

static void
mouse_down(Uint8 mask)
{
	dev[0x96] |= mask;
	if(mouse_vector) uxn_eval(mouse_vector);
}

static void
mouse_up(Uint8 mask)
{
	dev[0x96] &= (~mask);
	if(mouse_vector) uxn_eval(mouse_vector);
}

static void
mouse_pos(Uint16 x, Uint16 y)
{
	dev[0x92] = x >> 8, dev[0x93] = x;
	dev[0x94] = y >> 8, dev[0x95] = y;
	if(mouse_vector) uxn_eval(mouse_vector);
}

static void
mouse_scroll(Uint16 x, Uint16 y)
{
	dev[0x9a] = x >> 8, dev[0x9b] = x;
	dev[0x9c] = -y >> 8, dev[0x9d] = -y;
	if(mouse_vector) uxn_eval(mouse_vector);
	dev[0x9a] = 0, dev[0x9b] = 0;
	dev[0x9c] = 0, dev[0x9d] = 0;
}

/*
@|File -------------------------------------------------------------- */

#include <string.h>
#include <unistd.h>
#include <dirent.h>
#include <sys/stat.h>

typedef struct {
	FILE *f;
	DIR *dir;
	char *filepath;
	enum { IDLE,
		FILE_READ,
		FILE_WRITE,
		DIR_READ,
		DIR_WRITE
	} state;
} UxnFile;

static UxnFile ufs[2];
static Uint8 dirbuf[0x10000], *_dirbuf = dirbuf;
static unsigned int rL1, rL2;

static void
make_pathfile(char *pathbuf, const char *filepath, const char *basename)
{
	char c = '/';
	while(*filepath)
		c = *filepath++, *pathbuf = c, pathbuf++;
	if(c != '/')
		*pathbuf = '/', pathbuf++;
	while(*basename)
		*pathbuf = *basename++, pathbuf++;
	*pathbuf = 0;
}

static unsigned int
put_fill(Uint8 *dest, unsigned int len, char c)
{
	unsigned int i;
	for(i = 0; i < len; i++)
		*dest = c, dest++;
	return len;
}

static unsigned int
put_size(Uint8 *dest, unsigned int len, unsigned int size)
{
	unsigned int i;
	for(i = 0, dest += len; i < len; i++, size >>= 4)
		*(--dest) = "0123456789abcdef"[(Uint8)(size & 0xf)];
	return len;
}

static unsigned int
put_text(Uint8 *dest, const char *text)
{
	Uint8 *anchor = dest;
	while(*text)
		*dest = *text++, dest++;
	*dest = 0;
	return dest - anchor;
}

static unsigned int
put_stat(Uint8 *dest, unsigned int len, unsigned int size, unsigned int err, unsigned int dir, unsigned int capsize)
{
	if(err) return put_fill(dest, len, '!');
	if(dir) return put_fill(dest, len, '-');
	if(capsize && size >= 0x10000) return put_fill(dest, len, '?');
	return put_size(dest, len, size);
}

static unsigned int
put_statfile(Uint8 *dest, const char *filepath, const char *basename)
{
	unsigned int err, dir;
	struct stat st;
	Uint8 *anchor = dest;
	char pathbuf[0x2000];
	make_pathfile(pathbuf, filepath, basename);
	err = stat(pathbuf, &st);
	dir = S_ISDIR(st.st_mode);
	dest += put_stat(dest, 4, st.st_size, err, dir, 1);
	dest += put_text(dest, " ");
	dest += put_text(dest, basename);
	dest += put_text(dest, dir ? "/\n" : "\n");
	return dest - anchor;
}

static unsigned int
put_fdir(Uint8 *dest, unsigned int len, const char *filepath, DIR *dir)
{
	unsigned int i;
	struct dirent *de = readdir(dir);
	for(_dirbuf = dirbuf; de != NULL; de = readdir(dir)) {
		const char *name = de->d_name;
		if(name[0] == '.' && (name[1] == '.' || name[1] == '\0'))
			continue;
		else
			_dirbuf += put_statfile(_dirbuf, filepath, name);
	}
	for(i = 0; i < len && dirbuf[i]; i++)
		dest[i] = dirbuf[i];
	dest[i] = 0;
	return i;
}

static unsigned int
is_dir_path(char *p)
{
	char c;
	unsigned int saw_slash = 0;
	while((c = *p++)) saw_slash = c == '/';
	return saw_slash;
}

static unsigned int
is_dir_real(char *p)
{
	struct stat st;
	return stat(p, &st) == 0 && S_ISDIR(st.st_mode);
}

static unsigned int
file_write_dir(char *p)
{
	unsigned int ok = 1;
	char c, *s = p;
	for(; ok && (c = *p); p++) {
		if(c == '/') {
			*p = '\0';
			ok = is_dir_real(s) || (mkdir(s, 0755) == 0);
			*p = c;
		}
	}
	return ok;
}

static void
file_reset(unsigned int id)
{
	if(ufs[id].f != NULL) fclose(ufs[id].f), ufs[id].f = NULL;
	if(ufs[id].dir != NULL) closedir(ufs[id].dir), ufs[id].dir = NULL;
	ufs[id].state = IDLE;
}

static unsigned int
file_init(unsigned int id, Uint16 addr)
{
	file_reset(id);
	ufs[id].filepath = (char *)&ram[addr];
	return 0;
}

static unsigned int
file_not_ready(unsigned int id)
{
	if(ufs[id].filepath == 0) {
		fprintf(stderr, "File %d is uninitialized\n", id);
		return 1;
	} else
		return 0;
}

static unsigned int
file_read(unsigned int id, Uint16 addr, unsigned int len)
{
	void *dest = &ram[addr];
	if(file_not_ready(id))
		return 0;
	if(addr + len > 0x10000)
		len = 0x10000 - addr;
	if(ufs[id].state != FILE_READ && ufs[id].state != DIR_READ) {
		file_reset(id);
		if((ufs[id].dir = opendir(ufs[id].filepath)) != NULL)
			ufs[id].state = DIR_READ;
		else if((ufs[id].f = fopen(ufs[id].filepath, "rb")) != NULL)
			ufs[id].state = FILE_READ;
	}
	if(ufs[id].state == FILE_READ)
		return fread(dest, 1, len, ufs[id].f);
	if(ufs[id].state == DIR_READ)
		return put_fdir(dest, len, ufs[id].filepath, ufs[id].dir);
	return 0;
}

static unsigned int
file_write(unsigned int id, Uint16 addr, unsigned int len, Uint8 flags)
{
	unsigned int ret = 0;
	if(file_not_ready(id))
		return 0;
	if(addr + len > 0x10000)
		len = 0x10000 - addr;
	file_write_dir(ufs[id].filepath);
	if(ufs[id].state != FILE_WRITE && ufs[id].state != DIR_WRITE) {
		file_reset(id);
		if(is_dir_path(ufs[id].filepath))
			ufs[id].state = DIR_WRITE;
		else if((ufs[id].f = fopen(ufs[id].filepath, (flags & 0x01) ? "ab" : "wb")) != NULL)
			ufs[id].state = FILE_WRITE;
	}
	if(ufs[id].state == FILE_WRITE)
		if((ret = fwrite(&ram[addr], 1, len, ufs[id].f)) > 0 && fflush(ufs[id].f) != 0)
			ret = 0;
	if(ufs[id].state == DIR_WRITE)
		ret = is_dir_real(ufs[id].filepath);
	return ret;
}

static unsigned int
file_stat(unsigned int id, Uint16 addr, unsigned int len)
{
	unsigned int err, dir;
	struct stat st;
	if(file_not_ready(id))
		return 0;
	if(addr + len > 0x10000)
		len = 0x10000 - addr;
	err = stat(ufs[id].filepath, &st);
	dir = S_ISDIR(st.st_mode);
	return put_stat(&ram[addr], len, st.st_size, err, dir, 0);
}

static unsigned int
file_delete(unsigned int id)
{
	if(file_not_ready(id))
		return 0;
	return !unlink(ufs[id].filepath);
}

static void
file_success(unsigned int port, unsigned int value)
{
	dev[port] = value >> 8, dev[port + 1] = value;
}

/*
@|Datetime ---------------------------------------------------------- */

#include <time.h>

time_t datetime_seconds;
struct tm *datetime_t, datetime_zt = {0};

void
datetime_update(void)
{
	datetime_seconds = time(NULL);
	datetime_t = localtime(&datetime_seconds);
	if(datetime_t == NULL)
		datetime_t = &datetime_zt;
}

/*
@|Core -------------------------------------------------------------- */

static int fullscreen, borderless;
static SDL_Window *emu_window;
static SDL_Texture *emu_texture;
static SDL_Renderer *emu_renderer;
static SDL_Rect emu_viewport;
static SDL_Thread *stdin_thread;
static Uint32 stdin_event;

Uint8
emu_dei(const Uint8 port)
{
	switch(port) {
	/* System */
	case 0x04: return ptr[0];
	case 0x05: return ptr[1];
	/* Screen */
	case 0x22: return screen_width >> 8;
	case 0x23: return screen_width;
	case 0x24: return screen_height >> 8;
	case 0x25: return screen_height;
	case 0x28: return rX >> 8;
	case 0x29: return rX;
	case 0x2a: return rY >> 8;
	case 0x2b: return rY;
	case 0x2c: return rA >> 8;
	case 0x2d: return rA;
	/* Audio */
	case 0x34: return audio_get_vu(0);
	case 0x44: return audio_get_vu(1);
	case 0x54: return audio_get_vu(2);
	case 0x64: return audio_get_vu(3);
	/* DateTime */
	case 0xc0: datetime_update(); return (datetime_t->tm_year + 1900) >> 8;
	case 0xc1: datetime_update(); return (datetime_t->tm_year + 1900);
	case 0xc2: datetime_update(); return datetime_t->tm_mon;
	case 0xc3: datetime_update(); return datetime_t->tm_mday;
	case 0xc4: datetime_update(); return datetime_t->tm_hour;
	case 0xc5: datetime_update(); return datetime_t->tm_min;
	case 0xc6: datetime_update(); return datetime_t->tm_sec;
	case 0xc7: datetime_update(); return datetime_t->tm_wday;
	case 0xc8: datetime_update(); return datetime_t->tm_yday >> 8;
	case 0xc9: datetime_update(); return datetime_t->tm_yday;
	case 0xca: datetime_update(); return datetime_t->tm_isdst;
	}
	return dev[port];
}

void
emu_deo(Uint8 addr, Uint8 value)
{
	dev[addr] = value;
	switch(addr) {
	/* System */
	case 0x03: system_expansion(PEEK2(dev + 2)); return;
	case 0x04: ptr[0] = dev[4]; return;
	case 0x05: ptr[1] = dev[5]; return;
	case 0x08:
	case 0x09:
	case 0x0a:
	case 0x0b:
	case 0x0c:
	case 0x0d: screen_colorize(); return;
	case 0x0e: system_print("WST", 0), system_print("RST", 1); return;
	/* Console */
	case 0x11: console_vector = PEEK2(&dev[0x10]); return;
	case 0x18: fputc(dev[0x18], stdout), fflush(stdout); return;
	case 0x19: fputc(dev[0x19], stderr), fflush(stderr); return;
	case 0x1a: fprintf(stderr, "%02x", dev[0x1a]); return;
	case 0x1b: fprintf(stderr, "%02x", dev[0x1b]); return;
	/* Screen */
	case 0x21: screen_vector = PEEK2(&dev[0x20]); return;
	case 0x23: screen_resize(PEEK2(&dev[0x22]) & 0xfff, screen_height & 0xfff); return;
	case 0x25: screen_resize(screen_width & 0xfff, PEEK2(&dev[0x24]) & 0xfff); return;
	case 0x26: rMX = dev[0x26] & 0x1, rMY = dev[0x26] & 0x2, rMA = dev[0x26] & 0x4, rML = dev[0x26] >> 4, rDX = rMX << 3, rDY = rMY << 2; return;
	case 0x28:
	case 0x29: rX = (dev[0x28] << 8) | dev[0x29], rX = TWOS(rX); return;
	case 0x2a:
	case 0x2b: rY = (dev[0x2a] << 8) | dev[0x2b], rY = TWOS(rY); return;
	case 0x2c:
	case 0x2d: rA = (dev[0x2c] << 8) | dev[0x2d]; return;
	case 0x2e: screen_draw_pixel(); return;
	case 0x2f: screen_draw_sprite(); return;
	/* Audio */
	case 0x3f: audio_play(0, &dev[addr & 0xf0]); return;
	case 0x4f: audio_play(1, &dev[addr & 0xf0]); return;
	case 0x5f: audio_play(2, &dev[addr & 0xf0]); return;
	case 0x6f: audio_play(3, &dev[addr & 0xf0]); return;
	/* Controller */
	case 0x81: controller_vector = PEEK2(&dev[0x80]); return;
	/* Mouse */
	case 0x91: mouse_vector = PEEK2(&dev[0x90]); return;
	/* File 1 */
	case 0xab: rL1 = PEEK2(&dev[0xaa]); break;
	case 0xa5: file_success(0xa2, file_stat(0, PEEK2(&dev[0xa4]), rL1)); break;
	case 0xa6: file_success(0xa2, file_delete(0)); break;
	case 0xa9: file_success(0xa2, file_init(0, PEEK2(&dev[0xa8]))); break;
	case 0xad: file_success(0xa2, file_read(0, PEEK2(&dev[0xac]), rL1)); break;
	case 0xaf: file_success(0xa2, file_write(0, PEEK2(&dev[0xae]), rL1, dev[0xa7])); break;
	/* File 2 */
	case 0xbb: rL2 = PEEK2(&dev[0xba]); break;
	case 0xb5: file_success(0xb2, file_stat(1, PEEK2(&dev[0xb4]), rL2)); break;
	case 0xb6: file_success(0xb2, file_delete(1)); break;
	case 0xb9: file_success(0xb2, file_init(1, PEEK2(&dev[0xb8]))); break;
	case 0xbd: file_success(0xb2, file_read(1, PEEK2(&dev[0xbc]), rL2)); break;
	case 0xbf: file_success(0xb2, file_write(1, PEEK2(&dev[0xbe]), rL2, dev[0xb7])); break;
	}
}

void
emu_resize(void)
{
	if(emu_texture != NULL)
		SDL_DestroyTexture(emu_texture);
	SDL_RenderSetLogicalSize(emu_renderer, screen_width, screen_height);
	emu_texture = SDL_CreateTexture(emu_renderer, SDL_PIXELFORMAT_RGB888, SDL_TEXTUREACCESS_STATIC, screen_width, screen_height);
	if(emu_texture == NULL || SDL_SetTextureBlendMode(emu_texture, SDL_BLENDMODE_NONE))
		fprintf(stderr, "SDL_SetTextureBlendMode: %s\n", SDL_GetError());
	if(SDL_UpdateTexture(emu_texture, NULL, screen_pixels, sizeof(Uint32)) != 0)
		fprintf(stderr, "SDL_UpdateTexture: %s\n", SDL_GetError());
	emu_viewport.x = 0;
	emu_viewport.y = 0;
	emu_viewport.w = screen_width;
	emu_viewport.h = screen_height;
	SDL_SetWindowSize(emu_window, screen_width * emu_zoom, screen_height * emu_zoom);
	screen_resize(screen_width, screen_height);
}

void
emu_redraw(void)
{
	if(SDL_UpdateTexture(emu_texture, NULL, screen_pixels, screen_width * sizeof(Uint32)) != 0)
		fprintf(stderr, "SDL_UpdateTexture: %s\n", SDL_GetError());
	SDL_RenderClear(emu_renderer);
	SDL_RenderCopy(emu_renderer, emu_texture, NULL, &emu_viewport);
	SDL_RenderPresent(emu_renderer);
}

static void
emu_restart(unsigned int soft)
{
	screen_resize(WIDTH, HEIGHT);
	system_reboot(soft);
	uxn_eval(0x100);
}

static int
stdin_handler(void *p)
{
	SDL_Event event;
	USED(p);
	event.type = stdin_event;
	event.cbutton.state = CONSOLE_STD;
	while(read(0, &event.cbutton.button, 1) > 0) {
		while(SDL_PushEvent(&event) < 0)
			SDL_Delay(25); /* slow down - the queue is most likely full */
	}
	/* EOF */
	event.cbutton.button = 0x00;
	event.cbutton.state = CONSOLE_END;
	while(SDL_PushEvent(&event) < 0)
		SDL_Delay(25);
	return 0;
}

static void
set_fullscreen(int value, int win)
{
	Uint32 flags = 0;
	fullscreen = value;
	if(fullscreen)
		flags = SDL_WINDOW_FULLSCREEN_DESKTOP;
	if(win)
		SDL_SetWindowFullscreen(emu_window, flags);
}

static void
set_borderless(int value)
{
	if(fullscreen) return;
	borderless = value;
	SDL_SetWindowBordered(emu_window, !value);
}

static Uint8
get_button(SDL_Event *event)
{
	switch(event->key.keysym.sym) {
	case SDLK_LCTRL: return 0x01;
	case SDLK_LALT: return 0x02;
	case SDLK_LSHIFT: return 0x04;
	case SDLK_HOME: return 0x08;
	case SDLK_UP: return 0x10;
	case SDLK_DOWN: return 0x20;
	case SDLK_LEFT: return 0x40;
	case SDLK_RIGHT: return 0x80;
	}
	return 0x00;
}

static Uint8
get_button_joystick(SDL_Event *event)
{
	return 0x01 << (event->jbutton.button & 0x3);
}

static Uint8
get_vector_joystick(SDL_Event *event)
{
	if(event->jaxis.value < -3200)
		return 1;
	if(event->jaxis.value > 3200)
		return 2;
	return 0;
}

static Uint8
get_key(SDL_Event *event)
{
	int sym = event->key.keysym.sym;
	SDL_Keymod mods = SDL_GetModState();
	if(sym < 0x20 || sym == SDLK_DELETE)
		return sym;
	if(mods & KMOD_CTRL) {
		if(sym < SDLK_a)
			return sym;
		else if(sym <= SDLK_z)
			return sym - (mods & KMOD_SHIFT) * 0x20;
	}
	return 0x00;
}

static int
emu_event(void)
{
	SDL_Event event;
	while(SDL_PollEvent(&event)) {
		/* Window */
		if(event.type == SDL_QUIT || dev[0x0f])
			return 0;
		else if(event.type == SDL_WINDOWEVENT && event.window.event == SDL_WINDOWEVENT_EXPOSED)
			screen_reqdraw = 1;
		/* Console */
		else if(event.type == stdin_event)
			console_input(event.cbutton.button, event.cbutton.state);
		/* Mouse */
		else if(event.type == SDL_MOUSEMOTION)
			mouse_pos(event.motion.x, event.motion.y);
		else if(event.type == SDL_MOUSEBUTTONUP)
			mouse_up(SDL_BUTTON(event.button.button));
		else if(event.type == SDL_MOUSEBUTTONDOWN)
			mouse_down(SDL_BUTTON(event.button.button));
		else if(event.type == SDL_MOUSEWHEEL)
			mouse_scroll(event.wheel.x, event.wheel.y);
		/* Audio */
		else if(event.type >= audio0_event && event.type < audio0_event + POLYPHONY) {
			Uint8 *port_value = &dev[0x30 + 0x10 * (event.type - audio0_event)];
			uxn_eval(port_value[0] << 8 | port_value[1]);
		}
		/* Controller */
		else if(event.type == SDL_TEXTINPUT) {
			char *c;
			for(c = event.text.text; *c; c++)
				controller_key(*c);
		} else if(event.type == SDL_KEYDOWN) {
			int ksym;
			if(get_key(&event))
				controller_key(get_key(&event));
			else if(get_button(&event))
				controller_down(get_button(&event));
			else if(event.key.keysym.sym == SDLK_F1)
				emu_zoom = (emu_zoom % 3) + 1, screen_reqsize = screen_reqdraw = 1;
			else if(event.key.keysym.sym == SDLK_F2)
				emu_deo(0xe, 0x1);
			else if(event.key.keysym.sym == SDLK_F3)
				dev[0x0f] = 0xff;
			else if(event.key.keysym.sym == SDLK_F4)
				emu_restart(0);
			else if(event.key.keysym.sym == SDLK_F5)
				emu_restart(1);
			else if(event.key.keysym.sym == SDLK_F11)
				set_fullscreen(!fullscreen, 1);
			else if(event.key.keysym.sym == SDLK_F12)
				set_borderless(!borderless);
			ksym = event.key.keysym.sym;
			if(SDL_PeepEvents(&event, 1, SDL_PEEKEVENT, SDL_KEYUP, SDL_KEYUP) == 1 && ksym == event.key.keysym.sym)
				return 1;
		} else if(event.type == SDL_KEYUP)
			controller_up(get_button(&event));
		else if(event.type == SDL_JOYAXISMOTION) {
			Uint8 vec = get_vector_joystick(&event);
			if(!vec)
				controller_up((3 << (!event.jaxis.axis * 2)) << 4);
			else
				controller_down((1 << ((vec + !event.jaxis.axis * 2) - 1)) << 4);
		} else if(event.type == SDL_JOYBUTTONDOWN)
			controller_down(get_button_joystick(&event));
		else if(event.type == SDL_JOYBUTTONUP)
			controller_up(get_button_joystick(&event));
		else if(event.type == SDL_JOYHATMOTION) {
			switch(event.jhat.value) {
			case SDL_HAT_UP: controller_down(0x10); break;
			case SDL_HAT_DOWN: controller_down(0x20); break;
			case SDL_HAT_LEFT: controller_down(0x40); break;
			case SDL_HAT_RIGHT: controller_down(0x80); break;
			case SDL_HAT_LEFTDOWN: controller_down(0x40 | 0x20); break;
			case SDL_HAT_LEFTUP: controller_down(0x40 | 0x10); break;
			case SDL_HAT_RIGHTDOWN: controller_down(0x80 | 0x20); break;
			case SDL_HAT_RIGHTUP: controller_down(0x80 | 0x10); break;
			case SDL_HAT_CENTERED: controller_up(0x10 | 0x20 | 0x40 | 0x80); break;
			}
		}
	}
	return 1;
}

static void
emu_init_audio(void)
{
	SDL_AudioSpec as;
	SDL_zero(as);
	as.freq = SAMPLE_FREQUENCY;
	as.format = AUDIO_S16SYS;
	as.channels = 2;
	as.callback = audio_callback;
	as.samples = 512;
	as.userdata = NULL;
	audio_id = SDL_OpenAudioDevice(NULL, 0, &as, NULL, 0);
	if(!audio_id)
		fprintf(stderr, "sdl_audio: %s\n", SDL_GetError());
	audio0_event = SDL_RegisterEvents(POLYPHONY);
	SDL_PauseAudioDevice(audio_id, 1);
}

static int
emu_init(void)
{
	if(SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO | SDL_INIT_JOYSTICK) < 0)
		return !fprintf(stderr, "sdl: %s\n", SDL_GetError());
	emu_init_audio();
	if(SDL_NumJoysticks() > 0 && SDL_JoystickOpen(0) == NULL)
		fprintf(stderr, "sdl_joystick: %s\n", SDL_GetError());
	stdin_event = SDL_RegisterEvents(1);
	SDL_DetachThread(stdin_thread = SDL_CreateThread(stdin_handler, "stdin", NULL));
	SDL_StartTextInput();
	SDL_ShowCursor(SDL_DISABLE);
	SDL_EventState(SDL_DROPFILE, SDL_ENABLE);
	SDL_SetRenderDrawColor(emu_renderer, 0x00, 0x00, 0x00, 0xff);
	/* Window */
	Uint32 window_flags = SDL_WINDOW_SHOWN | SDL_WINDOW_ALLOW_HIGHDPI;
	if(fullscreen)
		window_flags = window_flags | SDL_WINDOW_FULLSCREEN_DESKTOP;
	emu_window = SDL_CreateWindow("Uxn2",
		SDL_WINDOWPOS_UNDEFINED,
		SDL_WINDOWPOS_UNDEFINED,
		screen_width * emu_zoom,
		screen_height * emu_zoom,
		window_flags);
	if(emu_window == NULL)
		return !fprintf(stderr, "sdl_window: %s\n", SDL_GetError());
	emu_renderer = SDL_CreateRenderer(emu_window, -1, SDL_RENDERER_ACCELERATED);
	if(emu_renderer == NULL)
		return fprintf(stderr, "sdl_renderer: %s\n", SDL_GetError());
	return 1;
}

static void
emu_run(void)
{
	Uint64 next_refresh = 0;
	Uint64 perf_freq = SDL_GetPerformanceFrequency();
	Uint64 frame_interval = perf_freq / 60;
	Uint64 ms_interval = perf_freq / 1000;
	/* game loop */
	for(;;) {
		Uint64 now = SDL_GetPerformanceCounter();
		if(!emu_event())
			return;
		if(now >= next_refresh) {
			next_refresh = now + frame_interval;
			screen_update();
		}
		if(screen_vector) {
			now = SDL_GetPerformanceCounter();
			if(now < next_refresh) {
				Uint64 delay_ms = (next_refresh - now) / ms_interval;
				if(delay_ms > 0) SDL_Delay(delay_ms);
			}
		} else
			SDL_WaitEvent(NULL);
	}
	/* end */
	SDL_CloseAudioDevice(audio_id);
#ifdef _WIN32
#pragma GCC diagnostic ignored "-Wint-to-pointer-cast"
	TerminateThread((HANDLE)SDL_GetThreadID(stdin_thread), 0);
#elif !defined(__APPLE__)
	close(0); /* make stdin thread exit */
#endif
	SDL_Quit();
}

int
main(int argc, char **argv)
{
	int i = 1;
	if(argc == 2 && argv[1][0] == '-' && argv[1][1] == 'v')
		return !fprintf(stdout, "%s - Varvara Emulator, 2 Jan 2026.\n", argv[0]);
	else if(argc == 1)
		return !fprintf(stdout, "usage: %s [-v] file.rom [args..]\n", argv[0]);
	else if(!system_boot(argv[i++], argc > 2))
		return !fprintf(stdout, "Could not load %s.\n", argv[i - 1]);
	screen_resize(WIDTH, HEIGHT);
	if(uxn_eval(0x100) && console_vector) {
		for(; i < argc; i++) {
			char *p = argv[i];
			while(*p)
				console_input(*p++, CONSOLE_ARG);
			console_input('\n', i == argc - 1 ? CONSOLE_END : CONSOLE_EOA);
		}
	}
	if(!dev[0x0f]) {
		if(!emu_init())
			return !fprintf(stdout, "Could not initialize %s.\n", argv[0]);
		emu_run();
	}
	return dev[0x0f] & 0x7f;
}
