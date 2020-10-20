#!/bin/bash

clang-format -i main.c
clang-format -i helpers.h

# Linux
cc -std=c89 -DDEBUG -Wall -Wpedantic -Wshadow -Wuninitialized -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -Wvla -g -Og -fsanitize=address -fsanitize=undefined main.c -o oscean

# Linux(fast)
# cc main.c -std=c89 -Os -DNDEBUG -g0 -s -Wall -o oscean

# RPi
# tcc -Wall main.c -o oscean

# Plan9
# pcc main.c -o oscean

rm -rf ../site/
mkdir ../site

# Valgrind
# gcc -std=c89 -DDEBUG -Wall -Wpedantic -Wshadow -Wuninitialized -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -Wvla -g -Og main.c -o oscean
# valgrind ./oscean

./oscean

rm -f ./oscean
