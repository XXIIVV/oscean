DIR=~/roms
EMU=uxncli
BAL=uxnbal
ASM=${EMU} ${DIR}/drifblim.rom
LIN=${EMU} ${DIR}/uxnlin.rom

run: bin/oscean.rom bin/arvelie.rom bin/directory.rom
	@ mkdir -p tmp && rm -f tmp/*
	@ mkdir -p site && rm -f site/*
	@ ${EMU} bin/oscean.rom
	@ ${EMU} bin/directory.rom docs/
	@ ${EMU} bin/directory.rom etc/
	@ ${EMU} bin/arvelie.rom
img: bin/img.rom
	@ ${EMU} bin/img.rom
clean:
	@ rm -f bin/* && rm -fr tmp/* && rm -f site/*
bal:
	@ ${BAL} src/oscean.tal
lint:
	@ ${LIN} src/oscean.tal
	@ ${LIN} src/arvelie.tal
	@ ${LIN} src/directory.tal
push:
	@ git commit -am '*'
	@ git push
grab:
	@ mkdir -p etc/uxn5
	@ cp -r ../uxn5/index.html ../uxn5/src/ ../uxn5/media/ etc/uxn5/
	@ mkdir -p etc/solrela
	@ cp -r ../solrela/index.html ../solrela/src/ ../solrela/media/ etc/solrela/

.PHONY: run clean bal lint push grab

bin/oscean.rom: src/oscean.tal
	@ ${ASM} src/oscean.tal bin/oscean.rom
bin/arvelie.rom: src/arvelie.tal
	@ ${ASM} src/arvelie.tal bin/arvelie.rom
bin/directory.rom: src/directory.tal
	@ ${ASM} src/directory.tal bin/directory.rom
bin/img.rom: src/img.tal
	@ ${ASM} src/img.tal bin/img.rom

