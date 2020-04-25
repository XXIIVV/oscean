#include <stdbool.h>
#include <string.h>
#include <ctype.h>
#include <stdio.h>
#include <time.h>
#include <math.h>

#include "tablatal.c"

typedef struct Log {
  char term[30];
  char date[5];
  int code;
  char name[30];
  int pict;
  bool is_event;
} Log;

typedef struct Journal {
  int len;
  Log logs[4000];
} Journal;

Journal all_logs;

void substr(char *s, char *t, int from, int to) { 
  strncpy(t, s + from, to); 
}

void parseTablatal(FILE *fp) {
  int bufferLength = 255;
  char line[bufferLength];
  int lineNumber = 0;

  while (fgets(line, bufferLength, fp)) {
    char subbuff2[20];
    substr(line, subbuff2, 10, 20);
    printf("%s\n", subbuff2);

    Log log;

    substr(line, log.date, 0, 5);
    substr(line, log.term, 10, 20);
    // substr(line, log.name, 0, 5);

    // substr(line, log.code, 0, 5);
    // substr(line, log.pixt, 0, 5);

    // log.is_event = false;
    all_logs.logs[all_logs.len] = log;
    all_logs.len++;

    lineNumber++;
  }
}

int main(int argc, char* argv[]) {
  FILE* file;
  if (argc == 1)
    file = fopen("../../database/horaire.tbtl", "r");
  else
    file = fopen(argv[1], "r");
  if (!file) {
    printf("EOPEN\n");
    return 1;
  }
  parseTablatal(file);
  fclose(file);
  return 0;
}
