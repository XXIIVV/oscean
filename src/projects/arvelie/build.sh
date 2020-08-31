#!/bin/bash

clang-format -i arvelie.c
clang-format -i main.c

# cc -std=c89 -DDEBUG -Wall -Wpedantic -Wshadow -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -Wvla -g -Og -fsanitize=address -fsanitize=undefined main.c -o arvelie
tcc -Wall main.c -o arvelie

echo "Valid:"
./arvelie
./arvelie 1986-03-22
./arvelie 19Q13

echo "Errors:"
./arvelie 2020-04-AG
./arvelie 20@10
./arvelie 20A15
