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
	struct tm* local = localtime(t);
	int y = local->tm_year + 1900;
	int m = local->tm_mon + 1;
	int d = local->tm_mday;
	return ymd_to_doty(y, m, d);
}

int
doty_to_month(int doty)
{
	int month = 0;
	int months[13] = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365};
	while(months[month] < doty) {
		month++;
	}
	return month - 1;
}

int
doty_to_day(int doty)
{
	int month = 0;
	int months[13] = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365};
	while(months[month] < doty) {
		month++;
	}
	return doty - months[month - 1];
}

/* validators */

int
is_valid_arvelie(char* date)
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
is_valid_ymdstr(char* date)
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
arvelie_to_doty(char* date)
{
	int m = date[2] - 'A';
	int d = ((date[3] - '0') * 10) + date[4] - '0';
	int doty = (m * 14) + d;
	return doty == -307 ? 364 : doty == -306 ? 265 : doty;
}

time_t
arvelie_to_time(char* arvelie)
{
	int doty = arvelie_to_doty(arvelie);
	int year = (arvelie[0] - '0') * 10 + (arvelie[1] - '0');
	int month = doty_to_month(doty);
	int day = doty_to_day(doty);
	struct tm str_time;
	str_time.tm_year = (2000 + year) - 1900;
	str_time.tm_mon = month;
	str_time.tm_mday = day;
	str_time.tm_hour = 0;
	str_time.tm_min = 0;
	str_time.tm_sec = 0;
	str_time.tm_isdst = 0;
	return mktime(&str_time);
}

int
arvelie_to_offset(char *arvelie)
{
	return (int)arvelie_to_time(arvelie)/86400;
}

int
get_offset(void){
	time_t now;
	time(&now);
	return (int)now/86400;
}

/* printers */

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
	char* months[] = {"A", "B", "C", "D", "E", "F", "G", "H", "I",
	                  "J", "K", "L", "M", "N", "O", "P", "Q", "R",
	                  "S", "T", "U", "V", "W", "X", "Y", "Z", "+"};
	int d = (doty % 14) + 1;
	char* m = months[doty / 14];
	printf("%d%s%02d", y % 100, m, d);
}

void
print_arvelie_from_time(time_t t)
{
	struct tm* local = localtime(&t);
	int y = local->tm_year + 1900;
	int m = local->tm_mon + 1;
	int d = local->tm_mday;
	print_arvelie_from_doty(y, ymd_to_doty(y, m, d));
}

int
print_arvelie_from_ymdstr(char* date)
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
print_ymdstr_from_arvelie(char* date)
{
	int y = ((date[0] - '0') * 10 + date[1] - '0') + 2000;
	if(!is_valid_arvelie(date)) {
		printf("Error: Invalid arvelie date\n");
		return 1;
	}
	print_ymdstr_from_doty(y, arvelie_to_doty(date));
	return 0;
}

void
print_arvelie(void)
{
	time_t now;
	time(&now);
	print_arvelie_from_time(now);
}
