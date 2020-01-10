#include <ctype.h>
#include <stdio.h>
#include <string.h>

#define STR_BUF_LEN 64
#define LOGS_BUFFER 1000

char *html_head = "<!DOCTYPE html><html lang='en'><head><meta name='author' content='Devine Lu Linvega'><meta name='description' content='The Nataniev Library.'/><meta name='keywords' content='Aliceffekt, Traumae, Devine Lu Linvega, Lietal, Oquonie, Verreciel, Nataniev, Oscean, Solarpunk' /><meta name='license' content='name=BY-NC-SA(4.0), url=https://creativecommons.org/licenses/by-nc-sa/4.0/'/><meta name='thumbnail' content='https://wiki.xxiivv.com/media/services/thumbnail.jpg' /><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta name='twitter:card' content='summary'><meta name='twitter:site' content='@neauoire'><meta name='twitter:title' content='The Nataniev Library'><meta name='twitter:description' content='The digital playground and documentation for the projects of Devine Lu Linvega.'><meta name='twitter:creator' content='@neauoire'><meta name='twitter:image' content='https://wiki.xxiivv.com/media/services/rss.jpg'><meta property='og:title' content='The Nataniev Library' /><meta property='og:type' content='article' /><meta property='og:url' content='http://wiki.xxiivv.com/' /><meta property='og:image' content='https://wiki.xxiivv.com/media/services/rss.jpg' /><meta property='og:description' content='The digital playground and documentation for the projects of Devine Lu Linvega.' /> <meta property='og:site_name' content='XXIIVV' /><link rel='stylesheet' type='text/css' href='../links/fonts.css'><link rel='stylesheet' type='text/css' href='../links/main.css'><title>XXIIVV — %s</title></head><body>";

char *html_header = "<header><a id='logo' href='home.html'><img src='../media/icon/logo.svg' alt='XXIIVV'></a></header>";

char *html_footer = "<footer><a href='https://100r.co' target='_blank' rel='noreferrer' class='icon hundredrabbits sprite_hundredrabbits'>https://100r.co</a> <a href='https://creativecommons.org/licenses/by-nc-sa/4.0' target='_blank' rel='noreferrer' class='external icon cc sprite_cc'>https://creativecommons.org/licenses/by-nc-sa/4.0</a> <a href='http://webring.xxiivv.com/#random' target='_blank' rel='noreferrer' class='external icon rotonde sprite_rotonde'>http://webring.xxiivv.com/#random</a> <a href='https://merveilles.town/@neauoire' target='_blank' rel='noreferrer' class='external icon merveilles sprite_merveilles'>https://merveilles.town/@neauoire</a> <a href='https://github.com/neauoire' target='_blank' rel='noreferrer' class='external icon github sprite_github'>https://github.com/neauoire</a> <span><a class='profile' href='devine_lu_linvega.html' target='_self'>Devine Lu Linvega</a> © 2020 — <a class='about' href='about.html' target='_self'>BY-NC-SA 4.0</a></span><hr /></footer></body></html>";

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

void build_page(Term *term) {
  char filename[STR_BUF_LEN];
  to_lowercase(term->name, filename, STR_BUF_LEN);
  char filepath[STR_BUF_LEN];
  snprintf(filepath, STR_BUF_LEN, "../site/%s.html", filename);
  FILE *myfile = fopen(filepath, "w");

  fprintf(myfile, html_head, term->name);
  fputs(html_header, myfile);


  fputs("<nav>", myfile);

  // parents
  fputs("<ul class='parents'>", myfile);
  for (int i = 0; i < term->parent->parent->children_len; ++i) {
    char parent_filename[STR_BUF_LEN];
    to_lowercase(term->parent->parent->children[i]->name, parent_filename, STR_BUF_LEN);
    if(term->parent->parent->children[i]->name == term->parent->name){
      fprintf(myfile, "<li class='selected'><a href='%s.html'>%s</a></li>", parent_filename, term->parent->parent->children[i]->name);
    }
    else{
      fprintf(myfile, "<li><a href='%s.html'>%s</a></li>", parent_filename, term->parent->parent->children[i]->name);  
    }
  }
  fputs("</ul>", myfile);
  // siblings
  fputs("<ul class='siblings'>", myfile);
  for (int i = 0; i < term->parent->children_len; ++i) {
    char sibling_filename[STR_BUF_LEN];
    to_lowercase(term->parent->children[i]->name, sibling_filename, STR_BUF_LEN);
    if(term->parent->children[i]->name == term->name){
      fprintf(myfile, "<li class='selected'><a href='%s.html'>%s</a></li>", sibling_filename, term->parent->children[i]->name);
    }
    else{
      fprintf(myfile, "<li><a href='%s.html'>%s</a></li>", sibling_filename, term->parent->children[i]->name);
    }
  }
  fputs("</ul>", myfile);
  // children
  fputs("<ul class='children'>", myfile);
  for (int i = 0; i < term->children_len; ++i) {
    char child_filename[STR_BUF_LEN];
    to_lowercase(term->children[i]->name, child_filename, STR_BUF_LEN);
    fprintf(myfile, "<li><a href='%s.html'>%s</a></li>", child_filename, term->children[i]->name);
  }
  fputs("</ul>", myfile);
  fputs("<hr/></nav>", myfile);


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
  fputs("<hr/>", myfile);

  fputs(html_footer, myfile);

  fclose(myfile);
}

/*

typedef struct {
  char *name;
  int pages_len;
  Page *pages[32];
} Category;

Category create_category(char *name) {
  Category a;
  a.name = name;
  a.pages_len = 0;
  return a;
}

Page create_page(char *name) {
  Page a;
  a.name = name;
  a.parts_len = 0;
  return a;
}

void add_part(Page *page, char *name, char *description) {
  page->parts_names[page->parts_len] = name;
  page->parts_descriptions[page->parts_len] = description;
  page->parts_len++;
}

void add_page(Category *category, Page *page) {
  category->pages[category->pages_len] = page;
  category->pages_len++;
}

void build_home(Category **categories, int categories_len) {
  FILE *myfile = fopen("../site/home.html", "w");

  fprintf(myfile, html_head, "home", "home");
  fputs(html_header, myfile);

  fputs("<main class='home'>", myfile);

  for (int i = 0; i < categories_len; ++i) {
    Category *category = categories[i];
    fprintf(myfile, "<h2>%s</h2>", category->name);
    fputs("<ul>", myfile);
    for (int j = 0; j < category->pages_len; ++j) {
      Page *page = category->pages[j];
      char page_index[STR_BUF_LEN];
      to_lowercase(page->name, page_index, STR_BUF_LEN);
      fprintf(myfile, "<li><a href='%s.html'>%s</a></li>", page_index,page->name);
    }
    fputs("</ul>", myfile);
  }

  fputs("<hr/>", myfile);
  fputs("</main>", myfile);

  fputs(html_footer, myfile);

  fclose(myfile);
}
*/

int main(void) {
  #include "lexicon.c"
  #include "horaire.c"
  #include "glossary.c"

  int lexicon_len = sizeof lexicon / sizeof lexicon[0];

  printf("Lexicon: %d entries\n", lexicon_len);

  // printf("Found categories: %d\n", categories_len);

  // build_home(categories, categories_len);

  for (int i = 0; i < lexicon_len; ++i) {
    build_page(lexicon[i]);
  }

  return (0);
}
