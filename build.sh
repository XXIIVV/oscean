#!/bin/sh -e

ASM="uxncli $HOME/roms/drifblim.rom"
LIN="uxncli $HOME/roms/uxnlin.rom"

if [[ "$*" == *"--lint"* ]]
then
	$LIN src/maeve.tal
	$LIN src/oscean.tal
	$LIN src/arvelie.tal
fi

mkdir -p bin && rm bin/*

$ASM src/maeve.tal bin/maeve.rom
$ASM src/oscean.tal bin/oscean.rom
$ASM src/arvelie.tal bin/arvelie.rom

mkdir -p tmp && rm tmp/*
mkdir -p site && rm site/*

uxncli bin/maeve.rom
uxncli bin/oscean.rom
uxncli bin/arvelie.rom

