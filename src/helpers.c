typedef enum { false,
	       true } bool;

bool
isalphachr(char ch)
{
	return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

bool
isnumchr(char ch)
{
	return ch >= '0' && ch <= '9';
}

bool
isspacechr(char ch)
{
	return ch == ' ';
}

bool
isalphanumchr(char ch)
{
	return !isalphachr(ch) && !isnumchr(ch) && !isspacechr(ch) ? false : true;
}

bool
isalphanumstr(char* src)
{
	int i;
	for(i = 0; i < (int)strlen(src); i++) {
		if(!isalphanumchr(src[i])) {
			printf("%c\n", src[i]);
			return false;
		}
	}
	return true;
}

int
indexstr(char* a, char* b)
{
	int i, j, alen = strlen(a), blen = strlen(b);
	for(i = 0; i < alen; i++) {
		for(j = 0; j < blen; j++) {
			if(a[i + j] == '\0') {
				return -1;
			}
			if(a[i + j] != b[j]) {
				break;
			}
			if(j == blen - 1) {
				return i;
			}
		}
	}
	return -1;
}

int
indexchr(char* str, char target)
{
	int i;
	int len = strlen(str);
	for(i = 0; i < len; i++) {
		if(str[i] == target) {
			return i;
		}
	}
	return -1;
}

int
strint(char* str)
{
	int num = 0, i = 0;
	while(str[i] && (str[i] >= '0' && str[i] <= '9')) {
		num = num * 10 + (str[i] - '0');
		i++;
	}
	return num;
}

int
substrint(char* str, int from, int len)
{
	int num = 0, i = 0;
	while(str[i] && (str[i] >= '0' && str[i] <= '9')) {
		if(i >= from && i < from + len) {
			num = num * 10 + (str[i] - '0');
		}
		i++;
	}
	return num;
}

bool
isurlstr(char* str)
{
	return indexstr(str, "://") >= 0;
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
	int index = indexstr(src, a);
	if(index < 0) {
		return;
	}
	substr(src, head, 0, index);
	substr(src, tail, index + strlen(a), strlen(src) - index - strlen(a));
	dest[0] = '\0';
	strcat(dest, head);
	strcat(dest, b);
	strcat(dest, tail);
}

void
cpystr(char* src, char* dest)
{
	int i;
	int len = strlen(src);
	for(i = 0; i < len; i++) {
		dest[i] = src[i];
	}
	dest[len] = '\0';
}

void
ucstr(char* dest)
{
	int i, len = strlen(dest);
	for(i = 0; i < len; i++) {
		dest[i] = toupper(dest[i]);
	}
}

void
lcstr(char* dest)
{
	int i, len = strlen(dest);
	for(i = 0; i < len; i++) {
		dest[i] = tolower(dest[i]);
	}
}

char*
trimstr(char* str)
{
	char* end;
	while(isspace((unsigned char)*str))
		str++;
	if(*str == 0)
		return str;
	end = str + strlen(str) - 1;
	while(end > str && isspace((unsigned char)*end))
		end--;
	end[1] = '\0';
	return str;
}

void
alphanumstr(char* src, char* dest)
{
	int i;
	int len = strlen(src) + 1;
	for(i = 0; i < len; i++) {
		dest[i] = src[i];
		if(dest[i] == '\0') {
			break;
		}
		if(!isalphanumchr(dest[i])) {
			dest[i] = ' ';
		} else {
			dest[i] = tolower(dest[i]);
		}
	}
	dest[len - 1] = '\0';
}

void
filenamestr(char* str, char* mod)
{
	int i;
	int len = strlen(str) + 1;
	for(i = 0; i < len; i++) {
		mod[i] = str[i];
		if(mod[i] == '\0') {
			break;
		}
		if(!isalphachr(mod[i]) && !isnumchr(mod[i])) {
			mod[i] = '_';
		} else {
			mod[i] = tolower(mod[i]);
		}
	}
	mod[len - 1] = '\0';
}

void
firstword(char* src, char* dest)
{
	int until = indexchr(src, ' ');
	if(until > -1) {
		substr(src, dest, 0, until);
	} else {
		substr(src, dest, 0, strlen(src));
	}
}

int
count_leading_spaces(char* str)
{
	int i;
	int len = strlen(str) + 1;
	for(i = 0; i < len; i++) {
		if(str[i] != ' ') {
			return i;
		}
	}
	return -1;
}

int
index_of_string(char* a[], int num_elements, char* value)
{
	int i;
	for(i = 0; i < num_elements; i++) {
		if(strcmp(a[i], value) == 0) {
			return i;
		}
	}
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
		} else if(epoch >= range_from && epoch <= range_to) {
			fputs("+", f);
		} else {
			fputs("-", f);
		}
	}
}

void
fputs_rfc2822(FILE* f, time_t t)
{
	char rfc_2822[40];
	strftime(rfc_2822, sizeof(rfc_2822), "%a, %d %b %Y 00:00:00 +0900", localtime(&t));
	fprintf(f, "%s", rfc_2822);
}