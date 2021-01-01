/* helpers */

int
ymd_to_doty(int y, int m, int d)
{
	int i = 0, daymon = 0, dayday = 0;
	int months[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
	if((y % 4) || ((y % 100) && (y % 400))) {
		months[3] = months[3] + 1;
	}
	for(i = 0; i < m; i++) {
		daymon += months[i];
	}
	dayday = d;
	return (daymon + dayday) - 1;
}

int
time_to_doty(time_t *t)
{
	struct tm *local = localtime(t);
	int y = local->tm_year + 1900;
	int m = local->tm_mon + 1;
	int d = local->tm_mday;
	printf("DOTY : %d - %d\n", ymd_to_doty(y, m, d), local->tm_yday);
	return ymd_to_doty(y, m, d);
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

/* validators */

int
is_valid_arvelie(char *date)
{
	int y = ((date[0] - '0') * 10) + date[1] - '0';
	int m = date[2] - 'A';
	int d = ((date[3] - '0') * 10) + date[4] - '0';
	if(slen(date) != 5) {
		return 0;
	}
	if(y < 0 || y > 99 || m < 0 || m > 26 || d < 0 || d > 14) {
		return 0;
	}
	return 1;
}

int
is_valid_ymdstr(char *date)
{
	int y = (date[0] - '0') * 1000 + (date[1] - '0') * 100 +
			(date[2] - '0') * 10 + date[3] - '0';
	int m = (date[5] - '0') * 10 + date[6] - '0';
	int d = (date[8] - '0') * 10 + date[9] - '0';
	if(slen(date) != 10) {
		return 0;
	}
	if(y < 0 || y > 9999 || m < 0 || m > 12 || d < 0 || d > 31) {
		return 0;
	}
	return 1;
}

/* converters */

int
arveliedoty(char *date)
{
	int d = ((date[3] - '0') * 10) + date[4] - '0';
	int m = date[2] == '+' ? 26 : date[2] - 'A';
	return m * 14 + d;
}

time_t
ymd_to_time(int y, int m, int d)
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
arvelie_to_time(int epoch, char *arvelie)
{
	int doty = arveliedoty(arvelie);
	int y = (arvelie[0] - '0') * 10 + (arvelie[1] - '0');
	int m = doty_to_month(doty);
	int d = doty_to_day(doty);
	return ymd_to_time(epoch + y, m, d);
}

int
arveliedays(char *arvelie)
{
	int year = (arvelie[0] - '0') * 10 + (arvelie[1] - '0');
	return year * 365 + arveliedoty(arvelie);
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

void
print_arvelie_from_time(time_t t)
{
	struct tm *local = localtime(&t);
	int y = local->tm_year + 1900;
	int m = local->tm_mon + 1;
	int d = local->tm_mday;
	print_arvelie_from_doty(y, ymd_to_doty(y, m, d));
}

int
print_arvelie_from_ymdstr(char *date)
{
	int y = (date[0] - '0') * 1000 + (date[1] - '0') * 100 +
			(date[2] - '0') * 10 + date[3] - '0';
	int m = (date[5] - '0') * 10 + date[6] - '0';
	int d = (date[8] - '0') * 10 + date[9] - '0';
	if(!is_valid_ymdstr(date)) {
		printf("Error: Invalid YYYY-MM-DD date\n");
		return 1;
	}
	print_arvelie_from_doty(y, ymd_to_doty(y, m, d));
	return 0;
}

int
print_ymdstr_from_arvelie(char *date)
{
	int y = ((date[0] - '0') * 10 + date[1] - '0') + 2000;
	if(!is_valid_arvelie(date)) {
		printf("Error: Invalid arvelie date\n");
		return 1;
	}
	print_ymdstr_from_doty(y, arveliedoty(date));
	return 0;
}
