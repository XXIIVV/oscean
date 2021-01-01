#include <stdio.h>
#include <time.h>

#include "arvelie.h"

int
slen(char *s)
{
	int i = 0;
	while(s[i] && s[++i])
		;
	return i;
}

int
error(char *msg, char *val)
{
	printf("Error: %s(%s)\n", msg, val);
	return 1;
}

int
validarvelie(char *date)
{
	int y, m, d;
	if(slen(date) != 5)
		return 0;
	y = ((date[0] - '0') * 10) + date[1] - '0';
	m = date[2] - 'A';
	d = ((date[3] - '0') * 10) + date[4] - '0';
	if(y < 0 || y > 99 || m < 0 || m > 26 || d < 0 || d > 14)
		return 0;
	return 1;
}

int
validymdstr(char *date)
{
	int y, m, d;
	if(slen(date) != 10)
		return 0;
	y = (date[0] - '0') * 1000 + (date[1] - '0') * 100 +
		(date[2] - '0') * 10 + date[3] - '0';
	m = (date[5] - '0') * 10 + date[6] - '0';
	d = (date[8] - '0') * 10 + date[9] - '0';
	if(y < 0 || y > 9999 || m < 0 || m > 12 || d < 0 || d > 31)
		return 0;
	return 1;
}

int
print_arvelie_from_ymdstr(char *date)
{
	int y = (date[0] - '0') * 1000 + (date[1] - '0') * 100 +
			(date[2] - '0') * 10 + date[3] - '0';
	int m = (date[5] - '0') * 10 + date[6] - '0';
	int d = (date[8] - '0') * 10 + date[9] - '0';
	print_arvelie_from_doty(y, ymdstrdoty(y, m, d));
	return 0;
}

int
print_ymdstr_from_arvelie(char *date)
{
	int y = ((date[0] - '0') * 10 + date[1] - '0') + 2000;
	print_ymdstr_from_doty(y, arveliedoty(date));
	return 0;
}

int
main(int argc, char *argv[])
{
	if(argc > 1) {
		if(validymdstr(argv[1]))
			print_arvelie_from_ymdstr(argv[1]);
		else if(validarvelie(argv[1]))
			print_ymdstr_from_arvelie(argv[1]);
		else
			return error("Misformatted Input", argv[1]);
	} else
		parvelie(2016);
	return 0;
}
