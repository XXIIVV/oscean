#include <stdio.h>

/*
Copyright (c) 2024 Devine Lu Linvega

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE.
*/

#define SRC_SZ 0x8000
#define DIC_SZ 0x8000
#define SYM_SZ 0x100
#define RUL_SZ 0x80

static char key, src[SRC_SZ];
static char dict[DIC_SZ], *_dict = dict;
static char *syms[SYM_SZ], **_syms = syms;
static int acc[SYM_SZ], rules[RUL_SZ][SYM_SZ * 2], _rules = 0;

static char *
walk_ws(char *s)
{
	while(s[0] && s[0] <= 0x20)
		s++;
	return s;
}

static char *
scap(char *s)
{
	while(*s) s++;
	return s;
}

static void
trim(char **s)
{
	char *cap = scap(*s) - 1;
	while(*cap) {
		if(*cap > 0x20) break;
		*cap = 0;
		cap--;
	}
}

static int
scmp(char *a, char *b)
{
	while(*a && *b) {
		if(*a == ',' && !*b) break;
		if(*a != *b) break;
		if(*a == ' ') a = walk_ws(a);
		if(*b == ' ') b = walk_ws(b);
		a++, b++;
	}
	return !*b && (*a == ',' || *a == key || *a <= 0x20);
}

static int
find_symbol(char *s)
{
	int i, len = _syms - &syms[0];
	for(i = 0; i < len; i++)
		if(scmp(s, syms[i]))
			return i;
	return -1;
}

static char *
walk_symbol(char *s, int *id)
{
	s = walk_ws(s);
	*id = find_symbol(s);
	if(*id > -1) {
		while(s && s[0] != key && s[0] != ',' && s[0] != 0xa && s[0] != key)
			*s++;
		return s;
	}
	*_syms = _dict;
	while(s[0] && s[0] != key && s[0] != ',' && s[0] != 0xa && s[0] != key) {
		*_dict++ = *s++;
		if(*s == ' ')
			s = walk_ws(s), *_dict++ = ' ';
	}
	trim(_syms);
	*_dict++ = 0, *id = _syms - &syms[0], _syms++;
	return s;
}

static char *
walk_rule(char *s)
{
	int id, valid = 1;
	/* lhs */
	while(valid) {
		s = walk_symbol(s, &id);
		rules[_rules][id]++;
		if(s[0] == ',')
			s++, valid = 1;
		else
			valid = 0;
	}
	/* rhs */
	if(s[0] != key)
		printf("Broken rule?!\n");
	s++;
	s = walk_ws(s);
	valid = s[0] != key;
	while(valid) {
		s = walk_symbol(s, &id);
		rules[_rules][id + SYM_SZ]++;
		if(s[0] == ',')
			s++, valid = 1;
		else
			valid = 0;
	}
	_rules++;
	return walk_ws(s);
}

static char *
walk_fact(char *s)
{
	int id, valid = 1;
	while(valid) {
		s = walk_symbol(s, &id), acc[id]++;
		if(s[0] == ',')
			s++, valid = 1;
		else
			valid = 0;
	}
	return s;
}

static int
parse(char *s)
{
	key = s[0];
	s = walk_ws(s);
	while(s[0]) {
		s = walk_ws(s);
		if(s[0] == key) {
			if(s[1] == key)
				s = walk_fact(s + 2);
			else
				s = walk_rule(s + 1);
		} else if(s[0]) {
			printf("Unexpected ending: [%c]%s\n", s[0], s);
			return 0;
		}
	}
	return 1;
}

static void
prinths(int *hs)
{
	int i;
	for(i = 0; i < SYM_SZ; i++) {
		if(hs[i] > 1)
			printf("%s^%d ", syms[i], hs[i]);
		else if(hs[i])
			printf("%s, ", syms[i]);
	}
	printf("\n");
}

static int
match(int *a, int *b)
{
	int i;
	for(i = 0; i < SYM_SZ; i++) {
		if(b[i] && !a[i])
			return 0;
	}
	return 1;
}

static void
eval(void)
{
	int i, r = 0, steps = 0;
	printf("AC "), prinths(acc);
	while(r < _rules) {
		if(match(acc, rules[r])) {
			for(i = 0; i < SYM_SZ; i++) {
				if(rules[r][i])
					acc[i] -= 1;
				if(rules[r][SYM_SZ + i])
					acc[i] += 1;
			}
			printf("%02d ", r), prinths(acc);
			r = 0, steps++;
		} else
			r++;
	}
}

int
main(int argc, char *argv[])
{
	FILE *f;
	int a = 1;
	if(argc < 2)
		return !printf(
			"Vera, 6 Dec 2024.\nusage: vera input.vera\n");
	if(!(f = fopen(argv[a], "r")))
		return !printf("Source missing: %s\n", argv[a]);
	if(!fread(&src, 1, SRC_SZ, f))
		return !printf("Source empty: %s\n", argv[a]);
	if(parse(src))
		eval();
	fclose(f);
	return 0;
}
