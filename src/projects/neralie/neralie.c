#include <math.h>
#include <string.h>
#include <time.h>

int hms_to_seconds(int hour, int min, int sec) {
  return hour * 60 * 60 + min * 60 + sec;
}

void print_neralie_from_seconds(int sec) {
  char *beat = "000";
  char *pulse = "000";
  int val = (sec / 86400.0) * 1000000;
  snprintf(beat, 4, "%03d", val / 1000);
  snprintf(pulse, 4, "%03d", val % 1000);
  printf("%s:%s\n", beat, pulse);
}

void print_neralie_from_hmsstr(char *time) { printf("nerhms %s\n", time); }

void print_hmsstr_from_neralie(char *time) { printf("hmsner %s\n", time); }

void print_neralie_from_time(time_t t) {
  struct tm *local = localtime(&t);
  int hour, min, sec;
  hour = local->tm_hour;
  min = local->tm_min;
  sec = local->tm_sec;
  print_neralie_from_seconds(hms_to_seconds(hour, min, sec));
}

void print_neralie() {
  time_t now;
  time(&now);
  print_neralie_from_time(now);
}
