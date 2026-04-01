#!/bin/sh -e

uxncli ~/roms/drifblim.rom ../format-js.tal.txt format-js.rom
uxncli ~/roms/drifblim.rom ../thue.tal.txt thue
uxncli format-js.rom thue > src/thue.js

rm -f format-js.rom thue
rm -f format-js.rom.sym thue.sym
