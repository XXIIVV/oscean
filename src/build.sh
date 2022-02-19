#!/bin/sh -e

rm -rf bin
mkdir -p bin

# Pre-process

rm -rf tmp
mkdir -p tmp
uxnasm maeve.tal bin/maeve.rom
uxncli bin/maeve.rom

# Create 

rm -rf ../site
mkdir -p ../site
uxnasm oscean.tal bin/oscean.rom
uxncli bin/oscean.rom
