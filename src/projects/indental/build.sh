#!/bin/bash

echo "Build Cleanup.."

rm ../site/*

echo "Build Starting.."
ts=$(date +%s%N)

cc -std=c99 -DDEBUG -Wall -Wpedantic -Wshadow -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -g -Og -fsanitize=address -fsanitize=undefined main.c -o main

echo "Build Running.."

./main 'lexicon.ndtl'

tt=$((($(date +%s%N) - $ts)/1000000)) ; echo "Build Completed in $tt ms"

rm ./main