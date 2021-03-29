#include <stdio.h>
#include <time.h>

int
error(char *msg, char *val)
{
	printf("Error: %s(%s)\n", msg, val);
	return 0;
}

int
dateoffset(int y, int m, int d)
{
	m = (m + 9) % 12;
	y = y - m / 10;
	return 365 * y + y / 4 - y / 100 + y / 400 + (m * 306 + 5) / 10 + (d - 1);
}

int
todayoffset(void)
{
	time_t t = time(NULL);
	struct tm tm = *localtime(&t);
	return dateoffset(tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday);
}

void
generate(FILE *f)
{
	int i, marble = (todayoffset() - dateoffset(1986, 3, 22)) / 7;
	fprintf(f, "<table border='1'>");
	fprintf(f, "<tr><th>%d marbles used</th><th>%d marbles left</th></tr>", marble, 3900 - marble);
	fprintf(f, "<td><small><code>");
	for(i = 0; i < 390; ++i) {
		fprintf(f, "%c", 390 - i < marble / 10 ? 'o' : '.');
		if(i % 39 == 38)
			fprintf(f, "\n");
	}
	fprintf(f, "</code><small></td><td><small><code>");
	for(i = 0; i < 390; ++i) {
		fprintf(f, "%c", i > marble / 10 ? 'o' : '.');
		if(i % 39 == 38)
			fprintf(f, "\n");
	}
	fprintf(f, "</code><small></td></tr></table>");
	fclose(f);
}

int
main(int argc, char *argv[])
{
	FILE *f;
	if(argc < 2)
		return error("Missing path", "--");
	f = fopen(argv[1], "w");
	if(!f) return error("Could not open file", argv[1]);
	generate(f);
	return 0;
}
