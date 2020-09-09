#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#include <math.h>
#include <string.h>

#include "../../helpers.h"

int
main(void)
{
	char str[30] = "  hello world\t ";
	printf("%d\n", cspa('a'));
	printf("%d\n", cspa('\n'));
	printf("%d\n", cspa('\t'));

	printf("%d\n", slen("  \thello "));
	printf("%d\n", slen(""));
	printf("%d\n", slen("\n"));

	printf("%d\n", cpos("hello", 'e'));
	printf("%d\n", cpos("hello\n", '\n'));
	printf("%d\n", cpos("", ' '));

	printf("%d\n", scmp("hello", "hello"));
	printf("%d\n", scmp("hello", ""));
	printf("%d\n", scmp("\n", "hello"));
	printf("%d\n", scmp("", ""));

	printf("[%s]\n", strm(str));
	/*
	printf("%s\n", strm(""));
	printf("%s\n", strm("\nhello\t"));
	*/
	return (0);
}
