/* helpers */

int
ymdstrdoty(int y, int m, int d)
{
	int i = 0, daymon = 0, dayday = 0;
	int months[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
	if((y % 4) || ((y % 100) && (y % 400)))
		months[3] = months[3] + 1;
	for(i = 0; i < m; i++)
		daymon += months[i];
	dayday = d;
	return (daymon + dayday) - 1;
}

int
doty_to_month(int doty)
{
	int month = 0;
	int months[13] = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365};
	while(months[month] < doty)
		month++;
	return month - 1;
}

int
doty_to_day(int doty)
{
	int month = 1;
	int months[13] = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365};
	while(months[month] < doty)
		month++;
	return doty - months[month - 1];
}

/* converters */

int
arveliedoty(char *date)
{
	int d = ((date[3] - '0') * 10) + date[4] - '0';
	int m = date[2] == '+' ? 26 : date[2] - 'A';
	return m * 14 + d;
}

int
arveliedays(char *date)
{
	int year = (date[0] - '0') * 10 + (date[1] - '0');
	return year * 365 + arveliedoty(date);
}

time_t
ymdstrtime(int y, int m, int d)
{
	struct tm stime;
	stime.tm_year = y - 1900;
	stime.tm_mday = d;
	stime.tm_mon = m;
	stime.tm_hour = 0;
	stime.tm_min = 0;
	stime.tm_sec = 1;
	stime.tm_isdst = -1;
	return mktime(&stime);
}

time_t
arvelietime(int epoch, char *date)
{
	int doty = arveliedoty(date);
	int y = (date[0] - '0') * 10 + (date[1] - '0');
	int m = doty_to_month(doty);
	int d = doty_to_day(doty);
	return ymdstrtime(epoch + y, m, d);
}

void
parvelie(int epoch)
{
	time_t now;
	struct tm *local;
	time(&now);
	local = localtime(&now);
	printf("%02d%c%02d",
		(1900 + local->tm_year - epoch) % 100,
		local->tm_yday >= 364 ? '+' : 'A' + local->tm_yday / 14,
		local->tm_yday % 14);
}

/* unused(OLD) */

int
print_ymdstr_from_doty(int y, int doty)
{
	int d, m = 0, months[13] = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365};
	while(months[m] < doty) {
		m++;
	}
	if(m < 1) {
		printf("Error: Unknown Month\n");
		return 1;
	}
	d = doty - months[m - 1];
	printf("%04d-%02d-%02d\n", y, m, d);
	return 0;
}

void
print_arvelie_from_doty(int y, int doty)
{
	char *months[] = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "+"};
	int d = (doty % 14) + 1;
	char *m = months[doty / 14];
	printf("%d%s%02d", y % 100, m, d);
}
