#!/bin/sh -e

ASM="uxncli $HOME/roms/drifblim.rom"
LIN="uxncli $HOME/roms/uxnlin.rom"

if [[ "$*" == *"--lint"* ]]
then
	echo "Linting.."
	$LIN src/maeve.tal
	$LIN src/oscean.tal
	$LIN src/arvelie.tal
	$LIN src/calendar.tal
fi

echo "Assembling -------------------"
rm -rf bin
mkdir -p bin
$ASM src/maeve.tal bin/maeve.rom
$ASM src/oscean.tal bin/oscean.rom
$ASM src/arvelie.tal bin/arvelie.rom
$ASM src/calendar.tal bin/calendar.rom

echo "Parsing ----------------------"
rm -rf tmp
mkdir -p tmp
uxncli bin/calendar.rom
uxncli bin/maeve.rom

echo "Building ---------------------"
rm -rf site
mkdir -p site
uxncli bin/oscean.rom
uxncli bin/arvelie.rom

