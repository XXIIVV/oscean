#!/bin/sh -e

echo "Assembling -------------------"
rm -rf bin
mkdir -p bin

if [ -e "$HOME/roms/uxnlin.rom" ]
then
	echo "Linting.."
	uxncli $HOME/roms/uxnlin.rom src/maeve.tal
	uxncli $HOME/roms/uxnlin.rom src/arvelie.tal
	uxncli $HOME/roms/uxnlin.rom src/oscean.tal
fi

uxncli ~/roms/drifblim.rom src/arvelie.tal bin/arvelie.rom
uxncli ~/roms/drifblim.rom src/maeve.tal bin/maeve.rom
uxncli ~/roms/drifblim.rom src/oscean.tal bin/oscean.rom

echo "Parsing ----------------------"
rm -rf tmp
mkdir -p tmp

uxncli bin/maeve.rom

echo "Building ---------------------"
rm -rf site
mkdir -p site
uxncli bin/oscean.rom
uxncli bin/arvelie.rom

if [ "${1}" = '--push' ];
then
	echo "Pushing.."
	git add * && git commit -m '*' && git push
fi
