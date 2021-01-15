#include <stdio.h>
#include <SDL2/SDL.h>
#include <portmidi.h>
#include <porttime.h>

/* 
Copyright (c) 2020 Devine Lu Linvega

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE.
*/

#define HOR 32
#define VER 16
#define PAD 1
#define VOICES 16
#define DEVICE 0

#define SZ (HOR * VER * 16)
#define CLIPSZ (HOR * VER) + VER + 1
#define MSGSZ 64
#define MAXSZ (HOR * VER)

typedef unsigned char Uint8;

typedef struct Grid {
	int w, h, l, f, r;
	char var[36], data[MAXSZ], lock[MAXSZ], type[MAXSZ];
} Grid;

typedef struct {
	int unsaved;
	char name[256];
	Grid grid;
} Document;

typedef struct {
	int x, y, w, h;
} Rect2d;

typedef struct {
	int channel, value, velocity, length;
} Note;

Document doc;
char clip[CLIPSZ];
Note voices[VOICES];
Rect2d cursor;

int WIDTH = 8 * HOR + PAD * 8 * 2;
int HEIGHT = 8 * (VER + 2) + PAD * 8 * 2;
int BPM = 128, DOWN = 0, ZOOM = 2, PAUSE = 0, GUIDES = 1, MODE = 0;

Uint32 theme[] = {
	0x000000,
	0xFFFFFF,
	0x72DEC2,
	0x666666,
	0xffb545};

Uint8 icons[][8] = {
	{0x00, 0x00, 0x10, 0x38, 0x7c, 0x38, 0x10, 0x00}, /* play */
	{0x00, 0x00, 0x48, 0x24, 0x12, 0x24, 0x48, 0x00}, /* next */
	{0x00, 0x00, 0x66, 0x42, 0x00, 0x42, 0x66, 0x00}, /* skip */
	{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3e, 0x00}, /* midi:1 */
	{0x00, 0x00, 0x00, 0x00, 0x00, 0x3e, 0x3e, 0x00}, /* midi:2 */
	{0x00, 0x00, 0x00, 0x00, 0x3e, 0x3e, 0x3e, 0x00}, /* midi:3 */
	{0x00, 0x00, 0x00, 0x3e, 0x3e, 0x3e, 0x3e, 0x00}, /* midi:4 */
	{0x00, 0x00, 0x3e, 0x3e, 0x3e, 0x3e, 0x3e, 0x00}, /* midi:5 */
	{0x00, 0x3e, 0x3e, 0x3e, 0x3e, 0x3e, 0x3e, 0x00}, /* midi:6 */
	{0x00, 0x00, 0x00, 0x82, 0x44, 0x38, 0x00, 0x00}, /* eye open */
	{0x00, 0x38, 0x44, 0x92, 0x28, 0x10, 0x00, 0x00}, /* eye closed */
	{0x10, 0x54, 0x28, 0xc6, 0x28, 0x54, 0x10, 0x00}  /* unsaved */
};

Uint8 font[][8] = {
	{0x00, 0x00, 0x3c, 0x42, 0x42, 0x42, 0x3c, 0x00},
	{0x00, 0x00, 0x30, 0x10, 0x10, 0x10, 0x10, 0x00},
	{0x00, 0x00, 0x7c, 0x02, 0x3c, 0x40, 0x7e, 0x00},
	{0x00, 0x00, 0x7c, 0x02, 0x7c, 0x02, 0x7c, 0x00},
	{0x00, 0x00, 0x12, 0x22, 0x42, 0x7e, 0x02, 0x00},
	{0x00, 0x00, 0x7e, 0x40, 0x3c, 0x02, 0x7e, 0x00},
	{0x00, 0x00, 0x3e, 0x40, 0x7c, 0x42, 0x3c, 0x00},
	{0x00, 0x00, 0x7e, 0x02, 0x04, 0x08, 0x10, 0x00},
	{0x00, 0x00, 0x7e, 0x42, 0x3c, 0x42, 0x7e, 0x00},
	{0x00, 0x00, 0x7e, 0x42, 0x3e, 0x02, 0x02, 0x00},
	{0x00, 0x00, 0x7c, 0x02, 0x3e, 0x42, 0x7a, 0x00},
	{0x00, 0x00, 0x40, 0x40, 0x7c, 0x42, 0x7c, 0x00},
	{0x00, 0x00, 0x00, 0x3e, 0x40, 0x40, 0x3e, 0x00},
	{0x00, 0x00, 0x02, 0x02, 0x3e, 0x42, 0x3e, 0x00},
	{0x00, 0x00, 0x3c, 0x42, 0x7c, 0x40, 0x3e, 0x00},
	{0x00, 0x00, 0x3c, 0x42, 0x70, 0x40, 0x40, 0x00},
	{0x00, 0x00, 0x3e, 0x42, 0x3e, 0x02, 0x7c, 0x00},
	{0x00, 0x00, 0x40, 0x40, 0x7c, 0x42, 0x42, 0x00},
	{0x00, 0x00, 0x10, 0x00, 0x10, 0x10, 0x10, 0x00},
	{0x00, 0x00, 0x7e, 0x04, 0x04, 0x44, 0x38, 0x00},
	{0x00, 0x00, 0x42, 0x44, 0x78, 0x44, 0x42, 0x00},
	{0x00, 0x00, 0x40, 0x40, 0x40, 0x40, 0x3e, 0x00},
	{0x00, 0x00, 0x6c, 0x52, 0x52, 0x52, 0x52, 0x00},
	{0x00, 0x00, 0x5c, 0x62, 0x42, 0x42, 0x42, 0x00},
	{0x00, 0x00, 0x1c, 0x22, 0x42, 0x44, 0x38, 0x00},
	{0x00, 0x00, 0x7c, 0x42, 0x7c, 0x40, 0x40, 0x00},
	{0x00, 0x00, 0x3e, 0x42, 0x3e, 0x02, 0x02, 0x00},
	{0x00, 0x00, 0x5c, 0x62, 0x40, 0x40, 0x40, 0x00},
	{0x00, 0x00, 0x3e, 0x40, 0x3c, 0x02, 0x7c, 0x00},
	{0x00, 0x00, 0x7e, 0x10, 0x10, 0x10, 0x08, 0x00},
	{0x00, 0x00, 0x42, 0x42, 0x42, 0x46, 0x3a, 0x00},
	{0x00, 0x00, 0x42, 0x42, 0x24, 0x24, 0x18, 0x00},
	{0x00, 0x00, 0x42, 0x42, 0x52, 0x52, 0x6c, 0x00},
	{0x00, 0x00, 0x42, 0x42, 0x3c, 0x42, 0x42, 0x00},
	{0x00, 0x00, 0x42, 0x42, 0x3e, 0x02, 0x7c, 0x00},
	{0x00, 0x00, 0x7e, 0x04, 0x18, 0x20, 0x7e, 0x00},
	{0x00, 0x00, 0x3c, 0x42, 0x7e, 0x42, 0x42, 0x00},
	{0x00, 0x00, 0x7c, 0x42, 0x7c, 0x42, 0x7c, 0x00},
	{0x00, 0x00, 0x3e, 0x40, 0x40, 0x40, 0x3e, 0x00},
	{0x00, 0x00, 0x7c, 0x42, 0x42, 0x42, 0x7c, 0x00},
	{0x00, 0x00, 0x7e, 0x40, 0x7e, 0x40, 0x7e, 0x00},
	{0x00, 0x00, 0x7e, 0x40, 0x70, 0x40, 0x40, 0x00},
	{0x00, 0x00, 0x3e, 0x40, 0x5c, 0x42, 0x3e, 0x00},
	{0x00, 0x00, 0x42, 0x42, 0x7e, 0x42, 0x42, 0x00},
	{0x00, 0x00, 0x10, 0x10, 0x10, 0x10, 0x10, 0x00},
	{0x00, 0x00, 0x7e, 0x02, 0x02, 0x42, 0x3c, 0x00},
	{0x00, 0x00, 0x46, 0x48, 0x70, 0x48, 0x46, 0x00},
	{0x00, 0x00, 0x40, 0x40, 0x40, 0x40, 0x7e, 0x00},
	{0x00, 0x00, 0x6e, 0x52, 0x52, 0x52, 0x52, 0x00},
	{0x00, 0x00, 0x62, 0x52, 0x4a, 0x46, 0x42, 0x00},
	{0x00, 0x00, 0x3c, 0x42, 0x42, 0x42, 0x3c, 0x00},
	{0x00, 0x00, 0x7e, 0x42, 0x7c, 0x40, 0x40, 0x00},
	{0x00, 0x00, 0x3c, 0x42, 0x4a, 0x44, 0x3a, 0x00},
	{0x00, 0x00, 0x7e, 0x42, 0x7c, 0x42, 0x42, 0x00},
	{0x00, 0x00, 0x3e, 0x40, 0x7e, 0x02, 0x7c, 0x00},
	{0x00, 0x00, 0x7e, 0x10, 0x10, 0x10, 0x10, 0x00},
	{0x00, 0x00, 0x42, 0x42, 0x42, 0x42, 0x3c, 0x00},
	{0x00, 0x00, 0x42, 0x42, 0x42, 0x24, 0x18, 0x00},
	{0x00, 0x00, 0x52, 0x52, 0x52, 0x52, 0x6e, 0x00},
	{0x00, 0x00, 0x42, 0x24, 0x18, 0x24, 0x42, 0x00},
	{0x00, 0x00, 0x42, 0x24, 0x10, 0x10, 0x10, 0x00},
	{0x00, 0x00, 0x7e, 0x02, 0x3c, 0x40, 0x7e, 0x00},
	{0x00, 0x00, 0x5a, 0x24, 0x42, 0x24, 0x5a, 0x00},
	{0x00, 0x00, 0x24, 0x7e, 0x24, 0x7e, 0x24, 0x00},
	{0x00, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00},
	{0x00, 0x00, 0x00, 0x10, 0x00, 0x10, 0x00, 0x00},
	{0x00, 0x00, 0x66, 0x5a, 0x24, 0x5a, 0x66, 0x00},
	{0x00, 0x00, 0x00, 0x32, 0x42, 0x4c, 0x00, 0x00},
	{0x00, 0x00, 0x00, 0x28, 0x00, 0x28, 0x00, 0x00},
	{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00},
	{0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00}};

SDL_Window *gWindow = NULL;
SDL_Renderer *gRenderer = NULL;
SDL_Texture *gTexture = NULL;
Uint32 *pixels;
PmStream *midi;

/* helpers */

int
clamp(int val, int min, int max)
{
	return (val >= min) ? (val <= max) ? val : max : min;
}

char *
scpy(char *src, char *dst, int len)
{
	int i = 0;
	while((dst[i] = src[i]) && i < len - 2)
		i++;
	dst[i + 1] = '\0';
	return dst;
}

/* core */

int
ciuc(char c)
{
	return c >= 'A' && c <= 'Z';
}

int
cilc(char c)
{
	return c >= 'a' && c <= 'z';
}

int
cinu(char c)
{
	return c >= '0' && c <= '9';
}

int
cisp(char c)
{
	return !ciuc(c) && !cilc(c) && !cinu(c) && c != '.';
}

int
clca(int c)
{
	return ciuc(c) ? c + ('a' - 'A') : c;
}

char
cchr(int v, int cap)
{
	v %= 36;
	v *= v < 0 ? -1 : 1;
	if(v >= 0 && v <= 9)
		return '0' + v;
	if(cap)
		return 'A' + (v - 10);
	return 'a' + (v - 10);
}

int
cb36(char c)
{
	if(c >= 'A' && c <= 'Z')
		return c - 'A' + 10;
	if(c >= 'a' && c <= 'z')
		return c - 'a' + 10;
	if(c >= '0' && c <= '9')
		return c - '0';
	return 0;
}

int
valid(Grid *g, int x, int y)
{
	return x >= 0 && x <= g->w - 1 && y >= 0 && y <= g->h - 1;
}

int
nteval(char c)
{
	int sharp, uc, deg, notes[] = {0, 2, 4, 5, 7, 9, 11};
	if(c >= '0' && c <= '9')
		return c - '0';
	sharp = c >= 'a' && c <= 'z';
	uc = sharp ? c - 'a' + 'A' : c;
	deg = uc <= 'B' ? 'G' - 'B' + uc - 'A' : uc - 'C';
	return deg / 7 * 12 + notes[deg % 7] + sharp;
}

/* IO */

char
get(Grid *g, int x, int y)
{
	if(valid(g, x, y))
		return g->data[x + (y * g->w)];
	return '.';
}

void
set(Grid *g, int x, int y, char c)
{
	if(valid(g, x, y))
		g->data[x + (y * g->w)] = c;
}

/* Variables */

void
save(Grid *g, char key, char val)
{
	g->var[cb36(key)] = val;
}

char
load(Grid *g, char key)
{
	return g->var[cb36(key)];
}

/* Syntax */

int
gettype(Grid *g, int x, int y)
{
	if(valid(g, x, y))
		return g->type[x + (y * g->w)];
	return 0;
}

void
settype(Grid *g, int x, int y, int t)
{
	if(valid(g, x, y))
		g->type[x + (y * g->w)] = t;
}

/* Locks */

void
lock(Grid *g, int x, int y)
{
	if(valid(g, x, y)) {
		g->lock[x + (y * g->w)] = 1;
		if(!gettype(g, x, y))
			settype(g, x, y, 1);
	}
}

/* Port Setters */

void
setport(Grid *g, int x, int y, char c)
{
	lock(g, x, y);
	settype(g, x, y, 5);
	set(g, x, y, c);
}

int
getport(Grid *g, int x, int y, int l)
{
	if(l) {
		lock(g, x, y);
		settype(g, x, y, 4);
	} else
		settype(g, x, y, 2);
	return get(g, x, y);
}

int
bang(Grid *g, int x, int y)
{
	return get(g, x - 1, y) == '*' || get(g, x + 1, y) == '*' || get(g, x, y - 1) == '*' || get(g, x, y + 1) == '*';
}

/* Library */

Note *sendmidi(int chn, int val, int vel, int len);

void
opa(Grid *g, int x, int y, char c)
{
	char a = getport(g, x - 1, y, 0);
	char b = getport(g, x + 1, y, 1);
	setport(g, x, y + 1, cchr(cb36(a) + cb36(b), ciuc(b)));
	(void)c;
}

void
opb(Grid *g, int x, int y, char c)
{
	char a = getport(g, x - 1, y, 0);
	char b = getport(g, x + 1, y, 1);
	setport(g, x, y + 1, cchr(cb36(a) - cb36(b), ciuc(b)));
	(void)c;
}

void
opc(Grid *g, int x, int y, char c)
{
	char rate = getport(g, x - 1, y, 0);
	char mod = getport(g, x + 1, y, 1);
	int mod_ = cb36(mod);
	int rate_ = cb36(rate);
	if(!rate_)
		rate_ = 1;
	if(!mod_)
		mod_ = 8;
	setport(g, x, y + 1, cchr(g->f / rate_ % mod_, ciuc(mod)));
	(void)c;
}

void
opd(Grid *g, int x, int y, char c)
{
	char rate = getport(g, x - 1, y, 0);
	char mod = getport(g, x + 1, y, 1);
	int rate_ = cb36(rate);
	int mod_ = cb36(mod);
	if(!rate_)
		rate_ = 1;
	if(!mod_)
		mod_ = 8;
	setport(g, x, y + 1, g->f % (rate_ * mod_) == 0 ? '*' : '.');
	(void)c;
}

void
ope(Grid *g, int x, int y, char c)
{
	if(!valid(g, x + 1, y) || get(g, x + 1, y) != '.')
		set(g, x, y, '*');
	else {
		set(g, x, y, '.');
		setport(g, x + 1, y, c);
		settype(g, x + 1, y, 0);
	}
	settype(g, x, y, 0);
}

void
opf(Grid *g, int x, int y, char c)
{
	char a = getport(g, x - 1, y, 0);
	char b = getport(g, x + 1, y, 1);
	setport(g, x, y + 1, a == b ? '*' : '.');
	(void)c;
}

void
opg(Grid *g, int x, int y, char c)
{
	char px = getport(g, x - 3, y, 0);
	char py = getport(g, x - 2, y, 0);
	char len = getport(g, x - 1, y, 0);
	int i, len_ = cb36(len);
	if(!len_)
		len_ = 1;
	for(i = 0; i < len_; ++i)
		setport(g, x + i + cb36(px), y + 1 + cb36(py), getport(g, x + 1 + i, y, 1));
	(void)c;
}

void
oph(Grid *g, int x, int y, char c)
{
	getport(g, x, y + 1, 1);
	(void)c;
}

void
opi(Grid *g, int x, int y, char c)
{
	char rate = getport(g, x - 1, y, 0);
	char mod = getport(g, x + 1, y, 1);
	char val = getport(g, x, y + 1, 1);
	int rate_ = cb36(rate);
	int mod_ = cb36(mod);
	if(!rate_)
		rate_ = 1;
	if(!mod_)
		mod_ = 36;
	setport(g, x, y + 1, cchr((cb36(val) + rate_) % mod_, ciuc(mod)));
	(void)c;
}

void
opj(Grid *g, int x, int y, char c)
{
	char link = getport(g, x, y - 1, 0);
	int i;
	if(link != c) {
		for(i = 1; y + i < 256; ++i)
			if(get(g, x, y + i) != c)
				break;
		setport(g, x, y + i, link);
	}
}

void
opk(Grid *g, int x, int y, char c)
{
	char len = getport(g, x - 1, y, 0);
	int i, len_ = cb36(len);
	if(!len_)
		len_ = 1;
	for(i = 0; i < len_; ++i) {
		char key = getport(g, x + 1 + i, y, 1);
		if(key != '.')
			setport(g, x + 1 + i, y + 1, load(g, key));
	}
	(void)c;
}

void
opl(Grid *g, int x, int y, char c)
{
	char a = getport(g, x - 1, y, 0);
	char b = getport(g, x + 1, y, 1);
	setport(g, x, y + 1, cb36(a) < cb36(b) ? a : b);
	(void)c;
}

void
opm(Grid *g, int x, int y, char c)
{
	char a = getport(g, x - 1, y, 0);
	char b = getport(g, x + 1, y, 1);
	setport(g, x, y + 1, cchr(cb36(a) * cb36(b), ciuc(b)));
	(void)c;
}

void
opn(Grid *g, int x, int y, char c)
{
	if(!valid(g, x, y - 1) || get(g, x, y - 1) != '.')
		set(g, x, y, '*');
	else {
		set(g, x, y, '.');
		setport(g, x, y - 1, c);
		settype(g, x, y - 1, 0);
	}
	settype(g, x, y, 0);
}

void
opo(Grid *g, int x, int y, char c)
{
	char px = getport(g, x - 2, y, 0);
	char py = getport(g, x - 1, y, 0);
	setport(g, x, y + 1, getport(g, x + 1 + cb36(px), y + cb36(py), 1));
	(void)c;
}

void
opp(Grid *g, int x, int y, char c)
{
	char key = getport(g, x - 2, y, 0);
	char len = getport(g, x - 1, y, 0);
	char val = getport(g, x + 1, y, 1);
	int i, len_ = cb36(len);
	if(!len_)
		len_ = 1;
	for(i = 0; i < len_; ++i)
		lock(g, x + i, y + 1);
	setport(g, x + (cb36(key) % len_), y + 1, val);
	(void)c;
}

void
opq(Grid *g, int x, int y, char c)
{
	char px = getport(g, x - 3, y, 0);
	char py = getport(g, x - 2, y, 0);
	char len = getport(g, x - 1, y, 0);
	int i, len_ = cb36(len);
	if(!len_)
		len_ = 1;
	for(i = 0; i < len_; ++i)
		setport(g, x + 1 - len_ + i, y + 1, getport(g, x + 1 + cb36(px) + i, y + cb36(py), 1));
	(void)c;
}

void
opr(Grid *g, int x, int y, char c)
{
	char min = getport(g, x - 1, y, 0);
	char max = getport(g, x + 1, y, 1);
	int min_ = cb36(min);
	int max_ = cb36(max);
	unsigned int key = (g->r + y * g->w + x) ^ (g->f << 16);
	if(!max_)
		max_ = 36;
	if(min_ == max_)
		min_ = max_ - 1;
	key = (key ^ 61) ^ (key >> 16);
	key = key + (key << 3);
	key = key ^ (key >> 4);
	key = key * 0x27d4eb2d;
	key = key ^ (key >> 15);
	setport(g, x, y + 1, cchr(key % (max_ - min_) + min_, ciuc(max)));
	(void)c;
}

void
ops(Grid *g, int x, int y, char c)
{
	if(!valid(g, x, y + 1) || get(g, x, y + 1) != '.')
		set(g, x, y, '*');
	else {
		set(g, x, y, '.');
		setport(g, x, y + 1, c);
		settype(g, x, y + 1, 0);
	}
	settype(g, x, y, 0);
}

void
opt(Grid *g, int x, int y, char c)
{
	char key = getport(g, x - 2, y, 0);
	char len = getport(g, x - 1, y, 0);
	int i, len_ = cb36(len);
	if(!len_)
		len_ = 1;
	for(i = 0; i < len_; ++i)
		lock(g, x + 1 + i, y);
	setport(g, x, y + 1, getport(g, x + 1 + (cb36(key) % len_), y, 1));
	(void)c;
}

void
opu(Grid *g, int x, int y, char c)
{
	char step = getport(g, x - 1, y, 1);
	char max = getport(g, x + 1, y, 1);
	int step_ = cb36(step);
	int max_ = cb36(max);
	int bucket;
	if(!step_)
		step_ = 1;
	if(!max_)
		max_ = 8;
	bucket = (step_ * (g->f + max_ - 1)) % max_ + step_;
	setport(g, x, y + 1, bucket >= max_ ? '*' : '.');
	(void)c;
}

void
opv(Grid *g, int x, int y, char c)
{
	char w = getport(g, x - 1, y, 0);
	char r = getport(g, x + 1, y, 1);
	if(w != '.')
		save(g, w, r);
	else if(w == '.' && r != '.')
		setport(g, x, y + 1, load(g, r));
	(void)c;
}

void
opw(Grid *g, int x, int y, char c)
{
	if(!valid(g, x - 1, y) || get(g, x - 1, y) != '.')
		set(g, x, y, '*');
	else {
		set(g, x, y, '.');
		setport(g, x - 1, y, c);
		settype(g, x - 1, y, 0);
	}
	settype(g, x, y, 0);
}

void
opx(Grid *g, int x, int y, char c)
{
	char px = getport(g, x - 2, y, 0);
	char py = getport(g, x - 1, y, 0);
	char val = getport(g, x + 1, y, 1);
	setport(g, x + cb36(px), y + cb36(py) + 1, val);
	(void)c;
}

void
opy(Grid *g, int x, int y, char c)
{
	char link = getport(g, x - 1, y, 0);
	int i;
	if(link != c) {
		for(i = 1; x + i < 256; ++i)
			if(get(g, x + i, y) != c)
				break;
		setport(g, x + i, y, link);
	}
}

void
opz(Grid *g, int x, int y, char c)
{
	char rate = getport(g, x - 1, y, 0);
	char target = getport(g, x + 1, y, 1);
	char val = getport(g, x, y + 1, 1);
	int rate_ = cb36(rate);
	int target_ = cb36(target);
	int val_ = cb36(val);
	int mod;
	if(!rate_)
		rate_ = 1;
	if(val_ <= target_ - rate_)
		mod = rate_;
	else if(val_ >= target_ + rate_)
		mod = -rate;
	else
		mod = target_ - val_;
	setport(g, x, y + 1, cchr(val_ + mod, ciuc(target)));
	(void)c;
}

void
opcomment(Grid *g, int x, int y)
{
	int i;
	for(i = 1; x + i < 256; ++i) {
		lock(g, x + i, y);
		if(get(g, x + i, y) == '#')
			break;
	}
	settype(g, x, y, 1);
}

void
opspecial(Grid *g, int x, int y)
{
	int chn, oct, vel, len;
	char nte;
	if(getport(g, x, y, 1) != ':')
		return;
	chn = cb36(getport(g, x + 1, y, 1));
	oct = cb36(getport(g, x + 2, y, 1));
	nte = getport(g, x + 3, y, 1);
	vel = cb36(getport(g, x + 4, y, 1));
	len = cb36(getport(g, x + 5, y, 1));
	if(bang(g, x, y)) {
		sendmidi(chn,
			12 * oct + nteval(nte),
			!vel ? 36 : clamp(vel, 0, 36),
			clamp(len, 1, 36));
		settype(g, x, y, 3);
	}
}

void
operate(Grid *g, int x, int y, char c)
{
	settype(g, x, y, 3);
	switch(clca(c)) {
	case 'a': opa(g, x, y, c); break;
	case 'b': opb(g, x, y, c); break;
	case 'c': opc(g, x, y, c); break;
	case 'd': opd(g, x, y, c); break;
	case 'e': ope(g, x, y, c); break;
	case 'f': opf(g, x, y, c); break;
	case 'g': opg(g, x, y, c); break;
	case 'h': oph(g, x, y, c); break;
	case 'i': opi(g, x, y, c); break;
	case 'k': opk(g, x, y, c); break;
	case 'j': opj(g, x, y, c); break;
	case 'l': opl(g, x, y, c); break;
	case 'm': opm(g, x, y, c); break;
	case 'n': opn(g, x, y, c); break;
	case 'o': opo(g, x, y, c); break;
	case 'p': opp(g, x, y, c); break;
	case 'q': opq(g, x, y, c); break;
	case 'r': opr(g, x, y, c); break;
	case 's': ops(g, x, y, c); break;
	case 't': opt(g, x, y, c); break;
	case 'u': opu(g, x, y, c); break;
	case 'v': opv(g, x, y, c); break;
	case 'w': opw(g, x, y, c); break;
	case 'x': opx(g, x, y, c); break;
	case 'y': opy(g, x, y, c); break;
	case 'z': opz(g, x, y, c); break;
	case '*': set(g, x, y, '.'); break;
	case '#': opcomment(g, x, y); break;
	default: opspecial(g, x, y);
	}
}

/* General */

void
initframe(Grid *g)
{
	int i;
	for(i = 0; i < g->l; ++i) {
		g->lock[i] = 0;
		g->type[i] = 0;
	}
	for(i = 0; i < 36; ++i)
		g->var[i] = '\0';
}

int
rungrid(Grid *g)
{
	int i, x, y;
	initframe(g);
	for(i = 0; i < g->l; ++i) {
		char c = g->data[i];
		x = i % g->w;
		y = i / g->w;
		if(c == '.' || g->lock[i])
			continue;
		if(cinu(c))
			continue;
		if(cilc(c) && !bang(g, x, y))
			continue;
		operate(g, x, y, c);
	}
	g->f++;
	return 1;
}

void
initgrid(Grid *g, int w, int h)
{
	int i;
	g->w = w;
	g->h = h;
	g->l = w * h;
	g->f = 0;
	g->r = 1;
	for(i = 0; i < g->l; ++i)
		set(g, i % g->w, i / g->w, '.');
	initframe(g);
}

/* misc */

int
getfont(int x, int y, char c, int type, int sel)
{
	if(c >= 'A' && c <= 'Z')
		return c - 'A' + 36;
	if(c >= 'a' && c <= 'z')
		return c - 'a' + 10;
	if(c >= '0' && c <= '9')
		return c - '0';
	if(c == '*')
		return 62;
	if(c == '#')
		return 63;
	if(c == ':')
		return 65;
	if(cursor.x == x && cursor.y == y)
		return 66;
	if(GUIDES) {
		if(x % 8 == 0 && y % 8 == 0)
			return 68;
		if(sel || type || (x % 2 == 0 && y % 2 == 0))
			return 64;
	}
	return 70;
}

/* drawing */

void
putpixel(Uint32 *dst, int x, int y, int color)
{
	if(x >= 0 && x < WIDTH - 8 && y >= 0 && y < HEIGHT - 8)
		dst[(y + PAD * 8) * WIDTH + (x + PAD * 8)] = theme[color];
}

void
drawicon(Uint32 *dst, int x, int y, Uint8 *icon, int fg, int bg)
{
	int v, h;
	for(v = 0; v < 8; v++)
		for(h = 0; h < 8; h++) {
			int clr = (icon[v] >> (7 - h)) & 0x1;
			putpixel(dst, x + h, y + v, clr == 1 ? fg : bg);
		}
}

void
drawui(Uint32 *dst)
{
	int i, n = 0, bottom = VER * 8 + 8;
	/* cursor */
	drawicon(dst, 0 * 8, bottom, font[cursor.x % 36], 1, 0);
	drawicon(dst, 1 * 8, bottom, font[68], 1, 0);
	drawicon(dst, 2 * 8, bottom, font[cursor.y % 36], 1, 0);
	drawicon(dst, 3 * 8, bottom, icons[2], cursor.w > 1 || cursor.h > 1 ? 4 : 3, 0);
	/* frame */
	drawicon(dst, 5 * 8, bottom, font[(doc.grid.f / 1296) % 36], 1, 0);
	drawicon(dst, 6 * 8, bottom, font[(doc.grid.f / 36) % 36], 1, 0);
	drawicon(dst, 7 * 8, bottom, font[doc.grid.f % 36], 1, 0);
	drawicon(dst, 8 * 8, bottom, icons[PAUSE ? 1 : 0], (doc.grid.f - 1) % 8 == 0 ? 2 : 3, 0);
	/* speed */
	drawicon(dst, 10 * 8, bottom, font[(BPM / 100) % 10], 1, 0);
	drawicon(dst, 11 * 8, bottom, font[(BPM / 10) % 10], 1, 0);
	drawicon(dst, 12 * 8, bottom, font[BPM % 10], 1, 0);
	/* io */
	for(i = 0; i < VOICES; ++i)
		if(voices[i].length)
			n++;
	drawicon(dst, 13 * 8, bottom, n > 0 ? icons[2 + clamp(n, 0, 6)] : font[70], 2, 0);
	/* generics */
	drawicon(dst, 15 * 8, bottom, icons[GUIDES ? 10 : 9], GUIDES ? 1 : 2, 0);
	drawicon(dst, (HOR - 1) * 8, bottom, icons[11], doc.unsaved ? 2 : 3, 0);
}

void
redraw(Uint32 *dst)
{
	int x, y;
	Rect2d *r = &cursor;
	for(y = 0; y < VER; ++y) {
		for(x = 0; x < HOR; ++x) {
			int sel = x < r->x + r->w && x >= r->x && y < r->y + r->h && y >= r->y;
			int t = gettype(&doc.grid, x, y);
			Uint8 *letter = font[getfont(x, y, get(&doc.grid, x, y), t, sel)];
			int fg = 0, bg = 0;
			if(sel) {
				fg = 0;
				bg = 4;
			} else {
				switch(t) {
				case 1: fg = 3; break;
				case 2: fg = 1; break;
				case 3: bg = 1; break;
				case 4: fg = 2; break;
				case 5: bg = 2; break;
				default:
					fg = 3;
				}
			}
			drawicon(dst, x * 8, y * 8, letter, fg, bg);
		}
	}
	drawui(dst);
	SDL_UpdateTexture(gTexture, NULL, dst, WIDTH * sizeof(Uint32));
	SDL_RenderClear(gRenderer);
	SDL_RenderCopy(gRenderer, gTexture, NULL, NULL);
	SDL_RenderPresent(gRenderer);
}

/* midi */

Note *
sendmidi(int chn, int val, int vel, int len)
{
	int i = 0;
	/* Detrigger */
	for(i = 0; i < VOICES; ++i) {
		Note *n = &voices[i];
		if(!n->length || n->channel != chn || n->value != val)
			continue;
		Pm_WriteShort(midi,
			Pt_Time(),
			Pm_Message(0x90 + n->channel, n->value, 0));
		n->length = 0;
	}
	/* Trigger */
	for(i = 0; i < VOICES; ++i) {
		Note *n = &voices[i];
		if(n->length < 1) {
			n->channel = chn;
			n->value = val;
			n->velocity = vel;
			n->length = len;
			Pm_WriteShort(midi,
				Pt_Time(),
				Pm_Message(0x90 + chn, val, vel * 3));
			return n;
		}
	}
	return NULL;
}

void
runmidi(void)
{
	int i;
	for(i = 0; i < VOICES; ++i) {
		Note *n = &voices[i];
		if(n->length > 0) {
			n->length--;
			if(n->length == 0)
				Pm_WriteShort(midi,
					Pt_Time(),
					Pm_Message(0x90 + n->channel, n->value, 0));
		}
	}
}

void
initmidi(void)
{
	int i;
	Pm_Initialize();
	for(i = 0; i < Pm_CountDevices(); ++i)
		printf("Device #%d -> %s%s\n",
			i,
			Pm_GetDeviceInfo(i)->name,
			i == DEVICE ? "[x]" : "[ ]");
	Pm_OpenOutput(&midi, DEVICE, NULL, 128, 0, NULL, 1);
}

/* options */

int
error(char *msg, const char *err)
{
	printf("Error %s: %s\n", msg, err);
	return 0;
}

void
makedoc(Document *d, char *name)
{
	initgrid(&d->grid, HOR, VER);
	d->unsaved = 0;
	scpy(name, d->name, 256);
	redraw(pixels);
	printf("Made: %s\n", name);
}

int
opendoc(Document *d, char *name)
{
	int x = 0, y = 0;
	char c;
	FILE *f = fopen(name, "r");
	if(!f)
		return error("Load", "Invalid input file");
	initgrid(&d->grid, HOR, VER);
	while((c = fgetc(f)) != EOF && d->grid.l <= MAXSZ) {
		if(c == '\n') {
			x = 0;
			y++;
		} else {
			set(&d->grid, x, y, c);
			x++;
		}
	}
	d->unsaved = 0;
	scpy(name, d->name, 256);
	redraw(pixels);
	printf("Opened: %s\n", name);
	return 1;
}

void
savedoc(Document *d, char *name)
{
	int x, y;
	FILE *f = fopen(name, "w");
	for(y = 0; y < d->grid.h; ++y) {
		for(x = 0; x < d->grid.w; ++x)
			fputc(get(&d->grid, x, y), f);
		fputc('\n', f);
	}
	fclose(f);
	d->unsaved = 0;
	scpy(name, d->name, 256);
	redraw(pixels);
	printf("Saved: %s\n", name);
}

void
select(int x, int y, int w, int h)
{
	Rect2d r;
	r.x = clamp(x, 0, HOR - 1);
	r.y = clamp(y, 0, VER - 1);
	r.w = clamp(w, 1, HOR - x + 1);
	r.h = clamp(h, 1, VER - y + 1);
	if(r.x != cursor.x || r.y != cursor.y || r.w != cursor.w || r.h != cursor.h) {
		cursor = r;
		redraw(pixels);
	}
}

void
scale(int w, int h)
{
	if((cursor.w + w) * (cursor.h + h) < CLIPSZ)
		select(cursor.x, cursor.y, cursor.w + w, cursor.h + h);
}

void
reset(void)
{
	MODE = 0;
	GUIDES = 1;
	select(cursor.x, cursor.y, 1, 1);
}

void
setmode(int *i, int v)
{
	*i = v;
	redraw(pixels);
}

void
comment(Rect2d *r)
{
	int y;
	char c = get(&doc.grid, r->x, r->y) == '#' ? '.' : '#';
	for(y = 0; y < r->h; ++y) {
		set(&doc.grid, r->x, r->y + y, c);
		set(&doc.grid, r->x + r->w - 1, r->y + y, c);
	}
	doc.unsaved = 1;
	redraw(pixels);
}

void
move(int x, int y)
{
	select(cursor.x + x, cursor.y + y, cursor.w, cursor.h);
}

void
insert(char c)
{
	int x, y;
	for(x = 0; x < cursor.w; ++x)
		for(y = 0; y < cursor.h; ++y)
			set(&doc.grid, cursor.x + x, cursor.y + y, c);
	if(MODE)
		move(1, 0);
	doc.unsaved = 1;
	redraw(pixels);
}

void
frame(void)
{
	rungrid(&doc.grid);
	redraw(pixels);
	runmidi();
}

void
selectoption(int option)
{
	switch(option) {
	case 3: select(cursor.x, cursor.y, 1, 1); break;
	case 8:
		PAUSE = 1;
		frame();
		break;
	case 15: setmode(&GUIDES, !GUIDES); break;
	case HOR - 1: savedoc(&doc, doc.name); break;
	}
}

void
quit(void)
{
	free(pixels);
	SDL_DestroyTexture(gTexture);
	gTexture = NULL;
	SDL_DestroyRenderer(gRenderer);
	gRenderer = NULL;
	SDL_DestroyWindow(gWindow);
	gWindow = NULL;
	SDL_Quit();
	exit(0);
}

/* clip */

void
copyclip(Rect2d *r, char *c)
{
	int x, y, i = 0;
	for(y = 0; y < r->h; ++y) {
		for(x = 0; x < r->w; ++x)
			c[i++] = get(&doc.grid, r->x + x, r->y + y);
		c[i++] = '\n';
	}
	c[i] = '\0';
	redraw(pixels);
}

void
cutclip(Rect2d *r, char *c)
{
	copyclip(r, c);
	insert('.');
}

void
pasteclip(Rect2d *r, char *c, int insert)
{
	int i = 0, x = r->x, y = r->y;
	char ch;
	while((ch = c[i++])) {
		if(ch == '\n') {
			x = r->x;
			y++;
		} else {
			set(&doc.grid, x, y, insert && ch == '.' ? get(&doc.grid, x, y) : ch);
			x++;
		}
	}
	doc.unsaved = 1;
	redraw(pixels);
}

void
moveclip(Rect2d *r, char *c, int x, int y)
{
	copyclip(r, c);
	insert('.');
	move(x, y);
	pasteclip(r, c, 0);
}

/* triggers */

void
domouse(SDL_Event *event)
{
	int cx = event->motion.x / ZOOM / 8;
	int cy = event->motion.y / ZOOM / 8;
	switch(event->type) {
	case SDL_MOUSEBUTTONUP:
		DOWN = 0;
		break;
	case SDL_MOUSEBUTTONDOWN:
		if(cy == VER + 2)
			selectoption(cx - 1);
		else {
			select(cx - 1, cy - 1, 1, 1);
			DOWN = 1;
		}
		break;
	case SDL_MOUSEMOTION:
		if(DOWN)
			select(cursor.x, cursor.y, cx - cursor.x, cy - cursor.y);
		break;
	}
}

void
dokey(SDL_Event *event)
{
	int shift = SDL_GetModState() & KMOD_LSHIFT || SDL_GetModState() & KMOD_RSHIFT;
	int ctrl = SDL_GetModState() & KMOD_LCTRL || SDL_GetModState() & KMOD_RCTRL;
	if(ctrl) {
		switch(event->key.keysym.sym) {
		/* Generic */
		case SDLK_n: makedoc(&doc, "untitled.orca"); break;
		case SDLK_r: opendoc(&doc, doc.name); break;
		case SDLK_s: savedoc(&doc, doc.name); break;
		case SDLK_h: setmode(&GUIDES, !GUIDES); break;
		/* Edit */
		case SDLK_i: setmode(&MODE, !MODE); break;
		case SDLK_a: select(0, 0, doc.grid.w, doc.grid.h); break;
		case SDLK_x: cutclip(&cursor, clip); break;
		case SDLK_c: copyclip(&cursor, clip); break;
		case SDLK_v: pasteclip(&cursor, clip, shift); break;
		case SDLK_UP: moveclip(&cursor, clip, 0, -1); break;
		case SDLK_DOWN: moveclip(&cursor, clip, 0, 1); break;
		case SDLK_LEFT: moveclip(&cursor, clip, -1, 0); break;
		case SDLK_RIGHT: moveclip(&cursor, clip, 1, 0); break;
		case SDLK_SLASH: comment(&cursor); break;
		}
	} else {
		switch(event->key.keysym.sym) {
		case SDLK_ESCAPE: reset(); break;
		case SDLK_PAGEUP: setmode(&BPM, BPM + 1); break;
		case SDLK_PAGEDOWN: setmode(&BPM, BPM - 1); break;
		case SDLK_UP: shift ? scale(0, -1) : move(0, -1); break;
		case SDLK_DOWN: shift ? scale(0, 1) : move(0, 1); break;
		case SDLK_LEFT: shift ? scale(-1, 0) : move(-1, 0); break;
		case SDLK_RIGHT: shift ? scale(1, 0) : move(1, 0); break;
		case SDLK_SPACE: setmode(&PAUSE, !PAUSE); break;
		case SDLK_BACKSPACE: insert('.'); break;
		}
	}
}

void
dotext(SDL_Event *event)
{
	int i;
	for(i = 0; i < SDL_TEXTINPUTEVENT_TEXT_SIZE; ++i) {
		char c = event->text.text[i];
		if(c < ' ' || c > '~')
			break;
		insert(c);
	}
}

int
init(void)
{
	int i, j;
	if(SDL_Init(SDL_INIT_VIDEO) < 0)
		return error("Init", SDL_GetError());
	gWindow = SDL_CreateWindow("Orca",
		SDL_WINDOWPOS_UNDEFINED,
		SDL_WINDOWPOS_UNDEFINED,
		WIDTH * ZOOM,
		HEIGHT * ZOOM,
		SDL_WINDOW_SHOWN);
	if(gWindow == NULL)
		return error("Window", SDL_GetError());
	gRenderer = SDL_CreateRenderer(gWindow, -1, 0);
	if(gRenderer == NULL)
		return error("Renderer", SDL_GetError());
	gTexture = SDL_CreateTexture(gRenderer,
		SDL_PIXELFORMAT_ARGB8888,
		SDL_TEXTUREACCESS_STATIC,
		WIDTH,
		HEIGHT);
	if(gTexture == NULL)
		return error("Texture", SDL_GetError());
	pixels = (Uint32 *)malloc(WIDTH * HEIGHT * sizeof(Uint32));
	if(pixels == NULL)
		return error("Pixels", "Failed to allocate memory");
	for(i = 0; i < HEIGHT; i++)
		for(j = 0; j < WIDTH; j++)
			pixels[i * WIDTH + j] = theme[0];
	initmidi();
	return 1;
}

int
main(int argc, char *argv[])
{
	Uint8 tick = 0;
	if(!init())
		return error("Init", "Failure");
	if(argc > 1) {
		if(!opendoc(&doc, argv[1]))
			makedoc(&doc, argv[1]);
	} else
		makedoc(&doc, "untitled.orca");
	while(1) {
		SDL_Event event;
		if(!PAUSE) {
			if(tick > 3) {
				frame();
				tick = 0;
			} else
				tick++;
		}
		SDL_Delay(60000 / BPM / 16);
		while(SDL_PollEvent(&event) != 0) {
			switch(event.type) {
			case SDL_QUIT: quit(); break;
			case SDL_MOUSEBUTTONUP:
			case SDL_MOUSEBUTTONDOWN:
			case SDL_MOUSEMOTION: domouse(&event); break;
			case SDL_KEYDOWN: dokey(&event); break;
			case SDL_TEXTINPUT: dotext(&event); break;
			case SDL_WINDOWEVENT:
				if(event.window.event == SDL_WINDOWEVENT_EXPOSED)
					redraw(pixels);
				break;
			}
		}
	}
	quit();
	return 0;
}
