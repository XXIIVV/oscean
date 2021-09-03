#!/bin/sh -e

rm -rf ../site
mkdir ../site

uxnasm oscean.tal bin/oscean.rom
uxncli bin/oscean.rom
