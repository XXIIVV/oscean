// tablatal utility
// current function: tablatal file to json
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int LINESIZE = 512;  // max size

// allocate the offset from beginning of a line to
// the beginning of the column. We'll be printing
// substrings of the line read from the file w/o
// allocating any new memory (besides pointers here)
int* allocateColumnStarts(char** header) {
  int* ret = (int*) calloc(32, sizeof(int));
  int acc = 0;
  for (int i=0; i<32; i++) {
    if (!header[i]) return ret;
    ret[i] = acc;
    if (header[i])
      acc += strlen(header[i]);
  }
  return ret;
}


// Parse a tablatal header.
// Look for where whitespace turns to non-whitespace
// NOTE: that means no whitespace allowed in your header.
// ... that said, you can have whitespaces in your columns.
char** parseHeader(char* line) {
  char** header = (char**) calloc(32, sizeof(char*));
  int column = 0;
  int start = 0;
  int end = 1;
  // loop to a maximum of 32 columns (or end of line)
  while (column < 32) {
    if ((line[end] != ' ' && line[end - 1] == ' ')
       || line[end] == '\n') {
      // we've encountered non-whitespace or end of line.
      header[column] = (char*) malloc(
        sizeof(char) * ((end - start) + 1)
      );
      strncpy(
        header[column],
        line + start,
        (line[end] == '\n' ? end + 1 : end) - start
      );
      start = end;
      column += 1;
      if (line[end] == '\n') return header;
    }
    end += 1;
  }
  return header;
}


// tbtlen is like strlen but it will ignore trailing spaces
// that means "hi " has a tbtlen of 2 instead of 5
int tbtlen(char* string, int size) {
  int lastChar = 0;
  for(int i=0; i<size; i++) {
    char c = *(string + i);
    if (c == '\n')
      break;
    if (c != ' ' && c != '\0')
      lastChar = i;
  }
  return lastChar + 1;
}


// tblnam takes a string like "prices.tablatal.txt"
// and returns "prices" -- there's probably already something
// available in the built in string utilities.
void tblnam(char* filename, char* dest) {
  for (int i=0; i<32; i++) {
    if (filename[i] == '.') break;
    dest[i] = filename[i];
  }
}

