#!/bin/sh -e

rm -f bin/oscean.rom
rm -rf ../site
mkdir ../site

uxnasm oscean.tal bin/oscean.rom
uxncli bin/oscean.rom
