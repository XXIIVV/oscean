#include <ctype.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>

#define STR_BUF_LEN 64
#define LOGS_BUFFER 1000

char *html_head = "<!DOCTYPE html><html lang='en'><head><meta name='author' content='Devine Lu Linvega'><meta name='description' content='The Nataniev Library.'/><meta name='keywords' content='Aliceffekt, Traumae, Devine Lu Linvega, Lietal, Oquonie, Verreciel, Nataniev, Oscean, Solarpunk' /><meta name='license' content='name=BY-NC-SA(4.0), url=https://creativecommons.org/licenses/by-nc-sa/4.0/'/><meta name='thumbnail' content='https://wiki.xxiivv.com/media/services/thumbnail.jpg' /><meta name='viewport' content='width=device-width, initial-scale=1.0'><link rel='shortcut icon' type='image/x-icon' href='../media/services/favicon.ico' /><title>XXIIVV — %s</title></head><body>";

char *html_header = "<header><a id='logo' href='home.html'><img src='../media/icon/logo.svg' alt='XXIIVV'></a></header>";

char *html_footer = "<footer><hr/><a href='https://creativecommons.org/licenses/by-nc-sa/4.0' target='_blank'><img src='../media/icon/cc.svg' alt='by-nc-sa' width='30'/></a> <a href='http://webring.xxiivv.com/#random' target='_blank' rel='noreferrer'><img src='../media/icon/rotonde.svg' alt='webring' width='30'/></a> <a href='https://merveilles.town/@neauoire' target='_blank'><img src='../media/icon/merveilles.svg' alt='Merveilles' width='30'/></a> <a href='https://github.com/neauoire' target='_blank'><img src='../media/icon/github.png' alt='github' width='30'/></a> <span><a class='profile' href='devine_lu_linvega.html' target='_self'>Devine Lu Linvega</a> © 2020 — <a class='about' href='about.html' target='_self'>BY-NC-SA 4.0</a></span></footer></body></html>";

char *html_style = "<style>body { padding:30px } body a { color:black } body a:hover { text-decoration:none } header { margin: 0px 0px 35px; float: left } nav { margin: 0px 0px 30px } nav ul { padding: 0px; margin: 0px 45px 30px 0px; float: left } nav ul li { list-style-type:none; white-space:pre } nav ul li a { text-decoration:none } nav ul li a:hover { background:black; color:white } main { max-width:600px } main h1 { display:none } main h2 { max-width: 400px; margin-top:0px } main p { line-height:25px } main q { font-family: serif; font-size: 18px; font-style: italic; display: block; margin-bottom: 30px } main img { max-width:100% } main a.external:before { content:'~' } footer { border-top:1.5px solid; padding-top:30px; font-family:monospace } footer img { margin: 0px 0px -10px 0px } footer a { font-weight:bold; text-decoration:none } hr { border:0; clear:both }</style>";

typedef struct Log {
  char *date;
  char *name;
  int pict;
} Log;

typedef struct Dict {
  char *name;
  int words_len;
  char *keys[64];
  char *values[64];
} Dict;

typedef struct Term {
  char *name;
  char *bref;
  char *link;
  char *icon;
  struct Term *parent;
  int children_len;
  struct Term *children[32];
  bool isPortal;
  bool isAlbum;
  int body_len;
  char *body_text[32];
  char *body_meta[32];
  char *body_tags[32];
  int links_len;
  char *links_names[32];
  char *links_urls[32];
  int logs_len;
  char *logs_date[LOGS_BUFFER];
  char *logs_name[LOGS_BUFFER];
  int logs_pict[LOGS_BUFFER];
  int logs_code[LOGS_BUFFER];
  int dicts_len;
  Dict *dicts[32];
} Term;

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

Dict create_dict(char *name) {
  Dict d;
  d.name = name;
  return d;
}

void add_word(Dict *dict, char *key, char *value) {
  dict->keys[dict->words_len] = key;
  dict->values[dict->words_len] = value;
  dict->words_len++;  
}

// Term

Term create_term(char *name, char *bref) {
  Term t;
  t.name = name;
  t.bref = bref;
  t.parent = NULL;
  t.children_len = 0;
  t.isPortal = false;
  t.isAlbum = false;
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

void add_html(Term *term, char *text) {
  term->body_text[term->body_len] = text;
  term->body_tags[term->body_len] = "div";
  term->body_len++;  
}

void add_text(Term *term, char *text) {
  term->body_text[term->body_len] = text;
  term->body_tags[term->body_len] = "p";
  term->body_len++;
}

void add_header(Term *term, char *text) {
  term->body_text[term->body_len] = text;
  term->body_tags[term->body_len] = "h3";
  term->body_len++;
}

void add_subheader(Term *term, char *text) {
  term->body_text[term->body_len] = text;
  term->body_tags[term->body_len] = "h4";
  term->body_len++;  
}

void add_quote(Term *term, char *text, char *source) {
  term->body_text[term->body_len] = text;
  term->body_meta[term->body_len] = source;
  term->body_tags[term->body_len] = "q";
  term->body_len++;
}

void add_dict(Term *term, Dict *dict){
  term->dicts[term->dicts_len] = dict;
  term->dicts_len++;
}

void set_icon(Term *term, char *path) {
  term->icon = path;
}

void set_parent(Term *term, Term *parent) {
  term->parent = parent;
  parent->children[parent->children_len] = term;
  parent->children_len++;
}

void add_note(Term *term, char *text) {
  
}



void add_code(Term *term, char *text) {
  
}

void add_list(Term *term, char *text) {
  
}

void add_table(Term *term, char *text) {
  
}

void add_link(Term *term, char *name, char *url) {
  term->links_names[term->links_len] = name;
  term->links_urls[term->links_len] = url;
  term->links_len++;
}

void add_log(Term *term, char *date, int code) {
  term->logs_date[term->logs_len] = date;
  term->logs_code[term->logs_len] = code;
  term->logs_name[term->logs_len] = "";
  term->logs_pict[term->logs_len] = 0;
  term->logs_len++;
}

void add_diary(Term *term, char *date, int code, char *name, int pict) {
  term->logs_date[term->logs_len] = date;
  term->logs_code[term->logs_len] = code;
  term->logs_name[term->logs_len] = name;
  term->logs_pict[term->logs_len] = pict;
  term->logs_len++;
}

void add_event(Term *term, char *date, int code, char *name) {
  term->logs_date[term->logs_len] = date;
  term->logs_code[term->logs_len] = code;
  term->logs_name[term->logs_len] = name;
  term->logs_len++;
}

void add_diary_event(Term *term, char *date, int code, char *name, int pict) {
  term->logs_date[term->logs_len] = date;
  term->logs_code[term->logs_len] = code;
  term->logs_name[term->logs_len] = name;
  term->logs_pict[term->logs_len] = pict;
  term->logs_len++;
}

int find_term_pict(Term *term){
  for (int i = 0; i < term->logs_len; ++i) {
    if(term->logs_pict[i] > 0){
      return term->logs_pict[i];
    }
  }
  return 0;
}

// Build

void build_pict(FILE *f, int id, char *name){
  fprintf(f, "<img src='../media/diary/%d.jpg' alt='%s picture'/>", id, name);
}

void build_nav_list(FILE *f, Term *term, Term *target){
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

void build_nav(FILE *f, Term *term){
  fputs("<nav>", f);
  if(term->parent->parent->name == term->parent->name){
    build_nav_list(f, term->parent->parent, term);
  }
  else{
    build_nav_list(f, term->parent->parent, term->parent);
  }
  
  if(term->parent->parent->name != term->parent->name){
    build_nav_list(f, term->parent, term);
  }
  if(term->parent->name != term->name){
    build_nav_list(f, term, term);
  }
  fputs("<hr/></nav>", f);
}

void build_banner(FILE *f, Term *term){
  for (int i = 0; i < term->logs_len; ++i) {
    if(term->logs_pict[i] > 0){
      build_pict(f, term->logs_pict[i], term->logs_name[i]);
      fprintf(f, "<h4>%s - %s</h4>", term->logs_name[i], term->logs_date[i]);
      break;
    }
  }
}

void build_body(FILE *f, Term *term){
  fprintf(f, "<h1 class='title'>%s</h1>", term->name);
  fprintf(f, "<h2 class='brief'>%s</h2>", term->bref);
  for (int i = 0; i < term->body_len; ++i) {
    fprintf(f, "<%s>%s</%s>", term->body_tags[i], term->body_text[i], term->body_tags[i]);
  }
}

void build_portal(FILE *f, Term *term){
  if(term->isPortal != true){ return; }
  for (int k = 0; k < term->children_len; ++k) {
    char child_filename[STR_BUF_LEN];
    to_lowercase(term->children[k]->name, child_filename, STR_BUF_LEN);
    int pict = find_term_pict(term->children[k]);
    if(pict > 0){
      fprintf(f, "<a href='%s.html'>", child_filename);
      build_pict(f, pict, term->children[k]->name);
      fprintf(f, "</a>");
    }
    fprintf(f, "<h3><a href='%s.html'>%s</a></h3>", child_filename, term->children[k]->name);
    fprintf(f, "<p>%s</p>", term->children[k]->bref);
  }
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

void build_album(FILE *f, Term *term){
  if(term->isAlbum != true){ return; }
  int pict = find_term_pict(term);
  for (int k = 0; k < term->logs_len; ++k) {
    if(term->logs_pict[k] > 0 && term->logs_pict[k] != pict){
      build_pict(f, term->logs_pict[k], term->logs_name[k]);
    }
    fprintf(f, "<h4>%s</h4>", term->logs_name[k]);
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
  fprintf(f, "<h5>%d logs</h5>", term->logs_len);
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
  build_banner(f, term);
  build_body(f, term);
  build_dictionary(f, term);
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
