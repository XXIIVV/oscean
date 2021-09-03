#!/bin/sh -e

rm -rf ../site
mkdir ../site

uxnasm main.tal bin/oscean.rom
uxncli bin/oscean.rom
