#!/bin/sh -e

uxnasm ../format-js.tal.txt format-js.rom
uxnasm ../heol.tal.txt heol
uxncli format-js.rom heol > src/heol.js

rm -f format-js.rom heol
rm -f format-js.rom.sym heol.sym
