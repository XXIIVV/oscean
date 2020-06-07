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
  int d = ((date[3] - '0') * 10) + date[4] - '0';
  int doty = (m * 14) + d;
  return doty == -307 ? 364 : doty;
}

void print_ymdstr_from_doty(int doty) {
  int day, month = 0, months[13] = {0,   31,  59,  90,  120, 151, 181,
                                    212, 243, 273, 304, 334, 365};
  while (months[month] < doty) {
    month++;
  }
  if (month < 1) {
    printf("Error: Unknown Month\n");
    exit(0);
  }
  day = doty - months[month - 1];
  printf("%04d-%02d-%02d\n", 2020, month, day);
}

void print_arvelie_from_doty(int y, int doty) {
  char *months[] = {"A", "B", "C", "D", "E", "F", "G", "H", "I",
                    "J", "K", "L", "M", "N", "O", "P", "Q", "R",
                    "S", "T", "U", "V", "W", "X", "Y", "Z", "+"};
  int d = (doty % 14) + 1;
  int i = doty / 14;
  char *m = months[i];
  printf("%d%s%02d\n", y % 100, m, d);
}

void print_arvelie_from_time(time_t t) {
  struct tm *local = localtime(&t);
  int year, month, day;
  year = local->tm_year + 1900;
  month = local->tm_mon + 1;
  day = local->tm_mday;
  print_arvelie_from_doty(year, ymd_to_doty(year, month, day));
}

void print_arvelie_from_ymdstr(char *date) {
  int year = (date[0] - '0') * 1000 + (date[1] - '0') * 100 +
             (date[2] - '0') * 10 + date[3] - '0';
  int month = (date[5] - '0') * 10 + date[6] - '0';
  int day = (date[8] - '0') * 10 + date[9] - '0';
  print_arvelie_from_doty(year, ymd_to_doty(year, month, day));
}

void print_ymdstr_from_arvelie(char *date) {
  print_ymdstr_from_doty(arvelie_to_doty(date));
}

void print_arvelie() {
  time_t now;
  time(&now);
  print_arvelie_from_time(now);
}
