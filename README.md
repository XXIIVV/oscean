# Oscean

This is the repository for the [Oscean Wiki Engine](http://wiki.xxiivv.com/), see [on-site documentation](http://wiki.xxiivv.com/About). Oscean uses a **flow-based framework** called [Riven](https://github.com/XXIIVV/Riven), the routing graph can be seen [here](http://wiki.xxiivv.com/riven.html). 

The database formats are [Indental](https://wiki.xxiivv.com/Indental) and [Tablatal](https://wiki.xxiivv.com/Tablatal), their content uses the [Runic](https://wiki.xxiivv.com/Runic) templating format and [Heol LISP](https://wiki.xxiivv.com/Heol) as a **markup language**.

The Master Branch is the **live version**, to see active tasks & issues, visit the [Issue Tracker](http://wiki.xxiivv.com/Oscean:tracker).

## Terminal

A series of tools are available through the search bar, type `~help` to see available commands. This is used mostly to perform maintenance tasks such as generating rss(`~rss`), or to test all lexicon entries for broken entries(`~walk`). Utilities also exist to convert [Lietal](http://wiki.xxiivv.com/Lietal) words English(`~lien viro`), or to convert Gregorian dates to [Arvelie](http://wiki.xxiivv.com/Arvelie)(`~gtoa 1986-03-22`),

## Syntax Highlight

The `Resources/` folder inclues syntax highlight for both [Indental](https://wiki.xxiivv.com/Indental) and [Tablatal](https://wiki.xxiivv.com/Tablatal), to install them onto [Sublime](http://sublimetext.com), copy them into `~/Library/Application Support/Sublime Text 3/Packages/User/`.

## Twtxt

[twtxt](https://github.com/buckket/twtxt) is a format specification for self-hosted flat file based microblogging, you can find my feed [here](https://raw.githubusercontent.com/XXIIVV/Oscean/master/twtxt.txt). The command line operation to append to the twtxt.txt file:

```
echo -e "`date +%FT%T%:z`\tMESSAGE!" >> twtxt.txt
```

## Extras

- Pull Requests are welcome.
- See the [License](LICENSE) file for license rights and limitations(MIT), the media content is [BY-NC-SA 4.0](http://wiki.xxiivv.com/About).

<img src='https://github.com/XXIIVV/Oscean/blob/master/media/identity/logo.crest.png?raw=true' width='200'/>
