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
#define PAD 2
#define VOICES 16
#define DEVICE 0

#define SZ (HOR * VER * 16)
#define CLIPSZ (HOR * VER) + VER + 1
#define MAXSZ (HOR * VER)

typedef unsigned char Uint8;

typedef struct Grid {
	int w, h, l, f, r;
	Uint8 var[36], data[MAXSZ], lock[MAXSZ], type[MAXSZ];
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
	int chn, val, vel, len;
} MidiNote;

Document doc;
char clip[CLIPSZ];
MidiNote voices[VOICES];
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

#pragma mark - HELPERS

int
clmp(int val, int min, int max)
{
	return (val >= min) ? (val <= max) ? val : max : min;
}

int
cisp(char c)
{
	return c == '.' || c == ':' || c == '#' || c == '*';
}

char
cchr(int v, char c)
{
	v = abs(v % 36);
	if(v >= 0 && v <= 9)
		return '0' + v;
	return (c >= 'A' && c <= 'Z' ? 'A' : 'a') + v - 10;
}

int
cb36(char c)
{
	if(c >= '0' && c <= '9')
		return c - '0';
	if(c >= 'A' && c <= 'Z')
		return c - 'A' + 10;
	if(c >= 'a' && c <= 'z')
		return c - 'a' + 10;
	return 0;
}

char
cuca(char c)
{
	return c >= 'a' && c <= 'z' ? 'A' + c - 'a' : c;
}

char
clca(char c)
{
	return c >= 'A' && c <= 'Z' ? 'a' + c - 'A' : c;
}

char
cinc(char c)
{
	return !cisp(c) ? cchr(cb36(c) + 1, c) : c;
}

char
cdec(char c)
{
	return !cisp(c) ? cchr(cb36(c) - 1, c) : c;
}

int
validposition(Grid *g, int x, int y)
{
	return x >= 0 && x <= g->w - 1 && y >= 0 && y <= g->h - 1;
}

int
validcharacter(char c)
{
	return cb36(c) || c == '0' || cisp(c);
}

int
ctbl(char c)
{
	int sharp, uc, deg, notes[] = {0, 2, 4, 5, 7, 9, 11};
	if(c >= '0' && c <= '9')
		return c - '0';
	sharp = c >= 'a' && c <= 'z';
	uc = sharp ? c - 'a' + 'A' : c;
	deg = uc <= 'B' ? 'G' - 'B' + uc - 'A' : uc - 'C';
	return deg / 7 * 12 + notes[deg % 7] + sharp;
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

#pragma mark - IO

char
getcell(Grid *g, int x, int y)
{
	if(validposition(g, x, y))
		return g->data[x + (y * g->w)];
	return '.';
}

void
setcell(Grid *g, int x, int y, char c)
{
	if(validposition(g, x, y) && validcharacter(c))
		g->data[x + (y * g->w)] = c;
}

int
gettype(Grid *g, int x, int y)
{
	if(validposition(g, x, y))
		return g->type[x + (y * g->w)];
	return 0;
}

void
settype(Grid *g, int x, int y, int t)
{
	if(validposition(g, x, y))
		g->type[x + (y * g->w)] = t;
}

void
setlock(Grid *g, int x, int y)
{
	if(validposition(g, x, y)) {
		g->lock[x + (y * g->w)] = 1;
		if(!gettype(g, x, y))
			settype(g, x, y, 1);
	}
}

void
setport(Grid *g, int x, int y, char c)
{
	setlock(g, x, y);
	settype(g, x, y, 5);
	setcell(g, x, y, c);
}

int
getport(Grid *g, int x, int y, int l)
{
	if(l) {
		setlock(g, x, y);
		settype(g, x, y, 4);
	} else
		settype(g, x, y, 2);
	return getcell(g, x, y);
}

int
getbang(Grid *g, int x, int y)
{
	return getcell(g, x - 1, y) == '*' || getcell(g, x + 1, y) == '*' || getcell(g, x, y - 1) == '*' || getcell(g, x, y + 1) == '*';
}

#pragma mark - MIDI

MidiNote *
sendmidi(int chn, int val, int vel, int len)
{
	int i = 0;
	/* Detrigger */
	for(i = 0; i < VOICES; ++i) {
		MidiNote *n = &voices[i];
		if(!n->len || n->chn != chn || n->val != val)
			continue;
		Pm_WriteShort(midi,
			Pt_Time(),
			Pm_Message(0x90 + n->chn, n->val, 0));
		n->len = 0;
	}
	/* Trigger */
	for(i = 0; i < VOICES; ++i) {
		MidiNote *n = &voices[i];
		if(n->len < 1) {
			n->chn = chn;
			n->val = val;
			n->vel = vel;
			n->len = len;
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
		MidiNote *n = &voices[i];
		if(n->len > 0) {
			n->len--;
			if(n->len == 0)
				Pm_WriteShort(midi,
					Pt_Time(),
					Pm_Message(0x90 + n->chn, n->val, 0));
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

#pragma mark - LIBRARY

void
opa(Grid *g, int x, int y, char c)
{
	char a = getport(g, x - 1, y, 0);
	char b = getport(g, x + 1, y, 1);
	setport(g, x, y + 1, cchr(cb36(a) + cb36(b), b));
	(void)c;
}

void
opb(Grid *g, int x, int y, char c)
{
	char a = getport(g, x - 1, y, 0);
	char b = getport(g, x + 1, y, 1);
	setport(g, x, y + 1, cchr(cb36(a) - cb36(b), b));
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
	setport(g, x, y + 1, cchr(g->f / rate_ % mod_, mod));
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
	if(x >= g->h - 1 || getcell(g, x + 1, y) != '.')
		setcell(g, x, y, '*');
	else {
		setcell(g, x, y, '.');
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
	setport(g, x, y + 1, cchr((cb36(val) + rate_) % mod_, mod));
	(void)c;
}

void
opj(Grid *g, int x, int y, char c)
{
	char link = getport(g, x, y - 1, 0);
	int i;
	if(link != c) {
		for(i = 1; y + i < 256; ++i)
			if(getcell(g, x, y + i) != c)
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
			setport(g, x + 1 + i, y + 1, g->var[cb36(key)]);
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
	setport(g, x, y + 1, cchr(cb36(a) * cb36(b), b));
	(void)c;
}

void
opn(Grid *g, int x, int y, char c)
{
	if(y <= 0 || getcell(g, x, y - 1) != '.')
		setcell(g, x, y, '*');
	else {
		setcell(g, x, y, '.');
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
		setlock(g, x + i, y + 1);
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
	key = (key ^ 61U) ^ (key >> 16);
	key = key + (key << 3);
	key = key ^ (key >> 4);
	key = key * 0x27d4eb2d;
	key = key ^ (key >> 15);
	setport(g, x, y + 1, cchr(key % (max_ - min_) + min_, max));
	(void)c;
}

void
ops(Grid *g, int x, int y, char c)
{
	if(y >= g->h - 1 || getcell(g, x, y + 1) != '.')
		setcell(g, x, y, '*');
	else {
		setcell(g, x, y, '.');
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
		setlock(g, x + 1 + i, y);
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
		g->var[cb36(w)] = r;
	else if(w == '.' && r != '.')
		setport(g, x, y + 1, g->var[cb36(r)]);
	(void)c;
}

void
opw(Grid *g, int x, int y, char c)
{
	if(x <= 0 || getcell(g, x - 1, y) != '.')
		setcell(g, x, y, '*');
	else {
		setcell(g, x, y, '.');
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
			if(getcell(g, x + i, y) != c)
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
	mod = val_ <= target_ - rate_ ? rate_ : val_ >= target_ + rate_ ? -rate_
																	: target_ - val_;
	setport(g, x, y + 1, cchr(val_ + mod, target));
	(void)c;
}

void
opcomment(Grid *g, int x, int y)
{
	int i;
	for(i = 1; x + i < 256; ++i) {
		setlock(g, x + i, y);
		if(getcell(g, x + i, y) == '#')
			break;
	}
	settype(g, x, y, 1);
}

void
opmidi(Grid *g, int x, int y)
{
	int chn, oct, nte, vel, len;
	chn = cb36(getport(g, x + 1, y, 1));
	if(chn == '.')
		return;
	oct = cb36(getport(g, x + 2, y, 1));
	if(oct == '.')
		return;
	nte = getport(g, x + 3, y, 1);
	if(cisp(nte))
		return;
	vel = getport(g, x + 4, y, 1);
	if(vel == '.')
		vel = 'z';
	len = getport(g, x + 5, y, 1);
	if(getbang(g, x, y)) {
		sendmidi(
			clmp(chn, 0, 16),
			12 * oct + ctbl(nte),
			clmp(cb36(vel), 0, 36),
			clmp(cb36(len), 1, 36));
		settype(g, x, y, 3);
	} else
		settype(g, x, y, 2);
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
	case '*': setcell(g, x, y, '.'); break;
	case '#': opcomment(g, x, y); break;
	case ':': opmidi(g, x, y); break;
	default: printf("Unknown operator[%d,%d]: %c\n", x, y, c);
	}
}

#pragma mark - GRID

void
initgridframe(Grid *g)
{
	int i;
	for(i = 0; i < g->l; ++i) {
		g->lock[i] = 0;
		g->type[i] = 0;
	}
	for(i = 0; i < 36; ++i)
		g->var[i] = '.';
}

int
rungrid(Grid *g)
{
	int i, x, y;
	initgridframe(g);
	for(i = 0; i < g->l; ++i) {
		char c = g->data[i];
		x = i % g->w;
		y = i / g->w;
		if(c == '.' || g->lock[i])
			continue;
		if(c >= '0' && c <= '9')
			continue;
		if(c >= 'a' && c <= 'z' && !getbang(g, x, y))
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
		setcell(g, i % g->w, i / g->w, '.');
	initgridframe(g);
}

#pragma mark - DRAW

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

void
setpixel(Uint32 *dst, int x, int y, int color)
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
			setpixel(dst, x + h, y + v, clr == 1 ? fg : bg);
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
		if(voices[i].len)
			n++;
	drawicon(dst, 13 * 8, bottom, n > 0 ? icons[2 + clmp(n, 0, 6)] : font[70], 2, 0);
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
			Uint8 *letter = font[getfont(x, y, getcell(&doc.grid, x, y), t, sel)];
			int fg = 0, bg = 0;
			if((sel && !MODE) || (sel && MODE && doc.grid.f % 2)) {
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

#pragma mark - OPTIONS

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
			setcell(&d->grid, x, y, c);
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
			fputc(getcell(&d->grid, x, y), f);
		fputc('\n', f);
	}
	fclose(f);
	d->unsaved = 0;
	scpy(name, d->name, 256);
	redraw(pixels);
	printf("Saved: %s\n", name);
}

void
transform(Rect2d *r, char (*fn)(char))
{
	int x, y;
	for(y = 0; y < r->h; ++y)
		for(x = 0; x < r->w; ++x)
			setcell(&doc.grid, r->x + x, r->y + y, fn(getcell(&doc.grid, r->x + x, r->y + y)));
	redraw(pixels);
}

void
setoption(int *i, int v)
{
	*i = v;
	redraw(pixels);
}

void
select(int x, int y, int w, int h)
{
	Rect2d r;
	r.x = clmp(x, 0, HOR - 1);
	r.y = clmp(y, 0, VER - 1);
	r.w = clmp(w, 1, HOR - x);
	r.h = clmp(h, 1, VER - y);
	if(r.x != cursor.x || r.y != cursor.y || r.w != cursor.w || r.h != cursor.h) {
		cursor = r;
		redraw(pixels);
	}
}

void
scale(int w, int h, int skip)
{
	select(cursor.x, cursor.y, cursor.w + (w * (skip ? 4 : 1)), cursor.h + (h * (skip ? 4 : 1)));
}

void
move(int x, int y, int skip)
{
	select(cursor.x + (x * (skip ? 4 : 1)), cursor.y + (y * (skip ? 4 : 1)), cursor.w, cursor.h);
}

void
reset(void)
{
	MODE = 0;
	GUIDES = 1;
	select(cursor.x, cursor.y, 1, 1);
}

void
comment(Rect2d *r)
{
	int y;
	char c = getcell(&doc.grid, r->x, r->y) == '#' ? '.' : '#';
	for(y = 0; y < r->h; ++y) {
		setcell(&doc.grid, r->x, r->y + y, c);
		setcell(&doc.grid, r->x + r->w - 1, r->y + y, c);
	}
	doc.unsaved = 1;
	redraw(pixels);
}

void
insert(char c)
{
	int x, y;
	for(x = 0; x < cursor.w; ++x)
		for(y = 0; y < cursor.h; ++y)
			setcell(&doc.grid, cursor.x + x, cursor.y + y, c);
	if(MODE)
		move(1, 0, 0);
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
	case 15: setoption(&GUIDES, !GUIDES); break;
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

#pragma mark - CLIP

void
copyclip(Rect2d *r, char *c)
{
	int x, y, i = 0;
	for(y = 0; y < r->h; ++y) {
		for(x = 0; x < r->w; ++x)
			c[i++] = getcell(&doc.grid, r->x + x, r->y + y);
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
			setcell(&doc.grid, x, y, insert && ch == '.' ? getcell(&doc.grid, x, y) : ch);
			x++;
		}
	}
	doc.unsaved = 1;
	redraw(pixels);
}

void
moveclip(Rect2d *r, char *c, int x, int y, int skip)
{
	copyclip(r, c);
	insert('.');
	move(x, y, skip);
	pasteclip(r, c, 0);
}

#pragma mark - TRIGGERS

void
domouse(SDL_Event *event)
{
	int cx = event->motion.x / ZOOM / 8 - PAD;
	int cy = event->motion.y / ZOOM / 8 - PAD;
	switch(event->type) {
	case SDL_MOUSEBUTTONUP:
		DOWN = 0;
		break;
	case SDL_MOUSEBUTTONDOWN:
		if(cy == VER + 1)
			selectoption(cx);
		else {
			select(cx, cy, 1, 1);
			DOWN = 1;
		}
		break;
	case SDL_MOUSEMOTION:
		if(DOWN)
			select(cursor.x, cursor.y, cx + 1 - cursor.x, cy + 1 - cursor.y);
		break;
	}
}

void
dokey(SDL_Event *event)
{
	int shift = SDL_GetModState() & KMOD_LSHIFT || SDL_GetModState() & KMOD_RSHIFT;
	int ctrl = SDL_GetModState() & KMOD_LCTRL || SDL_GetModState() & KMOD_RCTRL;
	int alt = SDL_GetModState() & KMOD_LALT || SDL_GetModState() & KMOD_RALT;
	if(ctrl) {
		switch(event->key.keysym.sym) {
		/* Generic */
		case SDLK_n: makedoc(&doc, "untitled.orca"); break;
		case SDLK_r: opendoc(&doc, doc.name); break;
		case SDLK_s: savedoc(&doc, doc.name); break;
		case SDLK_h: setoption(&GUIDES, !GUIDES); break;
		/* Edit */
		case SDLK_i: setoption(&MODE, !MODE); break;
		case SDLK_a: select(0, 0, doc.grid.w, doc.grid.h); break;
		case SDLK_x: cutclip(&cursor, clip); break;
		case SDLK_c: copyclip(&cursor, clip); break;
		case SDLK_v: pasteclip(&cursor, clip, shift); break;
		case SDLK_u: transform(&cursor, cuca); break;
		case SDLK_l: transform(&cursor, clca); break;
		case SDLK_LEFTBRACKET: transform(&cursor, cinc); break;
		case SDLK_RIGHTBRACKET: transform(&cursor, cdec); break;
		case SDLK_UP: moveclip(&cursor, clip, 0, -1, alt); break;
		case SDLK_DOWN: moveclip(&cursor, clip, 0, 1, alt); break;
		case SDLK_LEFT: moveclip(&cursor, clip, -1, 0, alt); break;
		case SDLK_RIGHT: moveclip(&cursor, clip, 1, 0, alt); break;
		case SDLK_SLASH: comment(&cursor); break;
		}
	} else {
		switch(event->key.keysym.sym) {
		case SDLK_ESCAPE: reset(); break;
		case SDLK_PAGEUP: setoption(&BPM, BPM + 1); break;
		case SDLK_PAGEDOWN: setoption(&BPM, BPM - 1); break;
		case SDLK_UP: shift ? scale(0, -1, alt) : move(0, -1, alt); break;
		case SDLK_DOWN: shift ? scale(0, 1, alt) : move(0, 1, alt); break;
		case SDLK_LEFT: shift ? scale(-1, 0, alt) : move(-1, 0, alt); break;
		case SDLK_RIGHT: shift ? scale(1, 0, alt) : move(1, 0, alt); break;
		case SDLK_SPACE:
			if(!MODE)
				setoption(&PAUSE, !PAUSE);
			break;
		case SDLK_BACKSPACE:
			insert('.');
			if(MODE)
				move(-2, 0, alt);
			break;
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
