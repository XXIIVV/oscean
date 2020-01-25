void to_lowercase(char *str, char *target, size_t tsize) {
  for (size_t i = 0; i < tsize; i++) {
    target[i] = str[i];
    if (target[i] == '\0') {
      break;
    }
    if (target[i] == ' ') {
      target[i] = '_';
    } else {
      target[i] = tolower(target[i]);
    }
  }
  target[tsize - 1] = '\0';
}

int index_of(int a[], int num_elements, int value) {
  for (int i = 0; i < num_elements; i++) {
    if (a[i] == value) {
      return value;
    }
  }
  return -1;
}

bool file_exists(char *filename) {
  FILE *file = fopen(filename, "r");
  if (file != NULL) {
    fclose(file);
    return true;
  }
  return false;
}

int get_doty(int year, int month, int day) {
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

int arvelie_to_doty(char *date) {
  int m = date[2] - 'A';
  int d1 = date[3] - '0';
  int d2 = date[4] - '0';
  int d = (d1 * 10) + d2;
  return (m * 14) + d;
}

char * doty_to_arvelie(int doty){
  char *months[] = {"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"};
  int d = doty % 14;
  int i = floor(doty/14);
  char *m = months[i];

  printf("Date is: %d%s%d\n",20, m, d);
  return "";
}

char *get_arvelie() {
  int year, month, day;
  time_t now;
  time(&now);
  printf("Time is: %s", ctime(&now));
  struct tm *local = localtime(&now);

  year = local->tm_year + 1900;
  month = local->tm_mon + 1;
  day = local->tm_mday;

  return doty_to_arvelie(get_doty(year, month, day));
}

void debug_time() {
  int year, month, day;
  time_t now;
  time(&now);
  printf("Today is: %s", ctime(&now));
  struct tm *local = localtime(&now);

  year = local->tm_year + 1900;
  month = local->tm_mon + 1;
  day = local->tm_mday;

  printf("Date is: %02d/%02d/%d\n", year, month, day);
  printf("Day of the year is: %d\n", get_doty(year, month, day));
}

void future_time() {
  struct tm str_time;
  time_t time_of_day;

  str_time.tm_year = 2012-1900;
  str_time.tm_mon = 6;
  str_time.tm_mday = 5;
  str_time.tm_hour = 10;
  str_time.tm_min = 3;
  str_time.tm_sec = 5;
  str_time.tm_isdst = 0;

  time_of_day = mktime(&str_time);
  printf(ctime(&time_of_day));
}