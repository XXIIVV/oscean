#!/bin/sh -e

uxncli ~/roms/drifblim.rom ../format-js.tal.txt format-js.rom
uxncli ~/roms/drifblim.rom ../modal.tal.txt modal
uxncli format-js.rom modal > src/modal.js

rm -f format-js.rom modal
rm -f format-js.rom.sym modal.sym
