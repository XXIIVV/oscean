#include <stdio.h>
#include <stdlib.h>

#include "lietal.c"

char *
fillstr(char *src, char *dest, int limit, char character)
{
	int i;
	for(i = strlen(src); i < limit; ++i)
		dest[i] = character;
	dest[limit] = '\0';
	return dest;
}

void
print_lietal_table(int len, char *words[])
{
	int i;
	printf("| Child    | Casual   | Formal   |\n");
	printf("| -------- | -------- | -------- |\n");
	for(i = 1; i < len; ++i) {
		char dictionary_form[9], casual_form[9], formal_form[9];
		lietal_dictionarystr(words[i], dictionary_form);
		lietal_casualstr(words[i], casual_form);
		lietal_formalstr(words[i], formal_form);
		printf("| %s | %s | %s |\n",
			fillstr(dictionary_form, dictionary_form, 8, ' '),
			fillstr(casual_form, casual_form, 8, ' '),
			fillstr(formal_form, formal_form, 8, ' '));
	}
}

int
main(int argc, char *argv[])
{
	if(argc > 1) {
		print_lietal_table(argc, argv);
	} else {
		printf("Error: Missing input word\n");
	}
	return 0;
}
