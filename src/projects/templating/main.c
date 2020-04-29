#include <ctype.h>
#include <math.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#include "../../helpers.c"

void puts_templated_seg(char *str) { 
  printf("templated: %s\n", str); 
}

void puts_templated(char *str) {
  int len = strlen(str);
  int froms[20];
  int tos[20];
  int segs_len = 0;
  int from = 0;
  for (int i = 1; i < len - 1; i++) {
    if (str[i] == '{' || str[i - 1] == '}') {
      froms[segs_len] = from;
      tos[segs_len] = i;
      segs_len += 1;
      from = i;
    }
  }
  froms[segs_len] = from;
  tos[segs_len] = len;
  segs_len += 1;
  for (int i = 0; i < segs_len; ++i) {
    int buffer_len = tos[i] - froms[i];
    char buffer[255];
    substr(str, buffer, froms[i], buffer_len);
    buffer[buffer_len] = '\0';
    if (buffer[0] == '{') {
      puts_templated_seg(buffer);
    } else {
      printf("normal: %s\n", buffer);
    }
  }
}

int main() {
  char *easystr =
      "{link1} first text {link2} second text {link3} third text {link4 hey} "
      "end";
  // char *easystr = "begin {link1} end";
  printf("%s\n", easystr);
  puts_templated(easystr);
  return (0);
}
