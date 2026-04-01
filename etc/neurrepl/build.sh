#!/bin/sh -e

uxncli ~/roms/drifblim.rom ../format-js.tal.txt format-js.rom
uxncli ~/roms/drifblim.rom ../neur.tal.txt neur
uxncli format-js.rom neur > src/neur.js

rm -f format-js.rom neur
rm -f format-js.rom.sym neur.sym
