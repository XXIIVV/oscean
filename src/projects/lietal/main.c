#include <stdio.h>
#include <stdlib.h>

#include "lietal.c"

void
fillstr(char* src, char* dest, int limit, char character)
{
	int i;
	for(i = strlen(src); i < limit; ++i) {
		dest[i] = character;
	}
	dest[limit] = '\0';
}

void
print_lietal_table(int len, char* words[])
{
	int i;
	printf("| Dict     | Adult    | Formal   | Mixed    | Casual   |\n");
	printf("| -------- | -------- | -------- | -------- | -------- |\n");
	for(i = 1; i < len; ++i) {
		char dictionary_form[9];
		char adult_form[9];
		char casual_form[9];
		char mixed_form[9];
		char formal_form[9];
		lietal_dictionarystr(words[i], dictionary_form);
		lietal_adultstr(words[i], adult_form);
		lietal_casualstr(words[i], casual_form);
		lietal_mixedstr(words[i], mixed_form);
		lietal_formalstr(words[i], formal_form);
		fillstr(dictionary_form, dictionary_form, 8, ' ');
		fillstr(adult_form, adult_form, 8, ' ');
		fillstr(formal_form, formal_form, 8, ' ');
		fillstr(mixed_form, mixed_form, 8, ' ');
		fillstr(casual_form, casual_form, 8, ' ');
		printf("| %s | %s | %s | %s | %s |\n", dictionary_form, adult_form,
		       formal_form, mixed_form, casual_form);
	}
}

int
main(int argc, char* argv[])
{
	if(argc > 1) {
		print_lietal_table(argc, argv);
	} else {
		printf("Error: Missing input word\n");
	}
	return 0;
}
