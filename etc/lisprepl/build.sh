#!/bin/sh -e

uxncli ~/roms/drifblim.rom ../format-js.tal.txt format-js.rom
uxncli ~/roms/drifblim.rom ../heol.tal.txt heol
uxncli format-js.rom heol > src/heol.js

rm -f format-js.rom heol
rm -f format-js.rom.sym heol.sym
