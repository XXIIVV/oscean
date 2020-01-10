# Oscean

This is the repository for the [Oscean wiki](http://wiki.xxiivv.com/), see the [on-site documentation](http://wiki.xxiivv.com/About) for more up-to-date details. Oscean is a _static site_ written in [C99](https://en.wikipedia.org/wiki/C99).

The Master Branch is the **live version**.

## Build

```
cd src/
./build
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
