#include <ctype.h>
#include <stdio.h>
#include <string.h>

#define STR_BUF_LEN 64
#define LOGS_BUFFER 1000

char *html_head = "<!DOCTYPE html><html lang='en'><head><meta name='author' content='Devine Lu Linvega'><meta name='description' content='The Nataniev Library.'/><meta name='keywords' content='Aliceffekt, Traumae, Devine Lu Linvega, Lietal, Oquonie, Verreciel, Nataniev, Oscean, Solarpunk' /><meta name='license' content='name=BY-NC-SA(4.0), url=https://creativecommons.org/licenses/by-nc-sa/4.0/'/><meta name='thumbnail' content='https://wiki.xxiivv.com/media/services/thumbnail.jpg' /><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta name='twitter:card' content='summary'><meta name='twitter:site' content='@neauoire'><meta name='twitter:title' content='The Nataniev Library'><meta name='twitter:description' content='The digital playground and documentation for the projects of Devine Lu Linvega.'><meta name='twitter:creator' content='@neauoire'><meta name='twitter:image' content='https://wiki.xxiivv.com/media/services/rss.jpg'><meta property='og:title' content='The Nataniev Library' /><meta property='og:type' content='article' /><meta property='og:url' content='http://wiki.xxiivv.com/' /><meta property='og:image' content='https://wiki.xxiivv.com/media/services/rss.jpg' /><meta property='og:description' content='The digital playground and documentation for the projects of Devine Lu Linvega.' /> <meta property='og:site_name' content='XXIIVV' /><title>XXIIVV — %s</title></head><body>";

char *html_header = "<header><a id='logo' href='home.html'><img src='../media/icon/logo.svg' alt='XXIIVV'></a></header>";

char *html_footer = "<footer><hr/><a href='https://creativecommons.org/licenses/by-nc-sa/4.0' target='_blank'><img src='../media/icon/cc.svg' alt='by-nc-sa' width='30'/></a> <a href='http://webring.xxiivv.com/#random' target='_blank' rel='noreferrer'><img src='../media/icon/rotonde.svg' alt='webring' width='30'/></a> <a href='https://merveilles.town/@neauoire' target='_blank'><img src='../media/icon/merveilles.svg' alt='Merveilles' width='30'/></a> <a href='https://github.com/neauoire' target='_blank'><img src='../media/icon/github.png' alt='github' width='30'/></a> <span><a class='profile' href='devine_lu_linvega.html' target='_self'>Devine Lu Linvega</a> © 2020 — <a class='about' href='about.html' target='_self'>BY-NC-SA 4.0</a></span></footer></body></html>";

char *html_style = "<style>body { padding:30px } header { margin-bottom:30px } nav { float:left; margin: 10px 45px 30px 0px } nav ul { padding:0px 0px 0px 15px } main { max-width:600px; float:left; margin:0px 0px 30px 30px } main h1 { display:none } main img { max-width:100% } footer { clear:both } footer hr { margin:0px 0px 30px } footer img { margin: 0px 0px -10px 0px }</style>";

typedef struct Log {
  char *date;
  char *name;
  int pict;
} Log;

typedef struct Term {
  char *name;
  char *bref;
  char *link;
  struct Term *parent;
  int children_len;
  struct Term *children[32];
  int body_len;
  char *body[32];

  int links_len;
  char *links_names[32];
  char *links_urls[32];

  int logs_len;
  char *logs_date[LOGS_BUFFER];
  char *logs_name[LOGS_BUFFER];
  int logs_pict[LOGS_BUFFER];
  int logs_code[LOGS_BUFFER];
} Term;

typedef struct Dict {
  char *name;
  int words_len;
  char *keys[32];
  char *values[32];
} Dict;

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

Term create_term(char *name, char *bref) {
  Term t;
  t.name = name;
  t.bref = bref;
  t.parent = NULL;
  t.children_len = 0;
  return t;
}

Dict create_dict(char *name) {
  Dict d;
  d.name = name;
  return d;
}

void add_text(Term *term, char *text) {
  term->body[term->body_len] = text;
  term->body_len++;
}

void add_word(Dict *dict, char *key, char *value) {
  
}

void set_icon(Term *term, char *path) {
  
}

void set_parent(Term *term, Term *parent) {
  term->parent = parent;
  parent->children[parent->children_len] = term;
  parent->children_len++;
}

void add_quote(Term *term, char *text, char *source) {
  
}

void add_note(Term *term, char *text) {
  
}

void add_header(Term *term, char *text) {
  
}

void add_html(Term *term, char *text) {
  
}

void add_subheader(Term *term, char *text) {
  
}

void add_frame(Term *term, char *url) {
  
}

void add_code(Term *term, char *text) {
  
}

void add_list(Term *term, char *text) {
  
}

void add_itchio(Term *term, char *id) {
  
}


void add_bandcamp(Term *term, char *id) {
  
}

void add_youtube(Term *term, char *id) {
  
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

}

void add_diary_event(Term *term, char *date, int code, char *name, int pict) {

}

void build_nav_child(FILE *myfile, Term *target){
  fputs("<ul>", myfile);
  for (int k = 0; k < target->children_len; ++k) {
    char child_filename[STR_BUF_LEN];
    to_lowercase(target->children[k]->name, child_filename, STR_BUF_LEN);
    if(target->children[k]->name == target->name){
      fprintf(myfile, "<li><i>%s</i></li>", target->children[k]->name);
    }
    else{
      fprintf(myfile, "<li><a href='%s.html'>%s</a></li>", child_filename, target->children[k]->name);
    }
  }
  fputs("</ul>", myfile);
}

void build_nav_child_child(FILE *myfile, Term *term, Term *target){
  fputs("<ul>", myfile);
  for (int k = 0; k < term->children_len; ++k) {
    char child_filename[STR_BUF_LEN];
    to_lowercase(term->children[k]->name, child_filename, STR_BUF_LEN);
    if(term->children[k]->name == target->name){
      fprintf(myfile, "<li><i>%s</i></li>", term->children[k]->name);
    }
    else{
      fprintf(myfile, "<li><a href='%s.html'>%s</a></li>", child_filename, term->children[k]->name);
    }
    if(target->name == term->children[k]->name){
      build_nav_child(myfile, term->children[k]);
    }
  }
  fputs("</ul>", myfile);
}

void build_nav_child_child_child(FILE *myfile, Term *term, Term *target){
  fputs("<ul>", myfile);
  for (int k = 0; k < term->parent->children_len; ++k) {
    char child_filename[STR_BUF_LEN];
    to_lowercase(term->parent->children[k]->name, child_filename, STR_BUF_LEN);
    fprintf(myfile, "<li><a href='%s.html'>%s</a></li>", child_filename, term->parent->children[k]->name);
    if(target->parent->name == term->parent->children[k]->name){
      build_nav_child_child(myfile, term->parent->children[k], target);
    }
  }
  fputs("</ul>", myfile);
}

void build_page(Term *term) {
  char filename[STR_BUF_LEN];
  to_lowercase(term->name, filename, STR_BUF_LEN);
  char filepath[STR_BUF_LEN];
  snprintf(filepath, STR_BUF_LEN, "../site/%s.html", filename);
  FILE *myfile = fopen(filepath, "w");

  fprintf(myfile, html_head, term->name);
  fputs(html_header, myfile);

  // Nav
  fputs("<nav>", myfile);
  if(term->name == term->parent->name){
    build_nav_child(myfile, term);
  }
  else if(term->parent->parent->name == term->parent->name){
    build_nav_child_child(myfile, term->parent, term);
  }
  else{
    build_nav_child_child_child(myfile, term->parent, term);  
  }
  fputs("</nav>", myfile);
  
  fputs("<main>", myfile);
  // Image
  for (int i = 0; i < term->logs_len; ++i) {
    if(term->logs_pict[i] > 0){
      fprintf(myfile, "<img class='banner' src='../media/diary/%d.jpg' alt='%s'/>", term->logs_pict[i], term->logs_name[i]);
      fprintf(myfile, "<h4 class='caption'>%s - %s</h4>", term->logs_name[i], term->logs_date[i]);
      break;
    }
  }
  fprintf(myfile, "<h1 class='title'>%s</h1>", term->name);
  fprintf(myfile, "<h2 class='brief'>%s</h2>", term->bref);
  // body
  for (int i = 0; i < term->body_len; ++i) {
    fprintf(myfile, "<p>%s</p>", term->body[i]);
  }
  fputs("</ul>", myfile);
  // links
  fputs("<ul class='links'>", myfile);
  for (int i = 0; i < term->links_len; ++i) {
    fprintf(myfile, "<li><a href='%s'>%s</a></li>", term->links_urls[i], term->links_names[i]);
  }
  fputs("</ul>", myfile);

  if(term->logs_len > 1){
    fprintf(myfile, "<h5>%d logs</h5>", term->logs_len);
  }
  fputs("</main>", myfile);

  fputs(html_footer, myfile);
  fputs(html_style, myfile);

  fclose(myfile);
}

int main(void) {
  #include "lexicon.c"
  #include "horaire.c"
  #include "glossary.c"

  int lexicon_len = sizeof lexicon / sizeof lexicon[0];

  printf("Lexicon: %d entries\n", lexicon_len);

  for (int i = 0; i < lexicon_len; ++i) {
    build_page(lexicon[i]);
  }

  return (0);
}
