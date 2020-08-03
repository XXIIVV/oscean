#!/bin/bash

clang-format -i main.c
clang-format -i helpers.c

# Linux
cc -std=c89 -DDEBUG -Wall -Wpedantic -Wshadow -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -Wvla -g -Og -fsanitize=address -fsanitize=undefined main.c -o main

# RPi
# tcc -Wall main.c -o main

# Plan9
# pcc main.c -o main

rm ../site/*

./main

rm ./main
