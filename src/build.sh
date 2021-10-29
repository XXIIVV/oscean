#!/bin/sh -e

rm -f bin/oscean.rom
rm -rf ../site
mkdir -p ../site
mkdir -p bin

uxnasm oscean.tal bin/oscean.rom
uxncli bin/oscean.rom
