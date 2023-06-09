#!/bin/sh -e

set -o nounset # Fails when accessing an unset variable.
set -o errexit # Exits if a command exits with a non-zero status.

roms_dir=${UXN_ROMS_DIR-"$HOME/roms"}
asm="uxncli $roms_dir/drifblim.rom"
emu="uxncli"
lin="uxncli $roms_dir/uxnlin.rom"
bal="uxncli $roms_dir/uxnbal.rom"

# https://git.sr.ht/~rabbits/uxnlin
case "$*" in *--lint*)
	$lin src/maeve.tal
	$lin src/oscean.tal
	$lin src/arvelie.tal
	$lin src/directory.tal
;; esac

case "$*" in *--bal*)
	# https://git.sr.ht/~rabbits/uxnbal
	$bal src/maeve.tal
	$bal src/oscean.tal
;; esac

mkdir -p bin && rm -f bin/*
mkdir -p tmp && rm -f tmp/*
mkdir -p site && rm -f site/*

$asm src/maeve.tal bin/maeve.rom
$asm src/oscean.tal bin/oscean.rom
$asm src/arvelie.tal bin/arvelie.rom
$asm src/directory.tal bin/directory.rom

$emu bin/maeve.rom
$emu bin/oscean.rom
$emu bin/arvelie.rom
$emu bin/directory.rom docs/

