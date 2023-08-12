DIR=~/roms
ASM=uxncli ${DIR}/drifblim.rom
LIN=uxncli ${DIR}/uxnlin.rom
EMU=uxncli

all: bin/maeve.rom bin/oscean.rom bin/arvelie.rom bin/directory.rom

clean:
	@ rm -f bin/oscean.rom bin/oscean.rom.sym bin/maeve.rom bin/maeve.rom.sym bin/arvelie.rom bin/arvelie.rom.sym && rm -f tmp/* && rm -f site/*
lint:
	@ ${LIN} src/oscean.tal && ${LIN} src/maeve.tal && ${LIN} src/arvelie.tal
run: step1 step2 step3 time

bin/maeve.rom: src/maeve.tal
	@ mkdir -p bin && ${ASM} src/maeve.tal bin/maeve.rom
bin/oscean.rom: src/oscean.tal
	@ ${ASM} src/oscean.tal bin/oscean.rom
bin/arvelie.rom: src/arvelie.tal
	@ ${ASM} src/arvelie.tal bin/arvelie.rom
bin/directory.rom: src/directory.tal
	@ ${ASM} src/directory.tal bin/directory.rom

.PHONY: all clean lint run step1 step2 step3 time

step1: bin/maeve.rom
	@ mkdir -p tmp && rm -f tmp/* && ${EMU} bin/maeve.rom
step2: bin/oscean.rom
	@ mkdir -p site && rm -f site/* && ${EMU} bin/oscean.rom
step3: bin/directory.rom
	@ ${EMU} bin/directory.rom docs/ && ${EMU} bin/directory.rom etc/
time: bin/arvelie.rom
	@ ${EMU} bin/arvelie.rom
