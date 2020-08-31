#include <stdio.h>
#include <stdlib.h>

#include "neralie.c"

int
main(int argc, char* argv[])
{
	if(argc > 1) {
		if(strlen(argv[1]) == 8) {
			print_neralie_from_hmsstr(argv[1]);
		} else if(strlen(argv[1]) == 7) {
			print_hmsstr_from_neralie(argv[1]);
		} else {
			printf("Error: Misformatted Time(HH:MM:SS)\n");
		}
	} else {
		print_neralie();
	}
	return 0;
}
