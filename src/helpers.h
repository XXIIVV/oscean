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
cpad(char* s, char c)
{
	int i = 0;
	for(i = 0; i < slen(s) + 1; i++)
		if(s[i] != c)
			return i;
	return 0;
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

char*
suca(char* s)
{
	int i;
	for(i = 0; i < slen(s); i++)
		s[i] = cuca(s[i]);
	return s;
}

char*
slca(char* s)
{
	int i;
	for(i = 0; i < slen(s); i++)
		s[i] = clca(s[i]);
	return s;
}

char*
scsw(char* s, char a, char b)
{
	int i;
	for(i = 0; i < slen(s); i++)
		s[i] = s[i] == a ? b : s[i];
	return s;
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
spos(char* s, char* ss)
{
	int a = 0, b = 0;
	while(s[a] != '\0') {
		if(s[a] == ss[b]) {
			if(ss[b + 1] == '\0')
				return a - b;
			b++;
		} else
			b = 0;
		a++;
	}
	return -1;
}

int
sint(char* s, int len)
{
	int num = 0, i = 0;
	while(s[i] && cinu(s[i]) && i < len) {
		num = num * 10 + (s[i] - '0');
		i++;
	}
	return num;
}

int
surl(char* s)
{
	return spos(s, "://") >= 0 || spos(s, "../") >= 0;
}

char*
scpy(char* src, char* dst)
{
	int i = 0;
	while((dst[i] = src[i]) != '\0')
		i++;
	return dst;
}

char*
sstr(char* src, char* dst, int from, int to)
{
	int i;
	char *a = (char*)src + from, *b = (char*)dst;
	for(i = 0; i < to; i++)
		b[i] = a[i];
	dst[to] = '\0';
	return dst;
}

int
afnd(char* src[], int len, char* val)
{
	int i;
	for(i = 0; i < len; i++)
		if(scmp(src[i], val))
			return i;
	return -1;
}

char*
ccat(char* dst, char c)
{
	int len = slen(dst);
	dst[len] = c;
	dst[len + 1] = '\0';
	return dst;
}

char*
scat(char* dst, const char* src)
{
	char* ptr = dst + slen(dst);
	while(*src != '\0')
		*ptr++ = *src++;
	*ptr = '\0';
	return dst;
}

/* old */

void
swapstr(char* src, char* dst, char* a, char* b)
{
	char head[1024], tail[1024];
	int index = spos(src, a);
	if(index < 0)
		return;
	sstr(src, head, 0, index);
	sstr(src, tail, index + slen(a), slen(src) - index - slen(a));
	dst[0] = '\0';
	scat(dst, head);
	scat(dst, b);
	scat(dst, tail);
}

void
firstword(char* src, char* dst)
{
	int until = cpos(src, ' ');
	if(until > -1)
		sstr(src, dst, 0, until);
	else
		sstr(src, dst, 0, slen(src));
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
fputs_rfc2822(FILE* f, time_t t)
{
	char rfc_2822[40];
	strftime(rfc_2822, sizeof(rfc_2822), "%a, %d %b %Y 00:00:00 +0900", localtime(&t));
	fprintf(f, "%s", rfc_2822);
}

void
fputs_rfc3339(FILE* f, time_t t)
{
	struct tm* tm;
	if((tm = localtime(&t)) == NULL)
		return;
	fprintf(f, "%04d-%02d-%02dT%02d:%02d:%02d%c%02d:%02d",
	        tm->tm_year + 1900, tm->tm_mon + 1, tm->tm_mday,
	        tm->tm_hour, tm->tm_min, tm->tm_sec,
	        '-', 7, 0); /* Vancouver GMT-7*/
}

/* Block */

#define limit 4096 * 96

typedef struct Block {
	char data[limit];
	int len;
} Block;

Block
alloc()
{
	Block b;
	b.len = 0;
	b.data[0] = '\0';
	return b;
}

char*
push(Block* b, char* s)
{
	int i = 0, o = b->len;
	while(s[i] != '\0')
		b->data[b->len++] = s[i++];
	b->data[b->len++] = '\0';
	return &b->data[o];
}
