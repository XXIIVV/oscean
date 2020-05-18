#include <math.h>
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
  return (daymon + dayday) - 1;
}

int arvelie_to_doty(char *date) {
  int m = date[2] - 'A';
  int d1 = date[3] - '0';
  int d2 = date[4] - '0';
  int d = (d1 * 10) + d2;
  int doty = (m * 14) + d;
  return doty == -307 ? 364 : doty;
}

void print_ymdstr_from_doty(int doty) {
  int day, month = 0, months[13] = {0,   31,  59,  90,  120, 151, 181,
                                    212, 243, 273, 304, 334, 365};
  while (months[month] < doty) {
    month++;
  }
  day = doty - months[month - 1];
  printf("%04d-%02d-%02d\n", 2020, month, day);
}

void print_arvelie_from_doty(int doty) {
  char *months[] = {"A", "B", "C", "D", "E", "F", "G", "H", "I",
                    "J", "K", "L", "M", "N", "O", "P", "Q", "R",
                    "S", "T", "U", "V", "W", "X", "Y", "Z", "+"};
  int d = (doty % 14) + 1;
  int i = doty / 14;
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
  char month[3];
  char day[3];
  memcpy(year, date, 4);
  year[4] = '\0';
  memcpy(month, date + 5, 2);
  month[2] = '\0';
  memcpy(day, date + 8, 2);
  day[2] = '\0';
  print_arvelie_from_doty(ymd_to_doty(atoi(year), atoi(month), atoi(day)));
}

void print_ymdstr_from_arvelie(char *date) {
  print_ymdstr_from_doty(arvelie_to_doty(date));
}

void print_arvelie() {
  time_t now;
  time(&now);
  print_arvelie_from_time(now);
}
