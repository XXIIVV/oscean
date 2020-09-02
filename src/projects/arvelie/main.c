#include <stdio.h>
#include <stdlib.h>

#include "arvelie.h"

int
main(int argc, char* argv[])
{
	if(argc > 1) {
		if(strlen(argv[1]) == 10) {
			print_arvelie_from_ymdstr(argv[1]);
		} else if(strlen(argv[1]) == 5) {
			print_ymdstr_from_arvelie(argv[1]);
		} else {
			printf("Error: Misformatted Input\n");
			exit(0);
		}
	} else {
		print_arvelie();
	}
	return 0;
}
