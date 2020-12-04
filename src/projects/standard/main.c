#include <stdio.h>
#include <stdlib.h>

#include "standard.h"

void
teststr(char *name, char *a, char *b)
{
	printf("%s %s[%s = %s]\n", name, scmp(a, b) ? "passed" : "failed", a, b);
}

void
test(char *name, int a, int b)
{
	printf("%s %s[%d = %d]\n", name, a == b ? "passed" : "failed", a, b);
}

int
main(int argc, char *argv[])
{
	char a[] = "abcdef123";
	char b[] = "ABCDEF123";

	(void)argc;
	(void)argv;

	teststr("suca", suca(a), "ABCDEF123");
	teststr("suca", slca(b), "abcdef123");

	test("sihx", sihx("ff00ee"), 1);
	test("sihx", sihx("ff0"), 0);
	test("sihx", sihx("ffa0zq"), 0);
	return 0;
}
