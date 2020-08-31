#include <math.h>
#include <string.h>
#include <time.h>

int
hms_to_sec(int hour, int min, int sec)
{
	return hour * 60 * 60 + min * 60 + sec;
}

void
print_neralie_from_sec(int sec)
{
	char* beat = "000";
	char* pulse = "000";
	int val = (sec / 86400.0) * 1000000;
	snprintf(beat, 4, "%03d", val / 1000);
	snprintf(pulse, 4, "%03d", val % 1000);
	printf("%s:%s\n", beat, pulse);
}

void
print_hms_from_sec(int sec)
{
	printf("%02d:%02d:%02d\n", sec / 3600, (sec / 60) % 60, sec % 60);
}

void
print_neralie_from_hmsstr(char* time)
{
	int hour = (time[0] - '0') * 10 + time[1] - '0';
	int min = (time[3] - '0') * 10 + time[4] - '0';
	int sec = (time[6] - '0') * 10 + time[7] - '0';
	print_neralie_from_sec(hms_to_sec(hour, min, sec));
}

void
print_hmsstr_from_neralie(char* time)
{
	int beat = (time[0] - '0') * 100 + (time[1] - '0') * 10 + (time[2] - '0');
	int pulse = (time[4] - '0') * 100 + (time[5] - '0') * 10 + (time[6] - '0');
	print_hms_from_sec(((beat * 1000 + pulse) / 1000000.0) * 86400);
}

void
print_neralie_from_time(time_t t)
{
	struct tm* local = localtime(&t);
	int hour, min, sec;
	hour = local->tm_hour;
	min = local->tm_min;
	sec = local->tm_sec;
	print_neralie_from_sec(hms_to_sec(hour, min, sec));
}

void
print_neralie(void)
{
	time_t now;
	time(&now);
	print_neralie_from_time(now);
}
