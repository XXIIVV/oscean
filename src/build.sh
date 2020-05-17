#!/bin/bash

echo "Build Initial Cleanup.."

rm ../site/*

echo "Build Starting.."

cc -std=c99 -DDEBUG -Wall -Wpedantic -Wshadow -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -g -Og -fsanitize=address -fsanitize=undefined main.c -o main

echo "Build Running.."

./main

echo "Build Final Cleanup.."

rm ./main

./projects/arvelie/arvelie