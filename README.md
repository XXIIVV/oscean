# Oscean

This is the repository for the [Oscean wiki](http://wiki.xxiivv.com/), see the [on-site documentation](http://wiki.xxiivv.com/About) for more up-to-date details. Oscean is a _static site_ written in [ANSI C](https://en.wikipedia.org/wiki/ANSI_C) designed to be built with Plan9's `pcc` compiler. The database tables are in the human-readable plaintext [ndtl](https://wiki.xxiivv.com/site/indental.html)/[tbtl](https://wiki.xxiivv.com/site/tablatal.html). The lexicon body uses a [simple markup language](https://wiki.xxiivv.com/site/meta.html).

The Master Branch is the **live version**.

## Build

```
cd src/
time ./build.sh
```

### Haste

Oscean can be compiled with the [Tiny C Compiler](https://bellard.org/tcc/) in about 7 milliseconds.

```
tcc main.c -o main
```

## Twtxt

[twtxt](https://github.com/buckket/twtxt) is a format specification for self-hosted flat file based microblogging, you can find my feed [here](https://raw.githubusercontent.com/XXIIVV/Oscean/master/twtxt.txt). Oscean is part of the [webring's Hallway](https://webring.xxiivv.com/hallway.html) decentralized forum.

The command line operation to append to the twtxt.txt file:

```
echo -e "`date +%FT%T%:z`\tMESSAGE!" >> twtxt.txt
```

## Extras

- Pull Requests are welcome.
- See the [License](LICENSE) file for license rights and limitations(MIT), the media assets are [BY-NC-SA 4.0](http://wiki.xxiivv.com/About).

<img src='https://github.com/XXIIVV/Oscean/blob/master/media/identity/logo.crest.png?raw=true' width='200'/>
