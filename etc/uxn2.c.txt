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
	fprintf(stderr, "%s ", name);
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
		unsigned short a = addr;
		if(bank < BANKS_CAP)
			for(limit = a + length; a != limit; a++)
				ram[bank + a] = dst_value;
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

#define MAR(x) (x + 0x8)
#define MAR2(x) (x + 0x10)
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
	int i, shift, colors[4];
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
		screen_width = width, screen_wmar2 = MAR2(width);
		screen_height = height, screen_hmar2 = MAR2(height);
		length = screen_wmar2 * screen_hmar2;
		screen_layers = realloc(screen_layers, length);
		memset(screen_layers, 0, length);
		screen_reqsize = screen_reqdraw = 1;
	}
}

static void
screen_redraw(void)
{
	int i, x, y, k, l;
	for(y = screen_y1; y < screen_y2; y++) {
		const int ys = y * screen_zoom;
		for(x = screen_x1, i = MAR(x) + MAR(y) * screen_wmar2; x < screen_x2; x++, i++) {
			const int c = screen_palette[screen_layers[i]];
			for(k = 0; k < screen_zoom; k++) {
				const int oo = ((ys + k) * screen_width + x) * screen_zoom;
				for(l = 0; l < screen_zoom; l++)
					screen_pixels[oo + l] = c;
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
	int layer_mask, color;
	const int ctrl = dev[0x2e];
	const int len = screen_wmar2;
	if(ctrl & 0x40)
		layer_mask = 0x3, color = (ctrl & 0x3) << 2;
	else
		layer_mask = 0xc, color = ctrl & 0x3;
	/* fill mode */
	if(ctrl & 0x80) {
		int x1, y1, x2, y2, ax, bx, ay, by, hor, ver;
		if(ctrl & 0x10)
			x1 = 0, x2 = rX;
		else
			x1 = rX, x2 = screen_width;
		if(ctrl & 0x20)
			y1 = 0, y2 = rY;
		else
			y1 = rY, y2 = screen_height;
		screen_reqdraw = 1;
		x1 = MAR(x1), y1 = MAR(y1);
		hor = MAR(x2) - x1, ver = MAR(y2) - y1;
		for(ay = y1 * len, by = ay + ver * len; ay < by; ay += len)
			for(ax = ay + x1, bx = ax + hor; ax < bx; ax++)
				screen_layers[ax] = (screen_layers[ax] & layer_mask) | color;
	}
	/* pixel mode */
	else {
		if(rX >= 0 && rY >= 0 && rX < len && rY < screen_height) {
			const int ax = MAR(rX) + MAR(rY) * len;
			screen_layers[ax] = (screen_layers[ax] & layer_mask) | color;
		}
		screen_reqdraw = 1;
		if(rMX) rX++;
		if(rMY) rY++;
	}
}

static void
screen_draw_sprite(void)
{
	const Uint8 *table;
	const int ctrl = dev[0x2f];
	const int blend = ctrl & 0xf;
	const int opaque = blend % 5;
	const int fx = ctrl & 0x10 ? -1 : 1, fy = ctrl & 0x20 ? -1 : 1;
	const int qfx = fx > 0 ? 7 : 0, qfy = fy < 0 ? 7 : 0;
	const int dxy = fy * rDX, dyx = fx * rDY;
	int i, x1, x2, y1, y2, ax, ay, bx, by, qx, qy, x = rX, y = rY, layer_mask;
	if(ctrl & 0x40)
		layer_mask = 0x3, table = blending[blend][1];
	else
		layer_mask = 0xc, table = blending[blend][0];
	if(ctrl & 0x80) {
		const int addr_incr = rMA << 2;
		for(i = 0; i <= rML; i++, x += dyx, y += dxy, rA += addr_incr) {
			const Uint16 ymar2 = MAR2(y), xmar2 = MAR2(x);
			if(xmar2 < screen_wmar2 && ymar2 < screen_hmar2) {
				const Uint16 xmar = MAR(x), ymar = MAR(y);
				const Uint8 *sprite = &ram[rA];
				for(ay = ymar * screen_wmar2, by = ymar2 * screen_wmar2, qy = qfy; ay < by; ay += screen_wmar2, qy += fy) {
					const int ch1 = sprite[qy];
					const int ch2 = sprite[qy + 8] << 1;
					for(ax = xmar + ay, bx = xmar2 + ay, qx = qfx; ax < bx; ax++, qx -= fx) {
						const int color = (ch1 >> qx & 1) | (ch2 >> qx & 2);
						if(opaque || color)
							screen_layers[ax] = (screen_layers[ax] & layer_mask) | table[color];
					}
				}
			}
		}
	} else {
		const int addr_incr = rMA << 1;
		for(i = 0; i <= rML; i++, x += dyx, y += dxy, rA += addr_incr) {
			const Uint16 ymar2 = MAR2(y), xmar2 = MAR2(x);
			if(xmar2 < screen_wmar2 && ymar2 < screen_hmar2) {
				const Uint16 xmar = MAR(x), ymar = MAR(y);
				const Uint8 *sprite = &ram[rA];
				for(ay = ymar * screen_wmar2, by = ymar2 * screen_wmar2, qy = qfy; ay < by; ay += screen_wmar2, qy += fy) {
					const int ch1 = sprite[qy];
					for(ax = xmar + ay, bx = xmar2 + ay, qx = qfx; ax < bx; ax++, qx -= fx) {
						const int color = ch1 >> qx & 1;
						if(opaque || color)
							screen_layers[ax] = (screen_layers[ax] & layer_mask) | table[color];
					}
				}
			}
		}
	}
	if(fx < 0)
		x1 = x, x2 = rX;
	else
		x1 = rX, x2 = x;
	if(fy < 0)
		y1 = y, y2 = rY;
	else
		y1 = rY, y2 = y;
	if(!screen_reqdraw) screen_change(x1 - 8, y1 - 8, x2 + 8, y2 + 8);
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

#define POLYFILEY 2
#define DEV_FILE0 0xa

#include <dirent.h>
#include <errno.h>
#include <limits.h>
#include <string.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <unistd.h>

#ifdef _WIN32
#include <direct.h>
#include <libiberty/libiberty.h>
#define realpath(s, dummy) lrealpath(s)
#define DIR_SEP_CHAR '\\'
#define DIR_SEP_STR "\\"
#define pathcmp(path1, path2, length) strncasecmp(path1, path2, length) /* strncasecmp provided by libiberty */
#define notdriveroot(file_name) (file_name[0] != DIR_SEP_CHAR && ((strlen(file_name) > 2 && file_name[1] != ':') || strlen(file_name) <= 2))
#define mkdir(file_name) (_mkdir(file_name) == 0)
#else
#define DIR_SEP_CHAR '/'
#define DIR_SEP_STR "/"
#define pathcmp(path1, path2, length) strncmp(path1, path2, length)
#define notdriveroot(file_name) (file_name[0] != DIR_SEP_CHAR)
#define mkdir(file_name) (mkdir(file_name, 0755) == 0)
#endif

#ifndef PATH_MAX
#define PATH_MAX 4096
#endif

typedef struct {
	FILE *f;
	DIR *dir;
	char current_filename[4096];
	struct dirent *de;
	enum { IDLE,
		FILE_READ,
		FILE_WRITE,
		DIR_READ,
		DIR_WRITE
	} state;
	int outside_sandbox;
} UxnFile;

static UxnFile uxn_file[POLYFILEY];

static void
reset(UxnFile *c)
{
	if(c->f != NULL) {
		fclose(c->f);
		c->f = NULL;
	}
	if(c->dir != NULL) {
		closedir(c->dir);
		c->dir = NULL;
	}
	c->de = NULL;
	c->state = IDLE;
	c->outside_sandbox = 0;
}

static Uint16
get_entry(char *p, Uint16 len, const char *pathname, const char *basename, int fail_nonzero)
{
	struct stat st;
	if(len < strlen(basename) + 8)
		return 0;
	if(stat(pathname, &st))
		return fail_nonzero ? snprintf(p, len, "!!!! %s\n", basename) : 0;
	else if(S_ISDIR(st.st_mode))
		return snprintf(p, len, "---- %s/\n", basename);
	else if(st.st_size < 0x10000)
		return snprintf(p, len, "%04x %s\n", (unsigned int)st.st_size, basename);
	else
		return snprintf(p, len, "???? %s\n", basename);
}

static Uint16
file_read_dir(UxnFile *c, char *dest, Uint16 len)
{
	static char pathname[4352];
	char *p = dest;
	if(c->de == NULL) c->de = readdir(c->dir);
	for(; c->de != NULL; c->de = readdir(c->dir)) {
		Uint16 n;
		if(c->de->d_name[0] == '.' && c->de->d_name[1] == '\0')
			continue;
		if(strcmp(c->de->d_name, "..") == 0) {
			/* hide "sandbox/.." */
			char cwd[PATH_MAX] = {'\0'}, *t;
			/* Note there's [currently] no way of chdir()ing from uxn, so $PWD
			 * is always the sandbox top level. */
			getcwd(cwd, sizeof(cwd));
			/* We already checked that c->current_filename exists so don't need a wrapper. */
			t = realpath(c->current_filename, NULL);
			if(strcmp(cwd, t) == 0) {
				free(t);
				continue;
			}
			free(t);
		}
		if(strlen(c->current_filename) + 1 + strlen(c->de->d_name) < sizeof(pathname))
			snprintf(pathname, sizeof(pathname), "%s/%s", c->current_filename, c->de->d_name);
		else
			pathname[0] = '\0';
		n = get_entry(p, len, pathname, c->de->d_name, 1);
		if(!n) break;
		p += n;
		len -= n;
	}
	return p - dest;
}

static char *
retry_realpath(const char *file_name)
{
	char *r, p[PATH_MAX] = {'\0'}, *x;
	int fnlen;
	if(file_name == NULL) {
		errno = EINVAL;
		return NULL;
	} else if((fnlen = strlen(file_name)) >= PATH_MAX) {
		errno = ENAMETOOLONG;
		return NULL;
	}
	if(notdriveroot(file_name)) {
		getcwd(p, sizeof(p));
		if(strlen(p) + strlen(DIR_SEP_STR) + fnlen >= PATH_MAX) {
			errno = ENAMETOOLONG;
			return NULL;
		}
		strcat(p, DIR_SEP_STR);
	}
	strcat(p, file_name);
	while((r = realpath(p, NULL)) == NULL) {
		if(errno != ENOENT)
			return NULL;
		x = strrchr(p, DIR_SEP_CHAR);
		if(x)
			*x = '\0';
		else
			return NULL;
	}
	return r;
}

static void
file_check_sandbox(UxnFile *c)
{
	char *x, *rp, cwd[PATH_MAX] = {'\0'};
	x = getcwd(cwd, sizeof(cwd));
	rp = retry_realpath(c->current_filename);
	if(rp == NULL || (x && pathcmp(cwd, rp, strlen(cwd)) != 0)) {
		c->outside_sandbox = 1;
		fprintf(stderr, "file warning: blocked attempt to access %s outside of sandbox\n", c->current_filename);
	}
	free(rp);
}

static Uint16
file_init(UxnFile *c, char *filename, size_t max_len, int override_sandbox)
{
	char *p = c->current_filename;
	size_t len = sizeof(c->current_filename);
	reset(c);
	if(len > max_len) len = max_len;
	while(len) {
		if((*p++ = *filename++) == '\0') {
			if(!override_sandbox) /* override sandbox for loading roms */
				file_check_sandbox(c);
			return 0;
		}
		len--;
	}
	c->current_filename[0] = '\0';
	return 0;
}

static Uint16
file_read(UxnFile *c, void *dest, int len)
{
	if(c->outside_sandbox) return 0;
	if(c->state != FILE_READ && c->state != DIR_READ) {
		reset(c);
		if((c->dir = opendir(c->current_filename)) != NULL)
			c->state = DIR_READ;
		else if((c->f = fopen(c->current_filename, "rb")) != NULL)
			c->state = FILE_READ;
	}
	if(c->state == FILE_READ)
		return fread(dest, 1, len, c->f);
	if(c->state == DIR_READ)
		return file_read_dir(c, dest, len);
	return 0;
}

static int
is_dir_path(char *p)
{
	char c;
	int saw_slash = 0;
	while((c = *p++))
		saw_slash = c == DIR_SEP_CHAR;
	return saw_slash;
}

static int
dir_exists(char *p)
{
	struct stat st;
	return stat(p, &st) == 0 && S_ISDIR(st.st_mode);
}

static int
ensure_parent_dirs(char *p)
{
	int ok = 1;
	char c, *s = p;
	for(; ok && (c = *p); p++) {
		if(c == DIR_SEP_CHAR) {
			*p = '\0';
			ok = dir_exists(s) || mkdir(s);
			*p = c;
		}
	}
	return ok;
}

static Uint16
file_write(UxnFile *c, void *src, Uint16 len, Uint8 flags)
{
	Uint16 ret = 0;
	if(c->outside_sandbox) return 0;
	ensure_parent_dirs(c->current_filename);
	if(c->state != FILE_WRITE && c->state != DIR_WRITE) {
		reset(c);
		if(is_dir_path(c->current_filename))
			c->state = DIR_WRITE;
		else if((c->f = fopen(c->current_filename, (flags & 0x01) ? "ab" : "wb")) != NULL)
			c->state = FILE_WRITE;
	}
	if(c->state == FILE_WRITE) {
		if((ret = fwrite(src, 1, len, c->f)) > 0 && fflush(c->f) != 0)
			ret = 0;
	}
	if(c->state == DIR_WRITE) {
		ret = dir_exists(c->current_filename);
	}
	return ret;
}

static Uint16
stat_fill(Uint8 *dest, Uint16 len, char c)
{
	Uint16 i;
	for(i = 0; i < len; i++)
		*(dest++) = c;
	return len;
}

static Uint16
stat_size(Uint8 *dest, Uint16 len, off_t size)
{
	Uint16 i;
	dest += len - 1;
	for(i = 0; i < len; i++) {
		char c = '0' + (Uint8)(size & 0xf);
		if(c > '9') c += 39;
		*(dest--) = c;
		size = size >> 4;
	}
	return size == 0 ? len : stat_fill(dest, len, '?');
}

static Uint16
file_stat(UxnFile *c, void *dest, Uint16 len)
{
	struct stat st;
	if(c->outside_sandbox)
		return 0;
	else if(stat(c->current_filename, &st))
		return stat_fill(dest, len, '!');
	else if(S_ISDIR(st.st_mode))
		return stat_fill(dest, len, '-');
	else
		return stat_size(dest, len, st.st_size);
}

static Uint16
file_delete(UxnFile *c)
{
	return c->outside_sandbox ? 0 : unlink(c->current_filename);
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
	Uint16 len, res;
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
	case 0x1a: fprintf(stderr, "%02x", dev[0x1a]); break;
	case 0x1b: fprintf(stderr, "%02x", dev[0x1b]); break;
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
	case 0x3f:
		SDL_LockAudioDevice(audio_id);
		audio_start(0, &dev[addr & 0xf0]);
		SDL_UnlockAudioDevice(audio_id);
		SDL_PauseAudioDevice(audio_id, 0);
		break;
	case 0x4f:
		SDL_LockAudioDevice(audio_id);
		audio_start(1, &dev[addr & 0xf0]);
		SDL_UnlockAudioDevice(audio_id);
		SDL_PauseAudioDevice(audio_id, 0);
		break;
	case 0x5f:
		SDL_LockAudioDevice(audio_id);
		audio_start(2, &dev[addr & 0xf0]);
		SDL_UnlockAudioDevice(audio_id);
		SDL_PauseAudioDevice(audio_id, 0);
		break;
	case 0x6f:
		SDL_LockAudioDevice(audio_id);
		audio_start(3, &dev[addr & 0xf0]);
		SDL_UnlockAudioDevice(audio_id);
		SDL_PauseAudioDevice(audio_id, 0);
		break;
	/* Controller */
	case 0x81: controller_vector = PEEK2(&dev[0x80]); return;
	/* Mouse */
	case 0x91: mouse_vector = PEEK2(&dev[0x90]); return;
	/* File 1 */
	case 0xa5:
		addr = PEEK2(&dev[0xa4]);
		len = PEEK2(&dev[0xaa]);
		if(len > 0x10000 - addr)
			len = 0x10000 - addr;
		res = file_stat(&uxn_file[0], &ram[addr], len);
		POKE2(&dev[0xa2], res);
		break;
	case 0xa6:
		res = file_delete(&uxn_file[0]);
		POKE2(&dev[0xa2], res);
		break;
	case 0xa9:
		addr = PEEK2(&dev[0xa8]);
		res = file_init(&uxn_file[0], (char *)&ram[addr], 0x10000 - addr, 0);
		POKE2(&dev[0xa2], res);
		break;
	case 0xad:
		addr = PEEK2(&dev[0xac]);
		len = PEEK2(&dev[0xaa]);
		if(len > 0x10000 - addr)
			len = 0x10000 - addr;
		res = file_read(&uxn_file[0], &ram[addr], len);
		POKE2(&dev[0xa2], res);
		break;
	case 0xaf:
		addr = PEEK2(&dev[0xae]);
		len = PEEK2(&dev[0xaa]);
		if(len > 0x10000 - addr)
			len = 0x10000 - addr;
		res = file_write(&uxn_file[0], &ram[addr], len, dev[0xa7]);
		POKE2(&dev[0xa2], res);
		break;
	/* File 2 */
	case 0xb5:
		addr = PEEK2(&dev[0xb4]);
		len = PEEK2(&dev[0xba]);
		if(len > 0x10000 - addr)
			len = 0x10000 - addr;
		res = file_stat(&uxn_file[1], &ram[addr], len);
		POKE2(&dev[0xb2], res);
		break;
	case 0xb6:
		res = file_delete(&uxn_file[1]);
		POKE2(&dev[0xb2], res);
		break;
	case 0xb9:
		addr = PEEK2(&dev[0xb8]);
		res = file_init(&uxn_file[1], (char *)&ram[addr], 0x10000 - addr, 0);
		POKE2(&dev[0xb2], res);
		break;
	case 0xbd:
		addr = PEEK2(&dev[0xbc]);
		len = PEEK2(&dev[0xba]);
		if(len > 0x10000 - addr)
			len = 0x10000 - addr;
		res = file_read(&uxn_file[1], &ram[addr], len);
		POKE2(&dev[0xb2], res);
		break;
	case 0xbf:
		addr = PEEK2(&dev[0xbe]);
		len = PEEK2(&dev[0xba]);
		if(len > 0x10000 - addr)
			len = 0x10000 - addr;
		res = file_write(&uxn_file[1], &ram[addr], len, dev[0xb7]);
		POKE2(&dev[0xb2], res);
		break;
	}
}

static int fullscreen, borderless;
static SDL_Window *emu_window;
static SDL_Texture *emu_texture;
static SDL_Renderer *emu_renderer;
static SDL_Rect emu_viewport;
static SDL_Thread *stdin_thread;
static Uint32 stdin_event;

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
set_window_size(SDL_Window *window, int w, int h)
{
	SDL_Point win_old;
	SDL_GetWindowSize(window, &win_old.x, &win_old.y);
	if(w == win_old.x && h == win_old.y) return;
	SDL_RenderClear(emu_renderer);
	SDL_SetWindowSize(window, w, h);
	screen_resize(screen_width, screen_height);
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
	set_window_size(emu_window, screen_width * emu_zoom, screen_height * emu_zoom);
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
	while(SDL_PollEvent(&event) && !dev[0x0f]) {
		/* Window */
		if(event.type == SDL_QUIT)
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
	for(; !dev[0x0f];) {
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
		return !fprintf(stdout, "%s - Varvara Emulator, 26 Dec 2025.\n", argv[0]);
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
