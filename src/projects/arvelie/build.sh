#!/bin/bash

echo "Build Starting.."

cc -std=c99 -DDEBUG -Wall -Wpedantic -Wshadow -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -g -Og -fsanitize=address -fsanitize=undefined arvelie.c -o arvelie

echo "Build Running.."

./arvelie
./arvelie 2020-04-03