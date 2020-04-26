#include <ctype.h>
#include <math.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

typedef struct Term {
  char name[21];
  char members[1];
} Term;

typedef struct Lexicon {
  int len;
  Term terms[4000];
} Lexicon;

Lexicon all_terms;

int countLeadingSpaces(char *str) {
  int len = strlen(str) + 1;
  for (int i = 0; i < len; i++) {
    if (str[i] != ' ') {
      return i;
    }
  }
  return -1;
}

void parseIndental(FILE *fp, Lexicon *lexicon) {
  int bufferLength = 255;
  char line[bufferLength];
  while (fgets(line, bufferLength, fp)) {
    printf("%d:%s", countLeadingSpaces(line), line);
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
  parseIndental(lexicon_ndtl, &all_terms);
  fclose(lexicon_ndtl);

  return (0);
}
