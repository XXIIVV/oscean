#!/bin/sh -e

# Setup

mkdir -p bin

# Cleanup

rm -rf ../site
mkdir ../site

# Projects

if [ "${1}" = '--projects' ]; 
then
	clang-format -i projects/marbles/marbles.c
	rm -f ./bin/marbles
	cc projects/marbles/marbles.c -std=c89 -Os -DNDEBUG -g0 -s -Wall -Wno-unknown-pragmas -o bin/marbles
	./bin/marbles inc/html/death.htm
fi

# Linux

if [ "${1}" = '--system' ]; 
then
	clang-format -i main.c
	rm -f ./bin/oscean
	cc -std=c89 -DDEBUG -Wall -Wno-unknown-pragmas -Wpedantic -Wshadow -Wuninitialized -Wextra -Werror=implicit-int -Werror=incompatible-pointer-types -Werror=int-conversion -Wvla -g -Og -fsanitize=address -fsanitize=undefined main.c -o bin/oscean
fi

# Pack tables

cat database/journal1115.tbtl  \
	database/journal0610.tbtl  \
	database/journal0005.tbtl > database/journal.tbtl

cat database/meta.ndtl         \
	database/audio.ndtl        \
	database/visual.ndtl       \
	database/research.ndtl     \
	database/about.ndtl        \
	database/travel.ndtl       \
	database/software.ndtl     \
	database/neauismetica.ndtl \
	database/mirrors.ndtl > database/lexicon.ndtl

# Run

./bin/oscean

# Clean

rm database/journal.tbtl
rm database/lexicon.ndtl