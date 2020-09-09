typedef enum { false,
	       true } bool;

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
slen(char* s)
{
	int n = 0;
	while(s[n] != '\0' && s[++n])
		;
	return n;
}

int
cpos(char* s, char c)
{
	int i;
	for(i = 0; i < slen(s); i++)
		if(s[i] == c)
			return i;
	return -1;
}

void
suca(char* s)
{
	int i;
	for(i = 0; i < slen(s); i++)
		s[i] = cuca(s[i]);
}

void
slca(char* s)
{
	int i;
	for(i = 0; i < slen(s); i++)
		s[i] = clca(s[i]);
}

void
scsw(char* s, char a, char b)
{
	int i;
	for(i = 0; i < slen(s); i++)
		s[i] = s[i] == a ? b : s[i];
}

int
scmp(char* a, char* b)
{
	int i, l = slen(a);
	if(l != slen(b))
		return 0;
	for(i = 0; i < l; ++i)
		if(a[i] != b[i])
			return 0;
	return 1;
}

int
sans(char* s)
{
	int i;
	for(i = 0; i < slen(s); i++)
		if(!cans(s[i]))
			return 0;
	return 1;
}

char*
strm(char* s)
{
	char* end;
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
spos(char* a, char* b)
{
	int i, j, alen = slen(a), blen = slen(b);
	for(i = 0; i < alen; i++) {
		for(j = 0; j < blen; j++) {
			if(a[i + j] == '\0')
				return -1;
			if(a[i + j] != b[j])
				break;
			if(j == blen - 1)
				return i;
		}
	}
	return -1;
}

int
sint(char* s)
{
	int num = 0, i = 0;
	while(s[i] && cinu(s[i])) {
		num = num * 10 + (s[i] - '0');
		i++;
	}
	return num;
}

int
surl(char* s)
{
	return spos(s, "://") >= 0 || spos(s, "./") >= 0;
}

void
scpy(char* src, char* dest)
{
	int i, len = slen(src);
	for(i = 0; i < len; i++)
		dest[i] = src[i];
	dest[len] = '\0';
}

void
sstr(char* src, char* dest, int from, int to)
{
	memcpy(dest, src + from, to);
	dest[to] = '\0';
}

/* old */

int
substrint(char* str, int from, int len)
{
	int num = 0, i = 0;
	while(str[i] && (str[i] >= '0' && str[i] <= '9')) {
		if(i >= from && i < from + len)
			num = num * 10 + (str[i] - '0');
		i++;
	}
	return num;
}

void
substr(char* src, char* dest, int from, int to)
{
	memcpy(dest, src + from, to);
	dest[to] = '\0';
}

void
swapstr(char* src, char* dest, char* a, char* b)
{
	char head[1024], tail[1024];
	int index = spos(src, a);
	if(index < 0)
		return;
	substr(src, head, 0, index);
	substr(src, tail, index + slen(a), slen(src) - index - slen(a));
	dest[0] = '\0';
	strcat(dest, head);
	strcat(dest, b);
	strcat(dest, tail);
}

void
filenamestr(char* str, char* mod)
{
	int i;
	int len = slen(str) + 1;
	for(i = 0; i < len; i++) {
		mod[i] = str[i];
		if(mod[i] == '\0')
			break;
		if(!cial(mod[i]) && !cinu(mod[i]))
			mod[i] = '_';
		else
			mod[i] = clca(mod[i]);
	}
	mod[len - 1] = '\0';
}

void
firstword(char* src, char* dest)
{
	int until = cpos(src, ' ');
	if(until > -1)
		substr(src, dest, 0, until);
	else
		substr(src, dest, 0, slen(src));
}

int
count_leading_spaces(char* str)
{
	int i;
	for(i = 0; i < slen(str) + 1; i++)
		if(str[i] != ' ')
			return i;
	return -1;
}

int
sfin(char* a[], int num_elements, char* value)
{
	int i;
	for(i = 0; i < num_elements; i++)
		if(scmp(a[i], value))
			return i;
	return -1;
}

float
clock_since(clock_t start)
{
	double cpu_time_used = ((double)(clock() - start)) / CLOCKS_PER_SEC;
	return cpu_time_used * 1000;
}

char*
nowstr(void)
{
	time_t now;
	time(&now);
	return ctime(&now);
}

void
fputs_lifeline(FILE* f, int limit_from, int limit_to, int range_from,
               int range_to, int len)
{
	int i;
	float f_len = len - 1;
	bool init = false;
	for(i = 0; i < len; i++) {
		float epoch = (i / f_len) * (limit_to - limit_from) + limit_from;
		if(epoch > range_from && !init) {
			fputs("+", f);
			init = true;
		} else if(epoch >= range_from && epoch <= range_to)
			fputs("+", f);
		else
			fputs("-", f);
	}
}

void
fputs_rfc2822(FILE* f, time_t t)
{
	char rfc_2822[40];
	strftime(rfc_2822, sizeof(rfc_2822), "%a, %d %b %Y 00:00:00 +0900", localtime(&t));
	fprintf(f, "%s", rfc_2822);
}
