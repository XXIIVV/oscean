#!/bin/sh -e

uxncli ~/roms/drifblim.rom ../format-js.tal.txt format-js.rom
uxncli ~/roms/drifblim.rom ../rejoice.tal.txt rejoice
uxncli format-js.rom rejoice > src/rejoice.js

rm -f format-js.rom rejoice
rm -f format-js.rom.sym rejoice.sym
