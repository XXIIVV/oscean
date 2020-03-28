#include <stdbool.h>
#include <string.h>
#include <ctype.h>
#include <stdio.h>
#include <time.h>
#include <math.h>

#include "helpers.c"

#define STR_BUF_LEN 64
#define LOGS_BUFFER 512
#define DICT_BUFFER 46
#define LIST_BUFFER 46
#define TERM_DICT_BUFFER 16
#define TERM_LIST_BUFFER 16
#define TERM_BODY_BUFFER 24
#define TERM_LINK_BUFFER 8
#define TERM_LOGS_BUFFER 340
#define TERM_CHILDREN_BUFFER 16
#define JOURNAL_BUFFER 8192
#define TRACKER_BUFFER 512

int pict_used_len = 0;
int pict_used[999];

char *html_head = "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'><meta name='author' content='Devine Lu Linvega'><meta name='description' content='The Nataniev Library.'/><meta name='keywords' content='Aliceffekt, Devine Lu Linvega, Lietal, Oquonie, Verreciel, Nataniev, Oscean, Solarpunk' /><meta name='license' content='name=BY-NC-SA(4.0), url=https://creativecommons.org/licenses/by-nc-sa/4.0/'/><meta name='thumbnail' content='https://wiki.xxiivv.com/media/services/thumbnail.jpg' /><meta name='viewport' content='width=device-width, initial-scale=1.0'><link rel='stylesheet' type='text/css' href='../links/main.css'><link rel='shortcut icon' type='image/x-icon' href='../media/services/favicon.ico' /><title>XXIIVV — %s</title></head><body>";

char *html_header = "<header><a id='logo' href='home.html'><img src='../media/icon/logo.svg' alt='XXIIVV'></a></header>";

char *html_footer = "<footer><a href='https://creativecommons.org/licenses/by-nc-sa/4.0' target='_blank'><img src='../media/icon/cc.svg' alt='by-nc-sa' width='30'/></a> <a href='http://webring.xxiivv.com/' target='_blank' rel='noreferrer'><img src='../media/icon/rotonde.svg' alt='webring' width='30'/></a> <a href='https://merveilles.town/@neauoire' target='_blank'><img src='../media/icon/merveilles.svg' alt='Merveilles' width='30'/></a> <a href='https://github.com/neauoire' target='_blank'><img src='../media/icon/github.png' alt='github' width='30'/></a> <span><a href='devine_lu_linvega.html' target='_self'>Devine Lu Linvega</a> © 2020 — <a href='about.html' target='_self'>BY-NC-SA 4.0</a></span></footer></body></html>";

// Types

typedef struct Dict {
  char *name;
  int words_len;
  char *keys[DICT_BUFFER];
  char *values[DICT_BUFFER];
} Dict;

typedef struct List {
  char *name;
  int items_len;
  char *items[LIST_BUFFER];
} List;

typedef struct Term {
  bool is_portal;
  bool is_album;
  bool is_index;

  int children_len;
  int body_len;
  int links_len;
  int dicts_len;
  int lists_len;

  char *name;
  char *path;
  char *bref;
  char *icon;

  struct Term *parent;

  char *body_text[TERM_BODY_BUFFER];
  char *body_meta[TERM_BODY_BUFFER];
  char *body_tags[TERM_BODY_BUFFER];
  char *links_names[TERM_LINK_BUFFER];
  char *links_urls[TERM_LINK_BUFFER];
  struct Term *children[TERM_CHILDREN_BUFFER];
  Dict *dicts[TERM_DICT_BUFFER];
  List *lists[TERM_LIST_BUFFER];
} Term;

typedef struct Log {
  Term *term;
  char *date;
  int code;
  char *name;
  int pict;
  bool is_event;
} Log;

typedef struct Journal {
  int len;
  Log logs[JOURNAL_BUFFER];
} Journal;

#include "graph.c"

Journal all_logs;

void add_journal_log(Journal *journal, Term *term, char *date, int code, char *name, int pict, bool is_event){
  if(journal->len >= JOURNAL_BUFFER){ 
    printf("Error: Reached journal buffer\n"); 
    return; 
  }
  Log log;
  log.term = term;
  log.date = date;
  log.code = code;
  log.name = name;
  log.pict = pict;
  log.is_event = is_event;
  journal->logs[journal->len] = log;
  journal->len++;
}

// Creators/Setters

Dict create_dict(char *name) {
  Dict d;
  d.name = name;
  d.words_len = 0;
  return d;
}

void add_word(Dict *dict, char *key, char *value) {
  if (dict->words_len >= DICT_BUFFER) {
    printf("Error: Reached DICT_BUFFER\n");
    return;
  }
  dict->keys[dict->words_len] = key;
  dict->values[dict->words_len] = value;
  dict->words_len++;
}

List create_list(char *name) {
  List l;
  l.name = name;
  l.items_len = 0;
  return l;
}

void add_item(List *list, char *item) {
  if (list->items_len >= LIST_BUFFER) {
    printf("Error: Reached LIST_BUFFER\n");
    return;
  }
  list->items[list->items_len] = item;
  list->items_len++;
}

Term create_term(Term *parent, char *name, char *bref) {
  Term t;
  t.is_portal = false;
  t.is_album = false;
  t.is_index = false;

  t.children_len = 0;
  t.body_len = 0;
  t.links_len = 0;
  t.dicts_len = 0;
  t.lists_len = 0;

  if (!is_alphanum(name)) {
    printf("Error: \"%s\" is not alphanumeric\n", name);
  }
  t.name = name;
  t.bref = bref;
  t.icon = "";

  t.parent = parent;

  char path[STR_BUF_LEN];
  to_filename(name, path);
  t.path = path;

  return t;
}

Term create_portal(Term *parent, char *name, char *bref) {
  Term t = create_term(parent, name, bref);
  t.is_portal = true;
  return t;
}

Term create_album(Term *parent, char *name, char *bref) {
  Term t = create_term(parent, name, bref);
  t.is_album = true;
  return t;
}

Term create_index(Term *parent, char *name, char *bref) {
  Term t = create_term(parent, name, bref);
  t.is_index = true;
  return t;
}

void add_body(Term *term, char *text, char *tag, char *meta) {
  if (term->body_len >= TERM_BODY_BUFFER) {
    printf("Error: Reached TERM_BODY_BUFFER\n");
    return;
  }
  term->body_text[term->body_len] = text;
  term->body_tags[term->body_len] = tag;
  term->body_meta[term->body_len] = meta;
  term->body_len++;
}

void add_html(Term *term, char *text) { add_body(term, text, "div", NULL); }

void add_text(Term *term, char *text) { add_body(term, text, "p", NULL); }

void add_header(Term *term, char *text) { add_body(term, text, "h3", NULL); }

void add_subheader(Term *term, char *text) { add_body(term, text, "h4", NULL); }

void add_quote(Term *term, char *text, char *source) {
  add_body(term, text, "q", source);
}

void add_dict(Term *term, Dict *dict) {
  if (term->dicts_len >= TERM_DICT_BUFFER) {
    printf("Error: Reached TERM_DICT_BUFFER\n");
    return;
  }
  term->dicts[term->dicts_len] = dict;
  term->dicts_len++;
}

void add_list(Term *term, List *list) {
  if (term->dicts_len >= TERM_LIST_BUFFER) {
    printf("Error: Reached TERM_LIST_BUFFER\n");
    return;
  }
  term->lists[term->lists_len] = list;
  term->lists_len++;
}

void add_link(Term *term, char *name, char *url) {
  if (term->links_len >= TERM_LINK_BUFFER) {
    printf("Error: Reached TERM_LINK_BUFFER\n");
    return;
  }
  term->links_names[term->links_len] = name;
  term->links_urls[term->links_len] = url;
  term->links_len++;
}

void record_pict(int pict){
  // check if it already exists
  for (int i = 1; i < pict_used_len; ++i) {
    if(pict == pict_used[i]){
      printf("Error: Duplicate id: %d\n", pict);
      return;
    }
  }

  pict_used[pict_used_len] = pict;
  pict_used_len++;
}

void add_event_diary(Term *term, char *date, int code, char *name, int pict) {
  add_journal_log(&all_logs, term, date, code, name, pict, true);
  record_pict(pict);
}

void add_diary(Term *term, char *date, int code, char *name, int pict) {
  add_journal_log(&all_logs, term, date, code, name, pict, false);
  record_pict(pict);
}

void add_event(Term *term, char *date, int code, char *name) {
  add_journal_log(&all_logs, term, date, code, name, 0, true);
}

void add_log(Term *term, char *date, int code) {
  add_journal_log(&all_logs, term, date, code, NULL, 0, false);
}

// Tools

Log *find_last_diary(Term *term) {
  for (int i = 0; i < all_logs.len; ++i) {
    Log *l = &all_logs.logs[i];
    if (l->term != term) {
      continue;
    }
    if (l->pict < 1) {
      continue;
    }
    return l;
  }
  return NULL;
}

// Build(parts)

void build_pict(FILE *f, int pict, char *host, char *name, bool caption, char *link) {
  fputs("<figure>", f);
  fprintf(f, "<img src='../media/diary/%d.jpg' alt='%s picture'/>", pict, name);
  if(caption){
    fputs("<figcaption>", f);
    if(link){
      fprintf(f, "<a href='%s.html'>%s</a> — %s", link, host, name);
    }
    else{
      fprintf(f, "%s — %s", host, name);
    }
    fputs("</figcaption>", f);
  }
  fputs("</figure>", f);
}

void build_term_pict(FILE *f, Term *term, bool caption){
  Log *log = find_last_diary(term);
  if(log == NULL){
    // printf("Missing portal log for: %s\n", term->name);
    return;
  }
  char filename[STR_BUF_LEN];
  to_filename(term->name, filename);
  build_pict(f, log->pict, term->name, term->bref, caption, filename);
}

void build_log_pict(FILE *f, Log *log, bool caption){
  build_pict(f, log->pict, log->date, log->name, caption, NULL);
}

void build_body_part(FILE *f, Term *term){
  for (int i = 0; i < term->body_len; ++i) {
    fprintf(f, "<%s>%s</%s>", term->body_tags[i], term->body_text[i], term->body_tags[i]);
    if(term->body_meta[i] != NULL){
      fprintf(f, "<h5>— %s</h5>", term->body_meta[i]);
    }
  }
}

void build_nav_part(FILE *f, Term *term, Term *target){
  fputs("<ul>", f);
  for (int i = 0; i < term->children_len; ++i) {
    char child_filename[STR_BUF_LEN];
    to_filename(term->children[i]->name, child_filename);
    if(term->children[i]->name == target->name){
      fprintf(f, "<li><a href='%s.html'>%s/</a></li>", child_filename, term->children[i]->name);
    }
    else{
      fprintf(f, "<li><a href='%s.html'>%s</a></li>", child_filename, term->children[i]->name);  
    }
  }
  fputs("</ul>", f);
}

// Build

void build_banner(FILE *f, Term *term, bool caption){
  Log *l = find_last_diary(term);

  if(!l){ return; }

  build_log_pict(f, l, caption);
}

void build_nav(FILE *f, Term *term){
  if(term->parent == NULL){ printf("Missing parent for %s\n", term->name); return; }
  if(term->parent->parent == NULL){ printf("Missing parent for %s\n", term->parent->name); return; }

  fputs("<nav>", f);
  if(term->parent->parent->name == term->parent->name){
    build_nav_part(f, term->parent->parent, term);
  }
  else{
    build_nav_part(f, term->parent->parent, term->parent);
  }
  if(term->parent->parent->name != term->parent->name){
    build_nav_part(f, term->parent, term);
  }
  if(term->parent->name != term->name){
    build_nav_part(f, term, term);
  }
  fputs("</nav>", f);
}

void build_body(FILE *f, Term *term){
  fprintf(f, "<h2>%s</h2>", term->bref);
  build_body_part(f, term);
}

void build_dictionary(FILE *f, Term *term){
  for (int i = 0; i < term->dicts_len; ++i) {
    fprintf(f, "<h3>%s</h3>", term->dicts[i]->name);
    fputs("<ul>", f);
    for (int j = 0; j < term->dicts[i]->words_len; ++j) {
      fprintf(f, "<li><b>%s</b>: %s</li>", term->dicts[i]->keys[j], term->dicts[i]->values[j]);
    }
    fputs("</ul>", f);
  }
}

void build_listing(FILE *f, Term *term){
  for (int i = 0; i < term->lists_len; ++i) {
    fprintf(f, "<h3>%s</h3>", term->lists[i]->name);
    fputs("<ul>", f);
    for (int j = 0; j < term->lists[i]->items_len; ++j) {
      fprintf(f, "<li>%s</li>", term->lists[i]->items[j]);
    }
    fputs("</ul>", f);
  }
}

void build_include(FILE *f, Term *term){
  char filename[STR_BUF_LEN];
  to_filename(term->name, filename);
  char filepath[STR_BUF_LEN];

  int result = snprintf(filepath, sizeof filepath, "inc/%s.htm", filename);
  bool is_valid = result > 0 && (size_t)result < sizeof filename;

  if (!is_valid) {
    printf("Invalid filename: %s\n", filename);
    return;
  }

  char buffer[4096];
  FILE *fp = fopen(filepath, "r");
  if(fp == NULL){ return; }

  // printf("Including: %s(%s)\n", term->name, filepath);

  for (;;) {
    size_t sz = fread(buffer, 1, sizeof(buffer), fp);
    if (sz) {
      fwrite(buffer, 1, sz, f);
    } else if (feof(fp) || ferror(fp)) {
      break;
    }
  }   
  fclose(fp);
}

void build_index(FILE *f, Term *term){
  if(term->is_index != true){ return; }

  for (int k = 0; k < term->children_len; ++k) {
    char child_filename[STR_BUF_LEN];
    to_filename(term->children[k]->name, child_filename);
    fprintf(f, "<h3><a href='%s.html'>%s</a></h3>", child_filename, term->children[k]->name);
    build_body_part(f, term->children[k]);
    build_dictionary(f, term->children[k]);
    build_listing(f, term->children[k]);
  }
}

void build_portal(FILE *f, Term *term){
  if(term->is_portal != true){ return; }

  for (int k = 0; k < term->children_len; ++k) {
    build_term_pict(f, term->children[k], true);
  }
}

void build_album(FILE *f, Term *term){
  if(term->is_album != true){ return; }

  Log *header_log = find_last_diary(term);
  for (int i = 0; i < all_logs.len; ++i) {
    Log l = all_logs.logs[i];
    if(l.term != term){ continue; }
    if(l.pict < 1){ continue; }
    if(l.pict == header_log->pict){ continue; }
    build_log_pict(f, &l, true);
  }
}

void build_links(FILE *f, Term *term){
  fputs("<ul>", f);
  for (int i = 0; i < term->links_len; ++i) {
    fprintf(f, "<li><a href='%s' class='external'>%s</a></li>", term->links_urls[i], term->links_names[i]);
  }
  fputs("</ul>", f);
}

void build_horaire(FILE *f, Term *term){
  int len = 0;
  int events_len = 0;
  int ch = 0;
  int fh = 0;

  for (int i = 0; i < all_logs.len; ++i) {
    Log *l = &all_logs.logs[i];
    if (l->term != term && l->term->parent != term) { continue; }
    if (l->is_event == true) { events_len += 1; }
    ch += (l->code / 10) % 10;
    fh += l->code % 10;
    len += 1;
  }

  if (len < 2) {
    return;
  }

  for (int i = 0; i < all_logs.len; ++i) {
    Log *l = &all_logs.logs[i];
    if(l->term != term){ continue; }
    fprintf(f, "<p><i>Last update on <a href='tracker.html'>%s</a>, edited %d times.</i> +%d/%dfh</p>", l->date, len, ch, fh);  
    break;
  }

  if (events_len < 1) {
    return;
  }
  
  fputs("<ul>", f);
  for (int i = 0; i < all_logs.len; ++i) {
    Log *l = &all_logs.logs[i];
    if(l->term != term && l->term->parent != term){ continue; }
    if(l->is_event != true){ continue; }
    fprintf(f, "<li>%s — %s</li>", l->date, l->name);
  }
  fputs("</ul>", f);
}

void build_special_calendar(FILE *f, Term *term, Journal *journal){
  if(strcmp(term->name, "calendar") != 0){ return; }

  int last_year = 0;
  fputs("<ul>", f);
  for (int i = 0; i < journal->len; ++i) {
    if(journal->logs[i].is_event != true){ continue; }

    if(last_year != extract_year(journal->logs[i].date)){
      fprintf(f, "</ul><ul>");
    }

    char filename[STR_BUF_LEN];
    to_filename(journal->logs[i].term->name, filename);

    fprintf(f, "<li><a href='%s.html'>%s</a> %s</li>", filename, journal->logs[i].date, journal->logs[i].name);  
    last_year = extract_year(journal->logs[i].date);
  }
  fputs("</ul>", f);
}

void build_special_tracker(FILE *f, Term *term, Journal *journal) {
  if (strcmp(term->name, "tracker") != 0) {
    return;
  }

  fputs_graph_daily(f, journal);

  int known_id = 0;
  char *known[TRACKER_BUFFER];
  int last_year = 20;

  fputs("<ul>", f);
  for (int i = 0; i < journal->len; ++i) {
    if (index_of_string(known, known_id, journal->logs[i].term->name) > -1) {
      continue;
    } 
    if(known_id >= TRACKER_BUFFER){ 
      printf("Error: Reached tracker buffer\n"); 
      break; 
    }
    if(last_year != extract_year(journal->logs[i].date)){
      fprintf(f, "</ul><ul>");
    }

    char filename[STR_BUF_LEN];
    to_filename(journal->logs[i].term->name, filename);

    fprintf(f, "<li><a href='%s.html'>%s</a> — last update %s</li>", filename, journal->logs[i].term->name, journal->logs[i].date);
    last_year = extract_year(journal->logs[i].date);
    known[known_id] = journal->logs[i].term->name;
    known_id++;
  }
  fputs("</ul>", f);
}

void build_special_journal(FILE *f, Term *term, Journal *journal) {
  if (strcmp(term->name, "journal") != 0) {
    return;
  }

  int count = 0;
  for (int i = 0; i < journal->len; ++i) {
    if(count > 20){ break; }
    if(journal->logs[i].pict == 0){ continue; }
    build_log_pict(f, &journal->logs[i], true);
    count++;
  }
}

void build_special_now(FILE *f, Term *term, Journal *journal) {
  if (strcmp(term->name, "now") != 0) {
    return;
  }

  int range = 14 * 4;

  // Previous range
  int past_len = 0;
  float past_value[range];
  char *past_name[range];
  float past_sum_value = 0;

  for (int i = 0; i < range; ++i) {
    int past_index = i + range;
    Log l = journal->logs[past_index];
    if (l.code % 10 < 1) {
      continue;
    }
    int index = index_of_string(past_name, past_len, l.term->name);
    if (index < 0) {
      past_name[past_len] = l.term->name;
      past_value[past_len] = 0;
      past_len++;
    }
    past_value[past_len - 1] += l.code % 10;
    past_sum_value += l.code % 10;
  }

  // Recent range
  int projects_len = 0;
  float projects_value[range];
  char *projects_name[range];
  float sum_value = 0;

  for (int i = 0; i < range; ++i) {
    Log l = journal->logs[i];
    if (l.code % 10 < 1) {
      continue;
    }
    int index = index_of_string(projects_name, projects_len, l.term->name);
    if (index < 0) {
      projects_name[projects_len] = l.term->name;
      projects_value[projects_len] = 0;
      projects_len++;
    }
    projects_value[projects_len - 1] += l.code % 10;
    sum_value += l.code % 10;
  }

  fprintf(f, "<p>Distribution of <b>%.0f hours over %d projects</b>, a change of %.0f hours and %d projects since the previous period of %d days.</p>", sum_value, projects_len, sum_value-past_sum_value, projects_len-past_len, range);

  float test_sum = 0;
  fputs("<ul style='columns:2'>", f);
  for (int i = 0; i < projects_len; ++i) {
    char filename[STR_BUF_LEN];
    to_filename(projects_name[i], filename);
    float ratio = (projects_value[i]/sum_value) * 100;
    // Find difference
    int past_index = index_of_string(past_name, past_len, projects_name[i]);
    if(past_index >= 0){
      float past_ratio = (past_value[past_index]/past_sum_value)*100;
      float diff = ratio-past_ratio;
      test_sum += diff;
      if(diff > 0){
        fprintf(f, "<li><a href='%s.html'>%s</a> %.2f&#37; <i style='color:#42ae92'>+%.1f&#37;</i></li>", filename, projects_name[i], ratio, diff);
      }
      else{
        fprintf(f, "<li><a href='%s.html'>%s</a> %.2f&#37; <i style='color:red'>%.1f&#37;</i></li>", filename, projects_name[i], ratio, diff);
      }
    }
    else{
      fprintf(f, "<li><a href='%s.html'>%s</a> %.2f&#37;</li>", filename, projects_name[i], ratio);
    }
  }
  fputs("</ul>", f);
}

void build_page(Term *term, Journal *journal) {
  char filename[STR_BUF_LEN];
  to_filename(term->name, filename);
  char filepath[STR_BUF_LEN];

  int result = snprintf(filepath, sizeof filepath, "../site/%s.html", filename);
  bool is_valid = result > 0 && (size_t)result < sizeof filename;

  if (!is_valid) {
    printf("Invalid filename: %s\n", filename);
    return;
  }

  snprintf(filepath, STR_BUF_LEN, "../site/%s.html", filename);
  FILE *f = fopen(filepath, "w");

  fprintf(f, html_head, term->name);
  fputs(html_header, f);
  build_nav(f, term);
  
  fputs("<main>", f);
  build_banner(f, term, true);
  build_body(f, term);
  build_include(f, term);
  build_dictionary(f, term);
  build_listing(f, term);
  build_index(f, term);
  build_portal(f, term);
  build_album(f, term);
  build_links(f, term);
  build_horaire(f, term);

  build_special_calendar(f, term, journal);
  build_special_tracker(f, term, journal);
  build_special_journal(f, term, journal);
  build_special_now(f, term, journal);

  fputs("</main>", f);

  fputs(html_footer, f);

  fclose(f);
}

void build_rss(Journal *journal) {
  FILE *f = fopen("../links/rss.xml", "w");

  fputs("<?xml version='1.0' encoding='UTF-8' ?>", f);
  fputs("<rss version='2.0' xmlns:dc='http://purl.org/dc/elements/1.1/'>", f);
  fputs("<channel>\n", f);
  fputs("<title>XXIIVV — Oscean</title>\n", f);
  fputs("<link><![CDATA[https://wiki.xxiivv.com/Journal]]></link>\n", f);
  fputs("<description>The Nataniev Library</description>\n", f);

  for (int i = 0; i < journal->len; ++i) {
    Log l = journal->logs[i];
    if (l.pict == 0) {
      continue;
    }

    char filename[STR_BUF_LEN];
    to_filename(l.term->name, filename);

    fputs("<item>\n", f);
    fprintf(f, "  <title>%s</title>\n", l.name);
    fprintf(f, "  <link>https://wiki.xxiivv.com/site/%s.html</link>\n", filename);
    fprintf(f, "  <guid isPermaLink='false'>%d</guid>\n", l.pict);
    fputs("  <pubDate>", f);
    fputs_rfc2822(f, l.date);
    fputs("</pubDate>\n", f);
    fputs("  <dc:creator><![CDATA[Devine Lu Linvega]]></dc:creator>\n", f);
    fputs("  <description>\n", f);
    fputs("<![CDATA[", f);
    fprintf(f, "<img src='https://wiki.xxiivv.com/media/diary/%d.jpg'/>\n", l.pict);
    fprintf(f, "<p>%s<br/><br/><a href='https://wiki.xxiivv.com/site/%s.html'>%s</a></p>", l.term->bref, filename, l.term->name);
    fputs("]]>\n", f);
    fputs("  </description>\n", f);
    fputs("</item>\n", f);
  }

  fputs("</channel>", f);
  fputs("</rss>", f);
  fclose(f);
}

void build_twtxt(Journal *journal){
  FILE *f = fopen("../links/twtxt.txt", "w");
  fputs("hello there", f);

  for (int i = 0; i < journal->len; ++i) {
  }
  fclose(f);
}

int main(void) {
  #include "glossary.c"
  #include "lexicon.c"
  #include "horaire.c"

  int lexicon_len = sizeof lexicon / sizeof lexicon[0];

  // Parent Terms
  for (int i = 0; i < lexicon_len; ++i) {
    Term *t = lexicon[i];
    if(t->parent && t->parent->children_len < TERM_CHILDREN_BUFFER){
      t->parent->children[t->parent->children_len] = t;
      t->parent->children_len++;  
    }
    else{
      printf("Could not parent: %s\n", t->name);
      t->parent = &home;
    }
  }

  for (int i = 0; i < lexicon_len; ++i) {
    build_page(lexicon[i], &all_logs);
  }

  build_rss(&all_logs);
  build_twtxt(&all_logs);
  printf("========\n");

  get_arvelie();

  // Debugs

  for (int i = 1; i < 999; ++i) {
    int index = index_of(pict_used, pict_used_len, i);
    if (index < 0) {
      printf("Next id: #%d\n", i);
      break;
    }
  }

  printf("Lexicon: %d entries\n", lexicon_len);
  printf("Horaire: %d entries\n", all_logs.len);

  return (0);
}


