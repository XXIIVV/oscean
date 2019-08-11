# Oscean

This is the repository for the [Oscean wiki](http://wiki.xxiivv.com/), see the [on-site documentation](http://wiki.xxiivv.com/About) for more up-to-date details. Oscean is a static _dynamic site_ that uses [LISP](https://github.com/XXIIVV/Lain) as templating and markup language. The database formats are [Indental](https://wiki.xxiivv.com/Indental) and [Tablatal](https://wiki.xxiivv.com/Tablatal), the indental content also uses [Runic](https://wiki.xxiivv.com/Runic) as templating format.

The Master Branch is the **live version**, to see active tasks & issues, visit the [Issue Tracker](http://wiki.xxiivv.com/Oscean:tracker).

## Search Repl

A series of tools are available through the search bar, type `(add 5 6)` to see the resulting `11`, any search query starting with `(` will be interpreted. This is used mostly to perform maintenance tasks such as generating rss(`(services:rss)`), or to test all lexicon entries for broken entries(`(services:walk)`), or to convert Gregorian dates to [Arvelie](http://wiki.xxiivv.com/Arvelie)(`(gtoa 1986-03-22)`), etc..

### Run Benchmark

```
(join (interpreter:run projects:benchmark))
```

## Syntax Highlight

The `Resources/` folder inclues syntax highlight for both [Indental](https://wiki.xxiivv.com/Indental) and [Tablatal](https://wiki.xxiivv.com/Tablatal), to install them onto [Sublime](http://sublimetext.com), copy them into `~/Library/Application Support/Sublime Text 3/Packages/User/`.

## Lint

I use a special format for CSS and database formats, the linter cleans these files up a bit.

```
node resources/lint
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
