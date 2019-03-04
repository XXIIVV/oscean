# Oscean

This is the repository for the [Oscean](http://wiki.xxiivv.com/) wiki engine, see [on-site documentation](http://wiki.xxiivv.com/About). Oscean uses the flow-based framework [Riven](https://github.com/XXIIVV/Riven), the routing graph can be seen [here](http://wiki.xxiivv.com/riven.html). The database formats are [Indental](https://wiki.xxiivv.com/Indental) and [Tablatal](https://wiki.xxiivv.com/Tablatal), their content uses the [Runic](https://wiki.xxiivv.com/Runic) templating format and [Heol](https://wiki.xxiivv.com/Heol) lisp.

The Master Branch is the **live version**, to see active tasks & issues, visit the [Issue Tracker](http://wiki.xxiivv.com/Oscean:tracker).

## Terminal

A series of tools are available through the Oscean search bar, begin a query with `~`(tilde) to input query, type `~help` to see available queries. This is used mostly to perform maintenance tasks.

For example, to test all lexicon entries for broken entries, type:

```
~walk
```

A compact version of the site and RSS feed can be generated with:

```
~static
~rss
```

## Syntax Highlight

The `Resources/` folder inclues syntax highlight for both [Indental](https://wiki.xxiivv.com/Indental) and [Tablatal](https://wiki.xxiivv.com/Tablatal), to install them on Sublime, copy them into `~/Library/Application Support/Sublime Text 3/Packages/User/`.

## Extras

- Pull Requests are welcome.
- See the [License](LICENSE) file for license rights and limitations(MIT).

<img src='https://github.com/XXIIVV/Oscean/blob/master/media/identity/logo.crest.png?raw=true' width='200'/>
