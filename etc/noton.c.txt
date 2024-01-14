#include <SDL2/SDL.h>
#include <portmidi.h>
#include <porttime.h>
#include <stdio.h>

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
#define SZ (HOR * VER * 16)

typedef unsigned char Uint8;

#define GATEMAX 128
#define WIREMAX 256
#define WIREPTMAX 128
#define PORTMAX 32
#define INPUTMAX 12
#define OUTPUTMAX 12

#define CHANNELS 6
#define DEVICE 0

typedef enum {
	INPUT,
	OUTPUT,
	POOL,
	BASIC
} GateType;

typedef struct {
	int x, y;
} Point2d;

typedef struct Wire {
	int id, polarity, a, b, len, flex;
	Point2d points[WIREPTMAX];
} Wire;

typedef struct Gate {
	int id, polarity, locked, inlen, outlen, channel, note, sharp;
	Point2d pos;
	GateType type;
	Wire *inputs[PORTMAX], *outputs[PORTMAX];
} Gate;

typedef struct Noton {
	int alive, frame, channel, octave, glen, wlen;
	unsigned int speed;
	Gate gates[GATEMAX];
	Wire wires[WIREMAX];
	Gate *inputs[INPUTMAX], *outputs[OUTPUTMAX];
	PmStream *midi;
} Noton;

typedef struct Brush {
	int down;
	Point2d pos;
	Wire wire;
} Brush;

int WIDTH = 8 * HOR + 8 * PAD * 2;
int HEIGHT = 8 * (VER + 2) + 8 * PAD * 2;
int ZOOM = 2, GUIDES = 1;

Noton noton;
Brush brush;

Uint32 theme[] = {
	0x000000,
	0xffb545,
	0x72DEC2,
	0xffffff,
	0x222222};

Uint8 icons[][8] = {
	{0x38, 0x7c, 0xee, 0xd6, 0xee, 0x7c, 0x38, 0x00}, /* gate:input */
	{0x38, 0x44, 0x92, 0xaa, 0x92, 0x44, 0x38, 0x00}, /* gate:output */
	{0x38, 0x44, 0x82, 0x92, 0x82, 0x44, 0x38, 0x00}, /* gate:output-sharp */
	{0x38, 0x7c, 0xfe, 0xfe, 0xfe, 0x7c, 0x38, 0x00}, /* gate:binary */
	{0x10, 0x00, 0x10, 0xaa, 0x10, 0x00, 0x10, 0x00}, /* guide */
	{0x00, 0x00, 0x00, 0x82, 0x44, 0x38, 0x00, 0x00}, /* eye open */
	{0x00, 0x38, 0x44, 0x92, 0x28, 0x10, 0x00, 0x00}, /* eye closed */
	{0x10, 0x54, 0x28, 0xc6, 0x28, 0x54, 0x10, 0x00}  /* unsaved */
};

SDL_Window *gWindow = NULL;
SDL_Renderer *gRenderer = NULL;
SDL_Texture *gTexture = NULL;
Uint32 *pixels;

#pragma mark - Helpers

int
distance(Point2d a, Point2d b)
{
	return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
}

Point2d *
setpt2d(Point2d *p, int x, int y)
{
	p->x = x;
	p->y = y;
	return p;
}

Point2d *
clamp2d(Point2d *p, int step)
{
	return setpt2d(p, p->x / step * step, p->y / step * step);
}

Point2d
Pt2d(int x, int y)
{
	Point2d p;
	setpt2d(&p, x, y);
	return p;
}

#pragma mark - Midi

void
initmidi(void)
{
	int i;
	Pm_Initialize();
	for(i = 0; i < Pm_CountDevices(); ++i) {
		char const *name = Pm_GetDeviceInfo(i)->name;
		printf("Device #%d -> %s%s\n", i, name, i == DEVICE ? "[x]" : "[ ]");
	}
	Pm_OpenOutput(&noton.midi, DEVICE, NULL, 128, 0, NULL, 1);
}

void
playmidi(int channel, int octave, int note, int z)
{
	Pm_WriteShort(noton.midi,
		Pt_Time(),
		Pm_Message(0x90 + channel, (octave * 12) + note, z ? 100 : 0));
}

#pragma mark - Generics

Gate *
nearestgate(Noton *n, Point2d pos)
{
	int i;
	for(i = 0; i < n->glen; ++i) {
		Gate *g = &n->gates[i];
		if(distance(pos, g->pos) < 50)
			return g;
	}
	return NULL;
}

Gate *
gateat(Noton *n, Point2d pos)
{
	int i;
	for(i = 0; i < n->glen; ++i) {
		Gate *g = &n->gates[i];
		if(pos.x == g->pos.x && pos.y == g->pos.y)
			return g;
	}
	return NULL;
}

int
getpolarity(Gate *g)
{
	int i;
	if(g->inlen < 1)
		return -1;
	if(g->inlen == 1)
		return g->inputs[0]->polarity;
	for(i = 0; i < g->inlen; i++)
		if(g->inputs[i]->polarity != g->inputs[0]->polarity)
			return 0;
	return 1;
}

void
polarize(Gate *g)
{
	int i;
	if(g->type == OUTPUT) {
		int newpolarity = getpolarity(g);
		if(newpolarity != -1 && g->polarity != newpolarity)
			playmidi(noton.channel + g->channel, noton.octave, g->note, newpolarity);
		g->polarity = newpolarity;
	} else if(g->type == BASIC)
		g->polarity = getpolarity(g);
	for(i = 0; i < g->outlen; ++i)
		g->outputs[i]->polarity = g->polarity;
}

void
bang(Gate *g, int depth)
{
	int i, d = depth - 1;
	if(d && g) {
		polarize(g);
		if(g->type != OUTPUT)
			return;
		for(i = 0; i < g->outlen; ++i)
			if(&noton.gates[g->outputs[i]->b])
				bang(&noton.gates[g->outputs[i]->b], d);
	}
}

void
flex(Wire *w)
{
	int i;
	if(w->len < 3 || !w->flex || noton.frame % 15 != 0)
		return;
	for(i = 1; i < w->len - 1; ++i) {
		Point2d *a = &w->points[i - 1];
		Point2d *b = &w->points[i];
		Point2d *c = &w->points[i + 1];
		b->x = (a->x + b->x + c->x) / 3;
		b->y = (a->y + b->y + c->y) / 3;
	}
	w->flex--;
}

#pragma mark - Options

void
selchan(Noton *n, int channel)
{
	n->channel = channel;
	printf("Select channel #%d\n", n->channel);
}

void
modoct(Noton *n, int mod)
{
	if((n->octave > 0 && mod < 0) || (n->octave < 8 && mod > 0))
		n->octave += mod;
	printf("Select octave #%d\n", n->octave);
}

void
modspeed(Noton *n, int mod)
{
	if((n->speed > 10 && mod < 0) || (n->speed < 100 && mod > 0))
		n->speed += mod;
	printf("Select speed #%d\n", n->speed);
}

void
pause(Noton *n)
{
	n->alive = !n->alive;
	printf("%s\n", n->alive ? "Playing.." : "Paused.");
}

void
reset(Noton *n)
{
	int i, locked = 0;
	for(i = 0; i < n->wlen; i++)
		n->wires[i].len = 0;
	for(i = 0; i < n->glen; i++) {
		n->gates[i].inlen = 0;
		n->gates[i].outlen = 0;
		if(n->gates[i].locked)
			locked++;
	}
	n->wlen = 0;
	n->glen = locked;
	n->alive = 1;
}

/* Add/Remove */

Wire *
addwire(Noton *n, Wire *temp, Gate *from, Gate *to)
{
	int i;
	Wire *w = &n->wires[n->wlen];
	w->id = n->wlen++;
	w->polarity = -1;
	w->a = from->id;
	w->b = to->id;
	w->len = 0;
	w->flex = 4;
	for(i = 0; i < temp->len; i++)
		setpt2d(&w->points[w->len++], temp->points[i].x, temp->points[i].y);
	printf("Add wire #%d(#%d->#%d) \n", w->id, from->id, to->id);
	return w;
}

Gate *
addgate(Noton *n, GateType type, int polarity, Point2d pos)
{
	Gate *g = &n->gates[n->glen];
	g->id = n->glen++;
	g->polarity = polarity;
	g->channel = 0;
	g->note = 0;
	g->sharp = 0;
	g->inlen = 0;
	g->outlen = 0;
	g->type = type;
	setpt2d(&g->pos, pos.x, pos.y);
	printf("Add gate #%d \n", g->id);
	return g;
}

/* Wiring */

int
extendwire(Brush *b)
{
	if(b->wire.len >= WIREPTMAX)
		return 0;
	if(distance(b->wire.points[b->wire.len - 1], b->pos) < 20)
		return 0;
	setpt2d(&b->wire.points[b->wire.len++], b->pos.x, b->pos.y);
	return 1;
}

int
beginwire(Brush *b)
{
	Gate *gate = nearestgate(&noton, b->pos);
	Point2d *p = gate ? &gate->pos : &b->pos;
	b->wire.polarity = gate ? gate->polarity : -1;
	b->wire.len = 0;
	setpt2d(&b->wire.points[b->wire.len++], p->x + 4, p->y + 4);
	return 1;
}

int
abandon(Brush *b)
{
	b->wire.len = 0;
	return 1;
}

int
endwire(Brush *b)
{
	Wire *newwire;
	Gate *gatefrom, *gateto;
	if(b->wire.len < 1)
		return abandon(b);
	gatefrom = nearestgate(&noton, b->wire.points[0]);
	if(!gatefrom || gatefrom->outlen >= PORTMAX)
		return abandon(b);
	if(gatefrom->type == OUTPUT)
		return abandon(b);
	gateto = nearestgate(&noton, b->pos);
	if(!gateto || gateto->inlen >= PORTMAX)
		return abandon(b);
	if(gateto->type == INPUT || gatefrom == gateto)
		return abandon(b);
	setpt2d(&b->pos, gateto->pos.x + 4, gateto->pos.y + 4);
	extendwire(b);
	newwire = addwire(&noton, &b->wire, gatefrom, gateto);
	gatefrom->outputs[gatefrom->outlen++] = newwire;
	gateto->inputs[gateto->inlen++] = newwire;
	return abandon(b);
}

#pragma mark - Draw

void
putpixel(Uint32 *dst, int x, int y, int color)
{
	if(x >= 0 && x < WIDTH - 8 && y >= 0 && y < HEIGHT - 8)
		dst[(y + PAD * 8) * WIDTH + (x + PAD * 8)] = theme[color];
}

void
line(Uint32 *dst, int ax, int ay, int bx, int by, int color)
{
	int dx = abs(bx - ax), sx = ax < bx ? 1 : -1;
	int dy = -abs(by - ay), sy = ay < by ? 1 : -1;
	int err = dx + dy, e2;
	for(;;) {
		putpixel(dst, ax, ay, color);
		if(ax == bx && ay == by)
			break;
		e2 = 2 * err;
		if(e2 >= dy) {
			err += dy;
			ax += sx;
		}
		if(e2 <= dx) {
			err += dx;
			ay += sy;
		}
	}
}

void
drawicn(Uint32 *dst, int x, int y, Uint8 *sprite, int fg, int bg)
{
	int v, h;
	for(v = 0; v < 8; v++)
		for(h = 0; h < 8; h++) {
			int ch1 = (sprite[v] >> (7 - h)) & 0x1;
			putpixel(dst, x + h, y + v, ch1 ? fg : bg);
		}
}

void
drawgate(Uint32 *dst, Gate *g)
{
	switch(g->type) {
	case OUTPUT:
		drawicn(dst, g->pos.x, g->pos.y, icons[1 + g->sharp], g->polarity + 1 + g->sharp + 1, 0);
		break;
	case INPUT:
		drawicn(dst, g->pos.x, g->pos.y, icons[0], g->polarity + 1, 0);
		break;
	case POOL:
		drawicn(dst, g->pos.x, g->pos.y, icons[3], 1, 0);
		break;
	case BASIC:
		drawicn(dst, g->pos.x, g->pos.y, icons[3], g->polarity < 0 ? 3 : g->polarity + 1, 0);
		break;
	}
}

void
drawwire(Uint32 *dst, Wire *w, int color)
{
	int i;
	if(w->len < 2)
		return;
	for(i = 0; i < w->len - 1; i++) {
		Point2d *p1 = &w->points[i];
		Point2d *p2 = &w->points[i + 1];
		line(dst, p1->x, p1->y, p2->x, p2->y, (int)(noton.frame / 3) % w->len != i ? w->polarity + 1 : color);
	}
}

void
drawguides(Uint32 *dst)
{
	int x, y;
	for(x = 0; x < HOR; x++)
		for(y = 0; y < VER; y++)
			drawicn(dst, x * 8, y * 8, icons[4], 4, 0);
}

void
drawui(Uint32 *dst)
{
	int bottom = VER * 8 + 8;
	drawicn(dst, 0 * 8, bottom, icons[GUIDES ? 6 : 5], GUIDES ? 1 : 2, 0);
}

void
clear(Uint32 *dst)
{
	int i, j;
	for(i = 0; i < HEIGHT; i++)
		for(j = 0; j < WIDTH; j++)
			dst[i * WIDTH + j] = theme[0];
}

void
redraw(Uint32 *dst)
{
	int i;
	clear(dst);
	if(GUIDES)
		drawguides(dst);
	for(i = 0; i < noton.glen; i++)
		drawgate(dst, &noton.gates[i]);
	for(i = 0; i < noton.wlen; i++)
		drawwire(dst, &noton.wires[i], 2);
	drawwire(dst, &brush.wire, 3);
	drawui(dst);
	SDL_UpdateTexture(gTexture, NULL, dst, WIDTH * sizeof(Uint32));
	SDL_RenderClear(gRenderer);
	SDL_RenderCopy(gRenderer, gTexture, NULL, NULL);
	SDL_RenderPresent(gRenderer);
}

/* operation */

void
savemode(int *i, int v)
{
	*i = v;
	redraw(pixels);
}

void
selectoption(int option)
{
	switch(option) {
	case 0: savemode(&GUIDES, !GUIDES); break;
	}
}

void
run(Noton *n)
{
	int i;
	n->inputs[0]->polarity = (n->frame >> 2) % 2 == 0;
	n->inputs[2]->polarity = (n->frame >> 3) % 2 == 0;
	n->inputs[4]->polarity = (n->frame >> 4) % 2 == 0;
	n->inputs[6]->polarity = (n->frame >> 5) % 2 == 0;
	n->inputs[8]->polarity = (n->frame >> 6) % 2 == 0;
	n->inputs[10]->polarity = (n->frame >> 7) % 2 == 0;
	n->inputs[1]->polarity = (n->frame >> 3) % 4 == 0;
	n->inputs[3]->polarity = (n->frame >> 3) % 4 == 1;
	n->inputs[5]->polarity = (n->frame >> 3) % 4 == 2;
	n->inputs[7]->polarity = (n->frame >> 3) % 4 == 3;
	n->inputs[9]->polarity = 1;
	n->inputs[11]->polarity = 0;
	for(i = 0; i < n->glen; ++i)
		bang(&n->gates[i], 10);
	for(i = 0; i < n->wlen; ++i)
		flex(&n->wires[i]);
	n->frame++;
}

void
setup(Noton *n)
{
	int i, j;
	int sharps[12] = {0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0};
	for(i = 0; i < INPUTMAX; ++i) {
		int x = i % 2 == 0 ? 16 : 8;
		n->inputs[i] = addgate(n, INPUT, 0, Pt2d(x, 16 + i * 8));
		n->inputs[i]->locked = 1;
	}
	for(i = 0; i < CHANNELS; ++i) {
		for(j = 0; j < OUTPUTMAX; ++j) {
			int x = HOR * 8 - (j % 2 == 0 ? 24 : 16) - (i * 16);
			n->outputs[j] = addgate(n, OUTPUT, 0, Pt2d(x, 16 + j * 8));
			n->outputs[j]->locked = 1;
			n->outputs[j]->note = j + ((i % 3) * 24);
			n->outputs[j]->channel = i;
			n->outputs[j]->sharp = sharps[abs(n->outputs[j]->note) % 12];
		}
	}
	n->inputs[9]->type = POOL;
	n->inputs[11]->type = POOL;
}

/* options */

int
error(char *msg, const char *err)
{
	printf("Error %s: %s\n", msg, err);
	return 0;
}

void
modzoom(int mod)
{
	if((mod > 0 && ZOOM < 4) || (mod < 0 && ZOOM > 1)) {
		ZOOM += mod;
		SDL_SetWindowSize(gWindow, WIDTH * ZOOM, HEIGHT * ZOOM);
	}
}

void
quit(void)
{
	free(pixels);
	Pm_Terminate();
	SDL_DestroyTexture(gTexture);
	gTexture = NULL;
	SDL_DestroyRenderer(gRenderer);
	gRenderer = NULL;
	SDL_DestroyWindow(gWindow);
	gWindow = NULL;
	SDL_Quit();
	exit(0);
}

#pragma mark - Triggers

void
domouse(SDL_Event *event, Brush *b)
{
	setpt2d(&b->pos,
		(event->motion.x - (PAD * 8 * ZOOM)) / ZOOM,
		(event->motion.y - (PAD * 8 * ZOOM)) / ZOOM);
	switch(event->type) {
	case SDL_MOUSEBUTTONDOWN:
		if(event->motion.y / ZOOM / 8 - PAD == VER + 1) {
			selectoption(event->motion.x / ZOOM / 8 - PAD);
			break;
		}
		if(event->button.button == SDL_BUTTON_RIGHT)
			break;
		b->down = 1;
		if(beginwire(b))
			redraw(pixels);
		break;
	case SDL_MOUSEMOTION:
		if(event->button.button == SDL_BUTTON_RIGHT)
			break;
		if(b->down) {
			if(extendwire(b))
				redraw(pixels);
		}
		break;
	case SDL_MOUSEBUTTONUP:
		if(event->button.button == SDL_BUTTON_RIGHT) {
			if(b->pos.x < 24 || b->pos.x > HOR * 8 - 72)
				return;
			if(b->pos.x > HOR * 8 || b->pos.y > VER * 8)
				return;
			if(!gateat(&noton, *clamp2d(&b->pos, 8)))
				addgate(&noton, BASIC, -1, *clamp2d(&b->pos, 8));
			redraw(pixels);
			break;
		}
		b->down = 0;
		if(endwire(b))
			redraw(pixels);
		break;
	}
}

void
dokey(Noton *n, SDL_Event *event)
{
	switch(event->key.keysym.sym) {
	case SDLK_EQUALS:
	case SDLK_PLUS: modzoom(1); break;
	case SDLK_UNDERSCORE:
	case SDLK_MINUS: modzoom(-1); break;
	case SDLK_BACKSPACE: reset(n); break;
	case SDLK_SPACE: pause(n); break;
	case SDLK_UP: modoct(n, 1); break;
	case SDLK_DOWN: modoct(n, -1); break;
	case SDLK_LEFT: modspeed(n, 5); break;
	case SDLK_RIGHT: modspeed(n, -5); break;
	case SDLK_1: selchan(n, 0); break;
	case SDLK_2: selchan(n, 1); break;
	case SDLK_3: selchan(n, 2); break;
	case SDLK_4: selchan(n, 3); break;
	case SDLK_5: selchan(n, 4); break;
	case SDLK_6: selchan(n, 5); break;
	case SDLK_7: selchan(n, 6); break;
	case SDLK_8: selchan(n, 7); break;
	case SDLK_9: selchan(n, 8); break;
	}
}

int
init(void)
{
	if(SDL_Init(SDL_INIT_VIDEO) < 0)
		return error("Init", SDL_GetError());
	gWindow = SDL_CreateWindow("Noton",
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
	clear(pixels);
	initmidi();
	return 1;
}

int
main(int argc, char **argv)
{
	Uint32 begintime = 0;
	Uint32 endtime = 0;
	Uint32 delta = 0;

	noton.alive = 1;
	noton.speed = 40;
	noton.channel = 0;
	noton.octave = 2;

	if(!init())
		return error("Init", "Failure");

	setup(&noton);

	while(1) {
		SDL_Event event;
		if(!begintime)
			begintime = SDL_GetTicks();
		else
			delta = endtime - begintime;

		if(delta < noton.speed)
			SDL_Delay(noton.speed - delta);

		if(noton.alive) {
			run(&noton);
			redraw(pixels);
		}

		while(SDL_PollEvent(&event) != 0) {
			if(event.type == SDL_QUIT)
				quit();
			else if(event.type == SDL_MOUSEBUTTONUP ||
				event.type == SDL_MOUSEBUTTONDOWN ||
				event.type == SDL_MOUSEMOTION) {
				domouse(&event, &brush);
			} else if(event.type == SDL_KEYDOWN)
				dokey(&noton, &event);
			else if(event.type == SDL_WINDOWEVENT)
				if(event.window.event == SDL_WINDOWEVENT_EXPOSED)
					redraw(pixels);
		}

		begintime = endtime;
		endtime = SDL_GetTicks();
	}
	quit();
	(void)argc;
	(void)argv;
	return 0;
}
