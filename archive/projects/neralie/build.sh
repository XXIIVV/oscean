#!/bin/bash

clang-format -i neralie.c
clang-format -i main.c

# cc -std=c99 -DDEBUG -Wall -Wpedantic -Wshadow -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -Wvla -g -Og -fsanitize=address -fsanitize=undefined main.c -o neralie
tcc -Wall main.c -o neralie

echo "valid:"
./neralie
./neralie 12:34:56
./neralie 123:456

echo "errors:"
./neralie 12356
./neralie 12:345
