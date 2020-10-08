#include <stdio.h>
#include <time.h>

#include "helpers.h"
#include "projects/arvelie/arvelie.h"

#define KEY_BUF_LEN 32
#define STR_BUF_LEN 255
#define LOG_BUF_LEN 64
#define TERM_DICT_BUFFER 16
#define TERM_LIST_BUFFER 16
#define TERM_BODY_BUFFER 24
#define LEXICON_BUFFER 512
#define LOGS_RANGE 56

#define LIST_ITEMS 50

#define NAME "XXIIVV"
#define DOMAIN "https://wiki.xxiivv.com/"
#define LOCATION "Victoria, Canada"
#define REPOPATH "https://github.com/XXIIVV/oscean/blob/master/src/inc/"

typedef struct List {
	char name[KEY_BUF_LEN];
	char keys[LIST_ITEMS][64];
	char vals[LIST_ITEMS][STR_BUF_LEN];
	int len;
	int routes;
} List;

typedef struct Term {
	char name[KEY_BUF_LEN];
	char host[KEY_BUF_LEN];
	char bref[STR_BUF_LEN];
	char type[KEY_BUF_LEN];
	char body[30][750];
	int body_len;
	struct List link;
	char list[20][KEY_BUF_LEN];
	int list_len;
	/* generated */
	char filename[KEY_BUF_LEN];
	char date_from[6];
	char date_last[6];
	struct Term* parent;
	struct Term* children[20];
	int children_len;
	struct List* docs[20];
	int docs_len;
	struct Term* incoming[KEY_BUF_LEN];
	int incoming_len;
	int outgoing_len;
} Term;

typedef struct Log {
	char date[6];
	char rune;
	int code;
	char host[KEY_BUF_LEN];
	int pict;
	char name[LOG_BUF_LEN];
	Term* term;
} Log;

typedef struct Glossary {
	int len;
	List lists[100];
} Glossary;

typedef struct Lexicon {
	int len;
	Term terms[350];
} Lexicon;

typedef struct Journal {
	int len;
	Log logs[3500];
} Journal;

int
error(char* msg, char* val)
{
	printf("Error: %s(%s)\n", msg, val);
	return 0;
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

Log*
finddiary(Journal* jou, Term* t)
{
	int i;
	for(i = 0; i < jou->len; ++i) {
		Log* l = &jou->logs[i];
		if(l->term != t || l->pict < 1)
			continue;
		return l;
	}
	return NULL;
}

FILE*
getfile(char* dir, char* filename, char* ext, char* op)
{
	char filepath[STR_BUF_LEN];
	filepath[0] = '\0';
	scat(filepath, dir);
	scat(filepath, filename);
	scat(filepath, ext);
	scat(filepath, "\0");
	return fopen(filepath, op);
}

void
build_lifeline(FILE* f, Term* t)
{
	int limit_from = arvelie_to_epoch("06I04");
	int limit_to = get_epoch();
	int range_from = arvelie_to_epoch(t->date_from);
	int range_to = arvelie_to_epoch(t->date_last);
	int i;
	int init = 0;
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
build_pict(FILE* f, int pict, char* host, char* name, int caption, char* link)
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
build_log_pict(FILE* f, Log* l, int caption)
{
	build_pict(f, l->pict, l->date, l->name, caption, NULL);
}

void
fplink(FILE* f, Lexicon* lex, Term* t, char* s)
{
	int split = cpos(s, ' ');
	char target[256], name[256];
	/* find target and name */
	if(split == -1) {
		sstr(s, target, 0, slen(s));
		scpy(target, name);
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
			tt->incoming[tt->incoming_len] = t;
			tt->incoming_len++;
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
	char buf[STR_BUF_LEN];
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
			if(slen(buf) < STR_BUF_LEN - 1)
				ccat(buf, c);
			else
				error("template too long", s);
		} else if(c != '{' && c != '}' && f != NULL)
			fputc(c, f);
		if(c == '{') {
			capture = 1;
			buf[0] = '\0';
		}
	}
}

void
build_body_part(FILE* f, Lexicon* lex, Term* t)
{
	int i;
	for(i = 0; i < t->body_len; ++i)
		ftemplate(f, lex, t, t->body[i]);
}

void
build_nav_part(FILE* f, Term* t, Term* target)
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
build_banner(FILE* f, Journal* jou, Term* t, int caption)
{
	Log* l = finddiary(jou, t);
	if(l)
		build_log_pict(f, l, caption);
}

void
build_nav(FILE* f, Term* t)
{
	if(t->parent == NULL)
		error("Missing parent", t->name);
	if(t->parent->parent == NULL)
		error("Missing parent", t->parent->name);
	fputs("<nav>", f);
	if(t->parent->parent->name == t->parent->name)
		build_nav_part(f, t->parent->parent, t);
	else
		build_nav_part(f, t->parent->parent, t->parent);
	if(t->parent->parent->name != t->parent->name)
		build_nav_part(f, t->parent, t);
	if(t->parent->name != t->name)
		build_nav_part(f, t, t);
	fputs("</nav>", f);
}

void
build_body(FILE* f, Lexicon* lex, Term* t)
{
	fprintf(f, "<h2>%s</h2>", t->bref);
	build_body_part(f, lex, t);
}

void
build_list(FILE* f, Term* t)
{
	int i, j;
	for(i = 0; i < t->docs_len; ++i) {
		List* l = t->docs[i];
		fprintf(f, "<h3>%s</h3>", l->name);
		fputs("<ul>", f);
		for(j = 0; j < l->len; ++j)
			if(l->keys[j][0] == '\0')
				fprintf(f, "<li>%s</li>", l->vals[j]);
			else if(surl(l->vals[j]))
				fprintf(f, "<li><a href='%s'>%s</a></li>", l->vals[j], l->keys[j]);
			else
				fprintf(f, "<li><b>%s</b>: %s</li>", l->keys[j], l->vals[j]);
		fputs("</ul>", f);
	}
}

void
build_include(FILE* f, Term* t)
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
build_index(FILE* f, Lexicon* lex, Term* t)
{
	int i;
	for(i = 0; i < t->children_len; ++i) {
		Term* child = t->children[i];
		fprintf(f, "<h3><a href='%s.html'>%s</a></h3>", child->filename, child->name);
		build_body_part(f, lex, child);
		build_list(f, child);
	}
}

void
build_portal(FILE* f, Journal* jou, Term* t)
{
	int i;
	for(i = 0; i < t->children_len; ++i) {
		Term* c = t->children[i];
		Log* l = finddiary(jou, c);
		if(l != NULL)
			build_pict(f, l->pict, c->name, c->bref, 1, c->filename);
	}
}

void
build_album(FILE* f, Journal* jou, Term* t)
{
	int i;
	for(i = 0; i < jou->len; ++i) {
		Log l = jou->logs[i];
		if(l.term != t || l.pict < 1 || l.pict == finddiary(jou, t)->pict)
			continue;
		build_log_pict(f, &l, 1);
	}
}

void
build_links(FILE* f, Term* t)
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
build_incoming(FILE* f, Term* t)
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
build_horaire(FILE* f, Journal* jou, Term* t)
{
	int i;
	int len = 0;
	int events_len = 0;
	int ch = 0;
	int fh = 0;
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
	if(len < 2 || slen(t->date_last) == 0)
		return;
	fputs("<p>", f);
	fprintf(f, "<i>Last update on <a href='tracker.html'>%s</a>, edited %d times. +%d/%dfh</i>",
	        t->date_last, len, ch, fh);
	build_lifeline(f, t);
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
print_term_details(FILE* f, Term* t, int depth)
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
			print_term_details(f, t->children[i], depth);
	fputs("</ul>", f);
}

void
build_special_home(FILE* f, Journal* journal)
{
	int i, events = 0;
	for(i = 0; i < 5; ++i) {
		if(journal->logs[i].rune == '+') {
			events = 1;
			break;
		}
	}
	if(!events)
		return;
	fputs("<h2>Events</h2>", f);
	fputs("<ul>", f);
	for(i = 0; i < 5; ++i) {
		if(journal->logs[i].rune != '+')
			continue;
		fprintf(f, "<li><a href='%s.html'>%s</a> %s</li>", journal->logs[i].term->filename,
		        journal->logs[i].date, journal->logs[i].name);
	}
	fputs("</ul>", f);
}

void
build_special_calendar(FILE* f, Journal* journal)
{
	int i, last_year = 0;
	fputs("<ul>", f);
	for(i = 0; i < journal->len; ++i) {
		if(journal->logs[i].rune != '+')
			continue;
		if(last_year != sint(journal->logs[i].date, 2))
			fprintf(f, "</ul><ul>");
		fprintf(f, "<li><a href='%s.html'>%s</a> %s</li>", journal->logs[i].term->filename,
		        journal->logs[i].date, journal->logs[i].name);
		last_year = sint(journal->logs[i].date, 2);
	}
	fputs("</ul>", f);
}

void
build_special_tracker(FILE* f, Journal* journal)
{
	int i, known_id = 0, last_year = 20;
	fputs("<ul>", f);
	for(i = 0; i < journal->len; ++i) {
		char* known[LEXICON_BUFFER];
		if(afnd(known, known_id, journal->logs[i].term->name) > -1)
			continue;
		if(known_id >= LEXICON_BUFFER) {
			printf("Warning: Reached tracker buffer\n");
			break;
		}
		if(last_year != sint(journal->logs[i].date, 2))
			fprintf(f, "</ul><ul>");
		fputs("<li>", f);
		fprintf(f, "<a href='%s.html'>%s</a> — last update %s", journal->logs[i].term->filename,
		        journal->logs[i].term->name, journal->logs[i].date);
		build_lifeline(f, journal->logs[i].term);
		fputs("</li>", f);
		last_year = sint(journal->logs[i].date, 2);
		known[known_id] = journal->logs[i].term->name;
		known_id++;
	}
	fputs("</ul>", f);
}

void
build_special_journal(FILE* f, Journal* journal)
{
	int i, count = 0;
	for(i = 0; i < journal->len; ++i) {
		if(count > 20)
			break;
		if(journal->logs[i].pict == 0)
			continue;
		build_log_pict(f, &journal->logs[i], 1);
		count++;
	}
}

void
build_special_now(FILE* f, Lexicon* lex, Journal* jou)
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
		build_log_pict(f, finddiary(jou, findterm(lex, pname[i])), 1);
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
build_special_index(FILE* f, Lexicon* lex, Journal* jou)
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
	print_term_details(f, &lex->terms[0], 0);
	fputs("</ul>", f);
}

void
build_page(FILE* f, Lexicon* lex, Term* t, Journal* jou)
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
	fputs("<header><a href='home.html'><img src='../media/identity/xiv28.gif' alt='" NAME "' height='29'></a></header>", f);
	build_nav(f, t);
	fputs("<main>", f);
	build_banner(f, jou, t, 1);
	build_body(f, lex, t);
	build_include(f, t);
	/* templated pages */
	if(scmp(t->type, "portal"))
		build_portal(f, jou, t);
	else if(scmp(t->type, "album"))
		build_album(f, jou, t);
	else if(scmp(t->type, "index"))
		build_index(f, lex, t);
	/* special pages */
	if(scmp(t->name, "now"))
		build_special_now(f, lex, jou);
	else if(scmp(t->name, "home"))
		build_special_home(f, jou);
	else if(scmp(t->name, "calendar"))
		build_special_calendar(f, jou);
	else if(scmp(t->name, "tracker"))
		build_special_tracker(f, jou);
	else if(scmp(t->name, "journal"))
		build_special_journal(f, jou);
	else if(scmp(t->name, "index"))
		build_special_index(f, lex, jou);
	build_list(f, t);
	build_links(f, t);
	build_incoming(f, t);
	build_horaire(f, jou, t);
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
fprss(FILE* f, Journal* journal)
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
	for(i = 0; i < journal->len; ++i) {
		Log l = journal->logs[i];
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
		fprintf(f, "<p>%s<br/><br/><a href='" DOMAIN "site/%s.html'>%s</a></p>", l.term->bref, l.term->filename, l.term->name);
		fputs("]]>\n", f);
		fputs("  </description>\n", f);
		fputs("</item>\n", f);
	}
	fputs("</channel>", f);
	fputs("</rss>", f);
	fclose(f);
}

void
fptwtxt(FILE* f, Journal* journal)
{
	int i;
	for(i = 0; i < journal->len; ++i) {
		Log l = journal->logs[i];
		if(l.rune != '+')
			continue;
		fputs_rfc3339(f, arvelie_to_time(l.date));
		fprintf(f, "\t%s | " DOMAIN "%s\n", l.name, l.term->filename);
	}
	fclose(f);
}

FILE*
parse_glossary(FILE* fp, Glossary* glossary)
{
	int len, depth, count = 0, split = 0;
	char line[512];
	List* l = &glossary->lists[glossary->len];
	if(fp == NULL)
		error("Could not open", "glossary");
	while(fgets(line, 512, fp)) {
		depth = cpad(line, ' ');
		len = slen(strm(line));
		if(len < 4 || line[0] == ';')
			continue;
		if(len > 400)
			error("Line is too long", line);
		if(depth == 0) {
			l = &glossary->lists[glossary->len];
			slca(sstr(line, l->name, 0, len));
			glossary->len++;
		} else if(depth == 2) {
			if(l->len >= LIST_ITEMS)
				error("Reached list item limit", l->name);
			split = cpos(line, ':');
			if(split < 0)
				sstr(line, l->vals[l->len], 2, len + 2);
			else {
				sstr(line, l->keys[l->len], 2, split - 3);
				sstr(line, l->vals[l->len], split + 2, len - split);
			}
			l->len++;
		}
		count++;
	}
	printf("(%d lines) ", count);
	return fp;
}

FILE*
parse_lexicon(FILE* fp, Lexicon* lexicon)
{
	int key_len, val_len, len, count = 0, catch_body = 0, catch_link = 0, catch_list = 0;
	char line[1024];
	if(fp == NULL)
		error("Could not open", "lexicon");
	while(fgets(line, 1024, fp)) {
		int depth = cpad(line, ' ');
		strm(line);
		len = slen(line);
		if(len < 3 || line[0] == ';')
			continue;
		if(len > 750)
			error("Line is too long", line);
		if(depth == 0) {
			Term* t = &lexicon->terms[lexicon->len];
			if(!sans(line))
				error("Lexicon key is not alphanum", line);
			sstr(line, t->name, 0, len);
			sstr(line, t->filename, 0, len);
			slca(t->name);
			scsw(slca(t->filename), ' ', '_');
			lexicon->len++;
		} else if(depth == 2) {
			Term* t = &lexicon->terms[lexicon->len - 1];
			if(spos(line, "HOST : ") >= 0)
				sstr(line, t->host, 9, len - 9);
			if(spos(line, "BREF : ") >= 0)
				sstr(line, t->bref, 9, len - 9);
			if(spos(line, "TYPE : ") >= 0)
				sstr(line, t->type, 9, len - 9);
			catch_body = spos(line, "BODY") >= 0;
			catch_link = spos(line, "LINK") >= 0;
			catch_list = spos(line, "LIST") >= 0;
		} else if(depth == 4) {
			Term* t = &lexicon->terms[lexicon->len - 1];
			/* Body */
			if(catch_body) {
				sstr(line, t->body[t->body_len], 4, len - 4);
				t->body_len++;
			}
			/* Link */
			if(catch_link) {
				key_len = cpos(line, ':') - 5;
				sstr(line, t->link.keys[t->link.len], 4, key_len);
				val_len = len - key_len - 5;
				sstr(line, t->link.vals[t->link.len], key_len + 7, val_len);
				t->link.len++;
			}
			/* List */
			if(catch_list) {
				sstr(line, t->list[t->list_len], 4, len - 4);
				t->list_len++;
			}
		}
		count++;
	}
	printf("(%d lines) ", count);
	return fp;
}

FILE*
parse_horaire(FILE* fp, Journal* journal)
{
	int len, count = 0;
	char line[256];
	if(fp == NULL)
		error("Could not open", "horaire");
	while(fgets(line, 256, fp)) {
		Log* l;
		strm(line);
		len = slen(line);
		if(len < 14 || line[0] == ';')
			continue;
		if(len > 72)
			error("Log is too long", line);
		l = &journal->logs[journal->len];
		/* Date */
		sstr(line, l->date, 0, 5);
		/* Rune */
		l->rune = line[6];
		/* Code */
		l->code = sint(line + 7, 3);
		/* Term */
		sstr(line, l->host, 11, 21);
		strm(l->host);
		if(!sans(l->host))
			printf("Warning: %s is not alphanum\n", l->host);
		/* Pict */
		if(len >= 35)
			l->pict = sint(line + 32, 3);
		/* Name */
		if(len >= 38) {
			sstr(line, l->name, 36, LOG_BUF_LEN);
			strm(l->name);
		}
		journal->len++;
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
	fclose(parse_lexicon(fopen("database/lexicon.ndtl", "r"), lex));
	printf("horaire");
	fclose(parse_horaire(fopen("database/horaire.tbtl", "r"), jou));
}

void
link(Glossary* glo, Lexicon* lex, Journal* jou)
{
	int i, j;
	printf("Linking  | ");
	printf("journal(%d entries) ", jou->len);
	for(i = 0; i < jou->len; ++i) {
		Log* l = &jou->logs[i];
		l->term = findterm(lex, l->host);
		if(!l->term)
			error("Unknown log host", l->host);
		else {
			if(slen(l->term->date_last) == 0)
				scpy(l->date, l->term->date_last);
			scpy(l->date, l->term->date_from);
		}
	}
	printf("lexicon(%d entries) ", lex->len);
	for(i = 0; i < lex->len; ++i) {
		Term* t = &lex->terms[i];
		for(j = 0; j < t->body_len; ++j)
			ftemplate(NULL, lex, t, t->body[j]);
		t->parent = findterm(lex, t->host);
		if(!t->parent)
			error("Unknown term host", t->host);
		t->parent->children[t->parent->children_len] = t;
		t->parent->children_len++;
	}
	printf("glossary(%d entries) ", glo->len);
	for(i = 0; i < lex->len; ++i) {
		Term* t = &lex->terms[i];
		for(j = 0; j < t->list_len; ++j) {
			List* l = findlist(glo, t->list[j]);
			if(!l)
				error("Unknown list", t->list[j]);
			t->docs[t->docs_len] = l;
			t->docs_len++;
			l->routes++;
		}
	}
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
		build_page(f, lex, &lex->terms[i], jou);
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
check(Glossary* glo, Journal* jou)
{
	int i, j, found = 0;
	printf("Checking | ");
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

Lexicon all_terms;
Glossary all_lists;
Journal all_logs;

int
main(void)
{
	clock_t start;

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
	check(&all_lists, &all_logs);
	printf("[%.2fms]\n", clock_since(start));

	return (0);
}
