/* char is space */

int
cisp(char c)
{
	return c == ' ' || c == '\t' || c == '\n' || c == '\r';
}

/* char is alpha */

int
cial(char c)
{
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

/* char is num */

int
cinu(char c)
{
	return c >= '0' && c <= '9';
}

/* char to lowercase */

int
clca(int c)
{
	return c >= 'A' && c <= 'Z' ? c + ('a' - 'A') : c;
}

/* char to uppercase */

int
cuca(char c)
{
	return c >= 'a' && c <= 'z' ? c - ('a' - 'A') : c;
}

/* string count padding */

int
spad(char *s, char c)
{
	int i = 0;
	while(s[i] && s[i] == c && s[++i])
		;
	return i;
}

/* string length */

int
slen(char *s)
{
	int i = 0;
	while(s[i] && s[++i])
		;
	return i;
}

/* string to uppercase */

char *
suca(char *s)
{
	int i = 0;
	char c;
	while((c = s[i]))
		s[i++] = cuca(c);
	return s;
}

/* string to lowercase */

char *
slca(char *s)
{
	int i = 0;
	char c;
	while((c = s[i]))
		s[i++] = clca(c);
	return s;
}

/* string compare */

int
scmp(char *a, char *b)
{
	int i = 0;
	while(a[i] == b[i])
		if(!a[i++])
			return 1;
	return 0;
}

/* string copy */

char *
scpy(char *src, char *dst, int len)
{
	int i = 0;
	while((dst[i] = src[i]) && i < len)
		i++;
	dst[i + 1] = '\0';
	return dst;
}

/* string to num */

int
sint(char *s, int len)
{
	int n = 0, i = 0;
	while(s[i] && i < len && (s[i] >= '0' && s[i] <= '9'))
		n = n * 10 + (s[i++] - '0');
	return n;
}

char *
scsw(char *s, char a, char b)
{
	int i;
	for(i = 0; i < slen(s); i++)
		s[i] = s[i] == a ? b : s[i];
	return s;
}

/* string is alphanum */

int
sian(char *s)
{
	int i = 0;
	char c;
	while((c = s[i++]))
		if(!cial(c) && !cinu(c) && !cisp(c))
			return 0;
	return 1;
}

/* string char index */

int
scin(char *s, char c)
{
	int i = 0;
	while(s[i])
		if(s[i++] == c)
			return i - 1;
	return -1;
}

/* string substring index */

int
ssin(char *s, char *ss)
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
surl(char *s)
{
	return ssin(s, "://") >= 0 || ssin(s, "../") >= 0;
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

/* hex char */

unsigned char
chex(char c)
{
	if(c >= 'a' && c <= 'f')
		return 10 + c - 'a';
	if(c >= 'A' && c <= 'F')
		return 10 + c - 'A';
	return (c - '0') & 0xF;
}

/* hex string to int */

int
shex(char *s, int len)
{
	int i, n = 0;
	for(i = 0; i < len; ++i)
		n |= (chex(s[i]) << ((len - i - 1) * 4));
	return n;
}

/* string is hex string */

int
sihx(char *s)
{
	int i = 0;
	char c;
	while((c = s[i++]) && i < 6)
		if(!cinu(c) && (c < 'a' || c > 'f'))
			return 0;
	return i == 6;
}
