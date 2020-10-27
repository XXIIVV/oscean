#include <stdio.h>
#include <time.h>

#include "../../helpers.h"
#include "arvelie.h"

int
error(char* msg, char* val)
{
	printf("Error: %s(%s)\n", msg, val);
	return 1;
}

int
main(int argc, char* argv[])
{
	if(argc > 1) {
		if(slen(argv[1]) == 10)
			print_arvelie_from_ymdstr(argv[1]);
		else if(slen(argv[1]) == 5)
			print_ymdstr_from_arvelie(argv[1]);
		else if(slen(argv[1]) == 7)
			print_ymdstr_from_full_arvelie(argv[1]);
		else {
			return error("Misformatted Input", "");
		}
	} else {
		print_arvelie();
	}
	return 0;
}
