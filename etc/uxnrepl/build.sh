#!/bin/sh -e


uxnasm etc/format-js.tal format-js.rom
uxnasm etc/drifloon.tal drifloon.rom
uxncli format-js.rom drifloon.rom > src/asm.js

# mkdir -p bin
# uxnasm etc/format-js.tal bin/format-js.rom
# uxnasm etc/drifloon.tal bin/drifloon.rom
# uxncli bin/format-js.rom bin/drifloon.rom > src/asm.js

# uxnasm etc/palette.tal bin/res.rom
# uxncli bin/format-js.rom bin/res.rom
