#include <ctype.h>
#include <math.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#include "../../helpers.c"

typedef struct Term {
  char name[20];
  char host[20];
  char bref[500];
  char type[20];
  //
  char body[20][1000];
  int body_len;
  //
  char list[20][512];
  int list_len;
  //
  char link_keys[20];
  char link_vals[100];
  int link_len;
} Term;

typedef struct TermTable {
  int len;
  Term entries[400];
} TermTable;

TermTable all_terms;

void parseLexicon(FILE *fp, TermTable *table) {
  int bufferLength = 1000;
  char line[bufferLength];
  bool catch_body = false;
  bool catch_link = false;
  bool catch_list = false;
  while (fgets(line, bufferLength, fp)) {
    int pad = countLeadingSpaces(line);
    trimstr(line);
    int len = strlen(line);
    if (len < 4 || line[0] == ';') {
      continue;
    }
    if (pad == 0) {
      Term *t = &table->entries[table->len];
      substr(line, t->name, 0, len);
      to_lowercase(t->name, t->name);
      table->len++;
    }
    if (pad == 2) {
      Term *t = &table->entries[table->len - 1];
      if (strstr(line, "HOST : ") != NULL) {
        substr(line, t->host, 9, len - 9);
      }
      if (strstr(line, "TYPE : ") != NULL) {
        substr(line, t->host, 9, len - 9);
      }
      catch_body = strstr(line, "BODY") != NULL ? true : false;
      catch_link = strstr(line, "LINK") != NULL ? true : false;
      catch_list = strstr(line, "LIST") != NULL ? true : false;
    }
    if (pad == 4) {
      Term *t = &table->entries[table->len - 1];
      // Body
      if (catch_body) {
        char bodybuff[1000];
        substr(line, bodybuff, 4, len - 4);
        bodybuff[len - 4] = '\0';
        memcpy(&t->body[t->body_len], bodybuff, strlen(bodybuff));
        t->body_len++;
      }
      // Link
      if (catch_link) {
        char keybuff[40];
        char valbuff[150];
        int key_len = index_of_char(line, ':') - 5;
        substr(line, keybuff, 4, key_len);
        keybuff[key_len] = '\0';
        int val_len = len - key_len;
        substr(line, valbuff, key_len + 7, val_len);
        valbuff[val_len] = '\0';
        memcpy(&t->link_keys[t->link_len], keybuff, strlen(keybuff));
        memcpy(&t->link_vals[t->link_len], valbuff, strlen(valbuff));
        t->link_len++;
      }
      // List
      if (catch_list) {
        char listbuff[255];
        substr(line, listbuff, 4, len - 4);
        listbuff[len - 4] = '\0';
        memcpy(&t->body[t->body_len], listbuff, strlen(listbuff));
        t->body_len++;
        printf("%s\n", listbuff);
      }
    }
  }
}

int main(int argc, char *argv[]) {
  if (argc < 2) {
    printf("ERR: Missing lexicon file\n");
    return 0;
  }

  FILE *lexicon_ndtl = fopen(argv[1], "r");
  if (!lexicon_ndtl) {
    printf("ERR: Missing %s\n", argv[1]);
    return 0;
  }

  // Loading journal
  printf("Parsing %s..\n", argv[1]);
  parseLexicon(lexicon_ndtl, &all_terms);
  fclose(lexicon_ndtl);

  return (0);
}
