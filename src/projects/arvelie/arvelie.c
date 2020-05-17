#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

int ymd_to_doty(int year, int month, int day) {
  int i = 0, daymon = 0, dayday = 0;
  int mth[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
  if ((year % 4) || ((year % 100) && (year % 400))) {
    mth[3] = mth[3] + 1;
  }
  for (i = 0; i < month; i++) {
    daymon += mth[i];
  }
  dayday = day;
  return (daymon + dayday);
}

void print_arvelie_from_doty(int doty) {
  char *months[] = {"A", "B", "C", "D", "E", "F", "G", "H", "I",
                    "J", "K", "L", "M", "N", "O", "P", "Q", "R",
                    "S", "T", "U", "V", "W", "X", "Y", "Z", "+"};
  int d = (doty % 14) + 1;
  int i = floor(doty / 14);
  char *m = months[i];
  printf("%d%s%02d\n", 20, m, d);
}

void print_arvelie_from_time(time_t t) {
  struct tm *local = localtime(&t);
  int year, month, day;
  year = local->tm_year + 1900;
  month = local->tm_mon + 1;
  day = local->tm_mday;
  print_arvelie_from_doty(ymd_to_doty(year, month, day));
}

void print_arvelie_from_ymdstr(char *date) {
  char year[5];
  memcpy(year, date, 4);
  year[4] = '\0';
  char month[3];
  memcpy(month, date + 5, 2);
  month[2] = '\0';
  char day[3];
  memcpy(day, date + 8, 2);
  day[2] = '\0';
  print_arvelie_from_doty(ymd_to_doty(atoi(year), atoi(month), atoi(day)));
}

void print_arvelie() {
  time_t now;
  time(&now);
  print_arvelie_from_time(now);
}

int main(int argc, char *argv[]) {
  if (argc > 1) {
    print_arvelie_from_ymdstr(argv[1]);
  } else {
    print_arvelie();
  }
  return 0;
}