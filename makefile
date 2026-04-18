DIR=~/roms
EMU=uxncli
BAL=uxnbal
ASM=${EMU} ${DIR}/drifblim.rom
LIN=${EMU} ${DIR}/uxnlin.rom

run: bin/oscean.rom bin/arvelie.rom bin/directory.rom bin/img.rom repl
	@ mkdir -p tmp && rm -f tmp/*
	@ mkdir -p site && rm -f site/*
	@ ${EMU} bin/oscean.rom
	@ ${EMU} bin/img.rom > links/img.xml
	@ ${EMU} bin/directory.rom docs/
	@ ${EMU} bin/directory.rom etc/
	@ ${EMU} bin/arvelie.rom
clean:
	@ rm -f bin/* && rm -fr tmp/* && rm -f site/*
bal:
	@ ${BAL} src/oscean.tal
lint:
	@ ${LIN} src/oscean.tal
	@ ${LIN} src/arvelie.tal
	@ ${LIN} src/directory.tal
	@ ${LIN} src/img.tal
push:
	@ git commit -am '*'
	@ git push
grab:
	@ mkdir -p etc/uxn5
	@ cp -r ../uxn5/index.html ../uxn5/src/ ../uxn5/media/ etc/uxn5/
	@ mkdir -p etc/solrela
	@ cp -r ../solrela/index.html ../solrela/src/ ../solrela/media/ etc/solrela/

repl: etc/uxnrepl/src/asm.js etc/rejoicerepl/src/rejoice.js etc/lisprepl/src/heol.js etc/thuerepl/src/thue.js etc/neurrepl/src/neur.js etc/modalrepl/src/modal.js

.PHONY: run clean bal lint push grab

bin/oscean.rom: src/oscean.tal
	@ ${ASM} src/oscean.tal bin/oscean.rom
bin/arvelie.rom: src/arvelie.tal
	@ ${ASM} src/arvelie.tal bin/arvelie.rom
bin/directory.rom: src/directory.tal
	@ ${ASM} src/directory.tal bin/directory.rom
bin/img.rom: src/img.tal
	@ ${ASM} src/img.tal bin/img.rom

# Repls

bin/format-js.rom: etc/format-js.tal.txt
	@ ${ASM} etc/format-js.tal.txt bin/format-js.rom
etc/uxnrepl/src/asm.js: bin/format-js.rom etc/drifloon.tal.txt
	@ ${ASM} etc/drifloon.tal.txt assembler
	@ uxncli bin/format-js.rom assembler > etc/uxnrepl/src/asm.js
	@ rm -f assembler assembler.sym
etc/rejoicerepl/src/rejoice.js: bin/format-js.rom etc/rejoice.tal.txt
	@ ${ASM} etc/rejoice.tal.txt rejoice
	@ uxncli bin/format-js.rom rejoice > etc/rejoicerepl/src/rejoice.js
	@ rm -f rejoice rejoice.sym
etc/lisprepl/src/heol.js: bin/format-js.rom etc/heol.tal.txt
	@ ${ASM} etc/heol.tal.txt heol
	@ uxncli bin/format-js.rom heol > etc/lisprepl/src/heol.js
	@ rm -f heol heol.sym
etc/thuerepl/src/thue.js: bin/format-js.rom etc/thue.tal.txt
	@ ${ASM} etc/thue.tal.txt thue
	@ uxncli bin/format-js.rom thue > etc/thuerepl/src/thue.js
	@ rm -f thue thue.sym
etc/neurrepl/src/neur.js: bin/format-js.rom etc/neur.tal.txt
	@ ${ASM} etc/neur.tal.txt neur
	@ uxncli bin/format-js.rom neur > etc/neurrepl/src/neur.js
	@ rm -f neur neur.sym
etc/modalrepl/src/modal.js: bin/format-js.rom etc/modal.tal.txt
	@ ${ASM} etc/modal.tal.txt modal
	@ uxncli bin/format-js.rom modal > etc/modalrepl/src/modal.js
	@ rm -f modal modal.sym
