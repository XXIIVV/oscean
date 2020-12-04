#!/bin/bash

# Clean
rm -f standard

# Lint
clang-format -i main.c

# Build(debug)
cc -std=c89 -DDEBUG -Wall -Wpedantic -Wshadow -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -Wvla -g -Og -fsanitize=address -fsanitize=undefined main.c -o standard

# Run
./standard
