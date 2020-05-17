#!/bin/bash

echo "Build Starting.."

cc -std=c99 -DDEBUG -Wall -Wpedantic -Wshadow -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -g -Og -fsanitize=address -fsanitize=undefined main.c -o arvelie

echo "today:"
./arvelie

./arvelie 02A01
./arvelie 2002-01-01
./arvelie 01D07
./arvelie 2001-02-18
./arvelie 13B12
./arvelie 2013-01-26
./arvelie 02E07
./arvelie 2002-03-04
./arvelie 24C01
./arvelie 2024-01-29
./arvelie 03+01
./arvelie 2003-12-31

echo "error:"
./arvelie 2020-04-03423