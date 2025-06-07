#!/bin/sh -e

uxnasm ../format-js.tal.txt format-js.rom
uxnasm ../neur.tal.txt neur
uxncli format-js.rom neur > src/neur.js

rm -f format-js.rom neur
rm -f format-js.rom.sym neur.sym
