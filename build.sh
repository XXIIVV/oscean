#!/bin/sh -e

set -o nounset # Fails when accessing an unset variable.
set -o errexit # Exits if a command exits with a non-zero status.

roms_dir=${UXN_ROMS_DIR-"$HOME/roms"}
asm="uxncli $roms_dir/drifblim.rom"
emu="uxncli"
lin="uxncli $roms_dir/uxnlin.rom"

case "$*" in *--lint*)
	$lin src/maeve.tal
	$lin src/oscean.tal
	$lin src/arvelie.tal
;; esac

mkdir -p bin && rm bin/*
mkdir -p tmp && rm tmp/*
mkdir -p site && rm site/*

$asm src/maeve.tal bin/maeve.rom
$asm src/oscean.tal bin/oscean.rom
$asm src/arvelie.tal bin/arvelie.rom

$emu bin/maeve.rom
$emu bin/oscean.rom
$emu bin/arvelie.rom
