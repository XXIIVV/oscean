#include <math.h>
#include <string.h>
#include <time.h>

/* helpers */
int ymd_to_doty(int y, int m, int d);
int doty_to_month(int doty);
int doty_to_day(int doty);

/* validators */
int is_valid_arvelie(char* date);
int is_valid_ymdstr(char* date);

/* converters */
int arvelie_to_doty(char* date);
int arvelie_to_epoch(char* date);
time_t arvelie_to_time(char* arvelie);
int get_epoch(void);
int extract_year(char* arvelie);

/* printers */
void print_ymdstr_from_doty(int y, int doty);
void print_arvelie_from_doty(int y, int doty);
void print_arvelie_from_time(time_t t);
void print_arvelie_from_ymdstr(char* date);
void print_ymdstr_from_arvelie(char* date);
void print_arvelie(void);