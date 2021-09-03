#!/bin/bash

clang-format -i lietal.c
clang-format -i main.c

cc -std=c99 -DDEBUG -Wall -Wpedantic -Wshadow -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -Wvla -g -Og -fsanitize=address -fsanitize=undefined main.c -o ../../bin/lietal
# tcc -Wall main.c -o lietal

../../bin/lietal li lili lila liri lira dalili dalila daliri dalira dadalili dadolila dakaliri dakolira lilitala

../../bin/lietal tato tava lave losorari fari
