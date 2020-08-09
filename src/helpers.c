typedef enum { false, true } bool;

bool is_char_alphanum(char ch) {
  int is_num = ch >= '0' && ch <= '9';
  int is_alpha = (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
  if (!is_alpha && !is_num) {
    return false;
  }
  return true;
}

bool is_url(char *str) {
  return str[0] == 'h' && str[1] == 't' && str[2] == 't' && str[3] == 'p';
}

bool file_exists(char *filename) {
  FILE *file = fopen(filename, "r");
  if (file != NULL) {
    fclose(file);
    return true;
  }
  return false;
}

/* Cat a single char */
void chrcat(char *src, char c) {
  int len = strlen(src);
  src[len] = c;
  src[len + 1] = '\0';
}

/* Find substr in str */
int indexstr(char *a, char *b) {
  int i, j, alen = strlen(a), blen = strlen(b);
  for (i = 0; i < alen; i++) {
    for (j = 0; j < blen; j++) {
      if (a[i + j] == '\0') {
        return -1;
      }
      if (a[i + j] != b[j]) {
        break;
      }
      if (j == blen - 1) {
        return i;
      }
    }
  }
  return -1;
}

/* Set substr */
void substr(char *src, char *dest, int from, int to) {
  memcpy(dest, src + from, to);
  dest[to] = '\0';
}

/* Set substr with another */
void replacesubstr(char *src, char *dest, char *a, char *b) {
  char head[1024], tail[1024];
  int index = indexstr(src, a);
  if (index < 0) {
    return;
  }
  substr(src, head, 0, index);
  substr(src, tail, index + strlen(a), strlen(src) - index - strlen(a));
  dest[0] = '\0';
  strcat(dest, head);
  strcat(dest, b);
  strcat(dest, tail);
}

/* Set str as another */
void cpystr(char *src, char *dest) {
  int i;
  int len = strlen(src);
  for (i = 0; i < len; i++) {
    dest[i] = src[i];
  }
  dest[len] = '\0';
}

/* Uppercase str */
void ucstr(char *dest) {
  int i, len = strlen(dest);
  for (i = 0; i < len; i++) {
    dest[i] = toupper(dest[i]);
  }
}

/* Lowercase str */
void lcstr(char *dest) {
  int i, len = strlen(dest);
  for (i = 0; i < len; i++) {
    dest[i] = tolower(dest[i]);
  }
}

char *trimstr(char *str) {
  char *end;
  while (isspace((unsigned char)*str))
    str++;
  if (*str == 0)
    return str;
  end = str + strlen(str) - 1;
  while (end > str && isspace((unsigned char)*end))
    end--;
  end[1] = '\0';
  return str;
}

void to_alphanum(char *src, char *dest) {
  int i;
  int len = strlen(src) + 1;
  for (i = 0; i < len; i++) {
    dest[i] = src[i];
    if (dest[i] == '\0') {
      break;
    }
    if (!is_char_alphanum(dest[i])) {
      dest[i] = ' ';
    } else {
      dest[i] = tolower(dest[i]);
    }
  }
  dest[len - 1] = '\0';
}

void to_filename(char *str, char *mod) {
  int i;
  int len = strlen(str) + 1;
  for (i = 0; i < len; i++) {
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

int index_of_int(int a[], int num_elements, int value) {
  int i;
  for (i = 0; i < num_elements; i++) {
    if (a[i] == value) {
      return i;
    }
  }
  return -1;
}

int index_of_string(char *a[], int num_elements, char *value) {
  int i;
  for (i = 0; i < num_elements; i++) {
    if (strcmp(a[i], value) == 0) {
      return i;
    }
  }
  return -1;
}

int index_of_char(char *str, char target) {
  int i;
  int len = strlen(str);
  for (i = 0; i < len; i++) {
    if (str[i] == target) {
      return i;
    }
  }
  return -1;
}

void firstword(char *src, char *dest) {
  int until = index_of_char(src, ' ');
  if (until > -1) {
    substr(src, dest, 0, until);
  } else {
    substr(src, dest, 0, strlen(src));
  }
}

int count_leading_spaces(char *str) {
  int i;
  int len = strlen(str) + 1;
  for (i = 0; i < len; i++) {
    if (str[i] != ' ') {
      return i;
    }
  }
  return -1;
}

float clock_since(clock_t start) {
  double cpu_time_used = ((double)(clock() - start)) / CLOCKS_PER_SEC;
  return cpu_time_used * 1000;
}

/* Templates */

void fputs_lifeline(FILE *f, int limit_from, int limit_to, int range_from,
                    int range_to, int len) {
  int i;
  float f_len = len - 1;
  bool init = false;
  for (i = 0; i < len; i++) {
    float epoch = (i / f_len) * (limit_to - limit_from) + limit_from;
    if (epoch > range_from && !init) {
      fputs("●", f);
      init = true;
    } else if (epoch >= range_from && epoch <= range_to) {
      fputs("●", f);
    } else {
      fputs("○", f);
    }
  }
}

void fputs_progress(FILE *f, float ratio, int limit) {
  int i;
  for (i = 0; i < limit; i++) {
    if (i < ratio * limit) {
      fputs("|", f);
    } else {
      fputs("-", f);
    }
  }
}

void fputs_rfc2822(FILE *f, char *arvelie) {
  time_t current;
  int doty = arvelie_to_doty(arvelie);
  int year = extract_year(arvelie);
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
  current = mktime(&str_time);
  strftime(rfc_2822, sizeof(rfc_2822), "%a, %d %b %Y 00:00:00 +0900",
           localtime(&current));
  fprintf(f, "%s", rfc_2822);
}
