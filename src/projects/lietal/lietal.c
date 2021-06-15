#include <math.h>
#include <string.h>

void
substr(char *src, char *dest, int from, int to)
{
	memcpy(dest, src + from, to);
	dest[to] = '\0';
}

void
lietal_dictionarystr(char *src, char *dest)
{
	int len = strlen(src);
	substr(src, dest, 0, len);
}

void
lietal_adultsegstr(char *src, char *dest)
{
	char c1 = src[0], v1 = src[1], c2 = src[2], v2 = src[3];
	substr(src, dest, 0, 4);
	if(c1 == c2 && v1 == v2) {
		dest[2] = 'e';
		dest[3] = '\0';
	} else if(c1 == c2) {
		dest[2] = v2;
		dest[3] = '\0';
	} else if(v1 == v2) {
		dest[3] = 'e';
		dest[4] = '\0';
	}
}

void
lietal_casualsegstr(char *src, char *dest)
{
	char c1 = src[0], v1 = src[1], c2 = src[2], v2 = src[3];
	substr(src, dest, 0, 4);
	if(c1 == c2 && v1 == v2) {
		dest[0] = v1;
		dest[1] = c1;
		dest[2] = 'e';
		dest[3] = '\0';
	} else if(c1 == c2) {
		dest[0] = v1;
		dest[1] = c1;
		dest[2] = v2;
		dest[3] = '\0';
	} else if(v1 == v2) {
		dest[0] = v1;
		dest[1] = c1;
		dest[2] = 'e';
		dest[3] = c2;
	} else {
		dest[0] = v1;
		dest[1] = c1;
		dest[2] = v2;
		dest[3] = c2;
	}
}

void
lietal_formalsegstr(char *src, char *dest)
{
	char c1 = src[0], v1 = src[1], c2 = src[2], v2 = src[3];
	substr(src, dest, 0, 4);
	if(c1 == c2 && v1 == v2) {
		dest[2] = 'e';
		dest[3] = '\0';
	} else if(c1 == c2) {
		dest[2] = v2;
		dest[3] = '\0';
	} else if(v1 == v2) {
		dest[2] = 'e';
		dest[3] = c2;
	} else {
		dest[2] = v2;
		dest[3] = c2;
	}
}

char *
lietal_casualstr(char *src, char *dest)
{
	if(strlen(src) == 2) {
		dest[0] = src[1];
		dest[1] = src[0];
		dest[2] = '\0';
	} else if(strlen(src) == 4)
		lietal_casualsegstr(src, dest);
	else if(strlen(src) == 6) {
		char seg1[3];
		char seg2[5];
		substr(src, seg1, 0, 2);
		substr(src, seg2, 2, 4);
		seg1[0] = src[1];
		seg1[1] = src[0];
		lietal_casualsegstr(seg2, seg2);
		dest[0] = '\0';
		strcat(dest, seg1);
		strcat(dest, seg2);
		dest[strlen(seg1) + strlen(seg2)] = '\0';
	} else if(strlen(src) == 8) {
		char seg1[5];
		char seg2[5];
		substr(src, seg1, 0, 4);
		substr(src, seg2, 4, 4);
		lietal_casualsegstr(seg1, seg1);
		lietal_casualsegstr(seg2, seg2);
		dest[0] = '\0';
		strcat(dest, seg1);
		strcat(dest, seg2);
		dest[strlen(seg1) + strlen(seg2)] = '\0';
	}
	return dest;
}

char *
lietal_formalstr(char *src, char *dest)
{
	if(strlen(src) == 2)
		substr(src, dest, 0, 2);
	else if(strlen(src) == 4)
		lietal_formalsegstr(src, dest);
	else if(strlen(src) == 6) {
		char seg1[3];
		char seg2[5];
		substr(src, seg1, 0, 2);
		substr(src, seg2, 2, 4);
		lietal_formalsegstr(seg2, seg2);
		dest[0] = '\0';
		strcat(dest, seg1);
		strcat(dest, seg2);
		dest[strlen(seg1) + strlen(seg2)] = '\0';
	} else if(strlen(src) == 8) {
		char seg1[5];
		char seg2[5];
		substr(src, seg1, 0, 4);
		substr(src, seg2, 4, 4);
		lietal_formalsegstr(seg1, seg1);
		lietal_formalsegstr(seg2, seg2);
		dest[0] = '\0';
		strcat(dest, seg1);
		strcat(dest, seg2);
		dest[strlen(seg1) + strlen(seg2)] = '\0';
	}
	return dest;
}
