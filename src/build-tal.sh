#!/bin/sh -e

rm -rf ../site-new
mkdir ../site-new

uxnasm main.tal bin/oscean.rom
uxncli bin/oscean.rom
