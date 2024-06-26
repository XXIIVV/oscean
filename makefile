DIR=~/roms
ASM=uxncli ${DIR}/drifblim.rom
LIN=uxncli ${DIR}/uxnlin.rom
EMU=uxncli

all: bin/maeve.rom bin/oscean.rom bin/arvelie.rom bin/directory.rom bin/marbles.rom

clean:
	@ rm -f bin/* && rm -f tmp/* && rm -f site/*

lint:
	@ ${LIN} src/oscean.tal
	@ ${LIN} src/maeve.tal
	@ ${LIN} src/arvelie.tal
	@ ${LIN} src/directory.tal
	@ ${LIN} src/marbles.tal

run: all
	@ mkdir -p tmp && rm -f tmp/* && ${EMU} bin/maeve.rom
	@ mkdir -p site && rm -f site/* && ${EMU} bin/oscean.rom
	@ ${EMU} bin/directory.rom docs/ 
	@ ${EMU} bin/directory.rom etc/
	@ ${EMU} bin/arvelie.rom
	@ ${EMU} bin/marbles.rom

grab:
	@ mkdir -p etc/uxn5
	@ cp -r ../uxn5/index.html ../uxn5/src/ ../uxn5/pyur.svg etc/uxn5/

bin/maeve.rom: src/maeve.tal
	@ mkdir -p bin && ${ASM} src/maeve.tal bin/maeve.rom
bin/oscean.rom: src/oscean.tal
	@ ${ASM} src/oscean.tal bin/oscean.rom
bin/arvelie.rom: src/arvelie.tal
	@ ${ASM} src/arvelie.tal bin/arvelie.rom
bin/directory.rom: src/directory.tal
	@ ${ASM} src/directory.tal bin/directory.rom
bin/marbles.rom: src/marbles.tal
	@ ${ASM} src/marbles.tal bin/marbles.rom

.PHONY: all clean grab lint run
