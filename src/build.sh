#!/bin/bash

clang-format -i main.c
clang-format -i helpers.h

# Linux
cc -std=c89 -DDEBUG -Wall -Wpedantic -Wshadow -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -Wvla -g -Og -fsanitize=address -fsanitize=undefined -o main main.c

# Linux(errors?)
# cc main.c -std=c89 -Os -DNDEBUG -g0 -s -Wall -o main
# cc main.c -std=c89 -Os -DNDEBUG -g0 -s -Wall -Wpedantic -Wshadow -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -Wvla -fsanitize=undefined -o main

# RPi
# tcc -Wall main.c -o main

# Plan9
# pcc main.c -o main

rm -f ../site/*

./main

rm -f ./main
