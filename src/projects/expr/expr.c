#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

enum { S_NONE, S_LIST, S_STRING, S_SYMBOL };

typedef struct {
  int type;
  size_t len;
  void *buf;
} s_expr, *expr;

void whine(const char *s) {
  fprintf(stderr, "parse error before ==>%.10s\n", s);
}

expr parse_string(const char *s, char **e) {
  expr ex = calloc(sizeof(s_expr), 1);
  char buf[256] = {0};
  int i = 0;

  while (*s) {
    if (i >= 256) {
      fprintf(stderr, "string too long:\n");
      whine(s);
      goto fail;
    }
    switch (*s) {
      case '\\':
        switch (*++s) {
          case '\\':
          case '"':
            buf[i++] = *s++;
            continue;

          default:
            whine(s);
            goto fail;
        }
      case '"':
        goto success;
      default:
        buf[i++] = *s++;
    }
  }
fail:
  free(ex);
  return 0;

success:
  *(const char **)e = s + 1;
  ex->type = S_STRING;
  ex->buf = strdup(buf);
  ex->len = strlen(buf);
  return ex;
}

expr parse_symbol(const char *s, char **e) {
  expr ex = calloc(sizeof(s_expr), 1);
  char buf[256] = {0};
  int i = 0;

  while (*s) {
    if (i >= 256) {
      fprintf(stderr, "symbol too long:\n");
      whine(s);
      goto fail;
    }
    if (isspace(*s)) goto success;
    if (*s == ')' || *s == '(') {
      s--;
      goto success;
    }

    switch (*s) {
      case '\\':
        switch (*++s) {
          case '\\':
          case '"':
          case '(':
          case ')':
            buf[i++] = *s++;
            continue;
          default:
            whine(s);
            goto fail;
        }
      case '"':
        whine(s);
        goto success;
      default:
        buf[i++] = *s++;
    }
  }
fail:
  free(ex);
  return 0;

success:
  *(const char **)e = s + 1;
  ex->type = S_SYMBOL;
  ex->buf = strdup(buf);
  ex->len = strlen(buf);
  return ex;
}

void append(expr list, expr ele) {
  list->buf = realloc(list->buf, sizeof(expr) * ++list->len);
  ((expr *)(list->buf))[list->len - 1] = ele;
}

expr parse_list(const char *s, char **e) {
  expr ex = calloc(sizeof(s_expr), 1), chld;
  char *next;

  ex->len = 0;

  while (*s) {
    if (isspace(*s)) {
      s++;
      continue;
    }

    switch (*s) {
      case '"':
        chld = parse_string(s + 1, &next);
        if (!chld) goto fail;
        append(ex, chld);
        s = next;
        continue;
      case '(':
        chld = parse_list(s + 1, &next);
        if (!chld) goto fail;
        append(ex, chld);
        s = next;
        continue;
      case ')':
        goto success;

      default:
        chld = parse_symbol(s, &next);
        if (!chld) goto fail;
        append(ex, chld);
        s = next;
        continue;
    }
  }

fail:
  whine(s);
  free(ex);
  return 0;

success:
  *(const char **)e = s + 1;
  ex->type = S_LIST;
  return ex;
}

expr parse_term(const char *s, char **e) {
  while (*s) {
    if (isspace(*s)) {
      s++;
      continue;
    }
    switch (*s) {
      case '(':
        return parse_list(s + 1, e);
      case '"':
        return parse_string(s + 1, e);
      default:
        return parse_symbol(s + 1, e);
    }
  }
  return 0;
}

void print_expr(expr e, int depth) {
#define sep() \
  for (i = 0; i < depth; i++) printf("    ")
  int i;
  if (!e) return;

  switch (e->type) {
    case S_LIST:
      sep();
      puts("(");
      for (i = 0; i < e->len; i++) print_expr(((expr *)e->buf)[i], depth + 1);
      sep();
      puts(")");
      return;
    case S_SYMBOL:
    case S_STRING:
      sep();
      if (e->type == S_STRING) putchar('"');
      for (i = 0; i < e->len; i++) {
        switch (((char *)e->buf)[i]) {
          case '"':
          case '\\':
            putchar('\\');
            break;
          case ')':
          case '(':
            if (e->type == S_SYMBOL) putchar('\\');
        }

        putchar(((char *)e->buf)[i]);
      }
      if (e->type == S_STRING) putchar('"');
      putchar('\n');
      return;
  }
}

int main() {
  char *next;
  const char *in =
      "((data da\\(\\)ta \"quot\\\\ed data\" 123 4.5)\n"
      " (\"data\" (!@# (4.5) \"(mo\\\"re\" \"data)\")))";

  expr x = parse_term(in, &next);

  printf("input is:\n%s\n", in);
  printf("parsed as:\n");
  print_expr(x, 0);
  return 0;
}