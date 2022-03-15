#!/bin/sh -e

echo "Assembling -------------------"
rm -rf bin
mkdir -p bin
uxncli ~/roms/drifblim.rom maeve.tal
mv maeve.rom bin/
# uxnasm maeve.tal bin/maeve.rom
uxnasm oscean.tal bin/oscean.rom

echo "Parsing ----------------------"
rm -rf tmp
mkdir -p tmp
uxncli bin/maeve.rom

echo "Building ---------------------"
rm -rf ../site
mkdir -p ../site
uxncli bin/oscean.rom
