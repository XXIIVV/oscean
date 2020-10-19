#include <stdio.h>
#include <time.h>

#include "helpers.h"
#include "projects/arvelie/arvelie.h"

#define STRMEM 4096 * 96
#define GLOMEM 100
#define LEXMEM 500
#define HORMEM 3500
#define ITEMS 64

#define LOGS_RANGE 56

#define NAME "XXIIVV"
#define DOMAIN "https://wiki.xxiivv.com/"
#define LOCATION "Victoria, Canada"
#define REPOPATH "https://github.com/XXIIVV/oscean/blob/master/src/inc/"

typedef struct Block {
	int len;
	char data[STRMEM];
} Block;

typedef struct List {
	int len;
	int routes;
	char* name;
	char* keys[ITEMS];
	char* vals[ITEMS];
} List;

typedef struct Term {
	int body_len;
	int lists_len;
	int children_len;
	int incoming_len;
	int outgoing_len;
	char* name;
	char* host;
	char* bref;
	char* type;
	char* body[ITEMS];
	char* filename;
	char* date_from;
	char* date_last;
	struct List link;
	struct Term* parent;
	struct Term* children[ITEMS];
	struct List* lists[ITEMS];
	struct Term* incoming[ITEMS];
} Term;

typedef struct Log {
	int code;
	int pict;
	char* date;
	char* name;
	char rune;
	Term* term;
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
error(char* msg, char* val)
{
	printf("Error: %s(%s)\n", msg, val);
	return 0;
}

/* Block */

Block
iniblock()
{
	Block b;
	b.len = 0;
	b.data[0] = '\0';
	return b;
}

char*
push(Block* b, char* s)
{
	int i = 0, o = b->len;
	while(s[i] != '\0')
		b->data[b->len++] = s[i++];
	b->data[b->len++] = '\0';
	return &b->data[o];
}

/* List */

List*
inilist(List* l, char* name)
{
	l->len = 0;
	l->routes = 0;
	l->name = slca(name);
	return l;
}

List*
findlist(Glossary* glo, char* name)
{
	int i;
	for(i = 0; i < glo->len; ++i)
		if(scmp(name, glo->lists[i].name))
			return &glo->lists[i];
	return NULL;
}

/* Term */

Term*
initerm(Term* t, char* name)
{
	t->body_len = 0;
	t->lists_len = 0;
	t->children_len = 0;
	t->incoming_len = 0;
	t->outgoing_len = 0;
	t->name = slca(name);
	return t;
}

Term*
findterm(Lexicon* lex, char* name)
{
	int i;
	scsw(slca(name), '_', ' ');
	for(i = 0; i < lex->len; ++i)
		if(scmp(name, lex->terms[i].name))
			return &lex->terms[i];
	return NULL;
}

/* Log */

Log*
inilog(Log* l, char* date)
{
	l->code = 0;
	l->pict = 0;
	l->date = date;
	return l;
}

Log*
finddiary(Journal* jou, Term* t)
{
	int i;
	for(i = 0; i < jou->len; ++i) {
		Log* l = &jou->logs[i];
		if(l->term == t && l->pict > 0)
			return l;
	}
	return NULL;
}

/* File */

FILE*
getfile(char* dir, char* filename, char* ext, char* op)
{
	char filepath[1024];
	filepath[0] = '\0';
	scat(filepath, dir);
	scat(filepath, filename);
	scat(filepath, ext);
	scat(filepath, "\0");
	return fopen(filepath, op);
}

/* File Print */

void
fplifeline(FILE* f, Term* t)
{
	int limit_from = arvelie_to_epoch("06I04");
	int limit_to = get_epoch();
	int range_from = arvelie_to_epoch(t->date_from);
	int range_to = arvelie_to_epoch(t->date_last);
	int i, init = 0;
	fputs("<code style='float:right; font-size:80%'>", f);
	for(i = 0; i < 6; i++) {
		double epoch = (i / 5.0) * (limit_to - limit_from) + limit_from;
		if(epoch > range_from && !init) {
			fputs("+", f);
			init = 1;
		} else if(epoch >= range_from && epoch <= range_to)
			fputs("+", f);
		else
			fputs("-", f);
	}
	fputs("</code>", f);
}

void
fppict(FILE* f, int pict, char* host, char* name, int caption, char* link)
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
fplogpict(FILE* f, Log* l, int caption)
{
	fppict(f, l->pict, l->date, l->name, caption, NULL);
}

void
fplink(FILE* f, Lexicon* lex, Term* t, char* s)
{
	int split = cpos(s, ' ');
	char target[256], name[256];
	/* find target and name */
	if(split == -1) {
		scpy(sstr(s, target, 0, slen(s)), name);
	} else {
		sstr(s, target, 0, split);
		sstr(s, name, split + 1, slen(s) - split);
	}
	/* output */
	if(surl(target)) {
		if(f != NULL)
			fprintf(f, "<a href='%s' target='_blank'>%s</a>", target, name);
	} else {
		Term* tt = findterm(lex, target);
		if(!tt)
			error("Unknown link", target);
		if(f != NULL)
			fprintf(f, "<a href='%s.html'>%s</a>", tt->filename, name);
		else {
			tt->incoming[tt->incoming_len++] = t;
			t->outgoing_len++;
		}
	}
}

void
fpmodule(FILE* f, char* s)
{
	int split = cpos(s, ' ');
	char cmd[256], target[256];
	sstr(s, cmd, 1, split - 1);
	sstr(s, target, split + 1, slen(s) - split);
	if(scmp(cmd, "itchio"))
		fprintf(f, "<iframe frameborder='0' src='https://itch.io/embed/%s?link_color=000000' width='624' height='167'></iframe>", target);
	else if(scmp(cmd, "bandcamp"))
		fprintf(f, "<iframe style='border: 0; width: 624px; height: 274px;' src='https://bandcamp.com/EmbeddedPlayer/album=%s/size=large/bgcol=ffffff/linkcol=333333/artwork=small' seamless></iframe>", target);
	else if(scmp(cmd, "youtube")) {
		fprintf(f, "<iframe width='624' height='380' src='https://www.youtube.com/embed/%s?rel=0' style='max-width:700px' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>", target);
	} else if(scmp(cmd, "redirect")) {
		fprintf(f, "<meta http-equiv='refresh' content='2; url=%s.html'/><p>In a hurry? Travel to <a href='%s.html'>%s</a>.</p>", target, target, target);
	} else if(scmp(cmd, "img")) {
		int split2 = cpos(target, ' ');
		if(split2 > 0) {
			char param[256], value[256];
			sstr(target, param, 0, split2);
			sstr(target, value, split2 + 1, slen(target) - split2);
			fprintf(f, "<img src='../media/%s' width='%s'/>&nbsp;", param, value);
		} else
			fprintf(f, "<img src='../media/%s'/>&nbsp;", target);
	} else if(scmp(cmd, "src")) {
		int lines = 0;
		char c;
		FILE* fp = getfile("../archive/src/", target, ".txt", "r");
		if(fp == NULL)
			error("Missing src include ", target);
		fputs("<figure>", f);
		fputs("<pre>", f);
		while((c = fgetc(fp)) != EOF) {
			if(c == '<')
				fputs("&lt;", f);
			else if(c == '>')
				fputs("&gt;", f);
			else if(c == '&')
				fputs("&amp;", f);
			else
				fputc(c, f);
			if(c == '\n')
				lines++;
		}
		fputs("</pre>", f);
		fprintf(f, "<figcaption><a href='../archive/src/%s.txt'>%s</a> %d lines</figcaption>\n", target, target, lines);
		fputs("</figure>", f);
	} else
		printf("Warning: Missing template mod: %s\n", s);
}

void
ftemplate(FILE* f, Lexicon* lex, Term* t, char* s)
{
	int i, capture = 0;
	char buf[1024];
	buf[0] = '\0';
	for(i = 0; i < slen(s); ++i) {
		char c = s[i];
		if(c == '}') {
			capture = 0;
			if(buf[0] == '^' && f != NULL)
				fpmodule(f, buf);
			else if(buf[0] != '^')
				fplink(f, lex, t, buf);
		}
		if(capture) {
			ccat(buf, c);
		} else if(c != '{' && c != '}' && f != NULL)
			fputc(c, f);
		if(c == '{') {
			capture = 1;
			buf[0] = '\0';
		}
	}
}

void
fpbodypart(FILE* f, Lexicon* lex, Term* t)
{
	int i;
	for(i = 0; i < t->body_len; ++i)
		ftemplate(f, lex, t, t->body[i]);
}

void
fpbanner(FILE* f, Journal* jou, Term* t, int caption)
{
	Log* l = finddiary(jou, t);
	if(l)
		fplogpict(f, l, caption);
}

void
fpnavpart(FILE* f, Term* t, Term* target)
{
	int i;
	fputs("<ul>", f);
	for(i = 0; i < t->children_len; ++i) {
		if(t->children[i]->name == t->name)
			continue; /* Paradox */
		if(t->children[i]->name == target->name)
			fprintf(f, "<li><a href='%s.html'>%s/</a></li>", t->children[i]->filename, t->children[i]->name);
		else
			fprintf(f, "<li><a href='%s.html'>%s</a></li>", t->children[i]->filename, t->children[i]->name);
	}
	fputs("</ul>", f);
}

void
fpnav(FILE* f, Term* t)
{
	if(t->parent == NULL)
		error("Missing parent", t->name);
	if(t->parent->parent == NULL)
		error("Missing parent", t->parent->name);
	fputs("<nav>", f);
	if(t->parent->parent->name == t->parent->name)
		fpnavpart(f, t->parent->parent, t);
	else
		fpnavpart(f, t->parent->parent, t->parent);
	if(t->parent->parent->name != t->parent->name)
		fpnavpart(f, t->parent, t);
	if(t->parent->name != t->name)
		fpnavpart(f, t, t);
	fputs("</nav>", f);
}

void
fpbody(FILE* f, Lexicon* lex, Term* t)
{
	fprintf(f, "<h2>%s</h2>", t->bref);
	fpbodypart(f, lex, t);
}

void
fplist(FILE* f, Term* t)
{
	int i, j;
	for(i = 0; i < t->lists_len; ++i) {
		List* l = t->lists[i];
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
	}
}

void
fpinclude(FILE* f, Term* t)
{
	char buffer[4096];
	FILE* fp = getfile("inc/", t->filename, ".htm", "r");
	if(fp == NULL)
		return;
	for(;;) {
		size_t sz = fread(buffer, 1, sizeof(buffer), fp);
		if(sz)
			fwrite(buffer, 1, sz, f);
		else if(feof(fp) || ferror(fp))
			break;
	}
	fprintf(f,
	        "<p>Found a mistake? Submit an <a href='" REPOPATH "%s.htm' target='_blank'>edit</a> to %s.</p>",
	        t->filename, t->name);
	fclose(fp);
}

void
fpportal(FILE* f, Lexicon* lex, Journal* jou, Term* t, int pict, int text)
{
	int i;
	for(i = 0; i < t->children_len; ++i) {
		Term* c = t->children[i];
		if(pict) {
			Log* l = finddiary(jou, c);
			if(l != NULL)
				fppict(f, l->pict, c->name, c->bref, 1, c->filename);
		}
		if(text) {
			fprintf(f, "<h2><a href='%s.html'>%s</a></h2>", c->filename, c->name);
			fpbodypart(f, lex, c);
			fplist(f, c);
		}
	}
}

void
fpalbum(FILE* f, Journal* jou, Term* t)
{
	int i;
	for(i = 0; i < jou->len; ++i) {
		Log l = jou->logs[i];
		if(l.term != t || l.pict < 1 || l.pict == finddiary(jou, t)->pict)
			continue;
		fplogpict(f, &l, 1);
	}
}

void
fplinks(FILE* f, Term* t)
{
	int i;
	if(t->link.len < 1)
		return;
	fputs("<ul>", f);
	for(i = 0; i < t->link.len; ++i)
		fprintf(f, "<li><a href='%s' target='_blank'>%s</a></li>",
		        t->link.vals[i], t->link.keys[i]);
	fputs("</ul>", f);
}

void
fpincoming(FILE* f, Term* t)
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
fphoraire(FILE* f, Journal* jou, Term* t)
{
	int i, len = 0, events_len = 0, ch = 0, fh = 0;
	for(i = 0; i < jou->len; ++i) {
		Log* l = &jou->logs[i];
		if(l->term != t && l->term->parent != t)
			continue;
		if(l->rune == '+')
			events_len++;
		ch += (l->code / 10) % 10;
		fh += l->code % 10;
		len++;
	}
	/* Updated */
	if(len < 2 || !t->date_last)
		return;
	fputs("<p>", f);
	fprintf(f, "<i>Last update on <a href='tracker.html'>%s</a>, edited %d times. +%d/%dfh</i>",
	        t->date_last, len, ch, fh);
	fplifeline(f, t);
	fputs("</p>", f);
	/* Events */
	if(events_len < 1)
		return;
	fputs("<ul>", f);
	for(i = 0; i < jou->len; ++i) {
		Log* l = &jou->logs[i];
		if(l->rune != '+')
			continue;
		if(l->term != t && l->term->parent != t)
			continue;
		fprintf(f, "<li>%s — %s</li>", l->date, l->name);
	}
	fputs("</ul>", f);
}

void
fphome(FILE* f, Journal* jou)
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
		fprintf(f, "<li><a href='%s.html'>%s</a> %s</li>", jou->logs[i].term->filename,
		        jou->logs[i].date, jou->logs[i].name);
	}
	fputs("</ul>", f);
}

void
fpcalendar(FILE* f, Journal* jou)
{
	int i, last_year = 0;
	fputs("<ul>", f);
	for(i = 0; i < jou->len; ++i) {
		if(jou->logs[i].rune != '+')
			continue;
		if(last_year != sint(jou->logs[i].date, 2))
			fprintf(f, "</ul><ul>");
		fprintf(f, "<li><a href='%s.html'>%s</a> %s</li>", jou->logs[i].term->filename,
		        jou->logs[i].date, jou->logs[i].name);
		last_year = sint(jou->logs[i].date, 2);
	}
	fputs("</ul>", f);
}

void
fptracker(FILE* f, Journal* jou)
{
	char* known[LEXMEM];
	int i, known_id = 0, last_year = 20;
	fputs("<ul>", f);
	for(i = 0; i < jou->len; ++i) {
		if(afnd(known, known_id, jou->logs[i].term->name) > -1)
			continue;
		if(last_year != sint(jou->logs[i].date, 2))
			fprintf(f, "</ul><ul>");
		fputs("<li>", f);
		fprintf(f, "<a href='%s.html'>%s</a> — last update %s", jou->logs[i].term->filename,
		        jou->logs[i].term->name, jou->logs[i].date);
		fplifeline(f, jou->logs[i].term);
		fputs("</li>", f);
		last_year = sint(jou->logs[i].date, 2);
		known[known_id] = jou->logs[i].term->name;
		known_id++;
	}
	fputs("</ul>", f);
}

void
fpjournal(FILE* f, Journal* jou)
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
fpnow(FILE* f, Lexicon* lex, Journal* jou)
{
	int i, epoch, projects_len = 0;
	char *pname[LOGS_RANGE], *pfname[LOGS_RANGE];
	double sum_value = 0, pval[LOGS_RANGE], pmaxval = 0;
	epoch = get_epoch();
	for(i = 0; i < LOGS_RANGE; ++i) {
		int index = 0;
		Log l = jou->logs[i];
		if(epoch - arvelie_to_epoch(l.date) > LOGS_RANGE)
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
		if(finddiary(jou, findterm(lex, pname[i])) && pval[i] > pmaxval)
			pmaxval = pval[i];
	}
	for(i = 0; i < projects_len; ++i) {
		if(pval[i] != pmaxval)
			continue;
		fplogpict(f, finddiary(jou, findterm(lex, pname[i])), 1);
		break;
	}
	fprintf(
	    f,
	    "<p>This data shows the distribution of <b>%.0f hours over %d projects</b>, "
	    "recorded during the last %d days, for an average of %.1f work hours per day "
	    "and %.1f work hours per project.</p>",
	    sum_value, projects_len,
	    LOGS_RANGE, sum_value / LOGS_RANGE,
	    sum_value / projects_len);
	fputs("<ul style='columns:2'>", f);
	for(i = 0; i < projects_len; ++i) {
		fputs("<li>", f);
		fprintf(f, "<a href='%s.html'>%s</a> %.2f&#37; ",
		        pfname[i],
		        pname[i],
		        pval[i] / sum_value * 100);
		fputs("</li>", f);
	}
	fputs("</ul>", f);
	fprintf(f, "<p>Last generated on %s(" LOCATION ").</p>", nowstr());
}

void
fpdetails(FILE* f, Term* t, int depth)
{
	int i;
	depth++;
	fprintf(f, "<li><a href='%s.html'>%s</a> <i>%s</i></li>", t->filename, t->name,
	        t->incoming_len < 1 ? "orphan " : t->outgoing_len < 1 ? "deadend " : "");
	if(t->children_len < 1)
		return;
	fputs("<ul>", f);
	for(i = 0; i < t->children_len; ++i)
		if(!scmp(t->children[i]->name, t->name))
			fpdetails(f, t->children[i], depth);
	fputs("</ul>", f);
}

void
fpindex(FILE* f, Lexicon* lex, Journal* jou)
{
	int i, sends = 0, orphans = 0, deadends = 0;
	for(i = 0; i < lex->len; ++i) {
		Term* t = &lex->terms[i];
		sends += t->incoming_len;
		if(t->incoming_len < 1)
			orphans++;
		if(t->outgoing_len < 1)
			deadends++;
	}
	fprintf(f, "<p>This wiki hosts %d journal logs recorded on %d lexicon terms, connected by %d inbound links. It is a living document in which %d orphans and %d deadends still remain.</p>", jou->len, lex->len, sends, orphans, deadends);
	fputs("<ul>", f);
	fpdetails(f, &lex->terms[0], 0);
	fputs("</ul>", f);
}

void
fphtml(FILE* f, Lexicon* lex, Term* t, Journal* jou)
{
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
	        t->bref, t->name);
	fputs("</head>", f);
	fputs("<body>", f);
	fputs("<header><a href='home.html'><img src='../media/services/logo.png' alt='" NAME "' height='29'></a></header>", f);
	fpnav(f, t);
	fputs("<main>", f);
	fpbanner(f, jou, t, 1);
	fpbody(f, lex, t);
	fpinclude(f, t);
	/* templated pages */
	if(t->type) {
		if(scmp(t->type, "pict_portal"))
			fpportal(f, lex, jou, t, 1, 0);
		else if(scmp(t->type, "text_portal"))
			fpportal(f, lex, jou, t, 0, 1);
		else if(scmp(t->type, "album"))
			fpalbum(f, jou, t);
		else
			error("Unknown template", t->type);
	}
	/* special pages */
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
	fplist(f, t);
	fplinks(f, t);
	fpincoming(f, t);
	fphoraire(f, jou, t);
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
fprss(FILE* f, Journal* jou)
{
	int i;
	time_t now;
	fputs("<?xml version='1.0' encoding='UTF-8' ?>\n", f);
	fputs("<rss version='2.0' xmlns:dc='http://purl.org/dc/elements/1.1/'>\n", f);
	fputs("<channel>\n", f);
	fputs("<title>" NAME "</title>\n", f);
	fputs("<link>" DOMAIN " Journal</link>\n", f);
	fputs("<description>The Nataniev Library</description>\n", f);
	/* Date */
	fputs("<lastBuildDate>", f);
	fputs_rfc2822(f, time(&now));
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
		fputs_rfc2822(f, arvelie_to_time(l.date));
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
fptwtxt(FILE* f, Journal* jou)
{
	int i;
	for(i = 0; i < jou->len; ++i) {
		Log l = jou->logs[i];
		if(l.rune != '+')
			continue;
		fputs_rfc3339(f, arvelie_to_time(l.date));
		fprintf(f, "\t%s | " DOMAIN "%s\n", l.name, l.term->filename);
	}
	fclose(f);
}

Block b1;

FILE*
parse_glossary(FILE* fp, Glossary* glo)
{
	int len, depth, count = 0, split = 0;
	char line[512], buf[1024];
	List* l = &glo->lists[glo->len];
	if(fp == NULL)
		error("Could not open", "glossary");
	while(fgets(line, 512, fp)) {
		depth = cpad(line, ' ');
		len = slen(strm(line));
		if(len < 4 || line[0] == ';')
			continue;
		if(glo->len >= GLOMEM)
			error("Increase memory", "glossary");
		if(len > 400)
			error("Line is too long", line);
		if(depth == 0) {
			l = inilist(&glo->lists[glo->len++], push(&b1, sstr(line, buf, 0, len)));
		} else if(depth == 2) {
			if(l->len >= 64)
				error("Reached list item limit", l->name);
			split = cpos(line, ':');
			if(split < 0)
				l->vals[l->len] = push(&b1, sstr(line, buf, 2, len + 2));
			else {
				l->keys[l->len] = push(&b1, sstr(line, buf, 2, split - 3));
				l->vals[l->len] = push(&b1, sstr(line, buf, split + 2, len - split));
			}
			l->len++;
		}
		count++;
	}
	printf("(%d lines) ", count);
	return fp;
}

FILE*
parse_lexicon(FILE* fp, Glossary* glo, Lexicon* lex)
{
	int key_len, val_len, len, count = 0, catch_body = 0, catch_link = 0, catch_list = 0;
	char line[1024], buf[1024];
	Term* t = &lex->terms[lex->len];
	if(fp == NULL)
		error("Could not open", "lexicon");
	while(fgets(line, 1024, fp)) {
		int depth = cpad(line, ' ');
		strm(line);
		len = slen(line);
		if(len < 3 || line[0] == ';')
			continue;
		if(lex->len >= LEXMEM)
			error("Increase memory", "Lexicon");
		if(len > 750)
			error("Line is too long", line);
		if(depth == 0) {
			t = initerm(&lex->terms[lex->len++], push(&b1, sstr(line, buf, 0, len)));
			if(!sans(line))
				error("Lexicon key is not alphanum", line);
			t->filename = push(&b1, scsw(slca(sstr(line, buf, 0, len)), ' ', '_'));
		} else if(depth == 2) {
			if(spos(line, "HOST : ") >= 0)
				t->host = push(&b1, sstr(line, buf, 9, len - 9));
			if(spos(line, "BREF : ") >= 0)
				t->bref = push(&b1, sstr(line, buf, 9, len - 9));
			if(spos(line, "TYPE : ") >= 0)
				t->type = push(&b1, sstr(line, buf, 9, len - 9));
			catch_body = spos(line, "BODY") >= 0;
			catch_link = spos(line, "LINK") >= 0;
			catch_list = spos(line, "LIST") >= 0;
		} else if(depth == 4) {
			/* Body */
			if(catch_body)
				t->body[t->body_len++] = push(&b1, sstr(line, buf, 4, len - 4));
			/* Link */
			else if(catch_link) {
				key_len = cpos(line, ':') - 5;
				t->link.keys[t->link.len] = push(&b1, sstr(line, buf, 4, key_len));
				val_len = len - key_len - 5;
				t->link.vals[t->link.len++] = push(&b1, sstr(line, buf, key_len + 7, val_len));
			}
			/* List */
			else if(catch_list) {
				List* l = findlist(glo, sstr(line, buf, 4, len - 4));
				if(l) {
					t->lists[t->lists_len++] = l;
					l->routes++;
				} else
					error("Unknown list:", line);
			} else
				error("Invalid line", line);
		}
		count++;
	}
	printf("(%d lines) ", count);
	return fp;
}

FILE*
parse_horaire(FILE* fp, Lexicon* lex, Journal* jou)
{
	int len, count = 0;
	char line[256], buf[1024];
	Log* l = &jou->logs[jou->len];
	if(fp == NULL)
		error("Could not open", "horaire");
	while(fgets(line, 256, fp)) {
		strm(line);
		len = slen(line);
		if(len < 14 || line[0] == ';')
			continue;
		if(jou->len >= HORMEM)
			error("Increase memory", "Horaire");
		if(len > 80)
			error("Log is too long", line);
		l = inilog(&jou->logs[jou->len++], push(&b1, sstr(line, buf, 0, 5)));
		l->rune = line[6];
		l->code = sint(line + 7, 3);
		l->term = findterm(lex, strm(sstr(line, buf, 11, 21)));
		if(!l->term)
			error("Unknown log term", line);
		if(len >= 35)
			l->pict = sint(line + 32, 3);
		if(len >= 38)
			l->name = push(&b1, strm(sstr(line, buf, 36, 72)));
		count++;
	}
	printf("(%d lines) ", count);
	return fp;
}

void
parse(Glossary* glo, Lexicon* lex, Journal* jou)
{
	printf("Parsing  | ");
	printf("glossary");
	fclose(parse_glossary(fopen("database/glossary.ndtl", "r"), glo));
	printf("lexicon");
	fclose(parse_lexicon(fopen("database/lexicon.ndtl", "r"), glo, lex));
	printf("horaire");
	fclose(parse_horaire(fopen("database/horaire.tbtl", "r"), lex, jou));
}

void
link(Glossary* glo, Lexicon* lex, Journal* jou)
{
	int i, j;
	char buf[6];
	printf("Linking  | ");
	printf("journal(%d entries) ", jou->len);
	for(i = 0; i < jou->len; ++i) {
		Log* l = &jou->logs[i];
		if(!l->term->date_last)
			l->term->date_last = push(&b1, scpy(l->date, buf));
		l->term->date_from = push(&b1, scpy(l->date, buf));
	}
	printf("lexicon(%d entries) ", lex->len);
	for(i = 0; i < lex->len; ++i) {
		Term* t = &lex->terms[i];
		for(j = 0; j < t->body_len; ++j)
			ftemplate(NULL, lex, t, t->body[j]);
		t->parent = findterm(lex, t->host);
		if(!t->parent)
			error("Unknown term host", t->host);
		t->parent->children[t->parent->children_len++] = t;
	}
	printf("glossary(%d entries) ", glo->len);
}

void
build(Lexicon* lex, Journal* jou)
{
	FILE* f;
	int i;
	printf("Building | ");
	printf("%d pages ", lex->len);
	for(i = 0; i < lex->len; ++i) {
		f = getfile("../site/", lex->terms[i].filename, ".html", "w");
		if(f == NULL)
			error("Could not open file", lex->terms[i].name);
		fphtml(f, lex, &lex->terms[i], jou);
	}
	printf("2 feeds ");
	f = fopen("../links/rss.xml", "w");
	if(f == NULL)
		error("Could not open file", "rss.xml");
	fprss(f, jou);
	f = fopen("../links/tw.txt", "w");
	if(f == NULL)
		error("Could not open file", "tw.txt");
	fptwtxt(f, jou);
}

void
check(Glossary* glo, Lexicon* lex, Journal* jou)
{
	int i, j, found = 0;
	printf("Checking | ");
	/* Find incomplete terms */
	for(i = 0; i < lex->len; ++i) {
		Term* t = &lex->terms[i];
		if(!t->bref)
			printf("Warning: Empty bref %s\n", t->name);
	}
	/* Find invalid logs */
	for(i = 0; i < jou->len; ++i) {
		Log* l = &jou->logs[i];
		if(l->code < 1)
			printf("Warning: Empty code %s\n", l->date);
	}
	/* Find unlinked lists */
	for(i = 0; i < glo->len; ++i) {
		List* l = &glo->lists[i];
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

int
main(void)
{
	Glossary all_lists;
	Lexicon all_terms;
	Journal all_logs;
	clock_t start;

	all_lists.len = 0;
	all_terms.len = 0;
	all_logs.len = 0;

	b1 = iniblock();

	printf("Today    | ");
	print_arvelie();

	start = clock();
	parse(&all_lists, &all_terms, &all_logs);
	printf("[%.2fms]\n", clock_since(start));
	start = clock();
	link(&all_lists, &all_terms, &all_logs);
	printf("[%.2fms]\n", clock_since(start));
	start = clock();
	build(&all_terms, &all_logs);
	printf("[%.2fms]\n", clock_since(start));
	start = clock();
	check(&all_lists, &all_terms, &all_logs);
	printf("[%.2fms]\n", clock_since(start));

	printf("%d/%d characters in memory\n", b1.len, STRMEM);

	return 0;
}
