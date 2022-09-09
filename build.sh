#!/bin/sh -e

ASM="uxncli $HOME/roms/drifblim.rom"
LIN="uxncli $HOME/roms/uxnlin.rom"

if [[ "$*" == *"--lint"* ]]
then
	echo "Linting.."
	$LIN src/maeve.tal
	$LIN src/arvelie.tal
	$LIN src/oscean.tal
fi

echo "Assembling -------------------"
rm -rf bin
mkdir -p bin
$ASM src/arvelie.tal bin/arvelie.rom
$ASM src/maeve.tal bin/maeve.rom
$ASM src/oscean.tal bin/oscean.rom

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
	git add *
	git commit -m '*'
	git push
fi
