#include <ctype.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Log {
  char date[6];
  char rune[1];
  int code;
  char term[20];
  int pict;
  char name[30];
  bool is_event;
} Log;

typedef struct Journal {
  int len;
  Log logs[4000];
} Journal;

Journal all_logs;

void substr(char *s, char *t, int from, int to) { strncpy(t, s + from, to); }

char *trimstr(char *str) {
  char *end;
  while (isspace((unsigned char)*str)) str++;
  if (*str == 0) return str;
  end = str + strlen(str) - 1;
  while (end > str && isspace((unsigned char)*end)) end--;
  end[1] = '\0';
  return str;
}

void parseTablatal(FILE *fp, Journal *journal) {
  int bufferLength = 255;
  char line[bufferLength];
  while (fgets(line, bufferLength, fp)) {
    trimstr(line);
    if (strlen(line) < 16) {
      continue;
    }
    Log *l = &journal->logs[journal->len];
    // Date
    substr(line, l->date, 0, 5);
    // Rune
    substr(line, l->rune, 6, 1);
    l->is_event = !strcmp(l->rune, "+");
    // Code
    char codebuff[4];
    substr(line, codebuff, 7, 3);
    l->code = atoi(codebuff);
    // Term
    substr(line, l->term, 11, 20);
    trimstr(l->term);
    // Pict
    if (strlen(line) >= 35) {
      char pictbuff[4];
      substr(line, pictbuff, 32, 3);
      l->pict = atoi(pictbuff);
    }
    // Name
    if (strlen(line) >= 38) {
      substr(line, l->name, 36, 20);
      trimstr(l->name);
    }
    journal->len++;
  }
}

int main(int argc, char *argv[]) {
  FILE *file;
  if (argc == 1)
    file = fopen("../../database/horaire.tbtl", "r");
  else
    file = fopen(argv[1], "r");
  if (!file) {
    printf("EOPEN\n");
    return 1;
  }

  parseTablatal(file, &all_logs);

  for (int i = 0; i < all_logs.len; ++i) {
    Log l = all_logs.logs[i];
    printf("%s | %s | %d | %s | %d | %s\n", l.date, l.rune, l.code, l.term,
           l.pict, l.name);
  }

  fclose(file);
  return 0;
}
