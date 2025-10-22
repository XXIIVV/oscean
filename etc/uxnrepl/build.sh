#!/bin/sh -e

uxncli ~/roms/drifblim.rom ../format-js.tal.txt format-js.rom
uxncli ~/roms/drifblim.rom ../drifloon.tal.txt assembler
uxncli format-js.rom assembler > src/asm.js

rm -f format-js.rom assembler
rm -f format-js.rom.sym assembler.sym
