#include <ctype.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>

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

char *html_head = "<!DOCTYPE html><html lang='en'><head><meta name='author' content='Devine Lu Linvega'><meta name='description' content='The Nataniev Library.'/><meta name='keywords' content='Aliceffekt, Traumae, Devine Lu Linvega, Lietal, Oquonie, Verreciel, Nataniev, Oscean, Solarpunk' /><meta name='license' content='name=BY-NC-SA(4.0), url=https://creativecommons.org/licenses/by-nc-sa/4.0/'/><meta name='thumbnail' content='https://wiki.xxiivv.com/media/services/thumbnail.jpg' /><meta name='viewport' content='width=device-width, initial-scale=1.0'><link rel='shortcut icon' type='image/x-icon' href='../media/services/favicon.ico' /><title>XXIIVV — %s</title></head><body>";

char *html_header = "<header><a id='logo' href='home.html'><img src='../media/icon/logo.svg' alt='XXIIVV'></a></header>";

char *html_footer = "<footer><hr/><a href='https://creativecommons.org/licenses/by-nc-sa/4.0' target='_blank'><img src='../media/icon/cc.svg' alt='by-nc-sa' width='30'/></a> <a href='http://webring.xxiivv.com/#random' target='_blank' rel='noreferrer'><img src='../media/icon/rotonde.svg' alt='webring' width='30'/></a> <a href='https://merveilles.town/@neauoire' target='_blank'><img src='../media/icon/merveilles.svg' alt='Merveilles' width='30'/></a> <a href='https://github.com/neauoire' target='_blank'><img src='../media/icon/github.png' alt='github' width='30'/></a> <span><a class='profile' href='devine_lu_linvega.html' target='_self'>Devine Lu Linvega</a> © 2020 — <a class='about' href='about.html' target='_self'>BY-NC-SA 4.0</a></span></footer></body></html>";

char *html_style = "<style>body { padding:30px } body a { color:black } body a:hover { text-decoration:none } header { margin: 0px 0px 35px; float: left } nav { margin: 0px 0px 30px } nav ul { padding: 0px; margin: 0px 45px 30px 0px; float: left } nav ul li { list-style-type:none; white-space:pre } nav ul li a { text-decoration:none } nav ul li a:hover { background:black; color:white } main { max-width:600px } main h1 { display:none } main h2 { max-width: 400px; margin-top:0px } main h4 { font-family:monospace } main p { line-height:25px } main q { font-family: serif; font-size: 18px; font-style: italic; display: block; margin-bottom: 30px } main img { max-width:100% } main a.external:before { content:'~' } footer { border-top:1.5px solid; padding-top:30px; font-family:monospace } footer img { margin: 0px 0px -10px 0px } footer a { font-weight:bold; text-decoration:none } hr { border:0; clear:both }</style>";

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

typedef struct Log {
  char *date;
  int code;
  char *name;
  int pict;
} Log;

typedef struct Term {
  bool isPortal;
  bool isAlbum;
  bool isIndex;

  int pict;
  int children_len;
  int body_len;
  int links_len;
  int logs_len;
  int dicts_len;
  int lists_len;

  char *name;
  char *bref;
  char *icon;

  struct Term *parent;

  bool logs_event[LOGS_BUFFER];
  int logs_pict[LOGS_BUFFER];
  int logs_code[LOGS_BUFFER];
  char *logs_date[LOGS_BUFFER];
  char *logs_name[LOGS_BUFFER];
  char *body_text[TERM_BODY_BUFFER];
  char *body_meta[TERM_BODY_BUFFER];
  char *body_tags[TERM_BODY_BUFFER];
  char *links_names[TERM_LINK_BUFFER];
  char *links_urls[TERM_LINK_BUFFER];
  struct Term *children[TERM_CHILDREN_BUFFER];
  Dict *dicts[TERM_DICT_BUFFER];
  List *lists[TERM_LIST_BUFFER];
  Log *logs[LOGS_BUFFER];
} Term;

// Creators/Setters

Dict create_dict(char *name) {
  Dict d;
  d.name = name;
  d.words_len = 0;
  return d;
}

void add_word(Dict *dict, char *key, char *value) {
  if(dict->words_len > DICT_BUFFER-1){ 
    printf("Reached DICT_BUFFER\n");
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
  if(list->items_len > LIST_BUFFER-1){ 
    printf("Reached LIST_BUFFER\n");
    return;
  }
  list->items[list->items_len] = item;
  list->items_len++;  
}

Term create_term(char *name, char *bref) {
  Term t;
  t.isPortal = false;
  t.isAlbum = false;
  t.isIndex = false;

  t.pict = -1;
  t.children_len = 0;
  t.body_len = 0;
  t.links_len = 0;
  t.logs_len = 0;
  t.dicts_len = 0;
  t.lists_len = 0;

  t.name = name;
  t.bref = bref;
  t.icon = "";

  t.parent = NULL;
  return t;
}

Term create_portal(char *name, char *bref) {
  Term t = create_term(name, bref);
  t.isPortal = true;
  return t;
}

Term create_album(char *name, char *bref) {
  Term t = create_term(name, bref);
  t.isAlbum = true;
  return t;
}

Term create_index(char *name, char *bref) {
  Term t = create_term(name, bref);
  t.isIndex = true;
  return t;
}

void set_parent(Term *term, Term *parent) {
  if(parent->children_len > TERM_CHILDREN_BUFFER-1){
    printf("Reached TERM_CHILDREN_BUFFER\n");
    return;
  }
  term->parent = parent;
  parent->children[parent->children_len] = term;
  parent->children_len++;
}

void add_html(Term *term, char *text) {
  if(term->body_len > TERM_BODY_BUFFER-1){
    printf("Reached TERM_BODY_BUFFER\n");
    return;
  }
  term->body_text[term->body_len] = text;
  term->body_tags[term->body_len] = "div";
  term->body_len++;  
}

void add_text(Term *term, char *text) {
  if(term->body_len > TERM_BODY_BUFFER-1){
    printf("Reached TERM_BODY_BUFFER\n");
    return;
  }
  term->body_text[term->body_len] = text;
  term->body_tags[term->body_len] = "p";
  term->body_len++;
}

void add_header(Term *term, char *text) {
  if(term->body_len > TERM_BODY_BUFFER-1){
    printf("Reached TERM_BODY_BUFFER\n");
    return;
  }
  term->body_text[term->body_len] = text;
  term->body_tags[term->body_len] = "h3";
  term->body_len++;
}

void add_subheader(Term *term, char *text) {
  if(term->body_len > TERM_BODY_BUFFER-1){
    printf("Reached TERM_BODY_BUFFER\n");
    return;
  }
  term->body_text[term->body_len] = text;
  term->body_tags[term->body_len] = "h4";
  term->body_len++;  
}

void add_quote(Term *term, char *text, char *source) {
  if(term->body_len > TERM_BODY_BUFFER-1){
    printf("Reached TERM_BODY_BUFFER\n");
    return;
  }
  term->body_text[term->body_len] = text;
  term->body_meta[term->body_len] = source;
  term->body_tags[term->body_len] = "q";
  term->body_len++;
}

void add_dict(Term *term, Dict *dict){
  if(term->dicts_len > TERM_DICT_BUFFER-1){ 
    printf("Reached TERM_DICT_BUFFER\n");
    return;
  }
  term->dicts[term->dicts_len] = dict;
  term->dicts_len++;
}

void add_list(Term *term, List *list){
  if(term->dicts_len > TERM_LIST_BUFFER-1){ 
    printf("Reached TERM_LIST_BUFFER\n");
    return;
  }
  term->lists[term->lists_len] = list;
  term->lists_len++;
}

void add_link(Term *term, char *name, char *url) {
  if(term->links_len > TERM_LINK_BUFFER-1){
    printf("Reached TERM_LINK_BUFFER\n");
    return;
  }
  term->links_names[term->links_len] = name;
  term->links_urls[term->links_len] = url;
  term->links_len++;
}

void add_event_diary(Term *term, char *date, int code, char *name, int pict) {
  if(term->logs_len > TERM_LOGS_BUFFER-1){
    printf("Reached TERM_LOGS_BUFFER\n");
    return;
  }
  term->logs_date[term->logs_len] = date;
  term->logs_code[term->logs_len] = code;
  term->logs_name[term->logs_len] = name;
  term->logs_pict[term->logs_len] = pict;
  term->logs_event[term->logs_len] = true;
  if(term->pict < 0){
    term->pict = term->logs_len;
  }
  term->logs_len++;
}

void add_diary(Term *term, char *date, int code, char *name, int pict) {
  if(term->logs_len > TERM_LOGS_BUFFER-1){
    printf("Reached TERM_LOGS_BUFFER\n");
    return;
  }
  term->logs_date[term->logs_len] = date;
  term->logs_code[term->logs_len] = code;
  term->logs_name[term->logs_len] = name;
  term->logs_pict[term->logs_len] = pict;
  term->logs_event[term->logs_len] = false;
  if(term->pict < 0){
    term->pict = term->logs_len;
  }
  term->logs_len++;
}

void add_event(Term *term, char *date, int code, char *name) {
  if(term->logs_len > TERM_LOGS_BUFFER-1){
    printf("Reached TERM_LOGS_BUFFER\n");
    return;
  }
  term->logs_date[term->logs_len] = date;
  term->logs_code[term->logs_len] = code;
  term->logs_name[term->logs_len] = name;
  term->logs_pict[term->logs_len] = 0;
  term->logs_event[term->logs_len] = true;
  term->logs_len++;
}

void add_log(Term *term, char *date, int code) {
  if(term->logs_len > TERM_LOGS_BUFFER-1){
    printf("Reached TERM_LOGS_BUFFER\n");
    return;
  }
  term->logs_date[term->logs_len] = date;
  term->logs_code[term->logs_len] = code;
  term->logs_name[term->logs_len] = "";
  term->logs_pict[term->logs_len] = 0;
  term->logs_event[term->logs_len] = false;
  term->logs_len++;
}

// Tools

void to_lowercase(char *str, char *target, size_t tsize) {
  for (size_t i = 0; i < tsize; i++) {
    target[i] = str[i];
    if (target[i] == '\0') {
      break;
    }
    if (target[i] == ' ') {
      target[i] = '_';
    } else {
      target[i] = tolower(target[i]);
    }
  }
  target[tsize - 1] = '\0';
}

// Build(parts)

void build_pict_part(FILE *f, int id, char *name, char *date, bool caption){
  fprintf(f, "<img src='../media/diary/%d.jpg' alt='%s picture'/>", id, name);
  if(caption){
    fprintf(f, "<h4>%s — %s</h4>", date,name);
  }
}

void build_body_part(FILE *f, Term *term){
  for (int i = 0; i < term->body_len; ++i) {
    fprintf(f, "<%s>%s</%s>", term->body_tags[i], term->body_text[i], term->body_tags[i]);
  }
}

void build_nav_part(FILE *f, Term *term, Term *target){
  fputs("<ul>", f);
  for (int i = 0; i < term->children_len; ++i) {
    char child_filename[STR_BUF_LEN];
    to_lowercase(term->children[i]->name, child_filename, STR_BUF_LEN);
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
  if(term->pict > -1){
    build_pict_part(f, term->logs_pict[term->pict], term->logs_name[term->pict], term->logs_date[term->pict], caption);
  }
}

void build_nav(FILE *f, Term *term){
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
  fputs("<hr/></nav>", f);
}

void build_body(FILE *f, Term *term){
  fprintf(f, "<h1 class='title'>%s</h1>", term->name);
  fprintf(f, "<h2 class='brief'>%s</h2>", term->bref);
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

void build_index(FILE *f, Term *term){
  if(term->isIndex != true){ return; }
  for (int k = 0; k < term->children_len; ++k) {
    char child_filename[STR_BUF_LEN];
    to_lowercase(term->children[k]->name, child_filename, STR_BUF_LEN);
    fprintf(f, "<h3><a href='%s.html'>%s</a></h3>", child_filename, term->children[k]->name);
    build_body_part(f, term->children[k]);
    build_dictionary(f, term->children[k]);
    build_listing(f, term->children[k]);
  }
}

void build_portal(FILE *f, Term *term){
  if(term->isPortal != true){ return; }
  for (int k = 0; k < term->children_len; ++k) {
    char child_filename[STR_BUF_LEN];
    to_lowercase(term->children[k]->name, child_filename, STR_BUF_LEN);
    if(term->children[k]->pict > -1){
      fprintf(f, "<a href='%s.html'>", child_filename);
      build_banner(f, term->children[k], false);
      fprintf(f, "</a>");
    }
    fprintf(f, "<h3><a href='%s.html'>%s</a></h3>", child_filename, term->children[k]->name);
    fprintf(f, "<p>%s</p>", term->children[k]->bref);
  }
}

void build_album(FILE *f, Term *term){
  if(term->isAlbum != true){ return; }
  for (int k = 0; k < term->logs_len; ++k) {
    if(term->logs_pict[k] > 0 && term->logs_pict[k] != term->logs_pict[term->pict]){
      build_pict_part(f, term->logs_pict[k], term->logs_name[k], term->logs_date[k], true);
    }
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
  if(term->logs_len < 2){ return; }
  fprintf(f, "<p><i>Last update on <a href='https://github.com/xxiivv/oscean' target='_blank' class='external'>%s</a>, %d logs.</i></p>", term->logs_date[0], term->logs_len);
  fputs("<ul>", f);
  for (int i = 0; i < term->logs_len; ++i) {
    if(term->logs_event[i]){
      fprintf(f, "<li>%s — %s</li>", term->logs_date[i], term->logs_name[i]);
    }
  }
  fputs("</ul>", f);
}

void build_page(Term *term) {
  char filename[STR_BUF_LEN];
  to_lowercase(term->name, filename, STR_BUF_LEN);
  char filepath[STR_BUF_LEN];
  snprintf(filepath, STR_BUF_LEN, "../site/%s.html", filename);
  FILE *f = fopen(filepath, "w");

  fprintf(f, html_head, term->name);
  fputs(html_header, f);
  build_nav(f, term);
  
  fputs("<main>", f);
  build_banner(f, term, true);
  build_body(f, term);
  build_dictionary(f, term);
  build_listing(f, term);
  build_index(f, term);
  build_portal(f, term);
  build_album(f, term);
  build_links(f, term);
  build_horaire(f, term);
  fputs("</main>", f);

  fputs(html_footer, f);
  fputs(html_style, f);

  fclose(f);
}

int main(void) {
  #include "glossary.c"
  #include "lexicon.c"
  #include "horaire.c"

  int lexicon_len = sizeof lexicon / sizeof lexicon[0];

  printf("Lexicon: %d entries\n", lexicon_len);

  for (int i = 0; i < lexicon_len; ++i) {
    build_page(lexicon[i]);
  }

  return (0);
}
