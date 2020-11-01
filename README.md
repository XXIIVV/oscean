# Oscean

This is the repository for the [Oscean wiki](http://wiki.xxiivv.com/), see the [on-site documentation](http://wiki.xxiivv.com/About) for more up-to-date details. Oscean is a _static site_ written in [ANSI C](https://en.wikipedia.org/wiki/ANSI_C), the database tables are in the human-readable plaintext [ndtl](https://wiki.xxiivv.com/site/indental.html)/[tbtl](https://wiki.xxiivv.com/site/tablatal.html). The lexicon body uses a [simple markup language](https://wiki.xxiivv.com/site/meta.html). The Master Branch is the **live version**.

## Build

Oscean can be compiled with the [Tiny C Compiler](https://bellard.org/tcc/), and Plan9's [POSIX Compiler](http://doc.cat-v.org/plan_9/4th_edition/papers/ape) in about 200 milliseconds on a Raspberry Pi.

```
tcc main.c -o main
pcc main.c -o main
```

### Debug

```
cd src/
time ./build.sh
```

## Twtxt

[twtxt](https://github.com/buckket/twtxt) is a format specification for self-hosted flat file based microblogging, you can find the generated feed [here](https://wiki.xxiivv.com/links/tw.txt). 

## Extras

- Pull Requests are welcome.
- See the [License](LICENSE) file for license rights and limitations(MIT), the media assets are [BY-NC-SA 4.0](http://wiki.xxiivv.com/About).

<img src='https://github.com/XXIIVV/Oscean/blob/master/media/identity/logo.crest.png?raw=true' width='200'/>
