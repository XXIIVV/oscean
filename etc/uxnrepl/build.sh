#!/bin/sh -e

uxnasm ../format-js.tal.txt format-js.rom
uxnasm ../drifloon.tal.txt assembler
uxncli format-js.rom assembler > src/asm.js

rm -f format-js.rom assembler
rm -f format-js.rom.sym assembler.sym
