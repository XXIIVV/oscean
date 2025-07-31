#!/bin/sh -e

uxnasm ../format-js.tal.txt format-js.rom
uxnasm ../thue.tal.txt thue
uxncli format-js.rom thue > src/thue.js

rm -f format-js.rom thue
rm -f format-js.rom.sym thue.sym
