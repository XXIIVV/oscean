# Oscean

This is the repository for the [Oscean wiki](http://wiki.xxiivv.com/), see the [on-site documentation](http://wiki.xxiivv.com/site/about.html) for more up-to-date details. Oscean is a _static site_ written in [Uxntal](https://wiki.xxiivv.com/site/uxntal.html), a stack-machine assembly language designed for a [portable virtual machine](https://wiki.xxiivv.com/site/uxn.html). The database tables are stored as plain-text files designed to fit in Uxn's 64kb of memory. The `main` branch is the **live version**.

## Build

The `oscean.rom` file can be assembled with [uxnasm](https://git.sr.ht/~rabbits/uxn).

```sh
rm -rf bin
mkdir -p bin
uxnasm maeve.tal bin/maeve.rom # build pre-processor
uxnasm oscean.tal bin/oscean.rom # build wiki engine
```

The rom does not have a graphical interface, and can be used with the `uxncli` emulator:

```sh
rm -rf tmp
mkdir -p tmp
uxncli bin/maeve.rom
rm -rf ../site
mkdir -p ../site
uxncli bin/oscean.rom
```

## Extras

- Pull Requests are welcome.
- See the [License](LICENSE) file for license rights and limitations(MIT), the media assets are [BY-NC-SA 4.0](http://wiki.xxiivv.com/About).

<img src='https://wiki.xxiivv.com/media/identity/logo.crest.png' width='200'/>
