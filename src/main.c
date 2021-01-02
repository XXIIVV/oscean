#include <stdio.h>
#include <time.h>

#include "projects/standard/standard.h"
#include "projects/arvelie/arvelie.h"

#define STRMEM 4096 * 96
#define GLOMEM 100
#define LEXMEM 500
#define HORMEM 4000
#define ITEMS 64
#define EPOCH 2006

#define NAME "XXIIVV"
#define DOMAIN "https://wiki.xxiivv.com/"
#define LOCATION "Victoria, Canada"
#define REPOPATH "https://github.com/XXIIVV/oscean/blob/master/src/"

typedef struct Block {
	int len;
	char data[STRMEM];
} Block;

typedef struct List {
	int len, routes;
	char *name, *keys[ITEMS], *vals[ITEMS];
} List;

typedef struct Term {
	int body_len;
	int children_len;
	int incoming_len;
	int outgoing_len;
	int logs_len;
	int events_len;
	int ch;
	int fh;
	char *name;
	char *host;
	char *bref;
	char *type;
	char *filename;
	char *date_from;
	char *date_last;
	char *body[ITEMS];
	struct List link;
	struct Term *parent;
	struct Term *children[ITEMS];
	struct Term *incoming[ITEMS];
} Term;

typedef struct Log {
	int code, pict;
	char rune, *date, *name;
	Term *term;
} Log;

typedef struct Glossary {
	int len;
	List lists[GLOMEM];
} Glossary;

typedef struct Lexicon {
	int len;
	Term terms[LEXMEM];
} Lexicon;

typedef struct Journal {
	int len;
	Log logs[HORMEM];
} Journal;

int
error(char *msg, char *val)
{
	printf("Error: %s(%s)\n", msg, val);
	return 0;
}

int
errorid(char *msg, char *val, int id)
{
	printf("Error: %s:%d(%s)\n", msg, id, val);
	return 0;
}

/* Block */

char *
push(Block *b, char *s)
{
	int i = 0, o = b->len;
	while(s[i])
		b->data[b->len++] = s[i++];
	b->data[b->len++] = '\0';
	return &b->data[o];
}

/* List */

List *
makelist(List *l, char *name)
{
	l->len = 0;
	l->routes = 0;
	l->name = slca(name);
	return l;
}

List *
findlist(Glossary *glo, char *name)
{
	int i;
	for(i = 0; i < glo->len; ++i)
		if(scmp(name, glo->lists[i].name))
			return &glo->lists[i];
	return NULL;
}

/* Term */

Term *
maketerm(Term *t, char *name)
{
	t->body_len = 0;
	t->children_len = 0;
	t->incoming_len = 0;
	t->outgoing_len = 0;
	t->logs_len = 0;
	t->events_len = 0;
	t->ch = 0;
	t->fh = 0;
	t->name = slca(name);
	return t;
}

Term *
findterm(Lexicon *lex, char *name)
{
	int i;
	scsw(slca(name), '_', ' ');
	for(i = 0; i < lex->len; ++i)
		if(scmp(name, lex->terms[i].name))
			return &lex->terms[i];
	return NULL;
}

char *
statusterm(Term *t)
{
	if(t->type && scmp(t->type, "alias"))
		return "alias";
	if(t->body_len < 1)
		return "stub";
	if(t->incoming_len < 1)
		return "orphan";
	if(t->outgoing_len < 1)
		return "deadend";
	if(t->logs_len < 2)
		return "article";
	return "";
}

/* Log */

Log *
makelog(Log *l, char *date)
{
	l->code = 0;
	l->pict = 0;
	l->date = date;
	return l;
}

Log *
finddiary(Journal *jou, Term *t, int deep)
{
	int i;
	for(i = 0; i < jou->len; ++i)
		if(jou->logs[i].term == t && jou->logs[i].pict > 0)
			return &jou->logs[i];
	if(deep)
		for(i = 0; i < t->children_len; ++i)
			return finddiary(jou, t->children[i], 0);
	return NULL;
}

/* File */

FILE *
getfile(char *dir, char *filename, char *ext, char *op)
{
	char filepath[1024];
	filepath[0] = '\0';
	scat(filepath, dir);
	scat(filepath, filename);
	scat(filepath, ext);
	scat(filepath, "\0");
	return fopen(filepath, op);
}

/* Etcs */

float
clockoffset(clock_t start)
{
	return (((double)(clock() - start)) / CLOCKS_PER_SEC) * 1000;
}

void
fpRFC2822(FILE *f, time_t t)
{
	struct tm *tm = localtime(&t);
	char *days[7] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
	char *months[12] = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
	fprintf(f, "%s, %02d %s %d 00:00:00 +0900", days[tm->tm_wday], tm->tm_mday, months[tm->tm_mon], tm->tm_year + 1900);
}

void
fpRFC3339(FILE *f, time_t t)
{
	struct tm *tm = localtime(&t);
	fprintf(f,
		"%04d-%02d-%02dT%02d:%02d:%02d%c%02d:%02d",
		tm->tm_year + 1900,
		tm->tm_mon + 1,
		tm->tm_mday,
		tm->tm_hour,
		tm->tm_min,
		tm->tm_sec,
		'-',
		7, /* Vancouver GMT-7*/
		0);
}

int
marble(int year, int month, int day)
{
	struct tm birth;
	birth.tm_year = year - 1900;
	birth.tm_mon = month - 1;
	birth.tm_mday = day;
	return (time(NULL) - mktime(&birth)) / 604800;
}

/* File Print */

void
fplifeline(FILE *f, Journal *jou, Term *t)
{
	int limit_from = arveliedays(jou->logs[jou->len - 1].date);
	int limit_to = arveliedays(jou->logs[0].date) - limit_from;
	int range_from = arveliedays(t->date_from) - limit_from;
	int range_to = arveliedays(t->date_last) - limit_from;
	int i, period = (limit_to - limit_from) / 5;
	int a = range_from / period, b = range_to / period;
	fputs("<code style='float:right; font-size:80%'>", f);
	for(i = 0; i < 6; i++) {
		if(i >= a && i <= b)
			fputs("|", f);
		else
			fputs("-", f);
	}
	fputs("</code>", f);
}

void
fppict(FILE *f, int pict, char *host, char *name, int caption, char *link)
{
	fputs("<figure>", f);
	fprintf(f, "<img src='../media/diary/%d.jpg' alt='%s picture' width='900'/>", pict, name);
	if(caption) {
		fputs("<figcaption>", f);
		if(link)
			fprintf(f, "<a href='%s.html'>%s</a> — %s", link, host, name);
		else
			fprintf(f, "%s — %s", host, name);
		fputs("</figcaption>", f);
	}
	fputs("</figure>", f);
}

void
fplogpict(FILE *f, Log *l, int caption)
{
	fppict(f, l->pict, l->date, l->name, caption, NULL);
}

void
fptemplatelink(FILE *f, Lexicon *lex, Term *t, char *s)
{
	int split = scin(s, ' ');
	char target[256], name[256];
	/* find target and name */
	if(split == -1)
		scpy(sstr(s, target, 0, slen(s)), name);
	else {
		sstr(s, target, 0, split);
		sstr(s, name, split + 1, slen(s) - split);
	}
	/* output */
	if(surl(target)) {
		if(f)
			fprintf(f, "<a href='%s' target='_blank'>%s</a>", target, name);
	} else {
		Term *tt = findterm(lex, target);
		if(!tt)
			error("Unknown link", target);
		if(f)
			fprintf(f, "<a href='%s.html'>%s</a>", tt->filename, name);
		else {
			tt->incoming[tt->incoming_len++] = t;
			t->outgoing_len++;
		}
	}
}

int
fplist(FILE *f, Glossary *glo, char *target)
{
	int j;
	List *l = findlist(glo, target);
	if(!l)
		return error("Unknown list", target);
	fprintf(f, "<h3>%s</h3>", l->name);
	fputs("<ul>", f);
	for(j = 0; j < l->len; ++j)
		if(!l->keys[j])
			fprintf(f, "<li>%s</li>", l->vals[j]);
		else if(surl(l->vals[j]))
			fprintf(f, "<li><a href='%s'>%s</a></li>", l->vals[j], l->keys[j]);
		else
			fprintf(f, "<li><b>%s</b>: %s</li>", l->keys[j], l->vals[j]);
	fputs("</ul>", f);
	l->routes++;
	return 1;
}

int
fpinclude(FILE *f, char *target, int text, int req)
{
	int lines = 0;
	char c;
	char *folder = text ? "inc/text/" : "inc/html/";
	char *ext = text ? ".txt" : ".htm";
	FILE *fp = getfile(folder, target, ext, "r");
	if(!fp) {
		if(req)
			return error("Missing include", target);
		else
			return 0;
	}
	fputs("<figure>", f);
	if(text)
		fputs("<pre>", f);
	while((c = fgetc(fp)) != EOF) {
		if(text) {
			if(c == '<')
				fputs("&lt;", f);
			else if(c == '>')
				fputs("&gt;", f);
			else if(c == '&')
				fputs("&amp;", f);
			else
				fputc(c, f);
		} else
			fputc(c, f);
		if(c == '\n')
			lines++;
	}
	fclose(fp);
	if(text)
		fputs("</pre>", f);
	fprintf(f, "<figcaption>&mdash; Submit an <a href='" REPOPATH "%s%s%s' target='_blank'>edit</a> to <a href='../src/%s%s%s'>%s%s</a>(%d lines)</figcaption>\n", folder, target, ext, folder, target, ext, target, ext, lines);
	fputs("</figure>", f);
	return 1;
}

void
fpmodule(FILE *f, Glossary *glo, char *s)
{
	int split = scin(s, ' ');
	char cmd[256], target[256];
	sstr(s, cmd, 1, split - 1);
	sstr(s, target, split + 1, slen(s) - split);
	if(scmp(cmd, "itchio"))
		fprintf(f, "<iframe frameborder='0' src='https://itch.io/embed/%s?link_color=000000' width='624' height='167'></iframe>", target);
	else if(scmp(cmd, "bandcamp"))
		fprintf(f, "<iframe style='border: 0; width: 624px; height: 274px;' src='https://bandcamp.com/EmbeddedPlayer/album=%s/size=large/bgcol=ffffff/linkcol=333333/artwork=small' seamless></iframe>", target);
	else if(scmp(cmd, "youtube"))
		fprintf(f, "<iframe width='624' height='380' src='https://www.youtube.com/embed/%s?rel=0' style='max-width:700px' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>", target);
	else if(scmp(cmd, "redirect"))
		fprintf(f, "<meta http-equiv='refresh' content='2; url=%s.html'/><p>In a hurry? Travel to <a href='%s.html'>%s</a>.</p>", target, target, target);
	else if(scmp(cmd, "list"))
		fplist(f, glo, target);
	else if(scmp(cmd, "text"))
		fpinclude(f, target, 1, 1);
	else if(scmp(cmd, "html"))
		fpinclude(f, target, 0, 1);
	else if(scmp(cmd, "img")) {
		int split2 = scin(target, ' ');
		if(split2 > 0) {
			char param[256], value[256];
			sstr(target, param, 0, split2);
			sstr(target, value, split2 + 1, slen(target) - split2);
			fprintf(f, "<img src='../media/%s' width='%s'/>&nbsp;", param, value);
		} else
			fprintf(f, "<img src='../media/%s'/>&nbsp;", target);
	} else
		printf("Warning: Missing template mod: %s\n", s);
}

void
fptemplate(FILE *f, Glossary *glo, Lexicon *lex, Term *t, char *s)
{
	int i, capture = 0;
	char buf[1024];
	buf[0] = '\0';
	for(i = 0; i < slen(s); ++i) {
		char c = s[i];
		if(c == '}') {
			capture = 0;
			if(buf[0] == '^' && f)
				fpmodule(f, glo, buf);
			else if(buf[0] != '^')
				fptemplatelink(f, lex, t, buf);
		}
		if(capture)
			ccat(buf, c);
		else if(c != '{' && c != '}' && f)
			fputc(c, f);
		if(c == '{') {
			capture = 1;
			buf[0] = '\0';
		}
	}
}

void
fpbodypart(FILE *f, Glossary *glo, Lexicon *lex, Term *t)
{
	int i;
	for(i = 0; i < t->body_len; ++i)
		fptemplate(f, glo, lex, t, t->body[i]);
}

void
fpbanner(FILE *f, Journal *jou, Term *t, int caption)
{
	Log *l = finddiary(jou, t, 0);
	if(l)
		fplogpict(f, l, caption);
}

void
fpnavsub(FILE *f, Term *t, Term *target)
{
	int i;
	fputs("<ul>", f);
	for(i = 0; i < t->children_len; ++i) {
		Term *tc = t->children[i];
		if(tc->name == t->name)
			continue; /* Paradox */
		if(tc->type && scmp(tc->type, "hidden"))
			continue;
		if(tc->type && scmp(tc->type, "alias"))
			continue;
		if(tc->name == target->name)
			fprintf(f, "<li><a href='%s.html'>%s/</a></li>", tc->filename, tc->name);
		else
			fprintf(f, "<li><a href='%s.html'>%s</a></li>", tc->filename, tc->name);
	}
	fputs("</ul>", f);
}

void
fpnav(FILE *f, Term *t)
{
	if(!t->parent)
		error("Missing parent", t->name);
	if(!t->parent->parent)
		error("Missing parent", t->parent->name);
	fputs("<nav>", f);
	if(t->parent->parent->name == t->parent->name)
		fpnavsub(f, t->parent->parent, t);
	else
		fpnavsub(f, t->parent->parent, t->parent);
	if(t->parent->parent->name != t->parent->name)
		fpnavsub(f, t->parent, t);
	if(t->parent->name != t->name)
		fpnavsub(f, t, t);
	fputs("</nav>", f);
}

void
fpbody(FILE *f, Glossary *glo, Lexicon *lex, Term *t)
{
	fprintf(f, "<h2>%s</h2>", t->bref);
	fpbodypart(f, glo, lex, t);
}

void
fpportal(FILE *f, Glossary *glo, Lexicon *lex, Journal *jou, Term *t, int pict, int text)
{
	int i;
	for(i = 0; i < t->children_len; ++i) {
		Term *tc = t->children[i];
		if(tc->type && scmp(tc->type, "hidden"))
			continue;
		if(pict) {
			Log *l = finddiary(jou, tc, 1);
			if(l)
				fppict(f, l->pict, tc->name, tc->bref, 1, tc->filename);
		}
		if(text) {
			fprintf(f, "<h2><a href='%s.html'>%s</a></h2>", tc->filename, tc->name);
			fprintf(f, "<h4>%s</h4>", tc->bref);
			fpbodypart(f, glo, lex, tc);
		}
	}
}

void
fpalbum(FILE *f, Journal *jou, Term *t)
{
	int i;
	for(i = 0; i < jou->len; ++i) {
		Log l = jou->logs[i];
		if(l.term != t || l.pict < 1 || l.pict == finddiary(jou, t, 0)->pict)
			continue;
		fplogpict(f, &l, 1);
	}
}

void
fplinks(FILE *f, Term *t)
{
	int i;
	if(t->link.len < 1)
		return;
	fputs("<ul>", f);
	for(i = 0; i < t->link.len; ++i)
		fprintf(f, "<li><a href='%s' target='_blank'>%s</a></li>", t->link.vals[i], t->link.keys[i]);
	fputs("</ul>", f);
}

void
fpincoming(FILE *f, Term *t)
{
	int i;
	if(t->incoming_len < 1)
		return;
	fputs("<p>", f);
	fprintf(f, "<i>incoming(%d)</i>: ", t->incoming_len);
	for(i = 0; i < t->incoming_len; ++i)
		fprintf(f, "<a href='%s.html'>%s</a> ", t->incoming[i]->filename, t->incoming[i]->name);
	fputs("</p>", f);
}

void
fphoraire(FILE *f, Journal *jou, Term *t)
{
	int i;
	if(t->logs_len < 2 || !t->date_last)
		return;
	fputs("<p>", f);
	fprintf(f, "<i>Last update on <a href='tracker.html'>%s</a>, edited %d times. +%d/%dfh <b>%s</b></i> ", t->date_last, t->logs_len, t->ch, t->fh, statusterm(t));
	fplifeline(f, jou, t);
	fputs("</p>", f);
	/* Events */
	if(t->events_len < 1)
		return;
	fputs("<ul>", f);
	for(i = 0; i < jou->len; ++i) {
		Log *l = &jou->logs[i];
		if(l->rune != '+')
			continue;
		if(l->term != t && l->term->parent != t)
			continue;
		fprintf(f, "<li>%s — %s</li>", l->date, l->name);
	}
	fputs("</ul>", f);
}

void
fphome(FILE *f, Journal *jou)
{
	int i, events = 0;
	for(i = 0; i < 5; ++i) {
		if(jou->logs[i].rune == '+') {
			events = 1;
			break;
		}
	}
	if(!events)
		return;
	fputs("<h2>Events</h2>", f);
	fputs("<ul>", f);
	for(i = 0; i < 5; ++i) {
		if(jou->logs[i].rune != '+')
			continue;
		fprintf(f, "<li><a href='%s.html'>%s</a> %s</li>", jou->logs[i].term->filename, jou->logs[i].date, jou->logs[i].name);
	}
	fputs("</ul>", f);
}

void
fpcalendar(FILE *f, Journal *jou)
{
	int i, last_year = 0;
	fputs("<ul>", f);
	for(i = 0; i < jou->len; ++i) {
		if(jou->logs[i].rune != '+')
			continue;
		if(last_year != sint(jou->logs[i].date, 2))
			fputs("</ul><ul>", f);
		fprintf(f, "<li><a href='%s.html'>%s</a> %s</li>", jou->logs[i].term->filename, jou->logs[i].date, jou->logs[i].name);
		last_year = sint(jou->logs[i].date, 2);
	}
	fputs("</ul>", f);
}

void
fptracker(FILE *f, Journal *jou)
{
	char *known[LEXMEM];
	int i, known_id = 0, last_year = 20, offset = arveliedays(jou->logs[0].date);
	fputs("<ul>", f);
	for(i = 0; i < jou->len; ++i) {
		Log *l = &jou->logs[i];
		if(offset - arveliedays(l->date) < 0)
			continue;
		if(afnd(known, known_id, l->term->name) > -1)
			continue;
		if(last_year != sint(l->date, 2))
			fputs("</ul><ul>", f);
		fputs("<li>", f);
		fprintf(f, "<a href='%s.html'>%s</a> — last update %s", l->term->filename, l->term->name, l->date);
		fplifeline(f, jou, l->term);
		fputs("</li>", f);
		last_year = sint(l->date, 2);
		known[known_id] = l->term->name;
		known_id++;
	}
	fputs("</ul>", f);
}

void
fpjournal(FILE *f, Journal *jou)
{
	int i, count = 0;
	for(i = 0; i < jou->len; ++i) {
		if(count > 20)
			break;
		if(jou->logs[i].pict == 0)
			continue;
		fplogpict(f, &jou->logs[i], 1);
		count++;
	}
}

void
fpnow(FILE *f, Lexicon *lex, Journal *jou)
{
	int i, projects_len = 0;
	char *pname[56], *pfname[56];
	double sum_value = 0, pval[56], pmaxval = 0;
	time_t now;
	time(&now);
	for(i = 0; i < 56; ++i) {
		int index = 0;
		Log l = jou->logs[i];
		if(arveliedays(l.date) < 56)
			break;
		if(l.code % 10 < 1)
			continue;
		index = afnd(pname, projects_len, l.term->name);
		if(index < 0) {
			index = projects_len;
			pname[index] = l.term->name;
			pfname[index] = l.term->filename;
			pval[index] = 0;
			projects_len++;
		}
		pval[index] += l.code % 10;
		sum_value += l.code % 10;
	}
	/* find most active with a photo */
	for(i = 0; i < projects_len; ++i) {
		if(finddiary(jou, findterm(lex, pname[i]), 0) && pval[i] > pmaxval)
			pmaxval = pval[i];
	}
	for(i = 0; i < projects_len; ++i) {
		if(pval[i] != pmaxval)
			continue;
		fplogpict(f, finddiary(jou, findterm(lex, pname[i]), 0), 1);
		break;
	}
	fprintf(
		f,
		"<p>This data shows the distribution of <b>%.0f hours over %d projects</b>, "
		"recorded during the last %d days, for an average of %.1f work hours per day "
		"and %.1f work hours per project.</p>",
		sum_value,
		projects_len,
		56,
		sum_value / 56,
		sum_value / projects_len);
	fputs("<ul style='columns:2'>", f);
	for(i = 0; i < projects_len; ++i) {
		fputs("<li>", f);
		fprintf(f, "<a href='%s.html'>%s</a> %.2f&#37; ", pfname[i], pname[i], pval[i] / sum_value * 100);
		fputs("</li>", f);
	}
	fputs("</ul>", f);
	fprintf(f, "<p>Last generated on %s(" LOCATION ").</p>", ctime(&now));
}

void
fpindexsub(FILE *f, Term *t, int depth)
{
	int i;
	fprintf(f, "<li><a href='%s.html'>%s</a> <i>%s</i></li>", t->filename, t->name, statusterm(t));
	if(t->children_len < 1)
		return;
	fputs("<ul>", f);
	for(i = 0; i < t->children_len; ++i)
		if(!scmp(t->children[i]->name, t->name))
			fpindexsub(f, t->children[i], depth++);
	fputs("</ul>", f);
}

void
fpindex(FILE *f, Lexicon *lex, Journal *jou)
{
	int i, sends = 0, stubs = 0, orphans = 0, deadends = 0;
	for(i = 0; i < lex->len; ++i) {
		Term *t = &lex->terms[i];
		sends += t->incoming_len;
		if(t->body_len < 1)
			stubs++;
		if(t->incoming_len < 1)
			orphans++;
		if(t->outgoing_len < 1)
			deadends++;
	}
	fprintf(f, "<p>This wiki hosts %d journal logs recorded on %d lexicon terms, connected by %d inbound links. It is a living document in which %d stubs, %d orphans and %d deadends still remain.</p>", jou->len, lex->len, sends, stubs, orphans, deadends);
	fputs("<ul>", f);
	fpindexsub(f, &lex->terms[0], 0);
	fputs("</ul>", f);
}

void
fphtml(FILE *f, Glossary *glo, Lexicon *lex, Term *t, Journal *jou)
{
	Term *alias = NULL;
	if(t->type && scmp(t->type, "alias"))
		alias = findterm(lex, t->host);
	fputs("<!DOCTYPE html><html lang='en'>", f);
	fputs("</head>", f);
	fprintf(f, "<meta charset='utf-8'>"
			   "<meta name='description' content='%s'/>"
			   "<meta name='thumbnail' content='" DOMAIN "media/services/thumbnail.jpg' />"
			   "<meta name='viewport' content='width=device-width,initial-scale=1'>"
			   "<link rel='alternate' type='application/rss+xml' title='RSS Feed' href='../links/rss.xml' />"
			   "<link rel='stylesheet' type='text/css' href='../links/main.css'>"
			   "<link rel='shortcut icon' type='image/png' href='../media/services/icon.png'>"
			   "<title>" NAME " — %s</title>",
		t->bref,
		t->name);
	fputs("</head>", f);
	fputs("<body>", f);
	fputs("<header><a href='home.html'><img src='../media/icon/logo.svg' alt='" NAME "' height='29'></a></header>", f);
	fpnav(f, alias ? alias : t);
	fputs("<main>", f);
	fpbanner(f, jou, alias ? alias : t, 1);
	fpbody(f, glo, lex, alias ? alias : t);
	fpinclude(f, alias ? alias->filename : t->filename, 0, 0);
	if(t->type) {
		if(scmp(t->type, "pict_portal"))
			fpportal(f, glo, lex, jou, alias ? alias : t, 1, 0);
		else if(scmp(t->type, "text_portal"))
			fpportal(f, glo, lex, jou, alias ? alias : t, 0, 1);
		else if(scmp(t->type, "album"))
			fpalbum(f, jou, alias ? alias : t);
		else if(scmp(t->type, "alias"))
			fprintf(f, "<p>Redirected to <a href='%s.html'>%s</a>, from <b>%s</b>.</p>", alias->filename, alias->name, t->name);
		else if(!scmp(t->type, "hidden"))
			error("Unknown template", t->type);
	}
	if(scmp(t->name, "now"))
		fpnow(f, lex, jou);
	else if(scmp(t->name, "home"))
		fphome(f, jou);
	else if(scmp(t->name, "calendar"))
		fpcalendar(f, jou);
	else if(scmp(t->name, "tracker"))
		fptracker(f, jou);
	else if(scmp(t->name, "journal"))
		fpjournal(f, jou);
	else if(scmp(t->name, "index"))
		fpindex(f, lex, jou);
	fplinks(f, alias ? alias : t);
	fpincoming(f, alias ? alias : t);
	fphoraire(f, jou, alias ? alias : t);
	fputs("</main>", f);
	fputs("<footer>", f);
	fputs("<a href='https://creativecommons.org/licenses/by-nc-sa/4.0'><img src='../media/icon/cc.svg' width='30'/></a>", f);
	fputs("<a href='http://webring.xxiivv.com/'><img src='../media/icon/rotonde.svg' width='30'/></a>", f);
	fputs("<a href='https://merveilles.town/@neauoire'><img src='../media/icon/merveilles.svg' width='30'/></a>", f);
	fputs("<a href='https://github.com/neauoire'><img src='../media/icon/github.png' alt='github' width='30'/></a>", f);
	fputs("<span><a href='devine_lu_linvega.html'>Devine Lu Linvega</a> © 2020 — <a href='about.html'>BY-NC-SA 4.0</a></span>", f);
	fputs("</footer>", f);
	fputs("</body></html>", f);
	fclose(f);
}

void
fprss(FILE *f, Journal *jou)
{
	int i;
	time_t now;
	fputs("<?xml version='1.0' encoding='UTF-8' ?>\n", f);
	fputs("<rss version='2.0' xmlns:dc='http://purl.org/dc/elements/1.1/'>\n", f);
	fputs("<channel>\n", f);
	fputs("<title>" NAME "</title>\n", f);
	fputs("<link>" DOMAIN "Journal</link>\n", f);
	fputs("<description>The Nataniev Library</description>\n", f);
	/* Date */
	fputs("<lastBuildDate>", f);
	fpRFC2822(f, time(&now));
	fputs("</lastBuildDate>\n", f);
	/* Image */
	fputs("<image>\n", f);
	fputs("  <url>" DOMAIN "media/services/rss.jpg</url>\n", f);
	fputs("  <title>The Nataniev Library</title>\n", f);
	fputs("  <link>" DOMAIN "Journal</link>\n", f);
	fputs("</image>\n", f);
	for(i = 0; i < jou->len; ++i) {
		Log l = jou->logs[i];
		if(l.pict == 0)
			continue;
		fputs("<item>\n", f);
		fprintf(f, "  <title>%s</title>\n", l.name);
		fprintf(f, "  <link>" DOMAIN "site/%s.html</link>\n", l.term->filename);
		fprintf(f, "  <guid isPermaLink='false'>%d</guid>\n", l.pict);
		fputs("  <pubDate>", f);
		fpRFC2822(f, arvelietime(EPOCH, l.date));
		fputs("</pubDate>\n", f);
		fputs("  <dc:creator><![CDATA[Devine Lu Linvega]]></dc:creator>\n", f);
		fputs("  <description>\n", f);
		fputs("<![CDATA[", f);
		fprintf(f, "<img src='" DOMAIN "media/diary/%d.jpg'/>\n", l.pict);
		fprintf(f, "<p>%s<br/><br/><a href='" DOMAIN "site/%s.html'>%s</a></p>", l.term->bref ? l.term->bref : "", l.term->filename, l.term->name);
		fputs("]]>\n", f);
		fputs("  </description>\n", f);
		fputs("</item>\n", f);
	}
	fputs("</channel>", f);
	fputs("</rss>", f);
	fclose(f);
}

void
fptwtxt(FILE *f, Journal *jou)
{
	int i;
	for(i = 0; i < jou->len; ++i) {
		Log l = jou->logs[i];
		if(l.rune != '+')
			continue;
		fpRFC3339(f, arvelietime(EPOCH, l.date));
		fprintf(f, "\t%s | " DOMAIN "%s\n", l.name, l.term->filename);
	}
	fclose(f);
}

int
parse_glossary(FILE *fp, Block *block, Glossary *glo)
{
	int len, depth, count = 0, split = 0;
	char line[512], buf[1024];
	List *l = &glo->lists[glo->len];
	while(fgets(line, 512, fp)) {
		depth = spad(line, '\t');
		len = slen(strm(line));
		count++;
		if(len < 4 || line[0] == ';')
			continue;
		if(glo->len >= GLOMEM)
			return errorid("Increase memory", "glossary", glo->len);
		if(len > 400)
			return errorid("Line is too long", line, len);
		if(depth == 0)
			l = makelist(&glo->lists[glo->len++], push(block, sstr(line, buf, 0, len)));
		else if(depth == 1) {
			if(l->len >= 64)
				errorid("Reached list item limit", l->name, l->len);
			split = scin(line, ':');
			if(split < 0)
				l->vals[l->len] = push(block, sstr(line, buf, 1, len + 1));
			else {
				l->keys[l->len] = push(block, sstr(line, buf, 1, split - 2));
				l->vals[l->len] = push(block, sstr(line, buf, split + 2, len - split));
			}
			l->len++;
		}
	}
	printf(":%d ", count);
	return 1;
}

int
parse_lexicon(FILE *fp, Block *block, Lexicon *lex)
{
	int key_len, val_len, len, count = 0, catch_body = 0, catch_link = 0;
	char line[1024], buf[1024];
	Term *t = &lex->terms[lex->len];
	while(fgets(line, 1024, fp)) {
		int depth = spad(line, '\t');
		strm(line);
		len = slen(line);
		count++;
		if(len < 3 || line[0] == ';')
			continue;
		if(lex->len >= LEXMEM)
			return errorid("Increase memory", "Lexicon", lex->len);
		if(len > 750)
			return errorid("Line is too long", line, len);
		if(depth == 0) {
			t = maketerm(&lex->terms[lex->len++], push(block, sstr(line, buf, 0, len)));
			if(!sian(line))
				return error("Lexicon key is not alphanum", line);
			t->filename = push(block, scsw(slca(sstr(line, buf, 0, len)), ' ', '_'));
		} else if(depth == 1 && len > 2) {
			if(ssin(line, "HOST : ") >= 0)
				t->host = push(block, sstr(line, buf, 8, len - 8));
			if(ssin(line, "BREF : ") >= 0)
				t->bref = push(block, sstr(line, buf, 8, len - 8));
			if(ssin(line, "TYPE : ") >= 0)
				t->type = push(block, sstr(line, buf, 8, len - 8));
			catch_body = ssin(line, "BODY") >= 0;
			catch_link = ssin(line, "LINK") >= 0;
		} else if(depth == 2 && len > 3) {
			/* Body */
			if(catch_body)
				t->body[t->body_len++] = push(block, sstr(line, buf, 2, len - 2));
			/* Link */
			else if(catch_link) {
				key_len = scin(line, ':') - 3;
				t->link.keys[t->link.len] = push(block, sstr(line, buf, 2, key_len));
				val_len = len - key_len - 3;
				t->link.vals[t->link.len++] = push(block, sstr(line, buf, key_len + 5, val_len));
			} else
				return errorid("Invalid line", line, count);
		} else
			return errorid("Invalid line", line, count);
	}
	printf(":%d ", count);
	return 1;
}

int
parse_journal(FILE *fp, Block *block, Lexicon *lex, Journal *jou)
{
	int len, count = 0;
	char line[256], buf[256];
	Log *l = &jou->logs[jou->len];
	while(fgets(line, 256, fp)) {
		len = slen(strm(line));
		count++;
		if(len < 14 || line[0] == ';')
			continue;
		if(jou->len >= HORMEM)
			return errorid("Increase memory", "Horaire", jou->len);
		if(len > 80)
			return errorid("Log is too long", line, len);
		l = makelog(&jou->logs[jou->len++], push(block, sstr(line, buf, 0, 5)));
		l->rune = line[6];
		l->code = sint(line + 7, 3);
		l->term = findterm(lex, strm(sstr(line, buf, 11, 21)));
		if(!l->term)
			return error("Unknown log term", line);
		if(len >= 35)
			l->pict = sint(line + 32, 3);
		if(len >= 38)
			l->name = push(block, strm(sstr(line, buf, 36, 72)));
	}
	printf(":%d ", count);
	return 1;
}

int
parse(Block *block, Glossary *glo, Lexicon *lex, Journal *jou)
{
	FILE *fglo = fopen("database/glossary.ndtl", "r");
	FILE *flex = fopen("database/lexicon.ndtl", "r");
	FILE *fhor = fopen("database/journal.tbtl", "r");
	printf("Parsing  | ");
	printf("glossary");
	if(!fglo || !parse_glossary(fglo, block, glo)) {
		fclose(fglo);
		return error("Parsing", "Glossary");
	}
	printf("lexicon");
	if(!flex || !parse_lexicon(flex, block, lex)) {
		fclose(flex);
		return error("Parsing", "Lexicon");
	}
	printf("journal");
	if(!fhor || !parse_journal(fhor, block, lex, jou)) {
		fclose(fhor);
		return error("Parsing", "Horaire");
	}
	fclose(fglo);
	fclose(flex);
	fclose(fhor);
	return 1;
}

int
link(Block *block, Glossary *glo, Lexicon *lex, Journal *jou)
{
	int i, j;
	char buf[6];
	printf("Linking  | ");
	printf("glossary:%d ", glo->len);
	printf("lexicon:%d ", lex->len);
	for(i = 0; i < lex->len; ++i) {
		Term *t = &lex->terms[i];
		for(j = 0; j < t->body_len; ++j)
			fptemplate(NULL, glo, lex, t, t->body[j]);
		t->parent = findterm(lex, t->host);
		if(!t->parent)
			return error("Missing parent", t->host);
		if(!t->bref && !t->type)
			return error("Missing bref", t->name);
		t->parent->children[t->parent->children_len++] = t;
	}
	printf("journal:%d ", jou->len);
	for(i = 0; i < jou->len; ++i) {
		Log *l = &jou->logs[i];
		l->term->logs_len++;
		l->term->ch += (l->code / 10) % 10;
		l->term->fh += l->code % 10;
		if(l->rune == '+') {
			l->term->events_len++;
			l->term->parent->events_len++;
		}
		if(!l->term->date_last)
			l->term->date_last = push(block, scpy(l->date, buf));
		if(l->code < 1)
			return error("Empty code", l->date);
		l->term->date_from = push(block, scpy(l->date, buf));
	}
	return 1;
}

int
build(Glossary *glo, Lexicon *lex, Journal *jou)
{
	FILE *f;
	int i;
	printf("Building | ");
	printf("%d pages ", lex->len);
	for(i = 0; i < lex->len; ++i) {
		f = getfile("../site/", lex->terms[i].filename, ".html", "w");
		if(!f)
			return error("Could not open file", lex->terms[i].name);
		fphtml(f, glo, lex, &lex->terms[i], jou);
	}
	printf("2 feeds ");
	f = fopen("../links/rss.xml", "w");
	if(!f)
		return error("Could not open file", "rss.xml");
	fprss(f, jou);
	f = fopen("../links/tw.txt", "w");
	if(!f)
		return error("Could not open file", "tw.txt");
	fptwtxt(f, jou);
	return 1;
}

void
check(Glossary *glo, Journal *jou)
{
	int i, j, found = 0;
	printf("Checking | ");
	/* Find unlinked lists */
	for(i = 0; i < glo->len; ++i) {
		List *l = &glo->lists[i];
		if(l->routes < 1)
			printf("Warning: Unused list \"%s\"\n", l->name);
	}
	/* Find next available diary id */
	for(i = 1; i < 999; ++i) {
		found = 0;
		for(j = 0; j < jou->len; j++)
			if(jou->logs[j].pict == i || found)
				found = 1;
		if(!found) {
			printf("Available(#%d) ", i);
			break;
		}
	}
}

Block block;
Glossary all_lists;
Lexicon all_terms;
Journal all_logs;
clock_t start;

int
main(void)
{
	int death = marble(1986, 3, 22);

	parvelie(EPOCH);
	printf("    | Marble #%d(%.2f%%)\n", death, (death / (double)3900) * 100);

	start = clock();
	if(!parse(&block, &all_lists, &all_terms, &all_logs))
		return error("Failure", "Parsing");
	printf("[%.2fms]\n", clockoffset(start));

	start = clock();
	if(!link(&block, &all_lists, &all_terms, &all_logs))
		return error("Failure", "Linking");
	printf("[%.2fms]\n", clockoffset(start));

	start = clock();
	if(!build(&all_lists, &all_terms, &all_logs))
		return error("Failure", "Building");
	printf("[%.2fms]\n", clockoffset(start));

	start = clock();
	check(&all_lists, &all_logs);
	printf("[%.2fms]\n", clockoffset(start));

	printf("%d/%d characters in memory\n", block.len, STRMEM);

	return 0;
}
