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
Copyright (c) 2021-2026 Devine Lu Linvega, Andrew Alderwick

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE.

cc -I/usr/include/SDL2 -DNDEBUG -O2 -g0 -s -lSDL2 src/uxn2.c -o bin/uxn2
	$(sdl2-config --cflags --libs)
*/

typedef void (*deo_handler)(void);
typedef Uint8 (*dei_handler)(void);

static Uint8 *ram, dev[0x100], ptr[2], stk[2][0x100];
static unsigned int uxn_eval(Uint16 pc);

/* clang-format off */

#define BANKS 0x10
#define BANKS_CAP BANKS * 0x10000
#define WIDTH (64 * 8)
#define HEIGHT (40 * 8)
#define TWOS(v) (v & 0x8000 ? (int)v - 0x10000 : (int)v)
#define PEEK2(d) (*(d) << 8 | (d)[1])
#define CLAMP(v, a, b) { if(v < a) v = a; else if(v >= b) v = b; }

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
system_deo_expansion(void)
{
	const Uint16 exp = PEEK2(dev + 2);
	Uint8 *aptr = ram + exp;
	Uint16 length = PEEK2(aptr + 1);
	unsigned int bank = PEEK2(aptr + 3) * 0x10000;
	unsigned int addr = PEEK2(aptr + 5);
	if(ram[exp] == 0x0) {
		if(bank < BANKS_CAP)
			memset(ram + bank + addr, ram[exp + 7], length);
	} else if(ram[exp] == 1 || ram[exp] == 2) {
		unsigned int dst_bank = PEEK2(aptr + 7) * 0x10000;
		unsigned int dst_addr = PEEK2(aptr + 9);
		if(bank < BANKS_CAP && dst_bank < BANKS_CAP)
			memmove(ram + dst_bank + dst_addr, ram + bank + addr, length);
	} else
		fprintf(stderr, "Unknown command: %s\n", &ram[exp]);
}

/* clang-format off */

static Uint8 system_dei_wst(void) { return ptr[0]; }
static Uint8 system_dei_rst(void) { return ptr[1]; }
static void system_deo_wst(void) { ptr[0] = dev[4]; }
static void system_deo_rst(void) { ptr[1] = dev[5]; }
static void system_deo_print(void) { system_print("WST", 0), system_print("RST", 1); }

/* clang-format on */

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

/* clang-format off */

static void console_deo_vector(void) { console_vector = PEEK2(&dev[0x10]); }
static void console_deo_stdout(void) { fputc(dev[0x18], stdout), fflush(stdout); }
static void console_deo_stderr(void) { fputc(dev[0x19], stderr), fflush(stderr); }
static void console_deo_hb(void) { fprintf(stderr, "%02x", dev[0x1a]); }
static void console_deo_lb(void) { fprintf(stderr, "%02x", dev[0x1b]); }

/* clang-format on */

/*
@|Screen ------------------------------------------------------------ */

#define screen_zoom 1
static int emu_zoom = 1;

static int screen_reqsize, screen_reqdraw;
static int screen_width, screen_height, screen_wmar2, screen_hmar2;
static int screen_x1, screen_y1, screen_x2, screen_y2;
static int screen_vector, *screen_pixels, screen_palette[16];
static int rX, rY, rA, rMX, rMY, rMA, rML, rDX, rDY;
static Uint8 *screen_layers;

static const Uint8 blend_lut[16][2][4] = {
	{{0, 0, 1, 2}, {0, 0, 4, 8}},
	{{0, 1, 2, 3}, {0, 4, 8, 12}},
	{{0, 2, 3, 1}, {0, 8, 12, 4}},
	{{0, 3, 1, 2}, {0, 12, 4, 8}},
	{{1, 0, 1, 2}, {4, 0, 4, 8}},
	{{1, 1, 2, 3}, {4, 4, 8, 12}},
	{{1, 2, 3, 1}, {4, 8, 12, 4}},
	{{1, 3, 1, 2}, {4, 12, 4, 8}},
	{{2, 0, 1, 2}, {8, 0, 4, 8}},
	{{2, 1, 2, 3}, {8, 4, 8, 12}},
	{{2, 2, 3, 1}, {8, 8, 12, 4}},
	{{2, 3, 1, 2}, {8, 12, 4, 8}},
	{{3, 0, 1, 2}, {12, 0, 4, 8}},
	{{3, 1, 2, 3}, {12, 4, 8, 12}},
	{{3, 2, 3, 1}, {12, 8, 12, 4}},
	{{3, 3, 1, 2}, {12, 12, 4, 8}}};

void emu_redraw(void), emu_resize(void);

static void
screen_change(const int x1, const int y1, const int x2, const int y2)
{
	screen_x1 = x1 < screen_x1 ? x1 : screen_x1;
	screen_y1 = y1 < screen_y1 ? y1 : screen_y1;
	screen_x2 = x2 > screen_x2 ? x2 : screen_x2;
	screen_y2 = y2 > screen_y2 ? y2 : screen_y2;
}

static void
system_deo_colorize(void)
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
		dev[0x22] = screen_width >> 8, dev[0x23] = screen_width;
		screen_height = height, screen_hmar2 = height + 0x10;
		dev[0x24] = screen_height >> 8, dev[0x25] = screen_height;
		length = screen_wmar2 * screen_hmar2;
		screen_layers = realloc(screen_layers, length);
		memset(screen_layers, 0, length);
		screen_reqsize = screen_reqdraw = 1;
	}
}

static void
screen_redraw(void)
{
	if(screen_zoom == 1) {
		const int colmar = (screen_y1 + 8) * screen_wmar2 + (screen_x1 + 8);
		const int row_width = screen_x2 - screen_x1;
		const int src_stride = screen_wmar2 - row_width;
		const int dst_stride = screen_width - row_width;
		int y, *dst_ptr = &screen_pixels[screen_y1 * screen_width + screen_x1];
		Uint8 *src_ptr = &screen_layers[colmar];
		for(y = screen_y1; y < screen_y2; y++) {
			int *dst_end = dst_ptr + row_width;
			while(dst_ptr < dst_end)
				*dst_ptr++ = screen_palette[*src_ptr++];
			dst_ptr += dst_stride;
			src_ptr += src_stride;
		}
	} else {
		int x, y, i, k, l;
		const int stride = screen_width * screen_zoom;
		for(y = screen_y1; y < screen_y2; y++) {
			const int ys = y * screen_zoom;
			for(x = screen_x1, i = (x + 8) + (y + 8) * screen_wmar2; x < screen_x2; x++, i++) {
				const int c = screen_palette[screen_layers[i]];
				for(k = 0; k < screen_zoom; k++) {
					const int oo = (ys + k) * stride + x * screen_zoom;
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
		static int pixel_capacity;
		int need = screen_width * screen_height * screen_zoom * screen_zoom;
		if(need > pixel_capacity) {
			pixel_capacity = need;
			screen_pixels = realloc(screen_pixels, need * sizeof(unsigned int));
		}
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
screen_deo_pixel(void)
{
	const int ctrl = dev[0x2e];
	const int hi = ctrl & 0x40;
	const Uint8 mask = hi ? 0x3 : 0xc;
	const Uint8 color = hi ? ((ctrl & 0x3) << 2) : (ctrl & 0x3);
	/* fill mode */
	if(ctrl & 0x80) {
		int px;
		const int x1 = (ctrl & 0x10) ? 8 : rX + 8;
		const int x2 = (ctrl & 0x10) ? rX : screen_width;
		const int y1 = (ctrl & 0x20) ? 8 : rY + 8;
		const int y2 = (ctrl & 0x20) ? rY : screen_height;
		const int hor = (x2 + 8) - x1;
		const int ver = (y2 + 8) - y1;
		Uint8 *row = &screen_layers[y1 * screen_wmar2 + x1];
		Uint8 *end = row + ver * screen_wmar2;
		for(; row < end; row += screen_wmar2) {
			Uint8 *dst = row;
			for(px = 0; px < hor; px++)
				dst[px] = (dst[px] & mask) | color;
		}
		screen_reqdraw = 1;
	}
	/* pixel mode */
	else {
		const Uint16 x = rX, y = rY;
		if(x < screen_width && y < screen_height) {
			Uint8 *dst = &screen_layers[(y + 8) * screen_wmar2 + (x + 8)];
			*dst = (*dst & mask) | color;
			screen_reqdraw = 1;
		}
		if(rMX) rX++;
		if(rMY) rY++;
	}
}

static void
screen_deo_sprite(void)
{
	int i, j, x = rX, y = rY;
	const int ctrl = dev[0x2f];
	const int flipx = ctrl & 0x10, flipy = ctrl & 0x20;
	const int dx = flipx ? -rDY : rDY, dy = flipy ? -rDX : rDX;
	const int row_start = flipx ? 0 : 7, row_delta = flipx ? 1 : -1;
	const int col_start = flipy ? 7 : 0, col_delta = flipy ? -1 : 1;
	const int layer = ctrl & 0x40, layer_mask = layer ? 0x3 : 0xc;
	const int is_2bpp = ctrl & 0x80;
	const int addr_incr = rMA << (is_2bpp ? 2 : 1);
	const int stride = screen_wmar2;
	const int blend = ctrl & 0xf;
	const Uint8 opaque_mask = blend % 5;
	const Uint8 *table = blend_lut[blend][layer >> 6];
	for(i = 0; i <= rML; i++, x += dx, y += dy, rA += addr_incr) {
		const Uint16 x0 = x + 8, y0 = y + 8;
		if(x0 + 8 >= stride || y0 + 8 >= screen_hmar2) continue;
		Uint8 *dst = screen_layers + y0 * stride + x0;
		const Uint8 *col = &ram[rA + col_start];
		for(j = 0; j < 8; j++, dst += stride, col += col_delta) {
			Uint8 *d = dst;
			const int ch1 = *col, ch2 = is_2bpp ? col[8] : 0;
			for(int k = 0, row = row_start; k < 8; k++, d++, row += row_delta) {
				const int bit = 1 << row;
				const int color = !!(ch1 & bit) | (!!(ch2 & bit) << 1);
				if(opaque_mask || color)
					*d = (*d & layer_mask) | table[color];
			}
		}
	}
	if(!screen_reqdraw) {
		int x1 = flipx ? x : rX, x2 = flipx ? rX : x;
		int y1 = flipy ? y : rY, y2 = flipy ? rY : y;
		screen_change(x1 - 8, y1 - 8, x2 + 8, y2 + 8);
	}
	if(rMX) rX += flipx ? -rDX : rDX;
	if(rMY) rY += flipy ? -rDY : rDY;
}

/* clang-format off */

static Uint8 screen_dei_rxhb(void) { return rX >> 8; }
static Uint8 screen_dei_rxlb(void) { return rX; }
static Uint8 screen_dei_ryhb(void) { return rY >> 8; }
static Uint8 screen_dei_rylb(void) { return rY; }
static Uint8 screen_dei_rahb(void) { return rA >> 8; }
static Uint8 screen_dei_ralb(void) { return rA; }
static void screen_deo_vector(void) { screen_vector = PEEK2(&dev[0x20]); }
static void screen_deo_width(void) { screen_resize(PEEK2(&dev[0x22]) & 0xfff, screen_height & 0xfff); }
static void screen_deo_height(void) { screen_resize(screen_width & 0xfff, PEEK2(&dev[0x24]) & 0xfff); }
static void screen_deo_auto(void) { rMX = dev[0x26] & 0x1, rMY = dev[0x26] & 0x2, rMA = dev[0x26] & 0x4, rML = dev[0x26] >> 4, rDX = rMX << 3, rDY = rMY << 2; }
static void screen_deo_x(void) { rX = (dev[0x28] << 8) | dev[0x29], rX = TWOS(rX); }
static void screen_deo_y(void) { rY = (dev[0x2a] << 8) | dev[0x2b], rY = TWOS(rY); }
static void screen_deo_addr(void) { rA = (dev[0x2c] << 8) | dev[0x2d]; }

/* clang-format on */

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

/* clang-format off */

static Uint8 audio_get_vu0(void) { return audio_get_vu(0); }
static Uint8 audio_get_vu1(void) { return audio_get_vu(1); }
static Uint8 audio_get_vu2(void) { return audio_get_vu(2); }
static Uint8 audio_get_vu3(void) { return audio_get_vu(3); }
static void audio_play0(void) { audio_play(0, &dev[0x30]); }
static void audio_play1(void) { audio_play(1, &dev[0x40]); }
static void audio_play2(void) { audio_play(2, &dev[0x50]); }
static void audio_play3(void) { audio_play(3, &dev[0x60]); }

/* clang-format on */

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

void
controller_deo_vector(void)
{
	controller_vector = PEEK2(&dev[0x80]);
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

void
mouse_deo_vector(void)
{
	mouse_vector = PEEK2(&dev[0x90]);
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

/* clang-format off */

static void filea_deo_vector(void) { rL1 = PEEK2(&dev[0xaa]); }
static void filea_deo_stat(void) { file_success(0xa2, file_stat(0, PEEK2(&dev[0xa4]), rL1)); }
static void filea_deo_delete(void) { file_success(0xa2, file_delete(0)); }
static void filea_deo_name(void) { file_success(0xa2, file_init(0, PEEK2(&dev[0xa8]))); }
static void filea_deo_read(void) { file_success(0xa2, file_read(0, PEEK2(&dev[0xac]), rL1)); }
static void filea_deo_write(void) { file_success(0xa2, file_write(0, PEEK2(&dev[0xae]), rL1, dev[0xa7])); }
static void fileb_deo_vector(void) { rL2 = PEEK2(&dev[0xba]); }
static void fileb_deo_stat(void) { file_success(0xb2, file_stat(1, PEEK2(&dev[0xb4]), rL2)); }
static void fileb_deo_delete(void) { file_success(0xb2, file_delete(1)); }
static void fileb_deo_name(void) { file_success(0xb2, file_init(1, PEEK2(&dev[0xb8]))); }
static void fileb_deo_read(void) { file_success(0xb2, file_read(1, PEEK2(&dev[0xbc]), rL2)); }
static void fileb_deo_write(void) { file_success(0xb2, file_write(1, PEEK2(&dev[0xbe]), rL2, dev[0xb7])); }

/* clang-format on */

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

/* clang-format off */

static Uint8 datetime_dei_yhb(void) { datetime_update(); return (datetime_t->tm_year + 1900) >> 8; }
static Uint8 datetime_dei_ylb(void) { datetime_update(); return (datetime_t->tm_year + 1900); }
static Uint8 datetime_dei_mon(void) { datetime_update(); return datetime_t->tm_mon; }
static Uint8 datetime_dei_day(void) { datetime_update(); return datetime_t->tm_mday; }
static Uint8 datetime_dei_hou(void) { datetime_update(); return datetime_t->tm_hour; }
static Uint8 datetime_dei_min(void) { datetime_update(); return datetime_t->tm_min; }
static Uint8 datetime_dei_sec(void) { datetime_update(); return datetime_t->tm_sec; }
static Uint8 datetime_dei_wday(void) { datetime_update(); return datetime_t->tm_wday; }
static Uint8 datetime_dei_ydayhb(void) { datetime_update(); return datetime_t->tm_yday >> 8; }
static Uint8 datetime_dei_ydaylb(void) { datetime_update(); return datetime_t->tm_yday; }
static Uint8 datetime_dei_dst(void) { datetime_update(); return datetime_t->tm_isdst; }

/* clang-format on */

/*
@|Core -------------------------------------------------------------- */

static int fullscreen, borderless;
static SDL_Window *emu_window;
static SDL_Texture *emu_texture;
static SDL_Renderer *emu_renderer;
static SDL_Rect emu_viewport;
static SDL_Thread *stdin_thread;
static Uint32 stdin_event;

static const dei_handler dei_handlers[256] = {
	[0x04] = system_dei_wst,
	[0x05] = system_dei_rst,
	[0x28] = screen_dei_rxhb,
	[0x29] = screen_dei_rxlb,
	[0x2a] = screen_dei_ryhb,
	[0x2b] = screen_dei_rylb,
	[0x2c] = screen_dei_rahb,
	[0x2d] = screen_dei_ralb,
	[0x34] = audio_get_vu0,
	[0x44] = audio_get_vu1,
	[0x54] = audio_get_vu2,
	[0x64] = audio_get_vu3,
	[0xc0] = datetime_dei_yhb,
	[0xc1] = datetime_dei_ylb,
	[0xc2] = datetime_dei_mon,
	[0xc3] = datetime_dei_day,
	[0xc4] = datetime_dei_hou,
	[0xc5] = datetime_dei_min,
	[0xc6] = datetime_dei_sec,
	[0xc7] = datetime_dei_wday,
	[0xc8] = datetime_dei_ydayhb,
	[0xc9] = datetime_dei_ydaylb,
	[0xca] = datetime_dei_dst,
};

static const deo_handler deo_handlers[256] = {
	[0x03] = system_deo_expansion,
	[0x04] = system_deo_wst,
	[0x05] = system_deo_rst,
	[0x08] = system_deo_colorize,
	[0x09] = system_deo_colorize,
	[0x0a] = system_deo_colorize,
	[0x0b] = system_deo_colorize,
	[0x0c] = system_deo_colorize,
	[0x0d] = system_deo_colorize,
	[0x0e] = system_deo_print,
	[0x11] = console_deo_vector,
	[0x18] = console_deo_stdout,
	[0x19] = console_deo_stderr,
	[0x1a] = console_deo_hb,
	[0x1b] = console_deo_lb,
	[0x21] = screen_deo_vector,
	[0x23] = screen_deo_width,
	[0x25] = screen_deo_height,
	[0x26] = screen_deo_auto,
	[0x28] = screen_deo_x,
	[0x29] = screen_deo_x,
	[0x2a] = screen_deo_y,
	[0x2b] = screen_deo_y,
	[0x2c] = screen_deo_addr,
	[0x2d] = screen_deo_addr,
	[0x2e] = screen_deo_pixel,
	[0x2f] = screen_deo_sprite,
	[0x3f] = audio_play0,
	[0x4f] = audio_play1,
	[0x5f] = audio_play2,
	[0x6f] = audio_play3,
	[0x81] = controller_deo_vector,
	[0x91] = mouse_deo_vector,
	[0xab] = filea_deo_vector,
	[0xa5] = filea_deo_stat,
	[0xa6] = filea_deo_delete,
	[0xa9] = filea_deo_name,
	[0xad] = filea_deo_read,
	[0xaf] = filea_deo_write,
	[0xbb] = fileb_deo_vector,
	[0xb5] = fileb_deo_stat,
	[0xb6] = fileb_deo_delete,
	[0xb9] = fileb_deo_name,
	[0xbd] = fileb_deo_read,
	[0xbf] = fileb_deo_write};

static inline Uint8
emu_dei(const Uint8 port)
{
	dei_handler h = dei_handlers[port];
	return h ? h() : dev[port];
}

static inline void
emu_deo(const Uint8 port, const Uint8 value)
{
	deo_handler h = deo_handlers[port];
	dev[port] = value;
	if(h) h();
}

/* clang-format off */

/*
@|Uxn --------------------------------------------------------------- */

#define OPC(opc, A, B) {\
	case 0x00|opc: {const Uint8 d=0,r=0;A B} break;\
	case 0x20|opc: {const Uint8 d=1,r=0;A B} break;\
	case 0x40|opc: {const Uint8 d=0,r=1;A B} break;\
	case 0x60|opc: {const Uint8 d=1,r=1;A B} break;\
	case 0x80|opc: {const Uint8 d=0,r=0,k=ptr[0];A ptr[0]=k;B} break;\
	case 0xa0|opc: {const Uint8 d=1,r=0,k=ptr[0];A ptr[0]=k;B} break;\
	case 0xc0|opc: {const Uint8 d=0,r=1,k=ptr[1];A ptr[1]=k;B} break;\
	case 0xe0|opc: {const Uint8 d=1,r=1,k=ptr[1];A ptr[1]=k;B} break;}
#define REM ptr[r] -= 1 + d;
#define DEC(m) stk[m][--ptr[m]]
#define INC(m) stk[m][ptr[m]++]
#define IMM(o) o = ram[pc++] << 8, o |= ram[pc++];
#define MOV(o) { pc = d ? (unsigned short)o : pc + (Sint8)o; }
#define POx(o,m) o = DEC(r); if(m) o |= DEC(r) << 8;
#define PUx(i,m) if(m) c = (i), INC(r) = c >> 8, INC(r) = c; else INC(r) = i;
#define GOT(o) if(d) o[1] = DEC(r); o[0] = DEC(r);
#define PUT(i) PUx(i[0],0) if(d) { PUx(i[1],0) }
#define DEO(o,v) emu_deo(o, v[0]); if(d) emu_deo(o + 1, v[1]);
#define DEI(i,v) v[0] = emu_dei(i); if(d) v[1] = emu_dei(i + 1); PUT(v)
#define POK(o,v,m) ram[o] = v[0]; if(d) ram[(o + 1) & m] = v[1];
#define PEK(i,v,m) v[0] = ram[i]; if(d) v[1] = ram[(i + 1) & m]; PUT(v)

static unsigned int
uxn_eval(unsigned short pc)
{
	unsigned int a, b, c, x[2], y[2], z[2];
	for(;;) {
	switch(ram[pc++]) {
	/* BRK */ case 0x00: return 1;
	/* JCI */ case 0x20: if(DEC(0)) { IMM(c) pc += c; } else pc += 2; break;
	/* JMI */ case 0x40: IMM(c) pc += c; break;
	/* JSI */ case 0x60: IMM(c) INC(1) = pc >> 8, INC(1) = pc, pc += c; break;
	/* LI2 */ case 0xa0: INC(0) = ram[pc++]; /* fall-through */
	/* LIT */ case 0x80: INC(0) = ram[pc++]; break;
	/* L2r */ case 0xe0: INC(1) = ram[pc++]; /* fall-through */
	/* LIr */ case 0xc0: INC(1) = ram[pc++]; break;
	/* INC */ OPC(0x01,POx(a,d),PUx(a + 1, d))
	/* POP */ OPC(0x02,REM,{})
	/* NIP */ OPC(0x03,GOT(x) REM,PUT(x))
	/* SWP */ OPC(0x04,GOT(x) GOT(y),PUT(x) PUT(y))
	/* ROT */ OPC(0x05,GOT(x) GOT(y) GOT(z),PUT(y) PUT(x) PUT(z))
	/* DUP */ OPC(0x06,GOT(x),PUT(x) PUT(x))
	/* OVR */ OPC(0x07,GOT(x) GOT(y),PUT(y) PUT(x) PUT(y))
	/* EQU */ OPC(0x08,POx(a,d) POx(b,d),PUx(b == a,0))
	/* NEQ */ OPC(0x09,POx(a,d) POx(b,d),PUx(b != a,0))
	/* GTH */ OPC(0x0a,POx(a,d) POx(b,d),PUx(b > a,0))
	/* LTH */ OPC(0x0b,POx(a,d) POx(b,d),PUx(b < a,0))
	/* JMP */ OPC(0x0c,POx(a,d),MOV(a))
	/* JCN */ OPC(0x0d,POx(a,d) POx(b,0),if(b) MOV(a))
	/* JSR */ OPC(0x0e,POx(a,d),INC(!r) = pc >> 8; INC(!r) = pc; MOV(a))
	/* STH */ OPC(0x0f,GOT(x),INC(!r) = x[0]; if(d) INC(!r) = x[1];)
	/* LDZ */ OPC(0x10,POx(a,0),PEK(a, x, 0xff))
	/* STZ */ OPC(0x11,POx(a,0) GOT(y),POK(a, y, 0xff))
	/* LDR */ OPC(0x12,POx(a,0),PEK(pc + (Sint8)a, x, 0xffff))
	/* STR */ OPC(0x13,POx(a,0) GOT(y),POK(pc + (Sint8)a, y, 0xffff))
	/* LDA */ OPC(0x14,POx(a,1),PEK(a, x, 0xffff))
	/* STA */ OPC(0x15,POx(a,1) GOT(y),POK(a, y, 0xffff))
	/* DEI */ OPC(0x16,POx(a,0),DEI(a, x))
	/* DEO */ OPC(0x17,POx(a,0) GOT(y),DEO(a, y))
	/* ADD */ OPC(0x18,POx(a,d) POx(b,d),PUx(b + a, d))
	/* SUB */ OPC(0x19,POx(a,d) POx(b,d),PUx(b - a, d))
	/* MUL */ OPC(0x1a,POx(a,d) POx(b,d),PUx(b * a, d))
	/* DIV */ OPC(0x1b,POx(a,d) POx(b,d),PUx(a ? b / a : 0, d))
	/* AND */ OPC(0x1c,POx(a,d) POx(b,d),PUx(b & a, d))
	/* ORA */ OPC(0x1d,POx(a,d) POx(b,d),PUx(b | a, d))
	/* EOR */ OPC(0x1e,POx(a,d) POx(b,d),PUx(b ^ a, d))
	/* SFT */ OPC(0x1f,POx(a,0) POx(b,d),PUx(b >> (a & 0xf) << (a >> 4), d))
	}} return 0;
}

/* clang-format on */

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
get_mouse_button(Uint8 event)
{
	if(event == 2) return 4;
	if(event == 4) return 2;
	return event;
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
	if(sym < 0x20 || sym < SDLK_a || sym == SDLK_DELETE)
		return sym;
	if(sym <= SDLK_z)
		return sym - (mods & KMOD_SHIFT) * 0x20;
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
			mouse_up(get_mouse_button(SDL_BUTTON(event.button.button)));
		else if(event.type == SDL_MOUSEBUTTONDOWN)
			mouse_down(get_mouse_button(SDL_BUTTON(event.button.button)));
		else if(event.type == SDL_MOUSEWHEEL)
			mouse_scroll(event.wheel.x, event.wheel.y);
		/* Audio */
		else if(event.type >= audio0_event && event.type < audio0_event + POLYPHONY) {
			Uint8 *port_value = &dev[0x30 + 0x10 * (event.type - audio0_event)];
			uxn_eval(port_value[0] << 8 | port_value[1]);
		}
		/* Controller */
		else if(event.type == SDL_KEYDOWN) {
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
			break;
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
		return !fprintf(stdout, "%s - Varvara Emulator, 15 Feb 2026.\n", argv[0]);
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
