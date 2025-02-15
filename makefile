DIR=~/roms
EMU=uxncli
ASM=${EMU} ${DIR}/drifblim.rom
LIN=${EMU} ${DIR}/uxnlin.rom

all: bin/maeve.rom bin/oscean.rom bin/arvelie.rom bin/directory.rom

clean:
	@ rm -f bin/* && rm -f tmp/* && rm -f site/*

lint:
	@ ${LIN} src/oscean.tal
	@ ${LIN} src/maeve.tal
	@ ${LIN} src/arvelie.tal
	@ ${LIN} src/directory.tal

run: all
	@ mkdir -p tmp && rm -f tmp/* && ${EMU} bin/maeve.rom
	@ mkdir -p site && rm -f site/* && ${EMU} bin/oscean.rom
	@ ${EMU} bin/directory.rom docs/ 
	@ ${EMU} bin/directory.rom etc/
	@ ${EMU} bin/arvelie.rom

push: all
	@ git commit -am '*'
	@ git push

grab:
	@ mkdir -p etc/uxn5
	@ cp -r ../uxn5/index.html ../uxn5/src/ ../uxn5/pyur.svg etc/uxn5/
	@ mkdir -p etc/solrela
	@ cp -r ../solrela/index.html ../solrela/src/ etc/solrela/

bin/maeve.rom: src/maeve.tal
	@ mkdir -p bin && ${ASM} src/maeve.tal bin/maeve.rom
bin/oscean.rom: src/oscean.tal
	@ ${ASM} src/oscean.tal bin/oscean.rom
bin/arvelie.rom: src/arvelie.tal
	@ ${ASM} src/arvelie.tal bin/arvelie.rom
bin/directory.rom: src/directory.tal
	@ ${ASM} src/directory.tal bin/directory.rom

.PHONY: all clean grab lint run
