#!/bin/bash

echo "cleanup.."

rm ../site/*

echo "building.."

cc -std=c99 -DDEBUG -Wall -Wpedantic -Wshadow -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -g -Og -fsanitize=address -fsanitize=undefined main.c -o main

echo "running.."

./main

echo "finish.."

rm ./main