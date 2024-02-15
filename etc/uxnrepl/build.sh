#!/bin/sh -e

cp ~/Git/drifblim/src/drifloon.tal etc/drifloon.tal

uxnasm etc/format-js.tal format-js.rom
uxnasm etc/drifloon.tal drifloon.rom
uxncli format-js.rom drifloon.rom > src/asm.js

rm *.rom
