#include <stdlib.h>
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

#define NAME "XXIIVV"
#define DOMAIN "https://wiki.xxiivv.com/"
#define LOCATION "Victoria, Canada"
#define REPOPATH "https://github.com/XXIIVV/oscean/blob/master/src/inc/"

typedef struct List {
	char name[KEY_BUF_LEN];
	char keys[100][100];
	char vals[100][500];
	int pairs_len;
	char items[100][500];
	int items_len;
	int links_len;
} List;

typedef struct Term {
	char name[KEY_BUF_LEN];
	char filename[KEY_BUF_LEN];
	char host[21];
	char bref[200];
	char type[KEY_BUF_LEN];
	char date_from[6];
	char date_last[6];
	char body[30][750];
	int body_len;
	struct Term* parent;
	struct Term* children[20];
	int children_len;
	char link_keys[20][KEY_BUF_LEN];
	char link_vals[20][100];
	int link_len;
	char list[20][KEY_BUF_LEN];
	int list_len;
	List* docs[20];
	int docs_len;
	struct Term* incoming[KEY_BUF_LEN];
	int incoming_len;
} Term;

typedef struct Log {
	char date[6];
	char rune;
	int code;
	char host[KEY_BUF_LEN];
	int pict;
	char name[LOG_BUF_LEN];
	int is_event;
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

Glossary all_lists;
Lexicon all_terms;
Journal all_logs;

void
error(char* msg, char* val)
{
	printf("Error: %s(%s)\n", msg, val);
	exit(0);
}

List*
find_list(Glossary* glossary, char* name)
{
	int i;
	for(i = 0; i < glossary->len; ++i) {
		List* l = &glossary->lists[i];
		if(scmp(name, l->name))
			return l;
	}
	return NULL;
}

Term*
find_term(Lexicon* lexicon, char* name)
{
	int i;
	slca(name);
	scsw(name, '_', ' ');
	for(i = 0; i < lexicon->len; ++i) {
		Term* t = &lexicon->terms[i];
		if(scmp(name, t->name))
			return t;
	}
	return NULL;
}

Log*
find_last_diary(Term* term)
{
	int i;
	for(i = 0; i < all_logs.len; ++i) {
		Log* l = &all_logs.logs[i];
		if(l->term != term || l->pict < 1)
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
register_incoming(Term* src, char* dest)
{
	Term* host = find_term(&all_terms, dest);
	if(host) {
		host->incoming[host->incoming_len] = src;
		host->incoming_len++;
	} else
		error("Unknown incoming", dest);
}

void
build_lifeline(FILE* f, Term* term)
{
	int limit_from = arvelie_to_epoch("06I04");
	int limit_to = get_epoch();
	int range_from = arvelie_to_epoch(term->date_from);
	int range_to = arvelie_to_epoch(term->date_last);
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
build_log_pict(FILE* f, Log* log, int caption)
{
	build_pict(f, log->pict, log->date, log->name, caption, NULL);
}

void
build_body_part(FILE* f, Term* term)
{
	int i;
	for(i = 0; i < term->body_len; ++i)
		fputs(term->body[i], f);
}

void
build_nav_part(FILE* f, Term* term, Term* target)
{
	int i;
	fputs("<ul>", f);
	for(i = 0; i < term->children_len; ++i) {
		if(term->children[i]->name == term->name)
			continue; /* Paradox */
		if(term->children[i]->name == target->name)
			fprintf(f, "<li><a href='%s.html'>%s/</a></li>", term->children[i]->filename, term->children[i]->name);
		else
			fprintf(f, "<li><a href='%s.html'>%s</a></li>", term->children[i]->filename, term->children[i]->name);
	}
	fputs("</ul>", f);
}

void
build_banner(FILE* f, Term* term, int caption)
{
	Log* l = find_last_diary(term);
	if(l)
		build_log_pict(f, l, caption);
}

void
build_nav(FILE* f, Term* term)
{
	if(term->parent == NULL)
		error("Missing parent", term->name);
	if(term->parent->parent == NULL)
		error("Missing parent", term->parent->name);
	fputs("<nav>", f);
	if(term->parent->parent->name == term->parent->name)
		build_nav_part(f, term->parent->parent, term);
	else
		build_nav_part(f, term->parent->parent, term->parent);
	if(term->parent->parent->name != term->parent->name)
		build_nav_part(f, term->parent, term);
	if(term->parent->name != term->name)
		build_nav_part(f, term, term);
	fputs("</nav>", f);
}

void
build_body(FILE* f, Term* term)
{
	fprintf(f, "<h2>%s</h2>", term->bref);
	build_body_part(f, term);
}

void
build_list(FILE* f, Term* term)
{
	int i, j;
	for(i = 0; i < term->docs_len; ++i) {
		List* l = term->docs[i];
		fprintf(f, "<h3>%s</h3>", l->name);
		fputs("<ul>", f);
		for(j = 0; j < l->pairs_len; ++j)
			if(surl(l->vals[j]))
				fprintf(f, "<li><a href='%s'>%s</a></li>", l->vals[j], l->keys[j]);
			else
				fprintf(f, "<li><b>%s</b>: %s</li>", l->keys[j], l->vals[j]);
		for(j = 0; j < l->items_len; ++j)
			fprintf(f, "<li>%s</li>", l->items[j]);
		fputs("</ul>", f);
	}
}

void
build_include(FILE* f, Term* term)
{
	char buffer[4096];
	FILE* fp = getfile("inc/", term->filename, ".htm", "r");
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
	        term->filename, term->name);
	fclose(fp);
}

void
build_index(FILE* f, Term* term)
{
	int i;
	for(i = 0; i < term->children_len; ++i) {
		Term* child = term->children[i];
		fprintf(f, "<h3><a href='%s.html'>%s</a></h3>", child->filename, child->name);
		build_body_part(f, child);
		build_list(f, child);
	}
}

void
build_portal(FILE* f, Term* term)
{
	int i;
	for(i = 0; i < term->children_len; ++i) {
		Term* t = term->children[i];
		Log* l = find_last_diary(t);
		if(l != NULL)
			build_pict(f, l->pict, t->name, t->bref, 1, t->filename);
	}
}

void
build_album(FILE* f, Term* term)
{
	int i;
	for(i = 0; i < all_logs.len; ++i) {
		Log l = all_logs.logs[i];
		if(l.term != term || l.pict < 1 || l.pict == find_last_diary(term)->pict)
			continue;
		build_log_pict(f, &l, 1);
	}
}

void
build_links(FILE* f, Term* term)
{
	int i;
	if(term->link_len < 1)
		return;
	fputs("<ul>", f);
	for(i = 0; i < term->link_len; ++i)
		fprintf(f, "<li><a href='%s' target='_blank'>%s</a></li>",
		        term->link_vals[i], term->link_keys[i]);
	fputs("</ul>", f);
}

void
build_incoming(FILE* f, Term* term)
{
	int i;
	if(term->incoming_len < 1)
		return;
	fputs("<p>", f);
	fprintf(f, "<i>incoming(%d)</i>: ", term->incoming_len);
	for(i = 0; i < term->incoming_len; ++i)
		fprintf(f, "<a href='%s.html'>%s</a> ", term->incoming[i]->filename, term->incoming[i]->name);
	fputs("</p>", f);
}

void
build_horaire(FILE* f, Term* term)
{
	int i;
	int len = 0;
	int events_len = 0;
	int ch = 0;
	int fh = 0;
	for(i = 0; i < all_logs.len; ++i) {
		Log* l = &all_logs.logs[i];
		if(l->term != term && l->term->parent != term)
			continue;
		if(l->is_event)
			events_len++;
		ch += (l->code / 10) % 10;
		fh += l->code % 10;
		len++;
	}
	/* Updated */
	if(len < 2 || slen(term->date_last) == 0)
		return;
	fputs("<p>", f);
	fprintf(f, "<i>Last update on <a href='tracker.html'>%s</a>, edited %d times. +%d/%dfh</i>",
	        term->date_last, len, ch, fh);
	build_lifeline(f, term);
	fputs("</p>", f);
	/* Events */
	if(events_len < 1)
		return;
	fputs("<ul>", f);
	for(i = 0; i < all_logs.len; ++i) {
		Log* l = &all_logs.logs[i];
		if(!l->is_event)
			continue;
		if(l->term != term && l->term->parent != term)
			continue;
		fprintf(f, "<li>%s — %s</li>", l->date, l->name);
	}
	fputs("</ul>", f);
}

void
print_term_details(FILE* f, Term* term, int depth)
{
	int i;
	depth++;
	fprintf(f, "<li><a href='%s.html'>%s</a></li>", term->filename, term->name);
	if(term->children_len < 1)
		return;
	fputs("<ul>", f);
	for(i = 0; i < term->children_len; ++i)
		if(!scmp(term->children[i]->name, term->name))
			print_term_details(f, term->children[i], depth);
	fputs("</ul>", f);
}

void
build_special_home(FILE* f, Journal* journal)
{
	int i, events = 0;
	for(i = 0; i < 5; ++i) {
		if(journal->logs[i].is_event) {
			events = 1;
			break;
		}
	}
	if(!events)
		return;
	fputs("<h2>Events</h2>", f);
	fputs("<ul>", f);
	for(i = 0; i < 5; ++i) {
		if(!journal->logs[i].is_event)
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
		if(!journal->logs[i].is_event)
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
build_special_now(FILE* f, Journal* journal)
{
	int i, epoch, index = 0, projects_len = 0;
	Log l;
	char *projects_name[LOGS_RANGE], *projects_filename[LOGS_RANGE];
	double sum_value = 0, projects_value[LOGS_RANGE], max_value = 0;
	epoch = get_epoch();
	for(i = 0; i < LOGS_RANGE; ++i) {
		l = journal->logs[i];
		if(epoch - arvelie_to_epoch(l.date) > LOGS_RANGE)
			break;
		index = afnd(projects_name, projects_len, l.term->name);
		if(index < 0) {
			index = projects_len;
			projects_name[index] = l.term->name;
			projects_filename[index] = l.term->filename;
			projects_value[index] = 0;
			projects_len++;
		}
		projects_value[index] += l.code % 10;
		sum_value += l.code % 10;
	}
	/* find most active with a photo */
	for(i = 0; i < projects_len; ++i) {
		if(find_last_diary(find_term(&all_terms, projects_name[i])) && projects_value[i] > max_value)
			max_value = projects_value[i];
	}

	for(i = 0; i < projects_len; ++i) {
		if(projects_value[i] != max_value)
			continue;
		build_log_pict(f, find_last_diary(find_term(&all_terms, projects_name[i])), 1);
	}

	fprintf(
	    f,
	    "<p>This data shows the distribution of <b>%.0f hours over %d projects</b>, recorded during the last %d days, for an average of %.1f work hours per day and %.1f work hours per project.</p>",
	    sum_value, projects_len, LOGS_RANGE, sum_value / LOGS_RANGE, sum_value / projects_len);
	fputs("<ul style='columns:2'>", f);
	for(i = 0; i < projects_len; ++i) {
		fputs("<li>", f);
		fprintf(f, "<a href='%s.html'>%s</a> %.2f&#37; ",
		        projects_filename[i],
		        projects_name[i],
		        projects_value[i] / sum_value * 100);
		fputs("</li>", f);
	}
	fputs("</ul>", f);
	fprintf(f, "<p>Last generated on %s(" LOCATION ").</p>", nowstr());
}

void
build_special_index(FILE* f)
{
	fputs("<ul>", f);
	print_term_details(f, &all_terms.terms[0], 0);
	fputs("</ul>", f);
}

void
build_page(FILE* f, Term* term, Journal* journal)
{
	fprintf(f, "<!DOCTYPE html>"
	           "<html lang='en'>"
	           "<head>"
	           "<meta charset='utf-8'>"
	           "<meta name='description' content='%s'/>"
	           "<meta name='thumbnail' content='" DOMAIN "media/services/thumbnail.jpg' />"
	           "<link rel='alternate' type='application/rss+xml' title='RSS Feed' href='../links/rss.xml' />"
	           "<link rel='stylesheet' type='text/css' href='../links/main.css'>"
	           "<link rel='shortcut icon' type='image/png' href='../media/services/icon.png'>"
	           "<title>" NAME " — %s</title>"
	           "</head>"
	           "<body>",
	        term->bref, term->name);
	fputs("<header><a href='home.html'><img src='../media/identity/xiv28.gif' alt='" NAME "' height='29'></a></header>", f);
	build_nav(f, term);
	fputs("<main>", f);
	build_banner(f, term, 1);
	build_body(f, term);
	build_include(f, term);
	/* templated pages */
	if(scmp(term->type, "portal"))
		build_portal(f, term);
	else if(scmp(term->type, "album"))
		build_album(f, term);
	else if(scmp(term->type, "index"))
		build_index(f, term);
	/* special pages */
	if(scmp(term->name, "now"))
		build_special_now(f, journal);
	else if(scmp(term->name, "home"))
		build_special_home(f, journal);
	else if(scmp(term->name, "calendar"))
		build_special_calendar(f, journal);
	else if(scmp(term->name, "tracker"))
		build_special_tracker(f, journal);
	else if(scmp(term->name, "journal"))
		build_special_journal(f, journal);
	else if(scmp(term->name, "index"))
		build_special_index(f);
	build_list(f, term);
	build_links(f, term);
	build_incoming(f, term);
	build_horaire(f, term);
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
build_rss(FILE* f, Journal* journal)
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

FILE*
parse_glossary(FILE* fp, Glossary* glossary)
{
	int key_len, val_len, len, depth, count = 0;
	char line[512];
	if(fp == NULL)
		error("Could not open", "glossary");
	while(fgets(line, 512, fp)) {
		/* get depth */
		for(depth = 0; depth < slen(line) + 1; depth++)
			if(line[depth] != ' ')
				break;
		strm(line);
		len = slen(line);
		if(len < 4 || line[0] == ';')
			continue;
		if(len > 400)
			error("Line is too long", line);
		if(depth == 0) {
			List* l = &glossary->lists[glossary->len];
			sstr(line, l->name, 0, len);
			if(!sans(l->name))
				error("Glossary key is not alphanum", line);
			slca(l->name);
			glossary->len++;
		} else if(depth == 2) {
			List* l = &glossary->lists[glossary->len - 1];
			if(spos(line, " : ") >= 0) {
				key_len = cpos(line, ':') - 3;
				sstr(line, l->keys[l->pairs_len], 2, key_len);
				val_len = len - key_len - 5;
				sstr(line, l->vals[l->pairs_len], key_len + 5, val_len);
				l->pairs_len++;
			} else {
				sstr(line, l->items[l->items_len], 2, len);
				l->items_len++;
			}
		}
		count++;
	}
	printf("(%d lines) ", count);
	return fp;
}

FILE*
parse_lexicon(FILE* fp, Lexicon* lexicon)
{
	int key_len, val_len, len, depth, count = 0, catch_body = 0, catch_link = 0, catch_list = 0;
	char line[1024];
	if(fp == NULL)
		error("Could not open", "lexicon");
	while(fgets(line, 1024, fp)) {
		/* get depth */
		for(depth = 0; depth < slen(line) + 1; depth++)
			if(line[depth] != ' ')
				break;
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
				sstr(line, t->link_keys[t->link_len], 4, key_len);
				val_len = len - key_len - 5;
				sstr(line, t->link_vals[t->link_len], key_len + 7, val_len);
				t->link_len++;
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
		l->is_event = l->rune == '+';
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
parse(void)
{
	printf("Parsing  | ");
	printf("glossary");
	fclose(parse_glossary(fopen("database/glossary.ndtl", "r"), &all_lists));
	printf("lexicon");
	fclose(parse_lexicon(fopen("database/lexicon.ndtl", "r"), &all_terms));
	printf("horaire");
	fclose(parse_horaire(fopen("database/horaire.tbtl", "r"), &all_logs));
}

void
link(void)
{
	int i, j;
	printf("Linking  | ");
	printf("journal(%d entries) ", all_logs.len);
	for(i = 0; i < all_logs.len; ++i) {
		Log* l = &all_logs.logs[i];
		l->term = find_term(&all_terms, l->host);
		if(!l->term)
			error("Unknown log host", l->host);
		else {
			if(slen(l->term->date_last) == 0)
				scpy(l->date, l->term->date_last);
			scpy(l->date, l->term->date_from);
		}
	}
	printf("lexicon(%d entries) ", all_terms.len);
	for(i = 0; i < all_terms.len; ++i) {
		Term* t = &all_terms.terms[i];
		t->parent = find_term(&all_terms, t->host);
		if(!t->parent)
			error("Unknown term host", t->host);
		t->parent->children[t->parent->children_len] = t;
		t->parent->children_len++;
	}
	printf("glossary(%d entries) ", all_lists.len);
	for(i = 0; i < all_terms.len; ++i) {
		Term* t = &all_terms.terms[i];
		for(j = 0; j < t->list_len; ++j) {
			List* l = find_list(&all_lists, t->list[j]);
			if(!l)
				error("Unknown list", t->list[j]);
			t->docs[t->docs_len] = l;
			t->docs_len++;
			l->links_len++;
		}
	}
}

void
template_mods(char* src, char* dest)
{
	int split, targetsplit;
	char target[256], params[256];
	split = cpos(src, ' ');
	sstr(src, target, split + 1, slen(src) - split - 2);
	targetsplit = cpos(target, ' ');
	if(targetsplit > 0) {
		sstr(target, params, targetsplit + 1, slen(target) - targetsplit - 1);
		sstr(src, target, split + 1, targetsplit);
	}
	/* create new string */
	dest[0] = '\0';
	if(spos(src, "^itchio") >= 0) {
		scat(dest, "<iframe frameborder='0' src='https://itch.io/embed/");
		scat(dest, target);
		scat(dest, "?link_color=000000' width='600' height='167'></iframe>");
	} else if(spos(src, "^bandcamp") >= 0) {
		scat(dest, "<iframe style='border: 0; width: 600px; height: 274px;' src='https://bandcamp.com/EmbeddedPlayer/album=");
		scat(dest, target);
		scat(dest, "/size=large/bgcol=ffffff/linkcol=333333/artwork=small' seamless></iframe>");
	} else if(spos(src, "^youtube") >= 0) {
		scat(dest, "<iframe width='600' height='380' src='https://www.youtube.com/embed/");
		scat(dest, target);
		scat(dest, "?rel=0' style='max-width:700px' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>");
	} else if(spos(src, "^redirect") >= 0) {
		scat(dest, "<meta http-equiv='refresh' content='2; url=");
		scat(dest, target);
		scat(dest, ".html' />");
		scat(dest, "<p>In a hurry? Travel to <a href='");
		scat(dest, target);
		scat(dest, ".html'>");
		scat(dest, target);
		scat(dest, "</a>.</p>");
	} else if(spos(src, "^img") >= 0) {
		if(targetsplit > 0) {
			scat(dest, "<img src='../media/");
			scat(dest, target);
			scat(dest, "' width='");
			scat(dest, params);
			scat(dest, "'/>&nbsp;");
		} else {
			scat(dest, "<img src='../media/");
			scat(dest, target);
			scat(dest, "'/>&nbsp;");
		}
	} else
		printf("Warning: Missing template mod: %s\n", src);
}

void
template_link(char* src, char* dest)
{
	int split = cpos(src, ' ');
	char target[256], name[256];
	/* find target and name */
	if(split == -1) {
		sstr(src, target, 1, slen(src) - 2);
		scpy(target, name);
	} else {
		sstr(src, target, 1, split - 1);
		sstr(src, name, split + 1, slen(src) - split - 2);
	}
	/* create new string */
	dest[0] = '\0';
	if(surl(target)) {
		scat(dest, "<a href='");
		scat(dest, target);
		scat(dest, "' target='_blank'>");
		scat(dest, name);
		scat(dest, "</a>");
	} else {
		Term* t = find_term(&all_terms, target);
		if(!t)
			error("Unknown link", target);
		scat(dest, "<a href='");
		scat(dest, t->filename);
		scat(dest, ".html'>");
		scat(dest, name);
		scat(dest, "</a>");
	}
}
void
template_seg(Term* term, char* src)
{
	int recording = 0;
	char buffer[512], fw[512], full[512], res[1024], templated[1024];
	int i, len;
	scpy(src, res);
	for(i = 0; i < (int)slen(src); ++i) {
		char c = src[i];
		if(c == '}') {
			recording = 0;
			/* capture full template */
			sstr(src, full, i - slen(buffer) - 1, slen(buffer) + 2);
			if(full[1] == '^')
				template_mods(full, templated);
			else
				template_link(full, templated);
			swapstr(res, res, full, templated);
			/* save incoming */
			firstword(buffer, fw);
			if(!surl(fw) && fw[0] != '^')
				register_incoming(term, fw);
		}
		if(recording) {
			len = slen(buffer);
			buffer[len] = c;
			buffer[len + 1] = '\0';
		}
		if(c == '{') {
			recording = 1;
			buffer[0] = '\0';
		}
	}
	scpy(res, src);
}

int
req_template(char* str)
{
	int i, open = 0, shut = 0;
	for(i = 0; i < (int)slen(str); i++) {
		if(str[i] == '{')
			open++;
		else if(str[i] == '}')
			shut++;
	}
	if(open != shut)
		printf("Warning: Templating mismatch: %s(%d/%d)\n", str, open, shut);
	return open > 0 && shut > 0;
}

void template(void)
{
	int i, j, count = 0;
	printf("Template | ");
	for(i = 0; i < all_terms.len; ++i) {
		Term* term = &all_terms.terms[i];
		for(j = 0; j < term->body_len; ++j) {
			if(req_template(term->body[j])) {
				template_seg(term, term->body[j]);
				count++;
			}
		}
	}
	printf("%d strings", count);
}

void
build(void)
{
	FILE* f;
	int i;
	printf("Building | ");
	printf("%d pages ", all_terms.len);
	for(i = 0; i < all_terms.len; ++i) {
		f = getfile("../site/", all_terms.terms[i].filename, ".html", "w");
		if(f == NULL)
			error("Could not open file", all_terms.terms[i].name);
		build_page(f, &all_terms.terms[i], &all_logs);
	}
	printf("1 feed ");
	f = fopen("../links/rss.xml", "w");
	if(f == NULL)
		error("Could not open file", "rss.xml");
	build_rss(f, &all_logs);
}

void
check(void)
{
	int pict_used_len;
	int pict_used[999];
	int i;
	pict_used_len = 0;
	printf("Checking | ");
	/* Find invalid logs */
	for(i = 0; i < all_logs.len; ++i) {
		Log* l = &all_logs.logs[i];
		if(l->code < 1)
			printf("Warning: Empty code %s\n", l->date);
		if(l->pict > 0) {
			pict_used[pict_used_len] = l->pict;
			pict_used_len++;
		}
	}
	/* Find unlinked lists */
	for(i = 0; i < all_lists.len; ++i) {
		List* l = &all_lists.lists[i];
		if(l->links_len < 1)
			printf("Warning: Unlinked list \"%s\"\n", l->name);
	}
	/* Find next available diary id */
	for(i = 1; i < 999; ++i) {
		int j;
		for(j = 0; j < pict_used_len; j++) {
			if(pict_used[j] == i && j < 0) {
				printf("Completed at #%d ", i);
				break;
			}
		}
	}
}

int
main(void)
{
	clock_t start;

	printf("Today    | ");
	print_arvelie();

	start = clock();
	parse();
	printf("[%.2fms]\n", clock_since(start));
	start = clock();
	link();
	printf("[%.2fms]\n", clock_since(start));
	start = clock();
	template();
	printf("[%.2fms]\n", clock_since(start));
	start = clock();
	build();
	printf("[%.2fms]\n", clock_since(start));
	start = clock();
	check();
	printf("[%.2fms]\n", clock_since(start));

	return (0);
}
