#include <ctype.h>
#include <stdio.h>
#include <string.h>

typedef struct Term {
  char *name;
  char *bref;
  char *link;
  struct Term * parent;
  int body_len;
  char *body[32];
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
  t.link = bref;

  // char filename[STR_BUF_LEN];
  // to_lowercase(t.link, filename, STR_BUF_LEN);

  // to_lowercase(t.link)
  t.parent = NULL;
  return t;
}

Dict create_dict(char *name) {
  Dict d;
  d.name = name;
  return d;
}

void add_text(Term *term, char *text) {
  // printf("%s\n", text);
}

void add_word(Dict *dict, char *key, char *value) {
  
}

void set_icon(Term *term, char *path) {
  
}

void set_parent(Term *term, Term *parent) {
  
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
  
}

void add_event(Term *term, char *date, int code, char *name) {

}

void add_log(Term *term, char *date, int code) {

}

void add_diary(Term *term, char *date, int code, char *name, int photo) {

}

void add_diary_event(Term *term, char *date, int code, char *name, int photo) {

}


/*
#define STR_BUF_LEN 64

char *html_head = "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'><meta name='description' content='Hundred Rabbits is a digital studio aboard a sailboat.'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta name='twitter:card' content='summary'><meta name='twitter:site' content='@RekkaBell'><meta name='twitter:title' content='Hundred Rabbits'><meta name='twitter:description' content='An illustrated food blog.'><meta name='twitter:creator' content='@RekkaBell'><meta name='twitter:image' content='https://grimgrains.com/media/services/icon.jpg'><meta property='og:title' content='Hundred Rabbits'><meta property='og:type' content='article'><meta property='og:url' content='http://grimgrains.com/'><meta property='og:image' content='https://grimgrains.com/media/services/icon.jpg'><meta property='og:description' content='An illustrated food blog.'><meta property='og:site_name' content='Hundred Rabbits'><title>Hundred Rabbits — %s</title><link rel='stylesheet' type='text/css' href='../links/main.css'></head><body class='%s'>";

char *html_header = "<header><a id='logo' href='home.html'><img src='../media/interface/logo.svg' alt='Hundred Rabbits'></a></header>";

char *html_footer = "<footer><p>Never miss an update</p><form action='https://tinyletter.com/hundredrabbits' method='post' target='popupwindow' onsubmit='window.open(\'https://tinyletter.com/hundredrabbits\', \'popupwindow\', \'scrollbars=yes,width=800,height=600\');return true'><input type='email' value='' name='EMAIL' class='email' placeholder='email@address.com' required=''><input type='submit' value='Subscribe' name='subscribe' class='button'></form></footer></body></html>";




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

void build_page(Page *page) {
  char filename[STR_BUF_LEN];
  to_lowercase(page->name, filename, STR_BUF_LEN);
  char filepath[STR_BUF_LEN];
  snprintf(filepath, STR_BUF_LEN, "../site/%s.html", filename);
  FILE *myfile = fopen(filepath, "w");

  fprintf(myfile, html_head, page->name, "page");
  fputs(html_header, myfile);

  fputs("<main class='page'>", myfile);
  fprintf(myfile, "<h1>%s</h1>", page->name);

  if (page->parts_len > 5) {
    fputs("<ul class='jump'>", myfile);
    for (int i = 0; i < page->parts_len; ++i) {
      char *part_name = page->parts_names[i];
      char part_index[STR_BUF_LEN];
      to_lowercase(part_name, part_index, STR_BUF_LEN);
      fprintf(myfile, "<li><a href='#%s'>%s</a></li>", part_index, part_name);
    }
    fputs("</ul>", myfile);
  }

  for (int i = 0; i < page->parts_len; ++i) {
    char *part_name = page->parts_names[i];
    char *part_description = page->parts_descriptions[i];
    char part_index[STR_BUF_LEN];
    to_lowercase(part_name, part_index, STR_BUF_LEN);
    fprintf(myfile, "<h2 id='%s'>%s</h2>", part_index, part_name);
    fputs(part_description, myfile);
  }

  fputs("<hr/>", myfile);
  fputs("</main>", myfile);

  fputs(html_footer, myfile);

  fclose(myfile);
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
  // #include "horaire.c"
  #include "glossary.c"

  // int categories_len = sizeof categories / sizeof categories[0];

  // printf("Found categories: %d\n", categories_len);

  // build_home(categories, categories_len);

  // for (int i = 0; i < categories_len; ++i) {
  //   Category *category = categories[i];
  //   for (int j = 0; j < category->pages_len; ++j) {
  //     Page *page = category->pages[j];
  //     build_page(page);
  //   }
  // }

  return (0);
}
