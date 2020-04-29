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
  char members[1];
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
  List *prev;
  while (fgets(line, bufferLength, fp)) {
    int pad = countLeadingSpaces(line);
    int len = strlen(line);
    if (len < 4 || line[0] == ';') {
      continue;
    }
    List *l = &glossary->lists[glossary->len];
    if (pad == 0) {
      substr(line, l->name, 0, len);
      glossary->len++;
    }
  }

  // Printing
  for (int i = 0; i < glossary->len; i++) {
    printf("%s\n", glossary->lists[i].name);
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
