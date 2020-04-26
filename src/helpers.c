//

bool is_char_alphanum(char ch) {
  int is_num = ch >= '0' && ch <= '9';
  int is_alpha = (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
  if (!is_alpha && !is_num) {
    return false;
  }
  return true;
}

void to_lowercase(char *str, char *target, size_t tsize) {
  for (size_t i = 0; i < tsize; i++) {
    target[i] = str[i];
    if (target[i] == '\0') {
      break;
    }
    target[i] = tolower(target[i]);
  }
  target[tsize - 1] = '\0';
}

void to_filename(char *str, char *mod) {
  int len = strlen(str) + 1;
  for (int i = 0; i < len; i++) {
    mod[i] = str[i];
    if (mod[i] == '\0') {
      break;
    }
    if (!is_char_alphanum(mod[i])) {
      mod[i] = '_';
    } else {
      mod[i] = tolower(mod[i]);
    }
  }
  mod[len - 1] = '\0';
}

bool file_exists(char *filename) {
  FILE *file = fopen(filename, "r");
  if (file != NULL) {
    fclose(file);
    return true;
  }
  return false;
}

bool is_alphanum(char *str) {
  int len = strlen(str);
  for (int i = 0; i < len; i++) {
    char ch = str[i];
    int is_num = ch >= '0' && ch <= '9';
    int is_alpha = (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
    int is_space = (ch == ' ');
    if (!is_alpha && !is_num && !is_space) {
      return false;
    }
  }
  return true;
}

bool is_plaintext(char *str) {
  int len = strlen(str);
  for (int i = 0; i < len; i++) {
    char ch = str[i];
    int is_num = ch >= '0' && ch <= '9';
    int is_alpha = (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
    int is_space =
        (ch == ' ' || ch == '_' || ch == '.' || ch == ',' || ch == '-');
    if (!is_alpha && !is_num && !is_space) {
      return false;
    }
  }
  return true;
}

int index_of(int a[], int num_elements, int value) {
  for (int i = 0; i < num_elements; i++) {
    if (a[i] == value) {
      return i;
    }
  }
  return -1;
}

int index_of_string(char *a[], int num_elements, char *value) {
  for (int i = 0; i < num_elements; i++) {
    if (strcmp(a[i], value) == 0) {
      return i;
    }
  }
  return -1;
}

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

float find_average(int a[]) {
  int sum = 0;
  for (int i = 0; i < 52; ++i) {
    sum += a[i];
  }
  return sum / 52;
}

float clamp(float v, float min, float max) {
  return v > max ? max : v < min ? min : v;
}

int clamp_int(int v, int min, int max) {
  return v > max ? max : v < min ? min : v;
}

// Arvelie

int extract_year(char *arvelie) {
  int result = 0, i = 0;
  for (i = 0; i < 2; i++) {
    result = result * 10 + (arvelie[i] - '0');
  }
  return result;
}

int doty_to_month(int doty) {
  int month = 0;
  int months[13] = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365};
  while (months[month] < doty) {
    month++;
  }
  return month - 1;
}

int doty_to_day(int doty) {
  int month = 0;
  int months[13] = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365};
  while (months[month] < doty) {
    month++;
  }
  return doty - months[month - 1];
}

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

int arvelie_to_doty(char *date) {
  int m = date[2] - 'A';
  int d1 = date[3] - '0';
  int d2 = date[4] - '0';
  int d = (d1 * 10) + d2;
  int doty = (m * 14) + d;
  return doty == -307 ? 364 : doty;
}

int get_doty() {
  int year, month, day;
  time_t now;
  time(&now);
  struct tm *local = localtime(&now);
  year = local->tm_year + 1900;
  month = local->tm_mon + 1;
  day = local->tm_mday;
  return ymd_to_doty(year, month, day);
}

int get_year() {
  time_t now;
  time(&now);
  struct tm *local = localtime(&now);
  return local->tm_year + 1900;
}

int offset_from_arvelie(char *arvelie) {
  int past_year = extract_year(arvelie);
  int past_doty = arvelie_to_doty(arvelie);
  int past_id = (past_year * 365) + past_doty;
  int current_year = get_year();
  int current_doty = get_doty();
  int current_id = ((current_year % 2000) * 365) + current_doty;
  return current_id - past_id;
}

char *doty_to_greg(int doty) {
  int day, month = 0, months[13] = {0,   31,  59,  90,  120, 151, 181,
                                    212, 243, 273, 304, 334, 365};
  while (months[month] < doty) {
    month++;
  }
  day = doty - months[month - 1];
  printf("%d/%d/%d\n", 2020, month, day);
  return "";
}

char *arvelie_to_greg(char *arvelie) {
  int doty = arvelie_to_doty(arvelie);
  return doty_to_greg(doty);
}

void fputs_rfc2822(FILE *f, char *arvelie) {
  int doty, year;
  if(arvelie != NULL){
    doty = arvelie_to_doty(arvelie);
    year = extract_year(arvelie);
  }
  else{
    doty = get_doty();
    year = get_year();
  }
  
  int month = doty_to_month(doty);
  int day = doty_to_day(doty);

  char rfc_2822[40];
  struct tm str_time;

  str_time.tm_year = (2000 + year) - 1900;
  str_time.tm_mon = month;
  str_time.tm_mday = day;
  str_time.tm_hour = 0;
  str_time.tm_min = 0;
  str_time.tm_sec = 0;
  str_time.tm_isdst = 0;

  time_t current = mktime(&str_time);

  strftime(rfc_2822, sizeof(rfc_2822), "%a, %d %b %Y %T %z",
           localtime(&current));
  fprintf(f, "%s", rfc_2822);
}

void print_greg_now() {
  time_t now;
  time(&now);
  printf("Time is: %s", ctime(&now));
}

void print_arvelie_now() {
  time_t now;
  time(&now);
  struct tm *local = localtime(&now);

  int year, month, day;
  year = local->tm_year + 1900;
  month = local->tm_mon + 1;
  day = local->tm_mday;
  int doty = ymd_to_doty(year, month, day);
  char *months[] = {"A", "B", "C", "D", "E", "F", "G", "H", "I",
                    "J", "K", "L", "M", "N", "O", "P", "Q", "R",
                    "S", "T", "U", "V", "W", "X", "Y", "Z", "+"};
  int d = (doty % 14) + 1;
  int i = floor(doty / 14);
  char *m = months[i];
  printf("%d%s%02d\n", 20, m, d);
}

// Horaire

void select_moment(Journal *journal, int history[], int from, int to) {
  for (int i = 0; i < to; ++i) {
    history[i] = 0;
  }

  for (int i = 0; i < journal->len; ++i) {
    Log l = journal->logs[i];
    int offset = offset_from_arvelie(l.date);
    if (offset < from) {
      continue;
    }
    if (offset > to) {
      break;
    }
    history[offset] = l.code % 10;
  }
}
