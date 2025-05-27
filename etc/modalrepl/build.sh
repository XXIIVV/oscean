#!/bin/sh -e

uxnasm ../format-js.tal.txt format-js.rom
uxnasm ../modal.tal.txt modal
uxncli format-js.rom modal > src/modal.js

rm -f format-js.rom modal
rm -f format-js.rom.sym modal.sym
