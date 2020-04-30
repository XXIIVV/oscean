#include <ctype.h>
#include <math.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#include "../../helpers.c"

typedef struct List {
  char name[40];
  char items[100][1000];
  int items_len;
} List;

typedef struct Glossary {
  int len;
  List lists[4000];
} Glossary;

Glossary all_lists;

int countLeadingSpaces(char *str) {
  int len = strlen(str) + 1;
  for (int i = 0; i < len; i++) {
    if (str[i] != ' ') {
      return i;
    }
  }
  return -1;
}

void parseIndental(FILE *fp, Glossary *glossary) {
  int bufferLength = 1000;
  char line[bufferLength];
  while (fgets(line, bufferLength, fp)) {
    int pad = countLeadingSpaces(line);
    trimstr(line);
    int len = strlen(line);
    if (len < 4 || line[0] == ';') {
      continue;
    }
    if (pad == 0) {
      List *l = &glossary->lists[glossary->len];
      substr(line, l->name, 0, len);
      glossary->len++;
    }

    if (pad == 2) {
      List *l = &glossary->lists[glossary->len - 1];
      substr(line, l->items[l->items_len], 2, len);
      l->items_len++;
    }
  }

  // Printing
  for (int i = 0; i < glossary->len; i++) {
    printf("%s\n", glossary->lists[i].name);
    for (int j = 0; j < glossary->lists[i].items_len; j++) {
      printf("> %s\n", &glossary->lists[i].items[j]);
    }
  }
}

int main(int argc, char *argv[]) {
  if (argc < 2) {
    printf("ERR: Missing lexicon file\n");
    return 0;
  }

  FILE *glossary_ndtl = fopen(argv[1], "r");
  if (!glossary_ndtl) {
    printf("ERR: Missing %s\n", argv[1]);
    return 0;
  }

  // Loading journal
  printf("Parsing %s..\n", argv[1]);
  parseIndental(glossary_ndtl, &all_lists);
  fclose(glossary_ndtl);

  return (0);
}
