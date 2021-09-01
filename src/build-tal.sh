#!/bin/sh -e

uxnasm main.tal bin/oscean.rom
uxncli bin/oscean.rom
