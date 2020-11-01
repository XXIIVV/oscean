int
cisp(char c)
{
	return c == ' ' || c == '\t' || c == '\n' || c == '\r';
}

int
cial(char c)
{
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

int
cinu(char c)
{
	return c >= '0' && c <= '9';
}

int
clca(int c)
{
	return c >= 'A' && c <= 'Z' ? c + ('a' - 'A') : c;
}

int
cuca(char c)
{
	return c >= 'a' && c <= 'z' ? c - ('a' - 'A') : c;
}

int
cans(char c)
{
	return cial(c) || cinu(c) || cisp(c);
}

int
cpad(char *s, char c)
{
	int i = 0;
	while(s[i] == c && s[i] && s[++i])
		;
	return i;
}

int
cpos(char *s, char c)
{
	int i = 0;
	while(s[i] && s[i])
		if(s[i++] == c)
			return i - 1;
	return -1;
}

int
slen(char *s)
{
	int i = 0;
	while(s[i] && s[++i])
		;
	return i;
}

char *
suca(char *s)
{
	int i;
	for(i = 0; i < slen(s); i++)
		s[i] = cuca(s[i]);
	return s;
}

char *
slca(char *s)
{
	int i;
	for(i = 0; i < slen(s); i++)
		s[i] = clca(s[i]);
	return s;
}

char *
scsw(char *s, char a, char b)
{
	int i;
	for(i = 0; i < slen(s); i++)
		s[i] = s[i] == a ? b : s[i];
	return s;
}

int
scmp(char *a, char *b)
{
	int i = 0;
	while(a[i] == b[i])
		if(!a[i++])
			return 1;
	return 0;
}

int
sans(char *s)
{
	int i;
	for(i = 0; i < slen(s); i++)
		if(!cans(s[i]))
			return 0;
	return 1;
}

char *
strm(char *s)
{
	char *end;
	while(cisp(*s))
		s++;
	if(*s == 0)
		return s;
	end = s + slen(s) - 1;
	while(end > s && cisp(*end))
		end--;
	end[1] = '\0';
	return s;
}

int
spos(char *s, char *ss)
{
	int a = 0, b = 0;
	while(s[a]) {
		if(s[a] == ss[b]) {
			if(!ss[b + 1])
				return a - b;
			b++;
		} else
			b = 0;
		a++;
	}
	return -1;
}

int
sint(char *s, int len)
{
	int num = 0, i = 0;
	while(s[i] && cinu(s[i]) && i < len) {
		num = num * 10 + (s[i] - '0');
		i++;
	}
	return num;
}

int
surl(char *s)
{
	return spos(s, "://") >= 0 || spos(s, "../") >= 0;
}

char *
scpy(char *src, char *dst)
{
	int i = 0;
	while((dst[i] = src[i]))
		i++;
	return dst;
}

char *
sstr(char *src, char *dst, int from, int to)
{
	int i;
	char *a = (char *)src + from, *b = (char *)dst;
	for(i = 0; i < to; i++)
		b[i] = a[i];
	dst[to] = '\0';
	return dst;
}

int
afnd(char *src[], int len, char *val)
{
	int i;
	for(i = 0; i < len; i++)
		if(scmp(src[i], val))
			return i;
	return -1;
}

char *
ccat(char *dst, char c)
{
	int len = slen(dst);
	dst[len] = c;
	dst[len + 1] = '\0';
	return dst;
}

char *
scat(char *dst, const char *src)
{
	char *ptr = dst + slen(dst);
	while(*src)
		*ptr++ = *src++;
	*ptr = '\0';
	return dst;
}

/* old */

float
clockoffset(clock_t start)
{
	return (((double)(clock() - start)) / CLOCKS_PER_SEC) * 1000;
}

void
fpRFC2822(FILE *f, time_t t)
{
	struct tm *tm = localtime(&t);
	char *days[7] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
	char *months[12] = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
	fprintf(f, "%s, %02d %s %d 00:00:00 +0900", days[tm->tm_wday], tm->tm_mday, months[tm->tm_mon], tm->tm_year + 1900);
}

void
fpRFC3339(FILE *f, time_t t)
{
	struct tm *tm = localtime(&t);
	fprintf(f, "%04d-%02d-%02dT%02d:%02d:%02d%c%02d:%02d", tm->tm_year + 1900, tm->tm_mon + 1, tm->tm_mday, tm->tm_hour, tm->tm_min, tm->tm_sec, '-', 7, 0); /* Vancouver GMT-7*/
}

int
marble(int year, int month, int day)
{
	struct tm birth;
	birth.tm_year = year - 1900;
	birth.tm_mon = month - 1;
	birth.tm_mday = day;
	return (time(NULL) - mktime(&birth)) / 604800;
}
